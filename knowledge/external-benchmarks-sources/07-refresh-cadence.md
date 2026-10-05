# 07 - Refresh cadence and staleness management

Scope: refresh cadence and staleness management for cited external sources: annual reports, live retail prices, and periodically revised government guidance.

## Three refresh clocks, one document

Every benchmark in the reference corpus carries its own refresh clock, and the clocks differ by source class. A single document-level "check for staleness" habit fails because it misses the per-source differences. The reference doc records three distinct cadences:

1. Annual-report cadence (IBM Cost of a Data Breach): the report is published annually around mid-year, and the reference doc directs a refresh when the next edition is released. As documented in doc 02, the 2026 edition is now live, which is exactly the case this cadence exists to catch: a document citing the 2025 edition's $4.8M phishing figure must either refresh to 2026 numbers or name the edition explicitly.
2. Event-driven cadence (vendor retail pricing): check before every pricing conversation, because prices change without notice and the number is checkable in seconds. This is the only cadence in the set that is triggered by use rather than by calendar.
3. Revision-driven cadence (standards and guidance): check for a newer revision before citing in any external-facing material. NIST SP 800-63B moved from Revision 3 to Revision 4 (final July 31, 2025), and the revision changed terminology ("verifier impersonation" to "phishing"), so a versionless citation can quote language that no longer exists in the standard.
4. Multi-year forecast cadence (market sizing): the forecasts run to 2034, so an annual light refresh check is reasonable, but the reference doc notes the underlying uncertainty (vendor-to-vendor variance) will not resolve with a refresh alone. Refreshing a range does not shrink the range.

## Recording retrieval dates

Every collected fact in this corpus carries a retrieval date, because the weight of a claim decays with its source. Practitioner guidance on stale citations treats outdated sources as a business risk: they can misstate pricing, features, and rankings, and the recommended process is to identify stale sources, score the risk of each, and prioritize updates (https://maxaeo.ai/blog/outdated-ai-citations/, weight 0.35, weak backing). The same pattern appears in retrieval-system design: freshness policies that bias ranking toward newer content, with per-source freshness thresholds rather than a single global age limit (https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-how-to-configure-freshness, weight 0.89; and a governance framing that pairs a source authority register with a freshness policy and audit evidence at https://thomasthelliez.com/blog/rag-governance-source-authority-access-control-auditability/, weight 0.42, weak backing).

The transferable design from the retrieval-system literature is per-category thresholds: a market-size forecast can tolerate a year of age; a retail price cannot tolerate a week when it is about to anchor a pricing call. A single global "max age" would either constantly flag the forecasts or never flag the price.

## The staleness flag as a first-class record

The reference doc does not silently correct stale or unreconcilable numbers; it records them as explicit flags (the unresolved $25 hardware-cost floor is documented as a reconciliation item for another document's owner). This is the right pattern: a staleness flag is a durable record that survives personnel changes, while a silent overwrite loses the history and invites the same discrepancy to reappear. Market-intelligence practice makes the same point from the other side: static annual research is stale before it informs planning, and the value comes from knowing how fresh each datapoint is rather than pretending all data is current (https://hginsights.com/resource/insight-reports/how-often-should-market-intelligence-actually-refresh/, weight 0.24, weak backing).

Mechanically, each benchmark entry in a citation list should carry: source URL, retrieval date, weight, refresh trigger (calendar or event), and staleness flags. That is exactly the schema the research-db in this corpus implements, which makes the refresh pass a database query rather than an archaeology project.

## Sources considered

| Source | URL | Weight |
|---|---|---|
| Configure freshness-aware retrieval (Microsoft Learn) | https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-how-to-configure-freshness | 0.89 |
| Annual reports page (Cadence investor relations) | https://investor.cadence.com/financials/annual-reports/default.aspx | 0.68 (off-topic) |
| RAG governance: source authority and freshness (thomasthelliez) | https://thomasthelliez.com/blog/rag-governance-source-authority-access-control-auditability/ | 0.42 (weak) |
| Outdated AI citations (maxaeo) | https://maxaeo.ai/blog/outdated-ai-citations/ | 0.35 (weak) |
| Data sources and refresh policy (goldpricez) | https://goldpricez.com/methodology/data-quality | 0.28 (weak) |
| How often should market intelligence refresh (HG Insights) | https://hginsights.com/resource/insight-reports/how-often-should-market-intelligence-actually-refresh/ | 0.24 (weak) |
| Citation Machine | https://www.citationmachine.net/ | 0.22 (weak) |
| Maintain retrieval freshness controls (Amo.ng) | https://amo.ng/skills/maintain-retrieval-freshness-controls | 0.22 (weak) |
| Outdated source flagging prompt (inferensys) | https://inferensys.com/prompts/grounding-and-evidence-ranking/evidence-freshness-and-temporal-relevance/outdated-source-flagging-prompt-for-retrieval-sets | 0.19 (weak) |
| 4-week refresh cadence (Answerly) | https://answerly.agency/blog/refresh-cadence-rhythm/ | 0.12 (weak) |
| Archiving (Therefore) | https://therefore.net/capabilities/archiving/ | 0.22 (weak) |
| Sherlock TV series (off-topic) | https://en.wikipedia.org/wiki/Sherlock_(TV_series) | 0.21 (weak) |
