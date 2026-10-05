# 08 - initramfs root setup

Scope: the initramfs side of the bootc composefs path: the 51bootc dracut module, bootc-root-setup.service, the setup-root-conf.toml handoff, and the work the initramfs does to assemble the composefs root before switch-root.

## bootc-root-setup.service

`bootc-root-setup.service` is a oneshot systemd service that runs inside the initramfs to set up the root filesystem when the composefs backend is active. It is gated on the `composefs=` kernel command line argument and on `ConditionPathExists=/etc/initrd-release`, so it only ever runs inside an initramfs and only when the boot path actually references a composefs digest (weight 0.92, [bootc-root-setup.service.5.md](https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-root-setup.service.5.md); corroborated at weight 0.83 by the [bootc.dev man page](https://bootc.dev/bootc/man/bootc-root-setup.service.5.html)).

The service and its binary, `/usr/lib/bootc/initramfs-setup`, are installed into the initramfs by the 51bootc dracut module. The module also installs `/usr/lib/composefs/setup-root-conf.toml` into the initramfs when that file is present on the host image, so image authors do not need manual `dracut --include` invocations (weight 0.70, [bootc-root-setup man page mirror](https://github.com/bootc-dev/agentic-workflows-ci-sandbox/blob/main/docs/src/man/bootc-root-setup.service.5.md)).

## setup-root-conf.toml

The `bootc-setup-root-conf.toml` file is the declarative handoff between the image and the initramfs. The 51bootc dracut module installs this file into the initramfs automatically when it is present on the host image. Image authors can therefore ship the file at its canonical path in their container image and rebuild the initramfs with a plain `dracut --force`; no `--include` flags are needed (weight 0.79, [man bootc-setup-root-conf.toml](https://jmarrero.github.io/bootc/man/bootc-setup-root-conf.5.html)).

The same contract is documented from the man page side: the 51bootc module installs the file into the initramfs automatically when present, so image authors ship it in the container image and rebuild (weak backing, weight 0.19, [bootc-setup-root-conf, ManKier](https://www.mankier.com/5/bootc-setup-root-conf); corroborated at weight 0.79 by the bootc.dev-hosted page above).

## 51bootc is not enabled by default

The 51bootc module is not enabled by default, so that a plain `apt install bootc` or `dnf install bootc` does not pull initramfs integration into every system that installs the package. Base images are the ones that should enable it, via a config file in a location such as `/usr/lib/dracut/dracut.conf.d` (weight 0.79, [man bootc-root-setup.service, bootc.dev](https://bootc.dev/bootc/man/bootc-root-setup.service.5.html)).

This default-off choice matters for yubiOS image builds in both directions. An image that expects the composefs initramfs flow but ships only the bootc package without enabling the module will boot into a system that cannot assemble its composefs root. A base image that enables the module ships the service, the `initramfs-setup` binary, and the config handoff in every initramfs it generates (weight 0.70, [bootc-root-setup man page mirror](https://github.com/bootc-dev/agentic-workflows-ci-sandbox/blob/main/docs/src/man/bootc-root-setup.service.5.md)).

## What the service does at boot

The initramfs-side work is the root-setup half of the composefs design. When the `composefs=` argument is present, the service prepares the root filesystem for the composefs backend: the composefs repository is opened from the physical sysroot, the selected metadata image and its referenced objects are verified against their fs-verity measurements, writable per-deployment state is assembled, and the prepared tree replaces the sysroot root before the initramfs switches root. This is the mechanism that turns the physical, writable sysroot filesystem plus the authenticated EROFS metadata image into the mounted root the running system sees (weight 0.92, [bootc-root-setup.service.5.md](https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-root-setup.service.5.md)).

The design intent behind putting this in the initramfs is bootc's own positioning: bootc is intended as a fresh, container-native interface, and ostree is an implementation detail (weight 0.65, [Filesystem, bootc.dev](https://bootc.dev/bootc/filesystem.html)). The composefs assembly is deliberately a boot-time, kernel-adjacent operation rather than a userspace post-boot migration, which is what makes the integrity enforcement observable before userspace runs.

## The gating chain

The gate conditions give CI and auditors a precise vocabulary for what a boot actually did:

1. `composefs=` present in the kernel command line is the trigger. Without it the service does nothing and the boot is not a composefs boot (weight 0.92, [bootc-root-setup.service.5.md](https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-root-setup.service.5.md)).
2. `/etc/initrd-release` present is the environment gate. The service is inert outside an initramfs, so its actions are attributable to boot assembly only (weight 0.83, [man bootc-root-setup.service, bootc.dev](https://bootc.dev/bootc/man/bootc-root-setup.service.5.html)).
3. The 51bootc module content, the service unit, the `initramfs-setup` binary, and `setup-root-conf.toml`, must physically exist inside the initramfs. A CI check can inspect the initramfs contents directly for the shipped `51bootc` content before ever booting (weight 0.70, [bootc-root-setup man page mirror](https://github.com/bootc-dev/agentic-workflows-ci-sandbox/blob/main/docs/src/man/bootc-root-setup.service.5.md)).

A verification harness for the yubiOS install flow should check all three: the initramfs carries the 51bootc payload, the boot argument triggers the gate, and the on-disk repository the service will open matches the layout and digest contract of docs 01 and 04. A smoke that only boots and observes success cannot distinguish a composefs-root boot from a fallback path that silently skipped the service.
