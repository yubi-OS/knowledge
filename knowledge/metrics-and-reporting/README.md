# metrics-and-reporting

Knowledge corpus on metrics and reporting for an early-stage open-source project: which metrics to track, which are honest to measure now versus flagged not-yet-measurable, and reporting cadence. Minted from yubi-OS/yubiOS `refs/metrics-and-reporting-2026-07-25.md`.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-decision-tied-metrics](01-decision-tied-metrics.md) | Metric-to-decision mapping versus vanity reporting in early-stage open-source projects. |
| 03 | [03-honest-unmeasurable](03-honest-unmeasurable.md) | Honest flagging of not-yet-measurable metrics: adoption, trust, telemetry-by-design, pull counts. |
| 04 | [04-business-health-offers](04-business-health-offers.md) | Business-health metrics tied to an offer catalog: readiness gates, paid pilots, SLA adherence, funding. |
| 05 | [05-cadence-owner](05-cadence-owner.md) | Reporting cadence and ownership at single-founder scale: weekly informal versus event-driven review. |
| 06 | [06-thresholds-scope](06-thresholds-scope.md) | Threshold-setting discipline and out-of-scope boundaries: no targets before data, no dashboards before data. |
| 07 | [07-oss-health-industry](07-oss-health-industry.md) | Industry-standard OSS project-health measurement: CHAOSS metrics and OpenSSF Scorecard as prior art. |
| 08 | [08-funding-signal-metrics](08-funding-signal-metrics.md) | Funding and pilot signal metrics: grant pipelines, paid pilots, community growth proxies without telemetry. |


Subtopic 02 (public-health-artifacts) was dropped at outline validation (score 0.20, probability 0.86 that it was padding): its content is repo-specific artifact mapping, which this corpus treats as an instance of the decision-tied pattern in doc 01 rather than a separate subtopic.

## Research summary

- Results collected: 144 (top 6 per query, 2 queries per subtopic, plus redos)
- Weight split: 29 results with weight >= 0.5 (authoritative backing), 115 with weight < 0.5 (weak backing, labeled in text), 0 unscored
- Jev requests: 32, usage 23790 input / 0 output tokens (outline validation plus noul weighting batches)
- Redos: 5 dig redos (doc 04 twice, docs 05, 06, 08 once each) after first-pass digs came back thin; all redos used different queries
- Skipped docs: none
- Doc 04 note: the business-health dig stayed weak-heavy even after 2 redos (best sources leananalyticsbook.com 0.87, startupkit.pro 0.64); its SLA and pilot claims lean on multiple weak sources that agree on definitions, labeled as such in text

Preflight 2026-10-05: searXNG 65 results healthy; /api/decide (clef) 200
