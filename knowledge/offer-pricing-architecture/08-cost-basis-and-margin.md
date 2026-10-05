# 08. Cost basis and margin

**Scope:** building a cost basis for pricing: hardware unit costs, pre-flash and enrollment labor, margin arithmetic for bundles, and how unvalidated margins get labeled.

## Start from a structured bill of materials

Hardware pricing starts with the bill of materials, and the costing discipline is documented: a practical guide to costing a hardware bill of materials covers structure, unit versus volume pricing at 1k, 10k, and 100k volumes, the costs founders miss, and how to make the model auditable [source](https://fractionalforge.app/guides/how-to-cost-a-hardware-bill-of-materials) (jev weight 0.63). Electronics-manufacturing guidance widens the cost model beyond parts: real per-unit cost combines BOM material cost, PCB cost, labor, overhead, test, scrap, logistics, and margin rules in one repeatable model [source](https://www.elisaindustriq.com/resources/blog/product-costing-in-electronics-manufacturing) (jev weight 0.31, weak backing). BOM calculators operationalize this by adjusting for scrap and material loss per component and allocating overhead before computing a selling price [source](https://mfgcal.com/bom-cost-calculator/) (jev weight 0.50, weak backing).

The costs founders most often miss, per the BOM costing guide, sit outside the parts list: for a pre-flashed device bundle this means the labor for flashing, enrollment, and testing each unit, plus logistics and yield loss, not just the component cost.

## Unit economics at production volumes

Cost is volume-dependent. Hardware startup cost modeling covers unit economics, production costs, margins, break-even analysis, and economies of scale as one integrated exercise [source](https://hashinghardware.com/cost-modeling-hardware-startups-unit-economics/) (jev weight 0.58). Deeptech hardware guidance makes the presentation form explicit: the most effective tool for communicating the cost journey is a simple scenario model showing hardware unit economics at key production volumes, demonstrating how BOM cost optimization and yield improvements translate directly into gross margin [source](https://www.glencoyne.com/guides/deeptech-hardware-metrics-investors) (jev weight 0.57). A companion guide connects the same BOM inputs to revenue projections and gross margin in a financial model [source](https://www.glencoyne.com/guides/deeptech-hardware-financial-model) (jev weight 0.47, weak backing).

The practical consequence for a bundle priced before volume exists: quote the cost basis at the volume you will actually order at, not the volume you hope to reach, and show both as a scenario table.

## Margin arithmetic for bundles

Contribution margin is the right unit-level lens: it measures what each unit contributes to covering fixed costs and generating profit after variable costs [source](https://www.uniteconomics.net/guide/contribution-margin) (jev weight 0.30, weak backing). For a bundle with three cost layers, the arithmetic is:

1. Per-unit hardware cost at the real order volume (BOM plus yield loss).
2. Per-unit labor cost (pre-flash, enrollment, test, packing), which scales with headcount time rather than volume discounts.
3. Margin on top, stated as a percentage and checked against the substitution baseline: the margin must survive a customer who instead buys the bare component and performs the configuration themselves.

If the bundle price only clears margin with assumption 1 at hoped-for volume, the margin is not real and the price is not sellable yet.

## Labeling unvalidated margins

Because early-stage cost bases carry unvalidated assumptions, each number should carry a label:

1. Grounded: a real quote or invoice backs the figure.
2. Cited: a published range backs the figure (the component cost floor, for example), with the citation attached.
3. Hypothesis: a figure assumed for the model, awaiting a real quote.

This labeling discipline is the cost-side twin of pricing hypothesis discipline: a bundle margin built on a cited component cost and a hypothesized labor cost is honest about which part could break it. A margin stated without labels invites the reader to treat the strongest number (the cited component cost) as covering the weakest (unmodeled labor), which is exactly the error the cost-modeling sources warn about when founders miss costs outside the parts list [source](https://fractionalforge.app/guides/how-to-cost-a-hardware-bill-of-materials) (jev weight 0.63).

## Tie-back to the offer catalog

Cost basis work belongs before, not after, pricing hypotheses: a bundle offer's hypothesis (cost-plus on component cost plus labor) can only be tested at list price if the labor component is already modeled. The ready sequence is BOM at real volume, labor per unit, margin rule, then the pricing hypothesis with its validation criterion.
