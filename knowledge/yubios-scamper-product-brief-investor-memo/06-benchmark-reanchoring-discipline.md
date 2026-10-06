# 06. Re-anchoring paraphrased market numbers

Scope: Re-anchoring LLM-paraphrased market numbers to named analyst reports with retrieval dates before external use, and what the endpoint-security source landscape actually looks like when you try.

## Why re-anchoring is mandatory, not optional

A paraphrased market number ("roughly $18B to $25B in 2026") inherits none of the defensibility of its source. Gartner's own 2026 information-security forecast is reported at two different figures by two different retrievals: one aggregator article reports global cybersecurity spending expected to reach $295 billion in 2026, growing approximately 20.4% from $245 billion in 2025, while noting IDC's measurement scope differs (https://www.16idc.com/en-us/article-detail/global-cybersecurity-spending-2026, jev weight 0.57, authoritative); a March 2026 blog post reports Gartner's 4Q25 information-security forecast projecting global spending reaching $244.2 billion in 2026, up 13.3% year-over-year, and calls that acceleration rather than continuation (https://softwarestrategiesblog.com/2026/03/24/information-security-spending-2026/, jev weight 0.40, weak backing).

Same named source (Gartner), same target year (2026), two figures $50B apart. The likely causes are different report vintages, different scope definitions (information security versus cybersecurity), and secondhand transcription. This is exactly why the re-anchoring rule exists: before any public use, a number must be pinned to a specific named report with a retrieval date, so a reader can reproduce the figure and see which vintage it came from.

## What the primary-source landscape looks like

The sources worth citing directly, by weight:

- ENISA's Cybersecurity Market Analysis Framework (ECSMAF) is the most authoritative methodology document in the set: ENISA began market-analysis work in 2021 as part of its task to perform and disseminate regular analyses of the main trends in the cybersecurity market on both the demand and supply sides (https://www.enisa.europa.eu/sites/default/files/2026-03/ENISA%20Cybersecurity%20Market%20Analysis%20Framework%20%28ECSMAF%29%20%E2%80%93%20V3.0.pdf, jev weight 0.87, authoritative). It is a framework, not a number, which makes it citable for methodology without pinning a figure.
- IDC maintains a public forecasts index page drawing on more than 1,100 analysts in over 110 countries (https://www.idc.com/research/forecasts.jsp, jev weight 0.78, authoritative), but the page is an index, so specific figures require drilling into named forecast documents.
- Precedence Research puts the endpoint security market at $20.61 billion in 2026 growing to approximately $47.23 billion by 2035 (https://www.precedenceresearch.com/endpoint-security-market, jev weight 0.63, authoritative).
- Statista carries both a cybersecurity report study with forecasts until 2029 (https://www.statista.com/study/124902/cybersecurity-report/, jev weight 0.64, authoritative) and a worldwide cybersecurity market forecast outlook (https://www.statista.com/outlook/tmo/cybersecurity/worldwide/, jev weight 0.67, authoritative).

The secondary tier, useful for triangulation but weakly backed:

- MarketsandMarkets: endpoint security projected from $17.76 billion in 2026 to $28.06 billion by 2031 at a 9.6% CAGR (https://www.marketsandmarkets.com/Market-Reports/endpoint-security-market-29081235.html, jev weight 0.48, weak backing); the same vendor's broader cybersecurity market runs from $227.59 billion in 2025 to $351.92 billion by 2030 at 9.1% CAGR (https://www.marketsandmarkets.com/Market-Reports/cyber-security-market-505.html, jev weight 0.59, authoritative).
- Fortune Business Insights: endpoint security from $17.79 billion in 2026 to $34.40 billion by 2034 at 8.60% CAGR (https://www.fortunebusinessinsights.com/industry-reports/endpoint-security-market-100614, jev weight 0.34, weak backing).
- Technavio: cybersecurity analysis 2025 to 2029 with region-wise segmentation (https://www.technavio.com/report/cybersecurity-market-industry-analysis, jev weight 0.48, weak backing).

## The spread is the finding

Across vendors, the 2026 endpoint-security figure ranges from $17.76B (MarketsandMarkets) to $17.79B (Fortune Business Insights) to $20.61B (Precedence Research). Those agree within about 16%, which is normal for differently-scoped analyst estimates. But the broader cybersecurity number ranges from $244.2B to $295B for the same year under the same brand name, and forecasts for endpoint security range from $28.06B by 2031 to $47.23B by 2035. Three practical consequences:

1. A range quoted as "$17.8B to $24.9B for 2026 endpoint security" is defensible as a triangulated range only if each endpoint of the range is attributed to a named report with a retrieval date.
2. Scope words matter more than vendor names: "endpoint security" and "information security" and "cybersecurity" are different markets at different magnitudes, and the biggest paraphrase errors come from mixing scopes.
3. Forecast horizons are not comparable: a 2031 forecast and a 2033 or 2035 forecast cannot be averaged or presented side by side without the horizon labeled.

## The re-anchoring procedure

The minimal honest procedure, per the verification discipline in doc 05: identify every number to be used externally; for each, find the named primary report (vendor, report title, publication date); fetch and record the exact figure and scope definition with a retrieval date; note any conflicting figures from the same vendor and which vintage wins; and only then substitute the pinned citation for the paraphrase. IDC's forecasts index (https://www.idc.com/research/forecasts.jsp, jev weight 0.78, authoritative) and ENISA's framework (jev weight 0.87, authoritative) are the right starting points for methodology-first citations, with the vendor market reports used for the numeric range.
