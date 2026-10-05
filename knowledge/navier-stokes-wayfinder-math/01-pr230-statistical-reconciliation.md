# PR 230 statistical reconciliation

Scope: what the merged wayfinding PR actually establishes when verified from pinned sources: the exact isolation-delta table, the two-way split of the six zero outcomes, the always-zero baseline problem, and the honesty limits of interval claims on adaptive trials.

## What was verified, from where

PR 230 is merged in yubi-OS/yubiOS. The research record pinned the main commit `67274066531ae5288bfc640a2030e5a20508b57e` and the PR head `2bc6331c2ea36f57ecdcfdfe7f40179966cbfbbf` (https://github.com/yubi-OS/yubiOS/pull/230, internal research record). All 11 live map snapshots 51 through 61 were retrieved from the map API on September 10, 2026 (https://steady-orbit.systems-a.workers.dev/api/maps/51 through https://steady-orbit.systems-a.workers.dev/api/maps/61, internal research record). Frame `f90cf5ba805322a5` is unchanged across all 11 snapshots, which is what makes the ten recorded transitions replayable as one fixed-geometry experiment.

The isolation series across the trail is `43,41,41,39,38,38,38,38,37,37,37`. Independent replay confirmed the recorded table: 4 sign matches and 2 exact magnitude matches between predicted and observed isolation deltas. The results doc at the inspected commit (https://github.com/yubi-OS/yubiOS/blob/67274066531ae5288bfc640a2030e5a20508b57e/refs/wayfinder-loop-results-2026-09-09.md, internal research record) contains no statistical uncertainty intervals, so the phrase "within margins" currently means exact equality of small integers, not coverage by a documented confidence interval.

## The refinement that changes the fix

The six zero outcomes are not one phenomenon. Three are CHANGE operations where no common point or bit row moved (quantization silence), and three are ADD operations whose new points connected only to already-connected points. A new document can be fully represented and still leave the isolated count unchanged. Treating all six as the same embedding or threshold failure would send the fix to the wrong layer. This distinction is internal to the record but it is checkable against the replayed snapshots listed above.

## Endpoint heterogeneity

The record mixes endpoints that are not interchangeable: edit survival (round 2: 10 of 10 locally retained edits), sign agreement (round 2: 4 of 10), exact magnitude agreement, and semantic quality. Round 1 reports 2 surviving edit operations out of 8 attempts over 10 map runs including baseline and confirmation runs. Independent task grading is explicitly untested. Multiple files per edit also make artifact counts differ from operation counts. Any single-number summary of "how well did the rung do" collapses these distinct endpoints and should not be trusted.

## The always-zero baseline

An always-zero baseline (predict no isolation change, every time) exactly matches 6 of the 10 recorded outcomes, versus 2 of 10 exact matches for the recorded rung predictions. The baseline cannot predict the useful negative changes, but a fair comparison must include it. This mirrors the standard machine-learning practice that a majority-class baseline must be reported next to any classifier claim; the applied-ML teaching material makes this the first check before any model claim is interpreted (https://ufdatastudio.com/datasciencethenovel/6-Modelling/References/4-ModelEngineering.html, weight 0.56), and the evaluation-principles literature likewise treats naive baselines as mandatory comparators (https://arxiv.org/html/2604.13882v1, weight 0.52). Weaker-agreement sources say the same with less rigor (https://www.geeksforgeeks.org/machine-learning/how-to-handle-imbalanced-classes-in-machine-learning/, weak, weight 0.28).

Successive adaptive edits on one corpus are not independent trials, so an interval computed as if they were is decorative. An illustrative iid Wilson interval for 4 of 10 is roughly [0.168, 0.687] (Wilson score interval worked examples, https://statisticsfundamentals.com/confidence-intervals/wilson-score-interval-worked-examples/, weight 0.58; binomial proportion confidence interval background, https://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval, weak, weight 0.41). Its nominal coverage is not justified for this adaptive experiment, and it does not establish a significant round-to-round improvement.

## What this doc carries forward

1. Verify before extending: the whole reconciliation was done against pinned commits and live snapshots, not against the PR description.
2. Split the zero outcomes before diagnosing them.
3. Report the always-zero baseline in every comparison.
4. Never present an iid interval as evidence about an adaptive sequence.

## Sources considered

| source | weight |
|---|---|
| https://github.com/yubi-OS/yubiOS/pull/230 (internal research record) | record |
| https://steady-orbit.systems-a.workers.dev/api/maps/51 .. /61 (internal research record) | record |
| https://ufdatastudio.com/datasciencethenovel/6-Modelling/References/4-ModelEngineering.html | 0.56 |
| https://statisticsfundamentals.com/confidence-intervals/wilson-score-interval-worked-examples/ | 0.58 |
| https://arxiv.org/html/2604.13882v1 | 0.52 |
| https://enter77.ius.edu/cjkimmer/zero-rule-and-baseline-classifier-accuracy/ | 0.46 |
| https://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval | 0.41 (weak) |
| https://www.medium.com/@preethi_prakash/understanding-baseline-models-in-machine-learning | 0.29 (weak) |
| https://www.geeksforgeeks.org/machine-learning/how-to-handle-imbalanced-classes-in-machine-learning/ | 0.28 (weak) |
| https://statisticsfundamentals.com/calculators/wilson-score/ | 0.46 |
| https://www.statskingdom.com/proportion-confidence-interval-calculator.html | 0.24 (weak) |
| https://calculatorlib.com/binomial-confidence-interval-calculator | 0.06 (weak) |
