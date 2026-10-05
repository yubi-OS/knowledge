# customer-roi-model-2

Knowledge corpus minted from yubi-OS/yubiOS refs/customer-roi-model-2026-07-26.md (the refreshed customer ROI model: fuller formula, validation checklist items, and claim boundaries building on the baseline ROI worksheet).

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | roi-formula-structure | Per-line-item ROI contribution formula, dollar conversion via the customer hourly rate, and subtraction of the pilot offer recurring cost. |
| 02 | baseline-data-collection | The five customer baseline cells and the rule that a missing baseline is a finding, not an error. |
| 03 | hardware-cost-sourcing-tiers | The three procurement tiers for hardware cost, their reference figures, and the tier declaration rule. |
| 04 | evidence-validation-rules | Named evidence source per formula input, the invalidation rule for worse-than-baseline results, and the n=1 disclosure rule. |
| 05 | measured-vs-illustrative-labeling | The measured and illustrative labels, the substantiation grounding, and why the model excludes a worked example. |
| 06 | claim-boundaries-external | The four external-use boundaries with regulatory and consent grounding. |
| 07 | pilot-aggregation-statistics | Why averaging ROI across pilots needs more n, grounded in the pilot-study literature. |
| 08 | model-dependency-integration | How the model positions against the OMN-84 worksheet, OMN-67 readout, OMN-77 financials, and OMN-80 benchmarks. |

All 8 outline subtopics were validated with the jev score metric and kept (no score 0).

## Research summary

- Results collected: 108 (16 first-pass queries across 8 subtopics, top 6 per query, plus a 2-query redo for doc 08).
- Weight split: 26 results at weight >= 0.5 (authoritative backing), 82 results below 0.5 (cited in docs only as weak backing, labeled as such in text).
- Jev requests: 25 total (1 preflight probe, 1 outline validation, 20 weighting batches, 3 redo weighting batches, plus redo retries on 429s that were re-sent after the mandated 30s sleeps). Usage: 18,857 input tokens, 0 output tokens as recorded per request.
- Redo counts: 1 (doc 08, model-dependency-integration; first-pass dig returned mostly off-topic results with max weight 0.42, redone with 2 different queries per the redo rule, no direct primary-source fetching).
- Skipped docs: none. Every kept subtopic was authored.
- Outline validation: all 8 subtopics scored load-bearing or marginal (0.97 to 1.93); none dropped.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

Note on preflight probes: the searXNG probe with forced engines returned 10 results for bing and 0 for google and duckduckgo on a single test query; production digs ran without engine forcing and returned 35 to 67 results per query.

## Research-db

Under `research-db/`: `preflight.json`, `outline.json`, `archive.json` (108 weighted result entries, every entry carries a non-null weight and a full noul decision record), `digs/<NN>-<slug>.json` (8 files), `jev-log.json` (25 entries), and `db.ts` (TypeScript interfaces).
