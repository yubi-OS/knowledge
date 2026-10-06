# 04 systemd-dissect integration

Scope: systemd-dissect as the yubiOS user-space composer of composefs layers, the mount modes the source doc documents, and the kernel floor each mode requires.

## The role of dissect in the yubiOS boot flow

Per the source doc (yubi-OS/yubiOS skills/composefs-kernel-floors/SKILL.md), systemd-dissect is the yubiOS user-space tool that composes composefs layers at boot. The yubiOS boot flow uses the catalog mode for the base /usr and the EROFS mode for sysext images where EROFS density matters. The kernel floors attach to the modes: the plain mount mode requires kernel 6.5, the catalog mode requires 6.6 plus verity=require, and the EROFS mode requires 6.12. All of these are source-doc claims.

## What the dig could and could not corroborate

The dig surfaced the Arch mirror of the systemd-dissect manual page (https://man.archlinux.org/man/systemd-dissect.1.en, weight 0.82) and the systemd source repository (https://github.com/systemd/systemd, weight 0.90). The retrieved excerpt of the man page covers image dissection and UID-range shifting (documented as added in version 258), not the composefs-specific mount modes. The systemd.io project site and general systemd explainers were also surfaced but scored low on relevance to this topic (weights 0.68, 0.44, 0.09, 0.12 in the two queries).

Consequently, the three mount mode flags below are source-doc claims without external corroboration in this dig:

- dissect --mount: mounts a composefs image, requires kernel 6.5.
- dissect --mount-with-catalog: mounts with a signed catalog, requires kernel 6.6 and verity=require.
- dissect --mount-with-erofs: mounts with EROFS backing, requires kernel 6.12.

Do not treat this as evidence the flags are wrong; the source doc is the primary source of record for the yubiOS flow. Treat it as an open verification item: before relying on the mode flags in automation, confirm them against the installed systemd-dissect version.

## Why the user-space/kernel split matters for floor audits

The floors in this skill are kernel floors, but the enforcement is exercised by user space: systemd-dissect is the component that passes the mount options (including verity=require, per the source doc) at boot time. The composefs upstream repository describes the same division of labor: an image is generated that points into a content-addressed object store and is mounted as the root filesystem, with fs-verity of the image anchored in the kernel command line (https://github.com/composefs/composefs, weight 0.86). A kernel that meets a floor is necessary but not sufficient; the boot flow must actually pass the matching options. This is the coupling the source doc's anti-pattern list calls out when it warns that a kernel of 6.5 or better without verity=require leaves the catalog informational only (source doc; see doc 06).

## The systemd-dissect option surface, per the dig

The manual page that the dig surfaced documents dissect's broader job: taking apart OS images for inspection, mounting them, and shifting container images into UID ranges (https://man.archlinux.org/man/systemd-dissect.1.en, weight 0.82). For yubiOS purposes the relevant slice is the mount path. The systemd repository is the authoritative implementation home for the tool (https://github.com/systemd/systemd, weight 0.90).

## Sources used in this doc

- https://github.com/systemd/systemd (weight 0.90)
- https://man.archlinux.org/man/systemd-dissect.1.en (weight 0.82)
- https://github.com/composefs/composefs (weight 0.86)
- https://systemd.io/ (weight 0.68, relevance-weighted)
- https://linuxvox.com/blog/systemd-in-linux/ (weight 0.44, weak)
- Source doc: yubi-OS/yubiOS skills/composefs-kernel-floors/SKILL.md
