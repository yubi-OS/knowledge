# 06 Metrics: RED and USE, Percentiles, and Cardinality

Scope: RED on every endpoint and external dependency, USE on resources, histograms instead of averages with p50/p95/p99 queryable, and cardinality control as the discipline that keeps the metrics backend alive.

## RED and USE

The ground source (yubi-OS/yubiOS skills/observability-and-instrumentation/SKILL.md) splits the target space: for request-driven services, instrument RED on every endpoint and every external dependency - Rate (requests/sec), Errors (failure rate), Duration (latency histogram, not average). For resources (queues, pools, hosts), use USE: Utilization, Saturation, Errors (source doc). Better Stack's guide covers RED and USE side by side the same way (https://betterstack.com/community/guides/monitoring/red-use-metrics/, weight 0.24, weak), and Splunk's RED monitoring explainer describes Rate, Errors, and Duration as the request-side triad (https://www.splunk.com/en_us/blog/learn/red-monitoring.html, weight 0.49, weak). Both agree with the source doc; neither adds a requirement it lacks.

Prometheus itself (https://prometheus.io/, weight 0.96) is the monitoring system and time series database the source doc's example targets, via the prom-client library. The source doc is explicit that prom-client is "one common backend choice, not the only one; the RED/USE and cardinality rules are identical either way", and that the vendor-neutral path is the OpenTelemetry metrics API, same SDK and context as tracing (source doc).

## Histograms and percentiles

"Track averages never, percentiles always: an average hides the 1% of users having a terrible time. Use histograms and read p50/p95/p99" (source doc). The example histogram (source doc):

```typescript
const httpDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status_class'],  // '2xx', not '200'
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});
```

Two details carry the discipline: latency is a histogram (so percentiles are queryable, and the checklist requires "Latency is a histogram; p95/p99 are queryable"), and status labels collapse to classes (2xx, 5xx) rather than exact codes (source doc).

## Cardinality is the failure mode

"Every unique label combination is a separate time series. Labels must come from small, fixed sets (route template, status class, provider name). Never use user IDs, raw URLs, error messages, or other unbounded values as labels - that belongs in logs and traces" (source doc). The OK/NEVER table (source doc):

```
OK as label:    route="/api/tasks/:id"   status_class="5xx"   provider="stripe"
NEVER as label: user_id, email, request_id, full URL, error message text
```

Robust Perception, the Prometheus consulting authority, states the same as their headline: "Cardinality is key" - the number of active series determines whether the system stays queryable (https://www.robustperception.io/cardinality-is-key/, weight 0.62). Practitioner writeups on Prometheus cardinality describe the same mechanism and its failure shape: unbounded labels (user IDs, emails, raw URLs) multiply series until ingestion and query latency degrade (https://www.groundcover.com/learn/observability/prometheus-cardinality, weight 0.29, weak). The red-flag list calls a metric labeled with user IDs, raw URLs, or error message text a "cardinality bomb" (source doc), and the rationalizations table answers "user ID as a metric label makes debugging easier" with "it also makes your metrics backend fall over. High-cardinality lookups belong in logs and traces" (source doc).

## Where the unbounded values go

The division of labor is the point: metrics carry bounded aggregates, logs carry per-event detail (doc 03), traces carry per-request context (doc 07). user_id belongs in a log line keyed by correlation ID and as a trace attribute, never as a metric label (source doc).

## Practical summary

RED on endpoints and dependencies, USE on resources. Histograms with sane buckets, read as p50/p95/p99, never averages. Labels from small fixed sets only. Cardinality discipline is not a tuning step; it is the difference between a metrics backend and an outage amplifier.

## Bucket choice is part of the discipline

The source doc's bucket list [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5] is not arbitrary: it brackets the latency range where user experience degrades for a typical request-driven service, so p95 and p99 land inside a bucket boundary instead of interpolating across a 10-second-wide top bucket (source doc). A histogram with buckets badly matched to the service's real latency distribution cannot answer the p99 question even though the metric exists, which is why the checklist phrase is "p95/p99 are queryable", not "p95/p99 exist" (source doc). When a service's latency profile is known (for example a payment provider that takes 2 to 4 seconds), shift the buckets so the interesting region is resolved. The status_class label (2xx, 5xx) follows the same principle on the label side: exact status codes would multiply series by an order of magnitude while answering no new question (source doc).
