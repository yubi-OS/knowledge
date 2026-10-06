# 08 - systemd-dissect verification tooling

**Scope:** systemd-dissect as the introspection and verification tool that ties the integrity stack together, what it can do with DDIs, its known dm-verity mount limitation, and how it relates to the sysext and confext services.

**Ground source:** yubi-OS/yubiOS `skills/dm-verity-and-integrity/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/dm-verity-and-integrity/SKILL.md). Claims marked "source doc" come from this file.

## Why dissect is the tie point

The source doc lists "configuring `systemd-dissect` to verify a composefs-sealed /usr" among the skill's triggers, and the systemd-dissect man page is the first external reference in its reference list (https://www.freedesktop.org/software/systemd/man/systemd-dissect.html). Dissect is the tool layer where a built image can be inspected, mounted, and verified before it ever boots: the same artifact that carries the dm-verity root hash, the composefs catalog, and the sysext/confext overlays is what dissect reads.

## What dissect does

The Arch manual page describes the tool's surface (weight 0.69, https://man.archlinux.org/man/systemd-dissect.1.en): systemd-dissect is a tool for introspecting and interacting with file-system OS disk images, specifically Discoverable Disk Images (DDIs), and it supports four different operations. DDIs are images whose partition layout is self-describing, which is what allows the tool (and the boot chain) to locate the /usr and usr-verity partitions without external metadata.

The systemd project itself is the suite providing the system and service manager (weight 0.79, https://github.com/systemd/systemd), and dissect ships inside it, so the tool's behavior tracks systemd releases rather than a standalone project.

## The known gap: dissect --mount and verity

The most operationally important data point for this corpus is an upstream issue (weight 0.70, https://github.com/systemd/systemd/issues/34807): with systemd version 255 on Fedora 40, kernel 6.11.3, x86_64, running `systemd-dissect --mount` on an image with a `usr` and `usr-verity` partition should also set up dm-verity, but the verify partition was not set up, so the mounted tree was not verity-checked. Component: systemd-dissect.

The lesson for yubiOS: dissect's inspection output is trustworthy for locating partitions and reading metadata, but mounting through dissect is not automatically equivalent to the boot-time veritysetup path. A workflow that relies on `systemd-dissect --mount` to produce a verified /usr view must confirm that the verity partition was actually established in that mount, rather than assuming it. This is exactly the class of integrity-block mismatch the source doc names as a debugging trigger.

## Relation to sysext and confext

The sysext manual page covers the runtime side of the layering that composefs composes offline (weight 0.69, https://man7.org/linux/man-pages/man8/systemd-sysext.8.html): the `systemd-sysext.service` and `systemd-confext.service` services are guaranteed to finish start-up before `basic.target` is reached, meaning that by the time regular services initialize, the files and directories they merge are in place. In the yubiOS model the sysext and confext images are composed into a signed catalog (doc 05); the systemd-sysext machinery is the adjacent, service-level mechanism that overlays extension images at boot, and the guarantee that it completes before `basic.target` is what makes extension-ordered service startup reliable.

## Verification workflow for yubiOS images

Assembling the source doc and the weighted sources:

1. Build the image with mkosi verity enabled and sign the root hash offline (doc 02; source doc).
2. Inspect the resulting DDI with systemd-dissect to confirm the partition layout, the `usr` and `usr-verity` partitions, and the embedded metadata (weight 0.69, https://man.archlinux.org/man/systemd-dissect.1.en).
3. If mounting the image for inspection, verify that a verity mount actually occurred; do not assume `--mount` performs the veritysetup-equivalent step (weight 0.70, https://github.com/systemd/systemd/issues/34807).
4. At boot, the composed /usr comes up through the BLS entry with its signed roothash (doc 03; source doc), and sysext/confext merging completes before `basic.target` (weight 0.69, https://man7.org/linux/man-pages/man8/systemd-sysext.8.html).

## Boundaries

The source doc scopes dissect to verification of the sealed image. The mkosi side of image construction is `mkosi-image-builder`, the bootc image-mode side is `bootc-images`, and the composefs kernel-support floors are `composefs-kernel-floors`. Dissect is the read-and-verify tool between the build and the boot.
