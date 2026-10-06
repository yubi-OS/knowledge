# 08 Analytics and observability

Scope: the "I need analytics/metrics data" decision tree from the source doc: GraphQL Analytics API, Analytics Engine, Web Analytics, Workers observability, R2 SQL over Iceberg data lakes, and Logpush for raw logs.

## The tree as the source doc states it

The source doc (yubi-OS/yubiOS skills/cloudflare/SKILL.md) routes analytics by data source:

- Query across all Cloudflare products (HTTP, Workers, DNS, and others): graphql-api/
- Custom high-cardinality metrics from Workers: analytics-engine/
- Client-side RUM performance data: web-analytics/
- Workers Logs and real-time debugging: observability/
- SQL over an Iceberg data lake of logs and events: r2-sql/ (with pipelines/ and r2-data-catalog/)
- Raw logs to external tools: Logpush, in the Cloudflare docs

## GraphQL Analytics API

The GraphQL docs (weight 0.94, https://developers.cloudflare.com/analytics/graphql-api/, updated 2026-04-23) define the capability: select specific datasets and metrics of interest, filter and aggregate the data along various dimensions, and integrate the results with other applications; the API's basis is the GraphQL framework created and open-sourced by Facebook. The umbrella Analytics docs (weight 0.93, https://developers.cloudflare.com/analytics/, updated days before collection) state the promise as one endpoint carrying all performance, security, and reliability data, from one metric for one domain to multiple metrics aggregated across domains.

The origin story is dated but still the framing: the launch post (weight 0.70, https://blog.cloudflare.com/introducing-the-graphql-analytics-api-exactly-the-data-you-need-all-in-one-place/, dated 2019-12-12) introduced the single endpoint for performance, security, and reliability data. A useful corroboration comes from Cloudflare's own skills repository (weight 0.73, https://github.com/cloudflare/skills/tree/main/skills/cloudflare/references/graphql-api), which documents querying analytics across all Cloudflare products via a single GraphQL endpoint covering HTTP requests, Workers metrics, DNS, Firewall events, Network Analytics, and 70+ other datasets. That 70+ datasets figure is the strongest concrete scale indicator in the dig, and it comes from a Cloudflare-owned repository, which is also the direct upstream of the ground-source skill.

Weak sources, labeled: the community expert tip (weight 0.12) restates the one-endpoint pitch; the third-party schema-docs page (weight 0.08) shows Workflow queue wait-time metrics with adaptive sampling.

## Workers observability and Logpush

The Workers observability docs (weight 0.96, https://developers.cloudflare.com/workers/observability/, updated days before collection) cover understanding Worker project performance via logs, traces, metrics, and other data sources. The Workers Logpush docs (weight 0.96, https://developers.cloudflare.com/workers/observability/logs/logpush/, updated days before collection) give the concrete export path: in the Cloudflare dashboard go to the Logpush page, create a Logpush job, select and configure a destination, and select Workers trace events as the data set, with optional field customization.

The observability blog post (weight 0.86, https://blog.cloudflare.com/one-observability-platform/, updated 4 days before collection) announces eight major updates bringing logs, traces, analytics, alerts, dashboards, querying, and telemetry export into one observability platform, with simpler and more predictable pricing. This is a dated correction signal worth recording against the source doc: the skill treats observability/ as one row, and the platform is consolidating those surfaces under one umbrella.

The Workers Observability product page (weight 0.54, https://www.cloudflare.com/products/workers-observability/) adds the operator framing: instant access to search, query, and filter logs for fast problem resolution.

Weak sources, labeled: the cloudsecop post (weight 0.09) enumerates 4 observability layers (Workers Logs with 3-day retention, Tail Workers for real-time, Logpush for batch to R2 or SIEM, Analytics Engine) and the architect library page (weight 0.10) maps the observability scope. Both below the authority line; the layer enumeration is plausible but unconfirmed by any high-weight source in this dig, so the corpus records it without endorsing the 3-day retention figure.

## Cross-links

The r2-sql/ row belongs to the storage stack documented in doc 03 (weights 0.94, 0.95, 0.89): Pipelines ingest, R2 Data Catalog stores Iceberg tables, R2 SQL queries them. Analytics Engine has no high-weight dig hit in this subtopic; its row rests on the source doc routing and must be retrieved from the docs channel before any numeric use.
