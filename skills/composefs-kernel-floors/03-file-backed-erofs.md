# 03 File-backed EROFS: the kernel 6.12 floor

Scope: the kernel 6.12 floor for file-backed EROFS, why EROFS is the alternate composefs backing, and where its density advantage comes from.

## The floor in the source doc

The source doc (yubi-OS/yubiOS skills/composefs-kernel-floors/SKILL.md) places the third floor at 6.12 for file-backed EROFS, the alternate backing filesystem for composefs. Per the source doc, yubiOS uses EROFS for sysext images that need high density, naming developer toolchains with many small files as the example workload, and the doc states EROFS is typically 5 to 15 percent smaller than Squashfs with faster decompression for sequential reads. These are source-doc claims.

## File-backed mounts, upstream

The EROFS kernel documentation states the feature directly: when CONFIG_EROFS_FS_BACKED_BY_FILE is enabled, EROFS file-backed images can be mounted directly without a loopback block device (https://docs.kernel.org/filesystems/erofs.html, weight 0.94). The LWN article covering the file-backed mount support patch (August 2024) records the patch series and its motivation (https://lwn.net/Articles/987624/, weight 0.69). This is the composefs-relevant mode: per the source doc, block-device EROFS works on older kernels but is not how composefs composes layers.

## Why EROFS over Squashfs

The EROFS project FAQ explains the compression choice: EROFS uses LZ4 by default because of its lowest decompression latencies among popular open-source algorithms, while SquashFS uses GZIP (https://erofs.docs.kernel.org/en/latest/faq.html, weight 0.89). The project overview describes EROFS as a modern, flexible, general-purpose, high-performance block-based immutable filesystem designed for use cases beyond storage savings while maintaining optimal runtime performance (https://erofs.docs.kernel.org/en/latest/, weight 0.85). LWN's introduction to EROFS describes it as a block-based read-only filesystem with a very simple format, developed because earlier read-only filesystems had many limitations, including weak compression support (https://lwn.net/Articles/934047/, weight 0.76).

A community benchmark comparing EROFS and Squashfs on SD-card-backed systems reports that Squashfs almost never aligns filesystem blocks with device blocks, so reads transfer data belonging to other blocks, while EROFS avoids this overhead (https://sigma-star.at/blog/2022/07/squashfs-erofs/, weight 0.26, weak backing). A newer comparison piece claims EROFS outperforms Squashfs in specific workloads, particularly random reads, container images, and systems with dm-verity (https://proteanos.com/doc/erofs-vs-squashfs-2026/, weight 0.11, weak backing). Neither source confirms the source doc's specific 5 to 15 percent size figure; treat that number as a source-doc claim without external corroboration in this dig.

## Where EROFS sits in the composefs stack

The composefs repository states that the composefs project uses an EROFS image file to store metadata (https://github.com/composefs/composefs, weight 0.86). Combined with the kernel docs on file-backed mounting, this is why the 6.12 floor matters to composefs specifically: composefs wants its EROFS layer to be a file in a content-addressed store, not a block device, and that mounting mode is the 6.12 feature. The bootc composefs backend documentation describes the deployment shape around it, with the composefs digest computed at build time and embedded in the unified kernel image command line (https://bootc.dev/bootc/experimental-composefs.html, weight 0.74).

## Dated correction note (2026-10-06)

The EROFS project overview describes current EROFS as a general-purpose filesystem rather than purely an embedded storage saver (https://erofs.docs.kernel.org/en/latest/, weight 0.85); the source doc's framing of EROFS as a density play is narrower than the current upstream positioning. The floors themselves are unaffected.

## Sources used in this doc

- https://docs.kernel.org/filesystems/erofs.html (weight 0.94)
- https://erofs.docs.kernel.org/en/latest/faq.html (weight 0.89)
- https://erofs.docs.kernel.org/en/latest/ (weight 0.85)
- https://github.com/composefs/composefs (weight 0.86)
- https://lwn.net/Articles/934047/ (weight 0.76)
- https://bootc.dev/bootc/experimental-composefs.html (weight 0.74)
- https://lwn.net/Articles/987624/ (weight 0.69)
- https://sigma-star.at/blog/2022/07/squashfs-erofs/ (weight 0.26, weak)
- https://proteanos.com/doc/erofs-vs-squashfs-2026/ (weight 0.11, weak)
- Source doc: yubi-OS/yubiOS skills/composefs-kernel-floors/SKILL.md
