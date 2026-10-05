# 02: zstd compressed kernel payloads in Fedora ARM64

Scope: why Fedora ARM64 kernels are EFI zboot images compressed with zstd, how that interacts with the image build tooling, and the regression history that made the combination fragile.

## The core fact: Fedora arm64 ships an EFI_ZBOOT image compressed with zstd

The clearest single statement comes from the QEMU patch series that exists precisely because of this format choice. The cover letter reads: "Fedora arm64 has an EFI_ZBOOT kernel image compressed with zstd. Let's make sure we can use it for direct kernel boot with qemu." (QEMU-devel mailing list, PATCH v3 0/3 Add support for zboot images compressed with zstd, jev weight 0.85, https://lists.gnu.org/archive/html/qemu-devel/2025-10/msg02627.html; the same motivation text appears in the v2 cover letter, jev weight 0.95, https://lists.gnu.org/archive/html/qemu-devel/2025-10/msg02623.html).

So the packaging decision is upstream Fedora's: the ARM64 kernel artifact the distribution publishes is not a plain Image file but an EFI zboot application with a zstd wrapped payload. Any tool that wants to boot that artifact without firmware involvement must handle zstd.

## What the image contains and how it is produced

A zboot image is built with CONFIG_EFI_ZBOOT and carries the real kernel as compressed payload, decompressed into memory before execution by the stub, with the clause that non-EFI loaders may also unpack it if they implement the algorithm (CONFIG_EFI_ZBOOT help text, weak backing, jev weight 0.44, https://cateee.net/lkddb/web-lkddb/EFI_ZBOOT.html). zstd is one of the compression formats the EFI stub ecosystem actively supports: the zloader project provides an EFI boot stub for x86 and AArch64 with support for LZ4 compressed and/or ZSTD compressed kernel images (zloader repository, jev weight 0.76, https://github.com/mxre/zloader/).

The bootable image on disk travels with an initramfs built by dracut, which generates the initramfs image for the running or specified kernel version and packs kernel modules for common storage devices into it (dracut manual page, jev weight 0.79, https://man7.org/linux/man-pages/man8/dracut.8.html; dracut documentation, jev weight 0.85, https://dracut-ng.github.io/dracut.html). The yubiOS source record additionally references dracut-ng issue 1406 as the tracking point for the zstd zboot interaction; that issue did not surface in this dig, so its contents are not asserted here (project-internal reference, https://github.com/dracut-ng/dracut-ng/issues/1406).

## The regression history: zboot with zstd broke loaders twice

The fragility of the combination is documented in an Ubuntu bug discussion from March 2025. The reporter states: "We previously attempted to turn on zboot with zstd on arm64 but that had a regression with qemu -kernel unable to boot it; and kexec unable to load it either. However qemu has gained support for zboot with gzip compression; and there are patches for kexec too." (mail-archive mirror of Ubuntu bug 2098111, jev weight 0.72, https://www.mail-archive.com/ubuntu-bugs%40lists.ubuntu.com/msg6145152.html).

That single paragraph maps the whole problem space:

1. Direct kernel boot via qemu -kernel could not handle the zstd payload.
2. kexec could not load the image either, for the same class of reason.
3. gzip compressed zboot images were already supported by QEMU, so the gap was specifically the zstd branch of the unpacker.
4. The same class of fix was being prepared for kexec independently.

This matches the error string yubiOS observed in its CI, "unable to handle EFI zboot image with zstd compression", which is the host loader rejecting the recorded compression algorithm before the embedded stub ever runs (project-internal record, detailed in doc 03 and doc 06).

## Why distros made this choice anyway

The payoffs are size and firmware simplicity. A compressed payload shrinks the shipped kernel artifact, and the firmware only ever loads a standard PE/COFF EFI application, never caring which compression wraps the payload (CONFIG_EFI_ZBOOT help text, weak backing, jev weight 0.44, https://cateee.net/lkddb/web-lkddb/EFI_ZBOOT.html; PE/COFF header requirement discussed in doc 01). For yubiOS the decision followed: production stays aligned with Fedora ARM64 defaults, and the loader gap is fixed on the loader side rather than by downgrading production compression (project-internal record, doc 06).

## Practical tooling around zstd zboot images

Two pieces of tooling exist for working with these images outside the boot path. unzboot extracts and decompresses an ARM64 kernel from an EFI zboot image file, verifying the image before writing the decompressed kernel out (jev weight 0.51, https://github.com/eballetbo/unzboot). And after the QEMU fix described in doc 04, direct loaders themselves became part of that tooling: a QEMU with the zstd branch can unpack the payload the same way unzboot does, which is what makes direct kernel boot of Fedora ARM64 images work at all.
