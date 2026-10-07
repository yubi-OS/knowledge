# 06 - The research DB: schema v2

Scope: research-db schema v2: preflight.json, outline.json, archive.json, digs/, jev-log.json, db.ts; what each file must record and the plain-UTF-8 (never base64) rule.

Grounded in the source doc yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md only. Internal-record subtopic, no dig.

## Why a typed DB ships with the corpus

The source doc's framing: "Every collected data point carries a jev quality weight and every authored claim carries a source URL. The whole run is auditable via a typed research DB committed next to the docs." The DB is what makes a minted corpus auditable months later (source doc, guideline 9: keep the research DB typed and complete).

## The six files (source doc, Phase 3 and parent-brief schema v2)

1. preflight.json: the searXNG and decide probe results (url, counts, model). This is the Phase 0 gate evidence; without it the corpus cannot show it was preflighted before digging.
2. outline.json: the topic, the subtopics (nn, slug, scope, seed_queries), the score-metric validation answers in full (score, probabilities, legend, confidence, usage), and the dropped and kept lists.
3. archive.json: a JSON array of result entries, one per collected result, each carrying: query, title, url, snippet, collected_at, weight (a float or null), a full decision record (type, instructions, model, the raw answer object with probabilities and confidence, usage with input and output tokens, requested_at), and redo_of, which carries the index of the superseded unweighted entry when a result was rescored.
4. digs/<NN>-<slug>.json: one per doc, carrying nn, slug, scope, queries_attempted (each with query, attempt, raw_results, kept), redo_count, redo_log (each entry with attempt, reason, new_queries), results_kept (urls), and outcome (authored or skipped, with skip_reason when skipped).
5. jev-log.json: one entry per jev HTTP request: timestamp, endpoint, state, model, n_questions, question_names, metric_types, and usage tokens.
6. db.ts: TypeScript interfaces matching ALL of the above shapes, with a comment mapping each file to its interface. The parent-brief interface names are DugResult, DecisionRecord, DigRecord, OutlineRecord, JevLogEntry, and PreflightRecord.

## What "store ALL info" means in practice

Three properties distinguish the v2 schema from a results dump (source doc):

- Per-decision completeness. Store EVERY decision's full record: type, instructions, criteria, the raw answer object (probabilities, legend, confidence), model, usage tokens, and timestamp. A weight floating alone in a row is not auditable; the raw answer object is.
- Redo lineage. redo_of in archive.json and redo_log in digs/*.json exist so a redo can be traced to what it replaced. The metric mapping table ties each decision to the right metric (score for outline validation, noul for source weighting, choice for rare either-or judgments).
- Failure evidence. An outcome of "skipped" with a skip_reason is a first-class record, not a shrug. Honest gaps are deliverables (source doc, guideline 6).

## The plain-UTF-8 rule

Plain UTF-8 JSON only; NEVER push base64-encoded text as file content (source doc, Phase 3). This rule is not decorative: the v2 changelog records that during the 2026-10-05 live run, PR #21's whole research-db landed as base64-encoded text, and post-push verification (re-fetching each file and json.loads-ing it) was made a required phase precisely to catch that failure class. The anti-patterns section lists "pushing base64-encoded text as blob content" with the same incident cited, prescribing encoding: "utf-8" with plain text.

## The unweighted-archive failure

The changelog also records that PRs #16 and #21 shipped unweighted archives during the same run, which is why post-push verification requires checking that every archive entry carries a non-null weight, not just that the files parse. A parseable archive with null weights is still a failed mint under schema v2.

## Relationship to the corpus docs

The docs cite weights that live in archive.json and scopes that live in outline.json and digs/*.json. A reader who doubts a doc claim can walk: doc claim, source URL, archive.json entry, decision record, raw answer. That chain is the audit the schema exists to enable.

## Sources considered

No dig results for this subtopic (internal-record subtopic, no dig). Grounding: yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc, fetched 2026-10-07), including its v2 changelog entry.
