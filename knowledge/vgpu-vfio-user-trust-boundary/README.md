# vgpu-vfio-user-trust-boundary

Knowledge corpus minted from yubi-OS/yubiOS `refs/vgpu-vfio-user-trust-boundary-2026-07-25.md` on 2026-10-05.

Topic: vGPU, VFIO, and vfio-user versus a host trust boundary: the design and CI plan for GPU device virtualization that preserves the host's security posture, with failure modes and a recovery baseline.

## Docs

| NN | doc | scope |
| --- | --- | --- |
| 01 | [01-vfio-pci-kernel-iommufd.md](01-vfio-pci-kernel-iommufd.md) | Kernel VFIO framework, IOMMU groups, container/group/device, and the iommufd + device cdev migration |
| 02 | [02-vfio-user-protocol.md](02-vfio-user-protocol.md) | vfio-user: device model in a separate userspace process over AF_UNIX, negotiation, mutual distrust, limitations |
| 03 | [03-virtio-gpu-default.md](03-virtio-gpu-default.md) | virtio-gpu as the default image device model and why it introduces no new trust peer |
| 04 | [04-dma-key-extraction.md](04-dma-key-extraction.md) | DMA-capable devices as a key-extraction primitive and the IOMMU as the enforcing boundary |
| 05 | [05-adr-rules-policy.md](05-adr-rules-policy.md) | Candidate ADR-024 policy rules: default device model, gated passthrough, socket discipline, unlock invariant |
| 06 | [06-testability-matrix.md](06-testability-matrix.md) | What is testable where: hosted runners, self-hosted KVM, bare metal |
| 07 | [07-ci-implementation.md](07-ci-implementation.md) | The landed CI implementation: workflow, bcvk patch, pinned libvfio-user, loud-SKIP contract |
| 08 | [08-failure-recovery.md](08-failure-recovery.md) | Failure modes, recovery baseline, and the research-to-enforcement promotion gate |
| 09 | [09-vendor-vgpu-3d.md](09-vendor-vgpu-3d.md) | NVIDIA vGPU, archived GVT-g, and virgl/Venus 3D as the bare-metal-only tier |

## Research summary

- Results collected: 108 (kept top 6 per query, 2 queries per subtopic, 9 subtopics)
- Weight split: 62 authoritative (jev weight >= 0.5), 46 weak (< 0.5). Every collected result carries a non-null weight.
- Jev requests: 24 (1 preflight probe, 1 outline score validation with 9 questions, 22 noul weighting batches of 5), usage 19177 input / 0 output tokens, model clef via /api/decide on steady-orbit.
- Redo counts: 0 (no dig needed a redo; all 18 queries returned results; no /api/decide retry was needed)
- Skipped docs: none. All 9 outlined subtopics validated load-bearing (score range 0.85 to 1.87, none scored 0) and were authored.

Claims carry their source URL and the jev weight that backed them; claims resting on weight < 0.5 sources are labeled weak backing in the text. Junk results (low-weight aggregator, forum, or off-topic hits) were never cited.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
