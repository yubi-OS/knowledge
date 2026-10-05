# Sequencing the Go-to-Market Workstreams

Scope: Sequencing the go-to-market workstreams. Positioning and evidence boundary before pricing, offer finalization, and pilot work. Dependency discipline across weeks 1 to 4.

## The core ordering claim

For a product that is not yet proven, the go-to-market workstreams have a strict dependency order, and getting it wrong produces the two classic early-stage failures: pricing an offer before anyone has validated who it is for, and collateral that promises what the evidence boundary does not cover. The ordering claim is: evidence boundary and positioning first, customer understanding second, offer and pricing third, pilot work last. Pilot-before-rollout sequencing is also endorsed for newer go-to-market motions generally, where a bounded pilot validates the motion before committing to a full rollout ([apollo.io, weight 0.53, authoritative backing](https://www.apollo.io/insights/how-do-i-pilot-an-agentic-gtm-motion-before-committing-to-a-full-rollout)).

## Why positioning precedes pricing

Launch-checklist guidance argues that the point of sequencing is to get positioning, ideal customer profile, and the go-to-market plan locked before going live, because later workstreams inherit from earlier ones ([inpaceline.com, weight 0.29, weak backing](https://inpaceline.com/blog/startup-product-launch-checklist-go-live)). Full go-to-market frameworks structure the same order: the strategy covers positioning, pricing, distribution, and sales model as layers built once per launch, with the market-facing layers depending on the positioning layer ([slideworks.io, weight 0.25, weak backing](https://slideworks.io/resources/go-to-market-gtm-strategy)). Startup playbooks consistently place ICP definition before channel and pricing decisions for the same reason ([pitchgrade.com, weight 0.09, weak backing](https://pitchgrade.com/blog/go-to-market-strategy-startups)).

For security infrastructure the dependency is sharper than average because pricing a security product requires knowing who bears the risk of the product being wrong. An offer priced before the evidence boundary is fixed will either price in risk the vendor has not agreed to carry or underprice the support burden of unproven capability.

## The weeks 1 to 4 dependency chain

A concrete sequencing for a 4-week window, drawn from the yubiOS days 0 to 30 plan and consistent with the framework literature:

1. Week 1: lock the evidence boundary and current-position narrative; define the initial customer profile; open the legal tracks (naming, licensing, entity).
2. Week 2: draft covenant and conflict policy; convert the blocker list into explicit Technical Preview entry criteria; begin customer discovery interviews.
3. Week 3: draft pilot SOW, data sheet, support boundaries, and ROI baseline; reconcile pricing assumptions against interview feedback, legal constraints, and covenant commitments; shortlist grant opportunities.
4. Week 4: finalize outputs into decision-ready artifacts; close open questions blocking offer discussions; review whether risk has materially reduced before moving into pilot work.

The week 3 reconciliation step is where the sequence pays off: pricing assumptions are checked against three independent inputs (interview evidence, legal constraints, covenant commitments) that only exist because weeks 1 and 2 ran first.

## What feeds what

The dependency map in the source plan runs: current position and evidence boundary first, who-pays-and-why second, both shaping messaging and market boundary before offer finalization. Covenant and legal tracks run in parallel once basic positioning is clear. Offer and pricing finalize after covenant, legal, and positioning constraints are all clear. The general principle: any workstream that produces a public-facing artifact waits for the workstreams that constrain it, and runs in parallel only with workstreams it does not constrain or depend on.

## Discovery as a continuing gate

Discovery is not only a week 2 activity; it is the gate that each later workstream re-checks. Guidance on structured discovery argues for a fixed study with a defined buyer set before finalizing positioning and roadmap decisions ([koji.so, weight 0.34, weak backing](https://www.koji.so/blog/b2b-customer-research-guide-2026)). Platform vendors structure early go-to-market support around a discovery step that matches solutions to customer needs before deeper engagement ([learn.microsoft.com, weight 0.54, authoritative backing](https://learn.microsoft.com/en-us/startups/benefits/gtm-benefits/mfs-gtm-discovery-agent)). The operational rule: no offer or pricing decision is finalized while an open discovery question bears directly on it, and the week 4 exit review explicitly asks whether discovery changed any assumption the offer depends on.

## The exit review

The window ends with a review, not a launch: did the legal, messaging, and go-to-market risk materially decrease across the 4 weeks? The review compares the exit criteria (evidence boundary documented, customer profile documented, covenant ready, legal tracks open with questions captured, preview entry criteria explicit, pilot collateral in draft, interview set complete) against the week 1 state. Only when the criteria are met does the next window (pilot work) begin, because pilot work amplifies whatever evidence boundary exists at its start, in both directions: a disciplined boundary scales cleanly into pilots, and an overclaimed one scales into support escalations and retractions.
