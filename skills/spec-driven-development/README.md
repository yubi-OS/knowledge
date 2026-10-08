# Spec-Driven Development - Knowledge Corpus

Corpus for yubi-OS/yubiOS skills/spec-driven-development/SKILL.md (ground source of record, 18203 bytes fetched 2026-10-08). Topic: creating specs before coding, and decomposing requirements that span several independently testable capabilities into a capability map of modules before specifying.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | 01-when-to-use.md | Activation triggers (new project, ambiguous requirements, multi-module change, architectural decision, over 30 minutes), the when-not-to-use list, and the scope-check gate. |
| 02 | 02-capability-map.md | Phase 0: detecting bundled capabilities, the capability map (module table, stable kebab-case ids, dependency direction, build order), human gating, recursion per module. |
| 03 | 03-specify-assumptions.md | Phase 1: clarifying questions until requirements are concrete, and surfacing assumptions before any spec content. |
| 04 | 04-spec-document-six-areas.md | The six core spec areas (objective, commands, project structure, code style, testing strategy, boundaries) plus the template's tech stack, success criteria, and open questions. |
| 05 | 05-success-criteria-reframing.md | Reframing vague requirements as specific, testable success criteria. |
| 06 | 06-plan-and-tasks.md | Phase 2 plan (components, order, risks, parallelism, checkpoints, tasks/plan.md) and Phase 3 tasks (session-sized, acceptance criteria, verification, dependency order, 5-file cap). |
| 07 | 07-implement-and-companion-skills.md | Phase 4 implementation and the companion skills: incremental-implementation, test-driven-development, context-engineering, planning-and-task-breakdown (canonical), api-and-interface-design. |
| 08 | 08-spec-alive-and-rationalizations.md | Living-document rules, the 7 rationalizations, the red flags, and the pre-implementation verification checklist. |

## Research summary

- Results collected: 96 (top 6 per query, 16 queries over 8 kept subtopics, searXNG).
- Weight split: 21 primary (weight >= 0.5) / 75 weak (weight < 0.5) of 96.
- jev requests: 9 (1 outline validation score request, 8 noul weighting batches of 12), typesafe/jev-1.13 via DefAPI direct (api.defapi.org/api/v1/decisions). Usage: 10289 input tokens / 1899 output tokens.
- Redo counts: 0 (all 16 digs returned results on attempt 1; all 8 weighting batches succeeded on attempt 1).
- Skipped docs: none. Subtopic 09 (yubiOS 10-primitive coverage appendices) was dropped at outline validation with score 0.07; its content is internal-record and is summarized inside doc 08.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide (typesafe/jev-1.13 via DefAPI direct) campaign preflight run orchestrator-side, agent-side probe skipped for speed.
