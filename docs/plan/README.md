# docs/plan - yubiOS planning document knowledge corpus

Explicates the yubiOS planning document: [yubi-OS/yubiOS docs/PLAN.md](https://github.com/yubi-OS/yubiOS/blob/main/docs/PLAN.md) (33,672 B, fetched 2026-10-06). The source doc is the primary source of record; this corpus deepens it section by section. 9 docs kept, 1 dropped at outline validation, 0 skipped.

## Corpus index

| NN | doc | scope |
|---|---|---|
| 01 | [01-services-to-subscription-model.md](01-services-to-subscription-model.md) | The executive decision: public-first cybersecurity project, capital-light company selling accountable operations, five-point services-to-subscription plan. |
| 02 | [02-evidence-boundary.md](02-evidence-boundary.md) | What exists vs what does not yet exist as verified business evidence; GitHub activity is not market evidence; off-limits claims. |
| 03 | [03-customers-and-value-prop.md](03-customers-and-value-prop.md) | Four enterprise segments with fleet sizes and economic buyers; enterprise overlay vs canonical demand-side list; capability vs accountability value proposition. |
| 04 | [04-public-interest-covenant.md](04-public-interest-covenant.md) | What remains public, what customers may buy, stewardship rules, public-interest budget, transparency report. |
| 05 | [05-pricing-architecture.md](05-pricing-architecture.md) | Seven offers, launch prices and gates, revenue priority, no per-device royalty on the OS. |
| 06 | [06-readiness-gates.md](06-readiness-gates.md) | Gates 0 through 3 required evidence and allowed activities; proof-first sales motion. |
| 07 | [07-revenue-cost-model.md](07-revenue-cost-model.md) | Assumptions, base case (illustrative scaffolding, not validated forecasts), sensitivity, stop rules, unit-economic goals, runway. |
| 08 | [08-team-governance-legal.md](08-team-governance-legal.md) | Year 1 budget split, hiring order, entity options, legal review list, EU CRA roles and dates. |
| 09 | [09-execution-and-decisions.md](09-execution-and-decisions.md) | First 90 days, metrics and reporting discipline, adopt/defer/reject lists, closing commercial test. |

## Research summary

- Results collected: 72 (48 across 8 initial queries + 24 across 4 redo queries for subtopics 01 and 03).
- Weight split (jev noul): 18 high (>= 0.5), 54 low (< 0.5).
- jev requests: 6 (1 outline score validation with 10 questions, 4 noul weighting batches of 12, 1 noul redo batch of 24). Usage: 7,976 input tokens, 1,566 output tokens.
- Redos: 2 (subtopic 01 and subtopic 03; attempt 1 digs returned mostly off-topic results).
- Skipped docs: none. Subtopic 8 (customer ROI model) was dropped at outline validation: score 0.5 with plurality probability 0.63 on drop. Five subtopics (02, 04, 06, 07, 09) are internal-record subtopics and were deliberately not dug; the reason is recorded in each dig file.
- Outline validation verdicts: t01 1.2, t02 0.97, t03 0.72, t04 0.91, t05 1.02, t06 0.9, t07 1.64, t08 0.5 (dropped), t09 1.34, t10 1.71.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide via DefAPI direct (typesafe/jev-1.13) 200, agent-side probe skipped per campaign speed protocol.

## research-db

`research-db/` holds preflight.json, outline.json, archive.json (72 weighted entries), digs/ (9 dig records), jev-log.json (6 requests), and db.ts (schema v2 interfaces).
