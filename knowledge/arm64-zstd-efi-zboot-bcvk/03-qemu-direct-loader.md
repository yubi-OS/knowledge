# 03: QEMU direct kernel boot of EFI zboot images and the zstd limitation

Scope: how the QEMU direct kernel boot path works, how it handles EFI zboot images, and the exact loader limitation that produced the zstd failure.

## What direct kernel boot is

QEMU's direct Linux boot launches a kernel inside the emulator without a full bootable image. The syntax passes the kernel with -kernel, the kernel command line with -append, and optionally an initramfs with -initrd. QEMU's own documentation presents it as useful for fast Linux kernel testing, with the typical x86 invocation being qemu-system-x86_64 -kernel bzImage -drive file=rootdisk.img,format=raw -append "root=/dev/sda" (QEMU documentation, Direct Linux Boot, jev weight 0.91, https://qemu-project.gitlab.io/qemu/system/linuxboot.html; mirrored across versions at jev weight 0.88, https://qemu.eu/doc/5.2/system/linuxboot.html, and jev weight 0.72, https://qemu.readthedocs.io/en/master/system/linuxboot.html).

On the firmware side, the same -kernel option also exists for UEFI boots: the -shim option specifies the shim.efi binary, needed when booting UEFI firmware with -kernel and the firmware has UEFI secure boot enabled (QEMU documentation, jev weight 0.90, https://github.com/qemu/qemu/blob/master/docs/system/linuxboot.rst). This split matters: the -kernel path either skips firmware entirely or drives a UEFI firmware that loads the kernel, and those two paths handle compressed kernel payloads very differently.

## How the direct loader unpacks an EFI zboot image

When the image passed to -kernel is an EFI zboot image, QEMU does not run the embedded stub. Instead the host side loader recognizes the zboot header, reads the recorded compression algorithm, and unpacks the payload itself before handing the decompressed kernel to the machine. This is exactly the compatibility clause of CONFIG_EFI_ZBOOT at work: the payload can be decompressed and executed by the loader, provided that the loader implements the decompression algorithm (CONFIG_EFI_ZBOOT help text, weak backing, jev weight 0.44, https://cateee.net/lkddb/web-lkddb/EFI_ZBOOT.html).

The unpacker lived in QEMU's hw/loader code under a function named unpack_efi_zboot_image(), with a decompression size limit constant named LOAD_IMAGE_MAX_GUNZIP_BYTES (patch series structure, jev weight 0.95, https://lists.gnu.org/archive/html/qemu-devel/2025-10/msg02623.html). The name of that constant tells the history: the unpacker was built around gunzip, and the upstream fix series opens by renaming it to LOAD_IMAGE_MAX_DECOMPRESSED_BYTES precisely because it was about to cover more than gzip.

## The zstd gap and the error it produced

The limitation is captured in one sentence from the March 2025 Ubuntu bug discussion: "We previously attempted to turn on zboot with zstd on arm64 but that had a regression with qemu -kernel unable to boot it; and kexec unable to load it either. However qemu has gained support for zboot with gzip compression; and there are patches for kexec too." (mail-archive mirror of Ubuntu bug 2098111, jev weight 0.72, https://www.mail-archive.com/ubuntu-bugs%40lists.ubuntu.com/msg6145152.html).

So the loader understood the zboot container and its gzip branch, but had no zstd branch. When it read a zboot header recording zstd, it could not proceed. The user visible symptom in yubiOS's CI harness was the exact message:

unable to handle EFI zboot image with "zstd" compression

This is a host side harness and kernel loader compatibility failure, not a guest OS problem: the machine never boots, so no FIDO2, LUKS2, swtpm, systemd-homed, or PAM code inside the guest can be the cause (project-internal record from the yubiOS refs source document).

## Why the failure matters specifically for bootc VM testing

A bootc image contains a bootable kernel, and the bcvk ephemeral flow extracts that kernel and hands it to QEMU through the direct boot path (bcvk repository, jev weight 0.81, https://github.com/bootc-dev/bcvk, detailed in doc 05). That is the fastest path for VM based testing because it skips firmware bring-up entirely. But the kernel inside a Fedora ARM64 bootc image is an EFI zboot image with a zstd payload, so the direct boot path hits the unpacker, and an unpacker without zstd support rejects the image outright. The alternative, letting UEFI firmware boot the image so the embedded stub does the decompression, is the firmware or stub boot mode discussed in doc 08.

## The shape of the fix

The upstream fix is a 3 patch series touching exactly the code path described above: rename LOAD_IMAGE_MAX_GUNZIP_BYTES to LOAD_IMAGE_MAX_DECOMPRESSED_BYTES, use g_autofree in unpack_efi_zboot_image(), and add support for zboot images compressed with zstd (patch v2 series listing, jev weight 0.95, https://lists.gnu.org/archive/html/qemu-devel/2025-10/msg02623.html; individual patch, jev weight 0.92, https://lists.gnu.org/archive/html/qemu-arm/2025-10/msg00631.html). The series adds a zstd branch to the EFI zboot unpacker and keeps the unsupported-compression error path for other algorithms (project-internal record, yubiOS refs source document). Doc 04 follows that series through review to its merge into QEMU 11.0.
