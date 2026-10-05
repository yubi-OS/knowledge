# 08. Governance: open questions, MVP scope, and validation gates

Scope: how ADR-033 is governed, the 4 open questions, the MVP scope with its explicit not-doing list, the 4 assumptions that gate implementation, and the ADR conversion path.

## The ADR path and what an ADR is for

The record's "Where this lives" section fixes the governance path: "Convert to ADR-033 (OMN-109) by filling in the ADR template (Context / Decision / Alternatives / Consequences). Pair with OMN-110 (prior-art search) before ADR-033 is accepted. Pair with OMN-112 (trigger model) before any code lands" (source one-pager, adr-033-misbehavior-cutoff-policy-2026-07-28). The one-pager is the ideation artifact; the accepted ADR is the durable decision record.

That split matches ADR practice: "An architecture decision record (ADR) is one of the most important deliverables of a solution architect. Your architecture is the accumulation of its decisions, so the ADR is effectively" the durable record of those decisions [1] (jev weight 0.951). The community definition is consistent: an ADR "captures an important architectural decision made along with its context and consequences" (weak backing, the architecture-decision-record GitHub org [2], weight 0.472; Mozilla Normandy's ADR docs carry the same definition at weight 0.630 [3]). Template guides prescribe the same section set the record names, context, decision, alternatives, consequences (weak backing, archman [4], weight 0.354; docsio [5], weight 0.396).

## The 4 open questions

The record carries 4 open questions it deliberately does not pre-decide (source one-pager):

1. OQ1, where trigger evaluators live: in the vfio-user server process (faster, harder to audit), a sidecar (adds a hop), or a separate observer process (cleanest trust story).
2. OQ2, who owns the SEVER snapshot: the host, so the operator can reattach, or the guest, so the guest controls its own state. The record notes ADR-031's "no trust-boundary component may consume GPU state" rule cuts against guest-side capture.
3. OQ3, how the policy interacts with the drm-gpu-quota-secure-time skill's SMC-based hard cutoff: complementary (one behavioral, one resource) or conflicting.
4. OQ4, the recovery story after SEVER: fresh vfio-user socket plus cold VM resume, or a clean-room vfio-user server with verified inputs.

Each question is stated as a trade-off with the competing values named, which is what lets a later decision record close it without re-deriving it.

## MVP scope and the not-doing list

The MVP is 5 items (source one-pager):

1. A vfio-user server with a pluggable trigger-evaluator interface, initial evaluator a DMA-window anomaly score with a tunable threshold.
2. A 4-tier policy engine mapping trigger signal to tier to action.
3. A SEVER action that snapshots the guest (qcow2 plus bootc delta), revokes the vfio-user socket, and emits a webhook to the operator.
4. An audit log capturing every tier transition with timestamp, trigger signal, tier, action, and snapshot hash.
5. One end-to-end test: known-good workload stays at INFO or WARN, synthetic anomalous workload escalates to SEVER, and the SEVER snapshot is reattachable.

The not-doing list is the governance content most likely to be violated later, so it is worth restating (source one-pager): re-deciding the mediation mechanism (ADR-031 owns that decision), replacing the virtio-gpu default posture, implementing hardware IOMMU enforcement (post-launch per ADR-031's honesty note), defining workload-specific triggers, and building a new micro-VM or gVisor competitor. Each item names the reason; the first, "Doing so again would create a parallel-track architecture decision," is the record's anti-pattern for decision hygiene.

## Validation gates before code

The record gates implementation on 4 assumptions, each with a named test (source one-pager):

- A1, detectability at the device boundary: prototype a vfio-user server watching DMA-window patterns and measure the false-positive rate against known-good traffic (doc 04).
- A2, snapshot fidelity: qcow2 snapshot plus vfio-user socket teardown plus cold-restore; measure model recovery time (doc 05).
- A3, operator response inside the preservation window: simulation with synthetic operator response times (doc 05).
- A4, ladder monotonicity: policy state-machine verification, so a higher tier is never reached without lower tiers captured first (doc 03).

The discipline here, validating the riskiest assumptions before building, is the standard MVP argument: the minimum viable product exists "to collect the maximum amount of validated learning" with the least effort (weak backing, Wikipedia MVP [6], weight 0.109), and pre-commitment testing exists to "validate assumptions before committing serious time and budget" (weak backing, excited.agency [7], weight 0.113). Experiment-canvas methods structure the same loop of assumption, test, and evidence (weak backing, MVP Experiment Canvas guide [8], weight 0.200). These are weak-backing sources; the gates themselves come from the record.

## Status and drift

The record's latest drift check (2026-09-18, wayfinder round 8, cycle 77) states the OMN-144/147 cluster remains Backlog, the policy text is unchanged, and the note is additive (source one-pager). In governance terms: the decision record is stable, its downstream implementation items are not yet started, and the assumption gates are still open.

## Sources

1. Microsoft Azure Well-Architected, architecture decision record: https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record (weight 0.951)
2. architecture-decision-record GitHub org (weak backing): https://github.com/architecture-decision-record/architecture-decision-record (weight 0.472)
3. Mozilla Normandy, architectural decision records: https://mozilla.github.io/normandy/adrs/index.html (weight 0.630)
4. ArchMan, ADR template (weak backing): https://archman.dev/docs/checklists-and-templates/adr-template (weight 0.354)
5. Docsio, ADR template and examples (weak backing): https://docsio.co/blog/architecture-decision-record (weight 0.396)
6. Wikipedia, minimum viable product (weak backing): https://en.wikipedia.org/wiki/Minimum_viable_product (weight 0.109)
7. Excited.agency, MVP testing (weak backing): https://excited.agency/blog/mvp-testing (weight 0.113)
8. MVP Experiment Canvas guide (weak backing): https://www.europeanacademy.com/wp-content/uploads/2024/05/MVP-Experiment-Canvas-guide.pdf (weight 0.200)
