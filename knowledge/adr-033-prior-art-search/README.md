# adr-033-prior-art-search

Knowledge corpus minted 2026-10-05 from yubi-OS/yubiOS refs/adr-033-prior-art-search-2026-07-28.md.

Topic: prior art for behavioral cut-off of AI/ML workloads via PCIe/device-level controls - GPU device isolation, MIG, cgroup device controllers, runtime eBPF enforcement, and related systems surveyed for ADR-033.

## Docs

- [01-vfio-user-protocol-baseline](./01-vfio-user-protocol-baseline.md) - What the vfio-user protocol itself mandates for client misbehavior and where it stops short of any trigger model. (outline score 1.5301)
- [02-vfio-mdev-vendor-error-paths](./02-vfio-mdev-vendor-error-paths.md) - Kernel VFIO mediated devices: IOMMU-group isolation and vendor-driver error paths with no shared behavioral policy. (outline score 1.0525)
- [03-nvidia-vgpu-scheduler-policies](./03-nvidia-vgpu-scheduler-policies.md) - NVIDIA vGPU scheduler modes (Best Effort, Equal Share, Fixed Share) as the closest resource-policy analogue to an escalation ladder. (outline score 1.3474)
- [04-nvidia-mig-sriov-partitioning](./04-nvidia-mig-sriov-partitioning.md) - MIG and SR-IOV hardware partitioning: isolation guarantees, IOMMU/ARI/AER prerequisites, and device-level cut-off options. (outline score 1.3631)
- [05-suspend-resume-state-capture](./05-suspend-resume-state-capture.md) - Suspend-resume, qcow2 snapshots, and live migration as state-preservation patterns at cut-off; discard versus preserve. (outline score 1.2827)
- [06-cgroup-device-controllers](./06-cgroup-device-controllers.md) - Device-level cut-off via cgroups: devices controller legacy, BPF_CGROUP_DEVICE, and the DRM memory cgroup for VRAM caps. (outline score 1.0657)
- [07-ebpf-runtime-enforcement](./07-ebpf-runtime-enforcement.md) - Runtime eBPF enforcement: BPF LSM hooks for device access control and GPU driver tracing and anomaly-signal collection. (outline score 0.6515)
- [08-anomaly-escalation-ladders](./08-anomaly-escalation-ladders.md) - Anomaly-detection taxonomies and escalation-ladder designs in adjacent systems (NIST DARE, systemd, OPA/Rego). (outline score 0.8049)

## Research summary

- Results collected: 96 (top 6 per query, 16 searXNG queries, 2 per doc)
- Weight split: 60 high (>= 0.5) / 36 low (< 0.5) of 96 weighted
- jev requests: 23 (1 preflight probe, 1 outline validation, 20 weighting batches of 5, 1 redo of 2 unweighted results); usage 17099 input / 0 output tokens
- Redo counts: 1 jev redo (one weighting batch hit 429, retried after 30s backoff and split); 0 dig redos (all 16 queries returned results on the first attempt)
- Skipped docs: none (all 8 subtopics scored above 0 in outline validation and all 8 digs returned enough weighted results to author honestly)

## Research DB

Under [research-db/](./research-db/): preflight.json (endpoint probes), outline.json (subtopics + score validation), archive.json (all 96 results with per-result noul decisions), digs/ (per-doc dig records), jev-log.json (one entry per jev HTTP request), db.ts (TypeScript interfaces).

Preflight 2026-10-05: searXNG 59/62 probe results healthy; /api/decide (clef) 200.
