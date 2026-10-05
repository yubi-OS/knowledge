# Allocation logic: order spend by what blocks revenue, not by category size

Scope: allocation logic for an early-stage open-source venture, ordered by revenue-blocking readiness gates rather than category-size assumptions, with cost classes (front-loaded, event-driven, triggered, minimal).

## The ordering principle

The yubiOS source framework orders budget categories by "what actually blocks the pilots and offers already drafted," not by assumed category size. Every commercial offer in its pricing architecture is gated on a specific engineering readiness gate (FIDO2 on real hardware, VM CTAP2, a specific PR, ARM64 board rehearsal). No offer sells until those close, so engineering spend there is a precondition for revenue, not a discretionary line item. This inverts the common habit of allocating percentages per category and calling it a budget.

General budgeting guidance backs the "derive spend from revenue requirements" half of this. SCORE's startup budget guidance centers on calculating the exact revenue required to cover costs, modeling how long reaching it takes, and using that number to make decisions about pricing, expenses, and growth (https://www.score.org/startup-budget-projections/, weight 0.737). Working backward from revenue obligations to spend is the same direction of reasoning as gate-based allocation: spend exists to unblock the revenue path, and anything that does not unblock it ranks lower.

## Front-loaded costs: resolve early, do not spread evenly

The source framework classifies legal work (naming and trademark, entity formation) as front-loaded: a high-severity unresolved trademark question blocks brand commitments, and the entity decision blocks signing any real contract. These are one-time, specialized costs to resolve early, not a steady monthly line.

Lean product development practice independently supports front-loading as a discipline. The Lean Enterprise Institute's front-loading cost analysis argues that design change costs increase exponentially as the launch date approaches, and that front-loading emphasizes clearly defining requirements and specifications early in development (https://www.lean.org/the-lean-post/articles/front-loading-cost-analysis/, weight 0.599). The mechanism transfers directly: the cost of fixing a naming, entity, or trust-chain decision rises the closer the venture gets to signing revenue-bearing contracts, so the rational allocation front-loads that spend even though it produces no revenue by itself.

## Event-driven and triggered costs

The source framework distinguishes two cost classes that a calendar-based budget cannot represent:

- **Event-driven spend**: customer and pilot work scales with paid pilots actually landing, tracked by a "paid pilot count and outcome" metric, rather than assuming a fixed headcount from day 1.
- **Gate-triggered spend**: support cost only becomes real when the support-and-SLA offer actually sells, which itself is gated on a specific engineering readiness gate closing. The budget line activates on the gate, not on the month.

This is a meaningful structural property: triggered cost classes cannot be misallocated before their triggers fire because they do not exist as spend yet. A budget that pre-allocates support headcount in month 1 spends against a condition that has not occurred.

## Minimal-by-design categories

The framework ranks operations lowest and argues operations overhead should stay minimal by design, not merely by budget constraint, consistent with a stated "no OEM, no enterprise tooling dependency" ethos at single-founder scale. Community work ranks low and mostly non-monetary: the relevant commitments (public trust chain, coordinated disclosure) are process commitments rather than headcount, and their cost is closer to time than to dollars.

## A worked priority ordering

Applying the logic, the source framework's relative priorities run:

1. **Engineering (trust-chain work), highest**: every revenue offer is gated on named readiness gates; spend here is the precondition for revenue.
2. **Legal (naming, trademark, entity), high and front-loaded**: high-severity open questions that block signing real contracts; resolve early, not evenly.
3. **Customer and pilot work, medium and event-driven**: scales with paid pilots landing.
4. **Support, low initially and triggered**: activates when the SLA offer sells.
5. **Community, low and mostly non-monetary**: process commitments, not headcount.
6. **Operations, lowest**: minimal by design.

## Weak-backing context

Stage-based budget-template material makes the same "allocate by stage and constraint, not by habit" point with weaker authority: a stage-indexed budget template directory (https://knowledgelib.io/finance/startup-finance/startup-budget-template-by-stage, weight 0.147), a SaaS budget-allocation guide (https://www.saaspricelab.com/startup-financial-tools/budget-allocation, weight 0.145), and practitioner advice threads on prioritizing resources (https://www.linkedin.com/advice/1/how-do-you-prioritize-allocate-your-resources, weight 0.056). These are labeled weak backing; none of the load-bearing claims above rest on them.

## Takeaway

Allocation is an ordering problem before it is a sizing problem. Rank spend by what blocks revenue, classify each block as front-loaded, event-driven, triggered, or minimal-by-design, and apply real weights only when the envelope exists (see the envelope-discipline doc).
