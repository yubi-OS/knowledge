# 03 - NVIDIA vGPU scheduler policies as the closest resource-policy analogue

Scope: NVIDIA vGPU scheduler modes (Best Effort, Equal Share, Fixed Share) as the closest resource-policy analogue to an escalation ladder, and how they handle misbehaving tenants.

## The three modes

NVIDIA vGPU for Compute offers scheduling policies that let administrators customize resource allocation by workload intensity and organizational priorities (https://docs.nvidia.com/ai-enterprise/release-7/latest/infra-software/vgpu/features/scheduling.html, weight 0.92). The current NVIDIA AI Enterprise documentation states the default scheduling policy is Best Effort, which does not guarantee minimum GPU time for any VM, and recommends Equal Share or Fixed Share when predictable GPU allocation is required (https://docs.nvidia.com/ai-enterprise/release-8/latest/infra-software/vgpu/features/scheduling.html, weight 0.91 and 0.88).

The equal share and fixed share schedulers impose a strict round-robin scheduling policy that maintains fairness by adjusting the time slice for each VM configured with NVIDIA vGPU (https://docs.nvidia.com/vgpu/latest/grid-vgpu-user-guide/changing-vgpu-scheduling-policy.html, weight 0.50). A third-party comparison describes fixed share as giving each vGPU a guaranteed time budget per second, the closest vGPU gets to quality-of-service guarantees (https://drpranayjha.com/nvidia-gpu-partitioning-mig-vgpu-timeslicing/, weight 0.38, weak backing).

Applying a policy change requires a vGPU Manager restart to take effect on existing vGPUs (https://docs.nvidia.com/ai-enterprise/release-8/latest/infra-software/vgpu/features/scheduling.html, weight 0.91). Policy is therefore configuration-time, not runtime-reactive: an operator chooses a mode, and the mode does not change because one tenant misbehaved.

## Fixed Share is the misbehavior-relevant mode

Of the three modes, Fixed Share is the only one whose documented purpose maps to containing a misbehaving tenant: a deterministic per-VM quota prevents one VM from consuming more than its share regardless of what the other VMs do. Best Effort does the opposite, allowing a heavy tenant to crowd out others. Equal Share neutralizes relative greed but still gives every VM its round-robin slot even if it is in an anomalous state.

What none of the modes do is escalate. They are orthogonal resource-partitioning modes, not a severity ladder. A VM gets its share under every mode whether it is healthy, degraded, or actively misbehaving. There is no observed-behavior input to the scheduler, no warn tier, no throttle tier, and no state capture at any point.

## Adjacent: fractional time-slicing in the scheduler layer

NVIDIA's Run:ai platform supports simultaneous submission of multiple workloads to single or multi-GPU setups by slicing GPU memory between workloads according to the requested GPU fraction (https://run-ai-docs.nvidia.com/self-hosted/platform-management/runai-scheduler/resource-optimization/time-slicing, weight 0.84). This is policy at the cluster-scheduler layer, further removed from the device than vGPU Manager, and likewise resource-based rather than behavioral.

Several aggregator posts compare the three time-slicing policies (https://vxworld.co.uk/2025/06/30/understanding-nvidia-vgpu-time-slicing-policies-best-effort-vs-equal-share-vs-fixed-share/, weight 0.25, weak; https://vmorecloud.com/understanding-nvidia-vgpu-time-slicing-policies-best-effort-vs-equal-share-vs-fixed-share/, weight 0.22, weak). Their descriptions are consistent with the primary documentation above but carry no independent authority.

## What is absent against ADR-033

1. Resource-based triggers only. The reviewed policies key on allocation shares and time slices, not on behavioral signals such as DMA patterns or workload output.
2. Orthogonal modes, not tiers. Best Effort, Equal Share, and Fixed Share do not escalate into one another; ADR-033's INFO, WARN, THROTTLE, SEVER ladder is a different shape.
3. No forensic capture. No tier snapshots VM or GPU state before acting; nothing is preserved when a tenant is rescheduled.
4. Policy placement. vGPU scheduling policy lives in vGPU Manager and the hypervisor orchestration layer, observable to the workload it polices, unlike a policy embedded in the device server process.

## Sources considered

| source | weight |
|---|---|
| https://docs.nvidia.com/ai-enterprise/release-7/latest/infra-software/vgpu/features/scheduling.html | 0.92 |
| https://docs.nvidia.com/ai-enterprise/release-8/latest/infra-software/vgpu/features/scheduling.html | 0.91, 0.88 |
| https://docs.nvidia.com/vgpu/latest/grid-vgpu-user-guide/changing-vgpu-scheduling-policy.html | 0.50 (weak) |
| https://run-ai-docs.nvidia.com/self-hosted/platform-management/runai-scheduler/resource-optimization/time-slicing | 0.84 |
| https://drpranayjha.com/nvidia-gpu-partitioning-mig-vgpu-timeslicing/ | 0.38 (weak) |
| https://vxworld.co.uk/2025/06/30/understanding-nvidia-vgpu-time-slicing-policies-best-effort-vs-equal-share-vs-fixed-share/ | 0.25, 0.25 (weak) |
| https://vxworld.co.uk/2025/09/10/nvidia-vgpu-time-slicing-scheduling-policies-best-practice/ | 0.20, 0.26 (weak) |
| https://vmorecloud.com/understanding-nvidia-vgpu-time-slicing-policies-best-effort-vs-equal-share-vs-fixed-share/ | 0.22 (weak) |
