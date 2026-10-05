# 08. Aggregating ROI across pilots

Scope: When averaging ROI across multiple pilots is meaningful, how regulated savings claims handle sample size, and what to report before aggregation is justified.

## The yubiOS gate: no average until the n supports it

The yubiOS model does not aggregate ROI across multiple pilots into an average until there are enough pilots for the average to be meaningful, and it deliberately does not set a specific minimum n, leaving that to a statistics judgment call by whoever runs the second and third pilot (internal reference: yubi-OS/yubiOS refs/customer-roi-model-2026-07-25.md). The refusal to hardcode a threshold is a feature: a minimum-n rule picked for marketing convenience is exactly the kind of number that gets chosen to make the average come out flattering.

## How advertising regulators treat sample-based claims

The UK Advertising Standards Authority treats substantiation for sample-based claims case by case and advises marketers to ensure their sample is of a sufficient size to adequately support the claim being made (ASA, Substantiation: consumer surveys and sample claims, https://www.asa.org.uk/advice-online/substantiation-sampling-references-and-consumer-goods.html, jev weight 0.24, weak backing). The regulator-side principle is that claim scope must match evidence scope: an average implies a population, and a population claim made from a handful of observations is a substantiation failure, not just a statistical one.

## How mature advertisers phrase averages

Established savings-claims practice shows the phrasing discipline that survives scrutiny. Progressive's brand guidelines for savings claims offer variants such as new customers who save with Progressive save nearly $975 on average, including the conditional only-those-who-saved phrasing, and pair each claim with disclosure placement rules (Progressive Brand, Savings Claims, https://design.progressive.com/savings-claims, jev weight 0.58). The conditional structure is the key move: the claim is scoped to the subset that experienced the outcome, and the disclosure travels with the number. An early-stage vendor with 2 or 3 pilots cannot yet make even the conditional form credibly; the structure is worth copying anyway because it is the shape the claim will need when the sample grows.

## What to publish before aggregation is justified

Microsoft's guidance on moving from AI pilots to measurable ROI emphasizes visibility, governance, and optimization as the path from pilot activity to measurable returns (Microsoft Azure, The economics of agent optimization: from pilots to measurable returns, https://azure.microsoft.com/en-us/blog/the-economics-of-agent-optimization-from-pilots-to-measurable-returns/, jev weight 0.77). The pre-aggregation analog for a pilot-stage vendor is per-pilot transparency: publish each pilot's scope, duration, baseline nature, and line-item outcomes separately, clearly labeled as single-customer results. Structured pilot-to-ROI practice in industry guidance similarly stresses measured outcomes over aggregate enthusiasm (Macromodule, How to turn AI pilots into real ROI, https://macromodule.com/ai-pilots-turn-into-roi/, jev weight 0.54).

## The aggregation decision itself

When the second and third pilots land, the aggregation decision should be made against explicit criteria rather than convenience: the line items must be measured the same way across pilots, the baselines must be comparable in kind, and negative results must be included rather than excluded. If those conditions hold, a conditional average with disclosure, phrased like the Progressive pattern, becomes defensible. If they do not, the corpus stays per-pilot. Either way the first external claim remains what doc 06 establishes: this customer measured this under this scope.
