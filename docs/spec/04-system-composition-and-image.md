# System composition, image and updates

**Scope line:** sections 4.1 to 4.3 and 4.6: the dual delivery format (bootc OCI plus mkosi disk image), the digest-pinned Fedora bootc base, the policy-gated build, the DPS partition layout, A/B updates with Boot Assessment, and the hardening baseline with version floors.

Grounding spine: `yubi-OS/yubiOS docs/SPEC.md` (source doc). External mechanisms carry their own URL and jev weight below.

## Image and delivery

The spec ships yubiOS in 2 formats that MUST behave identically at runtime (ADR-006) (source doc):

1. **Bootc OCI image** (primary): `docker.io/0mniteck/yubios`, multi-arch amd64 plus arm64, tagged `:latest` plus an immutable `:<commit-sha>` tag.
2. **mkosi disk image**: particleos-style UKI plus verity, built with `mkosi --profile yubios`.

Both consume the same `usr/` overlay tree (source doc). Upstream, bootc is described as "transactional, in-place operating system updates using OCI/Docker container images" (https://docs.fedoraproject.org/en-US/bootc/getting-started/, jev weight 0.12, weak; https://bootc.dev/bootc/, jev weight 0.18, weak), which is the mechanism behind the `bootc upgrade` day-2 entry point the spec names.

The base is `quay.io/fedora/fedora-bootc:45`, digest-pinned, and the current digest lives in PINNED.md only (ADR-015) (source doc). The "only" matters: the spec refuses to state the digest inline, forcing every consumer through the pinned record so there is exactly one place to audit.

The build is rootless Docker Buildx with `--policy reset=true,strict=true,filename=yubiOS.rego` and provenance plus SBOM attestations (`--attest type=provenance,mode=max --attest type=sbom`) (ADR-014) (source doc). The OPA/Rego policy gate runs before any layer executes, which is the supply-chain half of design principle 6.

## Partition layout

Section 4.2 enumerates the partition set under the Discoverable Partitions Specification (DPS), with no /etc/fstab (source doc). The shipped image contains 4 partitions:

1. ESP.
2. /usr A (erofs, read-only, verity).
3. /usr A verity.
4. /usr A sig (PKCS#7 signature).

Created on first boot by systemd-repart are 6 more: the /usr B set (partitions 5 to 7), root LUKS2 btrfs sized to disk (8), home (9), and encrypted swap (10). All partitions carry DPS type UUIDs; mount discovery is systemd-gpt-auto-generator only (ADR-010/012) (source doc).

Two normative details stand out. First, the A/B symmetry is built into the partition roles: /usr A ships signed and read-only, /usr B is created empty for updates to fill. Second, "Root fs keys are generated on the target device at first boot and MUST NOT exist on the build host" (ADR-012) (source doc), which removes an entire class of build-host key exfiltration by construction.

## Updates

Updates are A/B via systemd-sysupdate plus Boot Assessment counters (source doc). The naming scheme is `yubiOS_0.y+3` UKI filenames, and health is recorded with `bootctl set-boot-good` only after verified health. Rollback is automatic when the counter exhausts. `bootc upgrade` is the day-2 entry point (ADR-013) (source doc).

Upstream, Automatic Boot Assessment is systemd's mechanism for "automatically reverting back to the previous version of the OS or kernel in case the system consistently fails to boot" (https://systemd.io/AUTOMATIC_BOOT_ASSESSMENT/, jev weight 0.15, weak), and systemd-sysupdate provides the atomic A/B update mechanism (https://deepwiki.com/systemd/systemd/4.3-system-update-with-systemd-sysupdate, jev weight 0.13, weak). The `yubiOS_0.y+3` filename encodes the +3 attempt counter that the upstream boot-assessment scheme counts down before reverting.

The update property that matters most is normative: "Updates MUST NOT require FIDO2 re-enrollment" (ADR-011) (source doc). This is design principle 4 made testable. Because the disk keys bind to the YubiKey rather than to measured state, an update cannot orphan the disk enrollment.

## Hardening baseline

Section 4.6 sets the per-service hardening baseline (source doc). Service units ship with:

- `NoNewPrivileges=`
- `DynamicUser=`
- `ProtectProc=invisible`
- `RestrictFileSystems=` (BPF LSM, v261)
- `PrivateNetwork=` / `BindNetworkInterface=` where applicable

Kernel lockdown is active under Secure Boot. The version floors are: systemd at least 261, YubiKey firmware at least 5.2.3, OpenSSH at least 8.2, and pam-u2f at least 1.3.1 (source doc). The floors are the hardware-software contract the spec itself acknowledges in its out-of-scope section: hardware that cannot satisfy them is unsupported.

## What this section fixes for operators

The composition section is where the abstract trust model becomes concrete artifacts. An operator can audit 3 things directly from it: the exact base digest via PINNED.md, the build gate via yubiOS.rego and the attestations, and the rollback behavior via the Boot Assessment counter scheme. Every one of those has a corresponding conformance checklist point (section 7, points 1, 5, and 7), so a claim of conformance is checkable against the artifacts this section names.
