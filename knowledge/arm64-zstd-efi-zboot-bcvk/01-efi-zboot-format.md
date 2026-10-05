# 01: The Linux EFI zboot image format on ARM64

Scope: what an EFI zboot image is, how its header describes the compression of the embedded kernel payload, and why the format exists at all.

## The EFI stub: a kernel that is its own boot loader

On the x86 and ARM platforms, a kernel zImage or bzImage can masquerade as a PE/COFF image, which convinces EFI firmware loaders to load it as an EFI executable. The code that modifies the image header, along with the EFI specific entry point the firmware loader jumps to, is collectively called the EFI boot stub. It lives in the kernel tree under arch specific boot code (kernel.org EFI stub documentation, jev weight 0.95, https://www.kernel.org/doc/html/latest/admin-guide/efi-stub.html; same text in the in-tree docs file, jev weight 0.89, https://github.com/torvalds/linux/blob/master/Documentation/admin-guide/efi-stub.rst).

By using the EFI boot stub it is possible to boot a Linux kernel without a conventional EFI boot loader such as grub or elilo. Since the EFI boot stub performs the jobs of a boot loader, in a certain sense it IS the boot loader (kernel.org EFI stub documentation, jev weight 0.94, https://www.kernel.org/doc/html/latest/admin-guide/efi-stub.html). This is the foundation that zboot builds on: once the kernel image is a valid EFI application, the firmware can load it directly.

## CONFIG_EFI_ZBOOT: an EFI application wrapping a compressed kernel

The kernel config option CONFIG_EFI_ZBOOT creates the bootable image as an EFI application that carries the actual kernel image in compressed form, and decompresses it into memory before executing it. This is the defining property of a zboot image: the file the firmware (or any loader) sees is a small EFI stub program, and the big compressed kernel travels inside it as payload (CONFIG_EFI_ZBOOT help text, Linux Kernel Driver DataBase, weak backing, jev weight 0.44, https://cateee.net/lkddb/web-lkddb/EFI_ZBOOT.html; same help text mirrored on kernelconfig.io, weak backing, jev weight 0.36, https://www.kernelconfig.io/config_efi_zboot).

The same help text carries the clause that matters most for this corpus: for compatibility with non-EFI loaders, the payload can be decompressed and executed by the loader as well, provided that the loader implements the decompression algorithm. In other words, a non-EFI direct loader that wants to boot a zboot image must itself understand the compression format recorded in the image. When a loader understands gzip but not zstd, this exact clause is what fails, and that failure is the subject of docs 03 and 04.

## The PE/COFF header contract

The EFI specification requires a PE/COFF image header at the beginning of the kernel image in order to load it as an EFI application. The RISC-V boot image header documentation describes how the architecture boot header is reused to support the EFI stub on that architecture, which shows the general pattern: the architecture specific boot header doubles as the PE/COFF header the firmware needs (RISC-V boot image header, kernel documentation, jev weight 0.61, https://docs.kernel.org/arch/riscv/boot-image-header.html).

For zboot images the same principle applies one level up: the outer EFI application has a PE/COFF header plus a small zboot specific header that records which compression algorithm wraps the inner kernel image. That recorded algorithm is what a direct loader reads when it tries to unpack the payload itself instead of running the embedded stub.

## Extracting and inspecting zboot payloads

The open source unzboot utility is a C program to extract and decompress a Linux kernel image from an EFI application file, specifically designed to handle ARM64 kernels embedded within EFI zboot images. It verifies the image, decompresses it if necessary, and writes the decompressed kernel to an output file (unzboot README, jev weight 0.51, https://github.com/eballetbo/unzboot). The existence of this tool is practical evidence of the format's structure: the zboot header plus a compressed payload is parseable outside the kernel, which is exactly what tools like unzboot and the QEMU unpacker in docs 03 and 04 both do.

A related third party project, zloader, provides an EFI boot stub for x86 and AArch64 with support for LZ4 compressed and/or ZSTD compressed kernel images, built as a drop in replacement for the systemd boot stub. It confirms that zstd is one of the compression formats the EFI stub ecosystem handles in practice (zloader repository, jev weight 0.76, https://github.com/mxre/zloader/).

## Why ARM64 adopted zboot

The format exists to decouple two concerns. First, the firmware only needs to load a standard EFI application; it does not need to know anything about kernel compression formats. Second, the kernel image that ends up in memory can be compressed with a modern algorithm chosen by the build, shrinking the artifact that distros ship and boot. Fedora ARM64 distributes its kernel exactly this way: the distro's ARM64 kernel is an EFI_ZBOOT image whose payload is compressed with zstd, a fact asserted directly in the QEMU patch cover letter that motivated this corpus (jev weight 0.85, https://lists.gnu.org/archive/html/qemu-devel/2025-10/msg02627.html, detailed in doc 02).

The tradeoff is the one stated in the CONFIG_EFI_ZBOOT help text: any loader that bypasses the stub and unpacks the payload directly must implement every compression algorithm that shipped kernels might use. gzip came first, zstd came later, and loader support trailed the kernel side. That gap is the whole story of this corpus.
