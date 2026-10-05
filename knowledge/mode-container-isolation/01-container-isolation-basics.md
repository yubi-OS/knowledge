# 01 Container isolation basics: what the container wall actually isolates

Scope: what a rootless podman-style container isolates (user, mount, PID, and network namespaces, cgroups, seccomp), which threats that wall answers, and where it stops.

Weight legend: weights come from jev noul scoring during this corpus dig. 0.5 and above means authoritative backing. Below 0.5 means weak backing and the claim is labeled as such in the text.

## The boundary is a set of kernel mechanisms, not one wall

OS-level virtualization is the operating system paradigm in which the kernel allows multiple isolated user space instances, called containers, to exist on one host kernel [0.79, https://en.wikipedia.org/wiki/OS-level_virtualization]. That single sentence carries the most important threat-model fact of the whole mode axis: a container boundary is created by the host kernel, for processes that keep running on that same kernel. The wall is made of namespace isolation, resource controls, and syscall filtering, and each layer answers a different threat.

The three layers are usually named as namespaces, cgroups, and seccomp. Namespaces isolate what processes can see (filesystem mounts, process trees, network stacks, user IDs). Cgroups limit what they can consume (CPU, memory, IO). Seccomp limits which kernel entry points they can call [0.35, weak, https://safeguard.sh/resources/blog/container-isolation-with-namespaces-cgroups-and-seccomp]. Each layer fails independently, and a single misconfiguration in one layer weakens the whole posture [0.35, weak, https://safeguard.sh/resources/blog/container-isolation-with-namespaces-cgroups-and-seccomp].

## Rootless mode: the privilege answer

Rootless containers are the strongest structural choice a container mode can make, because they change who the kernel thinks is asking. Podman's rootless mode runs containers with only the permissions an unprivileged user already possesses, using user namespaces to map the container's root to an unprivileged host UID [0.24, weak, https://deepwiki.com/containers/podman/8-rootless-containers]. Red Hat's rootless podman material treats the user namespace mapping as the mechanism that makes rootless containers work, and walks through how user namespaces operate inside rootless containers [0.93, https://www.redhat.com/en/blog/rootless-containers-podman].

The practical consequence for threat modeling: a container escape from a rootless container does not grant root on the host, because the escaping process was never running as host root. It grants the mapped unprivileged UID. That is a much smaller blast radius than a rootful container escape, and it is why rootless is the default posture on modern podman deployments.

## The rest of the podman hardening stack

Podman's security posture is assembled from rootless mode, user namespaces, SELinux policies, seccomp profiles, and capability management, layered on top of each other [0.50, https://oneuptime.com/blog/post/2026-02-02-podman-security-configuration/view]. Seccomp profiles filter the syscall surface of the containerized process. Capability management drops the default capability set so the container gets only the specific capabilities it needs. SELinux adds mandatory access control labels on top of the discretionary boundaries [0.50, https://oneuptime.com/blog/post/2026-02-02-podman-security-configuration/view].

Podman also masks sensitive paths and marks others read-only inside the container's mount namespace to protect the host kernel's interface surface [0.16, weak, https://deepwiki.com/podman-container-tools/podman/4.3-security:-selinux-seccomp-and-capabilities]. The weak weight here reflects the source class (an auto-generated code wiki), but the mechanism it describes is standard container runtime behavior.

## What the wall answers, and what it does not

The container boundary answers:

1. Privilege escalation from container to host, when the container runs rootless under a user namespace [0.93, https://www.redhat.com/en/blog/rootless-containers-podman].
2. Uncontrolled resource consumption, through cgroups [0.79, https://en.wikipedia.org/wiki/OS-level_virtualization].
3. Excessive syscall exposure, through seccomp profiles [0.50, https://oneuptime.com/blog/post/2026-02-02-podman-security-configuration/view].
4. Filesystem and process visibility leakage, through mount and PID namespaces [0.79, https://en.wikipedia.org/wiki/OS-level_virtualization].

It does not answer kernel-level attacks. Because all containers on a host run on one shared kernel, a kernel vulnerability is a shared exposure across every container on that host. This is the structural difference from VM modes, which give each workload its own guest kernel, and it is treated in depth in doc 03 [0.59, https://www.fosslinux.com/162244/why-containers-are-not-virtual-machines-shared-kernel-isolation-escapes.htm].

## Mode note for the corpus

In the yubiOS mode axis, the container row is the one-shot row: containers run a build or a task, image layers persist, and the container itself does not. The isolation mechanisms above are the constant; the mode (one-shot versus persistent) changes the cleanup and exit semantics, which doc 05 covers. The seccomp profile for this row is podman's default profile, applied by the runtime unless a custom profile is selected, per the --seccomp-policy selection behavior [0.92, https://docs.podman.io/en/v4.6.1/markdown/options/seccomp-policy.html].

## Open gaps

No retrieved source in this dig gives hard numbers for podman's default seccomp allowlist size or its exact masked-path list; those specifics were omitted rather than guessed. Historical escape CVEs (for example the runc process-launch class) were referenced by weak sources only [0.23, weak, https://safeguard.sh/resources/blog/container-isolation-best-practices] and are therefore not asserted here with specifics.
