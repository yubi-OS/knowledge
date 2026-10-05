# admission-trials: knowledge corpus

Admission trials for non-admitted diagnostic statistics in a corpus-audit program: how a candidate statistic earns admission via matched nulls (curveball / column-permutation), margin traps, and the admission criteria.

Minted 2026-10-05 from yubi-OS/yubiOS `refs/admission-trials-2026-09-19.md`.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-trial-framework.md](01-trial-framework.md) | The admission trial framework: replacing hard-coded admitted:false flags with computed trials behind one unified endpoint, and what admission licenses. |
| 02 | [02-hardcoded-flags-inventory.md](02-hardcoded-flags-inventory.md) | The inventory of hard-coded admitted:false flags (axis-trial, spectra card, radius profile, rayleigh) and their decomposition: which parts became trials and which stay permanently not admitted. |
| 03 | [03-matched-nulls.md](03-matched-nulls.md) | Matched nulls: curveball and column-permutation null generation, the second independent null seed, non-degenerate nulls, and why the null must match the observed data structure. |
| 04 | [04-margin-traps.md](04-margin-traps.md) | Margin traps: fixed-margin nulls preserve row and column totals, so non-exclusion is not confirmation, and margin-matched random matrices can reproduce observed structure. |
| 05 | [05-reproducibility-criterion.md](05-reproducibility-criterion.md) | Reproducibility across independent seeds as the criterion that bites: verdict_reproducible_all, verdict flips under different null seeds, and why a seed-dependent verdict is not a reading. |
| 06 | [06-per-diagnostic-criteria.md](06-per-diagnostic-criteria.md) | Per-diagnostic admission criteria: the Rayleigh uniformity trial, the axis-redundancy trial, the spectra Parseval-share trial, and the radius I(r) count trial, including the n_at_least_100 floor. |
| 07 | [07-results-baselines.md](07-results-baselines.md) | The six stored baseline results (maps 436, 431, 78, 81, 326, 296): which diagnostics admitted where, the N threshold refusals, and the first frame where all four diagnostics admitted at once. |
| 08 | [08-scope-limits.md](08-scope-limits.md) | What admission does not claim: per-frame and per-statistic scope with no transfer, no ranking or edit decisions, no radius change, the K=40 resolution floor, and physical readings permanently excluded. |

## Research summary

- Results collected: 120 (96 from the 16 seed queries, 24 from 4 redo queries).
- Weight split: 57 results at weight >= 0.5 (authoritative backing), 63 results at weight < 0.5 (weak backing, labeled as such in the docs). 0 unweighted.
- Jev requests: 27 total (1 preflight probe, 1 outline validation with 8 score questions, 25 noul weighting batches of 5). Usage: 20910 input tokens, 0 output tokens.
- Redo counts: doc 02 (2 redos on queries, 1 redo round logged), doc 04 (1 redo), doc 06 (1 redo). Dig records carry the reasons.
- Skipped docs: none. All 8 subtopics authored; no doc required skipping, but doc 02's dig stayed thin after one redo and its weak-backed claims are labeled in text.

Preflight 2026-10-05: searXNG 191 results healthy; /api/decide (clef) 200.
