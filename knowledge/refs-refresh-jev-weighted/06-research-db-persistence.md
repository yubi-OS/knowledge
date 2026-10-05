# 06: Persisting the Typed Research Database

Scope: how the sweep records every signal, verdict, dig, and weight into a versioned, typed dataset that travels with the PR, so the whole run is auditable without rerunning anything.

## Why persist at all

A refresh sweep that only edits docs is unfalsifiable: a reviewer sees the output but not the evidence chain. The sweep therefore commits a research DB alongside the docs, on the same branch. The reference run committed `papers/data/refs-refresh-2026-09-29/` with archive.json (all 234 rows of signals plus jev verdicts with task_ids and costs), 12 per-doc dig files with every result's quality weight, and a typed index (`db.ts` with RefDoc, SearchResult, Dig, DocDoc interfaces plus run constants). The design intent, stated in the run's own verification notes: every jev row carries task_id plus consumed cost and is re-auditable at the provider.

## The shapes

Six artifacts cover the whole run:

1. **preflight.json** records the probe of both endpoints before the run: the searXNG URL, probe result counts, unresponsive engines, and the decision endpoint's model and probe answer. If the preflight is missing, nothing downstream is trustworthy.
2. **outline.json** carries the topic decomposition: subtopics with scope lines and seed queries, plus the full validation record (metric, criteria, model, per-subtopic answers with probabilities and confidence, usage, dropped and kept lists).
3. **archive.json** is one array row per collected result: query, title, URL, snippet, collection timestamp, weight, and the full decision record (type, instructions, model, raw answer object, usage tokens, request time). A `redo_of` field points at the superseded entry when a result was rescored, so rescoring never overwrites history.
4. **digs/&lt;NN&gt;-&lt;slug&gt;.json** is the per-subtopic dig record: queries attempted with raw and kept counts, redo count, a redo log, the kept URLs, and the outcome (authored or skipped, with skip reason).
5. **jev-log.json** is one row per HTTP request to the decision endpoint: endpoint, state, model, question count, question names, metric types, and usage tokens. This is the spend and pacing ledger.
6. **db.ts** maps each file to a TypeScript interface, so the dataset has a compile-checked shape and not just conventions.

## The append-only provenance pattern

The design matches published provenance-logging practice. Community provenance-log schemas describe provenance records as "append-only" sequences whose "order matches emission order" (https://github.com/Formspec-Labs/work-spec/blob/main/schemas/wos-provenance-log.schema.json, weight 0.6302), and research-data provenance schemas model the same append-only log shape (https://github.com/albarami/burhan_research/blob/main/schemas/provenance_log.schema.json, weight 0.618). Academic work makes the stronger argument: embedding provenance into the dataset itself, formatted and stored alongside the data, is what makes provenance travel with the artifact instead of living in a separate system that drifts (https://arxiv.org/abs/2603.27348, weight 0.4043, weak backing; the PDF at https://arxiv.org/pdf/2603.27348, weight 0.5547).

The typed layer is what keeps the schema honest over time. TypeScript's handbook treats interfaces as the way to give a shape a name the type checker enforces (https://www.typescriptlang.org/docs/handbook/interfaces.html, weight 0.9481); a typed index over JSON files means a schema violation is a compile error in the tooling, not a silent corruption discovered at audit time. JSON Schema is the complementary vocabulary for validating the JSON files themselves (https://json-schema.org/, weight 0.9044).

## Review discipline

Three rules keep the DB reviewable:

1. **Plain UTF-8 JSON only.** Never push base64-encoded content as file content; reviewers must be able to read and diff the data.
2. **Post-push verification.** After the push, every research-db .json is re-fetched from raw.githubusercontent and parsed; every archive entry must carry a non-null weight. A mint whose research DB is missing from the PR diff is a failed mint.
3. **The DB ships in isolation.** The reference run committed no edits to existing refs/ docs on the same PR, so the evidence layer stays reviewable on its own; the refresh edits land as follow-up PRs.

## What the DB enables later

Because every row is typed and timestamped, the next sweep can diff its own signals against the last run's (which docs aged into the queue, which weights moved), and any reader can re-audit the spend and the verdicts at the decision provider using the logged task identifiers. The DB is not an accessory to the sweep; it is the artifact that makes the sweep a process instead of an edit.
