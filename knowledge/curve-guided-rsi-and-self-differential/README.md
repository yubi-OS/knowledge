# knowledge/curve-guided-rsi-and-self-differential

A knowledge corpus on the differential curve as a cross-corpus audit tool: fitting one learned surface over the union of two corpora (yubiOS skills and self-docs) on a shared primitive basis, sparse-cell detection, Jaccard overlap as system coherence measurement, and skill land-grab detection. Minted 2026-10-05 from yubi-OS/yubiOS `refs/curve-guided-rsi-and-self-differential-2026-08-04.md`.

## Docs

| Doc | Scope |
|---|---|
| [01-union-basis-construction.md](01-union-basis-construction.md) | Building the shared 19-D primitive basis by concatenation with zero-padding; why mixing is forbidden; why 0 of 19 columns drop on the union. |
| [02-sparse-cell-detection.md](02-sparse-cell-detection.md) | The L-infinity-ball sparse-cell detector, the per-cell corpus-occupancy breakdown, true gaps versus corpus-specific artifacts, the 0/208 headline. |
| [03-jaccard-overlap-coherence.md](03-jaccard-overlap-coherence.md) | Binarized 21x21 (u,v) grid occupancy, the 0.0741 Jaccard reading, the 6 jointly-occupied alignment anchors, coherence as a tracked metric. |
| [04-curve-fit-quality-gates.md](04-curve-fit-quality-gates.md) | PC1+PC2 >= 0.40 and holdout R-squared > 0 gates, negative R-squared on small corpora, the degenerate 1-column fit. |
| [05-cross-corpus-rsi-cycles.md](05-cross-corpus-rsi-cycles.md) | RSI on the differential baseline: the three prioritization lanes, per-corpus baseline preservation, the staged-but-deferred Cycle 1. |
| [06-primitive-basis-design.md](06-primitive-basis-design.md) | The 10-D yubiOS and 9-D self-doc primitive taxonomies, coverage-fraction drop thresholds (0.90 vs 0.92), item granularity rules. |
| [07-skill-land-grab-detection.md](07-skill-land-grab-detection.md) | Reading corpus occupancy on the shared plane: the v-axis corpus signature, one-sided cells as expansion targets, drift watch. |
| [08-multi-corpus-audit-pipelines.md](08-multi-corpus-audit-pipelines.md) | The one-shot pipeline shape, JSON curve-cache persistence, the Stage 5 verification checklist, operational anti-patterns. |

## Research summary

- Results collected: 96 (16 searXNG queries, 2 per subtopic, top 6 kept per query; all 16 queries returned results, 0 redos needed).
- Weight split (jev noul, model clef): 35 high (>= 0.5) / 61 low (< 0.5) of 96. No result shipped unweighted.
- Jev requests: 21 total (1 outline score validation with 8 questions, 20 noul weighting batches of 5), usage 16569 input / 0 output tokens. Two 429s hit on first attempt and recovered per the redo protocol (30s sleep, resend).
- Redos: 0 dig redos, 2 jev request retries (429 recovery).
- Skipped docs: none. All 8 subtopics authored.
- Outline validation: all 8 subtopics scored between 1.38 and 1.68 on the 0/1/2 scale (0 = padding, 2 = load-bearing); none scored 0, all kept.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.

## Source doc

`refs/curve-guided-rsi-and-self-differential-2026-08-04.md` on yubi-OS/yubiOS (differential curve run: union basis 19-D, 208 items, PC1+PC2 0.6770, R-squared +0.7013, sparse 0/208, Jaccard 0.0741). Project-specific claims in the docs cite this source directly; general-method claims cite the weighted dig results with their jev weights in text.
