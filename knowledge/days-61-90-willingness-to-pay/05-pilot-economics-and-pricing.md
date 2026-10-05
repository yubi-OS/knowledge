# 05: Pilot Economics and Pricing
Scope: Setting the pilot price from a revenue and cost model: per-node pricing structure, and why a pilot must be priced rather than free custom engineering.

## Paid, not free: the structural rule

The days-61-90 plan states the pilot must be priced, not free custom engineering, per the days-31-60 plan and the OMN-71 and OMN-78 workstreams; if no price exists by day 61, that is a blocking gap, not a reason to run it unpaid (session source doc, internal). Practitioner sources give the tradeoff analysis behind the rule: many pilots are free and some are paid, and the choice has real tradeoffs (startupstrategies.substack.com/p/pilots-should-they-be-free-or-paid, w=0.38, weak backing). Free pilots attract more prospects but attract buyers who are not willing to pay; paid pilots filter for real demand and produce honest usage data, because a paying customer uses the product as a customer, not as a tester (techhubcore.com/paid-pilots-for-startups/, w=0.41, weak backing). The same selection logic appears outside software: independent professionals are advised to start paid-only with an upfront deposit rather than offering free work (launchadvisor.co/guides/freemium-vs-free-trial-vs-paid-only-freelancer-independent-creator, w=0.29, weak backing).

## Why free pilots poison the WTP readout

A free pilot measures interest under zero price, which is exactly the variable the phase is trying to measure in the other direction. If the pilot is free, the day-90 readout cannot distinguish product value from the absence of a price. The paid structure is what makes the pilot a willingness-to-pay instrument at all (doc 01). This is also why the source doc treats a missing price as a blocker rather than defaulting to unpaid (session source doc, internal).

## Pricing structure that converts

Most B2B SaaS pilots fail to convert because they are priced as procurement formalities, not commercial commitments; the pricing structure that lifts pilot-to-paid conversion above 70 percent ties the pilot price forward into the full contract (rocklanestrategy.com/insight-hub/pricing-b2b-saas-pilots-to-convert-to-full-contracts, w=0.27, weak backing). Enterprise pilot pricing should be treated as a component of the go-to-market approach that directly affects conversion rates, sales velocity, and customer lifetime value, not an afterthought (getmonetizely.com/articles/how-to-structure-enterprise-pilot-program-pricing-effective-proof-of-concept-strategies, w=0.20, weak backing).

Structural guidance from a dedicated how-to: design, price, negotiate, and convert with real structures, pricing benchmarks, contract language, and lessons from pilots that worked and pilots that did not (techhubcore.com, w=0.41, weak backing). The general pattern across sources: charge a meaningful fraction of the intended annual contract value, credit it against the full contract on conversion, and never price the pilot at zero or at token nuisance value.

## Per-node pricing

The source doc fixes the pilot at 25 to 50 nodes (session source doc, internal). Per-node pricing is the natural unit for infrastructure software because the buyer can compute the full-deployment cost from the pilot arithmetic: pilot price divided by pilot nodes equals the per-node rate the full deployment will extrapolate to. This makes the pilot price self-documenting: the buyer sees exactly what scale costs. No external source in this dig covers per-node infrastructure pricing specifically at 25-50 node scale; the per-node extrapolation argument is internal reasoning from the source doc's node-count bounds, labeled as such.

## Where the price comes from

The price is not invented at pilot time. The dependency chain in the source doc runs OMN-77 (three-year revenue and cost model) to OMN-78 (customer ROI model): those define whether the pilot economics work at all, and the pilot price must be consistent with them (session source doc, internal). A pilot priced below the model's sustainable rate corrupts the WTP readout in the opposite direction: the customer's yes is real, but the margin is not.

## Evidence standard for this doc

External claims carry weak backing (jev weight below 0.5); the strongest external source in this dig is a practitioner guide on pricing and structuring paid pilots (techhubcore.com, w=0.41). The paid-not-free rule and the 25-50 node bounds are internal to the yubiOS source doc. The 70 percent conversion figure is a single-source operator claim, explicitly weak-backed.
