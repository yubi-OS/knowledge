# 07. Revenue prioritization

**Scope:** sequencing offers by dependency on nearly-ready work versus hypothesized revenue size, and the commitment risk of recurring versus project revenue.

## Prioritize by readiness dependency, not by dreamed size

An early-stage offer catalog looks most attractive ordered by imagined revenue, but the ordering that actually governs execution is dependency on work that is already close to done. Product prioritization frameworks exist precisely to make such ordering explicit rather than intuitive; Atlassian's overview of prioritization frameworks frames the choice of framework as a way to improve the product development process [source](https://www.atlassian.com/agile/product-management/prioritization-framework) (jev weight 0.41, weak backing). SaaS revenue-mix guidance applies the same machinery one level up: RICE-style scoring (Reach, Impact, Confidence, Effort) is used when evaluating potential new revenue streams [source](https://www.getmonetizely.com/articles/revenue-mix-optimization-balancing-different-revenue-streams-for-saas-success) (jev weight 0.31, weak backing).

Applied to an offer catalog, the prioritization key becomes: gate distance first, commitment risk second, hypothesized size last. An offer one validation run away from sellable ranks above a larger offer with no recovery path, regardless of the size guesses.

## Commitment risk: recurring versus project

Two structural properties separate the offer types:

1. Recurring offers (managed services, support contracts, hosted infrastructure) create delivery obligations that persist. Signing them before the readiness gates close converts a revenue line into a liability.
2. Non-recurring project offers (consulting, training) are bounded: they end, they fund other work, and they carry the lowest commitment risk while other gates are still open.

The service-to-product literature supports starting with the low-commitment lines. Service-led growth is described as funding a product startup with customer revenue to avoid early dilution, with a planned pivot from services to scalable products [source](https://1m1m.sramanamitra.com/virtual-accelerator/courses/bootstrapping/service-led-growth-services-to-product/) (jev weight 0.35, weak backing). Bootstrapping guides describe the same arc from services revenue toward scalable products [source](https://www.skmurphy.com/blog/2026/02/18/bootstrapping-your-way-from-services-to-scalable-products/) (jev weight 0.22, weak backing). Transition essays note the motivation pattern: consulting work sustains a livelihood and builds starting capital while the product matures [source](https://www.startupgrind.com/blog/how-to-successfully-transition-from-consulting-to-products/) (jev weight 0.31, weak backing).

Productization is the bridge in that arc: converting custom engagements into productized services is described as the route to predictable revenue and scalable impact [source](https://www.consultingsuccess.com/consultants-guide-to-productization) (jev weight 0.44, weak backing), and productizing matters for the operating role too, since moving from consulting into a startup means leaving an advisory role that produces recommendations for an operating role that owns results [source](https://www.hackingthecaseinterview.com/pages/consulting-to-startup) (jev weight 0.51).

## A concrete ordering rule

Given a catalog with readiness gates attached (owner, evidence target, recovery plan), the ordering rule is:

1. Rank by gate distance: an offer whose gate evidence exists or is in flight ranks first.
2. Within equal gate distance, rank by commitment risk: non-recurring before recurring, because a recurring promise made early is the harder one to keep.
3. Treat externally funded lines as upside, not plan: grant and pilot timelines sit outside the company's control, so they rank last in the near-term revenue model.
4. Re-rank after every gate event. A closed gate moves the offer up; a failed validation moves it down or out.

Financial-model guidance for multi-stream startups makes the same point structurally: identify the primary revenue stream first, then secondary and tertiary streams, and balance them without losing focus [source](https://fastercapital.com/content/Unlocking-Multiple-Revenue-Streams-in-Startup-Financial-Models.html) (jev weight 0.41, weak backing).

## What prioritization is not

Revenue prioritization is not a forecast. Every entry in the ordering carries an unvalidated price hypothesis and an open or closed readiness gate; the ordering says which experiment to run next, not how much money arrives. Treating the ordering as a projection is the failure mode that hypothesis discipline (doc 04) exists to prevent.
