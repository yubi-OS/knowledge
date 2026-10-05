# knowledge/days-61-90-willingness-to-pay

Testing willingness to pay in days 61-90 of an early-stage GTM plan: pricing experiments, commitments, and evidence standards before scaling. Minted from yubi-OS/yubiOS `refs/days-61-90-willingness-to-pay-2026-07-25.md` on 2026-10-05.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | [01-paid-pilot-design.md](01-paid-pilot-design.md) | The 25-50 node paid pilot on disposable systems as the WTP instrument; why unpaid pilots fail as WTP evidence. |
| 02 | [02-pricing-experiment-methods.md](02-pricing-experiment-methods.md) | Van Westendorp, Gabor-Granger, conjoint, and cohort price tests; stated versus revealed WTP evidence quality. |
| 03 | [03-commitment-evidence-ladder.md](03-commitment-evidence-ladder.md) | LOI, paid pilot, paid deployment, renewal: what each commitment rung proves and pre-negotiating the next rung. |
| 04 | [04-pilot-metrics-instrumentation.md](04-pilot-metrics-instrumentation.md) | Per-metric instruments (timestamp logs, boot logs, timed drills, support logs); source data versus estimates. |
| 05 | [05-pilot-economics-and-pricing.md](05-pilot-economics-and-pricing.md) | Setting the pilot price from the revenue and cost models; per-node structure; paid not free. |
| 06 | [06-roi-readout-evidence-standard.md](06-roi-readout-evidence-standard.md) | The confidential ROI readout: measured versus projected, honest reporting of misses, confidentiality boundary. |
| 07 | [07-day90-decision-framework.md](07-day90-decision-framework.md) | Proceed, narrow, change segment, pause: evidence thresholds and pre-registered kill criteria. |

## Research summary

- Results collected: 108 (84 from the primary dig across 14 queries, 24 from 2 redo digs across 4 queries)
- Weight split: 3 results at weight >= 0.5 (primary/authoritative backing), 105 at weight < 0.5 (weak backing, labeled in text)
- Jev requests: 22 (1 preflight probe, 1 outline score validation over 8 questions, 20 noul weighting batches of 5), usage 17387 input / 0 output tokens
- Redo counts: 2 (docs 04 and 06, one redo dig each with different queries)
- Skipped docs: none. One outline subtopic dropped at validation: case-study-permission-bounds (jev score 0, probabilities 0.61 drop / 0.31 marginal / 0.08 load-bearing)
- Caveat: external claims in this corpus are predominantly practitioner-blog sources weighted below 0.5 and are labeled as weakly backed in every doc; the load-bearing structural claims come from the internal yubiOS source doc.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
