# planning-and-task-breakdown knowledge corpus

A knowledge corpus minted from the yubiOS ground source `yubi-OS/yubiOS skills/planning-and-task-breakdown/SKILL.md` (16,920 bytes, fetched 2026-10-06). Topic: breaking work into ordered tasks from a spec, estimating scope, decomposing large work, ordering implementable steps, and identifying parallelizable parts.

The corpus explicates the skill; the SKILL.md remains the primary source of record and every doc cites it for its grounding spine.

## Index

| Doc | Slug | One-line scope |
|-----|------|----------------|
| 01 | plan-mode-first | Enter read-only plan mode before code; the plan document is the output of planning. |
| 02 | dependency-graph-and-ordering | Map the dependency stack (schema to models to endpoints to UI) and order work bottom-up. |
| 03 | vertical-slicing | Slice by user capability, one end-to-end feature path at a time, not layer by layer. |
| 04 | task-structure-and-acceptance-criteria | Every task carries description, testable acceptance criteria, verification commands, dependencies, files, scope. |
| 05 | task-sizing-and-scope-estimation | Size XS through XL by files touched; break down anything L or larger; signals a task is too big. |
| 06 | output-files-and-task-list-target | plan.md for decisions and risks; the task list target (tasks/todo.md default or external tracker); never overwrite an incomplete plan. |
| 07 | parallelization-strategy | Safe to parallelize, must be sequential, needs coordination: compute parallelism from explicit dependencies. |
| 08 | anti-patterns-and-verification | Rationalizations, red flags, and the pre-implementation checklist. Internal-record subtopic, no dig. |

## Research summary

- Results collected: 84 (top 6 per query across 14 searXNG queries, 7 web-shaped subtopics, 2 queries each).
- Weight split: 2 high (weight >= 0.5) / 82 low (weight < 0.5). The high-weight sources are the VS Code agent planning documentation and Linear's GitHub integration documentation. Most weak results are generic aggregator or off-topic pages; docs cite them as weak backing where used.
- jev requests: 7 total (1 outline validation with 8 score questions, 6 weighting batches of 14 noul questions), all against DefAPI direct (api.defapi.org, model typesafe/jev-1.13).
- Redos: 0. All 14 dig queries returned 200 on first attempt; no dig needed redoing.
- Skipped docs: none. All 8 subtopics scored load-bearing in outline validation (1.73 to 1.97) and all were authored.
- Gaps: none.

## Preflight

Preflight 2026-10-06: searXNG 14 queries returned 200 healthy; jev decide (DefAPI direct, typesafe/jev-1.13) 200. Campaign preflight run orchestrator-side; agent-side probe skipped for speed per the skills-variant brief.

## Source doc sections covered

Overview and When to Use (01), The Planning Process steps 1 and 2 (01, 02), step 3 (03), step 4 (04), step 5 (06), Task Sizing Guidelines (05), Output Files and Task List Target (06), Plan Document Template (06), Parallelization Opportunities (07), Common Rationalizations and Red Flags (08), Verification (08), See Also Definition of Done (04). The SKILL.md's curve-guided-rsi primitive-coverage audit-trail sections (cycles 4 through 7) are internal audit-trail records of the source repo and are not expanded here.