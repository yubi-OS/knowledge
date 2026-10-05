# 07 - eBPF runtime enforcement for device I/O policy

Scope: runtime eBPF enforcement for device I/O policy: BPF LSM hooks for access control, tracing driver and GPU events, and what enforcement outside the hypervisor looks like.

## BPF LSM: policy programs at kernel security hooks

The kernel's LSM BPF programs allow runtime instrumentation of the LSM hooks by privileged users to implement system-wide mandatory access control and audit policies using eBPF (https://docs.kernel.org/5.10/bpf/bpf_lsm.html, weight 0.80; also documented at https://www.kernel.org/doc/html/v6.1//bpf/prog_lsm.html, weight 0.68; the current doc page carries weight 0.47 in this dig, weak). Policies are written as eBPF programs attached to named LSM hooks, giving fine-grained security control without writing a kernel module.

A concrete device-gating example is tpmlsm: an eBPF-based kernel guard that decides which programs may open the TPM on a Linux machine. You give it a list of binaries, it compiles that list in, and from then on the kernel refuses every other program that tries to open /dev/tpm0 or /dev/tpmrm0, including programs running as root (https://github.com/bschaatsbergen/tpmlsm, weight 0.63). This is device-level behavioral enforcement of exactly the shape ADR-033 needs on the host side: identity-based, attach-time policy, kernel-enforced.

## Observability into GPU drivers

The eBPF tutorials for GPU driver tracing show what a runtime observer can see: kernel-side GPU driver tracing provides visibility into job scheduling, memory management, and driver-firmware communication, and the tutorial is explicit that kernel tracepoints have fundamental limitations for deeper visibility (https://eunomia.dev/tutorials/xpu/gpu-kernel-driver/, weight 0.80; source tree at https://github.com/eunomia-bpf/bpf-developer-tutorial/tree/main/src/xpu/gpu-kernel-driver, weight 0.74; a Medium mirror carries weight 0.21, weak).

Tracing extends to userspace GPU APIs: a tutorial traces CUDA GPU operations with eBPF and notes that beyond tracing, eBPF can extend GPU driver behavior, pointing at the gpu_ext project for GPU scheduling and memory offloading via BPF struct_ops, presented in an LPC 2024 talk (https://eunomia.dev/tutorials/47-cuda-events/, weight 0.77). The gpu_ext tracing infrastructure provides visibility into UVM driver behavior for GPU memory management and scheduling (https://deepwiki.com/eunomia-bpf/gpu_ext/5-tracing-and-observability, weight 0.32, weak backing).

## Feeding signals into anomaly detection

The eBPF and ML convergence is documented as a real research direction: research demonstrates using eBPF to feed kernel-level signals into ML models for detecting anomalous behavior, such as ransomware detection from kernel signals and general process activity via autoencoders on syscall sequences (https://eunomia.dev/GPTtrace/, weight 0.66). This is the closest reviewed pattern to ADR-033's A1 assumption: a non-model-internal observer collecting device-adjacent signals and scoring them for anomaly, though at syscall level rather than DMA level.

A general writeup of the BPF LSM framework describes inserting custom access-control checks through BPF without writing a module, using the framework's well-defined hook points (https://ebpf.hamza-megahed.com/docs/chapter5/2-lsm/, weight 0.10, weak backing).

## What is absent against ADR-033

1. No DMA-pattern anomaly evaluation exists as a shipped tool. The reviewed anomaly work keys on syscalls and process behavior; DMA-window anomaly scoring is not a documented eBPF capability.
2. Enforcement is identity- and event-based. BPF LSM hooks fire on discrete operations (open, mprotect), not on aggregate behavior over time; the aggregation layer is unbuilt in reviewed sources.
3. GPU driver tracepoints have documented fundamental limitations, so a vfio-user-server-side observer sits at a different (and in some ways richer) observation point than a kernel tracer for the same workload.
4. The struct_ops direction (BPF programs implementing driver scheduling policy) is the strongest sign the kernel community is moving toward programmable device policy, but it targets kernel drivers, not userspace device servers.

## Sources considered

| source | weight |
|---|---|
| https://eunomia.dev/tutorials/xpu/gpu-kernel-driver/ | 0.80 |
| https://docs.kernel.org/5.10/bpf/bpf_lsm.html | 0.80 |
| https://github.com/eunomia-bpf/bpf-developer-tutorial/tree/main/src/xpu/gpu-kernel-driver | 0.74 |
| https://eunomia.dev/tutorials/47-cuda-events/ | 0.77 |
| https://www.kernel.org/doc/html/v6.1//bpf/prog_lsm.html | 0.68 |
| https://eunomia.dev/GPTtrace/ | 0.66 |
| https://github.com/bschaatsbergen/tpmlsm | 0.63 |
| https://docs.kernel.org/bpf/prog_lsm.html | 0.47 (weak) |
| https://deepwiki.com/eunomia-bpf/gpu_ext/5-tracing-and-observability | 0.32 (weak) |
| https://deepwiki.com/eunomia-bpf/bpf-developer-tutorial/6.1-linux-security-modules-(lsm) | 0.19 (weak) |
| https://medium.com/@yunwei356/ebpf-tutorial-by-example-monitoring-gpu-driver-activity-with-kernel-tracepoints-db3d8bb01d4e | 0.21 (weak) |
| https://ebpf.hamza-megahed.com/docs/chapter5/2-lsm/ | 0.10 (weak) |
