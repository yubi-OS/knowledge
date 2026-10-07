# 01: The isolation ladder and the nspawn decision tree

Scope: where systemd-nspawn sits between running on the host, sysext overlays, full VMs, and portable services, and how yubiOS picks a rung for a given job.

## The yubiOS decision tree

The source doc (yubi-OS/yubiOS skills/nspawn-containers/SKILL.md) states yubiOS's chosen decision tree explicitly:

- Need a sandbox for a build: nspawn with RootImage= from a built mkosi image.
- Need to test the build inside the exact runtime /usr: nspawn with RootImage= plus --boot.
- Need full isolation or kernel independence: bcvk-virtualization (QEMU-based).
- Need to ship a service to another host: systemd portable service, which uses nspawn under the hood.
- Need to add tools without rebuilding the base: sysext overlay, no nspawn involved.

All 5 branches are attributed to the source doc. The tree is the core claim of this corpus: nspawn is the middle rung, not the default for everything.

## The shared-kernel boundary

The source doc is explicit that nspawn shares the host kernel. It reserves kernel-independent isolation for bcvk-virtualization and says hardware access (GPU, USB, NIC) breaks under nspawn's user-namespace isolation, directing those cases to QEMU with PCI passthrough. Independent corroboration is thin in this dig set: ADHDecode (https://adhdecode.com/linux/13-systemd/systemd-nspawn-lightweight-containers/, weight 0.12, weak) states nspawn isolates filesystems and processes but does not provide the security isolation of technologies that virtualize the kernel. An LWN introduction to Clear Containers (https://lwn.net/Articles/644675/, weight 0.17, weak) documents the hardware-virtualization-based container line that exists precisely because process-level container isolation is weaker than VM isolation. Treat both as weakly-backed corroboration of a claim the source doc itself carries.

## Portable images run both ways

The strongest external grounding for the ladder comes from the systemd project itself. The systemd stable docs (https://github.com/systemd/systemd-stable/blob/v255-stable/docs/PORTABLE_SERVICES.md, weight 0.8) state that a portable image can be run as an OS container using systemd-nspawn by booting the image with systemd-nspawn -i -b, and can also be booted directly as a VM image using a generic VM executor such as virtualbox, qemu, or kvm. The same text appears in the systemd.io introduction (https://systemd.io/PORTABLE_SERVICES/, weight 0.59). This is why the ladder is a ladder: one image artifact can sit at either the nspawn rung or the VM rung depending on how it is invoked.

## What the ladder costs

Performance positioning has mixed evidence. systemd issue 18370 (https://github.com/systemd/systemd/issues/18370, weight 0.81) collects nspawn performance complaints and comparisons against QEMU and Docker launch flows from 2021. A Unix and Linux Stack Exchange thread (https://unix.stackexchange.com/questions/630859/why-systemd-nspawn-is-slower-than-docker-podman-and-qemu-how-to-improve-nspawn-performance, weight 0.13, weak) reports CPU-bound tasks taking about twice as long in nspawn as in docker, podman, or qemu in one benchmark, with mitigations disabled in an attempt to explain the gap. The source doc does not claim nspawn is faster than QEMU; it claims lower overhead for CI-in-image work, which is a startup and integration claim rather than a per-cycle compute claim.

## Sibling rungs from the dig

A community comparison (https://www.bigiron.cc/guides/docker-compose-vs-podman-quadlets-vs-systemd-nspawn, weight 0.11, weak) frames nspawn as the OS-level lightweight alternative to Docker Compose and Podman Quadlets. Another survey (https://blog.shani.dev/post/lxc-lxd-on-shani-os/, weight 0.1, weak) places nspawn among LXC, LXD, distrobox, podman, and full VMs as one isolation type on a spectrum. These are weakly-backed positioning references only; the load-bearing ladder is the source doc's own tree.

## How yubiOS arrives at the tree

The source doc's changelog records why the tree was formalized: nspawn was previously implicit across the bcvk-virtualization, bootc-images, and mkosi-image-builder skills with no dedicated home, and the 2026-08-04 cycle 5 pass made the hermetic image-rooted container pattern first-class. The skill maps to the yubiOS 10-primitive framework as segmentation (primary, P9), least privilege via user-namespace and bind scoping (P3), immutability via the signed mkosi image as root (P6), and declarative policy via nspawn flags (P4). The ADR-031 vfio-user boundary is cited in the source doc as the line where nspawn is the go-smaller side and hardware passthrough is the go-bigger side.

A practical reading rule falls out of the tree and the dig evidence together: pick the lowest rung that satisfies the isolation requirement, because each rung up costs startup time and integration surface. The systemd portable-services documentation (https://systemd.io/PORTABLE_SERVICES/, weight 0.59) makes the same move explicit for the portable rung by describing one image that can be invoked three ways, container, VM, or attached portable service. The yubiOS tree is that same idea generalized across sysext, nspawn, portable, and VM.
