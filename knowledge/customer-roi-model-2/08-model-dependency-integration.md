# Model Dependency Integration

Scope: how the refreshed model positions itself against the artifacts it extends and feeds: the OMN-84 worksheet, the OMN-67 days 61-90 readout, the OMN-77 company financial model, and the OMN-80 benchmark source list.

## The dependency map

The refreshed model declares four relationships (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md). It extends the OMN-84 pilot collateral ROI baseline worksheet (PR #113) rather than redefining its line items; it feeds the OMN-67 days 61-90 willingness-to-pay test (PR #111), which uses the formula and claim boundaries for the confidential ROI readout and any bounded public case study; it stays scoped to the per-customer pilot calculation and does not duplicate OMN-77's company-level three-year revenue and cost model; and it pairs with the refreshed OMN-80 external benchmarks source list so directional benchmarks are cited from one place rather than re-derived per sales conversation.

## Extend, not redefine

The extend-not-redefine rule keeps the worksheet as the single definition of the five line items. Standard ROI references anchor the shared vocabulary: Investopedia's guide to calculating ROI (https://www.investopedia.com/articles/basics/10/guide-to-calculating-roi.asp, jev weight 0.83, authoritative) and its return-on-investment term page (https://www.investopedia.com/terms/r/returnoninvestment.asp, jev weight 0.80, authoritative). Because both the worksheet and the refreshed model use that ordinary definition, the extension adds rules and sourcing rather than a competing formula. The alternative, redefining line items in each new doc, is how business-case documents drift: template ecosystems for business cases are plentiful and inconsistent (https://lecoursgratuit.com/business-case-template/, jev weight 0.33, weak backing; https://fynk.com/en/tools/business-case/, jev weight 0.29, weak backing; https://businesscasez.com/, jev weight 0.19, weak backing; https://pmtoolkit.ai/calculators/business-case, jev weight 0.18, weak backing), and each template carries its own assumptions.

## One place for benchmarks

The OMN-80 pairing applies the single-source-of-truth pattern to benchmark citations. The pattern is standard data practice: unify business data so decisions are trusted rather than re-derived per conversation (https://www.thoughtspot.com/data-trends/best-practices/single-source-of-truth, jev weight 0.36, weak backing). It also matches how benchmark citations should be treated: guidance on data benchmarks distinguishes tiers of benchmark quality and marks generic benchmarks as directional (https://www.seedli.ai/playbooks/data-benchmarks, jev weight 0.11, weak backing), and marketing data guidance carries the same warning that long-standing benchmarks should be treated as directional (https://leadscale.com/insights/demand-generation/system-foundations/data-truth-crm-hygiene/, jev weight 0.42, weak backing). Public benchmark suites model the destination state: TechEmpower maintains a public benchmark page that serves as the single reference point for its domain (https://www.techempower.com/benchmarks/, jev weight 0.69, authoritative). The refreshed model routes its four directional benchmarks (cost of breach, market growth, hardware cost floor, regulatory tailwind) through one refs doc for the same reason.

## Feed, not fork, the readout

OMN-67's days 61-90 plan consumes this model's formula and claim boundaries when producing the confidential ROI readout. The relationship is one-directional by design: the readout applies the model, and any correction discovered during a readout flows back into a model revision, not into an ad hoc variant of the arithmetic inside the readout. This is the dependency that the missing-baseline-is-a-finding rule and the invalidation rule are built for: the readout inherits them rather than re-deciding them.

## Scope boundary against OMN-77

OMN-77's three-year revenue and cost model operates at the company level; the ROI model operates at the per-customer pilot level. The refreshed model states explicitly that it does not duplicate OMN-77's financials (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md). The practical test: a number that describes yubiOS the company belongs in OMN-77; a number that describes one customer's baseline minus pilot measurement belongs here. Keeping the two scopes apart is what allows the pilot model to be handed to a prospect without exposing company financials.

## Open integration questions from the refresh

The refresh leaves two integration questions open: whether the per-customer confidentiality boundary should be promoted into a separate pilot-data-confidentiality-boundary refs doc (worth doing once a second pilot lands), and whether to build the clearly-labeled illustrative walkthrough as a separate artifact for sales conversations (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md). Both are consolidation moves that depend on the second pilot existing, which is why the refresh deferred them.
