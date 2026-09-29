# yubiOS Architecture Overview: Immutable Image-Mode Linux with bootc, mkosi, and systemd

yubiOS is an immutable, bootc-delivered Linux OS that treats the owner's YubiKey 5 as the user-facing identity, unlock, and authorization boundary, built so that every layer is verified before it runs rather than trusted by provenance. The OS is delivered as a multi-arch OCI image, installed onto a discoverable-partitions disk layout, verified at boot through signed UKIs, dm-verity, and composefs fs-verity, and updated through atomic A/B upgrades with automatic rollback. The design goal is stated bluntly in the mission: an AI-resilient system where a poisoned contribution, wherever it came from, either fails verification or never had the authority to matter (https://github.com/yubi-OS/yubiOS/blob/main/docs/MISSION.md). This doc explains the architecture: image-mode delivery, the two build paths, the immutable root, first-boot provisioning, day-2 upgrades, and why immutability is the foundation of the security model.

## Why image mode

yubiOS follows the bootc design: the OCI container image is the unit of OS delivery, and day-2 upgrades are a registry pull followed by an atomic switch (https://github.com/yubi-OS/yubiOS/blob/main/README.md). This aligns with where the Fedora ecosystem is heading: the Fedora Image Mode Phase 2 (2026) initiative establishes bootc-derived OCI artifacts as first-class Fedora citizens, with all atomic (immutable) OS variants delivered as layered bootable OCI images (0.81) (https://fedoraproject.org/wiki/Initiatives/Image_Mode,_Phase_2_(2026)), and the bootc ecosystem drew dedicated conference tracks at DevConf.CZ and Flock to Fedora 2026 (0.81) (https://bootc.dev/blog/2026-jul-07-conference-talks-devconf-flock-2026/). Image mode inverts the classical model: instead of mutating a running system package by package, you build a new image, verify it, and atomically switch to it. That inversion is what makes the rest of yubiOS's trust chain enforceable.

## Two build paths, one overlay

yubiOS maintains both a mkosi path and a bootc path, sharing the same `usr/` overlay tree with identical runtime behavior (ADR-006, https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md):

- The mkosi path follows the particleos ethos: it builds a partitioned disk image (`Format=disk`, `SplitArtifacts=uki,partitions`) with a Unified Kernel Image and verity, and the UKI is signed at build time via systemd-sbsign with `SecureBoot=yes` and `SignExpectedPcr=no` (https://github.com/yubi-OS/yubiOS/blob/main/mkosi.conf).
- The bootc path builds the production OCI image from a `Containerfile`, deployable via `bootc install to-filesystem` (ADR-006, https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md).

The kernel command line is kept identical across both paths: `root=dissect mount.usr=dissect rw audit=0` is set in `mkosi.conf` and mirrored in the bootc install config, so both paths produce byte-identical kernel cmdlines at runtime (https://github.com/yubi-OS/yubiOS/blob/main/mkosi.conf, https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md, ADR-032). The published artifact is `docker.io/0mniteck/yubios` with `latest` plus immutable per-commit tags for `linux/amd64` and `linux/arm64`, each build shipping SLSA provenance and SBOM attestations (https://github.com/yubi-OS/yubiOS/blob/main/README.md).

## The immutable root: composefs and dm-verity

Every byte of `/usr` is validated on read by dm-verity, and every UKI is signed by a key on hardware the owner physically holds (https://github.com/yubi-OS/yubiOS/blob/main/docs/MISSION.md). The base is a digest-pinned `quay.io/fedora/fedora-bootc:45` image (https://github.com/yubi-OS/yubiOS/blob/main/PINNED.md). ADR-007 chooses composefs over a dm-verity-checked EROFS partition for the read-only root: composefs provides a cryptographically verified directory tree via fs-verity, the backing store is signed by systemd-repart's verity support, and the roothash is embedded in the UKI kernel command line at build time so tampering is detected before any userspace runs (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md). Composefs relies on fs-verity and the EROFS kernel driver to provide a read-only, integrity-checked mount (0.84) (https://ubos.tech/news/modernizing-linux-deployments-with-ostree-and-bootc/), and bootc systems follow the immutable-OS concept of separating read-only `/usr` from mutable `/var` (0.35) (https://docs.fedoraproject.org/en-US/bootc/getting-started/), symlinking the `/opt` parts that need persistence into `/var` where needed (0.54) (https://bootc.dev/bootc/filesystem.html).

The composefs storage model is precise: the physical sysroot stays a writable, fs-verity-capable filesystem such as ext4 (created with the `verity` feature) or Btrfs; composefs metadata-only EROFS images live under `/composefs/images/<digest>` with file content under `/composefs/objects` and deployment state under `/state/deploy`; a strict `composefs=<128-hex SHA-512 digest>` kernel argument (no optional `?` marker) anchors the deployment, and `--allow-missing-verity` is forbidden in production (https://github.com/yubi-OS/yubiOS/blob/main/refs/bootc-composefs-sealed-flow-2026-07-22.md). dm-verity and composefs are not the same mechanism: dm-verity authenticates a fixed block-device image and belongs to the mkosi/systemd-repart path, while native bootc composefs verifies individual files with fs-verity (https://github.com/yubi-OS/yubiOS/blob/main/refs/bootc-composefs-sealed-flow-2026-07-22.md). Version-sensitive: as of the 2026-07-22 note, the pinned Fedora 45 base carries bootc 1.16.3, and the sealed-UKI flow (kernel/rootfs split via `bootc container split-kernel-and-rootfs`, which first appears in bootc v1.16.4) is a gated promotion path, not yet a required production step (https://github.com/yubi-OS/yubiOS/blob/main/refs/bootc-composefs-sealed-flow-2026-07-22.md).

## First boot: repart, DPS, and enrollment

yubiOS follows the Discoverable Partitions Specification with no `/etc/fstab` (ADR-010, https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md), the "Fitting Everything Together" model of hermetic `/usr`, DPS partitions, first-boot `systemd-repart`, A/B sysupdate, and systemd-homed (https://github.com/yubi-OS/yubiOS/blob/main/README.md). ADR-012 ships a minimal disk image (ESP plus `/usr` A only); all remaining partitions are created and encrypted by systemd-repart running from the initrd on first boot, so the LUKS2 root key is generated on the target device and never exists on a build host or in transit. The live image is the installer: `dd` the shipped image to a USB stick and it is the installer. Factory reset is the inverse operation, erasing and recreating the state partitions with fresh keys (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md). On first boot, `yubiOS-enroll.service` walks through PIV slot 9c Secure Boot signing, FIDO2 hmac-secret disk encryption, `ed25519-sk` SSH resident keys, and pam-u2f registration, each step skippable and independently re-runnable (https://github.com/yubi-OS/yubiOS/blob/main/README.md).

## A/B atomic upgrades with automatic rollback

Updates are the most dangerous system operation, so ADR-013 uses systemd-sysupdate for A/B partition updates with Boot Assessment counters embedded in UKI filenames. Each update downloads 4 artifacts: the new `/usr` partition, its verity data partition, its PKCS#7 signature partition, and a new UKI into the ESP. The new UKI filename carries a boot counter (for example `yubiOS_0.9+3`); systemd-boot decrements the counter on each boot attempt, and if it reaches zero the entry is excluded and the system falls back to the previous version. On a successful boot, userspace calls `bootctl set-boot-good` to strip the counter and mark the entry permanently good; version selection is automatic via `strverscmp()` on partition labels and UKI filenames (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md, https://systemd.io/AUTOMATIC_BOOT_ASSESSMENT). Day-2 operations on the bootc path are the same shape: `bootc switch` and `bootc upgrade` pull a new OCI image and commit it atomically (https://github.com/yubi-OS/yubiOS/blob/main/README.md). Atomic updates with instant rollback are exactly the property bootc was built to deliver (0.89) (https://lucaberton.com/blog/bootc-immutable-linux-update-rollback-2026/).

## Why an immutable base matters

Three reasons, all sourced from the project's own doctrine:

1. **Verification replaces trust.** Nothing in yubiOS asks you to trust an author, human or machine. A digest-pinned base, an OPA/Rego build policy that rejects mutable tags, SLSA provenance plus SBOM attestations, dm-verity on `/usr`, and owner-held UKI signing mean a poisoned contribution fails verification instead of shipping (https://github.com/yubi-OS/yubiOS/blob/main/docs/MISSION.md, https://github.com/yubi-OS/yubiOS/blob/main/PINNED.md). Reproducibility is checked directly: `repro-production` and `repro-dev` modes perform two no-cache builds with separate BuildKit daemons and require the manifest, config, and layer bytes to match (https://github.com/yubi-OS/yubiOS/blob/main/README.md).
2. **Rollback de-risks updates.** An update that bricks the machine is a security failure as much as a reliability failure. A/B partitions plus Boot Assessment counters mean a bad update self-reverts before it can lock an owner out (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md).
3. **Auditable immutability is a mission non-negotiable.** "Immutable means auditable: `/usr` is verified; mutable state is explicit," and if a feature needs a security exception to exist, it gets cut (https://github.com/yubi-OS/yubiOS/blob/main/docs/MISSION.md).

The residual honesty note: the current bootc composefs install is classified as strict fs-verity plus an unsealed BLS entry, because the digest anchor still lives in mutable BLS configuration rather than a signed UKI command line; the sealed promotion gate requires signed UKI plus systemd-boot signatures, Secure Boot enabled on real hardware, and a negative tamper boot (https://github.com/yubi-OS/yubiOS/blob/main/refs/bootc-composefs-sealed-flow-2026-07-22.md).

## Sources considered

Used:
- https://github.com/yubi-OS/yubiOS/blob/main/README.md (primary repo)
- https://github.com/yubi-OS/yubiOS/blob/main/docs/MISSION.md (primary repo)
- https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md (primary repo)
- https://github.com/yubi-OS/yubiOS/blob/main/refs/bootc-composefs-sealed-flow-2026-07-22.md (primary repo)
- https://github.com/yubi-OS/yubiOS/blob/main/mkosi.conf (primary repo)
- https://github.com/yubi-OS/yubiOS/blob/main/PINNED.md (primary repo)
- https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md#adr-032 (kernel+rootfs split, via ADR.md)
- https://systemd.io/AUTOMATIC_BOOT_ASSESSMENT (cited by ADR-013)
- https://fedoraproject.org/wiki/Initiatives/Image_Mode,_Phase_2_(2026) (dig 0.81)
- https://bootc.dev/blog/2026-jul-07-conference-talks-devconf-flock-2026/ (dig 0.81)
- https://ubos.tech/news/modernizing-linux-deployments-with-ostree-and-bootc/ (dig 0.84)
- https://lucaberton.com/blog/bootc-immutable-linux-update-rollback-2026/ (dig 0.89)
- https://docs.fedoraproject.org/en-US/bootc/getting-started/ (dig 0.35)
- https://bootc.dev/bootc/filesystem.html (dig 0.54)
- https://github.com/bootc-dev/bootc/blob/v1.16.4/docs/src/man/bootc-install-to-filesystem.8.md (cited by sealed-flow note)

Rejected:
- https://www.bigiron.cc/guides/immutable-server-distros-2026-microos-vs-coreos-vs-bootc (aggregator, dig 0.15)
- https://news.ycombinator.com/item?id=47189625 (comment thread, dig 0.11)
- https://a-cup-of.coffee/blog/ostree-bootc/ (low weight blog, dig 0.23)
- https://cfp.fedoraproject.org/flock-to-fedora-2026/talk/3PHYFQ/ (talk listing, dig 0.27)
- https://docs.centos.org/automotive-sig-documentation/features-and-concepts/con_ostree/ (low weight, dig 0.29)
- https://ostreedev.github.io/ostree/composefs/ (superseded ostree-backend approach, dig 0.11)