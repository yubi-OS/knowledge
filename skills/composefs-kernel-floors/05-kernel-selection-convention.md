# 05 Kernel selection convention: PINNED.md and the three tiers

Scope: the yubiOS convention for picking the lowest-supported kernel that supports the needed composefs feature set, the three channel tiers, and the pre-composefs fallback.

## The convention

Per the source doc (yubi-OS/yubiOS skills/composefs-kernel-floors/SKILL.md), the yubiOS PINNED.md convention is to pick the lowest-supported kernel that supports the full feature set needed. As of the doc's 2026-08 default the three tiers are:

- Production yubiOS: kernel 6.12 or newer (full composefs feature set, EROFS where applicable).
- Long-term-support (LTS) yubiOS: kernel 6.6 or newer (data-only OverlayFS plus verity=require, no EROFS).
- Experimental or pre-release: kernel 6.5 or newer (data-only OverlayFS only, no signed-catalog enforcement).

These are source-doc claims. The convention's shape is the notable part: each tier maps exactly to one kernel floor from the floor table, so a channel's kernel floor is a statement about which composefs guarantees that channel is willing to enforce.

## The floor below the floors

Per the source doc, a yubiOS image using a kernel older than 6.5 cannot use composefs at all; it must use the pre-composefs dm-verity-only path, which ADR-007 explicitly discourages. This is the hard edge of the convention: the floor table is not a menu of equivalent options but a set of minimums, and the lowest tier is itself a compromise.

## Real-world deployment precedent

The digs turned up two production-adjacent data points that the convention sits within. Fedora CoreOS introduced composefs enabled by default starting in Fedora 41; the documentation describes composefs as an overlay filesystem where the data comes from the usual ostree deployment and metadata is in the composefs file, producing a truly read-only root filesystem that increases system integrity (https://docs.fedoraproject.org/en-US/fedora-coreos/composefs/, weight 0.87). The bootc composefs backend documentation describes the sealing model around it: a SHA-512 hash of the entire root filesystem computed at build time, embedded in the kernel command line of a unified kernel image and required to match at boot, with sealed and unsealed modes distinguished by whether fs-verity enforcement is optional (https://bootc.dev/bootc/experimental-composefs.html, weight 0.77, and the same page surfaced again at weight 0.74).

Neither source pins a kernel floor of its own in the retrieved excerpts; what they corroborate is that the composefs deployment pattern the yubiOS tiers encode (content-addressed root, digest anchored at boot, read-only root) is in production use upstream, which makes the yubiOS convention's kernel-floor discipline a defensible stance rather than a speculative one.

## What the convention asks of an image author

Applying the convention is a three-step check, all per the source doc:

1. Determine the composefs feature set the image needs: data-only OverlayFS alone, or data-only OverlayFS plus signed-catalog enforcement, or the full set including file-backed EROFS.
2. Map that to the minimum kernel: 6.5, 6.6, or 6.12 respectively.
3. Record the chosen kernel and its rationale in PINNED.md, keeping the lowest version that covers the requirement.

A kernel-version audit of an existing yubiOS build walks the same steps in reverse: find the image's kernel version, find which composefs features the image actually uses at boot (mount mode flags in the boot flow, see doc 04), and confirm the kernel meets the corresponding floor.

## Weak-backing note on kernel timelines

The dig's query for general kernel version context returned mostly off-topic results; the one usable hit, the Wikipedia Linux kernel version history page (https://en.wikipedia.org/wiki/Linux_kernel_version_history, weight 0.41, weak backing), is an aggregator. This corpus deliberately does not rest any floor claim on it: the 6.5, 6.6, and 6.12 floors are grounded in the source doc and, for 6.6, in the mount.composefs man page evidence in doc 02 (kernel support added in 6.6rc1, weight 0.82 via https://manpages.opensuse.org/Tumbleweed/composefs/mount.composefs.1). LTS status of the specific kernel series is a separate question from the floors and should be checked against kernel.org when choosing a channel.

## Sources used in this doc

- https://docs.fedoraproject.org/en-US/fedora-coreos/composefs/ (weight 0.87)
- https://bootc.dev/bootc/experimental-composefs.html (weight 0.77, 0.74)
- https://manpages.opensuse.org/Tumbleweed/composefs/mount.composefs.1 (weight 0.82)
- https://en.wikipedia.org/wiki/Linux_kernel_version_history (weight 0.41, weak)
- Source doc: yubi-OS/yubiOS skills/composefs-kernel-floors/SKILL.md
