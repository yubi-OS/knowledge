# 06 - Phase Map and Quick Reference

Scope: the Define / Plan / Build / Verify / Review / Ship phase map and its per-skill one-line summaries from the source doc's quick reference table.

## Grounding spine

Source doc: `yubi-OS/yubiOS skills/using-agent-skills/SKILL.md`, section "Quick Reference". This is an internal-record subtopic: the phase map is the source doc's own table, so no searXNG dig was run.

## The 6 phases

The quick reference table organizes the skill set into 6 phases: Define, Plan, Build, Verify, Review, Ship. The phase labels match the lifecycle sequence (doc 05): Define covers steps 1 to 3, Plan covers step 4, Build covers steps 5 to 9, Verify covers steps 10 to 12's testing half, Review covers the review passes, Ship covers steps 13 to 16. The phases are the compression of the 16-step sequence into a lookup table.

## The table

The source doc's quick reference assigns each skill a phase and a one-line summary. Restated in full, with the doc's wording:

| Phase | Skill | One-line summary |
|---|---|---|
| Define | interview-me | Surface what the user actually wants before any plan, spec, or code exists |
| Define | idea-refine | Refine ideas through structured divergent and convergent thinking |
| Define | spec-driven-development | Requirements and acceptance criteria before code |
| Plan | planning-and-task-breakdown | Decompose into small, verifiable tasks |
| Build | incremental-implementation | Thin vertical slices, test each before expanding |
| Build | source-driven-development | Verify against official docs before implementing |
| Build | doubt-driven-development | Adversarial fresh-context review of every non-trivial decision |
| Build | context-engineering | Right context at the right time |
| Build | frontend-ui-engineering | Production-quality UI with accessibility |
| Build | api-and-interface-design | Stable interfaces with clear contracts |
| Verify | test-driven-development | Failing test first, then make it pass |
| Verify | browser-testing-with-devtools | Chrome DevTools MCP for runtime verification |
| Verify | debugging-and-error-recovery | Reproduce, localize, fix, guard |
| Review | code-review-and-quality | Five-axis review with quality gates |
| Review | code-simplification | Preserve behavior while reducing unnecessary complexity |
| Review | security-and-hardening | OWASP prevention, input validation, least privilege |
| Review | performance-optimization | Measure first, optimize only what matters |
| Ship | git-workflow-and-versioning | Atomic commits, clean history |
| Ship | ci-cd-and-automation | Automated quality gates on every change |
| Ship | deprecation-and-migration | Remove old systems and migrate users safely |
| Ship | documentation-and-adrs | Document the why, not just the what |
| Ship | observability-and-instrumentation | Structured logs, RED metrics, traces, symptom-based alerts |
| Ship | shipping-and-launch | Pre-launch checklist, monitoring, rollback plan |

That is 23 skills across 6 phases.

## Phase counts and shape

Counting by phase: Define has 3, Plan has 1, Build has 5, Verify has 3, Review has 4, Ship has 6. Build and Ship carry the most skills, which matches the doc's own emphasis: implementation is where 5 different disciplines can apply to one slice, and shipping is where 6 lifecycle concerns land.

## How to use the table

The table serves 3 uses the discovery tree (doc 01) does not:

1. Reverse lookup. When the agent is inside a skill and needs the neighboring discipline (a review finding about security while in code-review-and-quality), the table gives the phase's other skills immediately.
2. Coverage check. Before starting work, the agent can scan the phases the task spans and confirm each has a skill assigned. A task with no Plan-phase skill is normal (most tasks); a Build task with no Verify skill is a red flag, because the quick reference assigns test-driven-development to Verify and the verification behavior (doc 07) requires evidence.
3. Summaries as contracts. Each one-line summary is a compressed statement of the skill's scope. "Measure first, optimize only what matters" (performance-optimization) and "preserve behavior while reducing unnecessary complexity" (code-simplification) are constraints the agent should honor before loading the full SKILL.md.

## Relation to the discovery tree

The tree routes on trigger questions; the table routes on phase. They agree on membership: every skill in the tree appears in the table, and the table's phase grouping matches the tree's branch ordering. The difference is access pattern: the tree answers "which skill now", the table answers "what else lives in this phase". An agent that only ever uses the tree will miss the sibling skills; an agent that only uses the table will miss the state-based triggers ("something broke?", "don't know what you want yet?"). The meta-skill provides both for that reason.

## Boundary with the lifecycle sequence

The table does not order skills within a phase, and it does not mark parallelism (the observability-and-instrumentation parallel note lives in the lifecycle sequence, not here). When order or parallelism matters, the sequence (doc 05) is authoritative; when membership or scope matters, the table is.
