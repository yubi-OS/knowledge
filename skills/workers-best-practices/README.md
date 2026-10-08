# workers-best-practices knowledge corpus

Minted 2026-10-08 from ground source `yubi-OS/yubiOS skills/workers-best-practices/SKILL.md` (8169 B fetched from raw.githubusercontent.com, User-Agent omni-agent/1.0). Topic: reviewing and authoring Cloudflare Workers code against production best practices: streaming, floating promises, global state, secrets, observability, and common Workers anti-patterns.

## Docs

| NN | doc | scope |
|----|-----|-------|
| 01 | [01-retrieval-first-types.md](01-retrieval-first-types.md) | Fetch the latest workers types, wrangler-generated Env, and wrangler config schema before writing or reviewing any Workers code |
| 02 | [02-configuration-rules.md](02-configuration-rules.md) | compatibility_date freshness, nodejs_compat, wrangler types Env generation, wrangler secret put, wrangler.jsonc |
| 03 | [03-request-response-streaming.md](03-request-response-streaming.md) | Stream large or unbounded payloads, the 128 MB buffering consequence, ctx.waitUntil for post-response work, no ctx destructuring |
| 04 | [04-architecture-bindings.md](04-architecture-bindings.md) | In-process bindings over the REST API, service bindings for Worker-to-Worker calls, Queues and Workflows off the critical path, Hyperdrive for external databases |
| 05 | [05-observability-config.md](05-observability-config.md) | observability config with head_sampling_rate, structured JSON logging, Workers Logs, Tail Workers, Tail Handler |
| 06 | [06-code-patterns-async.md](06-code-patterns-async.md) | No module-level request state, every Promise awaited, returned, voided, or passed to ctx.waitUntil |
| 07 | [07-security-crypto.md](07-security-crypto.md) | Web Crypto over Math.random, timingSafeEqual for secret comparison, no passThroughOnException as error handling |
| 08 | [08-review-workflow.md](08-review-workflow.md) | The 8-step review workflow, type and config checks, tsc --noEmit and no-floating-promises tooling, review principles |

## Research summary

- Results collected: 96 (16 searXNG queries, 2 per subtopic, top 6 kept per query)
- Weight split: 43 results at weight 0.5 or higher (authoritative backing), 53 below 0.5 (weak backing, labeled as such in the docs)
- Results kept at weight 0.4 or higher and cited: 44
- jev requests: 9 (1 outline validation with 8 score questions, 8 weighting batches of 12 noul questions), usage 11179 input / 1980 output tokens
- Redos: 0. All 16 dig queries returned 41 to 55 results on the first attempt; no dig was thin enough to require a redo.
- Skipped docs: none. All 8 validated subtopics were authored.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); DefAPI direct (typesafe/jev-1.13) 200 on all 9 requests, zero 429s.

## Gaps

none.

## Notes

- The source doc is the primary source of record; every doc cites it for its grounding spine and attributes source-doc claims explicitly.
- One dated drift recorded: `wrangler types` now aggregates bindings across all environments (Cloudflare changelog 2026-01-13), which the source doc predates.
- Post-push verification performed against the Git blobs API (not raw.githubusercontent), per the skills-variant speed optimizations.
