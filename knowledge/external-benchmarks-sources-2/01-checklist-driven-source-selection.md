# Checklist driven source selection

Scope: the OMN-80 five item checklist workflow for external benchmark sources: accuracy and relevance review, directional versus self evidence separation, explicit validation notes, refresh tracking, and a reusable citation register as a repeatable method.

## The method

The refreshed external benchmarks register treats source selection as a checklist discipline rather than an ad hoc judgment. Each external source that enters the register passes through five gates, in fixed order: review for accuracy and current relevance; separate directional benchmarks from evidence about the product itself; validate the specific claims the source supports; note which sources need refresh or replacement; and file everything into a reusable citation and benchmark list. The checklist exists so that no downstream business document has to invent or half remember a statistic: the number, its source, its retrieval date, and its allowed use are looked up, not guessed.

This pattern is not unique to the register. Independent writing on citation practice converges on the same gates, though the sources below are practitioner blog material and all carry weak weights, below the 0.5 authoritative threshold. A citation hygiene guide describes the discipline as "choosing, scoring, and disclosing sources so claims are verifiable by both readers and AI engines", with a stated preference for primary sources over aggregators (https://geodocs.dev/reference/citation-hygiene-source-selection-rules, weakly backed, weight 0.1136). A reference quality checklist organizes pre publication checks around recency, relevance, and citation hygiene, which maps directly onto the register's accuracy and relevance gate and its refresh gate (https://thenjms.com/articles/reference-quality-checklist-recency-relevance-and-citation-hygiene.html, weakly backed, weight 0.2443). A general citation checklist similarly walks each item to catch claim to source misalignment before use (https://vishwajeet.org/citation-accuracy-checklist/, weakly backed, weight 0.3235).

## Gate 1: accuracy and current relevance

Every benchmark section in the register names a specific source, a retrieval date, and a one line validation note. The retrieval date matters because a statistic without one cannot be refreshed or rechecked. Style guidance on retrieval dating makes the same point from the publishing side: a retrieval date is included when the referenced content is designed to change over time, which describes market statistics and retail prices exactly (https://www.perrla.com/post/apa-obscura-when-to-include-a-retrieval-date-in-an-apa-7th-edition-reference, weakly backed, weight 0.3527). The register applies this by dating every citation to the pass that found it, for example 2026-07-26 for the current pass.

## Gate 2: directional versus self evidence

Every benchmark in the register carries a paired "What it supports" and "Do not use for" statement. The pair exists because third party figures are evidence about an industry, not evidence about the project citing them. Where the product has zero customers, any market share or revenue claim imported from a benchmark is a misuse by construction. This gate is covered in depth in the claim boundaries doc (07-claim-boundaries.md).

## Gate 3: validate the claims

Validation means checking the specific number against its primary source where one exists, and flagging rather than silently correcting when reconciliation fails. The register carries a live example: a worksheet used a 25 dollar hardware cost floor that could not be reconciled against official retail pricing in two consecutive passes, so the flag was carried to the worksheet owner instead of the number being quietly overwritten. That example is detailed in the hardware cost validation doc (05-hardware-cost-validation.md).

## Gate 4: refresh tracking

Each benchmark carries its own refresh cadence, chosen by source type: annual for an annual report series, before every pricing conversation for a live retail price, and a deliberate extra margin of caution for vendor forecasts whose uncertainty does not resolve with a refresh. See the refresh cadence doc (08-refresh-cadence-and-source-aging.md).

## Gate 5: reusable register

The output of the first four gates is a table with one row per benchmark: the claim, the source, the use for column, and the do not use for column. The register pattern is that the table, not any single document, is the reusable artifact: downstream docs cite table rows. Practitioner templates for source tracking converge on the same shape, recording source name, date, and the intended use alongside each citation (https://libguides.sccsc.edu/organizeresearch/table, weakly backed, weight 0.2950). The register structure and its downstream consumers are detailed in the citation register doc (09-citation-register-dependencies.md).

## Honest limits of this doc

The checklist itself is the register's own method, documented in its source doc rather than derived from outside literature. The external parallels cited here are practitioner blog and template pages; every one scored below the 0.5 authoritative weight threshold in this pass, so they are weak backing and are labeled as such. They show the checklist pattern is common practice, not that any specific implementation is validated. No claim in this doc should be read as an endorsement from an academic or standards body.
