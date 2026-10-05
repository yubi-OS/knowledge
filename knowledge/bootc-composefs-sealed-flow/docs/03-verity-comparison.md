# 03 - verity comparison

Scope: comparison of dm-verity, fs-verity, and composefs: which layer each authenticates, and why dm-verity belongs to the separate block-image path rather than the bootc composefs path.

## dm-verity: the block layer

dm-verity is the device-mapper "verity" target. It provides transparent integrity checking of block devices using a cryptographic digest supplied by the kernel crypto API, and the target is read-only by construction. Its on-disk hash format is versioned, with version 0 being the original format used in Chromium OS (weight 0.93, [dm-verity kernel admin guide](https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html)). In operation the kernel verifies read-only data against a read-only Merkle tree at the block layer, below any filesystem (weight 0.96, [kernel.org fs-verity](https://www.kernel.org/doc/html/latest/filesystems/fsverity.html)).

## fs-verity: the file layer

fs-verity is similar to dm-verity but works on files rather than block devices: userspace runs an ioctl on a regular file and the filesystem builds and persists a Merkle tree associated with that file (weight 0.95, [docs.kernel.org fs-verity](https://docs.kernel.org/filesystems/fsverity.html)). An academic survey of the two mechanisms states the division cleanly: dm-verity works on the level of block devices and requires them to be read-only, while fs-verity functions on the level of the filesystem (weight 0.75, [Mayrhofer, Android file-system integrity survey](https://mayrhofer.eu.org/courses/android-security/selected-paper/2020/Android_Security_File_System_Integrity.pdf)).

## composefs: the tree layer

composefs combines several underlying Linux features to produce read-only mountable filesystem trees stacked on top of a lower filesystem. Its key technologies are overlayfs as the kernel interface, EROFS for a mountable metadata tree, and optional fs-verity from the lower filesystem (weight 0.93, [composefs/composefs](https://github.com/composefs/composefs)). Composefs achieves whole-filesystem integrity through image sealing: a single cryptographic digest authenticates an entire filesystem, covering file contents and metadata such as directory structure, permissions, ownership, symlinks, and xattrs. This goes further than fs-verity alone, which can verify only individual file contents (weight 0.62, [Image sealing with composefs](https://scrivano.org/posts/2026-06-05-sealing-with-composefs/)).

## Why the layer matters for bootc

The bootc composefs path is a file-level design. Its integrity property comes from fs-verity on individual files plus an authenticated EROFS metadata image, mounted through overlayfs. dm-verity is not part of that path: it authenticates a fixed block-device image, which is a different deployment shape. Conflating the two leads to concrete misconfigurations, such as requesting a dm-verity dracut module for a bootc composefs install or describing the composefs target as an EROFS root partition. The physical sysroot in a bootc composefs install is a normal writable filesystem (ext4 or btrfs); only the metadata images inside it are EROFS.

The dm-verity pattern remains the right tool for block-image designs. Immutable OS stacks that ship read-only layers as block devices use dm-verity per layer, stacked with SELinux, Integrity Policy Enforcement, and Secure Boot, as in the Azure Linux OS Guard design where the container runtime uses dm-verity block devices for each layer (weight 0.64, [Van Laere, Azure Linux OS Guard](https://thomasvanlaere.com/posts/2026/02/azure-linux-os-guard-on-azure-kubernetes-service/)). Distribution-level writeups treat dm-verity plus an immutable root as a standard practice with its own design patterns, including page-cache pre-population of the hash tree during boot for latency-sensitive systems (weight 0.62, [Proteanos, rootfs integrity with dm-verity](https://proteanos.com/doc/rootfs-integrity-dm-verity-immutable-images/)).

## How the layers compose in yubiOS

The yubiOS immutability stack deliberately composes all three layers: dm-verity on the read-only /usr image, fs-verity on individual files, IMA for runtime measurement, and composefs for the signed-catalog assembly. The yubiOS dm-verity-and-integrity skill names dm-verity plus fs-verity plus IMA plus composefs as the load-bearing chain, with the /usr immutability invariant as its first-class home (weight 0.53, [yubi-OS/yubiOS dm-verity-and-integrity skill](https://github.com/yubi-OS/yubiOS/blob/main/skills/dm-verity-and-integrity/SKILL.md)).

The practical consequence is a verification matrix rather than a single check:

1. Block-image artifacts (a full disk or partition image) are authenticated by dm-verity root hashes. A changed image fails before the filesystem layer is even mounted.
2. Individual files under a composefs deployment are authenticated by fs-verity measurements recorded in the EROFS metadata image.
3. The whole composefs tree is authenticated by the single digest named in the boot path, which is the anchor that doc 04 covers.

A CI or audit claim about "verity" should name which of these three it actually tested. Passing an offline `fsverity measure` proves the second layer only; it says nothing about the block image or about whether the boot path references the measured digest.
