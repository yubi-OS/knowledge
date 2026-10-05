# Lockout test plan and ADR trust boundary

Scope: the Frost test plan (false positive, active abuse, recovery, attribution, notification, escape, hardware split) and the ADR language defining the trust boundary between Linux policy and the secure-world cutoff.

## The test plan

The source design defines 7 test obligations for any lockout milestone:

1. False positive: benign GPU load must not trigger Frost. Thermal throttling can masquerade as workload anomaly on Mali systems, which Mesa's benchmarking documentation warns about directly (source: https://docs.mesa3d.org/drivers/panfrost/benchmarking.html, jev weight 0.67), so the false-positive suite must run against a thermally stable board.
2. Active abuse: a runaway shader or faulting workload triggers the documented policy path end to end.
3. Recovery: the compositor and desktop recover, or the owner sees a clear reboot or relogin requirement. Desktop-level reset recovery is feasible: a 2026 GSoC project made Mutter survive GPU resets that previously crashed the whole GNOME session (source: https://blogs.gnome.org/anonymoux47/2026/08/28/gpu-reset-recovery-in-mutter-gsoc-wrap-up/, jev weight 0.70), but that is compositor work the lockout mechanism cannot assume everywhere.
4. Attribution: logs name board, GPU, cgroup, pid and comm, with DRM fdinfo evidence backing the attribution (source: https://lwn.net/Articles/944282/, jev weight 0.77) and the action taken.
5. Notification: the owner-selected notification path receives a summary without secrets.
6. Escape: already-open DRM fds cannot continue submitting past the lockout milestone being claimed. The device-BPF primitive only gates opens (source: https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v1/devices.html, jev weight 0.80), so this test is what keeps each stage's claim honest.
7. Hardware: the suite runs separately on ROCK 5B (RK3588) and ROCKPro64 (RK3399) before any production language.

## Discipline from adjacent practice

Industrial GPU fleets validate in tiers: NVIDIA's DCGM documentation prescribes a quick suite as a readiness check, a medium suite when investigating a failed workload, and long or extra-long suites for administrator-led isolation and post-mortem testing (source: https://docs.nvidia.com/datacenter/dcgm/latest/learn/modules/dcgm-diagnostics.html, jev weight 0.92). The Frost plan follows the same shape: cheap false-positive runs first, targeted abuse reproduction second, full board campaigns last. GPU failure-detection research is increasingly built on large public telemetry sets, which is the same evidence-first posture the attribution requirement encodes (source: https://arxiv.org/html/2603.28781v1, jev weight 0.75). Generic GPU stress tooling exists for the abuse cases but scored weak in this pass and on the wrong hardware family (source: https://github.com/eliezer8990/GPUTest4Pytorch, jev weight 0.32, weak backing), so the abuse workload should be a purpose-built Panfrost shader or faulting job.

## The ADR trust boundary

The ADR language should fix one boundary: Linux may classify and request; secure world may enforce board-level cutoff. The enforcement-boundary framing is standard: an architecture pattern that separates the policy-deciding component from the enforcement point, so that no other action may skip the enforcing layer (source: https://microsoft.github.io/agent-governance-toolkit/ARCHITECTURE/, jev weight 0.80; source: https://opensource.microsoft.com/blog/2026/04/02/introducing-the-agent-governance-toolkit-open-source-runtime-security-for-ai-agents/, jev weight 0.84). Kernel-enforced damage boundaries for agent systems make the same argument in the Linux context: without an enforcing reference monitor at the kernel boundary, policy errors become operating system side effects (source: https://arxiv.org/abs/2609.38248, jev weight 0.59). Examples of ADRs drawing kernel or policy boundaries exist as format precedents but scored weak in this pass (source: https://github.com/duriantaco/gatemole/blob/main/docs/architecture/ADR-001-agent-kernel-boundary.md, jev weight 0.11, weak backing; source: https://github.com/MetaAny/AnyFusion/blob/main/docs/adr/0014-planning-agent-policy-kernel-boundary.md, jev weight 0.22, weak backing).

Three ADR commitments follow from the design:

1. Owner recovery must remain possible and must be documented before any automatic hard cutoff is enabled. A cutoff the owner cannot reverse is a lockout of the owner.
2. The secure-world command surface stays narrow (one quarantine semantic with board-specific implementation), because SMC handlers are a known attack surface.
3. Every stage's claim is scoped to what its tests proved: Stage 0 denies new opens only, Stage 1 attributes and isolates from userspace, Stage 2 gates new submissions, Stage 3 recovery language comes only after the ROCK 5B and ROCKPro64 campaigns.

A detection-to-enforcement pattern from adjacent AI infrastructure work (continuous verification, evidence generation, policy-driven response) scored weak in this pass (source: https://dev.to/ces1231/gpuworkloadmismatch-part-ii-from-detection-to-runtime-enforcement-for-ai-infrastructure-3l03, jev weight 0.12, weak backing) and a news item on an AppArmor trust-boundary defect is a reminder that boundary code itself needs review (source: https://windowsforum.com/news/cve-2026-23409-apparmor-differential-encoding-verification-trust-boundary-risk.411376/, jev weight 0.05, weak backing).
