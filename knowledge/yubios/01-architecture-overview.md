# yubiOS Architecture Overview: An Immutable Base

yubiOS is an immutable, bootc-delivered Linux OS that treats the owner's YubiKey 5 as the user-facing identity, unlock, and authorization boundary (https://github.com/yubi-OS/yubiOS/blob/main/README.md). Its mission is "to build AI resilient systems using AI": because the OS is heavily built and reviewed with AI assistance, every layer must be verified before it runs rather than trusted at authorship time (https://github.com/yubi-OS/yubiOS/blob/main/docs/MISSION.md). This doc covers the architecture of that immutability: image-mode Linux built from bootc and mkosi, the bootc + composefs and mkosi + systemd-repart lanes, the signed UKI boot chain, A/B atomic upgrades, the state split, and why an immutable base is the load-bearing wall of a security-focused OS.

## The four layers yubiOS composes

The README states the architecture as a composition of four designs (https://github.com/yubi-OS/yubiOS/blob/main/README.md):

1. **ParticleOS ethos** (systemd/particleos): immutable `/usr`, UKIs, dm-verity, composefs, systemd-boot.
2. **bootc design** (bootc-dev/bootc): an OCI container image as the OS delivery unit, with day-2 upgrades via registry pull.
3. **systemd image model** (Poettering's "Fitting Everything Together" essay, the project's primary design reference): Discoverable Partition Specification (DPS) partitions, systemd-repart first-boot partitioning, A/B sysupdate, systemd-homed per-user encryption.
4. **YubiKey owner-control plane** (FIDO2 / PIV / OATH): owner-held authorization for signing, unlock, SSH, PAM, and app 2FA.

The first three layers are exactly the modern image-mode Linux stack. Fedora's own Image Mode initiative treats bootc-derived OCI artifacts as first-class OS citizens (https://fedoraproject.org/wiki/Initiatives/Image_Mode,_Phase_2_(2026), weight 0.70), which is the ecosystem yubiOS draws its delivery model from.

## What "immutable" means here

In an image-mode OS the OS content lives entirely in `/usr`, mounted read-only and verified; the `ostree=` style kernel argument locates the deployment root at boot (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/managing-file-systems-in-image-mode-for-rhel, weight 0.83). bootc's filesystem contract is the same split: `/usr` immutable and machine-independent, `/var` carrying mutable state (https://bootc.dev/bootc/filesystem.html, weight 0.07).

yubiOS's mission document turns this into a security property: "Immutable means auditable. `/usr` is verified; mutable state is explicit" (https://github.com/yubi-OS/yubiOS/blob/main/docs/MISSION.md). Every byte of `/usr` is validated on read by dm-verity, and every UKI is signed by a key on hardware the owner physically holds (https://github.com/yubi-OS/yubiOS/blob/main/docs/MISSION.md).

## Two build lanes, one architecture

The repo carries both delivery models, and they are deliberately separate lanes:

**Bootc composefs lane.** yubiOS publishes a pre-launch multi-arch bootc OCI image on Docker Hub and installs it with `bootc install to-filesystem` onto a systemd-repart-created DPS layout (https://github.com/yubi-OS/yubiOS/blob/main/README.md). The composefs variant combines `to-filesystem` with the composefs backend: the physical sysroot stays a writable, fs-verity-capable filesystem (ext4 with the `verity` feature or Btrfs); EROFS is used only for composefs metadata images stored under `/composefs/images/<digest>`, with file content under `/composefs/objects` and deployment state under `/state/deploy`. Each file is verified by fs-verity, and the composefs digest (a 128-hex SHA-512 value) is bound into the signed UKI kernel command line, so an unsealed `composefs=?` reference is rejected by CI (https://github.com/yubi-OS/yubiOS/blob/main/refs/bootc-composefs-sealed-flow-2026-07-22.md). This is the composefs model originally proposed for OSTree: a signed, digest-addressed root composed from content-addressed objects (https://blogs.gnome.org/alexl/2022/06/02/using-composefs-in-ostree/, weight 0.66; https://travier.github.io/ostree/composefs/, weight 0.75). As of the 2026-07-22 note, CI workflow run 29884493346 proved a strict fs-verity composefs install with a traditional BLS entry; a sealed UKI promotion path was still gated because the pinned Fedora 45 base resolved to bootc 1.16.3 while `split-kernel-and-rootfs` first appears in bootc 1.16.4 (https://github.com/yubi-OS/yubiOS/blob/main/refs/bootc-composefs-sealed-flow-2026-07-22.md).

**Mkosi partitioned-image lane.** `mkosi.conf` describes itself as the "particleos ethos" lane and produces a disk image (`Format=disk`, `ImageId=yubiOS`, `SplitArtifacts=uki,partitions`) with a dissect-root kernel command line (`root=dissect`, `mount.usr=dissect`, `rw`) and build-time UKI signing (`SecureBoot=yes`) (https://github.com/yubi-OS/yubiOS/blob/main/mkosi.conf). The README's local build path compiles the pinned EDK2/StandaloneMM, OP-TEE/fTPM, TF-A, and U-Boot firmware sources and "builds and verifies the SoftHSM PKCS#11-signed mkosi UKI and disk payload" (https://github.com/yubi-OS/yubiOS/blob/main/README.md). Importantly, the two integrity models are not interchangeable: native bootc composefs verifies individual files with fs-verity, while dm-verity authenticates a fixed block-device image and belongs to the mkosi/systemd-repart path (https://github.com/yubi-OS/yubiOS/blob/main/refs/bootc-composefs-sealed-flow-2026-07-22.md).

## The boot and trust chain

The trust anchor is deliberately not a TPM. ADR-001 makes the YubiKey 5 the sole trust anchor because TPMs are OEM-controlled and can carry vendor keys the user never sees; ADR-002 signs Secure Boot UKIs with YubiKey PIV slot 9c via PKCS#11 and `systemd-sbsign` over CCID; ADR-003 uses LUKS2 with `systemd-cryptenroll --fido2-device=auto` for disk unlock, with no TPM slot (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md). A useful architectural consequence: FIDO2 enrollment does not bind to PCR hash values, so OS updates never require re-enrollment of disk unlock secrets, unlike TPM PCR policies that break on every kernel or initrd change (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md). The signed UKI is the pin that holds the rest together: the UKI command line binds the exact composefs digest, and boot assessment / sysupdate then selects between verified deployments (https://github.com/yubi-OS/yubiOS/blob/main/refs/bootc-composefs-sealed-flow-2026-07-22.md; https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md).

ARM64 is the primary platform because it is where yubiOS can own the firmware stack below the UKI: owner-provisioned board root, TF-A, OP-TEE, fTPM, U-Boot UEFI, systemd-boot, signed UKI, verified `/usr` (https://github.com/yubi-OS/yubiOS/blob/main/docs/MISSION.md; ADR-018 and ADR-021 in https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md). x86-64 remains supported above the UKI, but its firmware and optional TPM are OEM trust anchors (https://github.com/yubi-OS/yubiOS/blob/main/README.md).

## A/B atomic upgrades

Upgrades are atomic image swaps, not package mutations. The systemd image model gives A/B sysupdate (https://github.com/yubi-OS/yubiOS/blob/main/README.md), and ADR-016 names "A/B partition updates via systemd-sysupdate and Boot Assessment" as the baseline, while tracking systemd v261's live-update kexec handover (LUO/KHO) as a possible future server/appliance path rather than the default (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md). On the bootc side, day-2 updates are a registry pull of a new OCI image, and ADR-015 pins the base image by digest with `PINNED.md` as the live source of truth, never a mutable tag (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md). Build integrity is enforced before any layer runs: an OPA/Rego build policy rejects mutable tags, and builds ship SLSA provenance and SBOM attestations (https://github.com/yubi-OS/yubiOS/blob/main/docs/MISSION.md).

## Why an immutable base matters for a security-focused OS

Four reasons, all traceable in the repo:

1. **Verification becomes total, not sampled.** A mutable root can only be scanned for drift; a composefs/dm-verity root is checked on every read, so a poisoned file either fails verification or was never in the image (https://github.com/yubi-OS/yubiOS/blob/main/docs/MISSION.md).
2. **Rollback is free.** A/B deployments mean a bad update is a boot-selection choice, which matters for an OS whose unlock secrets deliberately survive updates without re-enrollment (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md).
3. **The trust chain ends at a digest.** Digest-pinned base images plus the signed UKI binding the composefs digest mean the entire running OS is answerable to two owner-verifiable artifacts (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md; https://github.com/yubi-OS/yubiOS/blob/main/refs/bootc-composefs-sealed-flow-2026-07-22.md).
4. **Supply-chain gates have something to gate.** The OPA/Rego build policy and provenance attestations only mean anything because the artifact they describe is the thing that boots, unchanged (https://github.com/yubi-OS/yubiOS/blob/main/docs/MISSION.md).

The broader ecosystem is converging on the same shape: image-mode Fedora, bootc, and OSTree deployment are all moving toward digest-addressed, verified roots (https://news.ycombinator.com/item?id=47189625, weight 0.69). yubiOS's differentiator is not the immutability itself but where the root of trust lives: with the owner's YubiKey, not with an OEM.

## Gaps

The exact current status of the sealed-UKI promotion gate (post 2026-07-22) and whether the pinned base now exposes bootc 1.16.4 capabilities was not re-verified for this doc; consult PINNED.md and the latest refs notes for live state.

## Sources considered

Used:
- https://github.com/yubi-OS/yubiOS/blob/main/README.md (primary)
- https://github.com/yubi-OS/yubiOS/blob/main/docs/MISSION.md (primary)
- https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md (primary)
- https://github.com/yubi-OS/yubiOS/blob/main/mkosi.conf (primary)
- https://github.com/yubi-OS/yubiOS/blob/main/refs/bootc-composefs-sealed-flow-2026-07-22.md (primary)
- https://fedoraproject.org/wiki/Initiatives/Image_Mode,_Phase_2_(2026) (jev 0.70)
- https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/managing-file-systems-in-image-mode-for-rhel (jev 0.83)
- https://bootc.dev/bootc/filesystem.html (jev 0.07)
- https://blogs.gnome.org/alexl/2022/06/02/using-composefs-in-ostree/ (jev 0.66)
- https://travier.github.io/ostree/composefs/ (jev 0.75)
- https://news.ycombinator.com/item?id=47189625 (jev 0.69)

Rejected:
- https://fedoraproject.org/wiki/Changes/DNFAndBootcInImageModeFedora (irrelevant, DNF5 packaging detail)
- https://www.mauromorales.com/posts/fedora-sivlerblue/ (anecdote, no yubiOS claim)
- https://bootc.dev/bootc/building/guidance.html (unused, image authoring guidance)
- https://bootc.dev/blog/2026-jul-07-conference-talks-devconf-flock-2026/ (event news, no architecture claim)
- https://bootc.dev/bootc/internals/bootc_lib/install/index.html (Rust internals, superseded by repo ref doc)
