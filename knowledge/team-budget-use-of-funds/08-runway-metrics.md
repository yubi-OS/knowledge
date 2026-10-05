# Runway and burn metrics: ratios instead of asserted figures

Scope: runway and burn metrics as ratio formulas that stay computable before and after funding exists: cash runway, net burn, and burn multiple, and how they gate budget checkpoints without asserting dollar figures.

## The ratio-first discipline

The yubiOS source framework refuses to assert an envelope until a funding number exists, but that refusal does not suspend measurement. The correct instruments are ratios and formulas, which are decidable with no absolute figure: a runway expressed in months, a burn expressed per month, an efficiency expressed as a multiple. Each becomes numeric the moment real inputs arrive, and none requires inventing an input.

## Cash runway: months of operation, not dollars of belief

Corporate Finance Institute defines cash runway as "the number of months a company can continue operating before it runs out of cash, assuming current spending levels stay the same," a metric startups use "to measure the rate at which the startup is spending its equity capital raised from investors" (https://corporatefinanceinstitute.com/resources/valuation/cash-runway-explained/, weight 0.645). The definition is a ratio, not an amount: runway is output, cash balance and spend rate are inputs.

The formula version confirms the shape: "the amount of cash on hand divided by the burn rate," with the worked example that a net burn of 20000 per month implies a runway of 10 months (https://www.wallstreetprep.com/knowledge/cash-runway/, weight 0.459, weak backing). Practitioner calculator guidance adds a refinement: use the average burn rate rather than a single month's when computing runway (https://pilot.com/blog/burn-rate-calculation-startup-runway-calculator, weight 0.334, weak backing).

The gross-versus-net distinction matters for a pre-revenue venture: "the gross burn rate formula is simply equal to the total monthly cash expenses," while "the net burn takes into account the cash sales generated... the outflows are net against the cash inflows from operations in the same time period" (https://www.wallstreetprep.com/knowledge/burn-rate/, weight 0.408, weak backing). Before revenue exists, gross and net burn converge; the moment the first paid pilot lands, they diverge, and the divergence itself is a signal.

## Burn multiple: capital efficiency as a dimensionless number

David Sacks' burn multiple is defined as net burn divided by net new ARR, and is presented as the cleanest measure of capital efficiency for a startup (https://sacks.substack.com/p/the-burn-multiple-51a7e43cb200, weight 0.855). Its diagnostic power is described as covering "any serious problem," which "will eventually impact the Burn Multiple by either increasing burn, decreasing net new ARR, or (most tricky) increasing both but at disproportionate rates," with gross margin problems given as the canonical example of spending too much on COGS to deliver the product (https://sacks.substack.com/p/the-burn-multiple-51a7e43cb200, weight 0.855).

Wall Street Prep's interpretation guidance states the direction plainly: "The higher the burn multiple, the less efficient the startup is at achieving each incremental step of revenue growth," with 4.0x given as an example where each dollar spent on growth is inefficient (https://www.wallstreetprep.com/knowledge/burn-multiple/, weight 0.638). Tomasz Tunguz's 2023 analysis uses the same construction, "burn multiple calculated like this: net bur[n]..." over net new ARR, and describes it as the measure of "the capital efficiency of a startup" (http://tomtunguz.com/burn-multiple-2023/, weight 0.675), tracking how the metric's distribution shifted as the funding environment repriced.

The lexicon framing captures why the metric matters for a budget discipline: "the 2022 reset shifted investor attention from growth-at-all-costs to growth-with-efficiency, and burn multiple became the shorthand for that shift" (https://www.startups.com/lexicon/burn-multiple, weight 0.372, weak backing).

## How ratios gate a framework without asserting figures

Applied to the yubiOS allocation and hiring framework, the metric layer becomes a set of checkpoints:

- **Runway gate.** A hiring trigger can reference runway in months ("do not convert the contractor to a hire below N months of runway") without ever stating the cash balance. The condition is computable when the funding number lands.
- **Burn-multiple gate.** After the first revenue arrives, burn multiple measures whether the gate-triggered spend (support hire after first SLA sale, additional engineering after second pilot) is producing proportional net new revenue. A rising burn multiple after a hire is exactly the "both increased at disproportionate rates" case Sacks flags.
- **Gross-to-net divergence.** The gap between gross and net burn is the first quantitative read on whether paid pilots are covering the event-driven spend the framework allocates to them.

A pre-revenue venture can compute all of these as formulas with unknown inputs and commit to the gates now, which is the same weights-not-amounts move as the allocation logic itself.

## Weak-backing context

Calculator tooling (https://best-calculators.com/business-productivity/startup-runway-and-burn-rate-calculator/, weight 0.158; https://getlaunchlist.com/tools/startup-runway-calculator, weight 0.295) implements the same formulas but carries weak weight. A burn-multiple explainer (https://www.theopstoolbox.com/benchmarks/burn-multiple, weight 0.254) and another metric directory (https://www.ideaplan.io/metrics/burn-multiple, weight 0.182) are likewise weak backing.

## Takeaway

Express budget discipline in ratios: runway in months, burn per month, burn multiple as a multiple of net new ARR. Ratios are decidable before funding exists, computable the day it arrives, and they gate the hiring and allocation triggers without anyone ever having to invent a dollar figure.
