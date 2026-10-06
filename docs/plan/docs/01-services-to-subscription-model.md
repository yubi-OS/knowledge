# 01 - Services to subscription operating model

Scope: the executive decision at the head of the yubiOS planning document: operate yubiOS as a public-first cybersecurity project wrapped in a capital-light commercial company that sells accountable operations, and convert paid design work into an annual per-node assurance subscription.

## The executive decision

The source doc (yubi-OS/yubiOS docs/PLAN.md, status "proposed operating model", as of 2026-07-17, planning horizon three years after the first supported release) opens with a single executive decision: yubiOS should be operated as a public-first cybersecurity project with a capital-light commercial company around it. The company sells accountable operations - supported releases, fleet assurance, integration, recovery, evidence, and response - not access to the security-critical source code (source doc).

The recommended model is named services-to-subscription, and the source doc breaks it into five moves (source doc):

1. Keep the operating system, security fixes, build metadata, SBOMs, provenance, threat model, and self-service path public.
2. Use paid, fixed-scope design partnerships to fund the remaining proof work and learn what enterprise buyers will actually pay for.
3. Convert repeatable work into an annual per-node assurance subscription, with an optional managed fleet service.
4. Add hardware enablement, training, and grants as secondary revenue streams.
5. Delay any production-readiness claim or production SLA until the engineering and support gates in the plan are met.

The doc argues this fits the mission: an individual can retain owner control without a vendor relationship, while an enterprise can pay for a named party to operate the release, support, evidence, and recovery process (source doc).

## What the model is worth on paper

The base-case planning model reaches approximately $350,000, $1.2 million, and $3.55 million of recognized revenue in years 1 through 3, with operating break-even during year 3. The source doc stamps these figures as illustrative scaffolding, not validated forecasts, and points at refs/three-year-revenue-cost-model-2026-07-25.md (OMN-77) for the grounding check (source doc). Doc 07 of this corpus carries the full table and its caveat.

## How the model reads against the wider commercial open source landscape

The dig for this subtopic asked how open source companies structure paid offerings and how services convert into recurring revenue. Findings, with jev noul weights:

- Enterprise editions sold on top of a free core are an established monetization pattern: OpenProject documents an enterprise edition layered over its open source project, marketed on compliance, security, and premium support features (https://www.openproject.org/enterprise-edition/, noul 0.64). yubiOS's assurance subscription plays the same role: paid operation around a public core, not a paid gate in front of it (source doc for the yubiOS half).
- The canonical taxonomy of open source business models is described in Wikipedia's business models for open source software article (https://en.wikipedia.org/wiki/Business_models_for_open-source_software, noul 0.45, weak backing) and its open-core model article (https://en.wikipedia.org/wiki/Open-core_model, noul 0.41, weak backing). The source doc's model sits deliberately in the services-plus-subscription family rather than open-core dual licensing; doc 09 records the doc's explicit rejection of broad contributor copyright assignment dual licensing.
- Productized lifecycle support is a recognizable enterprise buy: Esri publishes a formal enterprise lifecycle page with version support windows and end-of-support dates (https://support.esri.com/en-us/products/arcgis-enterprise/life-cycle, noul 0.90), which is the shape of the "supported releases and lifecycle" accountability the source doc says the paid operator supplies (source doc for the yubiOS commitment).
- The distinction between one-time services revenue and recurring subscription revenue is standard SaaS practice (https://www.thesaasfo.com/the-saas-revenue-hierarchy-why-defining-your-revenue-streams-matters, noul 0.30, weak backing). The source doc's own unit-economic goals make the same point internally: services must fall below 35 percent of total revenue by year 3 so the company does not become a permanent services shop (source doc).

## Dig quality note

The first dig attempt for this subtopic returned mostly unrelated or off-topic results; a redo with different queries (attempt 2) recovered the enterprise-edition and lifecycle references above. Even after the redo, most weighted sources are below the 0.5 authoritative threshold, so the load-bearing record for this subtopic is the source doc itself, and the dig material is context only. That matches the doc's own status line: the operating model is proposed, not yet proven by revenue (source doc).

## Revenue priority implied by the model

The source doc ranks revenue streams in priority order: 1) annual assurance subscriptions, 2) fixed-scope implementation and board enablement that can become reusable product capability, 3) managed fleet operations, 4) training and recovery exercises, 5) grants and sponsorships for explicitly public work. Grants are useful but must not be treated as recurring customer revenue, and sponsorship must never buy undisclosed roadmap control, favorable vulnerability handling, or an endorsement (source doc).

## Sources

- Primary: yubi-OS/yubiOS docs/PLAN.md (source doc), sections "Executive decision" and "4. Offer and pricing architecture" (revenue priority).
- https://www.openproject.org/enterprise-edition/ (noul 0.64)
- https://support.esri.com/en-us/products/arcgis-enterprise/life-cycle (noul 0.90)
- https://www.thesaasfo.com/the-saas-revenue-hierarchy-why-defining-your-revenue-streams-matters (noul 0.30, weak)
- https://en.wikipedia.org/wiki/Business_models_for_open-source_software (noul 0.45, weak)
- https://en.wikipedia.org/wiki/Open-core_model (noul 0.41, weak)
