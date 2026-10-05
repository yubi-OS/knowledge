# Evidence Validation Rules

Scope: the named-evidence-source rule per formula input, the invalidation rule for worse-than-baseline results, and the n=1 disclosure requirement.

## The named-source rule

Every formula input has a named evidence source in the OMN-84 worksheet: customer discovery interview for baseline cells, pilot SLA logs for incident response, pilot enrollment logs for onboarding time, pilot plus ADR and PINNED.md evidence for the audit burden line, and the SOW pricing line for the offer's recurring cost. The refreshed model adds one rule: a claim is valid only if its pilot-measured side comes from that named source, not from an assumption (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md). This converts the worksheet from a data-entry table into a chain of custody: any number in a readout can be traced to the artifact that produced it.

## Evidence must be decision-grade

External pilot-design guidance supports the same bar. A pilot program design guide argues that the difference between a hypothesis tied to KPIs and a vague goal is what separates pilots that produce funding decisions from pilots that produce slide decks (https://turn8.co/wp-content/uploads/2026/05/F2-How-to-Design-and-Execute-a-Pilot-Program-That-Generates-Investable-Evidence.pdf, jev weight 0.39, weak backing). A B2B pilot scorecard makes the pre-registration logic explicit: a pilot must generate credible evidence for a buying decision, and the decision must be defined before the pilot runs (https://interviewtip.net/b2b-saas-pilot-success-criteria-scorecard/, jev weight 0.06, weak backing). A B2B AI pilot design guide similarly centers metrics, evidence, and decision thresholds (https://bteanalytics.co/knowledge/how_should_a_b2b_company_design_an_ai_pilot_that_moves_beyond_the_, jev weight 0.49, weak backing). The named-source rule is the model's version of pre-registering where each number will come from.

## Measurement needs the baseline it compares against

Measurement guides reinforce that the pilot-measured side is only meaningful against a captured baseline: an AI pilot measurement guide stresses the baseline you need before you start and the small number of metrics that matter (https://elevate-ai.ai/insights/how-to-measure-ai-pilot-roi/, jev weight 0.21, weak backing), and the Red Brick pilot ROI guide lists baseline metrics, cost modeling, quality checks, and payback math as one workflow (https://www.redbricklabs.io/blog/how-to-measure-roi-from-an-ai-automation-pilot, jev weight 0.26, weak backing). In the model's terms: the named source for a pilot-measured value and the named source for its baseline cell are both required for the contribution to exist.

## The invalidation rule

If a pilot-measured value comes back worse than the customer baseline for any line item, for example enrollment took longer with yubiOS than the customer's prior process, the model records it as a negative ROI contribution for that line item. It is not excluded as an outlier (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md). The OMN-67 day-90 decision framework already expects that some metrics may come in worse than projected, so the model's arithmetic is built to absorb a negative rather than hide one. This rule is what makes the model falsifiable: a pilot that makes things worse produces a negative number by construction, which is a finding about the pilot scope or the customer's baseline, not a rounding problem.

## Pilot programs bridge theory and reality

The broader rationale for holding every claim to pilot evidence rather than model assumptions is the standard one: pilot programs serve as the bridge between theoretical models and real-world application (https://fastercapital.com/content/The-Role-of-Pilot-Programs-in-Startup-Model-Validation.html, jev weight 0.05, weak backing). A formula fed with assumed values is the theoretical model; the named-source rule forces the real-world side into the arithmetic.

## The n=1 disclosure rule

A single pilot with one customer produces one data point, not a statistically validated ROI, and the model requires that this be stated explicitly in every external claim (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md). The claim boundaries doc translates this into the four external-use boundaries, and the pilot aggregation statistics doc covers why averaging needs more n than any single pilot provides.
