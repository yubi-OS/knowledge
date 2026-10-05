# 02. RootImage: image-rooted containers

Scope: booting systemd-nspawn from a full OS disk image (RootImage= and -i), mkosi-produced images, the .nspawn settings-file convention, and credentials passed into the image-rooted container.

## Directory trees versus disk images

The manual page states the base capability plainly: systemd-nspawn may be invoked on any directory tree containing an operating system tree ([freedesktop.org systemd-nspawn(1)](https://www.freedesktop.org/software/systemd/man/latest/systemd-nspawn.html), jev 0.96). The manual's own worked example builds a minimal Fedora release directly into the machine image directory with dnf, using --installroot=/var/lib/machines/f44, and then boots it ([man7.org systemd-nspawn(1), Example 2](https://man7.org/linux/man-pages/man1/systemd-nspawn.1.html), jev 0.96). Directory trees are the simple case.

The disk-image case is what makes nspawn image-rooted rather than tree-rooted: the container root is a raw OS image, typically produced by mkosi, rather than a populated directory. mkosi describes itself as "a fancy wrapper around dnf --installroot, apt, pacman and zypper that generates customized disk images" ([mkosi.systemd.io](https://mkosi.systemd.io/), jev 0.74). Lennart Poettering's mkosi announcement shows the pairing directly: build with mkosi, then boot the result with systemd-nspawn -bi image.raw, including the btrfs raw-image variant built with mkosi -t raw_btrfs --bootable ([0pointer.net: mkosi, A Tool for Generating OS Images](https://0pointer.net/blog/mkosi-a-tool-for-generating-os-images.html), jev 0.70). The systemd org's mkosi repository states the same pairing in its own description, "Build Bespoke OS Images" ([github.com/systemd/mkosi](https://github.com/systemd/mkosi), jev 0.73).

## What the image bootleg exercises that a directory tree does not

Booting from a raw image exercises partition parsing, filesystem probing, and image layout, none of which a directory tree touches. That is precisely the layer the yubiOS convention cares about: the family record names "RootImage= off the signed mkosi image" as the nspawn mechanic that would consume the same signed-image digest the build policy admits, and records that this boundary has no CI leg today ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc). An image-rooted nspawn leg is therefore also an image-format leg: it fails if mkosi changes output layout, not just if nspawn changes.

## The .nspawn settings-file convention

The mkosi manual documents the packaging side of the pairing: the mkosi.nspawn nspawn settings file is copied into the same place as the output image file, if it exists, "since nspawn looks for settings files next to image files it boots, for additional container runtime settings" ([mkosi.1.md in systemd/mkosi](https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md), jev 0.82). The nspawn manual page describes the same contract from the consumer side: settings files override the default options used by the systemd-nspawn@.service template unit file, making it usually unnecessary to alter that template directly ([freedesktop.org systemd-nspawn(1)](https://www.freedesktop.org/software/systemd/man/latest/systemd-nspawn.html), jev 0.94). In other words, an mkosi-built image can carry its own runtime configuration as a sidecar file, and any image-rooted CI leg inherits that configuration for free.

## Overlay extension images on top of the root

The portable-services introduction, which uses the same image machinery, records that a base or OS image, and each upper extension image, can be a plain sub-directory, a btrfs subvolume, or a raw disk image, and that such a portable image "can be run as OS container, using systemd-nspawn, by booting the image with systemd-nspawn -i -b" ([systemd.io: Portable Services Introduction](https://systemd.io/PORTABLE_SERVICES/), jev 0.94). This is the documented overlap between the RootImage path and the portable-service path: the same image artifact forms, with a one-flag difference, either an attached portable service or a booted nspawn container.

## Credentials across the image boundary

Passing secrets into an image-rooted container is a first-class mechanism, not an afterthought: systemd's credentials document records that systemd-nspawn(1)'s --set-credential= and --load-credential= switches pass arbitrary credentials from host to container payload ([systemd.io: Credentials](https://systemd.io/CREDENTIALS/), jev 0.81). For a dev-environment leg rooted off a signed image, this is the supported path for host-provided material without baking it into the image.

## The template-unit default

The manual page notes that the systemd-nspawn@.service template unit file makes use of the --boot option, which is not the default when systemd-nspawn is invoked from the interactive command line ([freedesktop.org systemd-nspawn(1)](https://www.freedesktop.org/software/systemd/man/latest/systemd-nspawn.html), jev 0.91). Anyone writing a CI leg that boots an image with -i must therefore also decide explicitly about -b, because the service path and the direct-invocation path do not share that default.

## Sub-claims recap

1. nspawn accepts both directory trees and raw disk images as the container root (weight 0.96).
2. mkosi produces those raw images, and the documented test loop is mkosi build, then nspawn -bi (weights 0.74, 0.70).
3. The .nspawn sidecar settings file travels with the image and overrides service defaults (weights 0.82, 0.94).
4. The same image artifact is shared with portable services, which boot it with -i -b (weight 0.94).
5. Credentials cross the boundary via --set-credential= and --load-credential= (weight 0.81).
6. In yubiOS, this is the one boundary that consumes the signed image through no tested leg (source-doc record).
