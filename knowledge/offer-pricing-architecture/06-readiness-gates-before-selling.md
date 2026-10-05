# 06. Readiness gates before selling

**Scope:** gating each offer on engineering and operational readiness (owner, evidence target, recovery plan) before it becomes sellable.

## Why gates, not dates

Launch readiness is a gate discipline, not a calendar discipline. A launch-readiness checklist is described as a way for decision-makers to test a claim before tooling, inventory, and market commitments make changes expensive [source](https://www.alskar.com/2026/09/24/product-launch-readiness-checklist/) (jev weight 0.34, weak backing). The same framing appears in staged-gate treatments: once exit criteria are met, such as the product having been used by a few customers and reliably working, the team can move to the operational readiness gate where the launch team is assembled [source](https://medium.com/@iammaureenwest/4-gates-for-launch-readiness-8b7fd8d2d298) (jev weight 0.43, weak backing).

The cost asymmetry is the justification: commitments become expensive to reverse after launch, so the gate exists before the commitment, not after.

## Anatomy of a gate

A readiness gate per offer needs three named fields, consistent with how launch checklists structure accountability:

1. Owner: who closes the gate.
2. Evidence target: the observable that must exist (a hardware validation run completed, a documented recovery path, a merged pull request).
3. Recovery plan: what happens if the gate does not close in time.

Product-management checklists make product readiness itself a checklist-gated event: the guidance is that you do not launch until the product is ready, and a readiness checklist is how you know it is close enough [source](https://productschool.com/blog/product-marketing/product-launch-checklist-for-product-marketers) (jev weight 0.48, weak backing). Go-to-market readiness extends the same idea beyond the product: it determines whether a product is ready to be launched to a new market and appeals to the ideal audience [source](https://www.wrike.com/go-to-market-guide/faq/what-is-go-to-market-readiness/) (jev weight 0.36, weak backing).

## Gating versus pre-selling

Readiness gates do not forbid selling before the product exists; they forbid selling what the evidence cannot back. Selling before you build is described as a discipline of discovery, design partnerships, and risk reduction that turns a vision into signed pilots, with founders selling the problem, getting paid pre-product, and letting real customers shape what got built [source](https://www.pmf.show/blog/how-to-sell-before-product-is-built) (jev weight 0.42, weak backing). Design partners are the sanctioned early-commercial instrument: they are the first few users enlisted to define the problem space and shape solutions while the product gears up for launch [source](https://a16z.com/a-framework-for-finding-a-design-partner/) (jev weight 0.73).

The distinction that makes both compatible: a design-partner engagement sells collaboration on an unfinished product at a documented risk level, while a general-availability SKU sells a production promise. Gates apply to the second, design partners belong to the first.

## Gate patterns per offer type

Mapping gates to an infrastructure product's offer catalog:

1. Managed services gate on mechanism evidence: a service cannot carry a price while the underlying mechanism is unproven on real hardware; the gate is the completed validation run, not a plan to run it.
2. Hardware bundles gate on recovery: a documented and tested recovery path must exist before shipping, because a customer who loses a key needs the flow on day one.
3. Support and SLAs gate on proof infrastructure: an SLA on a capability the build system cannot yet reliably verify is a promise without evidence backing.
4. Hosted signing or CI offers gate on both the enabling code landing and a written custody architecture, since key material staying customer-held is a design property, not a deployment detail.
5. Consulting gates on the target domain's own readiness: do not scope a port to hardware whose board rehearsal has not run.
6. Training gates only on material accuracy against current documentation.

Launch checklists operationalize these as one shared view of gates, owners, and blockers [source](https://www.jodoo.com/ai/product-launch-readiness-checklist) (jev weight 0.32, weak backing), and B2B go-to-market checklists extend the same pattern across sales and marketing prerequisites [source](https://upliftgtm.com/blog/gtm-checklist) (jev weight 0.33, weak backing).

## The gate ledger

Because gates are per-offer and evidence-shaped, they belong in a ledger alongside the pricing hypotheses: offer, gate, owner, evidence target, status, and the date status changed. An offer with an open gate can appear in collateral as a design-partner opportunity but not as a sellable SKU.
