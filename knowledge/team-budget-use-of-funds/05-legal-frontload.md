# Legal front-loading: trademark and entity as pre-revenue blockers

Scope: why trademark clearance and entity formation are front-loaded, one-time costs that gate signing any revenue-bearing contract, and the OSS-specific naming risk that makes them urgent.

## Why legal ranks second in the allocation despite producing no revenue

The yubiOS source framework ranks legal second only to engineering, but classifies it differently: engineering spend is highest priority continuously, while legal spend is front-loaded. Two open questions drive it:

1. **The naming and trademark question.** The project's naming and licensing risk register flags the "yubiOS" name's collision with Yubico's trademarks as high-severity and unresolved. Continuing to build brand and community on a name with an unresolved high-severity trademark risk compounds the eventual cost of changing it.
2. **The entity decision.** No legal entity means no contract can be signed: the support and SLA offer, consulting offers, and paid pilots all require a counterparty. Until the entity exists, every revenue offer is structurally blocked, which is why the framework treats entity formation as a precondition for revenue rather than an administrative errand.

Both are one-time, specialized problems. That combination (high severity, one-time, blocks revenue) is exactly the profile the framework assigns front-loaded spend: resolve early, do not spread evenly across the year.

## Open-source naming risk is a recognized maintenance discipline

Open-source infrastructure guidance treats naming and trademark as first-class maintainer concerns, not afterthoughts:

- FOSShub's trademark management guidance defines the practice as "protecting the project's name, logo, and identity while still allowing users to exercise the rights granted by the software license" (https://www.fosshub.com/resources/maintainers/trademarks/, weight 0.676). The tension it names is real for an OSS venture: copyright licenses grant code freedom; they do not grant the name, and third parties can fork the code while the trademark stays with the project.
- FOSShub's project-naming guidance recommends evaluating a name on search distinctiveness, repository and package availability, pronunciation, scope, and trademark risk before committing (https://www.fosshub.com/resources/maintainers/project-naming/, weight 0.609). Trademark risk sits in the checklist as a pre-commitment gate, which is precisely the front-loaded position the yubiOS framework gives it: the cost of discovering the collision after the brand has accumulated recognition is much higher than discovering it at naming time.

## Weak-backing practitioner context

Startup legal-checklist material consistently puts entity formation and trademark clearance in the earliest tranche of legal work, though with sub-0.5 source weights in this corpus:

- A startup legal checklist covering entity structure and trademark basics (https://promise.legal/resources/startup-legal-checklist, weight 0.315) and a similar free legal checklist (https://talkingtree.app/freelegalguide/startup-legal-checklist/, weight 0.179).
- General-counsel guidance on the first legal priorities when founding (https://www.intelligenthq.com/6-legal-priorities-when-founding-a-startup/, weight 0.181) and a startup legal essentials page (https://www.summitgeneralcounsel.com/startup-legal/, weight 0.357).
- Trademark fundamentals from a casebook reference (https://google.github.io/opencasebook/trademarks/, weight 0.333).

These agree with the front-loading logic but none is authoritative enough in this corpus to carry a load-bearing claim; they are labeled weak.

## The sequencing consequence for budget and hiring

Front-loaded legal spend has two downstream consequences in the framework:

1. **The first hire is a contractor, not an employee.** The hiring order puts legal counsel first, engaged as a contractor because the work is episodic (see the contractor-vs-hire doc). The legal line item is therefore a scoped engagement budgeted early, not a headcount line.
2. **The legal engagement is budgeted before the envelope.** Because the entity and trademark questions block signing any real contract, the framework treats them as spend-now items even while the overall envelope remains unwritten. This is the allocation-logic doc's front-loaded cost class in action: the cost class is decidable without knowing the total.

## The asymmetry argument

The reason front-loading beats even-spreading is asymmetric cost: early, the fix is a naming decision and a filing; late, the fix is renaming a project with accumulated brand equity, migrating community infrastructure, re-issuing signed artifacts under a new identity, and unpicking contracts signed by a personal name instead of an entity. The Lean cost-analysis principle that change costs grow with schedule proximity (https://www.lean.org/the-lean-post/articles/front-loading-cost-analysis/, weight 0.599) applies to legal decisions with the same force as to product design.

## Takeaway

Treat trademark clearance and entity formation as revenue preconditions, budget them front-loaded (scoped counsel engagement, resolved early), and evaluate any project name against trademark risk before brand equity accumulates. The unresolved high-severity naming question in the source venture is the live example: it is cheap now or expensive later, and the framework chooses now.
