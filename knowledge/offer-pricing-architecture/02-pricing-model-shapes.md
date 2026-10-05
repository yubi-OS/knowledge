# 02. Pricing model shapes

**Scope:** matching pricing shapes to offer types: subscription, per-seat and per-device recurring, usage or volume-scaled, cost-plus hardware, flat project fees, and SLA-linked recurring.

## The model landscape

The dominant choice in B2B software pricing is between flat recurring access and charging by consumption. Industry data points to usage-based pricing being widespread: 61% of SaaS companies used it in some form in 2022, according to OpenView data reported by TechCrunch, though usage-based pricing is rising without fully replacing other models [source](https://techcrunch.com/2023/02/02/usage-based-pricing-is-rising-but-not-replacing-other-models/) (jev weight 0.68). Practitioner surveys of the model landscape also list per-seat, usage-based, outcome-based, credit-based, and hybrid pricing as the main shapes in current use [source](https://www.nxcode.io/resources/news/saas-pricing-strategy-guide-2026) (jev weight 0.35, weak backing).

## What the model choice actually trades

The pricing model is not cosmetic; it changes customer behavior and revenue quality. A per-seat versus usage-based comparison makes the core trade explicit: a flat rate makes revenue predictable while usage-based pricing makes it variable, and per-seat pricing can slow adoption because every additional user raises the bill [source](https://www.b2blead.io/blog/b2b-pricing-model) (jev weight 0.54). For an infrastructure product, the same logic applies one level down: per-device recurring pricing for fleet services behaves like per-seat (predictable, but discourages adding devices), while build-volume pricing behaves like usage-based (variable, but aligned with actual load).

## Mapping model to offer type

Recurring offers split into at least four shapes:

1. Per-seat or per-device recurring: a fixed fee per unit of customer scale. Fits managed enrollment and fleet services where value scales with fleet size.
2. Volume or concurrency-scaled recurring: the fee scales with measured usage, such as build volume for a hosted pipeline. Fits infrastructure whose cost and value both track load.
3. Response-time-linked recurring: a support contract whose price varies by committed response time. The commitment, not the feature set, is what differs across tiers.
4. Flat recurring subscription: one price for the managed service regardless of scale within limits. Simple, but leaves money on the table at both ends of the size distribution.

Non-recurring offers take two main shapes:

1. Cost-plus for hardware: price derived from unit cost plus a margin, appropriate when the offer resells physical goods with a known bill of materials.
2. Fixed-scope or time-and-materials for projects: consulting and training price by the engagement, not by consumption.

## Cost-plus versus value-based

Cost-plus pricing adds a markup to cost, while value-based pricing charges for the value the customer receives; a practitioner analysis of the two argues that neither works if the true cost of serving each customer is unknown, which is the shared dependency both approaches hide [source](https://costandprofitability.com/cost-plus-vs-value-based-pricing/) (jev weight 0.30, weak backing). The conventional claim that value-based pricing captures more margin for differentiated products than cost-plus [source](https://ideaproof.io/questions/cost-plus-vs-value-pricing) (jev weight 0.28, weak backing) is directional guidance only, and both claims carry weak backing in this corpus.

## Choosing under uncertainty

When no willingness-to-pay data exists yet, the model choice is itself a hypothesis. The defensible sequence is to pick the shape that makes the validation test cleanest: a per-device hypothesis is falsified or confirmed by whether a design partner pays list price for a small fleet without a discount that erases the tier logic; a usage-scaled hypothesis is confirmed only when real, not test, load is routed through the service. A model that cannot generate such a falsifying event is a description, not a hypothesis.
