# 03. Packaging and tiers

**Scope:** tier design by fleet size or seat count, bundle packaging, and discount discipline when tier logic has no validation yet.

## Pricing and packaging are separate design problems

Pricing and packaging are two distinct things that work best when designed together. Pricing is what unit customers pay for, how that unit is priced, and at what levels; packaging is how features, limits, and entitlements get bundled into plans [source](https://stripe.com/resources/more/saas-pricing-and-packaging-strategy) (jev weight 0.66). The same guide treats value metrics, tiers, upgrade paths, and enterprise plans as the working parts of a packaging strategy [source](https://stripe.com/resources/more/saas-pricing-and-packaging-strategy) (jev weight 0.77).

## The three-tier default

For SaaS and cloud companies, the most popular packaging strategy is to bundle features into three tiers with progressively higher levels of value in each [source](https://ordwaylabs.com/resources/guides/usage-based-pricing-guide/packaging-strategies/) (jev weight 0.69). The good-better-best framework is described as the most widely used packaging structure in B2B SaaS: the good tier covers the core use case, the better tier adds what growing or more sophisticated customers need, and the best tier is premium [source](https://www.pacepricing.com/glossary/good-better-best) (jev weight 0.37, weak backing). A design-oriented treatment adds that good-better-best is a deliberate system for anchoring price perception and guiding customers to the right tier, not just three buckets of features [source](https://saasdash.ai/blog/saas-packaging-design-good-better-best) (jev weight 0.31, weak backing).

## Volume versus tier discounts

Two discount mechanisms get conflated and should be kept apart: volume discounts and tiered discounts both offer price breaks based on quantity purchased, but they apply differently, and distinguishing them is described as crucial for applying the most effective strategy [source](https://help.salesforce.com/s/articleView?id=ind.pricing_add_tier_discount_element.htm&language=en_US&type=5) (jev weight 0.62). For a fleet-priced infrastructure product this distinction is operational: a per-device price that steps down at 10, 50, and 100 devices is a volume structure, while an entitlement tier (more devices unlock managed-only features) is a tier structure. The choice changes what a discount signals and what it costs at margin.

## Segment-based tiering

Segmentation and tiered pricing is described as one of the most powerful ways to improve B2B pricing performance, because it converts intuition and one-off deals into a coherent system that matches price to customer segments [source](https://umbrex.com/resources/b2b-pricing-playbook/segmentation-and-tiered-pricing-matching-price-to-customer-segments/) (jev weight 0.43, weak backing). A pricing consultancy frames the same idea as three pillars that shape a packaging and pricing model for scaling B2B SaaS companies [source](https://www.simon-kucher.com/en/insights/profit-starts-packaging-and-pricing) (jev weight 0.60).

## Discount discipline before validation

When no tier logic has been tested against real buyers, discounts are the most dangerous part of packaging, because every ad hoc discount destroys the signal the tier structure was supposed to produce. Three disciplines follow from the sources:

1. Publish tier boundaries as fleet-size or seat breakpoints rather than negotiated numbers, so a deal either fits a tier or becomes documented evidence that the tier logic is wrong.
2. Keep volume discounts mechanical and tied to the published breakpoints, consistent with the volume-versus-tier distinction above [source](https://help.salesforce.com/s/articleView?id=ind.pricing_add_tier_discount_element.htm&language=en_US&type=5) (jev weight 0.62).
3. Treat a design partner's refusal to pay list at a small scale as invalidation of the tier hypothesis, not as a pricing conversation starter. Packaging that only survives with discounts is packaging that has not been validated.
