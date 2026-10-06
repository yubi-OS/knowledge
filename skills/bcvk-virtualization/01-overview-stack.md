# 01 - Overview and Stack

**Scope:** what bcvk is, the virtualization stack it composes (podman, QEMU, virtiofsd, bootc image as rootfs), and how the pieces fit together for yubiOS development.

## What bcvk is

The source doc (yubi-OS/yubiOS skills/bcvk-virtualization/SKILL.md) defines bcvk (bootc-dev/bcvk) as "a Rust toolkit that runs bootc container images as ephemeral or persistent VMs using QEMU + virtiofsd, without root privileges" and names it "the primary dev/test loop for yubiOS". That positioning is confirmed by the upstream repository, which describes running a bootc container as an ephemeral VM as requiring no privileges because it is "just a wrapper for podman" that does require a virt stack (qemu, virtiofsd) in the host environment (https://github.com/bootc-dev/bcvk, jev weight 0.81, high).

## The stack, layer by layer

The source doc gives the stack as: podman (orchestration) + QEMU + virtiofsd + bootc image as rootfs. Each layer has a distinct job:

1. **podman** orchestrates the container lifecycle. Upstream states that "everything with bcvk ephemeral creates a podman container that reuses the host virtualization stack, making it simple to test bootc containers without requiring root privileges or dedicated VM infrastructure" (https://github.com/bootc-dev/bcvk, jev weight 0.83, high).
2. **QEMU** provides the machine. QEMU is a generic machine emulator and virtualizer that runs KVM and Xen virtual machines with near native performance (https://www.qemu.org/, jev weight 0.91, high).
3. **virtiofsd** bridges the container's filesystem into the VM; the source doc names it as the mechanism bcvk uses alongside QEMU.
4. **the bootc image** is the thing under test. bootc is the project for "boot and upgrade via container images", using standard OCI/Docker containers as the transport and delivery format for base operating system updates (https://github.com/bootc-dev/bootc, jev weight 0.66, high). The Fedora docs summarize bootable containers as "transactional, in-place operating system updates using OCI/Docker container images", where the kernel, bootloader, and drivers are all part of the container image (https://docs.fedoraproject.org/en-US/bootc/getting-started/, jev weight 0.58, high).

## Why this design matters for yubiOS

Red Hat's documentation describes bcvk as a tool that "bridges the gap between container development and hardware deployment", letting you launch ephemeral virtual machines from bootc containers to test bootable images locally before generating disk images for production (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/managing-image-updates-with-the-bootc-virtualization-kit-bcvk, jev weight 0.77, high). For yubiOS that means the same image artifact flows from CI (built with mkosi, per the source doc's CI example) through VM testing to disk flashing without changing format.

The podman-desktop bootc extension demonstrates the wider ecosystem the same stack serves: it uses bootc-image-builder to create bootable disk images from bootc containers, and once a machine is created from a disk image it can apply transactional updates in place from newly pushed container images (https://github.com/podman-desktop/extension-bootc, jev weight 0.58, high). osbuild's bootc-image-builder is the alternative image-production path: a container that creates disk images from bootc container inputs, oriented towards Fedora/CentOS bootc (https://osbuild.org/docs/bootc/, jev weight 0.63, high).

## Unprivileged by construction

The defining property is that the whole loop runs without root. The upstream repo's framing (wrapper for podman, host virt stack required) means the privilege boundary is podman's, not bcvk's (https://github.com/bootc-dev/bcvk, jev weight 0.81, high). The source doc's examples all operate on `dhi.io/yubi-OS/yubiOS:latest`, the yubiOS image, and never require sudo except in the native-to-disk path, which is covered in doc 04.

## Command decision matrix

The source doc fixes the mapping of use case to command. All rows are source-doc claims:

| Use case | Command |
|---|---|
| Dev/test loop, try a new image | `bcvk ephemeral run <image>` |
| Build a disk image for cloud/VM import | `bcvk to-disk <image> <out.img>` |
| Flash yubiOS to USB/NVMe (bare metal) | `bcvk native-to-disk <image> <device>` |
| Persistent VM (libvirt) | `bcvk libvirt run --name <name> <image>` |
| Upgrade a running VM | `bootc switch <new-image>` (inside VM) |

The upgrade row is the only one that runs inside the guest: upgrades are a bootc operation, not a bcvk operation, which is consistent with bootc's model of shipping OS updates as container images (https://github.com/bootc-dev/bootc, jev weight 0.66, high).
