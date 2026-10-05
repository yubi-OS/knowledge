# Business-health metrics tied to an offer catalog

**Scope:** Business-health metrics tied to an offer catalog: readiness-gate-to-offer ratio, paid-pilot count and outcome, SLA adherence, funding secured versus targeted.

## The prerequisite

Business-health metrics mean nothing without something to sell. When the offers are still a catalog on paper (a pricing document with, say, 7 offers, each carrying a stated readiness gate), the business metrics that matter are the ones that track whether the catalog is becoming real. This doc defines those metrics in the state where nothing has sold yet, so every row is a "start tracking when" definition rather than a performance report.

## One metric that matters, per offer stage

Lean Analytics argues that at any given stage of a startup, one metric best captures whether the current bet is working, and the whole team should focus on moving it: the One Metric That Matters (https://www.startupkit.pro/frameworks/lean-analytics, weight 0.64, authoritative; framework described at https://leananalyticsbook.com/, weight 0.87, authoritative). Applied to an offer catalog, this collapses the tracking problem: per offer, name the single metric that decides whether the offer advances, and ignore the rest until the stage changes. For an unsold offer, that metric is almost always pilot outcome, not traffic or interest.

## Readiness-gate-to-offer ratio

Definition: of the offers in the catalog, how many have their stated readiness gate actually closed. Decision it drives: whether revenue priority needs re-ordering. An offer whose gate closes early should move up the priority list rather than wait for its originally-assigned slot. This metric requires only that gates were written down when the catalog was drafted, which is a documentation discipline, not an instrumentation project.

## Paid-pilot count and outcome

Definition: number of paid pilots run per offer, and whether each validated or invalidated the pricing hypothesis. Decision it drives: whether to commit a real price point or keep iterating. The paid structure is the mechanism: a weakly-backed practitioner guide argues for running a paid pilot specifically to prove B2B willingness to pay before building the full product, instead of the free-trial trap (https://startupcorners.com/blog/how-to-run-a-paid-pilot-to-validate-b2b-willingness-to-pay, weight 0.31, weak backing). Pricing-experiment literature converges on the same core: willingness to pay is discovered through structured experiments with real customers, not set by judgment alone (https://knowledgelib.io/business/customer-validation/willingness-to-pay-validation/2026, weight 0.16, weak backing).

Tracking shape per pilot: offer, pilot start date, price tested, outcome (validated or invalidated), and the one sentence of evidence. Five pilots across three offers is a dataset; a quarterly "we think the price is about right" is not.

## Support and SLA adherence

Definition: for the support-contract offer, whether response-time and resolution-time commitments are actually met. Multiple independent service-management sources define the same two core metrics: response time (time to acknowledge or first respond) versus resolution time (time to fix), tracked against the committed targets (https://www.serval.com/blog/sla-time-explained, weight 0.40, weak backing; https://www.freshworks.com/itsm/sla/metrics/, weight 0.39, weak backing; https://www.sirion.ai/library/contract-management/sla-compliance/, weight 0.34, weak backing). The convergence of several weak sources on identical definitions raises confidence in the definitions themselves even though no single source is authoritative here. Decision it drives: whether the SLA tier needs re-pricing or the support process needs more capacity before selling more of that tier.

The tracking discipline, before any tooling: a log with one row per incident (received time, first response time, resolution time, tier commitment met or breached). A support log in a text file outperforms a dashboard that does not exist.

## Funding secured versus targeted

Definition: funding actually secured against the target list of grant and pilot-funding programs. Decision it drives: whether public-security funding is a real revenue line or should be deprioritized in favor of offers with faster signal. The funding-sustainability literature supports treating funding pipelines as measured bets rather than hopes: the open-source sustainability field catalogs funding models (sponsorships, grants, paid support, fiscal hosts, open core, services) as alternatives with different signal speeds (https://www.fosshub.com/resources/sustainability/funding-models/, weight 0.19, weak backing). A grant pipeline with a 6 to 12 month decision cycle delivers slower signal than paid pilots, which is exactly the trade the secured-versus-targeted ratio makes visible.

## What not to track yet

Any actual revenue figure, customer count, or margin is not measurable until a first sale closes; defining the tracking structure now and leaving the values blank is the honest state. This mirrors the not-yet-measurable pattern used for public metrics: name the metric, state that no mechanism has produced a number, and start the log the day the first pilot or sale happens.
