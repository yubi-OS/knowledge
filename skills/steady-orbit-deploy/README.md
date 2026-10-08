# steady-orbit-deploy knowledge corpus

Knowledge corpus minted from the yubiOS skill `skills/steady-orbit-deploy/SKILL.md` (yubi-OS/yubiOS), covering deploying or updating the steady-orbit Cloudflare Worker via the Workers modules API: pulling the live bundle, overlaying module parts, multipart upload with metadata rebuilt from live settings, preserving crons and bindings, and rollback.

## Index

| doc | scope |
|---|---|
| [01-worker-anatomy-modules-api.md](01-worker-anatomy-modules-api.md) | The worker as a multipart ES module bundle and why deploys use the REST modules API, not wrangler |
| [02-bundle-pull-part-extraction.md](02-bundle-pull-part-extraction.md) | Pulling the live bundle as rollback source and part source of record; extraction and the overlay pattern |
| [03-metadata-live-settings-bindings.md](03-metadata-live-settings-bindings.md) | Metadata rebuilt from live settings; the keep_bindings error 10021 trap; bindings at deploy vs runtime |
| [04-import-graph-fixture-gotcha.md](04-import-graph-fixture-gotcha.md) | node --check plus import-graph resolution; path-qualified fixture parts; CF 10021 "No such module" |
| [05-post-deploy-verify-schedules-etag.md](05-post-deploy-verify-schedules-etag.md) | Schedules and bindings verified with the upload; etag capture; live route verification |
| [06-kv-updates-raw-bytes.md](06-kv-updates-raw-bytes.md) | Post-deploy KV updates; the 2026-10-05 json.dumps incident; raw --data-binary PUTs; byte-compare verification |
| [07-rollback-discipline.md](07-rollback-discipline.md) | Rollback by re-PUT of the saved pre-deploy bundle; importer coupling when parts were added |
| [08-deploy-safety-rules-secrets.md](08-deploy-safety-rules-secrets.md) | The five deploy-safety rules: entry module, CF 10182, importer rollback, unverified math, secrets |
| [09-router-parts-deploy-order.md](09-router-parts-deploy-order.md) | The 2026-10-06 router deploy (43 parts); inline mode; code first, then policy promote |

## Research summary

- Ground source: `yubi-OS/yubiOS skills/steady-orbit-deploy/SKILL.md` (8181 bytes, fetched 2026-10-08).
- Results collected: 101 (18 searXNG queries, 2 per subtopic, top 6 per query kept, 7 duplicates removed).
- Weight split (noul probability): 32 results at 0.5 or higher (primary/official backing), 69 below 0.5 (weak backing, labeled as such in the docs). 0 null. All 101 results weighted.
- Jev requests: 11 total (2 outline validation runs at 9 questions each, 9 weighting batches of 9 to 12 questions). Usage: 16236 input tokens, 2334 output tokens.
- Redos: 0 dig redos, 0 decision-model redos. One outline validation re-run was performed because the first run's full answer object was lost to a sandbox wipe; both runs scored all 9 subtopics above 1.0 with no drops.
- Skipped docs: none. All 9 subtopics scored load-bearing or marginal-with-strong-dig and were authored.
- Docs kept/skipped: 9 / 0.
- Weighting ran on DefAPI direct (https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13), not the worker relay; the searXNG digs ran through the n8n searxng-proxy webhook.
- Weak-backing labels in the docs mark claims whose only supporting source scored below 0.5; claims with no supporting source were deleted, not softened.

## Research-db

Full provenance in `research-db/` (schema v2): `preflight.json`, `outline.json`, `archive.json` (101 entries), `digs/01..09-*.json`, `jev-log.json`, `db.ts`.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator-side); agent-side probes replaced by the first real calls: outline validation 200 and 9 of 9 weighting batches 200 on DefAPI direct.
