# radius-diagnostics-implementation: knowledge corpus

A knowledge corpus on the radius diagnostics implementation for corpus placement: diagnostic-only isolation-radius profiles, transition intervals, and the verification approach for a frozen-frame wayfinder instrument. Minted from yubi-OS/yubiOS `refs/radius-diagnostics-implementation-2026-09-13.md`.

## Docs

| NN | doc | one-line scope |
|---|---|---|
| 01 | [01-radius-clearance-statistics.md](01-radius-clearance-statistics.md) | Nearest-neighbour clearances, the strict edge test d<r with tie handling, and the indicator count I(r). |
| 02 | [02-clipped-integral-normalization.md](02-clipped-integral-normalization.md) | The clipped integral S_R = sum min(R, c_i), its Ripley-K-shaped precedent, and why S_R/N stays visible. |
| 03 | [03-transition-interval-grid.md](03-transition-interval-grid.md) | The fixed 0.075-0.115 grid, maximal same-delta/same-sign intervals containing 0.095, right-endpoint cells, brackets and named witnesses. |
| 04 | [04-float64-boundary-hazards.md](04-float64-boundary-hazards.md) | Math.hypot chord distances, IEEE 754 ulp spacing, the midpoint rounding hazard, and why brackets-plus-witnesses replaces epsilon tolerances. |
| 05 | [05-diagnostic-only-scope.md](05-diagnostic-only-scope.md) | What the instrument refuses: no field, ranking, keep/delete rule or forecast claim; missing bounds fail closed; radius and grid overrides are rejected. |
| 06 | [06-lean-kernel-proof.md](06-lean-kernel-proof.md) | RadiusBounds.lean on core Lean 4.33.0, 18 declarations, the printed-axiom checker over radius-scope.json, and CI-gated proofs. |
| 07 | [07-api-surface-enrichment.md](07-api-surface-enrichment.md) | Additive radius fields, radius_comparison in the compare endpoint, read-time enrichment of legacy v0.2 records, and unchanged storage packing. |
| 08 | [08-ui-presentation-constraints.md](08-ui-presentation-constraints.md) | Presenting counts, fractions, areas, bracketed intervals and witnesses; explicit missing-profile states; escaped markup; no slider, no best radius. |
| 09 | [09-verification-suites.md](09-verification-suites.md) | The 76/76 radius suite, 43/43 preview suite, integer and graph nulls (one recorded as degenerate), byte-budget storage checks, browser suites, fresh-context review. |
| 10 | [10-historical-record-corrections.md](10-historical-record-corrections.md) | Dated GL errata, the completed round-three map76 record with census duplicates, merge and deployment receipts, and live preview verification. |

## Research summary

- Results collected: 178 (20 initial dig queries + 10 redo queries across 5 thin subtopics, top 6 kept per query, deduplicated by URL).
- Weight split (jev noul via clef on /api/decide): 73 results at weight >= 0.5 (authoritative backing), 105 results below 0.5 (weak backing; cited only where labeled).
- Jev requests: 37 total (1 preflight probe, 1 outline validation with 10 score questions, 24 initial weighting batches of 5, 12 redo weighting batches). Usage: 30,184 input tokens, 0 output tokens.
- Redo counts: 5 subtopics redug once each (clipped-integral-normalization, float64-boundary-hazards, api-surface-enrichment, ui-presentation-constraints, verification-suites); each redo used different queries, logged in digs/.
- Skipped docs: none. All 10 subtopics survived outline validation (scores 0.63 to 1.91, none scored 0) and every dig came back strong enough to author honestly.

## Coverage notes

- The verification-suites golden-master subtopic's redo dig returned mostly sub-0.5 sources; those are cited with weak-backing labels rather than presented as authoritative.
- Project-record facts (operative radius 0.095, suite counts, CI runs, live receipts) come from the source record and its merged PR https://github.com/yubi-OS/yubiOS/pull/233 and are labeled as project record in each doc.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.
