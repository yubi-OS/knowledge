# 04 - Native-to-Disk (Bare Metal Flash)

**Scope:** the `bcvk native-to-disk` path: flashing a yubiOS image straight onto a block device through a privileged podman container, its three invocation modes, and the safety checks that stand between the user and an overwritten disk.

## Why a second disk path exists

The source doc draws the distinction: `bcvk native-to-disk` "uses a privileged podman container to call `bootc install to-disk` directly - no QEMU, no virtiofsd. Faster. Works without KVM." Where `bcvk to-disk` (doc 03) boots an ephemeral VM and installs inside it, native-to-disk skips the VM entirely and talks to the target device from a privileged container on the host.

The privileged container is not a bcvk invention; it is what bootc requires. The bootc man page for the underlying command states: "Install to the target block device. This command must be invoked inside of the container, which will be installed. The container must be run in --privileged mode, and hence will be able to see all block devices on the system" (https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-install-to-disk.8.md, jev weight 0.72, high). The same man page notes "the default storage layout uses the root filesystem type configured in the container image, alongside any required system partitions such as the EFI system partition" (https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-install-to-disk.8.md, jev weight 0.72, high). This is the one place in the bcvk toolkit where root-equivalent privilege enters the pipeline, which is why the source doc's safety section matters.

## The three invocation modes

The source doc documents three forms:

```bash
bcvk native-to-disk dhi.io/yubi-OS/yubiOS:latest /dev/sda        # interactive confirmation required
bcvk native-to-disk --yes dhi.io/yubi-OS/yubiOS:latest /dev/sda  # non-interactive (CI/scripts)
bcvk native-to-disk --rootful dhi.io/yubi-OS/yubiOS:latest /dev/sda  # rootless-constrained environments
```

All three are source-doc claims. The interactive form is the human path: it prints what it is about to do and requires an explicit yes. `--yes` exists for CI and scripts where no human is present. `--rootful` is for environments where rootless podman cannot reach the device and the operation must fall back to a rootful container.

## The safety checklist

The source doc lists four safety behaviors: "validates block device, checks `/proc/mounts` for mounted partitions, prints model+size, requires 'yes' before writing." Read together with the bootc man page's warning that a privileged container can see all block devices on the system (https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-install-to-disk.8.md, jev weight 0.72, high), the checks are the only guard between a mistyped device argument and data loss. The `/proc/mounts` check catches the most common failure mode: the target device or one of its partitions being mounted somewhere on the host.

## Bare metal context from the wider bootc world

The Fedora bare metal documentation describes the deployment model this path serves: you can copy an image to a USB stick and "take it into an air-gapped/disconnected environment and perform a bare metal installation", with the container image as "the source of truth as much as possible" (https://docs.fedoraproject.org/en-US/bootc/bare-metal/, jev weight 0.70, high). Red Hat documents `bootc install` as the mechanism for "deploying a container image to bare metal" (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/deploying-the-rhel-bootc-images, jev weight 0.64, high), listing advanced installation with `to-filesystem` and `to-disk` as a distinct topic (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/deploying-the-rhel-bootc-images, jev weight 0.64, high).

The bootc project summary reinforces why a single container image can install itself: "Docker/OCI container images are just tarballs wrapped with some JSON. But in order to boot a system (whether on bare metal or virtualized), one needs a few key components: bootloader, kernel (and optionally initramfs), root filesystem" (https://jmarrero.github.io/bootc/bootc-install.html, jev weight 0.58, high). The image carries all of them, so a privileged container plus a block device is the whole install stack.

## Relation to the rest of the corpus

Doc 03 covers the VM-based image production path; this doc covers the direct device path. Doc 08 covers the LUKS + TPM enrollment gotcha that applies to both paths when the target install uses encrypted storage, and doc 05 covers what happens after flashing when the device is meant to become a persistent libvirt-managed VM.
