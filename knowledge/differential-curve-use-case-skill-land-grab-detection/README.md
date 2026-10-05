# Skill Land-Grab Detection via the Differential Curve

Knowledge corpus minted from the yubiOS refs doc `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`. The corpus documents the differential curve use case that finds yubiOS skills with no self-doc counterpart and drives documentation coverage: how the cross-corpus fit works, the isolation taxonomy, radius tradeoffs, the ideation scoring that selected the use case, the dispatch loop, the MVP verification gates, fit-artifact validation, the Jaccard tracking metric, and the bidirectional gap-fill design.

## Documents

| NN | Doc | Scope |
|---|---|---|
| 01 | [differential-curve-mechanics.md](01-differential-curve-mechanics.md) | How the cross-corpus differential curve is fit: the 9-D primitive basis, union corpus construction, projection to a 2-D (u,v) plane, and cell occupancy counting. |
| 02 | [isolation-taxonomy-skill-selfdoc-joint.md](02-isolation-taxonomy-skill-selfdoc-joint.md) | The three occupancy buckets: skill-only cells, selfdoc-only cells, and jointly-occupied anchor cells, and what structural silence in each direction means. |
| 03 | [sparse-cell-radius-tradeoffs.md](03-sparse-cell-radius-tradeoffs.md) | Sparse-cell detection thresholds: the r=0.05 precision choice, zero jointly-occupied cells, and the r relaxation tradeoff between anchors and precision. |
| 04 | [use-case-ideation-scoring.md](04-use-case-ideation-scoring.md) | How the land-grab use case was selected: ideate-solo variation generation V1 to V6, the 20-point scoring rubric across defensibility and testability, and why the combination variant won. |
| 05 | [land-grab-dispatch-loop.md](05-land-grab-dispatch-loop.md) | The dispatch loop that converts each skill-only cell into a self-archaeology task returning a candidate SELF-CHANGELOG entry or memory-file section. |
| 06 | [mvp-verification-gates.md](06-mvp-verification-gates.md) | The MVP application to the top-5 skill-only cells: structural-uniqueness entries, the verification checklist, and the 30 percent gap-list shrinkage bet. |
| 07 | [gap-versus-fit-artifact-validation.md](07-gap-versus-fit-artifact-validation.md) | The fit-artifact hazard: whether isolated cells are real gaps or artifacts of the 19-D union basis, and fresh-context adversarial validation by independent subagents. |
| 08 | [alignment-metrics-jaccard-growth.md](08-alignment-metrics-jaccard-growth.md) | Quantifying cross-corpus alignment over RSI cycles: the Jaccard overlap metric, its 0.074 baseline, and the 0.20 growth target as the tracking signal. |
| 09 | [bidirectional-gap-fill-design.md](09-bidirectional-gap-fill-design.md) | The bidirectional design: skill-only cells drive documentation dispatch while selfdoc-only cells drive skill acquisition (the V2 relationship), turning one-sided detection into a two-way fill loop. |

## Research summary

- Results collected: 108
- Weight split: 25 at weight >= 0.5 (primary), 83 below 0.5 (weak backing, labeled in text)
- Jev requests: 23 (1 outline validation + 22 noul weighting batches), usage 18502 input / 0 output tokens
- Dig redos: 0 (every subtopic dig returned 12 kept results on the first attempt; 2 transient 429 responses from /api/decide were retried after 30s backoff per the redo rule)
- Skipped docs: none

Per-doc source quality:

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01-differential-curve-mechanics | 12 | 4 |
| 02-isolation-taxonomy-skill-selfdoc-joint | 12 | 1 |
| 03-sparse-cell-radius-tradeoffs | 12 | 4 |
| 04-use-case-ideation-scoring | 12 | 2 |
| 05-land-grab-dispatch-loop | 12 | 4 |
| 06-mvp-verification-gates | 12 | 2 |
| 07-gap-versus-fit-artifact-validation | 12 | 4 |
| 08-alignment-metrics-jaccard-growth | 12 | 4 |
| 09-bidirectional-gap-fill-design | 12 | 0 |

Outline validation (clef, score metric): all 9 subtopics scored above 0; scores t01=1.86, t02=0.74, t03=1.02, t04=0.48, t05=1.36, t06=0.95, t07=1.27, t08=1.23, t09=1.18. Subtopic 04 scored lowest (0.48, marginal band) and was kept because its dig returned a full result set with 2 primary sources.

Preflight 2026-10-05: searXNG 80 results healthy; /api/decide (clef) 200.
