# 04 Rollout Thresholds

Scope: the advance, hold, and roll-back decision thresholds for each rollout stage, and the triggers that skip straight to rollback.

## The thresholds table

The source doc defines a 3-band decision table (green: advance, yellow: hold and investigate, red: roll back) over 4 metrics (source doc, Rollout Decision Thresholds):

| Metric | Advance | Hold | Roll back |
|---|---|---|---|
| Error rate | Within 10% of baseline | 10 to 100% above baseline | More than 2x baseline |
| P95 latency | Within 20% of baseline | 20 to 50% above baseline | More than 50% above baseline |
| Client JS errors | No new error types | New errors under 0.1% of sessions | New errors over 0.1% of sessions |
| Business metrics | Neutral or positive | Decline under 5% (may be noise) | Decline over 5% |

Three properties of this table are load-bearing. First, every red-band trigger is defined against a baseline measured before or during the rollout, so the baseline must actually exist as a dashboard query, not a memory. Second, the yellow band exists so that "worse but not catastrophic" gets investigation, not a shrug: hold is a real decision, not a delay on the way to advance. Third, the bands are asymmetric by metric: latency tolerates 20% relative movement while error rate tolerates 10%, and business metrics get a 5% noise allowance precisely because they are noisier than system metrics.

## Immediate roll-back triggers

Separately from the table, the source doc lists 5 conditions that trigger immediate rollback regardless of stage (source doc, When to Roll Back): error rate up by more than 2x baseline, P95 latency up by more than 50%, a spike in user-reported issues, detected data integrity issues, and a discovered security vulnerability. The first two duplicate the red band of the table; the last 3 are not in the table at all because they are not metric-threshold events. Data integrity and security issues bypass the gradual machinery entirely: the cost of a wrong rollback is minutes of reduced rollout, the cost of a wrong wait is corrupted data or an exposed vulnerability.

## How industry automates the comparison

The source doc's table is a human-decision aid. The automated canary analysis tradition implements exactly this comparison statistically. Google and Netflix's Kayenta, described in the Google Cloud announcement, fetches user-configured metrics from their sources, runs statistical tests, and produces an aggregate judgment about whether the canary is healthy (https://cloud.google.com/blog/products/gcp/introducing-kayenta-an-open-automated-canary-analysis-tool-from-google-and-netflix, jev 0.72). The Netflix Tech Blog write-up adds that the output of the metric retrieval and judgment stages is archived, so new comparison algorithms can be re-run over previously collected canary data (https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69?trk=article-ssr-frontend-pulse_little-text-block, jev 0.70). Argo Rollouts provides the same class of canary analysis as a Kubernetes controller (https://developers.redhat.com/articles/2024/05/01/canary-deployment-strategy-argo-rollouts, jev 0.71).

Drift note (2026-10-08): where the source doc compares a canary against a remembered baseline, the automated-canary tradition compares against a control population and uses statistical tests rather than fixed relative bands. That is an evolution of the same idea, not a contradiction: the source doc's green/yellow/red bands remain a valid manual protocol, and automated systems still need per-metric thresholds configured, which is what the source doc's table supplies.

## Hysteresis and flapping

Weak-backing context: an engineering blog on canary analysis at scale argues that threshold-based canary decisions flap when a metric oscillates around the boundary, and proposes statistical hysteresis so a borderline canary does not ping-pong between advance and hold (https://www.kbytechnologies.com/devops-automation/mitigating-canary-analysis-flapping-at-scale, jev 0.25, weak backing). This is consistent with the source doc's design in one specific way: the source doc's yellow band is itself a form of hysteresis, a buffer between "advance" and "roll back" that absorbs noise. Operators applying the table should keep the hold decision sticky: once held, a canary advances only on evidence, not on the metric drifting back under the line.
