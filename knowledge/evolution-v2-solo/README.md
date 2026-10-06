# evolution-v2-solo knowledge corpus

Minted from yubi-OS/yubiOS `refs/evolution-v2-solo-2026-10-01.md`: the ideate-solo framing log for the evolution v2 build ("final evolution process"), covering 7 design variations, the V6+V7 fusion winner (standard-candle governance + single-action atom cadence), and the stress-test of the finalist.

## Docs

| NN | Doc | One-line scope |
|---|---|---|
| 01 | [01-ideate-solo-method.md](01-ideate-solo-method.md) | How ideate-solo generates and scores design variations without a human in the loop (lenses, P/S/D/T scoring). |
| 02 | [02-problem-statement-constraints.md](02-problem-statement-constraints.md) | The evolution v2 problem statement and its hard constraints: cron autonomy, jev quality gates, honesty, fixed blast radius. |
| 03 | [03-design-variations-lenses.md](03-design-variations-lenses.md) | The 7 variations V1 to V7, their ideation lenses, axis scores, and why V1 and V2 were dropped. |
| 04 | [04-atom-cadence.md](04-atom-cadence.md) | V7 single-action atom cadence: one gated action per hourly cycle, measured delta, stay option, monotone ledger. |
| 05 | [05-standard-candle-governance.md](05-standard-candle-governance.md) | V6 standard-candle governance: planted known-outcome candles, detection power in dBc, self-calibration. |
| 06 | [06-capability-map-fusion.md](06-capability-map-fusion.md) | The approved capability map the fusion inherits: cron, jev, Vectorize memory, durable execution, notify, Sauna sessions as hands. |
| 07 | [07-stress-test-finalist.md](07-stress-test-finalist.md) | The stress-test of the finalist: multi-step starvation, candle gaming and the sealed payload mitigation, the priced untestable bet. |
| 08 | [08-mvp-validation-plan.md](08-mvp-validation-plan.md) | MVP scope and the three assumptions to validate with live tests, plus the two open questions carried forward. |

## Research summary

- Results collected: 96 (searXNG, 8 subtopics x 2 queries each, top 6 per query kept)
- Weight split: 32 authoritative (noul >= 0.5) / 64 weak (noul < 0.5)
- Jev requests: 26 (1 preflight probe, 1 outline validation with 8 score questions, 24 weighting batches of 5 noul questions)
- Jev usage: 17595 input tokens, 0 output tokens
- Redos: 9 dig attempts across 8 subtopics. Subtopic 01 was redone twice (first run crashed on a missing digs/ directory after weighting; the second run's persisted files were lost to an ephemeral sandbox filesystem). Subtopics 02 to 08 were redone once each for the same filesystem loss. All redos re-ran identical queries.
- Skipped docs: none (all 8 digs came back strong enough to author honestly)
- Gaps: none

Preflight 2026-10-05: searXNG 134 probe results healthy; /api/decide (clef) 200

## Metric discipline

Every factual claim in the docs carries its source URL and the jev noul weight that backed it. Weights >= 0.5 are treated as authoritative backing; weights < 0.5 are labeled "weak" in the text. No claim was shipped without a source.
