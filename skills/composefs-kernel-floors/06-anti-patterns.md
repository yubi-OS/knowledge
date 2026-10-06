# 06 Anti-patterns

Scope: the six documented anti-patterns of the composefs-kernel-floors skill, why each one silently degrades the immutability guarantee, and the build-time guard the source doc prescribes.

## The list

The source doc (yubi-OS/yubiOS skills/composefs-kernel-floors/SKILL.md) documents six anti-patterns. The first five are yubiOS-specific operational mistakes; the sixth is a platform boundary. All six are source-doc claims.

1. Pinning a kernel older than 6.5 for stability. Composefs is the yubiOS load-bearing invariant; a kernel below 6.5 silently disables it. The source doc calls the stability gain a fiction, noting the composefs feature has been stable since 6.5. The external context (see doc 01) shows the data-only lower-layer mechanism is a documented upstream overlayfs feature (https://docs.kernel.org/filesystems/overlayfs.html, weight 0.93), which supports the doc's claim that the feature is not experimental.

2. Pinning 6.5 or newer but not enforcing verity=require. The kernel supports the feature but the mount option is never passed, so the catalog is informational only. The bootc sealed-images writeup describes what the enforcement option does when it is present: the kernel enforces that every file served through the mount has an fs-verity digest matching the EROFS metadata (https://bootc.dev/blog/2026-may-04-sealed-images-security-chain/, weight 0.57). Omitting the option gives you a mount that looks identical and verifies nothing.

3. Pinning 6.12 or newer but using block-device EROFS instead of file-backed. Per the source doc this wastes the density gain that file-backed EROFS provides. The kernel documentation confirms the file-backed mode exists as a distinct feature (CONFIG_EROFS_FS_BACKED_BY_FILE mounts images directly without a loopback block device, https://docs.kernel.org/filesystems/erofs.html, weight 0.94), so the distinction is real and checkable in a build config.

4. Documenting kernel floors in ADR-007 without maintaining this skill. Implicit constraints drift; the skill is the explicit reference. This is a documentation-hygiene anti-pattern: ADR-007 cites composefs but does not pin the kernel floors (source doc).

5. Skipping the kernel version check in mkosi build. Per the source doc, a yubiOS image built with a kernel older than 6.5 will boot but mount an unsigned /usr overlay; the doc prescribes adding a mkosi.prepare script that asserts the kernel version is at or above the required floor.

6. Using composefs on a non-Linux system. Composefs is Linux-only, and the source doc notes its metadata format derives from OCI image layers, suggesting Docker or OCI layers as the cross-platform alternative.

## The build-time guard, corroborated

The mkosi documentation confirms the mechanism the fifth anti-pattern prescribes: prepare scripts run on the image, with mkosi.prepare taking the final argument for the final run (https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md, weight 0.86; the mkosi project home at https://mkosi.systemd.io/ scored 0.67 and the Arch manual mirror of mkosi.1 at https://man.archlinux.org/man/mkosi.1.en scored 0.83). An assertion script that checks the installed kernel version against the floor table therefore has a supported hook to live in.

## Why the anti-patterns cluster the way they do

Four of the six are variants of the same failure: a floor is met in the kernel but not exercised by the boot flow (anti-pattern 2), a backing filesystem is chosen in the wrong mode (anti-pattern 3), the constraint is documented but not owned (anti-pattern 4), or the build never checks the kernel at all (anti-pattern 5). Only anti-pattern 1 and 6 are hard incompatibilities. That clustering is why the source doc treats the floor table plus the mkosi.prepare assertion as the minimal control pair: the table states the constraint, the assertion enforces it where images are actually built.

## Sources used in this doc

- https://docs.kernel.org/filesystems/overlayfs.html (weight 0.93)
- https://docs.kernel.org/filesystems/erofs.html (weight 0.94)
- https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md (weight 0.86)
- https://man.archlinux.org/man/mkosi.1.en (weight 0.83)
- https://bootc.dev/blog/2026-may-04-sealed-images-security-chain/ (weight 0.57)
- https://mkosi.systemd.io/ (weight 0.67)
- Source doc: yubi-OS/yubiOS skills/composefs-kernel-floors/SKILL.md
