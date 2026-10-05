# 08 Observers and secrets: where measurement sits relative to the boundaries

Scope: where runtime-security observers (Falco, Tetragon) run relative to the mode rows, what eBPF visibility can and cannot cross, and the open question of hardware secrets across boundaries.

Weight legend: 0.5 and above means authoritative backing; below 0.5 is labeled weak.

## The persistent row hosts the observers

In the yubiOS mode table, the measurement daemons (Falco, Tetragon) run in the persistent row and observe the other four rows. That placement is grounded in how these tools work: they are eBPF-based, they run as long-lived services on a host, and they observe events at the kernel boundary.

Tetragon is described by its project as a flexible, Kubernetes-aware security observability and runtime enforcement tool that applies policy and filtering directly with eBPF, allowing observability and enforcement of runtime events [0.92, https://tetragon.io/]. Its overview documentation extends this: Tetragon provides kernel-level visibility through eBPF, including process lifecycle events and syscall-level tracing with filtering [0.84, https://tetragon.io/docs/overview/]. The project ships as cilium/tetragon [0.90, https://github.com/cilium/tetragon], and Isovalent's documentation hosts the Tetragon reference [0.95, https://docsnext.isovalent.com/project/tetragon/index.html].

Falco is the CNCF-ecosystem counterpart: a flexible rules engine for cloud-native runtime security, detecting unexpected behavior, configuration changes, and threats in containers and the host [0.86, https://falco.org/]. The Falco project's documentation describes its rule-driven threat detection model [0.88, https://falco.org/docs/], and the falcosecurity/falco repository is the canonical source [0.92, https://github.com/falcosecurity/falco]. Both tools are also consumed operationally as data sources; for example, Elastic documents a Cilium Tetragon integration for ingesting its security events [0.89, https://www.elastic.co/docs/reference/integrations/cilium_tetragon].

The structural reason the observers live in the persistent row: an observer that ran inside an ephemeral boundary would be discarded with the boundary and would observe only itself. A persistent, host-level observer can see events from every mode because the events it watches (syscalls, process lifecycle) are delivered at the host kernel, which every mode shares.

## What eBPF visibility crosses, and where it stops

eBPF is a sandboxed execution environment inside the Linux kernel that runs programs in response to events such as syscalls, tracepoints, and network packets [0.25, weak, https://counter-x.net/ebpf-for-security-monitoring-what-it-actually-sees-and-what-it-misses/]. An eBPF program at the syscall boundary sees what the host kernel sees [0.37, weak, https://appscale.blog/en/blog/ebpf-runtime-security-what-kernel-sees-that-agents-cannot-falco-tetragon-2026].

That statement defines the visibility boundary precisely, and its edges are the interesting part for the mode axis:

1. Containers and nspawn: visible. Both modes run on the host kernel, so their syscalls arrive at the same kernel the observer's probes are attached to. This is the standard operating assumption of eBPF container monitoring, discussed across the dig's secondary sources [0.28, weak, https://safeguard.sh/resources/blog/ebpf-runtime-security], [0.22, weak, https://www.tigergate.dev/blog/ebpf-runtime-security-explained/].
2. VMs: partially occluded. A guest kernel inside a VM processes its own syscalls; a host-level eBPF observer sees the VM's device-model activity, not the guest's syscall stream. Practical deployments put eBPF inside the guest for guest visibility, which means a second observer per VM mode [0.20, weak, https://nodemac.com/en/blog/articles/ai-agent-security-isolation-docker-ebpf-sandbox.html]. The occlusion is a direct consequence of the VM boundary documented in doc 03: the guest kernel is isolated from the host, and visibility is isolated with it [0.59, https://www.fosslinux.com/162244/why-containers-are-not-virtual-machines-shared-kernel-isolation-escapes.htm].

Detection versus enforcement splits along the same line. Falco is oriented to detection and alerting from rule evaluation [0.86, https://falco.org/]; Tetragon does both observation and runtime enforcement, terminating or killing processes by policy [0.92, https://tetragon.io/], [0.15, weak, https://www.decryptiondigest.com/blog/ebpf-runtime-security-tools-falco-tetragon].

## The observers' own mode obligations

Because the observers are persistent daemons, they inherit the persistent row's obligations from doc 04: they run for the lifetime of the host, they hold privileges to load eBPF programs, and their boundary must be hardened like any other unit. A weak-weight source notes the tension directly: monitoring requires more privileges than typical services, so the observer unit is a deliberate exception to least-privilege defaults [0.10, weak, https://appscale.blog/en/blog/ebpf-runtime-security-what-kernel-sees-that-agents-cannot-falco-tetragon-2026]. The design consequence for the mode table is that the persistent row is not only the sandboxed-daemon row; it is also the row that hosts the privileged kernel observers, and the two roles should be separated into distinct units with distinct policies.

## Secrets across boundaries: the open question

The source doc's placement note records that the YubiKey never enters any of the boundaries, which is the boot file's design point. This dig produced no source that grounds a claim about hardware-token placement inside containers, nspawn containers, VMs, or unit sandboxes, so that claim is recorded here as an open gap rather than asserted. The dig's adjacent finding, at weak weight, is that secret and monitoring placement differs by platform: on Linux, eBPF sits close to the host kernel boundary, while on macOS container stacks the eBPF-like visibility must run inside the Linux VM that the container stack uses [0.20, weak, https://nodemac.com/en/blog/articles/ai-agent-security-isolation-docker-ebpf-sandbox.html]. That finding supports the general principle that security components have a mode and a placement, and that both must be stated explicitly, the same way a boundary's cleanup contract must be.

## What this doc contributes to the mode table

The observers row of the mode table is: mode persistent, lifetime host, cleanup contract ordinary unit lifecycle, exit semantics supervisor-configured, and visibility over all host-kernel modes with per-VM observers needed for guest-level coverage. The secret-placement row is recorded as a gap: hardware secrets are excluded from every boundary by design in yubiOS, and no web source in this dig either supports or refutes the exclusion; a future refresh should source FIDO2 token handling in containerized and virtualized contexts before asserting it in a corpus doc.

## Open gaps

1. YubiKey/hardware-secret exclusion across boundaries: no source in this dig; carried as an explicit gap (see above).
2. eBPF visibility claims inside guest kernels rest on weak sources only (0.20, 0.25, 0.37); the strong sources (tetragon.io, falco.org) ground what the tools are, not the cross-boundary visibility model.
3. Falco and Tetragon both being "the" observers of the other four rows is the yubiOS table's placement; the dig grounds each tool's capabilities but not the specific two-observer deployment.
