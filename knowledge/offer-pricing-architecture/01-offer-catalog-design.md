# 01. Offer catalog design

**Scope:** how to structure an initial offer catalog for an early-stage infrastructure product across recurring and non-recurring offer types, with explicit boundaries on what not to sell.

## Why a catalog comes before pricing

An early-stage startup benefits from a deliberate, stepwise process when designing its product offering, rather than improvising offers ad hoc [source](https://www.forbes.com/councils/forbesbusinesscouncil/2022/07/29/a-10-step-guide-to-designing-the-perfect-product-offering-for-an-early-stage-startup/) (jev weight 0.74). The market context matters too: Y Combinator's directory lists 284 infrastructure startups in its funded cohort, so an infrastructure product is entering a space where buyers already see comparable offer shapes [source](https://www.ycombinator.com/companies/industry/infrastructure) (jev weight 0.63).

## The offer-type axes

A useful catalog separates offers along two axes: recurring versus non-recurring, and product versus service. Software business models commonly mix several revenue streams, including sales, subscriptions, and service revenue, rather than relying on one [source](https://www.altexsoft.com/blog/software-business-models-examples-revenue-streams-and-characteristics-for-products-services-and-platforms/) (jev weight 0.49, weak backing). Finance practice makes the same distinction sharper: SaaS companies benefit from correctly categorizing subscription, variable, services, managed services, and hardware revenue, because the categories track profitability differently and support better decisions [source](https://www.thesaascfo.com/the-saas-revenue-hierarchy-why-defining-your-revenue-streams-matter/) (jev weight 0.37, weak backing).

Applied to an infrastructure product, a catalog typically spans:

1. Recurring managed services (onboarding plus ongoing operation of a convenience layer).
2. Non-recurring hardware or bundles (device plus pre-configured components sold as a unit).
3. Recurring support contracts with response-time commitments.
4. Recurring hosted build or CI infrastructure.
5. Non-recurring project consulting and training.
6. Externally funded pilots or grants as an upside line.

## Productization as the catalog-building discipline

The strongest documented pattern for building an offer catalog out of service work is productization: converting custom engagements into repeatable, fixed-scope offers. Practitioner guides describe productization as the route to predictable revenue and scalable impact for consulting-style businesses [source](https://www.consultingsuccess.com/consultants-guide-to-productization) (jev weight 0.69). One taxonomy distinguishes three core models, starting with the one-time fixed-scope offer, before deciding which model fits the market and capacity [source](https://alexberman.com/productized-consulting) (jev weight 0.58).

A second, more advanced framing describes a four-step offer stack: productized service, tiered delivery, async fulfillment, and licensing, with margin math attached to each layer [source](https://demg.ai/blog/productize-or-die-packaging-playbook-scalable-consulting/) (jev weight 0.45, weak backing). Productized services also control scope creep, because a repeatable framework makes it easier to identify which client variations are in scope and which are not [source](https://www.melisaliberman.com/blog/productized-consulting) (jev weight 0.38, weak backing).

## Boundaries: what the catalog must exclude

A catalog for a security-sensitive infrastructure product needs explicit exclusion rules, not just inclusion rules. Two principles from the dig back this. First, pricing and packaging are distinct design activities that work best when designed together; packaging decides what is bundled into plans, and a bundling decision is also a decision about what stays outside every plan [source](https://stripe.com/resources/more/saas-pricing-and-packaging-strategy) (jev weight 0.66). Second, recurring revenue quality is the yardstick investors and operators use for B2B tech, which is why net-revenue-retention thinking pushes flexible go-to-market models and optimized pricing toward customer value rather than access gating [source](https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-net-revenue-retention-advantage-driving-success-in-b2b-tech) (jev weight 0.83).

The practical synthesis: an infrastructure product's catalog can sell convenience, hardware, response time, and labor around the core system, but every SKU should be checked against a written boundary list before it enters the catalog. Anything that gates a security fix, requires custody of customer key material, or paywalls access to the system's own interfaces fails the check and stays out, regardless of projected revenue.

## Catalog review cadence

Because an early-stage catalog is hypothesis-driven, each offer entry should carry its readiness status and its validation criterion, so the catalog doubles as a test plan. The offer-type taxonomy above maps naturally onto that: recurring offers need retention evidence, non-recurring offers need close-rate evidence, and externally funded lines need signed-contract evidence rather than target lists.
