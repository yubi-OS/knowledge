# 01 - The bootc model: booting an OS from an OCI image

Scope: what bootc is, how an OCI container image becomes a bootable system, and why OSTree plus composefs makes updates atomic and reversible.

## What bootc does

bootc performs "transactional, in-place operating system updates using OCI/Docker container images" (docs.fedoraproject.org/en-US/bootc/getting-started/, w=0.92). The same tooling that builds application containers builds the operating system: a Containerfile produces an OCI image, and that image is what the machine boots. The bootc project describes itself as the kernel-facing extension of this idea, positioning container images as the artifact for immutable OS delivery (bootc.dev/bootc/, w=0.76; github.com/bootc-dev/bootc, w=0.83).

The defining property is that the image contains the entire system: kernel, initramfs, and userspace. The bootc documentation states that "the Linux kernel (and optionally initramfs) is embedded in the container image" with the canonical location at /usr/lib/modules (bootc.dev/bootc/bootc-images.html, w=0.86). There is no package manager transaction at boot time and no drift between what was built and what runs.

## From container image to running system

At runtime the image is unpacked and staged by OSTree into a deployment, and the running system is not "a container" in the Docker sense. The bootc README is explicit: "At runtime on a target system, the base userspace is not itself running in a 'container' by default" (github.com/bootc-dev/bootc, w=0.83). The container image is the transport and storage format; the deployed root is a real filesystem tree.

Updates are staged as a second deployment and swapped in at reboot, which is the A/B pattern OSTree has always used. OSTree's own documentation describes atomic upgrades as the core design: the new deployment is fully prepared before the old one is retired, so an interrupted upgrade leaves the previous boot intact (ostreedev.github.io/ostree/atomic-upgrades/, w=0.74). The CentOS Automotive SIG frames the same mechanism for embedded use: "By using OSTree through bootc, AutoSD delivers an image-based update mechanism" with bandwidth-efficient delta updates (sigs.centos.org/automotive/autosd-10/features-and-concepts/con_ostree.html, w=0.56).

## composefs closes the integrity gap

Classic OSTree deployments leave the booted root as a mutable-looking directory tree backed by hardlinks. composefs changes the semantics: the booted root is a read-only EROFS-backed mount whose content is verified against a signed digest list. The composefs project describes itself as combining "the reliability of disk images" with filesystem flexibility (github.com/composefs/composefs, w=0.54), and the OSTree project documents composefs integration as the path to verified, immutable boots (ostreedev.github.io/ostree/composefs/, w=0.80). bootc's own docs cover the composefs backend as the modern layout, noting it boots via a traditional vmlinuz/initramfs pair or a UKI (bootc.dev/bootc/experimental-composefs.html, w=0.84).

## The yubiOS pattern

The source doc (yubi-OS/yubiOS skills/bootc-images/SKILL.md) fixes the yubiOS position on this model:

1. systemd is PID 1 inside the booted image, not a container init shim.
2. Updates are "atomic A/B deployments staged via OSTree + composefs" (source doc).
3. The image is built from a digest-pinned minimal base (dhi.io/debian-base), consistent with the org's supply-chain rules where every FROM is digest pinned.
4. The booted /usr is the immutable surface; /etc merges, /var persists. Doc 04 covers that split in depth.

For yubiOS this model is the immutability primitive's foundation: the invariant "/usr is immutable at every boot" (source doc) holds because the booted tree is image-derived and composefs-verified, not because of runtime enforcement alone.

## What this means in practice

- An image built for bootc is tested as a container (podman run, bootc container lint) and deployed as a whole OS; there is no separate packaging step (developers.redhat.com/articles/2024/09/24/bootc-getting-started-bootable-containers, w=0.81).
- Rollback is structural, not procedural: the previous deployment is still on disk, so bootc rollback swaps bootloader ordering (source doc).
- The CNCF project profile confirms bootc's role as the standard way to ship OS images through registries (cncf.io/projects/bootc/, w=0.69).

The mental model to keep: the registry is the package repository, the image is the OS, and boot time is the only moment the system changes.
