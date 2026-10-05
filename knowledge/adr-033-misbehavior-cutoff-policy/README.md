# adr-033-misbehavior-cutoff-policy

Knowledge corpus minted from yubi-OS/yubiOS refs/adr-033-misbehavior-cutoff-policy-2026-07-28.md. Topic: misbehavior-triggered cutoff policy for AI/ML workloads on PCI devices, the policy design (PCI mediation cutoff on detected misbehavior), its ideation and decision record, trigger tiers, and governance.

## Docs

- [01-vfio-user-mediation-boundary.md](01-vfio-user-mediation-boundary.md): The vfio-user / IOMMU-gated PCI passthrough mediation boundary the policy sits on, and why a host-side device server is the cutoff point.
- [02-iommu-dma-threat-model.md](02-iommu-dma-threat-model.md): The IOMMU/DMA threat model for GPU passthrough: why DMA from a device can read host memory and exfiltrate secrets without touching the network.
- [03-severity-ladder-policy.md](03-severity-ladder-policy.md): Severity-ladder escalation policy design: INFO/WARN/THROTTLE/SEVER tiers, monotonicity, and mapping trigger signal to tier to action.
- [04-device-boundary-detection.md](04-device-boundary-detection.md): Detecting AI/ML workload misbehavior from a host-side device observer without seeing model internals: DMA-window anomaly signals and false-positive risk.
- [05-snapshot-and-sever.md](05-snapshot-and-sever.md): Snapshot-and-sever at SEVER: VM state capture (qcow2 snapshots), vfio-user socket revocation, freezing rather than killing the VM, and forensic recovery.
- [06-ideation-decision-record.md](06-ideation-decision-record.md): The ideation method behind the ADR: autonomous variation generation, structured lenses, and the painkiller/switching-cost/defensibility/testability scoring that picked the finalist.
- [07-rejected-alternatives.md](07-rejected-alternatives.md): The rejected design alternatives and their recorded critique: kill-the-VM, network-only cutoff, operator-in-the-loop watchdog, pre-deployment fingerprinting, constraint removal.
- [08-governance-mvp-gates.md](08-governance-mvp-gates.md): Governance: open questions (evaluator placement, snapshot ownership, interplay with resource-quota cutoffs, recovery story), MVP scope, assumptions to validate, and the ADR/issue path.

## Research summary

- Results collected: 114 (searXNG; 16 seed queries plus 3 redo queries)
- Weight split: 38 authoritative (noul >= 0.5) / 76 weak (noul < 0.5) of 114
- Jev requests: 25 (1 preflight probe, 1 outline validation with 8 score questions, 20 weighting batches of 5 noul questions, 3 redo weighting batches), usage 19418 input / 0 output tokens
- Redos: doc 06 (ideation-decision-record): 1 redo dig, reason: initial dig too thin: all results noul < 0.5, cannot author honestly with weak backing alone
- Skipped docs: none; all 8 subtopics authored

Outline validation (score metric, clef): all 8 subtopics scored above 0 on the padding/marginal/load-bearing scale; none dropped.

Per-doc source counts:
- 01-vfio-user-mediation-boundary: 12 results kept, 10 primary (>= 0.5)
- 02-iommu-dma-threat-model: 12 results kept, 7 primary (>= 0.5)
- 03-severity-ladder-policy: 12 results kept, 1 primary (>= 0.5)
- 04-device-boundary-detection: 12 results kept, 6 primary (>= 0.5)
- 05-snapshot-and-sever: 12 results kept, 7 primary (>= 0.5)
- 06-ideation-decision-record: 30 results kept, 1 primary (>= 0.5)
- 07-rejected-alternatives: 12 results kept, 3 primary (>= 0.5)
- 08-governance-mvp-gates: 12 results kept, 3 primary (>= 0.5)

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
