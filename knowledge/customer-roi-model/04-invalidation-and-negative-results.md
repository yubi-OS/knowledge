# 04. Invalidation rules and negative results

Scope: How a pilot ROI model handles worse-than-baseline outcomes: recording negative contributions instead of excluded outliers, and treating negative results as information.

## The invalidation rule

The yubiOS model's invalidation rule is explicit: if a pilot-measured value comes back worse than the customer baseline for any line item, for example enrollment took longer with yubiOS than the customer's prior process, it is recorded as a negative ROI contribution for that line item, not as an excluded outlier. The day-90 decision framework already expects some metrics may come in worse than projected (internal reference: yubi-OS/yubiOS refs/customer-roi-model-2026-07-25.md). The per-line-item structure from doc 01 is what makes this possible: because contributions are recorded item by item, a negative result has somewhere honest to live inside the formula instead of being averaged away or dropped.

## Why outlier exclusion is the failure mode to avoid

The strongest pressure on a vendor-side ROI model is to explain away bad lines. The discipline that prevents this is treating the negative contribution as data with the same evidentiary status as a positive one: same named source, same unit, same audit trail. A pilot study in the consumer-behavior literature frames customer dissatisfaction as a negative purchase experience with measurable structure rather than noise, supporting the practice of analyzing negative outcomes as observations in their own right (Scientific Papers of Silesian University of Technology, via ResearchGate, https://www.researchgate.net/publication/387951846_Customer_dissatisfaction_as_a_negative_purchase_experience_-_results_of_a_pilot_study, jev weight 0.64). Post-crisis organizational research similarly treats lessons-learned analysis of negative experience as the mechanism by which practice improves, not as a phase to move past (Taylor and Francis, Remote work and work-life balance: lessons learned from the COVID-19 pandemic, https://www.tandfonline.com/doi/full/10.1080/13678868.2022.2047380, jev weight 0.60).

## Negative feedback is instrument-grade information

Business commentary makes the same point operationally: negative customer feedback provides invaluable insight into missed opportunities and inefficient processes, and the appropriate response is structured analysis rather than dismissal (Forbes Business Council, 20 lessons learned from negative customer feedback, https://www.forbes.com/councils/forbesbusinesscouncil/2024/11/05/20-lessons-learned-from-negative-customer-feedback/, jev weight 0.38, weak backing). Applied to a pilot ROI readout, a line item that regressed should trigger two artifacts: the negative contribution itself, and a diagnostic explaining the mechanism, because a negative number without a mechanism is unverifiable in the next conversation.

## Base rates: most pilots disappoint somewhere

Widely circulated figures put enterprise AI pilot failure rates near 95 percent, with the most-cited source being the MIT NANDA report on generative AI adoption; the number circulates mostly through secondary aggregator posts and should be treated as weakly sourced (beSpacific summary of the MIT NANDA report, https://www.bespacific.com/mit-report-95-of-generative-ai-pilots-at-companies-are-failing/, jev weight 0.07, weak backing; NeuralWired restatement, https://neuralwired.com/2026/06/19/enterprise-ai-failure-rate-mit-roi-2026/, jev weight 0.05, weak backing). The weak sourcing is itself instructive for claim boundaries: a striking statistic loses provenance as it propagates through aggregators, which is exactly the mechanism the invalidation rule exists to counter at the pilot level. A vendor that records its own negative line items produces numbers that survive this kind of scrutiny; a vendor that only ever publishes wins trains buyers to distrust ROI claims generally.

## Decision behavior on negative results

A negative contribution should change the decision, not the narrative. Concretely: the day-90 readout presents the line item as negative with its mechanism; the model owner asks whether the pilot scope, the baseline cell, or the product explains it; and the claim boundary doc governs what may be said externally, which will usually be nothing until a second pilot measures the same line item. What it must not change is the arithmetic: no re-baselining, no unit switching, no moving the line item to an unmeasured bucket after the fact.
