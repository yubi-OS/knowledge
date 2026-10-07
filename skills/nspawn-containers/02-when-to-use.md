# 02: When to use nspawn and where it stops

Scope: the concrete yubiOS use cases for nspawn and the explicit do-not-use boundaries, grounded in the source doc plus the tool's own documentation.

## The tool's self-description

The systemd-nspawn man page describes the tool as spawning a namespace container for debugging, testing and building (https://man7.org/linux/man-pages/man1/systemd-nspawn.1.html, weight 0.75; same framing at https://www.linux.org/docs/man1/systemd-nspawn.html, weight 0.55). That triad, debugging, testing, building, is exactly the space the source doc's use cases occupy, which is why yubiOS treats nspawn as a dev/test/build mechanism rather than a production runtime.

## The yubiOS use cases

From the source doc, all attributed to it:

- Running a CI job inside a yubiOS image without QEMU overhead.
- Setting up a dev container rooted at the same mkosi image as production.
- Testing a systemd service unit inside the production /usr.
- Building a project that requires a different /usr than the host, a cross-distro container.
- Designing a microsegmentation policy using nspawn network namespaces.
- Replacing a docker run workflow for a single-host use case.

## What a container needs to exist

External corroboration on mechanics: benjamintoll.com (https://benjamintoll.com/2022/02/04/on-running-systemd-nspawn-containers/, weight 0.22, weak) notes the requirement to provide a root filesystem, familiar to runc users. quantum5.ca (https://quantum5.ca/2025/03/22/whirlwind-tour-of-systemd-nspawn-containers/, weight 0.15, weak) states nspawn, like all containers, requires a separate rootfs in a directory. This grounds the source doc's preference for --directory= over --image=: yubiOS images are extracted mkosi directories, so they are already rootfs trees.

The systemd NEWS file (https://github.com/systemd/systemd/blob/main/NEWS, weight 0.74) is the release-level record for the container feature surface, useful for checking which flags exist at the systemd version an image ships.

## The do-not-use boundaries

The source doc names 4 boundaries, each with its escape hatch:

1. Different kernel required: use bcvk-virtualization or a bootc-images install. nspawn shares the host kernel.
2. Long-running production service: use a systemd portable service or a managed runtime like podman. nspawn has no image-update story of its own.
3. Direct hardware access: GPU, USB, NIC access breaks under nspawn's user-namespace isolation; use QEMU with PCI passthrough.
4. macOS or Windows: yubiOS and nspawn are Linux-only.

A security-relevant corroboration: the ArchWiki (https://wiki.archlinux.org/title/Systemd-nspawn, weight 0.57) warns that bind-mounting /proc and /sys with read-write access into unprivileged containers is not secure. This supports the source doc's rule that host resources shared into the container must be tightly scoped, and it previews the anti-patterns doc.

## Why dev/test/build and not production

The man page's own scope (debugging, testing, building, weight 0.75) plus the source doc's no-image-update argument line up: nspawn is the cheapest way to run the exact production /usr for a bounded job, and the wrong tool when the job is unbounded in time. The systemd.io file descriptor store document (https://systemd.io/FILE_DESCRIPTOR_STORE/, weight 0.57) describes the production-side mechanism services use to survive restarts, which is the sort of long-running-service concern that pushes production workloads to portable services or managed runtimes instead.

## CI inside the image is the flagship case

The strongest use case in the set is running CI inside the yubiOS image. The source doc justifies it as CI without the QEMU overhead, and the test-in-image convention documented in doc 04 depends on this use case. The man page triad of debugging, testing, and building (https://man7.org/linux/man-pages/man1/systemd-nspawn.1.html, weight 0.75) maps directly onto it: CI is the building rung, unit testing is the testing rung, and interactive troubleshooting inside the image is the debugging rung.

For the dev-container case, the source doc requires the container to be rooted at the same mkosi image as production, which means dev and prod differ only by mounts and network mode, never by base image. Community material on the general workflow is abundant but weakly weighted: devopsaitoolkit.com (https://devopsaitoolkit.com/blog/lightweight-containers-with-systemd-nspawn/, weight 0.14) frames nspawn plus machinectl as the dockerless path to OS containers, and DeepWiki's systemd overview (https://deepwiki.com/systemd/systemd/5.1-systemd-nspawn-container-manager/, weight 0.17) describes nspawn as a lightweight container manager built on namespaces, cgroups, and capabilities isolating hostname, filesystems, and process trees. Both agree with the source doc's framing without adding new claims.
