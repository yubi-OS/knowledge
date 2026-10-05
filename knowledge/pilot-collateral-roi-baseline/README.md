# pilot-collateral-roi-baseline | knowledge corpus

Minted from `yubi-OS/yubiOS refs/pilot-collateral-roi-baseline-2026-07-25.md` (source of the topic: pilot collateral and ROI baselines for early-stage infrastructure sales, SOW, data-sheet, and worksheet templates that avoid asserting customer-specific numbers before evidence exists). One corpus per mint, decomposed by the domain's own joints.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-pilot-sow-template.md](01-pilot-sow-template.md) | Pilot SOW structure: scope partitioning, duration and scale as hypotheses, success criteria agreed jointly, readiness-gate dependency, telemetry disclosure. |
| 02 | [02-datasheet-support-boundaries.md](02-datasheet-support-boundaries.md) | Data sheets that publish what is NOT included: support boundaries as a first-class artifact, live-source known limitations, doctrinal exclusions, non-affiliation notice. |
| 03 | [03-roi-worksheet-design.md](03-roi-worksheet-design.md) | ROI worksheet design: customer-provided baseline column vs pilot-measured column, provenance column, and why vendors never fill the baseline column. |
| 04 | [04-readiness-gate-disclosure.md](04-readiness-gate-disclosure.md) | Readiness-gate disclosure: gate name, evidence definition, binary status with evidence, and the asymmetry between overstating and understating readiness. |
| 05 | [05-pricing-hypothesis.md](05-pricing-hypothesis.md) | Pricing as hypothesis: paid pilots as willingness-to-pay experiments, the three-part pricing line, pricing transition agreed before kickoff. |
| 06 | [06-assumption-validation.md](06-assumption-validation.md) | Assumption validation through customer discovery: assumption mapping on the importance-by-evidence grid, inlined assumption registers, falsification conditions. |
| 07 | [07-hardware-rot-cost-baselines.md](07-hardware-rot-cost-baselines.md) | Hardware root-of-trust cost baselines: security key pricing as the one pre-fillable range, incident-cost research as context only, five worksheet line items. |
| 08 | [08-pilot-success-metrics.md](08-pilot-success-metrics.md) | Pilot success metrics: control verification over sentiment, three metric families (enrollment, SLA response vs resolution, evidence production), logs as the pilot's output. |

## Research summary

- Results collected: 96 (16 searXNG queries, 2 per subtopic, top 6 per query kept)
- Weight split (jev noul via clef on /api/decide): 2 results at weight >= 0.5, 94 below 0.5 of 96 total. The thin weighting is recorded here, not averaged over: most docs therefore rely on weak backing and label it per claim.
- Jev requests: 24 total (1 preflight probe + 1 outline validation (8 score questions) + 22 noul weighting batches of 5; the first weighting run was discarded after a scoring-field bug made every weight 0, all 96 results were rescored). Usage: 25,452 input tokens, 0 output tokens.
- Redo counts: 1 redo pass over all results (decision-field parse bug, documented in the archive's redo_of convention usage notes); no query redos, all 16 queries returned 46-68 raw results each.
- Skipped docs: none. All 8 subtopics dug and authored.
- Gaps: 2 (recorded above).
- Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Database layout

`research-db/` holds: `preflight.json`, `outline.json`, `archive.json` (96 entries, every entry carrying a non-null weight and its full decision record), `digs/` (8 dig records), `jev-log.json` (24 entries), `db.ts` (TypeScript interfaces for all shapes).
