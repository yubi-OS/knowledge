# 01 - Artifact split principle

Scope: why the kernel and the root filesystem should be independently addressable build artifacts in an immutable OS, what a monolithic OCI image hides, and which three existing yubiOS ADRs already imply the split.

## The transport problem

bootc's core idea is to use standard OCI/Docker containers as the transport for bootable host systems: the container image includes a Linux kernel (in /usr/lib/modules) that is used to boot the machine, and at runtime the base userspace is not running in a container (https://github.com/bootc-dev/bootc, jev 0.67; https://bootc.dev/bootc/, jev 0.83). That single image carries kernel, kernel modules, and root filesystem together. It is an excellent distribution unit, but it is a poor attestation and update unit, because you cannot pull, verify, sign, or replace the kernel without pulling the entire rootfs and vice versa.

The CentOS Automotive SIG documentation makes the layering explicit: the bootc container image is an intermediate artifact that can be pushed to a registry and used for over-the-air updates, while conversion to a disk image is a separate step that requires a builder image (https://docs.centos.org/automotive-sig-documentation/building/con_bootc-image-building/, jev 0.64). The moment you treat "container image" and "bootable artifact" as two different things, splitting the kernel out of the container image stops being exotic and becomes an artifact-plumbing decision.

## What a UKI is and why it is the natural kernel artifact

A unified kernel image is a single UEFI PE executable that can be booted directly from UEFI firmware or sourced by boot loaders with little or no configuration. It combines a UEFI boot stub program such as systemd-stub, a Linux kernel image, an initramfs, and further resources into one signed binary (https://wiki.archlinux.org/title/Unified_kernel_image, jev 0.78). Because the UKI bundles the kernel side of boot and is independently signable, it is the artifact you want to publish separately from the rootfs: the rootfs stays a verity-protected OCI-derived image while the kernel+cmdline+stub travels as its own signed PE.

bootc's own CLI surface already acknowledges this seam. The bootc-container man page lists two sibling subcommands: "Split kernel and rootfs from a container image" and "bootc container ukify: Build a Unified Kernel Image (UKI) using ukify" (https://bootc.dev/bootc/man/bootc-container.8.html, jev 0.84). Upstream therefore models "kernel" and "rootfs" as separately extractable halves of the same container image, not as one indivisible blob.

## Precedent from other immutable systems

Kairos describes its immutable architecture as booting in a restricted, permissionless mode with read-only paths, which enables predictable upgrades across a fleet (https://kairos.io/docs/architecture/immutable/, jev 0.72). The predictability claim rests on the system being composed of separately addressable, separately verifiable pieces. A monolithic image where the kernel is buried inside the digested rootfs makes that separation impossible at the artifact level, even when it exists at the partition level.

## What the yubiOS ADRs already establish

The yubiOS research note behind ADR-032 surveys three ADRs that imply the split without naming it (https://github.com/yubi-OS/yubiOS/blob/main/refs/kernel-rootfs-split-2026-07-29.md, source note, unweighted in this dig):

1. ADR-006: the mkosi path emits 3 separate artifacts (a signed UKI .efi, a dm-verity root, and a composefs image), while the bootc path emits a monolithic OCI image. The split exists implicitly in the contrast between the two paths.
2. ADR-013: A/B updates are 4 separate artifacts (a new /usr partition, verity data, a PKCS#7 signature, and a new UKI in the ESP). The kernel is already structurally separable from the rootfs in the update model.
3. ADR-022: the 0mniteck/yubios registry already publishes kernel and rootfs as separate OCI tags: firmware, installer (carrying the UKI), latest (the bootc OS image), and dev (test only). The tag scheme acknowledges the split even though the installer payload bundles it.

The phrase "kernel+rootfs split" appears 0 times in docs/ADR.md before ADR-032; the note greps the file to confirm this (source note, unweighted). ADR-032's contribution is to name the pattern as a first-class principle so that the two build paths (mkosi and bootc) converge on the same artifact vocabulary instead of each inventing its own.

## The concrete yubiOS gap

Before the split work, the signed UKI produced by the mkosi installer path ships bundled inside the installer OCI artifact (docker.io/0mniteck/yubios:installer-<sha>), so a consumer who wants only the kernel-side artifact must pull the whole installer payload (source note, unweighted). Lifting the signed UKI into its own artifact under the existing per-artifact tag scheme turns the implicit split of ADR-006, ADR-013, and ADR-022 into something a registry consumer can address directly.
