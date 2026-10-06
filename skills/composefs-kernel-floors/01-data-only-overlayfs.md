# 01 Data-only OverlayFS: the kernel 6.5 floor

Scope: what kernel 6.5 buys composefs on yubiOS (data-only OverlayFS as the primary backing filesystem), the mount options it requires, and what breaks on older kernels.

## The floor in one table row

The source doc (yubi-OS/yubiOS skills/composefs-kernel-floors/SKILL.md) fixes the first kernel floor at 6.5: data-only OverlayFS is the primary backing filesystem for composefs. The yubiOS stack uses composefs (per ADR-007) to layer signed sysext/confext images on top of the dm-verity-verified /usr base, and every composefs use case leans on this first floor being met. All claims in this section that are not otherwise sourced are source-doc claims.

## What data-only lower layers are, upstream

The OverlayFS kernel documentation describes data-only lower layers as a first-class concept: the paths of files in data-only lower layers are not visible in the merged overlayfs directories, and the metadata and st_ino/st_dev of files there are not visible in overlayfs inodes; only the data of files in data-only lower layers may become visible, when a metacopy-enabled layer composition needs it (https://docs.kernel.org/filesystems/overlayfs.html, weight 0.93; the same page fetched from www.kernel.org/doc/html/latest/filesystems/overlayfs.html scored 0.92). This is the mechanism the source doc means when it says the upper layer's modifications are merged into the lower layer at mount time so the upper layer is data-only with no actual overlay write tracking.

## The mount options the source doc requires

Per the source doc, data-only OverlayFS requires metacopy=off (do not duplicate metadata in the upper layer) and redirect_dir=off (do not redirect directories), plus a kernel that understands the data-only mount, which the doc places at 6.5. The kernel documentation itself discusses metacopy and redirect_dir interactions at length (https://www.kernel.org/doc/html/latest/filesystems/overlayfs.html, weight 0.92), including the statement that redirect_dir=follow only conflicts with metacopy=on if upperdir is given. A practitioner thread on overlayfs option tuning discusses disabling metacopy and redirect_dir in overlay deployments and notes that both defaults vary by system (https://github.com/amir73il/overlayfs/issues/9, weight 0.25, weak backing).

## Why composefs wants this configuration

The composefs upstream repository describes the design motivation: container image systems commonly untar each layer and stitch them with overlayfs at runtime, and composefs instead generates an image pointing into a content-addressed object store that is mounted as the root filesystem (https://github.com/composefs/composefs, weight 0.86). A composefs-focused writeup describes the specialized overlayfs configuration composefs uses for the operating system: no upper layer at all, so the mount is entirely read-only (https://scrivano.org/posts/2026-06-05-sealing-with-composefs/, weight 0.26, weak backing). Together these describe the same shape the source doc encodes: fs-only layers, no writable upper, immutable /usr.

## The failure mode on kernels older than 6.5

The source doc is explicit: without 6.5, composefs falls back to a writable upper layer. The mounted /usr is then mutable, which breaks the dm-verity invariant that /usr is immutable at every boot. The result is a yubiOS image that boots but cannot enforce its load-bearing invariant. No dig source directly corroborates this fallback behavior, so treat it as a source-doc claim with weak external backing (0 additional weight found in the dig).

## Dated correction note (2026-10-06)

The upstream OverlayFS documentation surfaced by the dig documents features beyond the source doc's floor table: since kernel 6.13, overlayfs supports specifying layers via file descriptors (lowerdir+, datadir+ options with the fsconfig syscall of the new mount API) (https://docs.kernel.org/filesystems/overlayfs.html, weight 0.93). The source doc does not mention this; it does not change the 6.5 floor for data-only layers, but a floor audit that reads only the source doc will miss the newer interface.

## Sources used in this doc

- https://docs.kernel.org/filesystems/overlayfs.html (weight 0.93)
- https://www.kernel.org/doc/html/latest/filesystems/overlayfs.html (weight 0.92)
- https://github.com/composefs/composefs (weight 0.86)
- https://github.com/amir73il/overlayfs/issues/9 (weight 0.25, weak)
- https://scrivano.org/posts/2026-06-05-sealing-with-composefs/ (weight 0.26, weak)
- Source doc: yubi-OS/yubiOS skills/composefs-kernel-floors/SKILL.md
