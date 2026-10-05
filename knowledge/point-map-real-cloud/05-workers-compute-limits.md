# 05 Cloudflare Workers resource budgets and the 1102 error

Scope: Cloudflare Workers resource budgets: CPU time, the 128 MB memory limit, and what the 1102 resource-limit error means for numeric workloads.

## What error 1102 means

Error 1102 is the Cloudflare error page a client receives when a Worker exceeds its resource limits. The Workers errors reference enumerates the production error codes a client can hit when a Worker fails to return a response, including Worker threw a JavaScript exception, Worker exceeded CPU time limit, and Worker hit loop limit (https://developers.cloudflare.com/workers/observability/errors/, weight 0.94). The dedicated 1102 troubleshooting page narrows it to exceeded memory: a Cloudflare Worker exceeds the 128 MB memory limit, and that limit is per-isolate, meaning an isolate may be handling multiple requests concurrently (https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1102/index.md, weight 0.80). In practice a 1102 therefore means the invocation blew either the CPU budget or the memory budget, and for matrix-shaped numeric work the memory budget is usually the binding one: an N by D float matrix materialized in memory grows linearly in both N and D, and a 301 by 768 float cloud with intermediate copies can push a small isolate over the line.

## CPU time versus wall time

The Workers limits documentation separates the two budgets that matter for a compute endpoint: wall time (also called wall-clock time) is the total elapsed time from the start to end of an invocation, including time spent waiting on network requests, I/O, and other asynchronous operations, while CPU time only measures time the CPU spends actively executing (https://developers.cloudflare.com/workers/platform/limits/, weight 0.94). A dense numeric kernel such as a matrix projection or a null-model loop burns CPU time almost exclusively, so CPU time is the budget a placement pipeline should measure against, and waiting on nothing means the wall time is close to the CPU time.

## Raising the ceiling

On the Workers Paid plan the CPU time limit can be raised from the default 30 seconds up to 5 minutes (300,000 ms), set in the Wrangler configuration or in the dashboard, and the docs recommend profiling code and optimizing hot paths (https://developers-cloudflare-com.dootg.com/workers/platform/limits/, weight 0.94; unofficial mirror of the official limits documentation, cited for the specific numbers). Community guidance for hitting 1102 recommends eliminating blocking code, raising cpu_ms limits, and offloading long tasks to Durable Objects or Queues (https://markaicode.com/errors/cloudflare-workers-timeout-exceeded-fix/, weight 0.25; weak backing, third-party guide).

## The failure mode for placement runs

For a placement pipeline the 1102 signature is characteristic: the same input plus the same seed either completes or dies, and the failure is a function of input size and draw count, not of the data's content. That yields a concrete operating rule: when a run is large, lower the draw count K, shrink the projected dimension, or move the compute off the edge. Reducing K changes only the null-model resolution (more draws, tighter null spread), so a run that passes at a smaller K is still a valid run, just with a coarser null, provided the K used is recorded with the results. The failure is intermittent at the margin, which is the worst property for a production endpoint: a size that passes on one invocation can 1102 on the next under concurrent load, because the memory limit is per-isolate and isolates serve multiple requests concurrently (https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1102/index.md, weight 0.80).

## What to record with each run

A run log for an edge placement should record: the runtime that executed it, the input dimensions (N by d after projection), the draw count K, the wall time observed, and whether the invocation hit any resource error. Comparing two runtimes for the same input and seed is only meaningful when the effective K and dimensions match, since a different K changes the null distribution and therefore the statistics.

## Sources considered

| source | url | weight |
|---|---|---|
| Cloudflare Workers errors reference | https://developers.cloudflare.com/workers/observability/errors/ | 0.94 |
| Cloudflare error 1102 troubleshooting | https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1102/index.md | 0.80 |
| Cloudflare Workers limits | https://developers.cloudflare.com/workers/platform/limits/ | 0.94 |
| Limits page mirror (dootg.com) | https://developers-cloudflare-com.dootg.com/workers/platform/limits/ | 0.94 (unofficial mirror) |
| Cloudflare community thread on 1102 | https://community.cloudflare.com/t/error-1102-worker-exceeded-resource-limits/640838 | 0.05 (weak) |
| MarkAICode 1102 fix guide | https://markaicode.com/errors/cloudflare-workers-timeout-exceeded-fix/ | 0.25 (weak) |
| MarkAICode limits benchmark guide | https://markaicode.com/benchmarks/cloudflare-workers-scalability-benchmark/ | 0.07 (weak) |
| Cloudflare homepage (off-topic hit) | https://www.cloudflare.com/ | 0.18, 0.29 (weak, marketing) |
| Wikipedia Firefox (off-topic hit) | https://en.wikipedia.org/wiki/Firefox | 0.11 (weak, off-topic) |
| Wikimedia Phabricator T297236 | http://phabricator.wikimedia.org/T297236 | 0.25 (weak, off-topic) |
| ponyfoo.com (empty content) | https://ponyfoo.com/ | 0.26 (weak, empty) |
