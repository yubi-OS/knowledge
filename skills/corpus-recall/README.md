# corpus-recall

Knowledge corpus explicating the yubiOS skill `corpus-recall` (ground source: yubi-OS/yubiOS skills/corpus-recall/SKILL.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/corpus-recall/SKILL.md). The skill covers three recall paths over the yubi-OS/knowledge repo (codeload mirror + grep, one-call full text via the steady-orbit /api/repo-items endpoint, and raw single-doc reads) plus the provenance discipline attached to its corpora.

## Docs

- [01-repo-layout.md](01-repo-layout.md) - the knowledge/<ref>/ corpus anatomy: authored docs, README charter, and the research-db provenance tree. (Internal-record subtopic, no dig.)
- [02-mirror-grep.md](02-mirror-grep.md) - Path 1: codeload tarball mirror, rg over docs and research-db, scripts/recall.sh and index.tsv.
- [03-repo-items.md](03-repo-items.md) - Path 2: one-call full-text retrieval from the steady-orbit worker, its measured profile, and the worker-executor-only rule.
- [05-raw-reads.md](05-raw-reads.md) - Path 3: known-path single-doc reads from raw.githubusercontent.com, no auth, no budget.
- [06-provenance-discipline.md](06-provenance-discipline.md) - inline citations with jev weights, doc-path attribution, and archive cross-checking.
- [07-usage-patterns.md](07-usage-patterns.md) - worked examples, path selection, context hygiene, and the read-only split from knowledge-corpus-mint. (Internal-record subtopic, no dig.)

## Research summary

- Results collected: 48 (top 6 per query across 8 queries over 4 web-shaped subtopics)
- Weight split: 16 high (>= 0.5) / 32 low (< 0.5) of 48
- Jev: 5 requests, usage in 5460 / out 989 tokens (outline validation 7 questions, weighting 48 noul questions in 4 batches, all via https://api.defapi.org/api/v1/decisions)
- Redos: 0
- Skipped docs: 1 - 04-sandbox-egress scored 0.04 (padding) in outline validation; its content (the CF error 1010 workers.dev block) is covered inside 03-repo-items as a property of Path 2.

Subtopics 01 and 07 are internal-record subtopics grounded entirely in the source doc; no dig was run for them.

## Gaps

- None beyond the dropped subtopic noted above.

Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator); decide via https://api.defapi.org/api/v1/decisions (jev-1.13), agent-side probe skipped per brief.
