# 06. Capability map and the fusion

Scope: The approved capability map the V6+V7 fusion inherits unchanged, and what each inherited capability contributes to the fused design.

## The fusion shape

The framing log's recommended direction fuses the approved module map with the two papers-grade disciplines as the loop's spine: single-action atom cadence (V7) for the execution rhythm and standard-candle governance (V6) for self-calibration. The fusion sits inside the existing approved capability map and inherits the fail-closed whitelist unchanged (source: the framing log, refs/evolution-v2-solo-2026-10-01.md).

## The inherited capabilities

The log names the map's members: cron cycle, the full jev surface, Vectorize memory with wayfinder identity-key discipline, durable execution, and Resend notify. Sauna sessions remain the hands for memory_edit, repo_push and worker_change; the worker auto-executes only record_learning, note and its own measured atoms (source: the framing log).

**Vectorize memory.** Cloudflare's Vectorize is the vector database the loop's recall layer targets: it queries embeddings, representations of values or objects like text, images and audio designed to be consumed by machine learning models (https://developers.cloudflare.com/vectorize/, weight 0.95, authoritative). A vector database stores the embeddings, not the original data itself (https://developers.cloudflare.com/vectorize/get-started/embeddings/, weight 0.95, authoritative). Reference deployments pair the Workers AI binding with the Vectorize binding to power embedding search (https://cloudflare-experiments.com/docs/experiments/vectorize-search, weight 0.90, authoritative). Product-level docs confirm the platform positioning, vector storage from within Workers (https://www.cloudflare.com/products/vectorize/, weight 0.49, weak). Community architecture writeups pair D1 structured state with Vectorize semantic search for agent memory, the same split the loop uses, at blog grade (https://www.buildmvpfast.com/blog/cloudflare-agent-memory-vectorize-d1-edge-2026, weight 0.22, weak; https://github.com/cloudflare/agents/discussions/1762, weight 0.43, weak). The wayfinder identity-key discipline is the project's own addition, imported from its point-map work (V4), so recall keys carry identity rather than raw content (source: the framing log).

**Durable execution.** The loop's hourly cycles run on Cloudflare's durable execution engine. Workflows is an execution engine built on Workers that can automatically retry, persist state, and run for long periods (https://www.cloudflare.com/products/workflows/, weight 0.64, authoritative). The docs describe chaining together multiple steps with automatic retries and persistent state (https://developers.cloudflare.com/workflows/, weight 0.91, authoritative; https://developers.cloudflare.com/workflows/get-started/guide/, weight 0.97, authoritative). Cloudflare's engineering blog describes Workflows as allowing reliable, repeatable, long-lived multi-step applications that retry automatically and persist state (https://blog.cloudflare.com/building-workflows-durable-execution-on-workers/, weight 0.83, authoritative). This is what makes an hourly machine cycle safe to interrupt and resume.

**Queues.** The MVP routes queues through a thin adapter, D1-backed by default, switching to CF Queues if the queue exists at deploy (source: the framing log). This keeps the queue substrate a swappable detail behind the adapter boundary. Community writing warns against hand-building workflow orchestration on raw chained queues, which is the failure mode the thin adapter avoids (https://ishu.dev/post/durable-execution-workflow-orchestration-queues-2026-07-19, weight 0.32, weak).

**Sauna sessions as hands.** The autonomy boundary is preserved: anything touching the repo, memory edits or worker changes executes through Sauna sessions, not the worker. The worker's autonomous surface is record_learning, note and its own measured atoms (source: the framing log).

**Resend notify.** The digest email path. The log also explicitly rejected approval via email link as a new auth surface, keeping notification and authorization separate channels (source: the framing log).

## Why fusion rather than a single winner

V6 and V7 topped the score table at sigma 18 each, and they are complementary rather than competing: V7 defines the unit of change (one atom, one measured delta), V6 defines the unit of trust (one candle, one measured detection power). The problem statement demanded both honesty about the loop's own claims and a bounded blast radius; neither discipline alone covers both. The fusion keeps the fail-closed whitelist unchanged, which means the trusted computing base did not grow with the design (source: the framing log).
