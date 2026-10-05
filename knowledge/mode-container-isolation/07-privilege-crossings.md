# 07 Privilege crossings: rootless as the constant, escalation at the VM row

Scope: how privilege changes across the mode rows: rootless user namespaces as the container and nspawn constant, the VM row's escalation to privileged virtualization, and seccomp applied per row rather than per platform.

Weight legend: 0.5 and above means authoritative backing; below 0.5 is labeled weak.

## The rootless constant

Across the container and nspawn rows, the privilege model is the same: run unprivileged, and use user namespaces to make that possible. Rootless podman uses the user namespace to map the container's root identity onto an unprivileged host user, so the container runtime never needs host root [0.93, https://www.redhat.com/en/blog/rootless-containers-podman]. The unit-level counterpart, PrivateUsers, defines a new user namespace for a process and strips process capabilities accordingly [0.54, https://linux-audit.com/systemd/settings/units/privateusers/].

The security meaning of this constant is that the privilege crossing happens at the boundary, not inside it. A container that escapes its boundary lands on the host as an unprivileged UID, not as root. This is why the yubiOS mode table records rootless as "the constant across the container and nspawn rows": the boundary types differ, but the privilege posture is identical and it is chosen once, at setup time, not per run.

## Where the constant breaks: the VM row

The VM row is the exception on the axis. Hardware virtualization through KVM is mediated by the kernel's virtualization subsystem plus a VMM process (QEMU providing device emulation with near-native performance under KVM) [0.84, https://www.qemu.org/]. The Kata threat model treats the KVM/QEMU setup as the trust base that every VM on a host shares [0.84, https://github.com/kata-containers/kata-containers/blob/main/docs/threat-model/threat-model.md]. Operating that trust base (access to the virtualization device, creation of network bridges, management of disk images) is a privileged host operation in a way the rootless container row is not.

The yubiOS mode table records this as the VM rows being "the only place CI escalates" for sudo/KVM. No retrieved source in this dig documents bcvk's specific privilege requirements, so that operational claim is recorded as project practice; the structural reason behind it (the VMM and the virtual network setup are host-privileged operations [0.84, https://www.qemu.org/], [0.87, https://wiki.libvirt.org/Networking.html]) is web-grounded.

## Seccomp: one mechanism, one application per row

Seccomp is applied per row, not once globally, and each row's profile is different:

1. Container row: podman selects a seccomp profile by policy. With --seccomp-policy=image, podman looks for the io.containers.seccomp.profile label in the container image config and uses it; otherwise it falls back to the default profile [0.92, https://docs.podman.io/en/v4.6.1/markdown/options/seccomp-policy.html]. Kubernetes formalizes the same idea with the RuntimeDefault profile as a node-level default [0.77, https://kubernetes.io/docs/tutorials/security/seccomp/].
2. Nspawn row: the .nspawn file format carries SystemCallFilter=, which configures the system call filter applied to processes in the container [0.87, https://www.man7.org/linux/man-pages/man5/systemd.nspawn.5.html], with command-line equivalents for ad-hoc runs.
3. Unit row: the unit's SystemCallFilter= applies a seccomp filter to the service's processes, preventing misuse of syscalls not needed for normal functioning [0.50, https://linux-audit.com/systemd/settings/units/systemcallfilter/]. Predefined syscall groups such as @system-service let a unit filter to a curated allowlist without hand-enumerating syscalls [0.18, weak, https://dev.to/aomiqaza/systemd-service-sandboxing-restricting-process-capability-system-calls-2klk].

The per-row discipline matters because a syscall filter that is right for one row is wrong for another. A build container needs the image's declared profile; a booted OS tree needs a broader filter than a single-command unit; a persistent daemon needs the tightest filter of all because it runs the longest. The seccomp mechanism is identical everywhere (BPF filtering of syscalls at kernel entry), but the profile decision is per-mode [0.50, https://linux-audit.com/systemd/settings/units/systemcallfilter/].

## The crossing table

| Row | Privilege posture | Seccomp carrier |
|---|---|---|
| Container (build) | rootless, user namespace mapping [0.93, https://www.redhat.com/en/blog/rootless-containers-podman] | podman seccomp profile via --seccomp-policy [0.92, https://docs.podman.io/en/v4.6.1/markdown/options/seccomp-policy.html] |
| Nspawn (dev) | rootless, user namespace mapping [0.54, https://linux-audit.com/systemd/settings/units/privateusers/] | SystemCallFilter= in .nspawn [0.87, https://www.man7.org/linux/man-pages/man5/systemd.nspawn.5.html] |
| VM (test, flash) | privileged host operation (project practice; structure grounded in [0.84, https://www.qemu.org/]) | guest kernel owned per run [0.59, https://www.fosslinux.com/162244/why-containers-are-not-virtual-machines-shared-kernel-isolation-escapes.htm] |
| Unit sandbox | runs as the unit's user, capabilities bounded [0.87, https://wiki.archlinux.org/title/Systemd/Sandboxing] | SystemCallFilter= in the unit [0.50, https://linux-audit.com/systemd/settings/units/systemcallfilter/] |

## Design rule the crossings produce

Two rules fall out of the crossing analysis. First, privilege should be constant within a row and explicit at the crossing between rows: rootless is the default for anything that shares the host kernel, and escalation is justified only where the boundary requires it (virtualization). Second, every boundary should carry its own seccomp carrier, stated in its own configuration format (image label, .nspawn file, or unit file), so the filter travels with the boundary definition and is not an external, easily-forgotten step [0.87, https://www.man7.org/linux/man-pages/man5/systemd.nspawn.5.html], [0.50, https://linux-audit.com/systemd/settings/units/systemcallfilter/].

A corollary the source doc states and the dig partially supports: a boundary without a stated mode tends to be a boundary whose cleanup nobody owns. The privilege version is the same shape: a boundary without a stated privilege posture tends to be one that silently runs privileged. The dig's evidence for the cleanup version is indirect (mode-specific cleanup ownership documented in docs 05 and 06), so treat the corollary as design guidance rather than sourced fact.

## Open gaps

The dig did not surface primary documentation for bcvk's privilege model, /dev/kvm access requirements, or the exact podman default seccomp profile contents; those were omitted rather than asserted. The Kubernetes RuntimeDefault reference (0.77) is included as the formal statement of default-profile behavior even though the corpus's container row is podman, because it is the strongest available primary source for the default-profile pattern.
