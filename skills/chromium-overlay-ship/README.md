# chromium-overlay-ship knowledge corpus

Knowledge corpus minted from the yubiOS skill `skills/chromium-overlay-ship/SKILL.md` (ground source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/chromium-overlay-ship/SKILL.md, fetched 2026-10-06). The corpus explicates the skill: shipping changes from the HIGH-MEM box Chromium tree into the yubi-OS/chromium-provenance overlay patch series (OMN-165 / Antimony), including box commits, patch generation, bridge transfer, the Git Data API push with SERIES.md discipline, CI dispatch and verification, and the durable-changelog rules.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-environment-facts.md](01-environment-facts.md) | The ubuntu HIGH-MEM box runtime: shell bridge contract, tree/branch/overlay/CI facts, gn-cipd, and the build classes that decide relink vs repack. |
| 02 | [02-box-commit-discipline.md](02-box-commit-discipline.md) | Explicit-path git add, per-command safe.directory, and explicit commit identity on the box tree. |
| 03 | [03-patch-generation.md](03-patch-generation.md) | Cumulative fixup diffs vs new-member diffs against the series base commit, --binary for assets, and the file-ownership overlap check. |
| 05 | [05-overlay-push.md](05-overlay-push.md) | Git Data API chain to yubi-OS/chromium-provenance plus SERIES.md row insert/replace discipline. |
| 06 | [06-ci-verification.md](06-ci-verification.md) | arm64-chromium-build.yml dispatch via workflow_dispatch and workflow-filtered run polling at the new head sha. |
| 08 | [08-failure-modes.md](08-failure-modes.md) | Six paid-for failure modes: bridge payload escaping, pgrep self-match, mtime staleness, multi-target icon namespaces, artifact-vs-generator verification, shadow-DOM puppeteer checks. |
| 09 | [09-ship-discipline.md](09-ship-discipline.md) | The four guidelines, the full 7-step ship sequence, and the durable changelog (SERIES.md rows plus COMPANY.md memory). |

## Skipped docs

- 04 chunked-transfer: dropped at outline validation (score 0.66, 0.57 probability on padding). Its mechanics are still covered inside 03 and 09 where they bear on patch handling.
- 07 linear-comments: dropped at outline validation (score 0.31, 0.75 probability on padding). The 7-step sequence including the numbered Linear comment is recorded in 09 as source-doc fact.

## Research summary

- Ground source: yubi-OS/yubiOS skills/chromium-overlay-ship/SKILL.md, 7152 B fetched 2026-10-06. Primary source of record; every doc cites it as the grounding spine.
- Results collected and weighted: 60 (34 weight >= 0.5, 26 weight < 0.5, 0 unweighted). Weighting metric noul (jev-1.13 via DefAPI direct), outline validation metric score.
- jev requests: 13 HTTP total. Logged in research-db/jev-log.json: outline validation (1), the final weighting run (5 batches of 12), a shape probe (1), and the 06 redo weighting (1). An additional early weighting run of 5 batches (60 questions) was discarded because the noul response shape was misparsed (weights read from a nonexistent probabilities key); those results were re-requested in the logged run. The discard is recorded as one note entry in jev-log.json.
- Digs: 10 searXNG queries for 5 web-shaped subtopics (2 each), plus a 1-redo dig for 06 (attempt 1 top hits were GitHub homepage and login noise). Subtopics 02, 04, 09 are internal-record subtopics, no dig.
- Usage tokens (logged entries): see research-db/jev-log.json per entry; the discarded run's usage was not captured.

## Per-doc sources (results kept, primary weight >= 0.5)

| doc | results weighted | primary (>= 0.5) |
|---|---|---|
| 01-environment-facts | 12 | 10 |
| 02-box-commit-discipline | 0 (internal record) | 0 |
| 03-patch-generation | 12 | 6 |
| 05-overlay-push | 12 | 5 |
| 06-ci-verification | 12 | 5 |
| 08-failure-modes | 12 | 8 |
| 09-ship-discipline | 0 (internal record) | 0 |

## Redo log

- 06-ci-verification: 1 redo. Attempt 1 queries returned GitHub homepage/login pages and generic guides (weights 0.36 to 0.62, thin on workflow_dispatch and runs API). Attempt 2 queries surfaced docs.github.com REST references for workflows (0.92) and workflow runs (0.91). See research-db/digs/06-ci-verification.json.

## Skipped docs and gaps

- Skipped at validation: 04 chunked-transfer, 07 linear-comments (scores and probabilities in research-db/outline.json).
- No doc was skipped for a thin dig after redos; 06 was rescued by its redo.

Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator-side); /api/decide (typesafe/jev-1.13 via DefAPI direct endpoint) 200.
