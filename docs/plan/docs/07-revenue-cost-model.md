# 07 - Three-year revenue and cost model

Scope: the planning document's financial scaffolding: model assumptions, the base-case table, the explicit warning that the numbers are illustrative, sensitivity scenarios, stop rules, unit-economic goals, and the runway requirement.

## The epistemic status of the numbers

The source doc (yubi-OS/yubiOS docs/PLAN.md) is unusually explicit here. The base-case figures are "illustrative scaffolding, not validated forecasts." It quotes refs/three-year-revenue-cost-model-2026-07-25.md (OMN-77): "There is no base-case model with real numbers in this repo to validate - RULES.md and COMPANY.md both list Financial as unset, and refs/team-budget-use-of-funds-2026-07-25.md (OMN-74) already established that no funding/revenue figure exists for this session to ground one in. Producing a three-year model with invented revenue and cost figures would be exactly the fabrication the pulpit's doctrine rules out." The structural framework is correct; the numeric cells are placeholder inputs to be replaced once real data exists (source doc).

The doc also fixes an update cadence: section 6 must be re-stated against actuals within 30 days of (a) the first priced proposal landing, (b) the first paid pilot completing, or (c) any material change to the runway/funding assumption. RULES.md and COMPANY.md must be updated together so the three files do not drift (source doc).

## Assumptions

The model's stated assumptions (source doc):

- Year 1 begins only when Technical Preview pilots can run honestly.
- List price averages $600 per subscribed node per year, with a $25,000 annual organization minimum.
- Customers and subscribed nodes are end-of-year values; recognized subscription revenue is lower because contracts start throughout the year.
- Subscription gross margin target is 75 percent; implementation gross margin is 40 percent; training gross margin is 60 percent.
- Grants fund public work and are modeled at 90 percent contribution margin for planning, although restricted-grant accounting may differ.
- Operating expense includes salaries/contractors, security engineering, support, sales/customer success, infrastructure, insurance, legal, accounting, and community investment.
- No breach-avoidance revenue or speculative certification premium is included.

## Base case (USD thousands except customer and node counts)

All figures from the source doc, labeled planning assumptions, not forecasts, and explicitly not validated (source doc):

| Metric | Year 1 | Year 2 | Year 3 |
|---|---:|---:|---:|
| Paying subscription customers, end of year | 3 | 10 | 25 |
| Subscribed nodes, end of year | 225 | 1,500 | 6,250 |
| Exit ARR | $135 | $900 | $3,750 |
| Recognized subscription revenue | $75 | $600 | $2,400 |
| Pilots, implementation, board work | $180 | $450 | $900 |
| Training | $20 | $75 | $200 |
| Grants and sponsorships | $75 | $75 | $50 |
| Total revenue | $350 | $1,200 | $3,550 |
| Gross profit | $208 | $743 | $2,325 |
| Operating expense | $500 | $1,000 | $1,750 |
| Operating income / (loss) | ($292) | ($257) | $575 |

The model implies roughly $550,000 of cumulative operating loss before break-even. With working-capital and schedule contingency, plan for approximately $700,000 of total runway from founder capital, customer prepayments, grants, revenue-based financing, or equity. Raising capital is not a substitute for the technical and paid-pilot gates (source doc).

## Break-even arithmetic

At a 75 percent recurring gross margin, a subscription-only business with $1.75 million of annual operating expense would need approximately $2.33 million in subscription revenue to break even. At $600 per node, that is about 3,900 subscribed nodes. Services gross profit can lower the practical threshold to roughly 3,000 to 3,500 nodes, but permanent dependence on services will cap margin and maintainer capacity (source doc).

## Sensitivity and stop rules

Scenarios from the source doc (source doc):

| Scenario | Year 3 customer/node result | Interpretation |
|---|---|---|
| Downside | 10 customers / 1,500 nodes | Remain services-led; no year 3 break-even; reduce fixed hiring and narrow platform scope |
| Base | 25 customers / 6,250 nodes | Subscription becomes the majority of revenue; break-even during year 3 is plausible |
| Upside | 45 customers / 15,750 nodes | Invest in support automation, partners, and independent governance; do not relax engineering gates |

Stop or redesign the commercial offer if, after 20 qualified interviews and three priced proposals, fewer than two customers will pay for a pilot; if pilots do not show measurable operating value; or if support cost makes a 70 percent subscription gross margin implausible (source doc).

## Unit-economic goals

From the source doc (source doc):

- Initial annual contract value: at least $60,000 after pilot.
- Annual prepayment; multi-year discounts only after renewal evidence.
- Subscription gross margin: at least 70 percent by year 2.
- Services: below 35 percent of total revenue by year 3.
- Customer concentration: no customer above 25 percent of ARR by the end of year 3.
- Sponsorship and grants: below 15 percent of total revenue after year 1.
- Customer acquisition payback: under 12 months after a repeatable sales motion exists.
- Net revenue retention target: above 110 percent, measured only after a real renewal cohort exists.

## Sources

- Primary: yubi-OS/yubiOS docs/PLAN.md (source doc), section "6. Three-year revenue and cost model", quoting refs/three-year-revenue-cost-model-2026-07-25.md (OMN-77) and referencing refs/team-budget-use-of-funds-2026-07-25.md (OMN-74).
- No searXNG dig: internal-record subtopic. The financial model is an internal planning artifact whose own source-of-record check (OMN-77) forbids invented figures; there is no external mechanism to research. The dig step was skipped deliberately and this is the recorded reason.
