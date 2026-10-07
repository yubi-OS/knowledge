# skills/durable-objects - Knowledge Corpus

Explication corpus for the yubiOS skill `skills/durable-objects/SKILL.md` (yubi-OS/yubiOS): creating and reviewing Cloudflare Durable Objects, stateful coordination, SQLite storage, alarms, WebSockets, the DO code review discipline, and the wrangler configuration patterns the skill teaches. The source doc is the primary source of record; this corpus explicates and deepens it.

## Index

| NN | Doc | Scope |
|----|-----|-------|
| 01 | [01-when-to-use-and-retrieval.md](docs/01-when-to-use-and-retrieval.md) | When DOs are the right primitive, when they are not, and the skill's retrieval-first discipline |
| 02 | [02-coordination-atoms.md](docs/02-coordination-atoms.md) | One DO per coordination atom, deterministic routing, the 3 stub-creation patterns |
| 03 | [03-wrangler-migrations.md](docs/03-wrangler-migrations.md) | wrangler.jsonc bindings, migrations array, new_sqlite_classes, the exports-field drift |
| 04 | [04-sqlite-storage.md](docs/04-sqlite-storage.md) | sql.exec synchronous SQL, async KV, constructor init with blockConcurrencyWhile, atomicity rules |
| 05 | [05-rpc-methods.md](docs/05-rpc-methods.md) | RPC methods over the fetch handler, DurableObject base class, compatibility-date floor |
| 06 | [06-alarms.md](docs/06-alarms.md) | One alarm per object, at-least-once retries, the alarm-as-batcher pattern, self-rescheduling |
| 07 | [07-websockets.md](docs/07-websockets.md) | Persistent connections, the Hibernation WebSocket API as the recommended default |
| 08 | [08-anti-patterns-review.md](docs/08-anti-patterns-review.md) | The NEVER list, the blockConcurrencyWhile contract, atomicity hazards, the 5-step review pass |
| 09 | [09-testing-vitest.md](docs/09-testing-vitest.md) | @cloudflare/vitest-pool-workers, workerd-faithful tests, alarm testing |

Ground source: yubi-OS/yubiOS skills/durable-objects/SKILL.md (6692 bytes fetched 2026-10-06). Every doc cites the source doc for its grounding spine plus searXNG dig results weighted by the jev decision model.

## Research summary

- Results collected: 108 raw across 18 queries (2 per subtopic), 93 kept after URL dedupe.
- Weight split (jev noul): 50 results at weight >= 0.5 (authoritative backing), 43 results below 0.5. Weak-backed claims are labeled as such in the docs; low-weight aggregator and forum results are not used as backing.
- Jev requests: 8 total (1 outline validation with 9 score questions, 7 noul weighting batches with 93 questions), endpoint https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13. Usage: 10222 input tokens, 1841 output tokens.
- Redos: 0. All 18 dig queries returned results on the first attempt.
- Skipped docs: none. All 9 subtopics validated as load-bearing (scores 0.89 to 1.89 on the 0-to-2 score metric; none scored 0).
- Marginal subtopics kept per the score-1 rule (keep only if the dig comes back strong): 06-alarms (score 1.12, kept on 6 first-party sources at weight 0.80 or higher), 07-websockets (score 1.06, kept on 5 first-party sources at weight 0.87 or higher), 09-testing-vitest (score 0.89, kept on 5 first-party or upstream-repo sources at weight 0.50 or higher).

## Research DB

Under `research-db/`: `preflight.json`, `outline.json`, `archive.json` (one entry per weighted result, weights non-null), `digs/<NN>-<slug>.json` (one per subtopic), `jev-log.json` (one entry per jev HTTP request), and `db.ts` (TypeScript interfaces mapping file to interface).

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side, agent-side probe skipped per brief); decide via DefAPI direct (typesafe/jev-1.13), worker relay kept as fallback and not needed (0 failed weighting requests).
