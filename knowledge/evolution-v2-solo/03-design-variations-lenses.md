# 03. The 7 design variations and their lenses

Scope: The 7 variations the solo pass generated (V1 to V7), the ideation lens behind each, the axis scores that ranked them, and why V1 and V2 were dropped.

## The generation table

The framing log records all 7 variations with lens and axis scores (P, S, D, T, sigma) (source: the framing log, refs/evolution-v2-solo-2026-10-01.md):

| Variation | Lens | P | S | D | T | Sigma |
|---|---|---|---|---|---|---|
| V1 | Inverted control (worker executes repo pushes) | 3 | 1 | 3 | 3 | 10 |
| V2 | Fully autonomous loop with email-link approval | 4 | 2 | 4 | 2 | 12 |
| V3 | Reader-first digest (inbox-optimized) | 4 | 5 | 2 | 5 | 16 |
| V4 | Wayfinder memory (reuse point-map discipline) | 3 | 4 | 4 | 4 | 15 |
| V5 | Thin calibrated core (cron+jev+ledger+digest only) | 3 | 5 | 2 | 5 | 15 |
| V6 | Standard-candle governance | 5 | 4 | 5 | 4 | 18 |
| V7 | Single-action atom cadence | 5 | 4 | 4 | 5 | 18 |

## The lens set

Five lenses produced 7 variations: Inversion (V1), Constraint removal (V2), Audience shift (V3), Combination (V4, V6) and Simplification (V5, V7). These are recognizably from the structured creativity canon. SCAMPER, the most cited lens list, includes Combine and Eliminate/Simplify as first class transformations, and its guides stress that each operator is applied deliberately to a base concept rather than browsed opportunistically (https://www.imd.org/blog/innovation/scamper-method-design-thinking/, weight 0.45, weak; https://www.bitesizelearning.co.uk/resources/scamper-model-creativity, weight 0.30, weak; https://mockflow.com/blog/scamper-technique, weight 0.23, weak; https://www.si-labs.com/en/articles/scamper/, weight 0.22, weak). The framing log's lens names are its own, but the operator shapes match: inversion is the classic Reverse, constraint removal is an Eliminate applied to a requirement, audience shift is a Put-to-another-use applied to the consumer. The example-catalog treatments of SCAMPER describe the same seven-approach structure for altering a current product or process (https://www.designorate.com/scamper-technique-examples-and-applications/, weight 0.25, weak; https://www.6sigma.us/lean-tools/scamper-technique/, weight 0.39, weak).

## Scoring and the two drops

The sigma range, 10 to 18, is tight at the top: the top 3 finalists (V6, V7 at 18; V3 at 16) sit within 2 points of each other, and the two dropped variations sit 6 and 8 points below the leaders. But the framing log does not drop V1 and V2 on sigma alone. It records explicit reasons:

- V1 dropped for switching cost 1: it moves execution of repo pushes across the autonomy boundary the operator explicitly reserved (source: the framing log).
- V2 dropped as an un-testable bet: email-link security could not be validated cheaply before commit (source: the framing log).

This two-stage selection, numeric screen then constraint screen, matches the argument in the idea evaluation literature that single-number scoring misses structural reasons to reject, and that evaluation is where breakthrough ideas get wrongly dismissed or flawed ideas advance (https://www.sciencedirect.com/science/article/pii/S0166497226000982, weight 0.78, authoritative). Practitioner evaluation methods use the same two layer shape, score then filter on feasibility and risk, though vendor writeups carry weak weight (https://ideawake.com/idea-evaluation-process-and-criteria/, weight 0.18, weak; https://www.lusidea.com/articles/idea-evaluation-methods-for-practical-selection-and-prioritization, weight 0.14, weak; https://qmarkets.net/resources/article/idea-evaluation-process/, weight 0.10, weak).

## What the score spread reveals

Three patterns in the table are worth noting. First, the two finalists share axis profiles: both score 5 on P and 4 on S, meaning the pass rewarded problem fit and specificity over polish. Second, V3, the reader-first digest, survives as a finalist despite the lowest P among the top group (4), because it maximizes T (5): testability. Third, the two lowest scorers are also the two dropped, and both drop reasons are constraint violations rather than score outcomes, confirming that in this method the score is a ranking device and the constraint screen is the veto.
