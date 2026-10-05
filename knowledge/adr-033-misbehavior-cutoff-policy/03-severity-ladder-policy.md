# 03. Severity ladder design: INFO, WARN, THROTTLE, SEVER

Scope: the 4-tier escalation policy at the core of ADR-033, the precedent for tiered response, and the monotonicity requirement that makes the ladder verifiable.

## The ladder

ADR-033's recommended policy (Variation 3, Severity-Ladder Snapshot-and-Sever) is a 4-tier escalation: INFO (log only) to WARN (snapshot metadata, no sever) to THROTTLE (snapshot state, halve GPU bandwidth) to SEVER (snapshot full VM state, revoke vfio-user socket, freeze VM, alert operator). The design property the ladder buys is stated in the source one-pager: "Preserves forensic state at every tier (severity ladder means something is always captured)" and it is "recoverable by design, the VM stays alive at SEVER; only the device access is severed" (source one-pager, adr-033-misbehavior-cutoff-policy-2026-07-28).

## Precedent for tiered escalation

Tiered escalation is the established shape of incident management, and the policy imports its discipline. Atlassian's guidance on escalation policies describes exactly the mapping ADR-033 builds: an escalation policy ties each severity level to a specific response workflow, with "responders [who] can escalate incidents within the incident ticket" through guided workflows [1] (jev weight 0.614). General practitioner guides make the same structural point, that severity classification must map to concrete response steps rather than labels alone (weak backing, 0.352 invgate [2], 0.236 msspsecurity [3], 0.232 clearfeed [4]).

The graduated-response pattern is also documented as a distinct enforcement philosophy: "a tiered enforcement model that applies proportionate action based on the assessed level of risk. Rather than treating every policy breach as identical" (weak backing, nhimg glossary [5], weight 0.278; similar framing at brimco [6], weight 0.421). ADR-033's ladder is this pattern applied to device mediation: the response scales with assessed severity, and the most severe response is still proportionate (sever the device, not the workload's whole state).

The most on-topic adjacent standard in the dig is an IETF individual draft on adaptive authorization for agentic AI, which targets "graduated and escalated execution control for critical infrastructure" [7] (weak backing, jev weight 0.376, draft-das-agentic-adaptive-authorization-00). It is an individual draft, not a standard, but it shows the same design space (graded execution control for AI agents) being formalized elsewhere.

## Why THROTTLE exists as a distinct tier

The ladder is not just log, warn, kill. THROTTLE is the only tier that changes device behavior without cutting it: it snapshots state and halves GPU bandwidth. That tier exists because many misbehavior patterns are degenerate or runaway resource use rather than active compromise, and a bandwidth ceiling is both a mitigation and a signal amplifier (a throttled workload that then escalates its access pattern moves up the ladder). The tier set is workload-agnostic by decision: the source one-pager explicitly excludes defining workload-specific triggers (LLM agent vs training vs inference), leaving those to downstream issues (source one-pager).

## Monotonicity as a verifiable property

Assumption A4 in the source record: "The severity ladder is monotonic, a higher tier is never triggered without a lower one being captured first," with the test being policy state-machine verification (source one-pager). This is the property that makes the ladder auditable. If every SEVER implies a WARN-time metadata snapshot and a THROTTLE-time state snapshot already exist in the audit log, then the SEVER snapshot can be cross-checked against what the system believed earlier. The audit log design (every tier transition records timestamp, trigger signal, tier, action, snapshot hash) is the concrete artifact that carries this (source one-pager).

## Operator-facing constraints

The ladder's second-order effect risk is named in the record's stress test: "Operators may become numb to WARN-tier alerts if they're frequent. Need careful rate-limiting and summarization in the operator console" (source one-pager). The escalation-management literature backs the underlying mechanism: escalation policies exist precisely to route only the right events to the right people at the right speed [1] (weight 0.614), and practitioner guides warn that undifferentiated severity floods the responder channel (weak backing, inventivehq [8], weight 0.149). A policy engine that emits a WARN per DMA-window wobble would defeat its own alerting tier.

## Sources

1. Atlassian, escalation policies for incident management: https://www.atlassian.com/incident-management/on-call/escalation-policies (weight 0.614)
2. InvGate, incident severity levels SEV1 to SEV5 (weak backing): https://blog.invgate.com/incident-severity-levels (weight 0.352)
3. MSSP Security, incident severity escalation levels (weak backing): https://msspsecurity.com/incident-severity-escalation-levels/ (weight 0.236)
4. ClearFeed, incident escalation matrix (weak backing): https://clearfeed.ai/blogs/incident-escalation-matrix (weight 0.232)
5. NHIMG glossary, graduated response policy (weak backing): https://nhimg.org/glossary/graduated-response-policy/ (weight 0.278)
6. Brimco, graduated response strategy (weak backing): https://brimco.io/terms/g/graduated-response-strategy/ (weight 0.421)
7. IETF draft-das-agentic-adaptive-authorization-00 (weak backing): https://datatracker.ietf.org/doc/draft-das-agentic-adaptive-authorization/ (weight 0.376)
8. InventiveHQ, incident severity classification (weak backing): https://inventivehq.com/blog/incident-severity-levels-classification-guide (weight 0.149)
