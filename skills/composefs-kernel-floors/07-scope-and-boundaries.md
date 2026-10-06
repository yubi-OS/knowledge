# 07 Scope and boundaries

Scope: when the composefs-kernel-floors skill applies, the neighboring topics it explicitly excludes, and the platform boundary it enforces.

## The use cases the skill claims

Per the source doc (yubi-OS/yubiOS skills/composefs-kernel-floors/SKILL.md), the skill is the single reference for which kernel version a yubiOS image needs for a given composefs use case. Its six stated use cases:

1. Picking a kernel version for a new yubiOS image (6.12 or newer for the full composefs feature set).
2. Picking a kernel version for an image that supports only the base feature (6.5 or newer for data-only OverlayFS).
3. Debugging a composefs mount failure with a kernel-too-old style error.
4. Choosing between OverlayFS and EROFS as the backing filesystem for a specific sysext or confext image.
5. Auditing a yubiOS build's kernel against the composefs requirements.
6. Updating PINNED.md with the kernel version floor rationale.

## The exclusions

The source doc names four explicit do-not-use boundaries:

- General kernel version selection that is not composefs-specific.
- dm-verity itself: per the source doc, kernel 4.4 or newer supports dm-verity, and that floor is out of this skill's scope.
- IMA and fs-verity: separate kernel floors, not covered by this skill.
- Non-Linux systems: composefs is Linux-only, with no equivalent on macOS or Windows.

## What the digs confirm about the boundaries

The dm-verity boundary is grounded upstream: the kernel's device-mapper documentation describes the verity target as providing transparent integrity checking of block devices using a cryptographic digest, read-only by construction, with on-disk hash format versions and a metadata header verified by user space (https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html, weight 0.93; the same page mirrored at https://docs.kernel.org/admin-guide/device-mapper/verity.html scored 0.93). The source doc's 4.4 floor claim itself is a source-doc claim; the dig confirms the mechanism but the retrieved excerpts do not state a version floor, so treat the 4.4 figure as source-doc-only.

The ArchWiki dm-verity page situates the mechanism inside the boot chain the yubiOS floors live in: a unified kernel image containing the stub EFI loader, kernel, initramfs, kernel command line, and microcode, with verity intended as one of the last steps in a boot process that protects the platform (https://wiki.archlinux.org/title/Dm-verity, weight 0.55).

The fs-verity and IMA boundary is likewise grounded upstream: the fs-verity documentation states that IMA supports fs-verity file digests as an alternative to its traditional full file digests, and that IMA appraisal enforces that files contain a valid, matching signature in the security.ima extended attribute as controlled by the IMA policy (https://docs.kernel.org/filesystems/fsverity.html, weight 0.95; the same page surfaced again at weight 0.81). The fsverity-utils repository adds the built-in signature mode, where the policy of which files must be signed is determined and enforced by a trusted component (https://android.googlesource.com/platform/external/fsverity-utils/, weight 0.81). This is exactly why the source doc keeps IMA and fs-verity floors out of scope: they are separate kernel mechanisms with their own version histories, adjacent to composefs but not part of its floor table.

The Linux-only boundary is supported indirectly by the composefs repository, which frames the project around Linux kernel integration throughout (https://github.com/composefs/composefs, weight 0.86).

## Practical routing rule

The source doc adds a boundary-case rule in its Examples section: when a request names a trigger (for example composefs or kernel floor) without naming the artifact it acts on, route to the owning surface instead of improvising. In the yubiOS skill corpus the adjacent owners are: dm-verity-and-integrity for dm-verity, IMA, and fs-verity floors; bootc-images for composefs integration in image mode; mkosi-image-builder for composefs catalog generation at build time; and 0pointer-mastery for the sysext overlay model (source doc References section).

## Sources used in this doc

- https://docs.kernel.org/filesystems/fsverity.html (weight 0.95, 0.81)
- https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html (weight 0.93)
- https://docs.kernel.org/admin-guide/device-mapper/verity.html (weight 0.93)
- https://github.com/composefs/composefs (weight 0.86)
- https://android.googlesource.com/platform/external/fsverity-utils/ (weight 0.81)
- https://wiki.archlinux.org/title/Dm-verity (weight 0.55)
- Source doc: yubi-OS/yubiOS skills/composefs-kernel-floors/SKILL.md
