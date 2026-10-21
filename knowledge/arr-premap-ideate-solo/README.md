# Arrangement response and hierarchy premap, two build lines [SOLO]

Knowledge corpus `arr-premap-ideate-solo`, minted in wave 22 of the `refs/` mint (Lane 5).

**Ground source:** `yubi-OS/yubiOS refs/arr-premap-ideate-solo-2026-10-16.md`

This corpus explicates the 2026-10-16 ideate-solo record that split the arrangement-response and hierarchy-premap work into two session-only build lines. Line A (arrangement-response-v1) asks what the Cloudflare oracle reads when only the droplet arrangement moves. Line B (premap-v1) asks whether the proven hierarchy detector can premap a missing hierarchy level. The record was produced with no dialogue (ideate-solo), generated 7 variations across five lenses, scored them on four 1 to 5 axes, stress-tested two finalists (V2 and V3), and converged on V1 plus V2 for Line A and V3 for Line B, with V5 held as a Phase 2 hook. Nothing in the record deploys, writes KV or D1, or changes policy.

## Documents

| NN | File | Scope | Clef outline score |
|---|---|---|---|
| 01 | `01-problem-statement.md` | Problem statement (dig-backed) | 1.4691 |
| 02 | `02-variations-five-lenses-one-lens-per-variation.md` | Variations (five lenses, one lens per variation) (dig-backed) | 1.5825 |
| 03 | `03-scores-painkiller-switching-defensibility-testab.md` | Scores (painkiller / switching / defensibility / testability, 1 to 5 each) (internal record) | 0.8535 |
| 04 | `04-stress-test-of-the-finalists.md` | Stress test of the finalists (internal record) | 1.0541 |
| 05 | `05-converge.md` | Converge (internal record) | 1.2153 |
| 06 | `06-recommended-direction.md` | Recommended direction (internal record) | 1.5719 |

Outline scores come from `research-db/outline.json` (`validation.answers.t01..t06.score`), a clef `score` decision over three lowest-first levels (padding, marginal, load-bearing). No subtopic was dropped.

## Research summary

- Results collected: **20** (2 searXNG queries for doc 01, 2 for doc 02, 10 kept per doc)
- Clef quality weights: **3 high (>= 0.5)**, **17 low (< 0.5)**
- jev requests: **5**
- Redos: **0**
- Skips: **0**
- Docs 03 to 06 are internal-record subtopics: they explicate the ground source directly and carry no external web dig.
- Every dig citation in docs 01 and 02 carries its exact clef weight; any source under 0.5 is labelled weak backing. Load-bearing technical claims rest on the ground source, not on the dig.

## Conventions

- Docs are numbered in outline order (`01` to `06`); filenames match `meta.json` subtopic slugs exactly.
- Docs 01 and 02 end with a `## Sources Considered` table listing all 10 dig results and their clef weights.
- House style: no em dashes, numbers as digits, headings for wayfinding.

## Preflight

Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200
