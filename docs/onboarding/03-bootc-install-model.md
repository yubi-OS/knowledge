# 03. The bootc Install Model

Scope: how yubiOS installation experiments work under the bootc to-filesystem model: preparing and mounting the target filesystems first, the podman-wrapped bootc command shape with its documented flags, why the command runs privileged with host mounts, and the destructive-disk safety rule.

Grounding spine: yubi-OS/yubiOS docs/ONBOARDING.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/ONBOARDING.md), last reviewed 2026-07-11.

## The to-filesystem model

The source doc states that installation documentation currently tracks the bootc to-filesystem model: prepare and mount the target filesystems first, with the target root at /mnt and the boot filesystem at /mnt/boot, then run bootc against that mounted tree (source doc). The bootc project documents install to-filesystem as the mode that installs to an already-prepared filesystem rather than partitioning the disk itself (https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-install-to-files, weight 0.44, weak backing; https://www.mankier.com/8/bootc-install-to-filesystem, weight 0.32, weak backing). A bootc walkthrough describes the same division of labor: the caller owns disk layout, bootc owns installing the image's root onto it (https://jmarrero.github.io/bootc/bootc-install.html, weight 0.52). This split is why the yubiOS doc begins with "prepare and mount the target filesystems first": bootc expects the mountpoint to exist and be populated with a boot filesystem before it runs.

## The exact command shape

The source doc gives a full worked command (source doc). It sets IMAGE=docker.io/0mniteck/yubios:latest, pulls the image with podman, then runs it in a privileged container with --rm, --pid=host, --ipc=host, --security-opt label=type:unconfined_t, bind mounts of /var/lib/containers, /dev, and the host root at /: /run/host, and finally invokes bootc install to-filesystem with the flags --source-imgref="registry:${IMAGE}", --bootloader=systemd, --root-mount-spec="", --composefs-backend, --skip-finalize, targeting /run/host/mnt/ (source doc). Each flag carries meaning:

- The container runs privileged with host PID and IPC namespaces and a /dev bind because installing to disk requires direct device access; the host root is mounted at /run/host so the target tree /mnt is reachable inside the container as /run/host/mnt (source doc; the device-access requirement follows from the bootc install target being a mounted filesystem, https://github.com/bootc-dev/bootc, weight 0.31, weak backing).
- --source-imgref="registry:${IMAGE}" tells bootc to resolve the source image through the registry rather than the local container store (https://jmarrero.github.io/bootc/bootc-install.html, weight 0.52).
- --bootloader=systemd selects the systemd-boot style bootloader layout rather than the default GRUB path (https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-install-to-files, weight 0.44, weak backing).
- --composefs-backend selects the composefs deployment backend. bootc documents composefs as an experimental backend for bootable containers (https://bootc.dev/bootc/experimental-composefs.html, weight 0.30, weak backing), and the bootc composefs boot module documentation describes how the composed root is assembled and verified at boot (https://bootc-dev.github.io/bootc/internals/bootc_lib/bootc_composefs/boot/index, weight 0.51).
- --root-mount-spec="" leaves the root mount specification empty so the kernel cmdline does not hardcode a root= device, consistent with mounting the target by path rather than by partition UUID (source doc).
- --skip-finalize defers the finalization step of the install (https://www.mankier.com/8/bootc-install-to-filesystem, weight 0.32, weak backing).

## The drift and correctness warning

The doc closes the section with two rules: use the exact command shape documented by the current bootc release and the yubiOS workflow, and never test destructive install commands against a disk with data you need (source doc). The first rule exists because bootc's install flags have been an active surface: the bootc issue tracker shows behavior around default boot entries and boot ordering still being worked out (https://github.com/bootc-dev/bootc/issues/1777, weight 0.47, weak backing), and the project's getting-started guidance evolves with releases (https://docs.fedoraproject.org/en-US/bootc/getting-started/, weight 0.47, weak backing). The second rule is absolute: install to-filesystem overwrites the target tree's boot configuration, so the target must be a scratch disk or a VM disk.

## Why the doc teaches an experiment shape

The section is titled for "installation experiments", not production installs (source doc). The mount-first model makes the experiment repeatable and contained: the operator controls exactly which mounted tree bootc sees, the container wrapper keeps the host's running system untouched, and the flag set records the intended deployment shape (systemd bootloader, composefs backend) explicitly instead of relying on defaults. A contributor reproducing the flow should treat the documented command as the 2026-07-11 baseline and re-check the current bootc man page for their bootc version before writing to any real disk.
