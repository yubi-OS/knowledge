# 08. MVP scope and validation plan

Scope: The MVP scope the framing log commits to, the queues adapter choice, and the three assumptions the design marks for validation with live tests.

## The MVP scope

The framing log's MVP is deliberately small: the hourly cron machine-cycle, jev quality assessment (propose and verify scoring), the atom ledger, the candle planter, memory recall, and the digest email. Queues run through a thin adapter, D1-backed by default, switching to CF Queues if the queue exists at deploy. Console v3 views complete the scope (source: the framing log, refs/evolution-v2-solo-2026-10-01.md).

The not-doing list is part of the scope decision: no worker-side repo pushes, no Durable Objects (CAS on D1 suffices), no R2 (not enabled on the account; D1 and KV carry the state), no approval via email link (console approval is proven) (source: the framing log). Practitioner writing on minimum viable automation makes the same scope argument: automate the highest-value repeatable step first and expand after testing, rather than over-engineering up front (https://corp.tied-inc.com/blog/en/quality-gates-for-small-teams/, weight 0.11, weak). Quality gate practice in delivery pipelines treats gates as non-negotiable release artifacts between an experimental system and reliable production, which is the role jev plays in this loop (https://beefed.ai/en/automated-testing-gates-production-models, weight 0.19, weak; https://deepwiki.com/cogeet-io/ai-development-specifications/3.3-quality-gates-and-validation, weight 0.25, weak).

## Assumption 1: the worker can measure its own deltas

The first assumption to validate is that the worker can measure deltas for its own atoms, resting on the claim that jev task outcomes are queryable from D1. The validation test is concrete: run one live atom with a recorded delta (source: the framing log). This is a data-plane assumption: if D1 cannot answer for an atom's before and after states, the ledger's d_pre, d_post, delta entries cannot be filled and V7 collapses into an unmeasured changelog.

## Assumption 2: approval forecasting reduces queue noise

The second assumption is that approval-forecast pre-screening reduces queue noise without suppressing good proposals. The validation test is statistical: compare forecast versus actual approval correlation after at least 10 real approvals (source: the framing log). The framing log commits to a sample size, n >= 10, before drawing any conclusion.

The forecast evaluation literature supplies the method. Calibration means a model's estimated probabilities match real-world likelihoods; a weather model that predicts 70% chance of rain on days when it rains 70% of the time is calibrated (https://arxiv.org/html/2501.19047v1, weight 0.85, authoritative). Statistical learning treatment of forecast scoring separates sharpness from calibration and shows how to evaluate both (https://www.stat.berkeley.edu/~ryantibs/statlearn-s23/lectures/calibration.pdf, weight 0.86, authoritative). The accuracy-versus-calibration distinction for predictive systems, accuracy measures whether predictions are correct, calibration examines whether stated confidence tracks observed frequency, is the lens the log's forecast-versus-actual test applies to its own approval forecasts (https://harvardsciencereview.org/2026/09/14/ai-forecast-calibration-accuracy/, weight 0.61, authoritative). Visualizing forecasts against actuals is the standard first evaluation step, surfacing error patterns before any summary statistic is trusted (https://apxml.com/courses/time-series-analysis-forecasting/chapter-6-model-evaluation-selection/visualizing-forecast-performance, weight 0.37, weak).

## Assumption 3: recall changes propose behavior

The third assumption is that Vectorize recall changes what the loop proposes, specifically that it dedupes repeated proposals. The test: re-propose a known learning and expect a recall hit (source: the framing log). This makes the memory layer falsifiable as a behavior change, not just as infrastructure: if recall does not alter proposals, the memory layer is not earning its place in the loop.

## Open questions carried forward

Two questions are explicitly left open: which ideal-state metric anchors the atom ledger first, with jev task success rate as the default, and candle cadence, daily versus weekly, with weekly as the recorded starting point (source: the framing log). Both are marked as empirical decisions rather than design fiat, consistent with the loop's own honesty requirement: the design does not claim to know what it has not measured.
