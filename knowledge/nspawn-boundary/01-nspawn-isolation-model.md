# 01. The nspawn isolation model

Scope: what systemd-nspawn is, which kernel mechanisms it layers, and where it sits between chroot, application containers, and virtual machines.

## What nspawn is

systemd-nspawn is the container runner shipped inside systemd. Its manual page describes it as a tool to "run a command or OS in a lightweight namespace container", similar in spirit to chroot(1) but more powerful, because it virtualizes the file system hierarchy, the process tree, the various IPC subsystems, and the host and domain names ([freedesktop.org systemd-nspawn(1)](https://www.freedesktop.org/software/systemd/man/latest/systemd-nspawn.html), jev 0.96). The manual page is explicit that, in contrast to chroot(1), systemd-nspawn may be used to boot full Linux-based operating systems in a container ([man7.org systemd-nspawn(1)](https://www.man7.org/linux/man-pages/man1/systemd-nspawn.1.html), jev 0.83). The ArchWiki's one-line summary is the one most people remember: "systemd-nspawn is like the chroot command, but it is a chroot on steroids" ([ArchWiki: Systemd-nspawn](https://wiki.archlinux.org/title/Systemd-nspawn), jev 0.91).

## Which mechanisms it layers

The isolation is built from standard kernel primitives. A walkthrough of the systemd source notes that nspawn is a lightweight container manager using Linux kernel features such as namespaces, cgroups, and capabilities to spawn and manage OS containers, isolating hostname, filesystems, process trees, users, and network stacks ([DeepWiki: systemd-nspawn Container Manager](https://deepwiki.com/systemd/systemd/5.1-systemd-nspawn-container-manager), jev 0.45). An independent practitioner write-up reaches the same mechanics: systemd-nspawn utilizes namespaces for spatial isolation and cgroups for resource control, offering significant isolation between containers and the host ([mwalkowski.com: Introduction to systemd-nspawn Containers](https://mwalkowski.com/post/introduction-to-systemd-nspawn-containers-chroot-on-steroids/), jev 0.69).

Two concrete read-down behaviors matter for anyone treating nspawn as a boundary. First, the manual page states that systemd-nspawn limits access to various kernel interfaces in the container to read-only, such as /sys/, /proc/sys/, or /sys/fs/selinux/ ([man7.org systemd-nspawn(1)](https://www.man7.org/linux/man-pages/man1/systemd-nspawn.1.html), jev 0.83). Second, the tool mounts file systems private to the container at /dev/, /run/, and similar paths ([freedesktop.org systemd-nspawn(1)](https://www.freedesktop.org/software/systemd/man/latest/systemd-nspawn.html), jev 0.94).

## The honest security statement

The manual page itself carries the boundary's own caveat: like other nspawn features, the containment is "not a security feature and provides protection against accidental destructive operations only" ([linux.org: systemd-nspawn man page](https://www.linux.org/docs/man1/systemd-nspawn.html), jev 0.65). That phrasing is load-bearing for the yubiOS framing below: nspawn is a workflow and correctness boundary, not a hostile-tenant boundary. The same record also documents the -M/--machine= switch that names the container for the machine registry ([linux.org: systemd-nspawn man page](https://www.linux.org/docs/man1/systemd-nspawn.html), jev 0.65).

## Position in the isolation ladder

The yubiOS container-isolation family record orders the boundaries by what they constrain: rootless podman constrains what a process can do during image build, systemd-nspawn constrains what a process sees in a hermetic dev environment, and ephemeral VMs constrain what a process can even address, because a VM adds a kernel boundary the container does not ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc). nspawn sits in the middle: full filesystem, process-tree, IPC, and hostname virtualization without a second kernel. A third-party comparison of Firecracker and nspawn frames the same split from the other side: nspawn is built for building and testing OS images, portable services, and running a full trusted Linux userspace, while hypervisor-based runners target untrusted or per-tenant workloads at density ([PandaStack: Firecracker vs systemd-nspawn](https://www.pandastack.ai/blog/firecracker-vs-systemd-nspawn/), jev 0.43).

## Why the boundary is cheap and therefore easy to skip testing

Because nspawn ships with systemd and needs no daemon or image registry, the marginal cost of an nspawn invocation is near zero, and that is exactly why an unexercised nspawn layer produces no signal: nothing breaks loudly at the boundary if nobody drives it. The yubiOS record names the resulting failure shape directly: of the four isolation uses the family names, the dev-environment use is the one with no CI leg at all, and its failure mode is silent ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc).

## Sub-claims recap

1. nspawn virtualizes filesystem, process tree, IPC, and host/domain identity on top of namespaces, cgroups, and capabilities (man page weight 0.96; practitioner write-up weight 0.69).
2. Kernel-interface reads are forced read-only at /sys/, /proc/sys/, /sys/fs/selinux (weight 0.83).
3. The tool's own manual page disclaims it as a security boundary (weight 0.65).
4. In the yubiOS family ordering, nspawn is the middle boundary: more than podman, less than a VM (source-doc record).
