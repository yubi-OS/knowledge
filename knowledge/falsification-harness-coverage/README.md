# Falsification harness coverage: endpoints that can use one effectively

This corpus maps the steady-orbit worker endpoint surface onto falsification-harness coverage: which endpoints already carry a known-answer harness (Tier 1), which deserve one and what it would look like (Tier 2), which are better served by contract tests (Tier 3), and the order to build them in. It is minted from the 2026-10-06 coverage record that accompanies the Harness column in docs/ENDPOINTS.md, scoped to the 51-part worker bundle.

**Ground source:** `yubi-OS/yubiOS refs/falsification-harness-coverage-2026-10-06.md`

## Documents

| NN | File | Scope | Clef outline score |
|---|---|---|---|
| 01 | [01-tier-1-already-harness-backed-the-pattern-setter.md](01-tier-1-already-harness-backed-the-pattern-setter.md) | Tier 1 - already harness-backed (the pattern-setters): detailed analysis grounded in yubi-OS/yubiOS refs/falsification-harness-coverage-2026-10-06.md. | 1.7766 |
| 02 | [02-tier-2-high-value-candidates-with-a-concrete-fal.md](02-tier-2-high-value-candidates-with-a-concrete-fal.md) | Tier 2 - high-value candidates with a concrete falsification design: detailed analysis grounded in yubi-OS/yubiOS refs/falsification-harness-coverage-2026-10-06.md. | 1.8484 |
| 03 | [03-tier-3-poor-fit-for-falsification-contract-tests.md](03-tier-3-poor-fit-for-falsification-contract-tests.md) | Tier 3 - poor fit for falsification (contract tests, not corpora): detailed analysis grounded in yubi-OS/yubiOS refs/falsification-harness-coverage-2026-10-06.md. Internal-record subtopic, no dig. | 1.1319 |
| 04 | [04-build-order-recommendation.md](04-build-order-recommendation.md) | Build-order recommendation: detailed analysis grounded in yubi-OS/yubiOS refs/falsification-harness-coverage-2026-10-06.md. Internal-record subtopic, no dig. | 1.0320 |
| 05 | [05-failure-modes-and-scope-boundaries.md](05-failure-modes-and-scope-boundaries.md) | Documented failure modes, negative results, and explicit non-claims. Internal-record subtopic, no dig. | 1.1356 |
| 06 | [06-integration-and-operational-governance.md](06-integration-and-operational-governance.md) | Integration with yubiOS and Steady Orbit /jev/ endpoints, policy versioning, and audit trail. Internal-record subtopic, no dig. | 1.0251 |

Docs 01 and 02 are dig-backed (searXNG + Clef weighting). Docs 03 to 06 are internal-record subtopics grounded only in the ground-source document, with no external web dig.

## Research summary

- Results collected: 20 results collected (10 per dig-backed doc, 2 digs).
- Clef source-quality split: high >= 0.5: 1; low < 0.5: 19.
- Decision-model traffic: 5 jev requests (1 outline score request + 4 noul weighting batches).
- Redos: 0 redos.
- Skips: 0 skips.
- Weak-backing rule: every source under 0.5 is labeled `(weak backing, clef weight < 0.5)` wherever it is cited; load-bearing technical claims rest on the ground-source document.

## Preflight

Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200
