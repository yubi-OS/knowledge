# The research-db schema v2: what makes a corpus auditable

Scope: the 6 files of the typed research DB committed next to the docs, the shapes they capture, and the plain-UTF-8 rule that keeps them verifiable. This is an internal-record subtopic: every shape is defined in the source document, yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc), and the parent brief (session/refs-mint/MINT-BRIEF.md). No dig was run and none was needed.

## Why a research DB exists

The skill's thesis is that the whole run must be auditable: every collected data point carries a jev quality weight, every authored claim carries a source URL, and the typed research DB committed next to the docs is what makes the corpus auditable months later (source doc). Guideline 9 makes the DB's completeness a first-class requirement, and guideline 6 makes honest gaps deliverables, which only works if the DB records them (source doc).

## The 6 files

1. `preflight.json` records the Phase 0 probe results: the searXNG url, probe results, and unresponsive engines, plus the decide url, model, and probe answer (source doc). The skills variant records the orchestrator's campaign preflight and skips the per-mint agent-side probe for speed (skills-variant brief, 2026-10-06).
2. `outline.json` carries the topic, the subtopics with their nn, slug, scope, and seed queries, the full score-metric validation answers (score, probabilities, confidence, legend), the usage tokens, and the dropped and kept lists (source doc).
3. `archive.json` is a JSON array with one entry per collected result: query, title, url, snippet, collected_at, weight as a float or null, and the full decision record: type, instructions, model, the raw answer object, usage tokens, requested_at, plus redo_of pointing at the superseded entry index when a result was rescored (source doc).
4. `digs/NN-slug.json` records per-doc dig state: scope, queries_attempted with attempt counts and raw/kept results, redo_count, a redo_log of attempt, reason, and new queries, results_kept urls, and outcome authored or skipped with an optional skip_reason (source doc).
5. `jev-log.json` appends one entry per jev HTTP request: timestamp, endpoint, state, model, question count, question names, metric types, and usage tokens (source doc).
6. `db.ts` declares TypeScript interfaces matching ALL of the above shapes, with a comment mapping each file to its interface (source doc).

The metric mapping table drives what the decision records must contain: score for outline validation, noul for source weighting, choice for rare either-or calls; every decision stores type, instructions, criteria, the raw answer object with probabilities and confidence, model, usage tokens, and timestamp (source doc).

## The plain-UTF-8 rule

Research-db files are plain UTF-8 JSON only, and base64-encoded text must never be pushed as file content (source doc). This is not a style rule; the changelog and anti-patterns explain it: on 2026-10-05, PR #21's whole research-db landed as base64-encoded blobs, which is why the post-push verification re-fetches each .json and parses it (source doc). The parent brief states the same rule for the push chain: blobs go up with encoding utf-8, never base64 (parent brief).

## What the DB catches

Each file exists to catch a specific failure mode recorded in the run history:

- archive.json with null weights catches shipping unweighted results, the failure PRs #16 and #21 shipped (source doc).
- digs files with zero results catch the suspended-engines mint of 2026-09-29 that had to be re-minted (source doc).
- jev-log.json catches the unbatched, unlogged jev calls the anti-patterns warn about (source doc).
- outline.json's validation answers keep the outline decomposition auditable rather than invented (source doc).

## This corpus's instance

This corpus lands its DB under research-db/ with preflight.json (2026-10-06 campaign preflight record), outline.json (8 subtopics, 1 score request, 0 dropped), archive.json (60 weighted entries), 5 digs files (02, 03, 04, 05, 07; the 3 internal-record subtopics carry no digs file), jev-log.json (6 requests), and db.ts with the interfaces (research-db/).

## Sources

- yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc, fetched 2026-10-07)
- session/refs-mint/MINT-BRIEF.md (parent brief, 2026-10-05)
- session/refs-mint/MINT-BRIEF-SKILLS.md (skills-variant brief, 2026-10-06)
- Internal-record subtopic, no dig.
