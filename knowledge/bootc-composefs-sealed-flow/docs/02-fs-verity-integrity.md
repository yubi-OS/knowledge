# 02 - fs-verity integrity

Scope: fs-verity as the file-level integrity primitive behind composefs: Merkle tree enforcement, read-only semantics, filesystem support in ext4 and btrfs, and the fsverity tooling used to enable and measure it.

## What fs-verity is

fs-verity (fs/verity/) is a support layer that filesystems hook into to provide transparent integrity and authenticity protection for read-only files. It is supported by ext4, f2fs, and btrfs (weight 0.96, [Linux kernel fs-verity documentation](https://www.kernel.org/doc/html/latest/filesystems/fsverity.html)). The mechanism is per-file: on a regular file on a filesystem that supports fs-verity, userspace executes an ioctl that causes the filesystem to build a Merkle tree for the file and persist it in a filesystem-specific location associated with the file (weight 0.95, [docs.kernel.org fs-verity](https://docs.kernel.org/filesystems/fsverity.html)).

The fs-verity file digest is a cryptographic digest that identifies the file contents enforced on reads. It is computed via a Merkle tree and is deliberately different from a traditional full-file digest (weight 0.82, [docs.kernel.org fs-verity](https://docs.kernel.org/filesystems/fsverity.html)). Once verity is enabled the file becomes immutable for reads: the kernel verifies every read against the read-only Merkle tree rather than trusting block contents (weight 0.96, [kernel.org fs-verity](https://www.kernel.org/doc/html/latest/filesystems/fsverity.html)). dm-verity is the close relative at the block layer; fs-verity is similar but works on files rather than block devices (weight 0.95, [docs.kernel.org fs-verity](https://docs.kernel.org/filesystems/fsverity.html)).

fs-verity and IMA have different focuses: fs-verity is a filesystem-level mechanism for hashing individual files with a Merkle tree, not a measurement architecture (weight 0.71, [docs.kernel.org 6.4 fs-verity](https://docs.kernel.org/6.4/filesystems/fsverity.html)).

## ext4 support and on-disk shape

ext4 supports fs-verity as a filesystem feature providing Merkle tree based hashing for individual read-only files; most of the mechanism is common across filesystems and documented in the shared fs-verity documentation (weight 0.80, [ext4 verity files](https://www.kernel.org/doc/html/latest/filesystems/ext4/verity.html)). The on-disk layout is ext4-specific: verity inodes carry `EXT4_VERITY_FL` set, must use extents, must not use inline data, and store a verity descriptor whose size is a 4-byte little endian integer (weight 0.57, [ext4 verity on-disk format](https://dri.freedesktop.org/docs/drm/filesystems/ext4/verity.html)). The original RFC patchset that landed the mechanism implemented it for ext4 and f2fs first (weight 0.86, [LWN, fs-verity RFC](https://lwn.net/Articles/763441/)).

## Enabling it on a target filesystem

A filesystem must be created with the verity feature enabled before fs-verity can be used on its files. The containerd documentation shows the operator check: inspect the filesystem features with `dumpe2fs -h /dev/sda1 | grep 'Filesystem features'` and confirm the verity feature is present (weight 0.84, [containerd fsverity docs](https://containerd.io/docs/main/fsverity/)). This is the same requirement the yubiOS install flow encodes as `mkfs.ext4 -O verity`: a target formatted without the feature cannot have its composefs objects measured, and the install will produce an unsealable tree.

## fs-verity inside composefs

composefs leans on fs-verity for end-to-end integrity: the EROFS metadata image and the content-addressed data files are both protected, with optional fs-verity providing verification of data and metadata together (weight 0.93, [composefs-rs](https://github.com/composefs/composefs-rs)). The bootc composefs internals expose this directly: the `composefs::fsverity` module provides userspace digest computation, kernel ioctl interfaces for enabling and measuring verity, and hash value types for SHA-256 and SHA-512 (weight 0.60, [composefs::fsverity](https://jmarrero.github.io/bootc/internals/composefs/fsverity/index.html)).

## Tooling implications for CI

Because measurement is an ioctl plus a userspace digest computation, a CI harness can verify a composefs deployment without booting it: enable or measure verity on each metadata image and confirm the digest matches the name the install wrote under `/composefs/images`. The `measure_verity_opt` function in the bootc internals is the exact semantic a CI check should mirror: it returns None when the file has no fs-verity enabled or sits on a filesystem where fs-verity is unsupported, which is precisely the failure mode of a target formatted without the verity feature (weight 0.90, [measure_verity_opt](https://bootc-dev.github.io/bootc/internals/composefs/fsverity/fn.measure_verity_opt.html)).

A negative write test belongs in the same harness. A file with verity enabled is enforced read-only by the kernel, so a write attempt against a measured image object must fail; if the write succeeds, the measurement is not actually backing the object and the deployment is not sealed regardless of what the boot argument says.
