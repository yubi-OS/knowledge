# 09 - Building the reusable citation list and dependency map

Scope: building the reusable citation and benchmark table plus dependency map that lets future business docs cite instead of inventing numbers.

## The table is the deliverable

The reference corpus's terminal artifact is a table with one row per benchmark and four columns: the benchmark itself, its source, what it is used for, and what it must not be used for. Each row is a bounded claim package. The four-column shape matters more than any single row: a citation list that only records numbers is a quote bank; a citation list that records use-for and do-not-use-for boundaries is a policy artifact that survives handoff between document authors.

Each row should also carry, per the pattern established in this corpus: source URL, retrieval date, jev weight, refresh trigger, and any staleness flags. The weight column is what turns the table from prose into evidence: a reader can see at a glance that the regulatory-guidance rows carry weights above 0.74 while the market-sizing rows carry weights at or below 0.05, and calibrate their confidence accordingly.

## The dependency map prevents orphaned citations

A benchmark list only prevents invented numbers if business documents actually draw from it. The reference doc records its dependencies explicitly: it feeds the offer and pricing document and the customer ROI model with citable external numbers instead of invented ones, feeds the public-security funding targets document with the regulatory-tailwind benchmark, and flags a reconciliation item for the pilot-collateral document on the hardware cost floor. This is a dependency map in miniature: every downstream document that consumes a benchmark is named, so a refresh of a benchmark row (doc 07's cadences) triggers a known set of downstream updates instead of leaving stale numbers scattered.

The inverse failure is the orphaned citation: a number quoted in a business document with no row in the benchmark list. That is how invented and half-remembered statistics enter, which is exactly what the reference doc's purpose statement targets. The rule is bidirectional: no benchmark without a consumer record, no cited number without a row.

## Verification as a standing practice

Citation lists decay in a specific way: sources move, editions supersede, and the reachability of cited URLs changes. Independent work on citation integrity treats this as a measurable property: citation-integrity benchmarks check whether cited sources exist, are reachable, and actually support the claims made about them (https://github.com/yenk/dali-citation-benchmark, weight 0.52). The same three checks are the natural verification pass for a benchmark table: every URL resolves, every edition is current per doc 07's cadences, and every row's use-for column still matches the sentences citing it.

The distinction between citation and substantiation is the discipline the table encodes. Practitioner guidance aimed at regulated marketing content argues that citing a source is not the same as substantiating the claim built on it, and that evidence dossiers which conflate the two fail under scrutiny (https://veritypress.ai/blog/substantiation-vs-citation-evidence-dossier-ai-marketing-claims-regulatory-scrutiny-2026-09-07, weight 0.08, weak backing). In this corpus's terms: the substantiation is the boundary table plus the weight plus the retrieval date; the citation alone is one URL among four required fields.

## How this corpus implements the pattern

The knowledge corpus itself is the worked example: the research-db holds preflight, outline, per-doc dig records, a weighted archive of 108 results, and a jev log; each doc cites archive entries with weights inline; the README aggregates per-doc source counts and gaps. A future author picking up any document in this corpus can trace every factual claim to a weighted, dated, classified source in one hop. That traceability, not the specific numbers, is the reusable asset the benchmark-list pattern produces.

## Sources considered

| Source | URL | Weight |
|---|---|---|
| Dali Citation Integrity Benchmark (GitHub) | https://github.com/yenk/dali-citation-benchmark | 0.52 |
| Research Catalogue Extended Guide | https://guide.researchcatalogue.net/ | 0.49 (weak) |
| AI citation benchmark (Visa Atlas) | https://visaatlas.org/citation-benchmark | 0.27 (weak) |
| Product claims data platform (Provenance) | https://www.provenance.org/retailers | 0.27 (weak) |
| Provenance Framework | https://legacy.provenance.org/framework | 0.27 (weak) |
| Provenance platform | https://www.provenance.org/ | 0.21 (weak) |
| Counterfeit consumer goods (Wikipedia) | https://en.wikipedia.org/wiki/Counterfeit_consumer_goods | 0.29 (weak) |
| Ohio JFS landing page (off-topic) | https://thesource.jfs.ohio.gov/ | 0.37 (weak) |
| Substantiation vs citation (veritypress) | https://veritypress.ai/blog/substantiation-vs-citation-evidence-dossier-ai-marketing-claims-regulatory-scrutiny-2026-09-07 | 0.08 (weak) |
| How to build an AI citation benchmark (aivisibilitystudio) | https://aivisibilitystudio.com/blog/how-to-build-an-ai-citation-benchmark-prompts-competitors-and-a-weekly-measurement-you-can-abd025b1a530 | 0.10 (weak) |
| AI video provenance (SHAR Production) | https://sharprod.com/en/journal/research-content-provenance.html | 0.15 (weak) |
| Bentley Motors (off-topic) | https://www.bentleymotors.com/en.html | 0.07 (weak) |
