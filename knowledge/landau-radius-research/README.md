# landau-radius-research

Knowledge corpus minted from yubi-OS/yubiOS `refs/landau-radius-research-2026-09-13.md`: Landau damping, vortex glass physics, and radius diagnostics as mathematical instruments for corpus audits, what fits the wayfinder program, what was excluded, and the research-phase findings.

## Documents

| NN | doc | scope |
|---|---|---|
| 01 | [01-isolate-instrument.md](01-isolate-instrument.md) | The isolate count I(r) at canonical radius 0.095: definition, the maps 66 to 76 audit, and what prediction grading does and does not show. |
| 02 | [02-radius-sensitivity.md](02-radius-sensitivity.md) | The fixed predeclared radius grid 0.075 to 0.115, sign reversals across cycles, and why sensitivity is not physical glassiness. |
| 03 | [03-clearance-mathematics.md](03-clearance-mathematics.md) | Nearest-neighbour clearance c_i, antitonic step profile I(r), clipped integral S_R, exact breakpoints and per-edit stability intervals. |
| 04 | [04-perturbation-robustness.md](04-perturbation-robustness.md) | Bounded-coordinate robustness: edge stability under bounded displacement, the continued-isolation guarantee, and the robust-predicates literature. |
| 05 | [05-gl-correction.md](05-gl-correction.md) | The corrected Ginzburg-Landau mathematics: the b = c Lyapunov functional, the unequal-coefficient counterexample, and the 2/9 correction. |
| 06 | [06-vortex-glass-physics.md](06-vortex-glass-physics.md) | What vortex glass actually means per Brito, Aranson and Chate, the exciton transition story, and the transferable discipline. |
| 07 | [07-null-models.md](07-null-models.md) | Null-model discipline: degree-preserving null degeneracy for isolate counts, the bit-matrix fixed-frame null, and budget sensitivity of significance bands. |
| 08 | [08-audit-boundaries.md](08-audit-boundaries.md) | Locked exclusions, the preregistration logic behind them, the Lean verification obligations, and the five-step implementation path. |

## Research summary

- Results collected: 120 raw across 20 dig queries (16 original + 4 redo), 113 unique after URL dedupe, all weighted.
- Weight split: 49 results at weight >= 0.5 (authoritative), 64 results at weight < 0.5 (weakly backed, labeled as such in the docs). 0 unweighted.
- Jev requests: 27 logged (1 probe, 1 outline validation with 8 score questions, 25 noul weighting batches), usage 19694 input / 0 output tokens.
- Redos: 2 (doc 01 and doc 02 dig redos, one round each, different queries).
- Skipped docs: none. All 8 subtopics validated at score >= 1 and authored.
- Gaps: none.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.

## Research-db

Under `research-db/`: `preflight.json`, `outline.json`, `archive.json` (113 weighted result records with full noul decision records), `digs/` (8 per-doc dig records), `jev-log.json` (27 request records), `db.ts` (interfaces with file-to-interface map).
