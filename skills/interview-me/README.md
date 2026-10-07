# interview-me knowledge corpus

Knowledge corpus explicating the yubiOS skill `interview-me` (ground source: `yubi-OS/yubiOS skills/interview-me/SKILL.md`, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/interview-me/SKILL.md).

Topic: extracting what the user actually wants instead of what they think they should want, through one-question-at-a-time interviewing with hypothesis-and-confidence discipline until ~95% confidence about the underlying intent.

## Docs

- 01-want-vs-should-gap.md - Why stated requests diverge from actual intent and why pre-plan elicitation is the cheapest moment to close it
- 02-trigger-conditions.md - When to invoke the interview (missing who/why/success/constraint, conventional asks, explicit invocation) and when not to, plus the live-user loading constraint
- 03-hypothesis-confidence.md - The one-sentence hypothesis with an honest 0-100 confidence number and a stated reason below 70 percent
- 04-one-question-guess.md - One question at a time with a guess attached, why batches fail, and the sycophancy risk of leading questions
- 05-want-vs-should-detection.md - Detecting sophistication-signaling and convention-deferring answers and the justification-free probe question
- 06-restate-and-confirm.md - The six-line restate format including the non-negotiable out-of-scope line and the explicit-yes confirmation gate
- 07-stop-condition.md - The 95 percent confidence stop test (predict the next three answers), the grind floor, and stepping back
- 08-skill-ecosystem.md - Downstream handoffs to idea-refine, spec-driven-development, planning-and-task-breakdown, and the contrast with doubt-driven-development and source-driven-development
- 09-rationalizations-red-flags.md - The rationalization table, red flags, and the post-use verification checklist

## Research summary

- Results collected and weighted: 96 (high >= 0.5: 30, low < 0.5: 66)
- Jev requests: 8 (usage: 10245 input tokens, 1895 output tokens) via DefAPI direct (typesafe/jev-1.13)
- Outline validation: 9 subtopics, 0 dropped (score metric, all kept)
- Redos: 6 subtopics redug once with different queries after run-1 noise (dictionary/retail first-hits); subtopics 05 and 06 redug a second time and still returned thin external sources, so they are authored on the source-doc spine with weak external backing labeled in text
- Skipped docs: none
- Preflight 2026-10-06: campaign preflight healthy (orchestrator-side, searXNG + decide); agent-side probes skipped per speed optimizations

## Per-doc sources

| doc | dig results |
|---|---|
| 01 | want-vs-should-gap | 12 results kept, 6 primary (>= 0.5) |
| 02 | trigger-conditions | internal-record subtopic, no dig |
| 03 | hypothesis-confidence | 12 results kept, 6 primary (>= 0.5) |
| 04 | one-question-guess | 12 results kept, 6 primary (>= 0.5) |
| 05 | want-vs-should-detection | 24 results kept, 7 primary (>= 0.5) |
| 06 | restate-and-confirm | 24 results kept, 2 primary (>= 0.5) |
| 07 | stop-condition | 12 results kept, 3 primary (>= 0.5) |
| 08 | skill-ecosystem | internal-record subtopic, no dig |
| 09 | rationalizations-red-flags | internal-record subtopic, no dig |

## Research db

Full provenance in `research-db/`: preflight.json, outline.json, archive.json (one entry per collected result with jev noul weight and raw answer), jev-log.json (one entry per jev HTTP request), digs/ (one record per subtopic with redo log), db.ts (schema interfaces).
