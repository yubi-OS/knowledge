# Readiness gates: mapping evidence state to allowable market claims

Scope: mapping evidence state to gate levels (provisional entry through general availability) and which market claims unlock at which gate.

## The gate model

A readiness-gate model converts an evidence boundary from a judgment call into a lookup: at each gate, a defined set of evidence conditions holds, and a defined set of market claims is allowed. The yubiOS project's readiness-gates document (OMN-73, PR #118) establishes such a ladder and its evidence-boundary snapshot (OMN-68, 2026-07-25) pins the organization's current position: Gate 1 (provisional), with general availability and public pricing off-limits before Gate 3.

The closest mature public model is Stage-Gate, the idea-to-launch framework in which a product passes through defined stages separated by gates with explicit criteria. Stage-Gate International's overview stresses that merely having the process does not guarantee success; successful companies share common features in how their process gates actually operate (https://www.stage-gate.com/blog/the-stage-gate-model-an-overview/, weight 0.74, primary vendor methodology). The transferable idea for an early-stage security project is that gates are decision points with criteria, not calendar milestones.

## Entry and exit criteria as the gate's substance

A release-management best-practice body states the mechanism directly: define explicit, written entry and exit criteria for every readiness gate a release passes through, scaled to the release's risk classification, each backed by adequate release documentation as evidence (https://if4it.org/best-practices/release-management/release-readiness-gates-entry-and-exit-criteria-for-every-environment/, weight 0.49, weak). Three properties matter for claims mapping:

1. Written: criteria that live in prose memory cannot gate anything.
2. Evidence-backed: each criterion points at documentation or runs that prove it.
3. Risk-scaled: a kernel replacement and a blog post should not share a gate.

An infrastructure-vendor playbook applies the same shape to automation: readiness gates are the go/no-go mechanism determining whether a change enters a controlled, understood environment versus one where issues only become visible when production breaks (https://docs.digicert.com/nl/trust-architecture-playbook/automation-pillar/automation-readiness-gates.html, weight 0.35, weak). For a security OS, the "controlled, understood environment" is the point: gates exist so that claims about trust properties are made only about environments where the evidence was actually collected.

## Mapping claims to gates

The yubiOS snapshot's off-limits list is already gate-shaped, and generalizes as follows:

1. Gate 1 (provisional): technical evidence exists (repo, CI, build pipeline); the only claims allowed are descriptive of the artifacts themselves. The snapshot's reusable summary lives here: public, licensed, work-in-progress, specific blockers open.
2. Gate 2 (technical readiness): named technical blockers closed with citable runs. Unlocks: capability claims tied to specific runs ("FIDO2 unlock proven in VM CI by run N"). Still locked: production-ready, ROI, pricing.
3. Gate 3 (commercial readiness): real-world validation exists (physical-hardware validation, a paid pilot with measured results, signed SOWs). Unlocks: production-readiness claims scoped to the validated configuration, measured pilot results with data, published pricing, general availability.

The strict reading to preserve: each unlock is scoped to the evidence class that closed. A pilot on one customer's hardware in one configuration does not unlock "enterprise-ready" universally; it unlocks the specific measured claims the pilot produced. This mirrors the function-level enumeration discipline from the hardware-evidence doc in this corpus.

A product-development gate-process guide describes the same structure in NPD terms (https://useshiny.com/blog/new-product-development-gate-process/, weight 0.34, weak), and a launch-readiness scorecard approach reduces gate decisions to weighted go/no-go criteria (https://data-panda.com/post/product-launch-readiness-scorecard, weight 0.18, weak). Both are weakly backed and directional only.

## Why gates and blockers need each other

Gates without a blocker list drift into checklists nobody verifies; a blocker list without gates produces closure events with no claim consequence. The yubiOS pairing is the fix: BLOCKERS.md holds the named evidence gaps (B-VM-CTAP2, B-REAL-FIDO2, B-HARDENING-RUNTIME, B-BOOTC-SEAL, B-ARM64-PATHA, B-RK3588-TPL, plus the business-side gaps), the readiness-gates doc defines which combinations unlock which claims, and the evidence-boundary snapshot states the current gate position (Gate 1, provisional) with a dated boundary summary.

The snapshot also handles the interaction with marketing vocabulary at the bottom rung honestly: at Gate 1 the project describes itself as a "public, LGPL-2.1-licensed, work-in-progress FIDO2-first immutable OS," which is a descriptive claim backed entirely by inspectable artifacts. That is what a Gate 1 claims surface should sound like: nothing aspirational, everything checkable.

One caveat this corpus records: gate frameworks from consultancies and vendor docs are abundant, but primary evidence tying specific gate levels to specific market-claim permissions is thin outside regulated industries. The yubiOS approach of deriving gates from its own exit criteria (per OMN-66) and enforcing them through its own off-limits list is therefore the more defensible pattern: the gate definitions are the project's own commitments, auditable against its own blocker list, rather than an imported framework whose authority is borrowed.
