# refs-refresh-jev-weighted

Knowledge corpus on **jev-weighted documentation refresh sweeps**: the process spec for triaging a documentation corpus with a decision model, digging with a self-hosted metasearch, weighting every collected result, and landing cited updates as a reviewable PR.

Minted 2026-10-05 from yubi-OS/yubiOS `refs/refs-refresh-jev-weighted-2026-09-29.md` (the process spec plus the run stats of the 2026-09-29 sweep).

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-corpus-enumeration-and-signals.md](01-corpus-enumeration-and-signals.md) | Enumerating the corpus and computing per-file staleness signals (filename age, size, title, section presence) |
| 02 | [02-decision-model-triage.md](02-decision-model-triage.md) | Scoring every doc with a typesafe decision model via POST /api/decide, batched and paced |
| 03 | [03-ranking-and-queue-selection.md](03-ranking-and-queue-selection.md) | Blending the decision score with normalized age into a bounded refresh queue |
| 04 | [04-searxng-metasearch-digs.md](04-searxng-metasearch-digs.md) | Digging with self-hosted searXNG reached through an n8n webhook proxy; thin-dig redo rule |
| 05 | [05-collection-quality-weighting.md](05-collection-quality-weighting.md) | Weighting every collected result with the noul metric before any of it can back a claim |
| 06 | [06-research-db-persistence.md](06-research-db-persistence.md) | Persisting signals, verdicts, digs, and weights as a typed, append-only dataset |
| 07 | [07-cited-authoring.md](07-cited-authoring.md) | Authoring cited updates: per-claim URL plus weight, delete-don't-soften, skip-not-pad |
| 08 | [08-reviewable-pr-landing.md](08-reviewable-pr-landing.md) | Landing as one draft PR with a fixed-format body and post-push verification |

## Research summary

- Subtopics validated by jev (score metric): 8 proposed, 8 kept, 0 dropped. All scored between 1.05 and 1.92 (0 = drop); the marginal-scored subtopic 06 stayed because its dig came back strong.
- Results collected: 96 (8 subtopics x 2 queries x top 6 kept per query).
- Weight split: 32 results at weight >= 0.5 (authoritative backing), 64 below 0.5 (weak backing, labeled as such in the docs). Mean weight 0.413.
- jev requests: 22 total (1 probe, 1 outline validation with 8 questions, 20 weighting requests for 96 results), usage 16258 input / 0 output tokens. Model: clef via /api/decide on the steady-orbit worker.
- Dig redos: 0 (all 16 first-attempt queries returned usable results).
- Skipped docs: none. All 8 subtopics authored.

Per-doc dig quality (average jev weight, results at 0.5-plus of 12):

| doc | avg | primary (>= 0.5) |
|---|---|---|
| 01 | 0.338 | 3 |
| 02 | 0.355 | 2 |
| 03 | 0.321 | 3 |
| 04 | 0.532 | 6 |
| 05 | 0.433 | 4 |
| 06 | 0.477 | 6 |
| 07 | 0.515 | 6 |
| 08 | 0.332 | 2 |

## Research DB

Under `research-db/`:

- `preflight.json`: endpoint probes taken 2026-10-05 before the run.
- `outline.json`: subtopics, seed queries, and the full jev validation record.
- `archive.json`: 96 result rows, each with query, title, URL, snippet, collection time, weight, and the full decision record (instructions, raw answer, batch usage, request time).
- `digs/01..08.json`: per-subtopic dig records (queries attempted, raw and kept counts, redo log, outcome).
- `jev-log.json`: one row per jev HTTP request with usage tokens.
- `db.ts`: TypeScript interfaces for all shapes above.

## Research methodology

Preflight 2026-10-05: searXNG 63 results healthy on the probe query (13 upstream engines degraded or suspended; aggregate healthy); /api/decide (clef) 200.

Sources were collected exclusively through the searXNG proxy endpoint, top 6 per query, spaced at least 1 second apart. Every result was weighted by the clef decision model (noul metric, batched 5 per request, paced at least 1.1 seconds apart); no result shipped unweighted. Claims in the docs carry their source URL and the weight that backed them; weight below 0.5 is labeled weak backing in the text. No dig redo was needed and no doc was skipped.

## Verification

VERIFIED: files 22, research-db 13 parse, weights 96/96 non-null
