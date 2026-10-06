# 03 - Disk Image Creation (to-disk)

**Scope:** how `bcvk to-disk` turns a bootc container image into a disk image file, what it runs internally, and the format, size, and filesystem knobs the source doc documents.

## The mechanism

The source doc states the mechanism directly: "bcvk boots an ephemeral VM and runs `bootc install to-disk` inside it." That makes to-disk a thin orchestration layer over the bootc installer, executed in the same unprivileged ephemeral-VM environment documented in doc 02.

Upstream confirms the chain and extends it: "The bcvk libvirt run command wraps bcvk to-disk which in turns wraps bootc install to-disk in an ephemeral VM. In some cases, you may want to create a disk image directly" (https://github.com/bootc-dev/bcvk, jev weight 0.82, high). So there are two consumers of the same machinery: you, when you want an output image file, and bcvk itself, when `libvirt run` needs a disk to attach.

## The commands

The source doc gives three invocation shapes:

```bash
bcvk to-disk dhi.io/yubi-OS/yubiOS:latest yubiOS.img          # default (raw)
bcvk to-disk --format qcow2 --disk-size 20G \
  dhi.io/yubi-OS/yubiOS:latest yubiOS.qcow2                   # qcow2 with custom size
bcvk to-disk --filesystem btrfs \
  dhi.io/yubi-OS/yubiOS:latest yubiOS.img                     # btrfs filesystem
```

All three are source-doc claims. The knobs are: output format (raw default, qcow2 optional), disk size (`--disk-size 20G` in the example), and filesystem (`--filesystem btrfs` in the example).

## What bootc install to-disk actually lays down

Because to-disk is a wrapper, the layout is decided by bootc, not bcvk. The bootc install documentation states: "The bootc install to-disk process only sets up a very simple filesystem layout, using the default filesystem type defined in the container image, plus hardcoded requisite platform-specific partitions such as the ESP" (https://jmarrero.github.io/bootc/bootc-install.html, jev weight 0.64, high). The same source notes there are two sub-commands, `bootc install to-disk` and `bootc install to-filesystem`, and that "nothing else (external) is required to perform a basic installation to disk - the container image itself comes with a baseline self-sufficient installer" (https://jmarrero.github.io/bootc/bootc-install.html, jev weight 0.62, high).

Filesystem defaults matter when you do not pass `--filesystem`. The Fedora storage documentation states: "The default filesystem type for CentOS is xfs. There is no default filesystem for Fedora, and you must choose one when generating a disk image or configure one in your derived container image via bootc install config" (https://docs.fedoraproject.org/en-US/bootc/storage/, jev weight 0.63, high). For yubiOS this means either the yubiOS image declares its filesystem, or every to-disk invocation must pass `--filesystem` explicitly.

## Where this sits in the bootc project

The Fedora bare metal documentation positions the installer: "A key goal of the bootc project is having the container image be the 'source of truth' as much as possible. A 'basic' installer is built into the bootc project and is available as bootc install to-disk or bootc install to-filesystem" (https://docs.fedoraproject.org/en-US/bootc/bare-metal/, jev weight 0.73, high). bcvk to-disk is therefore not a second installer; it is a convenient unprivileged driver for the one bootc ships.

## Alternatives for image production

The dig surfaced the wider ecosystem: osbuild's bootc-image-builder is "a container to create disk images from bootc container inputs, especially oriented towards Fedora/CentOS bootc or derivatives" (https://osbuild.org/docs/bootc/, jev weight 0.63, high), and the podman-desktop bootc extension wraps it (https://github.com/podman-desktop/extension-bootc, jev weight 0.58, high). For yubiOS the source doc keeps bcvk to-disk as the path; bootc-image-builder is the comparison point when cloud-specific formats (AMI, ISO) are needed, which bcvk does not claim to produce in the source doc.

The source doc also lists `bcvk native-to-disk` for flashing a block device directly rather than producing an image file; that path is covered in doc 04.
