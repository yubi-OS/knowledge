# offer-pricing-architecture

Knowledge corpus minted from yubi-OS/yubiOS `refs/offer-pricing-architecture-2026-07-25.md` (topic: offer and pricing architecture for an early-stage infrastructure product: pricing models, packaging tiers, hypothesis discipline for unvalidated pricing, and how to structure offers before willingness-to-pay evidence exists).

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | offer-catalog-design | Structuring an initial offer catalog across recurring and non-recurring offer types, with explicit boundaries on what not to sell. |
| 02 | pricing-model-shapes | Matching pricing shapes to offer types: subscription, per-seat/per-device, usage-scaled, cost-plus, flat project, SLA-linked. |
| 03 | packaging-and-tiers | Tier design by fleet size or seat count, bundle packaging, and discount discipline when tier logic is unvalidated. |
| 04 | pricing-hypothesis-discipline | Treating unvalidated prices as falsifiable hypotheses with named validation and invalidation criteria and paid pilots as the instrument. |
| 05 | willingness-to-pay-evidence | Gathering willingness-to-pay evidence before it exists: design partners, substitution tests, behavioral signals versus surveys. |
| 06 | readiness-gates-before-selling | Gating each offer on engineering and operational readiness (owner, evidence target, recovery plan) before it is sellable. |
| 07 | revenue-prioritization | Sequencing offers by gate distance and commitment risk rather than hypothesized size. |
| 08 | cost-basis-and-margin | Building a cost basis for pricing: BOM, labor, margin arithmetic for bundles, and labeling unvalidated margins. |

## Research summary

- Results collected: 228 searXNG results across 38 queries (16 first pass, 16 redo pass, 6 second redo pass), top 6 kept per query.
- Weight split (jev noul, clef): 33 results at weight >= 0.5 (authoritative), 195 at weight < 0.5 (weak backing, labeled as such in doc text).
- Jev requests: 50 total (1 preflight probe, 1 outline validation, 48 weighting requests in batches of 5). Usage: 37784 input tokens, 0 output tokens.
- Redos: 11 total (8 subtopics redone once after the first pass drifted off-topic; docs 04, 05, 07 redone a second time for thin authoritative backing).
- Skipped docs: none. All 8 subtopics were authored; weakly backed claims are labeled inline.

Every factual claim in the docs carries its source URL and jev weight. Weight >= 0.5 backs a claim as authoritative; weight < 0.5 is labeled weak backing in the text.

Preflight 2026-10-05: searXNG 71 results healthy; /api/decide (clef) 200.
