# Which boundary answers which threat

Scope: a decision matrix across the four isolation boundaries (rootless builds, nspawn on a signed image, ephemeral VMs, unit sandboxing with seccomp), mapping each to the threat it answers, and the relation types between them.

## The primitives, ranked by boundary strength

A container is not a kernel boundary: it is a process wrapped in Linux primitives. Namespaces define what a process can see, cgroups define what it can consume, and seccomp defines what it can ask the kernel to do; the Linux kernel enforces isolation that Docker and Podman merely configure [https://chkrishnatej.dev/posts/isolation-for-containers/, weight: high]. Because containers share the host kernel, kernel bugs let an adversary escape isolation, and new local privilege escalation bugs appear every year; seccomp-bpf is the added mechanism filtering which system calls a process can invoke [https://css.csail.mit.edu/6.5660/2026/lec/l02-isolation.txt, weight: high]. A VM moves the boundary to the hypervisor: virtual machines are generally safer than containers by default because they isolate at the hardware level through a hypervisor, while containers isolate at the operating system level by sharing the host kernel [https://www.virtual-pc.com/are-containers-more-secure-than-virtual-machines/, weight: low].

## The matrix

| Use | Boundary | Threat answered | Why the alternatives fail here |
|---|---|---|---|
| Image build | rootless podman | malicious build steps gaining host privilege | rootful daemon hands a daemon permanent root; VM per stage pays hypervisor cost for a step already namespaced |
| Dev environment | systemd-nspawn on the signed image | dev workload mutating the host /usr, and drift between dev and production image | Docker dev containers boot an application image, not the host's systemd; toolbox overlays the host session |
| Whole-OS test | ephemeral VM (bcvk) | firmware and boot-path behavior (UEFI, LUKS2, FIDO2 unlock) untested | nspawn --boot shares the host kernel and has no firmware; bare metal is too slow for the inner loop |
| Service confinement | unit sandboxing + seccomp | a compromised service exceeding its declared scope | per-service containers hide the unit from systemd-analyze security and duplicate image lineages |

Container escape is the threat behind the first and fourth rows: a process inside a container breaking through the isolation boundary to gain access to the host operating system, described as the nightmare scenario for container security [https://certsensei.io/blog/security-plus/container-vs-vm-security-security-plus-701, weight: high]. The pattern in reported CVEs is that the shared kernel is an actively exploited attack surface [https://www.fosslinux.com/162244/why-containers-are-not-virtual-machines-shared-kernel-isolation-escapes.htm, weight: low]. Default profiles do not close it alone: Docker's default seccomp profile blocks roughly 44 of the more than 300 Linux syscalls, yet a 2019 runc escape bypassed every default namespace boundary anyway [https://safeguard.sh/resources/blog/container-isolation-best-practices, weight: high].

VM escape is the corresponding threat above the hypervisor line, and it is rarer by construction: the guest would need a hypervisor bug rather than a kernel bug. That asymmetry is why the whole-OS test runs in a VM even though every process inside it could in principle run in a container.

## Relation types between the boundaries

The four boundaries are not a ladder of the same thing; they relate in three distinct ways.

Substitution: rootless podman and systemd-nspawn both give you an isolated environment on the host kernel, and for some uses either would do. They substitute at the same layer, differing in what they optimize: podman optimizes OCI image workflow, nspawn optimizes booting a full OS tree with systemd.

Abstraction: the nspawn-to-VM step adds a boundary rather than replacing one. nspawn shares the host kernel; the VM adds its own kernel and firmware. It is strictly more isolation and strictly more cost, chosen only when the question involves the boot path.

Alternative: unit sandboxing and per-service containers are alternatives at the same layer of the stack, both answering "confine this service". They differ in visibility (declarative unit versus runtime policy) and in artifact cost (no extra image versus one per service).

## Reading the matrix as cost

Every row's "why not" column is a cost argument, not a security argument. Rootful builds and VM-per-stage are more isolated in some dimension, and are still rejected: rootful because privilege beats isolation when the daemon is root, VM-per-stage because minutes per build stage starves the inner loop. The consistent rule across the matrix: pick the weakest boundary that answers the threat, and reserve stronger boundaries for the threats that only they can answer. On yubiOS the strongest boundary (the VM) is reserved for exactly one thing, the boot path, because that is the one threat class the weaker boundaries structurally cannot observe.
