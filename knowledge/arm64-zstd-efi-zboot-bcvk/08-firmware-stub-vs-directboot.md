# 08: Firmware and stub boot versus DirectBoot for ARM64 VM testing

Scope: the two ways a VM can boot a kernel, where decompression happens in each, and why the firmware path is the strategically preferred mode for fidelity.

## The two routes

A QEMU ARM64 VM can reach the same kernel two ways. The direct kernel boot path passes the kernel with -kernel and skips firmware entirely; QEMU documents it as launching a Linux kernel without a full bootable image, useful for fast kernel testing (QEMU documentation, Direct Linux Boot, jev weight 0.91, https://qemu-project.gitlab.io/qemu/system/linuxboot.html). The firmware route boots through UEFI firmware, and the kernel's own EFI stub takes over from the firmware. The kernel documentation describes the EFI boot stub as performing the jobs of a boot loader, so that in a certain sense it IS the boot loader (kernel.org EFI stub documentation, jev weight 0.77, https://www.kernel.org/doc/html/latest/admin-guide/efi-stub.html; ArchWiki makes the same point, jev weight 0.82, https://wiki.archlinux.org/title/EFI_boot_stub; Gentoo wiki, jev weight 0.55, http://wiki.gentoo.org/wiki/Efi_stub).

## Where decompression happens, and why it decides the zstd question

The difference that matters for this corpus is who owns kernel decompression. In the direct path, the host side QEMU loader recognizes the EFI zboot container and unpacks the payload itself, which requires the loader to implement the compression algorithm. The CONFIG_EFI_ZBOOT design states this explicitly: the payload can be decompressed and executed by the loader as well, provided that the loader implements the decompression algorithm (CONFIG_EFI_ZBOOT help text, jev weight 0.78, https://cateee.net/lkddb/web-lkddb/EFI_ZBOOT.html). In the firmware path, the zboot image runs as an EFI application and the embedded stub decompresses the payload itself, so the host never needs to know the compression format at all.

That is why the zstd gap only injured the direct path. QEMU's unpacker lacked a zstd branch (doc 03 and doc 04), while any firmware boot of the same image would have worked, because the stub inside the image owns its own decompression. The kernel side has been pushing further in this direction on x86 as well: an LWN summary of an efi series notes work to avoid the bare metal decompressor during EFI boot, with the EFI stub handling boot without the legacy decompressor (LWN, efi/x86: Avoid bare metal decompressor during EFI boot, jev weight 0.66, https://lwn.net/Articles/937889/).

## Fidelity and Secure Boot alignment

The yubiOS source record states the strategic preference plainly: firmware or stub boot is strategically cleaner than DirectBoot because the EFI stub owns decompression, which more closely resembles the Secure Boot production flow (project-internal record). Two dig sources reinforce the mechanics behind that claim.

First, firmware boot exercises the chain production uses. QEMU's own boot anatomy post walks what a machine goes through before the OS kernel loads, from power-on through firmware to the usable system (QEMU blog, Anatomy of a Boot, jev weight 0.89, https://www.qemu.org/2020/07/03/anatomy-of-a-boot/). A direct boot skips most of that chain, so tests pass over exactly the machinery Secure Boot depends on.

Second, the firmware path has its own Secure Boot specific plumbing in QEMU. The -shim option specifies the shim.efi binary, needed when booting UEFI firmware with -kernel and the firmware has UEFI secure boot enabled (QEMU documentation, jev weight 0.89, https://qemu-project.gitlab.io/qemu/system/linuxboot.html). That option only exists because the firmware route models the shim and secure boot chain that production ARM64 systems actually run.

A third source connects boot modes to attestation: a write-up on measured boot and attestation distinguishes Direct Kernel Boot from Virtual Firmware Boot as separate boot models with different measurement implications (blog, virtCCA measured boot and attestation, jev weight 0.69, https://mahaocheng.me/blog/2026/virtcca-measured-boot-attestation/). For a project whose threat model leans on measured boot, firmware boot is the closer match.

## The tradeoff: speed versus fidelity

DirectBoot exists for speed. QEMU markets it for fast kernel testing, and it skips firmware bring-up entirely (QEMU documentation, jev weight 0.91, https://qemu-project.gitlab.io/qemu/system/linuxboot.html). For the yubiOS harness the direct path was chosen because it gets the FIDO2 and LUKS2 tests running quickly through bcvk (project-internal record, doc 05 and doc 07). The cost appeared as the zstd loader dependency: every compression format the production image might use becomes a hard requirement on the host loader version.

The source record's strategic ladder resolves the tension by sequencing: pinned QEMU now, firmware or stub boot mode for bcvk ARM64 as the preferred medium-term, and a test-only image variant with older compression only as a last resort, never production (project-internal record). Under the firmware mode the loader version stops mattering for compression, the stub owns decompression, and the boot flow matches the Secure Boot production shape.
