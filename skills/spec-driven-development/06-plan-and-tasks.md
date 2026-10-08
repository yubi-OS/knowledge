# 06 - Phase 2 Plan and Phase 3 Tasks

Scope: producing a reviewable implementation plan, then breaking it into dependency-ordered, session-sized tasks with acceptance criteria and verification steps.

## Phase 2: the plan

The source doc (yubi-OS/yubiOS skills/spec-driven-development/SKILL.md) gives the plan five steps: identify the major components and their dependencies; determine implementation order, meaning what must be built first; note risks and mitigation strategies; identify what can be built in parallel versus what must be sequential; and define verification checkpoints between phases (source doc).

The plan has an output convention: save it to tasks/plan.md and record the task list in the task-list target defined by planning-and-task-breakdown (default tasks/todo.md; a project may designate an external tracker instead). Create tasks/ if it does not exist, because downstream commands expect those defaults (source doc). The reviewability bar: the human should be able to read the plan and say "yes, that is the right approach" or "no, change X" (source doc).

The doc also fixes authority: planning-and-task-breakdown is the canonical source for the dependency-graph mapping and vertical-slicing mechanics behind these steps. The plan bullets are a lightweight summary; if they ever diverge, planning-and-task-breakdown takes precedence (source doc).

## Phase 3: the tasks

Task decomposition has five properties (source doc):

1. Each task is completable in a single focused session.
2. Each task has explicit acceptance criteria.
3. Each task includes a verification step: a test command, a build, or a manual check.
4. Tasks are ordered by dependency, not by perceived importance.
5. No task requires changing more than about 5 files.

The inline task template is three lines per task: what must be true when done (Acceptance), how to confirm it (Verify), and which files will be touched (Files). The same precedence rule holds: planning-and-task-breakdown owns the full task-sizing and dependency-ordering mechanics and wins on divergence (source doc).

## External grounding (weak)

Work-decomposition practice from the Dojo Consortium describes breaking down work to enable small batch delivery, faster feedback, and predictable outcomes through story slicing and clear acceptance criteria (weight 0.43, weak, https://dojoconsortium.org/docs/work-decomposition/). That matches the source doc's session-sized, acceptance-criteria-carrying tasks. Work-breakdown-structure tooling for software development exists at aggregator level (weight 0.16, weak, https://miro.com/project-management/how-to-use-wbs-for-software-development/), as do phased implementation-plan templates (weight 0.12, weak, https://ones.com/blog/software-implementation-sample-project-plan-a-phased-appro). Story-slicing presentations describe decomposing user stories into independently valuable slices (weight 0.18, weak, https://www.slideshare.net/slideshow/mke-agile-032014-slicing-the-cake-user-stor). All are recorded as weak corroboration; none carries the operative rule.

## Why the 5-file cap matters

The cap keeps each task reviewable and each verification local: a task that touches 5 files or fewer can be verified by its own Verify line without reasoning over the whole system. This is the downstream benefit of the Phase 0 capability map (doc 02): once module boundaries are fixed, tasks fall inside one module, and the module's spec, not the whole initiative, is the context a task needs.

## The chain

Spec (doc 04) feeds the plan; the plan feeds the tasks; the tasks feed Phase 4 (doc 07). The pre-implementation checklist gates the chain: no implementation proceeds until the spec is approved and the criteria are testable (source doc).
