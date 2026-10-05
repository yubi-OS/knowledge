# 06 - install to-filesystem

Scope: `bootc install to-filesystem` with the composefs backend: the externally-prepared target contract, the writable-filesystem requirement, `--root-mount-spec`, and how installation wires a composefs deployment.

## The external-preparation contract

`bootc install to-filesystem` installs into an externally created filesystem structure. In this variant of installation, the root filesystem alongside any necessary platform partitions, such as the EFI system partition, are prepared and mounted by an external tool or script before bootc runs (weight 0.23, weak backing, [bootc-install-to-filesystem man page, ManKier](https://www.mankier.com/8/bootc-install-to-filesystem)). The upstream man page states the same contract and specifies the required argument: ROOT_PATH is the path to the mounted root filesystem and is required; `--root-mount-spec` is the source device specification for the root filesystem, for example `UUID=2e9f4241-229b-4202-8429-62d2302382e1`, and if it is not provided, the UUID of the target filesystem will be used (weight 0.88, [bootc-install-to-filesystem.8.md](https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-install-to-filesystem.8.md)).

The Fedora bootc documentation frames when to choose this mode: more advanced installations, especially to bare metal, can be done via `bootc install to-filesystem`; you set up the target block storage and filesystem however you desire via external tools, then have your custom container image self-install to it (weight 0.93, [Configuring Storage, Fedora Docs](https://docs.fedoraproject.org/en-US/bootc/storage/)).

## The writable target requirement

Because bootc creates the deployment on the target, the destination must be mounted and writable when the install runs. This rules out using a read-only or fixed-layout filesystem as the install target. The composefs design resolves the apparent conflict: the physical sysroot stays a normal writable, fs-verity-capable filesystem such as ext4 or btrfs, and EROFS appears only as metadata-only images stored inside that filesystem. The install target is not formatted as EROFS; the composefs metadata images are what use EROFS (weight 0.93, [composefs-rs](https://github.com/composefs/composefs-rs)).

For the composefs path specifically, the target filesystem must support fs-verity, because the composefs objects and metadata images are measured on that filesystem. The Fedora filesystem documentation describes how this works in the default flow: Fedora and CentOS bootc enable the use of composefs for the root filesystem by default, but in an unsigned mode; when targeting a filesystem with fs-verity enabled, fs-verity will be turned on (weight 0.96, [Understanding the Fedora/CentOS bootc filesystem layout](https://docs.fedoraproject.org/en-US/bootc/filesystem/)). This is the distinction the yubiOS install encodes explicitly with `mkfs.ext4 -O verity`: formatting the target with the verity feature makes the sealed flow possible, and omitting it leaves the deployment with nothing to measure.

## Omitting the root= argument

The man page's `--root-mount-spec` option interacts with the composefs boot contract. Setting it to an empty string, `--root-mount-spec=""`, omits the `root=` kernel argument entirely, enabling Discoverable Partitions Specification auto-discovery, which is useful when the bootloader and initramfs both support the Boot Loader Interface (weak backing, weight 0.50, [Understanding bootc install](https://jmarrero.github.io/bootc/bootc-install.html)). In a composefs install the rootfs is specified by the `composefs=` argument rather than `root=`, so an install that leaves a `root=` argument in the boot entry is a smell: the composefs contract expects the digest argument to name the rootfs (weight 0.92, [composefs/composefs](https://github.com/composefs/composefs)).

## How the deployment is wired

Installation writes the composefs repository layout onto the target: content-addressed objects, metadata images named by digest, and per-deployment state. The Fedora storage page documents the general self-install flow, where the image itself performs the install against the prepared target (weight 0.93, [Configuring Storage, Fedora Docs](https://docs.fedoraproject.org/en-US/bootc/storage/)). At the image-build level, the osbuild integration shows the same contract from the builder side: the `org.osbuild.bootc.install-to-filesystem` stage runs bootc install to-filesystem and requires the disk image as one continuous device plus all relevant boot mount points such as /boot and /boot/efi prepared on the build host (weight 0.92, [osbuild stage documentation](https://osbuild.org/docs/developer-guide/projects/osbuild/modules/stages/org.osbuild.bootc.install-to-filesystem/)).

After installation, runtime growth is handled by a shipped unit: `bootc-generic-growpart.service` runs on each boot and attempts to expand the partition and filesystem backing the root device, with a known cloud-init interplay bug documented against RHEL (weight 0.83, [Configuring Storage, Fedora Docs](https://docs.fedoraproject.org/en-US/bootc/storage/)).

## What this means for the yubiOS install flow

The install command shape follows directly from the contract:

1. Format the target as ext4 with the verity feature, or btrfs, and mount it together with the ESP under the target path. The target must be writable and verity-capable (weight 0.93, [composefs-rs](https://github.com/composefs/composefs-rs)).
2. Run `bootc install to-filesystem --composefs-backend --bootloader=systemd --root-mount-spec="UUID=<uuid>" <target>`, letting bootc populate the deployment and select composefs during installation (weight 0.88, [bootc-install-to-filesystem.8.md](https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-install-to-filesystem.8.md)).
3. Verify the result against the composefs layout and digest contract rather than assuming it: the repository layout is not documented as stable (weight 0.53, [composefs::repository_format](https://docs.rs/composefs/latest/composefs/repository_format/index.html)), and the image-layout requirements for composefs installs are still an open documentation gap upstream (weight 0.61, [bootc issue 2237](https://github.com/bootc-dev/bootc/issues/2237)).

A CI smoke of the install should therefore assert the installed tree's shape, the fs-verity measurements of the metadata images, and the boot entry's digest reference, each as a separate check.
