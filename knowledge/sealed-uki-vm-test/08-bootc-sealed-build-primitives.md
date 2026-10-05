# bootc sealed-build primitives: ukify and split-kernel-and-rootfs

Scope: the bootc container subcommands the sealed lane depends on, how signed UKI builds are produced from OCI images, and where BLS entries point for UKI-based deployments.

## What bootc is

bootc applies the container-image technique to bootable host systems, using standard OCI/Docker containers as the transport and delivery format for base operating system updates. The container image includes a Linux kernel, in for example /usr/lib/modules, which is used to boot (weight 0.914, https://github.com/bootc-dev/bootc; the same repo returned a second result at weight 0.39, weak backing). The project summary calls it transactional, in-place operating system updates using OCI/Docker container images, with the kernel, bootloader, and drivers all part of the container image, rendering the image bootable (weight 0.917, https://docs.fedoraproject.org/en-US/bootc/getting-started/; corroborated at weight 0.838 by https://bootc.dev/bootc/).

## bootc-container-ukify

The bootc man page for `bootc container ukify` states the contract directly: this command computes the necessary arguments from the container image (kernel, initrd, cmdline, os-release) and invokes ukify with them. Any additional arguments after `--` are passed through to ukify unchanged (weight 0.878, https://bootc.dev/bootc/man/bootc-container-ukify.8.html; the same text appears at weight 0.321 in a mirrored repo, weak backing, https://github.com/bootc-dev/agentic-workflows-ci-sandbox/blob/main/docs/src/man/bootc-container-ukify.8.md, and at weight 0.175 in ManKier, weak backing, https://www.mankier.com/8/bootc-container-ukify).

This is the primitive the yubiOS lane probes. The existing `ci_test_bootc-filesystem.yml` workflow run #11 at commit 7eba4856e7 probed `bootc container ukify --help` and `bootc container split-kernel-and-rootfs --help` and reported `sealed-build ukify capability: present` and `sealed-build split capability: present` on the bootc 1.16.6 image (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md). Capability present does not mean wired: the actual BLS entry on the built image still pointed at `/EFI/Linux/bootc_composefs-<sha512>/vmlinuz` with `composefs=<sha512>` in options at the time of the same run, so the yubiOS-side wiring (Containerfile.dev to ukify call, BLSConfig drop-in for UKI) had not landed (source doc: same).

The kernel-side mechanism a UKI builds on is documented in the kernel's own admin guide: on x86 and ARM platforms, a kernel zImage/bzImage can masquerade as a PE/COFF image, convincing EFI firmware loaders to load it as an EFI executable; the header modification code and the EFI entry point are collectively the EFI boot stub (weight 0.948, https://www.kernel.org/doc/html/latest/admin-guide/efi-stub.html).

## bootc-container-split-kernel-and-rootfs

The companion command extracts kernel and initramfs from the filesystem: it takes the kernel and initramfs from the current root filesystem and places them in `/kernel/<kernel-version>/` with filenames vmlinuz and initramfs.img, and can also extract kernel files from a container filesystem mounted elsewhere into an output directory (weight 0.431, weak backing, https://www.mankier.com/8/bootc-container-split-kernel-and-rootfs). This is the split that makes a kernel-in-/usr image buildable into a UKI: the kernel artifacts leave the rootfs and become UKI components.

## BLS entries in this architecture

The Boot Loader Specification is how RHEL-family systems manage boot entries: instead of embedding every kernel entry in grub.cfg, each kernel gets its own small configuration file in /boot/loader/entries/, which GRUB2 reads at boot time to build the menu dynamically (weight 0.101, weak backing, https://oneuptime.com/blog/post/2026-03-04-manage-boot-loader-entries-bls-rhel-9/view). The yubiOS unsealed lane's BLS entries bind the composefs digest in the options line, `composefs=<sha512>`, pointing at the composefs-blessed kernel path (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md). The sealed lane's open question is the BLS entry that points at the signed UKI rather than the composefs-blessed kernel, which is exactly the OMN-150 Phase 2 wiring the lane deliberately excludes (source doc: same).

## Division of labor between bootc and mkosi in the lane

The lane uses both toolchains with distinct jobs (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md):

1. bootc proves the capability exists on the pinned image (the `--help` capability probes).
2. mkosi performs the actual sealed build in the lane: `mkosi --profile yubiOS --output-format uki build` produces the UKI, systemd-sbsign signs it, and the workflow asserts the artifact before boot.

The distinction matters for the evidence plan: the lane's green run proves the mkosi signing path works end to end in QEMU, while the bootc capability probes prove that when the yubiOS-side wiring lands, the tooling the image ships supports it.

## Gaps

The dig did not surface primary documentation for the bootc sealed-build mode as a named feature, nor the bootc version in which `container ukify` and `container split-kernel-and-rootfs` stabilized; the 1.16.6 capability-present evidence comes from the source doc's workflow run, and the man page sources above document the commands without version history. The split-kernel-and-rootfs man page itself scored below the 0.5 authority threshold, so its mechanics should be confirmed against the bootc repository before the lane's build step depends on the extracted artifact layout.
