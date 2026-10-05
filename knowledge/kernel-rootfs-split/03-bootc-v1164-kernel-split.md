# 03 - bootc v1.16.4 kernel split

Scope: the bootc v1.16.4 UKI Cleanup (PR #2200) and user-provided kargs (PR #2305), the split-kernel-and-rootfs subcommand that keeps /kernel outside the digested rootfs, and why yubiOS Phase 1 does not need the base bump.

## The split command itself

The `bootc container split-kernel-and-rootfs` subcommand is the upstream expression of the split this corpus is about. Its man page describes it as splitting the kernel and rootfs from a container image: it extracts kernel files from a container filesystem mounted at /mnt/container-rootfs and places them in an output directory (https://bootc.dev/bootc/man/bootc-container-split-kernel-and-rootfs.8.html, jev 0.91). The concrete layout: it extracts the kernel and initramfs from the current root filesystem and places them in /kernel/<kernel-version>/ with filenames vmlinuz and initramfs.img (https://github.com/bootc-dev/agentic-workflows-ci-sandbox/blob/main/docs/src/man/bootc-container-split-kernel-and-rootfs.8.md, jev 0.71; same behavior described at https://www.mankier.com/8/bootc-container-split-kernel-and-rootfs, jev 0.65).

That /kernel/<kernel-version>/ placement is the structural point. Once the kernel lives outside the container rootfs, the digested rootfs that composefs verifies no longer needs to contain the kernel, and the kernel can be shipped, signed, and updated as its own artifact. This is the close-out path yubiOS labels B-BOOTC-SEAL (source note: https://github.com/yubi-OS/yubiOS/blob/main/refs/kernel-rootfs-split-2026-07-29.md).

## Why the rootfs side is composefs

The split only pays off if the rootfs half is independently verifiable, and on Fedora/CentOS bootc it is: these variants enable composefs for the root filesystem by default, which is a first important difference from other ostree-using Fedora derivatives (https://docs.fedoraproject.org/en-US/bootc/filesystem/, jev 0.88). The bootc project frames ostree as an implementation detail and bootc as a fresh, new container-native interface (https://bootc.dev/bootc/filesystem.html, jev 0.80). With composefs in place, rootfs integrity is anchored in the image digest, so a separately published kernel artifact does not weaken the rootfs verification story: the two halves verify independently.

## What landed in v1.16.4

bootc v1.16.4 (released 2026-07-15) carried two PRs relevant to this split (release-level fact corroborated by the bootc releases page, https://github.com/bootc-dev/bootc/releases, jev 0.89; PR specifics from the source note):

1. PR #2200, "UKI Cleanup": follow-on work to the v1.16.3 UKI/BLSConfig support, cleaning up how UKIs are built and installed.
2. PR #2305, "composefs/bls: Add user provided kargs": the user-provided-kargs path for BLS entries written by the composefs flow. It enables runtime command line tweaks without regenerating the UKI.

The kargs point matters for artifact independence. If kernel command line changes require regenerating the UKI, then the "kernel artifact" is entangled with every boot-configuration tweak. PR #2305 decouples the two: the UKI stays sealed while the BLS entry carries the per-deployment kargs.

## The version floor question

The source note is explicit that yubiOS does not need to bump its base image to bootc v1.16.4 for Phase 1 of the split work. Phase 1 publishes the mkosi-built signed UKI as a separate OCI artifact; that pipeline is independent of which bootc version the bootc path uses. v1.16.4 is the enabler for the full B-BOOTC-SEAL close-out described in docs/ARCHITECTURE.md L244-278, where the bootc path itself produces a split kernel and sealed rootfs (source note, unweighted).

The sequencing logic:

1. Phase 1 works on bootc 1.16.3 because it touches the mkosi artifact pipeline and the install config, not bootc's split command.
2. Phase 2's option (C) bumps the fedora-bootc base to carry bootc v1.16.4 or later and adopts split-kernel-and-rootfs plus ukify as the sealed-flow enabler.
3. Until option (C) lands, the prebuilt UKI artifact and bootc's own install-time UKI coexist as parallel artifacts, per the source note's Phase 2 analysis.

## Where the halves meet at boot

The split kernel must still boot the split rootfs. The bootc runtime side handles this: the container image includes a Linux kernel in /usr/lib/modules that is used to boot, and at runtime the base userspace is not itself running in a container (https://github.com/bootc-dev/bootc, jev 0.78). After the split command extracts /kernel/<version>/, the remaining rootfs is what composefs verifies, and the boot path stitches the halves together via the kernel command line and the composefs image reference (see doc 07 for the cmdline contract).
