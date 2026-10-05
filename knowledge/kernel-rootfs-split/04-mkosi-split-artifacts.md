# 04 - mkosi split artifacts

Scope: the mkosi path that already separates kernel from rootfs: DPS-partitioned disk images, SplitArtifacts=uki,partitions, and extracting the signed UKI as a standalone artifact.

## mkosi as the separated-artifact builder

mkosi is described as a wrapper around dnf --installroot, apt, pacman, and zypper that generates customized disk images (https://github.com/systemd/mkosi, jev 0.90). Its output surface is wide: raw GPT disk images, plain directories, tar, cpio, and USI/UKI formats, and it can build bootable Unified Kernel Images including those signed for Secure Boot (https://wiki.archlinux.org/title/Mkosi, jev 0.79). Because the UKI is a first-class output type rather than a byproduct, mkosi is where the kernel-side artifact becomes addressable on its own.

## SplitArtifacts

The mkosi man page defines `SplitArtifacts=` (or `--split-artifacts=`) as the artifact types to split out of the final image. If set to auto, unified kernel images will be used if all necessary components are available; otherwise Type 1 entries as defined by the Boot Loader Specification are used instead (https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md, jev 0.85). Splitting out the UKI means the disk image and the kernel binary are produced from one build but land as two artifacts.

The related `uki` build output generates a single UKI for the latest installed kernel (the one with the highest version), installed to EFI/BOOT/BOOTX64.EFI in the ESP (https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md, jev 0.72). That is the firmware-direct boot path; a loader-managed path uses BLS entries instead, per the auto behavior above.

## Discoverable partitions as the rootfs contract

The rootfs side of the split is expressed through the Discoverable Partitions Specification: GPT partition UUIDs enable automatic discovery, mounting, and enabling of the root, /home/, /srv/, /var/, /var/tmp/, and swap partitions (https://uapi-group.org/specifications/specs/discoverable_partitions_specification/, jev 0.77). On top of DPS, systemd image policy controls which partitions of a Discoverable-Partitions-conformant disk image (DDI) may be activated and how, whenever such an image is activated (https://www.freedesktop.org/software/systemd/man/255/systemd.image-policy.html, jev 0.93). A DPS-partitioned image therefore carries its own machine-readable contract for which partition is usr, which is ESP, and how they compose, which is what lets a separately shipped UKI reference a separately shipped root partition without bespoke glue.

## The UKI side of the contract

The UKI is a single UEFI PE executable that can be booted directly from UEFI firmware or sourced by boot loaders with little or no configuration; it combines a UEFI boot stub such as systemd-stub, a Linux kernel image, an initramfs, and further resources in one binary (https://wiki.archlinux.org/title/Unified_kernel_image, jev 0.71). When mkosi signs that PE for Secure Boot, the kernel-side artifact carries its own trust anchor, independent of the rootfs it will mount.

## What yubiOS actually builds

Per the yubiOS research note behind ADR-032, the yubiOS mkosi configuration (`mkosi.conf` plus `mkosi.conf.d/`) uses a minimal profile that builds a DPS-partitioned disk image with an embedded UKI and `SplitArtifacts=uki,partitions`. The signed UKI that comes out of this path is exactly the artifact that the new `yubios-uki` OCI target packages for separate publication (source note: https://github.com/yubi-OS/yubiOS/blob/main/refs/kernel-rootfs-split-2026-07-29.md, unweighted in this dig).

The note ties this back to ADR-006: the mkosi path emits 3 separate artifacts, a signed UKI .efi, a dm-verity root, and a composefs image, while the bootc path emits a monolithic OCI image. The split is implicit in the contrast between the two paths (source note, unweighted). Phase 1 of the kernel+rootfs split work does not change the mkosi configuration at all; it lifts the already-split UKI out of the installer OCI payload so both build paths expose the same artifact vocabulary.

The CI pipeline that produces the artifact builds the mkosi minimal disk image, mocks the YubiKey PIV slot 9c with SoftHSM PKCS#11, verifies the signature with sbverify, and publishes the installer as docker.io/0mniteck/yubios:installer-<sha>. The split work extends this pipeline to also extract the signed UKI into an inst/uki/ payload and publish it as uki-<sha> via docker buildx bake (source note, unweighted; the bake mechanism itself is covered in doc 05).
