# Baseline Data Collection

Scope: the five customer baseline cells the model requires before a pilot starts, the sourcing discipline for each, and the rule that a missing baseline is a finding in its own right.

## The five cells

For each pilot customer, before the pilot starts, the model needs: their current root-of-trust cost per device (TPM, OEM secure enclave, or none, with whatever cost figure they can provide); their historical incident response time for a lost or compromised credential if they track it; their current device onboarding and enrollment time; their current audit and compliance evidence burden in hours or a comparable unit; and their internal hourly cost rate for the relevant staff (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md). All five baseline cells in the OMN-84 worksheet are marked customer-provided and currently blank; the formula is unusable until they are filled from the customer, not from benchmarks.

## Why baselines come before the pilot

External pilot guidance converges on the same ordering. A lean sigma pilot plan check sheet instructs teams to establish clear success metrics and collect baseline data to measure the pilot's impact (https://www.learnleansigma.com/wp-content/uploads/2024/10/Pilot-Plan-Check-Sheet-LearnLeanSigma.pdf, jev weight 0.38, weak backing). An AI adoption framework makes the comparison logic explicit: baseline measurement before the pilot sets the stage for meaningful comparison and evaluation of the solution's effect (https://www.aiawareness.ai/ai-resources/ai-adoption-framework/section-10-running-a-pilot-and-proving, jev weight 0.43, weak backing). A manufacturing analytics checklist likewise defines measurable KPIs and baselines as part of pilot setup (https://ifactoryapp.com/analytics-reporting/manufacturing-analytics-pilot-project-checklist, jev weight 0.21, weak backing). Without a pre-pilot baseline, the pilot-measured side of each formula line has nothing to subtract from.

## How the numbers are collected

The baseline is collected in a customer discovery interview, which the refreshed model names as the evidence source for the baseline side of the worksheet. Interview guidance supports the discipline the collection needs: discovery interviews are most useful when exploratory, neutral, and focused on the customer's actual experience, avoiding pitching too early (https://www.sciencedocs.com/wp-content/uploads/2026/05/ScienceDocs_Customer_Discovery_Interview_Guide.pdf, jev weight 0.18, weak backing). In B2B settings the interview should reach the buying committee, not just a single contact, because the people who own the incident response and audit numbers are not always the same person (https://lindeninnovation.com/customer-discovery-interviews-b2b/, jev weight 0.20, weak backing).

## A missing baseline is a finding

The refreshed model states that if a customer does not track, for example, incident response time for lost credentials, the absence of that number is itself a finding, not an error to paper over (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md). This is a deliberate design choice with two consequences. First, the pilot readout can report "no baseline existed" as a result about the customer's current process, which is often the strongest part of the cost-of-alternative story. Second, it blocks the classic failure mode of silently substituting an industry-average number into the baseline cell, which would make every downstream contribution fictional.

## The rate cell is what makes time convertible

The hourly cost rate cell exists specifically so time-based line items can convert to dollars without the model guessing an industry-average rate. External ROI calculators that hard-code benchmark labor rates are usable for rough prospecting math but are not a substitute for this cell (https://b2broicalculator.com/, jev weight 0.29, weak backing).

## Hardware cost is sourced per tier

The root-of-trust cost per device depends on which procurement tier applies, and the data-collection spec records which tier each input came from so the formula's output is interpretable and not just arithmetically valid (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md). The three tiers and their sourcing rules are covered in the hardware cost sourcing tiers doc.
