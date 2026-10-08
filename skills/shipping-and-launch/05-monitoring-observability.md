# 05 Monitoring and Observability

Scope: what to monitor at launch, how error reporting is wired on client and server, and the post-launch verification routine for the first hour.

## The metric inventory

The source doc splits launch monitoring into 3 groups (source doc, What to Monitor). Application metrics: error rate in total and by endpoint, response time at p50, p95, and p99, request volume, active users, and key business metrics such as conversion and engagement. Infrastructure metrics: CPU and memory utilization, database connection pool usage, disk space, network latency, and queue depth where applicable. Client metrics: Core Web Vitals (LCP, INP, CLS), JavaScript errors, API error rates measured from the client's perspective, and page load time.

The split is deliberate. Client metrics are the only group that measures what users actually experience; server-side averages hide client-side failure. A launch where the server is green but the client JS error rate tripled is a failed launch that the server dashboards will never show, which is why the source doc lists client errors as a separate signal and uses them in the rollout thresholds (source doc, Rollout Decision Thresholds).

## Golden signals

The industry baseline for "what to monitor" is Google's SRE book chapter on monitoring distributed systems, which defines the 4 golden signals: latency, traffic, errors, and saturation (https://sre.google/sre-book/monitoring-distributed-systems/, jev 0.93). The source doc's inventory covers all 4: response time is latency, request volume and active users are traffic, error rate is errors, and CPU, memory, pool usage, disk, and queue depth are saturation measures.

Elastic's observability guide frames metrics as the telemetry signals that let an organization make sense of operations and build proactive monitoring processes (https://www.elastic.co/blog/observability-metrics, jev 0.59). The source doc's contribution on top of the generic signals is grouping: knowing which signals belong to which layer tells you where to look first when a launch regression appears. See also the observability-and-instrumentation skill for alerting rules and SLO-tied thresholds (source doc, See Also).

## Error reporting wiring

The source doc includes 2 concrete wiring patterns (source doc). On the client, a React error boundary component catches render errors and reports them with the component stack, the user id, and the current page path. On the server, an error-handling middleware reports the error with the HTTP method, URL, and user id, then returns a sanitized 500 body with a generic message: "Something went wrong" with an INTERNAL_ERROR code. The comment in the source doc states the rule directly: do not expose internals to users.

The invariant across both patterns is that every report carries enough context to reproduce the failure (stack plus component stack plus user and route) while the user-facing response carries none of it. Error reporting and user-facing error messages are two different artifacts with two different audiences.

## Post-launch verification

The source doc defines a 6-step verification routine for the first hour after launch (source doc): check the health endpoint returns 200, check the error monitoring dashboard for no new error types, check the latency dashboard for no regression, manually test the critical user flow, verify logs are flowing and readable, and confirm the rollback mechanism works, with a dry run if possible.

The last item is the unusual one and the most important: a rollback plan that has never been exercised is a hypothesis. Weak-backing context: a third-party post-deployment verification checklist covers similar ground (https://qapractices.com/checklists/post-deployment-verification-checklist/, jev 0.20, weak backing), and a deployment-monitoring guide makes the panic-alert argument (https://uptybots.com/blog/monitoring-during-deployments-how-to-avoid-panic-alerts, jev 0.18, weak backing). Cite them as corroboration only.

## The red flag the source doc names

The source doc's rationalizations table lists "We'll add monitoring later" and answers it: add it before launch, because you can't debug what you can't see (source doc). The inverse appears in the red flags list: "No monitoring or error reporting in production" is itself a launch blocker (source doc). Monitoring is a precondition of the rollout sequence, not a follow-up ticket: every stage gate in the staged rollout doc reads a monitoring signal, so launching without monitoring disables every downstream safety mechanism in this corpus.
