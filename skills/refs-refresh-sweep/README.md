# Knowledge Corpus: refs-refresh-sweep

Minted 2026-10-06 from ground source `yubi-OS/yubiOS skills/refs-refresh-sweep/SKILL.md` (16,365 bytes). Topic: full-corpus deep-research refresh sweep for a repo documentation corpus, enumerate every doc and compute staleness signals, triage with the jev-1.13 decision model, dig with self-hosted searXNG and weight every result as it lands, persist a typed research DB on a PR, then fan out one parallel subagent per top-ranked doc, each opening its own PR. The corpus explicates the skill; the SKILL.md remains the primary source of record.

## Documents

| NN | doc | scope |
|---|---|---|
| 01 | 01-scope-and-boundaries.md | When to run the sweep vs single-doc refresh, structure audit, event history; the anonymous-HTTP dig constraint. Internal-record, no dig. |
| 02 | 02-endpoints-and-preflight.md | The 3 endpoints and the Phase 0 health gate, including the unresponsive-engines blind spot and the dated endpoint-form correction. |
| 03 | 03-enumeration-and-signals.md | Phase 1 enumeration: Contents API listing, raw fetch concurrency, staleness signals, incremental persistence. |
| 04 | 04-jev-triage-and-batching.md | Phase 2 triage: state shape, 5-doc noul batching, 15 req/min/IP cap, kill-resilience logging. |
| 05 | 05-ranking-and-dig-strategy.md | Phase 3: the 0.7 jev + 0.3 age blended rank, top-N bounding, SearXNG suspension mechanics (1 hour too-many-requests, 1 day access-denied). |
| 06 | 06-quality-weighting.md | Phase 4: noul source-quality weighting, batch-as-they-land, weight separation, metric limits. |
| 07 | 07-research-db-persistence.md | Phase 5: archive.json, digs, typed db.ts, plan doc, in-repo PR. Internal-record, no dig. |
| 08 | 08-subagent-fan-out-and-merge.md | Phase 6: self-contained subagent prompts, append-only edits, honest no-change verdicts, POST /merges orchestration. |
| 09 | 09-failure-modes-and-verification.md | Anti-patterns (UA 1010, unbatched calls, /tmp wipes, draft-PATCH no-op), 5 red flags, verification checklist. |

## Research summary

- Results collected: 84 (top 6 per query, 14 queries across 7 web-shaped subtopics; 31 to 54 raw results per query).
- Weight split: 30 results at weight >= 0.5 (authoritative backing), 54 below (weak backing, labeled in text). Range 0.01 to 0.97.
- jev: 8 requests total (1 outline score validation with 9 questions, 7 noul weighting batches of 12), 10,660 input tokens, 1,763 output tokens, $0.000895. Endpoint: DefAPI direct (https://api.defapi.org/api/v1/decisions), model typesafe/jev-1.13, 0 rate-limit events.
- Redos: 0. No dig failed or came back thin; the REDO rule was never triggered.
- Skipped docs: none. All 9 outline subtopics authored; 4 marginal-scored subtopics kept because their digs came back strong, and 1 of them (07) is an internal-record subtopic kept as core schema documentation.

## Source-of-record discipline

Claims from the ground SKILL.md are attributed to the source doc. Claims from digs carry their URL and jev weight; anything under 0.5 is labeled weak backing in the text. One dated operational correction is recorded in doc 02 (the searXNG proxy endpoint form changed as of 2026-10-06).

## Skips and gaps

None.

## Preflight

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator-side probe; agent-side probe skipped for speed per skills-variant brief); decide via DefAPI direct verified live by the first real request (HTTP 200, no 429s).
