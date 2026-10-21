# Hierarchy-oracle ideation (solo)

Knowledge corpus `hierarchy-oracle-solo`, minted in the 22-corpus `refs/` wave (Lane 1).

**Ground source:** `yubi-OS/yubiOS refs/hierarchy-oracle-solo-2026-10-06.md`

**Topic:** Hierarchy-oracle ideation [SOLO]

## Documents

| NN | File | Scope | Clef outline score |
|---|---|---|---|
| 01 | [01-problem-statement.md](01-problem-statement.md) | Problem statement: detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-oracle-solo-2026-10-06.md. | 1.6816 |
| 02 | [02-generation-log-jev-weighted.md](02-generation-log-jev-weighted.md) | Generation log (jev-weighted): detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-oracle-solo-2026-10-06.md. | 1.1867 |
| 03 | [03-finalist-stress-test.md](03-finalist-stress-test.md) | Finalist stress-test: detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-oracle-solo-2026-10-06.md. Internal-record subtopic, no dig. | 1.1941 |
| 04 | [04-what-the-instruments-said-employment-record.md](04-what-the-instruments-said-employment-record.md) | What the instruments said (employment record): detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-oracle-solo-2026-10-06.md. Internal-record subtopic, no dig. | 0.9978 |
| 05 | [05-failure-modes-and-scope-boundaries.md](05-failure-modes-and-scope-boundaries.md) | Documented failure modes, negative results, and explicit non-claims. Internal-record subtopic, no dig. | 1.4596 |
| 06 | [06-integration-and-operational-governance.md](06-integration-and-operational-governance.md) | Integration with yubiOS and Steady Orbit /jev/ endpoints, policy versioning, and audit trail. Internal-record subtopic, no dig. | 1.3908 |

Docs 01 and 02 are dig-backed (searXNG results weighted by clef, cited inline with their weights). Docs 03 to 06 are internal-record subtopics grounded only in the ground-source doc, with no external web dig.

## Research summary

- **20 results collected** (10 per dig, 2 digs: `dig_context_01.json` for doc 01, `dig_context_02.json` for doc 02)
- **Quality weights (clef noul):** high >= 0.5: 2; low < 0.5: 18
- **5 jev requests** (5 recorded in stats)
- **0 redos**
- **0 skips**
- Outline validated with the clef `score` metric (3 levels: padding / marginal / load-bearing); all 6 subtopics kept.

## Preflight

Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200

## Weighting note

Any source below 0.5 is labeled `(weak backing, clef weight < 0.5)` wherever it is cited. Load-bearing technical claims in every doc trace to the ground-source doc; web results supply external context, not authority over the internal record.
