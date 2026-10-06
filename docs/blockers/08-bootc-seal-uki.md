# 08 - bootc Sealed UKI (B-BOOTC-SEAL)

Scope: the artifact split that shipped (signed UKI as a separate OCI artifact), the install-time BLSConfig wiring gap in bootc 1.16.3, and the Secure Boot plus negative-tamper-boot gate that remains.

Grounding spine: source doc `yubi-OS/yubiOS docs/BLOCKERS.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/BLOCKERS.md), row B-BOOTC-SEAL.

## The blocker as stated

B-BOOTC-SEAL is the register's longest row, and its Phase 1 is already shipped (source doc):

- The pre-built PKCS#11-signed UKI is published as a separate OCI artifact, `docker.io/0mniteck/yubios:uki-<sha>-<arch>`, per ADR-022 and ADR-032, alongside the bootc `latest`/`<sha>` rootfs image.
- PR #143 (commit a1940330, merged 2026-07-29) closed OMN-51 and the artifact-split half of the blocker.
- New files from that PR: `Containerfile.uki`, `usr/lib/yubiOS/uki/install-uki.sh`, `refs/kernel-rootfs-split-2026-07-29.md`; modified: `yubiOS-bake.hcl` (new `yubios-uki` target), `usr/lib/bootc/install/50-yubiOS.toml` (added `[install] kargs`), `docs/ADR.md` (ADR-032 appended), and `docs/BLOCKERS.md` (this row).

What remains is Phase 2: install-time BLSConfig wiring so the pre-built UKI is selected at install instead of the bootc-auto-generated UKI, because bootc 1.16.3 has no project-authored BLSConfig drop-in intake (source doc). Also still open: prove Secure Boot on amd64 and arm64, retain negative tamper-boot evidence, and decide between a bootc-side patch (option A) or a fedora-bootc v1.16.4+ bump (option C) (source doc).

## The kernel-rootfs split model

The blocker's architecture is the bootc split-kernel-and-rootfs model. bootc upstream describes the foundation: bootable host systems using standard OCI/Docker containers as the transport and delivery format for base OS updates, with the container image including a Linux kernel in `/usr/lib/modules` that is used to boot (source: https://github.com/bootc-dev/bootc, jev weight 0.71). The dedicated command for the split is documented as `bootc-container-split-kernel-and-rootfs` in its man page (source: https://www.mankier.com/8/bootc-container-split-kernel-and-rootfs, jev weight 0.21, weak backing, cited only to name the command shape). Fedora's bootc documentation explains why splitting matters for integrity: Fedora/CentOS bootc enables composefs for the root filesystem by default, though in "unsigned" mode; when targeting a filesystem with fs-verity enabled, fs-verity is turned on (source: https://docs.fedoraproject.org/en-US/bootc/filesystem/, jev weight 0.87).

## What a UKI is and what signing buys

A unified kernel image is a single executable that can be booted directly from UEFI firmware or sourced by bootloaders with little or no configuration; it combines a UEFI boot stub program such as systemd-stub, a Linux kernel image, an initramfs, and further resources in a single UEFI PE executable (source: https://wiki.archlinux.org/title/Unified_kernel_image, jev weight 0.68). Signing that PE image (which yubiOS does with PKCS#11) turns the boot artifact into something a Secure Boot chain can verify as a unit, instead of trusting an assembled-at-boot combination of separately mutable parts.

## The BLSConfig gap and the 2 options

Phase 2's core problem is precise: at install time, the system must select the pre-built signed UKI artifact rather than a bootc-auto-generated UKI, and bootc 1.16.3 offers no intake mechanism for a project-authored BLSConfig drop-in (source doc). The register lays out exactly 2 options (source doc):

1. Option A: patch bootc itself, mirroring the secureboot-keys flow at `/usr/lib/bootc/install/loader-entries/*.conf`.
2. Option C: bump the base to a fedora-bootc carrying bootc v1.16.4+, which adds `bootc container split-kernel-and-rootfs` support for the flow.

The choice is a dependency decision, not just a code decision: option A adds a maintained patch surface to bootc; option C ties yubiOS's timeline to the fedora-bootc base image release train, which interacts with the B-PINS digest-pinning discipline documented in the same register.

## The narrower gap the register names

The Not Current Blockers section draws the boundary precisely: strict composefs fs-verity is not itself blocked, because the offline install lane can and does test it; B-BOOTC-SEAL is the narrower authenticity gap between a mutable BLS digest anchor and a signed UKI plus Secure Boot chain (source doc). Fedora's composefs documentation corroborates the integrity half: composefs delivers a truly read-only root filesystem, with data from the ostree deployment and metadata in the composefs file, enabled by default starting in Fedora 41 (sources: https://docs.fedoraproject.org/en-US/fedora-coreos/composefs/, jev weight 0.76; https://fedoraproject.org/wiki/Changes/ComposefsAtomicDesktops, jev weight 0.72). The gap B-BOOTC-SEAL names is therefore not "is the root verified" but "is the boot entry that selects the kernel signed and immutable".

## The unblock path

The register's next step (source doc):

1. Complete the install-time BLSConfig wiring to use the pre-built UKI artifact (Phase 2 of ADR-032), via option (a) or (b) above.
2. Require Secure Boot on amd64 and arm64.
3. Retain negative tamper-boot evidence, proving that tampered boots fail rather than merely that honest boots pass.
4. Reference the two refs docs: `refs/kernel-rootfs-split-2026-07-29.md` and `refs/bootc-composefs-sealed-flow-2026-07-22.md`.

## The dependency-management lesson

B-BOOTC-SEAL teaches that a blocker can be half-shipped and still fully open: Phase 1 (artifact split) closed OMN-51 while Phase 2 (BLSConfig wiring) waits on an upstream capability decision. The register keeps the row alive with the phase boundary explicit, so no reader mistakes "artifact published" for "boot sealed". It also shows a project refusing to claim a security property it cannot yet falsify: Secure Boot is required, and negative tamper-boot evidence is retained, because a chain that has only ever booted honestly has not proven it rejects anything else.
