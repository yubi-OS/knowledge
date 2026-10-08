# 08: Anti-patterns and Verification

**Scope:** Common rationalizations, red flags, and the pre-implementation verification checklist that gates the start of coding. Internal-record subtopic: the source doc enumerates these; no dig was run.

## Common rationalizations

The source doc (yubi-OS/yubiOS skills/planning-and-task-breakdown/SKILL.md) pairs 5 rationalizations with their realities:

1. "I'll figure it out as I go." Reality: that is how you end up with a tangled mess and rework. 10 minutes of planning saves hours.
2. "The tasks are obvious." Reality: write them down anyway. Explicit tasks surface hidden dependencies and forgotten edge cases.
3. "Planning is overhead." Reality: planning is the task. Implementation without a plan is just typing.
4. "I can hold it all in my head." Reality: context windows are finite. Written plans survive session boundaries and compaction.
5. "The old tasks/plan.md is stale, I'll just replace it." Reality: unchecked tasks may be mid-build in another session. Overwriting them destroys work state that exists nowhere else. Stop and ask.

The last one is the only entry that touches destructive action on existing artifacts, and it restates the never-overwrite rule of doc 06.

## Red flags

The source doc lists 8 red flags observable in a plan or a planning session:

1. Starting implementation without a written task list.
2. Overwriting a `tasks/plan.md` or `tasks/todo.md` that still has unchecked tasks for different work, without asking.
3. Writing `tasks/todo.md` when the project has designated an external tracker, or scattering tasks across both.
4. Tasks that say "implement the feature" without acceptance criteria.
5. No verification steps in the plan.
6. All tasks are XL-sized.
7. No checkpoints between tasks.
8. Dependency order is not considered.

Each red flag maps to a positive rule elsewhere in the skill: 1 and 4 to the task template (doc 04), 2 to the task list target (doc 06), 3 to the tracker mapping, 6 to the sizing table (doc 05), 7 to the checkpoint cadence, 8 to the dependency graph (doc 02).

## Pre-implementation verification

Before starting implementation, the source doc requires confirming all of the following:

- Every task has acceptance criteria.
- Every task has a verification step.
- Task dependencies are identified and ordered correctly.
- Tasks are recorded in the task list target (default `tasks/todo.md`).
- No pre-existing incomplete plan was overwritten without explicit user confirmation.
- No task touches more than about 5 files.
- Checkpoints exist between major phases.
- The human has reviewed and approved the plan.

Two items deserve emphasis. The 5-file ceiling is the M size from the sizing table made absolute: it is a hard check, not a vibe. The last item makes the plan a human approval gate, which matches the read-only plan mode contract of doc 01: the agent proposes, the human approves, then implementation starts.

## Why an internal-record doc still matters

This subtopic's content is entirely enumerated in the source doc, so no web dig was run and every claim above carries the source doc as its citation. The value of writing it out is auditability: a reviewer can check a produced plan against these 8 red flags and 8 checklist items mechanically. For the corpus-audit consumers of this repository (the curve-guided primitive coverage map), this doc is the skill's failure-mode record: it states what goes wrong when the other 7 practices are skipped.

**Primary sources for this doc:** the source doc (yubi-OS/yubiOS skills/planning-and-task-breakdown/SKILL.md). **Digs:** none. This is an internal-record subtopic; no dig was run and no external claims were added.