# Gate dependency chains and calendar lead time

Scope: how non-engineering launch gates chain together, why calendar-bound gates dominate the critical path, and how target dates slip and re-target.

## Gates as a dependency chain

The three non-engineering gates chain in sequence. The pricing-validity gate starts with discovery interviews and produces a paid pilot. The reference-customer gate consumes the pilot: the reference relationship starts as the pilot deployment and continues into a 90-day production window. The security audit gate is parallel to both but depends on the engineering floor: the auditor must see a stable, signed, runnable artifact, so the audit kicks off only after the engineering gates are green. Launch-planning practice treats launches this way: a product launch timeline breaks the launch process into clear, sequential phases with specific deadlines (w=0.610, high backing) [https://www.atlassian.com/agile/product-management/product-launch-timeline], and release planning covers phases from planning and development through testing to post-launch evaluation (w=0.602, high backing) [https://www.atlassian.com/agile/product-management/product-release].

Dependency mapping formalizes the structure: a launch dependency map links owners, evidence, approval gates, critical paths, and rollback decisions in one reviewed plan (w=0.124, weak backing) [https://zerotwo.ai/blog/product-launch-dependency-map-ai]. Checklist tooling enforces the same ordering at execution time: a go/no-go gate blocks launches until critical steps are done, with evidence links and sign-offs attached (w=0.226, weak backing) [https://craftuplearn.com/tools/release-checklist-builder].

## Calendar-bound gates are the long lead

The decisive scheduling fact is that the reference gate's 90-day window is calendar time, not engineering time. No amount of staffing compresses it; only starting earlier does. Long-lead planning in other domains shows the mechanics: long-lead items are connected to the critical path through dependency tracking that links procurement, lookahead planning, and execution (w=0.318, weak backing) [https://www.outbuild.com/blog/long-lead-items-and-critical-path-dependency-tracking-guide], and when lead times extend, recovery options shrink as the target date approaches, with an issue flagged 90 days before production still mitigable through alternatives but later flags increasingly not (w=0.214, weak backing) [https://www.walkermanufacturing.com/how-manufacturing-lead-times-impact-product-launches/]. Timeline discipline requires pulling every dependency into a single visible timeline with automatic critical-path recalculation when one date moves (w=0.394, weak backing) [https://ones.com/blog/why-manufacturing-project-timelines-slip-and-how-to-fix-them/].

For a gate inventory this produces a mechanical sequencing rule: if the launch needs reference evidence, the pilot must start at least 90 days before the launch date, and the interview phase that feeds the pilot must complete before that. The pilot's own clean-run minimum (a 30-day window in common structures) adds its own floor between the contract and the reference window.

## Arithmetic of a slip

The chain makes slip arithmetic deterministic. Suppose the launch target is day 0 and the reference gate needs 90 days of pilot-production time ending at launch. The pilot must begin at day -90, interviews must finish before that, and the audit, which runs in parallel against a stable engineering baseline, must deliver its report within its freshness window of day 0. If the interview phase completes late, the pilot start slips, and the reference window pushes the launch date one-for-one. Because the reference gate is the longest chain, it determines whether a launch target is feasible at all: a target that predates pilot-start-plus-90-days is infeasible regardless of engineering state. Planners facing this either move the launch target out or launch without the reference gate, accepting the credibility cost. The honest inventory states which gates will and will not be closed at the chosen date.

## Engineering floor as prerequisite

The non-engineering gates also have a shared prerequisite: the engineering gates must be PASS first. The audit needs a stable artifact to examine; the pilot and reference need a formal release to deploy. This makes the engineering floor the entry condition for all three commercial gates, and it means engineering-gate slippage compounds into the calendar-bound chain: a late engineering floor delays audit kickoff, pilot start, and therefore the reference window.

## Re-targeting as the honest fix

When the arithmetic shows infeasibility, the fix is to re-target the launch, not to compress the human gates. A slip decision should be written into the gate inventory itself: the reference gate's target date is defined as a function of the pilot start date, so it moves automatically. Launch timelines exist precisely to make these trade-offs visible early: phases with deadlines, from concept to market (w=0.610, high backing) [https://www.atlassian.com/agile/product-management/product-launch-timeline]. A gate inventory that encodes its own dependency arithmetic turns a political argument about the launch date into a calculation.
