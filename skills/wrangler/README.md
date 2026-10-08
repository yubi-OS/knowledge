# Wrangler CLI Knowledge Corpus

Minted from the ground source `yubi-OS/yubiOS skills/wrangler/SKILL.md` (19,510 B fetched 2026-10-06). Topic: the Cloudflare Wrangler CLI for deploying and managing Workers, KV, R2, D1, Vectorize, Hyperdrive, Workers AI, Containers, Queues, Workflows, Pipelines, and Secrets Store.

## Docs

| NN | slug | one-line scope |
|----|------|----------------|
| 01 | retrieval-first-discipline | Prefer current docs over pre-trained knowledge; the 3 retrieval sources, version check, install, init |
| 02 | wrangler-jsonc-config | wrangler.jsonc schema, compatibility_date and flags, binding shapes, environments, wrangler types |
| 03 | local-development | wrangler dev modes, remote bindings, .dev.vars, --test-scheduled |
| 04 | deployment-secrets-versions | deploy flags, secret management, versions and rollback |
| 05 | storage-and-data-services | KV, R2, D1, Vectorize, Hyperdrive commands and bindings |
| 06 | event-compute-platform | Workers AI, Queues, Containers, Workflows, Pipelines, Secrets Store, Pages |
| 07 | observability-and-testing | wrangler tail, observability config, check startup, Vitest integration |
| 08 | troubleshooting-best-practices | common issues, debug commands, the 9 best practices |

## Research summary

- Results collected: 108 (96 from 16 initial queries across 8 subtopics, 12 from the subtopic 08 redo)
- Weight split: 79 at or above 0.5 (primary), 29 below 0.5 (weak, labeled in text)
- jev requests: 10 (1 outline score, 9 noul weighting batches), usage 11,857 input / 2,104 output tokens
- Redo counts: 1 (subtopic 08 dig redone with different queries after denim-brand noise dominated the first pass)
- Skipped docs: none; all 8 subtopics validated score >= 1.49 and authored

## Preflight

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side); decide via DefAPI direct (typesafe/jev-1.13), agent-side probe skipped for speed per skills-variant optimization.

## Method

Outline decomposed by the SKILL.md's own sections and validated with the jev score metric (all 8 subtopics load-bearing, none dropped). searXNG digs ran 2 queries per web-shaped subtopic, top 6 results each. Every result weighted with the jev noul metric via DefAPI direct; docs cite the source doc explicitly for skill-derived claims and carry URL plus weight for dig-derived claims. Full records in `research-db/` (schema v2).
