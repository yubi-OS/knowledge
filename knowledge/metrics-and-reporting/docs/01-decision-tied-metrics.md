# Decision-tied metrics versus vanity reporting

**Scope:** Metric-to-decision mapping: choosing metrics that each drive a concrete decision instead of vanity reporting in early-stage open-source projects.

## The discipline

A metric earns its place on a report only if someone can name the decision it changes. Investopedia frames metrics as tools for tracking performance, comparing outputs, and forming strategy (https://www.investopedia.com/terms/m/metrics.asp, weight 0.83, authoritative), which is a permissive framing: it licenses measuring almost anything. The stricter discipline, and the one that matters at early-stage scale, separates metrics that inform an actual decision from metrics that merely grow predictably, look impressive in a report, or come pre-built in a vendor dashboard (https://candidcreative.ca/kb/decision-linked-vs-vanity-metrics, weight 0.21, weak backing). That separation is usually called the vanity-versus-actionable split.

Tableau's overview defines it directly: vanity metrics are exciting to point to but often are not actionable, while actionable metrics are data that helps you make decisions and reach goals (https://www.tableau.com/learn/articles/vanity-metrics, weight 0.73, authoritative). The test is not whether a number is interesting; it is whether a changed number would change an action.

## Why open-source projects drift toward vanity numbers

Open-source repositories make certain numbers frictionless, and frictionless is a bias. Star counts, fork counts, and download counters are one click away, so they end up in reports by default. A weakly-backed source on open-source vanity metrics argues exactly this: the measures repositories push are vanity metrics because a higher number looks good but is not necessarily right when you are deciding whether to depend on a project (https://www.linkedin.com/pulse/open-source-vanity-metrics-william-tracz, weight 0.31, weak backing). A community patterns collection makes the constructive version of the same point: recognizing which metrics are superficial lets an organization shift focus to actionable data that reflects real health and drives decisions (https://github.com/commons-os/patterns/blob/main/_patterns/vanity-metrics.md, weight 0.18, weak backing).

For an early-stage project with no telemetry and no analytics pipeline, the risk is inverted from the usual one. The project cannot measure reach or trust at all, so the honest report is built entirely from artifacts the repo already produces. That is a feature: every artifact-backed number comes with a decision attached, because the artifact exists to gate something.

## What a decision-tied table looks like

The reference pattern maps each metric to three things: the artifact it is read from, the decision it drives, and the trigger for acting on it. Concrete examples that fit a repo with blocker tracking, CI, and architecture records:

- Open blocker count, by identifier, read from the blocker document. Decision it drives: whether a production claim can be made. A blocker closing is the trigger to promote a claim from research or design to production.
- CI lane pass or fail per architecture, read from the workflow run status. Decision it drives: whether a release or publish job should run. A red lane blocks publish; it is not a dashboard color.
- Architecture decision record count and cadence. Decision it drives: whether decisions are being recorded at decision time. A long gap between real changes and new records is the trigger to audit for undocumented decisions.
- Dependency pin staleness in days since last bump. Decision it drives: whether a pin needs a bump pull request.

None of these numbers is impressive in a growth report. All of them change what happens next week. That asymmetry is the point: at early stage, a metric tied to a publish gate or a promotion gate does more work per digit than any reach statistic the project could fake.

## The honest failure mode

The decision-tied discipline has a failure mode worth naming: a metric kept on the report after its decision has stopped being live. If a blocker count no longer gates anything because promotion gates were replaced by a different mechanism, the count is now decoration, and decoration is how vanity metrics are born even from good intentions. The repair is the same as the selection rule: re-run the question "which decision does this change?" per metric, per cycle, and drop the ones with no answer.

## Selection rule, stated plainly

1. Name the decision first, then find the cheapest artifact that measures it.
2. Prefer artifacts that already exist (blocker tables, CI runs, decision records) over any new instrumentation.
3. Flag metrics with no current source as not-yet-measurable instead of inventing proxies.
4. Drop any metric whose decision is no longer live.

A weakly-backed practitioner piece on lean startup metrics makes the same argument from the commercial side: metrics exist to let founders make data-driven decisions and avoid wasting resources, not to fill a report (https://www.flyriver.com/g/lean-startup-metrics, weight 0.15, weak backing). For an early-stage open-source project the stakes are the same even when the product is free: attention is the scarce resource, and a vanity metric spends it.
