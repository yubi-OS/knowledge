# 02 systemd-nspawn in ephemeral mode: the boundary and the discard contract

Scope: systemd-nspawn as an isolation boundary, its user namespace mapping, ephemeral overlay mode with boot-in-container, and what discard-at-exit means for cleanup and state.

Weight legend: 0.5 and above means authoritative backing; below 0.5 is labeled weak.

## Where nspawn sits on the boundary spectrum

systemd-nspawn is described on the Arch Wiki as "like chroot, but a chroot on steroids": it may be used to run a command or an operating system in a lightweight namespace-spawned container [0.80, https://wiki.archlinux.org/title/Systemd-nspawn]. The boundary it builds is kernel-native: namespaces, cgroups, and capabilities, without a container image registry or a daemon in between [0.38, weak, https://deepwiki.com/systemd/systemd/5.1-systemd-nspawn-container-manager]. Compared with a container runtime, nspawn's distinguishing property is that it is part of the system and service manager itself: the systemd project ships and maintains it [0.91, https://github.com/systemd/systemd].

The threat model difference from a container row is subtle but real. nspawn boots a full OS tree on the shared host kernel; a microVM runtime such as Firecracker gives each workload its own guest kernel behind KVM [0.38, weak, https://www.pandastack.ai/blog/firecracker-vs-systemd-nspawn/]. So nspawn answers visibility and privilege threats the same way containers do, and answers kernel-compromise threats the same way: it does not answer them at all, because the kernel is shared.

## User namespace mapping: PrivateUsers

nspawn's privilege model leans on user namespaces. The related unit-level setting PrivateUsers defines a new user namespace for a service and strips process capabilities accordingly [0.54, https://linux-audit.com/systemd/settings/units/privateusers/]. The nspawn command line equivalent maps the container's user range into an unprivileged host range, which is what allows nspawn containers to run without root on the host. This is the same rootless constant that the container row uses (doc 07 covers the crossings in one place).

Configuration for nspawn containers is split across vendor and local settings files. Privileged settings can be added by copying .nspawn files into /etc/systemd/nspawn/ rather than trusting image-vendor defaults [0.86, https://www.man7.org/linux/man-pages/man5/systemd.nspawn.5.html]. The .nspawn format also carries hardening knobs, including SystemCallFilter=, which configures the system call filter applied to processes inside the container [0.87, https://www.man7.org/linux/man-pages/man5/systemd.nspawn.5.html].

## Ephemeral mode: the mode is the cleanup contract

With --ephemeral, nspawn makes a temporary snapshot of the OS tree, boots it, and discards it when the container exits. Where the filesystem supports it, the snapshot is a btrfs snapshot; otherwise it is a plain copy [0.50, https://sumguy.com/systemd-nspawn-the-forgotten-container/]. That behavior is the entire cleanup contract of the mode: there is nothing to clean up, because the writable layer never outlives the session.

This maps directly onto the nspawn file format's Overlay= and OverlayReadOnly= options, which add overlay mount points over the underlying image [0.87, https://www.man7.org/linux/man-pages/man5/systemd.nspawn.5.html]. The ephemeral pattern is general enough that it is used to build immutable bastion hosts: an OverlayFS mount over the image guarantees persistent changes are wiped on every boot [0.19, weak, https://devops-geek.net/devops-lab/building-immutable-bastion-hosts-with-systemd-nspawn-and-ephemeral-overlayfs-mounts/].

## Boot-in-container: the fourth mode

nspawn can boot a full init inside the container (--boot), which is the mode used for dev sessions that need systemd semantics rather than a single command. Containers started via machinectl or the systemd-nspawn@.service template use different default options than containers started manually from the command line [0.80, https://wiki.archlinux.org/title/Systemd-nspawn]. That detail matters for the mode axis: an ephemeral nspawn booted via the service template inherits different defaults, so the boundary you get is not always the boundary you typed.

## What the mode answers and hides

The ephemeral mode answers state-leak threats by construction: any file written during the session is gone at exit. The hazard is the inverse of the persistent case. Anything a workflow expected to survive the session must be exported before exit, because discard-at-exit is unconditional. A killed session (SIGKILL of the nspawn process) still triggers snapshot discard on the next cleanup pass, but tooling that checks for leftover artifacts after an interrupted run should not assume the overlay survives [0.19, weak, https://devops-geek.net/devops-lab/building-immutable-bastion-hosts-with-systemd-nspawn-and-ephemeral-overlayfs-mounts/].

## Open gaps

The dig surfaced no primary systemd documentation page for the --ephemeral flag itself; the discard semantics above are grounded in secondary sources (0.50 and weak 0.19). The strongest sources in this doc are the nspawn(5) man page and the Arch Wiki. Claims about nspawn-specific seccomp defaults beyond the SystemCallFilter= knob were omitted rather than guessed.
