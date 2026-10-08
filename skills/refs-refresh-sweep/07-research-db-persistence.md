# 07 - Phase 5: Research DB Persistence

Scope: the typed, in-repo research database a sweep run leaves behind, and why it lands on a PR branch rather than in a scratch directory.

Grounding spine: `yubi-OS/yubiOS skills/refs-refresh-sweep/SKILL.md` (source doc) plus the parent mint brief's schema v2. This subtopic is internal-record material; no searXNG dig was run for it, because the schema is defined by the source doc and the mint brief rather than by external systems.

## The 4 artifacts

Per the source doc, the research DB lands in-repo (for yubiOS: `papers/data/<run-slug>/` on a PR branch) as:

1. `archive.json`: every corpus row plus jev verdict, task_id, cost, and timestamp.
2. `digs/<doc>.json`: per-doc queries, results, and each result with its quality weight.
3. `db.ts`: a typed index (interfaces plus run constants) over the JSON.
4. A plan doc at `refs/<run-slug>.md`: process, stats, ranked queue, per-doc dig summaries, and honest findings.

The mint brief's schema v2 extends this exact set with `preflight.json`, `outline.json`, and `jev-log.json`, and fixes the interface names: `DugResult`, `DecisionRecord`, `DigRecord`, `OutlineRecord`, `JevLogEntry`, `PreflightRecord`.

## What each artifact must carry

- `preflight.json`: the Phase 0 probe results (date, searXNG URL and probe outcome, decide URL, model). The verification checklist requires preflight to be recorded in the DB before any dig ran (source doc).
- `archive.json`: one entry per collected result: query, title, url, snippet, collected_at, weight (float or null), the full decision record (type, instructions, model, raw answer object with probabilities and legend, usage tokens, requested_at), and `redo_of` (index of a superseded unweighted entry when rescored, else null).
- `digs/<NN>-<slug>.json`: per doc: nn, slug, scope, `queries_attempted` (query, attempt, raw count, kept count), `redo_count`, `redo_log` (attempt, reason, new queries), `results_kept`, outcome (`authored` or `skipped`), and `skip_reason` where applicable.
- `jev-log.json`: one entry per jev HTTP request: requested_at, endpoint, state, model, n_questions, question names, metric types, and usage tokens.
- `outline.json`: topic, subtopics with nn/slug/scope/seed queries, and the full validation record: metric, criteria, model, per-question answers, usage, dropped and kept lists.

## Why in-repo on a PR branch

Three reasons follow from the source doc:

1. Auditability is the point. The source doc's "When to Use" list names "an auditable, persisted research artifact" as an entry condition; a DB nobody can re-read is not an audit trail.
2. Reviewability. The DB ships as the run's PR (the validating run's Phase 5 PR #260 carried the plan doc plus `papers/data/refs-refresh-2026-09-29/` with `archive.json`, 14 `digs/*.json`, and `db.ts`, merged via POST /merges), so a reviewer sees the evidence next to the claims.
3. Machine re-use. `db.ts` gives downstream consumers typed access without re-parsing by hand; the archive carries every raw answer object so any later consumer can re-derive weights or audit the model's behavior.

## The rules that keep the DB honest

- Plain UTF-8 JSON only; never push base64-encoded text as file content.
- Every collected result has a jev quality weight before it can back a claim; unweighted results cannot be cited (doc 06).
- Every refresh finding line carries a source URL plus its weight (verification checklist).
- Post-push verification is required: re-fetch each research-db JSON and confirm it parses, and confirm every archive entry's weight is non-null.
- Incremental persistence applies here too: write after every batch or doc, because container restarts killed real work in the validating run (source doc anti-patterns).

## Relationship to the doc corpus

The DB is the evidence layer; the docs are the prose layer. This corpus (minted 2026-10-06) follows the same contract: `research-db/archive.json` holds all 84 weighted results, `research-db/digs/*.json` holds per-subtopic dig records, `db.ts` types them, and this README indexes the prose. Every claim in docs 02 to 06 and 08 to 9 traces to either the source doc or a row in that archive.
