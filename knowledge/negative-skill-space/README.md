# negative-skill-space

A knowledge corpus on the negative skill space concept: 12-axis gap mapping of skills and documents (audience, inputs, outputs, mode, assumptions, adjacent problems, failure modes, lifecycle, composition, knowledge sources, calibration, recursion) as a systematic gap-finder.

Minted 2026-10-05 from yubi-OS/yubiOS refs/negative-skill-space-2026-07-28.md.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [concept-and-unknowns](01-concept-and-unknowns.md) | Positive vs negative space of an artifact, the Rumsfeld taxonomy applied to skills, moving unknown-unknowns into known-unknowns. |
| 02 | [axes-outward-sweep](02-axes-outward-sweep.md) | Axes 1 to 6: audience, inputs, outputs, mode, assumption set, adjacent problems. |
| 03 | [axes-process-sweep](03-axes-process-sweep.md) | Axes 7 to 12: failure modes, lifecycle, composition, knowledge sources, calibration, recursion. |
| 04 | [gap-triage](04-gap-triage.md) | Likelihood x severity scoring, performative vs real filtering, extend/pair/accept dispositions. |
| 05 | [recursive-application](05-recursive-application.md) | Self-application, meta-blind spots, strange loops, bounded loops and stop rules. |
| 06 | [gap-mapping-failure-modes](06-gap-mapping-failure-modes.md) | Gap theater, analysis paralysis, false gaps, same-blind-spot risk and mitigations. |
| 07 | [lifecycle-and-drift](07-lifecycle-and-drift.md) | Gap-map staleness, drift vectors, re-mapping cadence, gap registers and versioning. |
| 08 | [adjacent-disciplines](08-adjacent-disciplines.md) | FMEA, pre-mortems, red teaming, design by contract, risk matrices, and the differences. |

## Research summary

- Results collected: 96 (searXNG, 16 queries across 8 subtopics, top 6 per query)
- Weight split (jev noul, clef): 24 high (>= 0.5) / 72 low (< 0.5), 0 unweighted
- jev requests: 42 (31740 input tokens / 0 output tokens)
- Redos: 1 weighting redo pass. The initial 20-request noul pass recorded null scores because the /api/decide noul response carries its value under a `noul` key rather than `score`; all 96 results were rescored in a second pass and every entry now carries a non-null weight (archive entries carry `redo_of` pointing at their own index to mark the rescore). No dig redos were needed; all 16 queries returned usable results on the first attempt.
- Skipped docs: none. All 8 outline subtopics scored load-bearing (validation scores 0.97 to 1.90 on the 0/1/2 score metric) and all 8 were authored.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## research-db

- `preflight.json`: endpoint probes for searXNG and /api/decide
- `outline.json`: topic, 8 subtopics, jev score validation with per-question probabilities
- `archive.json`: all 96 collected results with snippet, weight, and the full jev decision record
- `digs/NN-slug.json`: per-subtopic dig records (queries attempted, results kept, outcome)
- `jev-log.json`: one entry per jev HTTP request with usage tokens
- `db.ts`: TypeScript interfaces for all of the above
