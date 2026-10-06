# skills/code-review-and-quality

Knowledge corpus explicating the yubiOS skill `code-review-and-quality` (multi-axis code review with quality gates). Ground source: `yubi-OS/yubiOS skills/code-review-and-quality/SKILL.md`. The corpus deepens the skill; the SKILL.md remains the primary source of record.

## Docs

| NN | file | scope |
|----|------|-------|
| 01 | 01-overview-approval-standard.md | Core posture: review before merge, no exceptions; the approve-on-net-improvement standard |
| 02 | 02-axis-correctness.md | Correctness axis: spec match, edge and error paths, test quality, defect classes |
| 03 | 03-axis-readability.md | Readability and simplicity axis: naming, control flow, fewer lines, abstractions earning complexity |
| 04 | 04-axis-architecture.md | Architecture axis: boundaries, dependency direction, complexity reduction vs relocation, type boundaries |
| 05 | 05-axis-security.md | Security axis: input validation, secrets, injection, XSS, dependency trust, boundary validation |
| 06 | 06-axis-performance.md | Performance axis: N+1, unbounded operations, sync vs async, re-renders, pagination, hot paths |
| 07 | 07-remedies-and-sizing.md | Named structural remedies and change sizing: 100/300/1000 targets, splitting strategies |
| 08 | 08-process-and-labels.md | The 5-step review process and the severity prefix system (Critical/Required/Nit/Optional/FYI) |
| 09 | 09-culture-and-multi-model.md | Review speed, dispute hierarchy, honesty, dependency discipline, multi-model review, anti-rationalizations |

## Research summary

- Ground source fetched 2026-10-06: `https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/code-review-and-quality/SKILL.md` (25115 bytes).
- Results collected: 144 across 9 subtopics (24 queries, top 6 kept per query; 6 queries were 2 subtopic redos with different phrasing).
- Weight split (jev noul via typesafe/jev-1.13 through DefAPI direct): 55 high (>= 0.5), 89 low (< 0.5) of 144 weighted results; 0 unweighted.
- jev requests: 13 total (1 outline score-validation, 12 noul weighting batches), usage 14643 input / 2923 output tokens.
- Redos: 3 dig redos (axis-readability, axis-architecture, remedies-and-sizing; 1 redo each, attempt 2) after their first digs returned mostly low-weight or off-topic results.
- Skipped docs: none. All 9 validated subtopics authored.
- Thin-dig gaps honestly noted: remedies-and-sizing and culture-and-multi-model carry few high-weight external sources; their docs lean primarily on the source doc, and low-weight citations are labeled weak inline.
- Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide via DefAPI direct, campaign preflight run orchestrator-side (agent-side probe skipped for speed).
