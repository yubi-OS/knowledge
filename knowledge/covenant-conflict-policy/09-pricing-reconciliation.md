# 09 - Reconciling pricing and SKUs with covenant commitments

Scope: how commercial pricing and SKU design get reconciled with covenant commitments, pricing-model-agnostic conflict checks, and running offers through the checklist.

## Why reconciliation must be model-agnostic

A conflict policy that pre-judges SKUs cannot survive contact with a pricing model that has not been chosen yet. The defensible design separates process from judgment: the policy defines how an offer is checked, and each proposed offer is run through the check and recorded. The open-core pricing literature supports this separation, because it shows how many legitimate shapes pricing can take on the same free core.

## The pricing shapes that coexist with a free core

The catalog of shapes is broad: a free open base with paid proprietary features, support, and hosting on top (weight 0.30, weak backing: https://opensourcelicenserisk.com/commercial-licensing/open-core-pricing-models-explained/); tiered feature placement decided explicitly, with successful companies deliberate about which tier a feature lands in (weight 0.15, weak backing: https://www.lavapi.com/blog/open-core-free-vs-paid-features); and monetization strategies layered over the project including support and hosted variants (weight 0.14, weak backing: https://en.wikipedia.org/wiki/Open-core_model). A 2026 practitioner survey of developer monetization adds the community-health dimension: monetization that works preserves the project's reputation and contributor base (weight 0.09, weak backing: https://dev.to/zny10289/open-source-software-monetization-how-developers-are-actually-making-money-in-2026-4ddh).

A values-alignment guide makes the reconciliation principle explicit: monetization models should be chosen against the project's "core values" with "unwavering commitment" as the stated constraint (weight 0.04, weak backing: https://www.getmonetizely.com/articles/how-to-monetize-a-vibe-coded-open-source-project-without-alienating-your-community). A comprehensive monetization guide flags competitive forks as the risk that tempts vendors to tighten the commons, which is exactly the pressure a covenant exists to channel (weight 0.05, weak backing: https://dev.to/rachellovestowrite/monetizing-open-source-projects-a-comprehensive-guide-3p1h).

## The checklist run

Concretely, reconciling an offer means: (1) enumerate what the offer gates or restricts, (2) test each item against the covenant's public-guarantee clauses (security fixes universal, telemetry opt-in, disclosure equal), (3) record the result as an ADR naming the SKU, the clauses tested, and the verdict, and (4) treat any needed covenant change as its own conflict process, not a side effect of shipping the SKU. The first real run of this checklist should happen only after the pricing and offer documents exist, since no concrete SKU can be judged before it is specified.

All sources in this doc carry weak jev backing (below 0.5); the subtopic is retained because the sources converge on the same reconciliation pattern, but the specifics should be treated as directional.
