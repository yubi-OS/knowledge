# Refresh cadence and source aging

Scope: per benchmark refresh cadence (annual light check versus before every citation), retrieval dating discipline, sources needing refresh or replacement, and weakest source handling for vendor forecasts.

## Why cadence differs by source type

The register does not use one refresh rule for all benchmarks because the sources age at different rates. Three source classes drive three cadences:

1. Annual report series (IBM Cost of a Data Breach): refresh when the next edition appears. This has already been triggered; a 2026 edition exists and supersedes the 2025 citation (https://www.ibm.com/reports/data-breach, weight 0.6584, primary). See 02-breach-cost-benchmarks.md.
2. Live checkable numbers (retail price): check before every use, because a price can change without notice and the check takes minutes. See 05-hardware-cost-validation.md.
3. Multi year vendor forecasts (market sizing, market share): a light annual check is the minimum, but the underlying uncertainty is vendor to vendor variance, which does not resolve with a refresh. See 03-security-key-market-sizing.md.

## What the sources say about staleness

Practitioner and vendor material on benchmark freshness exists and makes the register's instinct explicit, though nearly all of it scores below the 0.5 authoritative threshold and is labeled weak:

- A vendor benchmarking blog argues that any benchmarking provider that does not disclose the vintage of their data is either hiding it or does not have it (https://vendorbenchmark.com/blog/benchmark-data-freshness-update-frequency, weakly backed, weight 0.2222).
- A second piece from the same source argues that a benchmark measured by volume rewards hoarding old data and reports the market of years past with unwarranted confidence (https://vendorbenchmark.com/blog-next/benchmark-freshness, weakly backed, weight 0.1392).
- A market intelligence report observes that most market intelligence still ships on an annual or biannual cycle, the same cadence as the planning it is meant to inform, meaning it can be stale before it is used (https://hginsights.com/wp-content/uploads/2026/09/HG-Insights-Insight-Report_-How-Often-Should-Marke, weakly backed, weight 0.2421; landing page https://hginsights.com/resource/insight-reports/how-often-should-market-intelligence-actually-refresh, weakly backed, weight 0.2972).
- A data freshness primer from IBM defines freshness as the frequency with which data is updated and how accurately it reflects the real world state it describes (https://www.ibm.com/think/topics/data-freshness, weight 0.8093, primary for its own topic). This is the one above threshold source in the subtopic and it supports the general definition, not any register specific cadence.
- Content freshness analysis for AI mediated retrieval argues staleness thresholds matter because automated answer engines cite stale material (https://leadsnow.ai/how-often-update-content-ai-search-freshness/, weakly backed, weight 0.2591).

The one above threshold non IBM source in this area is a formal records retention schedule in US federal regulation, which specifies fixed retention periods for designated records (https://www.ecfr.gov/current/title-49/subtitle-B/chapter-X/subchapter-C/part-1220/section-1220.6, weight 0.9132, primary for its own subject). It is cited here only as evidence that formal, explicit retention and refresh schedules are an established practice in regulated recordkeeping, not as a source for any benchmark cadence.

## Retrieval dating discipline

Every register citation carries a retrieval date. Without it, a refresh cannot even determine what it is refreshing. A publishing style rule makes the same point: a retrieval date belongs when the content is designed to change over time (https://www.perrla.com/post/apa-obscura-when-to-include-a-retrieval-date-in-an-apa-7th-edition-reference, weakly backed, weight 0.3527). The register's two passes, 2026-07-25 and 2026-07-26, are themselves the demonstration: the second pass re-validated the first pass's numbers and found them unchanged, which is exactly what a dated citation makes possible.

## Sources needing refresh or replacement

The register's standing list, updated by this pass:

- Benchmarks 2 and 3 (market size, Yubico share): weakest sourced claims in the register, entirely commercial vendor reports with no disclosed methodology. Rule: never cite a single vendor number without the range caveat. This mint's dig confirmed the vendor to vendor spread is wider than 2x on 2025 values.
- Benchmark 1 (breach cost): refresh triggered, 2026 edition available. Re-point external facing citations before next use.
- Benchmark 4 (YubiKey price): live checkable; no refresh needed in advance, but the 25 dollar worksheet floor flag is overdue for owner resolution after two agreeing passes.
- Benchmark 5 (regulatory): check revision currency before any external use; the withdrawn 2020 edition of SP 800-63B is proof that even standards bodies retire documents.

## The open cadence question

The register leaves one question open deliberately: whether forecast benchmark cadence should tighten from annual light check to before every external facing citation. This pass strengthens the case for tightening, because the vendor forecasts moved between report generations while the spread stayed wide. The decision belongs to the register owner, not to this corpus.
