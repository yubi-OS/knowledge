# 03. ROI baseline worksheet design

**Scope:** ROI baseline worksheet design: line items split between customer-provided pre-pilot baselines and pilot-measured values, and why vendors avoid inventing industry-average figures.

## The ROI number exists only when both columns exist

Return on investment is a performance measure used to evaluate the efficiency of an investment or to compare the efficiency of several investments (weight 0.46, weak backing: investopedia.com, https://www.investopedia.com/terms/r/returnoninvestment.asp). A second reference adds the comparative use case: calculating ROI to compare the profitability of alternatives (weight 0.46, weak backing: investopedia.com, https://www.investopedia.com/articles/basics/10/guide-to-calculating-roi.asp). Both definitions are arithmetic-neutral: ROI is a ratio over inputs the calculator supplies. The worksheet's job is to name the inputs and their sources, not to supply the values.

A baseline-conditions worksheet for operational initiatives makes the same move explicitly: organize baseline conditions, expected benefits, cost assumptions, implementation risks, and measurable outcomes before committing to a major initiative (weight 0.18, weak backing: sciencedocs.com, https://www.sciencedocs.com/wp-content/uploads/2026/05/ScienceDocs_ROI_Estimation_Worksheet.pdf). Baseline conditions are a distinct field from expected benefits. A vendor who fills the baseline column on the customer's behalf has merged the two fields.

## Column design: customer-provided vs pilot-measured

The worksheet that avoids asserting customer-specific numbers has three column families, not two:

1. Line item: a named cost or time quantity with an operational definition.
2. Baseline (pre-pilot) versus with-pilot values, each marked with its provenance: customer-provided for the baseline, pilot-measured for the with-pilot column.
3. Source of the number: the artifact or conversation that produced it (customer discovery interview, pilot logs, SLA records).

Incremental analysis is the recognized framing: Smartsheet's ROI template guidance emphasizes the importance of incremental analysis when computing ROI, meaning the comparison is between the baseline state and the changed state, not between zero and the changed state (weight 0.30, weak backing: smartsheet.com, https://www.smartsheet.com/roi-calculation-templates). An IT-project ROI calculator with built-in formulas follows the same structure: costs and returns entered by the user, formulas doing only the arithmetic (weight 0.33, weak backing: udig.com, https://www.udig.com/insights/blog/roi-calculator-for-it-projects).

## Line items for an infrastructure pilot

Cybersecurity TCO literature provides the line-item vocabulary: total cost of ownership in cybersecurity covers direct costs of hardware, software, and services plus indirect costs related to business continuity, staff productivity, risk management, and organizational efficiency (weight 0.31, weak backing: sentinelone.com, https://www.sentinelone.com/cybersecurity-101/cybersecurity/what-is-cybersecurity-tco-total-cost-of-ownership/). A TCO guide structured as a worked example walks through calculating and comparing the TCO of two infrastructure options over time, with the worksheet holding non-recurring and recurring costs and hours across hardware, software, licensing, training, and consulting (weight 0.33, weak backing: jumpcloud.com, https://jumpcloud.com/wp-content/uploads/2023/05/202305-EB-CompleteGuideToCalculatingTCO.pdf; weight 0.40, weak backing: jumpcloud.com, https://jumpcloud.com/wp-content/uploads/2022/06/202206-EB-CompleteGuideToCalculatingTCO.pdf).

For a hardware-root-of-trust pilot, this vocabulary maps to five line items:

1. Cost of the current root-of-trust approach (TPM, OEM enclave, or none): customer-provided.
2. Incident response time for a lost or compromised credential: customer-provided baseline, pilot-measured after.
3. Time to onboard or enroll a new device: customer-provided baseline, pilot-measured after.
4. Time to produce audit or compliance evidence for a trust-chain control: customer-provided baseline, pilot-measured after.
5. Recurring cost of the pilot offer itself: vendor-side, from the pricing hypothesis line of the SOW.

## Why the vendor never fills the baseline column

The cost lines above are the ones generic ROI templates get wrong. A fillable IT-cost worksheet that captures salary, turnover, downtime, security incidents, and shadow IT notes that the salary line is "the easy number" while the hidden costs bite (weight 0.12, weak backing: theitvortex.com, https://www.theitvortex.com/wp-content/uploads/2026/05/IT_Vortex_TCO_Worksheet_Fillable.pdf). Those hidden costs are exactly the quantities a vendor cannot know: they live in the customer's tickets, logs, and headcount. Any vendor-supplied figure for them is an invention, and the worksheet that carries such a figure produces an ROI the customer cannot defend internally.

The structural conclusion: the worksheet is a template with the baseline column empty by design. It produces a real ROI only after a specific customer fills the customer-provided column in discovery and the pilot fills the pilot-measured column in operation.
