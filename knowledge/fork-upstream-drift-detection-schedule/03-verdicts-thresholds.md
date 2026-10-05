# 03 Verdicts and Thresholds: Classifying Fork Lag

Scope: the synced / minor-lag / drifted classification and choosing a commit-count threshold that balances noise against CVE risk.

## The three verdicts

The drift check classifies each fork into exactly one of three verdicts:

1. synced: the pinned SHA equals the upstream branch HEAD. No action, no alert.
2. minor-lag: upstream has moved, but the fork is behind by at most the threshold commits (the schedule's default is 10). Visible in the daily report, no issue filed.
3. drifted: the fork is behind by more than the threshold commits. The check files an issue and the on-miss playbook applies.

The value of a three-way split over a binary alarm is that minor-lag gives the report a middle band: lag that is real but not yet worth a human interruption. Alerting guidance is consistent on this: alerts people act on are the ones worth sending, and monitoring has to catch decay rather than noise (dsstream model monitoring, weight 0.49, weak backing).

## Why freshness is the underlying risk

The drifted verdict is a proxy for a specific risk: a stale pin. A study of pin freshness in Maven found that stale dependency pinning is common, and that fresh pinning is safer than stale pinning (arXiv 2510.22815, weight 0.77). Staleness is not cosmetic: the longer a fork sits behind, the larger the batch of upstream fixes it is missing, and the likelier one of them is a security fix the fork's consumers need. The verdict names quantify that intuition: synced is 0 missing commits, minor-lag is a bounded count, drifted is an unbounded count past the threshold.

## Threshold mechanics from alerting practice

Google Cloud Monitoring's alerting policies define exactly when a metric violates a threshold, with alignment periods and retest windows so that a transient spike does not page anyone (docs.cloud.google.com alerting policies, weight 0.90). Mapped onto fork drift: the metric is the behind count, the threshold is N commits, and the daily cron is the alignment window. One daily sample means the check is already maximally smoothed; a fork that crosses the threshold today has been crossing it for at least a day.

Data drift guidance adds two refinements worth copying: threshold on effect size rather than raw signal, and require persistence, meaning drift must last some number of days before it pages a human (ainomam data drift detection, weight 0.34, weak backing). For forks, the effect-size analogue is the behind count rather than "upstream moved at all", and the persistence analogue is automatic at a daily cadence: a fork drifting for 3 consecutive runs is a stronger signal than a fork that touched the threshold once.

## Choosing N

No external source fixes the number. The schedule's own design sets the default at 10 commits with a plan to re-evaluate after 30 days of baseline data (source schedule spec, OMN-160). The threshold interacts with upstream velocity: 10 commits is a different amount of lag for u-boot, which can move hundreds of commits a week, than for ms-tpm-20-ref, which moves slowly. A threshold that ignores velocity flags the busy fork constantly and never flags the quiet one, which is exactly the alert fatigue alert-tuning literature warns about (feature drift monitoring, weight 0.63).

Practical tuning rules:

- If minor-lag dominates the report for weeks, the threshold is too tight for those upstreams; raise N or make it per-fork.
- If a fork sits at drifted for multiple consecutive runs with no issue activity, the threshold is too loose relative to the team's response capacity; lower N or fix the response loop.
- Keep the threshold in configuration, not code, because the Phase 2 tightening (10 to 5 commits after baseline) is a config change, not a deploy.

## Verdict semantics are a contract

Whatever N is, the verdicts must stay stable in meaning across runs: synced means "equal", minor-lag means "within threshold", drifted means "past threshold, issue filed". Downstream automation (the issue filer, the report diffing) keys on the verdict strings, so renaming or reordering them is a breaking change to the report format, not a tuning knob.
