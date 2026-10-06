# durable-objects

Knowledge corpus explicating the yubiOS skill `durable-objects` (ground source: yubi-OS/yubiOS skills/durable-objects/SKILL.md, fetched 2026-10-06): creating and reviewing Cloudflare Durable Objects, stateful coordination, SQLite storage, alarms, WebSockets, the DO code review discipline, and wrangler configuration.

## Docs

| NN | doc | scope |
|----|-----|-------|
| 1 | [01-when-to-use.md](./01-when-to-use.md) | When to use Durable Objects (and when not) |
| 2 | [02-coordination-model.md](./02-coordination-model.md) | Coordination-atom modeling |
| 3 | [03-stub-routing.md](./03-stub-routing.md) | Stub creation and deterministic routing |
| 4 | [04-sqlite-storage.md](./04-sqlite-storage.md) | SQLite storage operations |
| 5 | [05-wrangler-config.md](./05-wrangler-config.md) | Wrangler configuration and migrations |
| 6 | [06-rpc-concurrency.md](./06-rpc-concurrency.md) | RPC methods, constructor init, and concurrency control |
| 7 | [07-alarms.md](./07-alarms.md) | Alarms |
| 8 | [08-websockets.md](./08-websockets.md) | WebSockets and persistent connections |
| 9 | [09-testing.md](./09-testing.md) | Testing with @cloudflare/vitest-pool-workers |
| 10 | [10-antipatterns-review.md](./10-antipatterns-review.md) | Anti-patterns and the DO review discipline |

## Research summary

- Results collected: 223 (top 6 per query, 2 queries per subtopic, deduped per subtopic)
- Weight split: 56 at weight >= 0.5 (authoritative backing), 167 below 0.5 (weak, labeled where cited)
- Jev requests: 16 (1 outline score request + 15 weighting batches of up to 15 results, DefAPI direct per the skills-variant speed ops), usage 21031 input / 4228 output tokens
- Redos: 0 (no failed decide requests, no thin digs)
- Skipped docs: none (all 10 subtopics validated load-bearing or strong-marginal: alarms 0.99, websockets 1.20, testing 0.97 kept because their digs returned strong primary sources)
- Dated correction recorded in doc 05: Cloudflare's migrations reference now marks the declarative exports map as the source of truth, one-way once adopted (https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/index.md, jev weight 0.97), which drifts from the source doc's legacy migrations-array example

## Preflight

2026-10-06: searXNG campaign preflight healthy (orchestrator); decide via https://api.defapi.org/api/v1/decisions (typesafe/jev-1.13), agent-side probe skipped for speed per the skills-variant speed optimizations.

## Research-db

- preflight.json, outline.json, archive.json, jev-log.json, db.ts
- digs/01..10 per-subtopic dig records

Doc word counts (600-1200 target): 01-when-to-use=764, 02-coordination-model=774, 03-stub-routing=773, 04-sqlite-storage=710, 05-wrangler-config=631, 06-rpc-concurrency=643, 07-alarms=783, 08-websockets=659, 09-testing=763, 10-antipatterns-review=840
