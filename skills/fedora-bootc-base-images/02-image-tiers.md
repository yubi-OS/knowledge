# 02 - Image tiers

Scope: the 3 Fedora tier definitions (standard, minimal-plus, minimal), what each package set contains, how the tiers relate, and which tiers are officially published versus dev/testing.

Ground source: `yubi-OS/yubiOS skills/fedora-bootc-base-images/SKILL.md`. This doc explicates the source doc's "Image tiers (Fedora standard repo)" section.

## The tier table

The source doc defines the tiers as follows (source doc):

| Tier | Image | Package set |
|---|---|---|
| **standard** | `quay.io/fedora/fedora-bootc` | Full: kernel, systemd, NetworkManager, podman, LUKS, LVM, RAID, sos, jq, etc. |
| **minimal-plus** | quay.io/bootc-devel/fedora-bootc-{N}-minimal-plus | Shared base for IoT, Atomic Desktops, CoreOS: kernel + systemd + bootc + networking basics |
| **minimal** | quay.io/bootc-devel/fedora-bootc-{N}-minimal | Smallest bootable reference: kernel + systemd + bootc only |

The inheritance direction the source doc records is that minimal-plus and minimal sit below standard: standard is the full set, minimal-plus strips to a shared base used by IoT, Atomic Desktops, and CoreOS, and minimal is the smallest bootable reference (source doc). The Fedora docs independently describe the bottom of the chain: the minimal image "has almost nothing; just kernel systemd bootc; everything else (including e.g. networking) you need to add" (https://docs.fedoraproject.org/en-US/bootc/base-images/, jev weight 0.93). That matches the source doc's "kernel + systemd + bootc only" package set and confirms that networking, not just userspace tools, is what minimal-plus adds back.

## Which tiers are officially published

Only the standard tier is officially published to `quay.io/fedora/`. The minimal and minimal-plus images use the `bootc-devel` registry for dev and testing (source doc). This is a trap for consumers: if a project wants to build from a minimal-plus image, it is building from a dev/testing artifact with no official publication guarantee. The `{N}` in the bootc-devel tags is the Fedora release number, so the tier images are version scoped the same way the standard tag is (`fedora-bootc:{version}`, source doc).

The Fedora docs hub confirms the general shape of the tier story from the project's own documentation pages, which describe these images as the reference "base images" for bootable containers (https://docs.fedoraproject.org/en-US/bootc/, jev weight 0.93).

## Why yubiOS standardizes on standard

The source doc states that yubiOS derives from Fedora standard (source doc). Two reasons follow from the tier table and the dig:

1. The standard tier already ships the storage and boot stack yubiOS needs: LUKS, LVM, RAID, systemd, NetworkManager, and bootc (source doc). Deriving from minimal would mean re-adding the entire networking and storage surface that standard already carries, which is a maintenance liability rather than a security win.
2. Standard is the only tier with an official published tag on quay.io/fedora, so digest pinning (doc 03) is anchored to an artifact that upstream actually publishes and supports (source doc).

## When a lower tier would be right

The minimal tier is a legitimate choice for a from-scratch style build where the derived image intends to own every package beyond the bootable core. The Fedora docs frame from-scratch base images as the path that gives you control over base image content so you can own the OS stream (https://docs.fedoraproject.org/en-US/bootc/building-from-scratch/, jev weight 0.92). For yubiOS that tradeoff was already made in favor of standard, so the lower tiers matter here mainly for understanding what upstream's shared base for IoT and Atomic Desktops looks like.

## Weak-backing caveats

The tier table itself is a source doc record. The dig corroborated the minimal tier description and the project framing with 0.93 weight sources, but did not surface an independent page enumerating all 3 tier names; the tier names as given (standard, minimal-plus, minimal) rest on the source doc, which is the primary source of record for this corpus. Treat the bootc-devel image names as subject to upstream change and verify the current tag layout before relying on a specific `{N}` tag.
