# Stop rules and runway in a structural model

**Scope:** Per-offer conversion kill thresholds, pricing redesign triggers, premature-scaling evidence, and runway exhaustion as the whole-model stop rule.

## Runway and burn: the arithmetic

Burn rate is the rate at which a company spends its cash, most often analyzed for early-stage startups; net burn rate is the difference between total monthly cash sales and total monthly cash expense (https://www.wallstreetprep.com/knowledge/burn-rate/, jev weight 0.66, authoritative backing). Practitioner calculators measure burn as the dollar decrease in cash over a month and derive estimated runway from it (https://kruzeconsulting.com/blog/cash-burn-rate/, jev weight 0.22, weak backing).

The structural consequence: runway in months equals available capital divided by net monthly burn. That formula is mechanical, but it cannot be evaluated until two assumption cells are filled: the capital envelope and the fixed-cost schedule. This is why "funding available" sits in the assumption taxonomy as its own category; the whole-model stop rule is unevaluable without it.

## Premature scaling: the empirical failure mode

The strongest empirical warning against spending ahead of evidence comes from the Startup Genome project, whose premature-scaling analysis draws on data from more than 3,200 high-growth technology startups and was coauthored by researchers from UC Berkeley and Stanford (https://startupgenome.com/report/why-startups-fail-premature-scaling/why-startups-fail-premature-scaling, jev weight 0.70, authoritative backing). The report classifies startups that scale prematurely as inconsistent and startups that scale properly as consistent (https://s3.amazonaws.com/startupcompass-public/StartupGenomeReport2_Why_Startups_Fail_v2.pdf, jev weight 0.57, authoritative backing).

The implication for a structural model is direct: costs that scale ahead of validated conversion are the definition of the failure mode, not merely an accounting choice. That is the argument for event-triggered costs (doc 04) and per-offer stop rules rather than calendar-driven spending.

## Stopping rules as a discipline

Experiment-design practice formalizes stopping rules: predefined criteria for when to stop an experiment, ramp criteria for how exposure grows, and metrics that trigger automatic rollback (https://www.statstest.com/experiment-guardrails-stopping-rules-ramp-criteria-risk, jev weight 0.42, weak backing). Translating that discipline to a venture model yields three tiers:

1. **Per-offer stop.** After a defined number of pilot conversations, if zero convert, the offer pauses. The threshold is a real number to be set when pilots actually run; asserting it now would be inventing data. What is structural today is that the threshold must exist per offer, not globally.
2. **Pricing redesign trigger.** If a specific offer's pricing hypothesis is invalidated by pilot data, the offer's price-shape assumption is redesigned. The offer catalog itself does not change, only one assumption cell.
3. **Whole-model stop (runway exhaustion).** If cumulative burn would exhaust available capital before any offer's readiness gate closes, the model stops. Note the dependency: this rule needs both the funding input and the gate calendar, which is why the assumption taxonomy flags funding as unrecorded.

## Segment-level redesign

If none of the target segments shows pilot interest after outreach, the signal points at segment selection itself rather than at pricing within a segment. This is the fourth and coarsest trigger: it reopens a choice upstream of the revenue lines, which means the model's per-segment conversion cells must exist for the trigger to even be observable.

## The unfilled-model rule

Because no revenue assumption should be treated as committed until it actually lands, the structural model treats every stop rule as evaluable only against observed data: conversion counts from pilots, signed contracts, landed funding. The stop-rule framework is complete as structure; its thresholds wait for the first real pilot cycle.
