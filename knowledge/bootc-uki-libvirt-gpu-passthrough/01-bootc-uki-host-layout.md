# 01 - bootc-UKI host layout on a passthrough host

Scope: bootc install layout on the passthrough host (systemd-boot, composefs backend, UKI signing), why the bootc/UKI layer sits below the VFIO/IOMMU boundary, and boot-time attestation as a GPU launch gate.

## What a bootc host is

bootc applies container-image techniques to bootable host systems: the host runs from standard OCI/Docker containers used as the transport and update mechanism, with atomic upgrades and rollback (source: https://github.com/bootc-dev/bootc, jev weight 0.82). The image, not a package transaction, is the unit the host boots.

## The UKI layer

A Unified Kernel Image (UKI) is a single executable that combines a UEFI boot stub program, the kernel, and the initramfs, and can be booted directly from UEFI firmware or sourced by a bootloader with little or no configuration (source: https://wiki.archlinux.org/title/Unified_kernel_image, jev weight 0.93). systemd-boot is the UEFI boot manager that loads the user-selected entry and controls the boot flow around those images (source: https://docs.qualcomm.com/bundle/publicresource/topics/80-80022-27/configure_and_secure_boot_with_systemd_boot_and_uki.html, jev weight 0.63).

A weak-backed but consistent datapoint: setting KERNEL_INSTALL_LAYOUT=uki in /etc/kernel/install.conf flips kernel-install into UKI mode so every kernel upgrade produces a signed image instead of a split kernel plus initrd pair (source: https://botmonster.com/self-hosting/unified-kernel-images-systemd-boot-signed-linux/, jev weight 0.44, weak backing, labeled as such).

## Composefs and dm-verity sealing

yubiOS's own published boot-chain doc states the pattern directly: the host boots a UKI signed over PIV/PKCS#11, and the UKI command line binds the digest that authenticates the immutable root, with dm-verity on the mkosi-built path and a strict fs-verity composefs repository (source: https://github.com/yubi-OS/knowledge/blob/main/knowledge/yubios/03-boot-chain-and-ukis.md, jev weight 0.80).

dm-verity is intended as one of the last steps in a boot process that protects the OS and the kernel from changes, and it is easily defeated without Secure Boot and a UKI, which is why the UKI and Secure Boot pairing is recommended (source: https://wiki.archlinux.org/title/Dm-verity, jev weight 0.89). In the CLIP OS design the root hash used to verify the verity-backed partition is carried in the kernel command line (source: https://docs.clip-os.org/clipos/boot_integrity.html, jev weight 0.53). A weak-backed write-up describes the composefs mechanism as image sealing: one cryptographic digest authenticates an entire filesystem, covering file contents and metadata including directory structure, permissions, ownership, symlinks, and xattrs (source: https://scrivano.org/posts/2026-06-05-sealing-with-composefs/, jev weight 0.30, weak backing, labeled as such).

## Why this layer is invisible to passthrough

The load-bearing host-level fact: a bootc-pinned-digest host is structurally identical to a non-bootc host for VFIO purposes. The bootc/UKI layer sits below the kernel/VFIO/IOMMU boundary, so the passthrough plumbing (IOMMU groups, vfio-pci binding, libvirt hostdev XML) is unchanged (source: yubiOS internal record, refs/bootc-uki-libvirt-gpu-passthrough-2026-08-07.md, no external weight available, labeled as internal provenance). Practical consequence for an operator: configuring GPU passthrough on a bootc-UKI yubiOS host is a kernel-and-libvirt exercise, not a bootc exercise. The only place the image layer reaches into the passthrough path is policy, not plumbing.

## Boot-time attestation as the GPU launch gate

yubiOS Rule 7 (ADR-031, added via PR #153, merged 2026-07-30) makes boot-time image attestation a libvirt launch gate: the host must verify that the installed image digest matches the running kernel before exposing any GPU to a VM (source: yubiOS internal record, refs/bootc-uki-libvirt-gpu-passthrough-2026-08-07.md, internal provenance). This is the one deliberate coupling between the bootc/UKI layer and GPU access: the attested boot chain is the precondition for handing hardware through, even though the mechanics of handoff are unchanged.

The measured-boot framing matches industry practice: on UEFI platforms the boot sequence extends integrity measurements at multiple stages, establishing a chain of trust from firmware to userspace (source: https://deepwiki.com/systemd/systemd/4.1-early-boot-uefi-and-measured-boot, jev weight 0.36, weak backing, labeled as such; the primary systemd sources are upstream).

## Operator checklist for this layer

1. Confirm the host boots a signed UKI via systemd-boot, with the composefs digest bound in the kernel command line (source: https://github.com/yubi-OS/knowledge/blob/main/knowledge/yubios/03-boot-chain-and-ukis.md, jev weight 0.80).
2. Treat image digest verification as a launch precondition for GPU exposure per the ADR-031 Rule 7 gate (source: yubiOS internal record, internal provenance).
3. Do not expect bootc to change any IOMMU, vfio-pci, or libvirt behavior; those layers are downstream of the image (source: yubiOS internal record, internal provenance, consistent with the bootc architecture description at https://github.com/bootc-dev/bootc, jev weight 0.82).
