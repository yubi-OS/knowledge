# ROI Formula Structure

Scope: the per-line-item ROI contribution formula, its dollar conversion rule, and the subtraction of the pilot offer's recurring cost.

## The formula in one paragraph

For each of the five line items, the ROI contribution equals the baseline cost or time minus the pilot-measured cost or time, converted to a common unit: dollars. Time-based items convert at the customer's own stated hourly cost for the relevant staff, so the model never invents a labor rate. Total pilot ROI equals the sum of the per-line-item contributions minus the recurring cost of the pilot offer itself. The refreshed model states this explicitly as the same structure as the OMN-84 worksheet (yubi-OS/yubiOS refs/pilot-collateral-roi-baseline-2026-07-25.md), formalized into an equation rather than duplicated as new line items (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md).

## The standard ROI backbone

The formula is deliberately conventional. Investopedia maintains the standard reference guide to calculating return on investment and its formula (https://www.investopedia.com/articles/basics/10/guide-to-calculating-roi.asp, jev weight 0.79, authoritative) and a term page defining return on investment (https://www.investopedia.com/terms/r/returnoninvestment.asp, jev weight 0.80, authoritative). The refreshed model does not redefine ROI; it applies the ordinary arithmetic of baseline minus measured, in dollars, per line item.

## Why per-line-item instead of one ratio

A single aggregate ratio hides which line items drove the result. Pilot-measurement guides in the wild break measurement into the same parts the model uses: the Red Brick guide to measuring ROI from an AI automation pilot lists baseline metrics, cost modeling, quality checks, payback math, and a scale-or-stop decision framework as the working steps (https://www.redbricklabs.io/blog/how-to-measure-roi-from-an-ai-automation-pilot, jev weight 0.44, weak backing). An enterprise AI ROI guide similarly lists baselines, P&L metrics, full cost models, outcome owners, and pilot gates (https://gsconsultingllc.com/insights/measuring-enterprise-ai-roi, jev weight 0.36, weak backing). Per-line-item reporting is the version of that practice that survives audit: each contribution names its evidence source, so a weak line item cannot hide inside a blended number.

## Time to dollars

Time-based line items (incident response, enrollment, audit burden) convert at the customer's own stated hourly cost. Generic B2B ROI calculators demonstrate the same conversion pattern, for example seat cost and rep time saved, but they rely on benchmark rates rather than the customer's own numbers, so their outputs are directional at best (https://b2broicalculator.com/, jev weight 0.29, weak backing). The refreshed model's choice is stricter: the customer's rate is a required baseline cell, not a lookup.

## Hours alone are not ROI

A pilot-metrics post makes the point directly: "the pilot saved 20 hours" is not ROI by itself; the claim needs the per-employee impact, the number of affected employees, and the cost per saved hour (https://graftconcepts.com/knowledge/which_ai_pilot_roi_metrics_actually_prove_business_value_in_2026, jev weight 0.06, weak backing). This is exactly why the model converts hours at a customer-declared rate and reports contributions per line item instead of a bare hours figure.

## Staged proof points are compatible

A practical measurement framework published on GitHub recommends baseline metrics captured before any work begins, staged value gates rather than a single final ROI check, and honest cost accounting including costs the pilot itself introduces (https://github.com/shift-ai007/ai-roi-measurement-framework, jev weight 0.23, weak backing). The per-line-item formula supports staged gates: each line item can be gated independently, and the pilot offer's recurring cost enters the total as a subtraction, so no gate can quietly forget the offer's own price.

## What the formula does not do

It does not set a minimum ROI threshold for proceeding to a full deployment; that decision belongs to the OMN-67 day-90 framework. It does not aggregate across customers; aggregation is a separate discipline with its own evidence bar (see the pilot aggregation statistics doc). And it embeds no placeholder numbers: the refreshed model deliberately contains no worked example, because invented plausible figures escape their label once copied out of context (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md).
