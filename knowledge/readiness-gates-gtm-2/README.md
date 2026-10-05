# Readiness Gates and Go-to-Market for an Early-Stage Security Product

Minted 2026-10-05 from yubi-OS/yubiOS refs/readiness-gates-gtm-2026-07-28.md (OMN-73, section 5 of the yubiOS Business and Stewardship Plan). The source doc defines a gate ladder (Gate 0 through Gate 3, plus the 2026-07-28 additions Gate 1.5 and Gate 2.5) with per-gate evidence standards; this corpus decomposes that structure into general knowledge documents grounded in web research.

## Documents

| NN | doc | scope |
|---|---|---|
| 01 | 01-stage-gate-frameworks.md | Stage-gate models: gates as go/no-go decision points with explicit entry and exit criteria, kill paths, and reversibility-aware gating. |
| 02 | 02-evidence-standards.md | What counts as acceptable gate evidence: sufficiency versus appropriateness, independent external evidence, traceable artifacts, evidence currency. |
| 03 | 03-security-audit-gate.md | The independent security review required before commercial pilots: review tiers, SOC 2 Type 1 versus Type 2, published report versus private attestation. |
| 04 | 04-pricing-validity-gate.md | Validating a documented list price with revealed-preference priced proposals before scaling; how discounts distort the financial model. |
| 05 | 05-pilot-sow-gates.md | The gate before a paid pilot SOW: pilot agreements, design-partner distinctions, and scoping the SOW to evidenced claims only. |
| 06 | 06-reference-customer-gate.md | The gate between pilot and expansion: reference and case-study agreements, and buyer research on why referenceable customers gate expansion. |
| 07 | 07-proof-first-sales-motion.md | A staged sales motion where each stage's proof preconditions the next; public proof artifacts as the first rung. |
| 08 | 08-ga-readiness-assurance.md | General availability claims gated on production evidence, and the shift from one-off pilot proof to recurring annual assurance. |
| 09 | 09-gate-evidence-drift.md | Keeping gate evidence current: drift surfaces, detection mechanisms, and the review-gate discipline of same-day diffs and dated citations. |

## Research summary

- Results collected: 156 (searXNG, 18 seed queries plus 6 redo queries across 3 subtopics; top 6 kept per query)
- Weight split (jev noul via clef): 22 results at weight >= 0.5 (authoritative backing), 134 results below 0.5 (weak backing, labeled as such in the docs)
- Jev requests: 36 (26566 input tokens, 0 output tokens) across outline validation (9 score questions, 1 request), preflight probe (1 request), and result weighting (batches of 5)
- Redo counts: 4 dig redos total (pilot-sow-gates 1, reference-customer-gate 1, proof-first-sales-motion 2)
- Skipped docs: none; all 9 subtopics authored
- One /api/decide 429 during weighting, retried per the redo rule after 30s

## Authoring rules applied

Every factual claim carries its source URL and the jev weight that backed it. Claims backed at weight >= 0.5 are presented with strong backing; claims backed below 0.5 are explicitly labeled weak backing. No claim ships without a source.

Preflight 2026-10-05: searXNG 57 results healthy; /api/decide (clef) 200
