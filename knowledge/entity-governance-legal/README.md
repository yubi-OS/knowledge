# knowledge/entity-governance-legal

Corpus on entity formation, governance, and legal review for an open-source security project: the decision tracks that frame entity structure, governance, and legal posture without resolving them prematurely.

Minted 2026-10-05 from yubi-OS/yubiOS `refs/entity-governance-legal-2026-07-25.md` (OMN-72 decision-framing track).

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-entity-formation-options.md](01-entity-formation-options.md) | Comparison of US entity types (sole proprietorship, LLC, nonprofit) for a solo-founder pre-revenue security software project |
| 02 | [02-nonprofit-foundation-structures.md](02-nonprofit-foundation-structures.md) | 501(c)(3) vs 501(c)(6), fiscal sponsorship (SFC, Open Collective), foundation umbrellas |
| 03 | [03-governance-models.md](03-governance-models.md) | Governance models (BDFL, foundation, vendor-led, community-led) and the single-founder gap before GA |
| 04 | [04-security-disclosure-review.md](04-security-disclosure-review.md) | Security disclosure contact, CVD policy, trusted external review for security-critical changes |
| 05 | [05-contracts-sow-consulting.md](05-contracts-sow-consulting.md) | SOW essentials: deliverables IP, consultant IP, SLA enforceability, governing law |
| 06 | [06-professional-liability-insurance.md](06-professional-liability-insurance.md) | E&O and cyber liability insurance considerations for a solo security consultancy |
| 07 | [07-privacy-policy-hosted-offers.md](07-privacy-policy-hosted-offers.md) | Privacy policy and DPA requirements before launching hosted offers |
| 08 | [08-export-controls-crypto.md](08-export-controls-crypto.md) | EAR encryption controls for open-source crypto software: ECCN 5D002, 15 CFR 742.15/734.17, CCATS |
| 09 | [09-funding-structure-fit.md](09-funding-structure-fit.md) | How funding path interacts with entity choice and grant eligibility |

## Research summary

- Results collected: 108 (9 subtopics, 2 queries each, top 6 per query kept)
- Weight split: 30 results at jev weight >= 0.5 (authoritative), 78 below 0.5 (weak backing, labeled in text)
- Jev requests: 46 total (1 outline score, 1 probe, 22 weighting pass 1, 22 weighting pass 2), usage 34354 input tokens / 0 output tokens
- Redo counts: dig redos 0; weighting redos 22 requests (pass 1 parsed the clef answer shape incorrectly and was fully superseded by pass 2; archive carries pass 2 answers only)
- Skipped docs: none (all 9 subtopics digged deep enough to author honestly)

Preflight 2026-10-05: searXNG 134 probe results healthy (15 engines unresponsive or rate-limited, core search functional); /api/decide (clef) 200.

## Per-doc sources

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01-entity-formation-options | 12 | 1 |
| 02-nonprofit-foundation-structures | 12 | 2 |
| 03-governance-models | 12 | 4 |
| 04-security-disclosure-review | 12 | 8 |
| 05-contracts-sow-consulting | 12 | 0 |
| 06-professional-liability-insurance | 12 | 1 |
| 07-privacy-policy-hosted-offers | 12 | 1 |
| 08-export-controls-crypto | 12 | 7 |
| 09-funding-structure-fit | 12 | 6 |

Note on doc 05 and 07: the collected sources for consulting-contract boilerplate and privacy policy guidance are vendor and marketing-adjacent, which the decision model scored below 0.5; claims from those sources are labeled weak backing in the text and the underlying regulatory texts should be pulled directly when the documents are actually drafted.
