# 07 - Pricing the Pilot

Scope: pricing the pilot instead of defaulting to unpaid custom engineering, the SOW prerequisite before recruiting, and pricing structure constraints to settle before the ask.

## The doctrine and its constraint

The source plan (yubiOS refs, `days-31-60-narrow-product-2026-07-25.md`) records the doctrine ("price the pilot; do not default to unpaid custom engineering") but deliberately defers the number to the offer and pricing architecture work (OMN-71) and the customer ROI model (OMN-78), recording the constraint instead of duplicating it. Its one hard requirement for sequencing: a priced pilot SOW draft must exist before design partners are recruited, "so the ask to design partners includes a price, not a blank".

Every source in this doc's dig scored below the 0.5 authoritative threshold, so this doc is built on weakly backed practitioner material, labeled as such throughout. The convergence of independent sources on the same core claims is the compensating signal.

## Why unpaid pilots fail

Multiple independent practitioner sources describe the same failure pattern. A market access analysis describes the mechanism: the startup ends up customizing the product to fit internal processes, three months later the key decision maker has moved on, and the pilot quietly dies (weight 0.269, weak, https://www.linkedin.com/pulse/market-access-mirage-why-unpaid-pilots-hurting-startups-kovuru-lrtkc). A climate startup analysis identifies the causal variable: unpaid pilots lack commercial commitment, and the payment clause is the one founders avoid most because it feels like the dealbreaker (weight 0.276, weak, https://withicademy.com/articles/climate-startup-pilots-a-three/). A pair of AI focused writeups describe pilots stalling before production because demos are designed to impress rather than to survive reality, and argue for designing a pilot that is built to ship from day one (weight 0.223, weak, https://www.codewithkarani.com/blog/the-pilot-trap-why-ai-pocs-never-reach-production; weight 0.373, weak, https://driventodevelop.com/2026/07/14/the-urgency-trap-is-why-your-ai-pilot-didnt-work/).

For yubiOS specifically, the unpaid pilot failure mode has a concrete form: pilot partners running on real infrastructure consume engineering time (VM lane fixes, hardware demonstration support, incident response), and an unpaid pilot with custom engineering attached is indistinguishable from free services work.

## How to structure a paid pilot

The structure guidance is consistent across sources. A paid pilot is "a short commercial engagement designed to answer a risky question before either side commits to a full rollout"; the customer pays because the work should create a useful outcome now, and the startup limits scope because it is still learning how the product fits (weight 0.185, weak, https://www.100tasks.com/blog/paid-pilot-examples-b2b-startups). A structure guide lists the components: define success criteria, control scope, prepare procurement, and convert the pilot into a full contract (weight 0.318, weak, https://abovea.tech/insights-strategies/how-to-structure-paid-pilot-startup/).

On pricing method, one source proposes starting from the target annual contract value and working backward, or, with no pricing reference yet, using what a comparable hour of consultant or agency time costs the target buyer (weight 0.084, weak, https://startupcorners.com/blog/how-to-run-a-paid-pilot-to-validate-b2b-willingness-to-pay). The consultant-hour fallback is the most transferable to a pilot whose deliverable is engineering validation work rather than software seats.

A counterweight is worth recording: some founders over-engineer the pilot structure, building tiered pricing, multiple sign offs, and a 20 page statement of work before closing a single paying customer, which is its own failure mode (weight 0.266, weak, https://startupfortune.com/how-to-price-an-enterprise-pilot-without-giving-away-the-product/). The source plan's SOW draft requirement is compatible with this: a draft exists to make the ask concrete, not to perfect procurement paperwork before the first partner exists.

## Reconciling design partners with payment

The design partner literature describes preferential pricing as a standard part of the partner exchange (weight 0.268, weak, https://www.koji.so/docs/design-partner-program). This reconciles with the source plan's doctrine: design partners pay something, possibly discounted, and the discount is the concession, not free work. The plan's sequencing (priced SOW before recruitment) operationalizes it: the partner conversation opens with a document that has a price on it.

## Rules for the pilot SOW draft

1. Put a price on every ask. The concession can be discount or extended terms, never a zero.
2. Define success criteria and scope limits in the SOW itself, matching the paid pilot structure guidance.
3. Keep it short: a draft priced SOW beats a 20 page procurement package before the first paying customer.
4. Plan the conversion path from pilot to full contract in the SOW, since that is the pilot's actual purpose.
5. Defer the specific number to the pricing architecture and ROI model work, as the source plan does, but do not let the deferral become an excuse for an unpriced ask.
