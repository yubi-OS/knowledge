# 02: Evidence Standards

Scope: what counts as acceptable evidence at a readiness gate: documented artifacts, audit-grade standards for sufficiency and appropriateness, and the discipline of keeping decision evidence traceable.

## The audit-evidence standard

The most rigorous public articulation of evidence standards for gate-like decisions is the auditing profession's. PCAOB AS 1105 (Audit Evidence) defines audit evidence as information used by the auditor in arriving at the conclusions on which the auditor's opinion is based, and it establishes requirements for designing and performing audit procedures to obtain sufficient appropriate evidence. The standard distinguishes between the sufficiency of evidence (quantity) and its appropriateness (relevance and reliability in support of the conclusion), and treats evidence from independent external sources as stronger than evidence produced internally (source: https://pcaobus.org/oversight/standards/auditing-standards/details/AS1105, weight 0.61, strong).

That sufficiency-and-appropriateness split is the load-bearing idea for readiness gates. A gate transition claim ("we are ready to sign paid pilots") is a conclusion; the question a gate review asks is whether the evidence behind it is sufficient in quantity and appropriate in kind for that conclusion. A checklist of completed tasks is quantity without appropriateness.

## Decision evidence in go/no-go governance

Go/no-go frameworks describe the decision event itself as structured governance rather than a presentation: defined criteria, decision rights, and consequences, with the decision recorded against the evidence presented (source: https://turn8.co/wp-content/uploads/2026/03/D1_How-to-Design-and-Run-a-Go-or-No-Go-Decisio.pdf, weight 0.32, weak backing). Government-contracting gate reviews add the accountability angle: clear decision criteria and ownership are listed as first-class benefits of gate discipline, alongside preventing spend on low-probability pursuits (source: https://govcongiants.com/guides/gate-reviews, weight 0.44, weak backing).

The DecisionGate standard places evidence at the center of the gate: the gate exists so actions are preceded by responsible decisions, and it is explicitly not a compliance checklist or a review meeting. Its trigger conditions tie gate depth to reversibility, so the evidence bar scales with how hard the decision is to undo (source: https://decisiongate.org/standard.html, weight 0.55, strong).

## What gate evidence looks like in practice

Concrete artifacts recur across practitioner sources:

- A documented readiness assessment behind each decision, so a go/no-go is not decided informally in a meeting without one (source: https://kissflow.com/appstore/npi-gate-review-readiness-authorization-software, weight 0.14, weak backing).
- A defensible compliance record capturing what was tested, how it was tested, who reviewed it, and where every piece of supporting evidence lives (source: https://beefed.ai/en/compliance-verification-package, weight 0.21, weak backing).
- Traceable decisioning: reproducible decisions with evidence that can be followed from conclusion back to source, described as the vendor-agnostic requirement for audit-ready workflows (source: https://insights.authbridge.com/bgv/stakeholder-concerns-decision-criteria/outcomes-proof-of-evidence, weight 0.23, weak backing).
- Third-party reviewability of decision artifacts: a sealed decision artifact is valuable only if a qualified third party can review it as evidence rather than as a vendor-generated summary (source: https://www.thinkingoperatingsystem.com/validate-a-sealed-decision-artifact, weight 0.12, weak backing).

Most of the practical-artifact sources above are vendor or blog material with weak backing (weights below 0.5). Their consistency with the PCAOB standard (weight 0.61, strong) and the DecisionGate standard (weight 0.55, strong) is what makes them usable as descriptions, not proof, of common practice.

## Evidence currency and re-review

Evidence standards include a time dimension. Audit evidence speaks as of a date; a gate decision inherits the staleness of its artifacts. Practitioner material on compliance drift distinguishes configuration, process, personnel, and documentation drift as the four ways a once-true control story becomes false, and notes the same taxonomy applies across SOC 2, ISO 27001, and NIST CSF 2.0 environments (source: https://josefkamara.com/compliance-drift-detection/, weight 0.18, weak backing).

The implication for readiness gates is that each gate's evidence should carry a review date, and a dependent decision (for example, a gate definition citing a blocker status) should be re-checked against its source at the time the dependent decision is made, not trusted from the earlier citation. This is the same-day drift check pattern: when two documents depend on the same evidence, a same-day diff between them catches the case where one has moved and the other has not.

## Design rules for gate evidence

1. Separate quantity from appropriateness. Enough artifacts is not the same as the right artifacts; the PCAOB distinction applies directly (source: https://pcaobus.org/oversight/standards/auditing-standards/details/AS1105, weight 0.61, strong).
2. Prefer independent external evidence. Evidence produced by the party making the claim is the weakest class in the audit standard; for a security product, external review evidence outranks self-attestation (source: https://pcaobus.org/oversight/standards/auditing-standards/details/AS1105, weight 0.61, strong).
3. Name the decision owner. Gate reviews list clear ownership as a benefit; evidence without an accountable reviewer is filing, not gating (source: https://govcongiants.com/guides/gate-reviews, weight 0.44, weak backing).
4. Date-stamp every artifact and re-verify at use. Evidence age is part of evidence quality (source: https://josefkamara.com/compliance-drift-detection/, weight 0.18, weak backing).
