# 03. Pilot evidence validation

Scope: Evidence discipline for validating ROI claims from pilots: named evidence sources, pilot logs, objective measurement, and the rule that claims are valid only when the measured side comes from the named source.

## Name the evidence source for every input

The yubiOS model assigns each formula input a named evidence source in the pilot worksheet: customer discovery interview, pilot SLA logs, pilot enrollment logs, pilot plus ADR and PINNED.md evidence, and the SOW pricing line. Its added rule is that a claim is valid only if the pilot-measured side comes from that named source, not from an assumption (internal reference: yubi-OS/yubiOS refs/customer-roi-model-2026-07-25.md). This is the operational core of evidence validation: an input is either traceable to a named instrument or it is not a claim.

Formal pilot evaluation guidance supports the same structure at the program level: monitoring and evaluation frameworks and related evaluation plans should be developed early and in parallel with pilot design, so the evidence to be collected is specified before the pilot runs (Australian Treasury, Guide to Evaluating Pilot Programs, https://evaluation.treasury.gov.au/sites/evaluation.treasury.gov.au/files/2025-07/guide-evaluating-pilot-programs.pdf, jev weight 0.85). The Treasury guide is written for policy pilots but the discipline transfers directly: define what will be measured, with what instrument, before enrollment begins.

## Set the measurement frame at kickoff

B2B SaaS pilot practice converges on pre-kickoff scorecards: set baselines, targets, owners, and review dates before the pilot begins, with explicit paid-rollout triggers (interviewtip, https://interviewtip.net/b2b-saas-pilot-success-criteria-scorecard/, jev weight 0.31, weak backing). The decision gate is identified as the moment most pilots fail, because the prerequisites for a real decision were not established before the pilot began; a decision gate that produces a decision requires defined criteria and evidence gathered against them (Traction Technology, https://www.tractiontechnology.com/blog/how-to-run-a-successful-pilot-with-a-startup-frameworks-kpis-enterprise-best-practices, jev weight 0.34, weak backing). For an ROI model this means the evidence plan and the formula must be frozen together at kickoff: the measured side of each line item has an owner, an instrument, and a review date.

Enterprise pilot frameworks structure the same idea as phases, with the first phase dedicated to scope and baseline: the opening weeks determine whether the project yields actionable evidence or fails quietly (AI Accelerator, https://maccelerator.la/en/blog/entrepreneurship/ai-automation-pilot-programs-90-day-framework-enterprise-validation/, jev weight 0.16, weak backing). Software engineering exit-criteria practice formalizes the endpoint: predefined criteria against which progress is tracked, including approvals and milestones (Six Sigma US, https://www.6sigma.us/six-sigma-in-focus/exit-criteria/, jev weight 0.25, weak backing).

## Logs over recollection

The yubiOS evidence sources deliberately prefer generated logs over interviews where both exist: pilot SLA logs and pilot enrollment logs are machine-generated records of what actually happened during the pilot, while the discovery interview captures only the pre-pilot baseline (internal reference: yubi-OS/yubiOS refs/customer-roi-model-2026-07-25.md). The distinction matters because measured-during-pilot values are the ones that can validate or invalidate a claim, and recollection after the fact is not measurement. Where a line item has no log instrument, for example audit evidence burden, the pilot design should create one: time the evidence production during the pilot.

## What validation can and cannot conclude

Two boundaries follow. First, validation is per line item, not global: the enrollment line can be validated by enrollment logs while the incident response line remains unvalidated because no incident occurred during the pilot window. Second, a single pilot with one customer produces one data point, not a statistically validated ROI, which the yubiOS model requires be stated explicitly in every external claim (internal reference: yubi-OS/yubiOS refs/customer-roi-model-2026-07-25.md). Evidence discipline at the pilot scale is about traceability of each number, not about significance.
