# 06: Output Files and the Task List Target

**Scope:** Where plans live: `tasks/plan.md` for design decisions and risks, a task list target (default `tasks/todo.md`, or an external tracker), and the rule that an incomplete plan is never overwritten without asking.

## The two artifacts

The source doc (yubi-OS/yubiOS skills/planning-and-task-breakdown/SKILL.md) splits planning output into 2 artifacts:

1. **Plan document:** always saved to `tasks/plan.md`. It is always a markdown file because design decisions, risks, and open questions do not map cleanly onto individual tracker issues. The doc provides a template with Architecture Decisions, a phased Task List with checkpoints, Risks and Mitigations, and Open Questions.
2. **Task list:** each task recorded in the task list target. The `tasks/` directory is created if it does not exist.

The task list target is defined once in the doc and every other reference defers to it. Default: a checklist-style markdown file at `tasks/todo.md`, the convention the `/build` command and other downstream tooling expect. If the project's agent rules (`CLAUDE.md`, `AGENTS.md`) or the user designate an issue tracker, such as GitHub Issues, Jira, Linear, or `bd`/beads, one tracker item is created per task instead, with acceptance criteria and verification steps in the item body and dependencies mapped to the tracker's linking mechanism. When an external tracker is used, the choice is noted in `tasks/plan.md` so downstream steps know where to look, and the plan's Task List section becomes an ordered index of tracker IDs rather than a duplicate checklist.

## The never-overwrite rule

Before writing `tasks/plan.md` or `tasks/todo.md`, check whether they already exist and still contain unchecked tasks. If the same work is being replanned, update the existing files in place. If it is different work, stop and ask: the unchecked tasks may be mid-build in another session. Do not delete, overwrite, or rename existing files on your own. The same rule applies to external trackers: never bulk-close or delete another plan's open tracker items to make room for new ones. The rationalizations table makes the stakes explicit: overwriting destroys work state that exists nowhere else.

## The wider tooling landscape

The dig confirms this artifact design is a live convention in agent tooling. A tasks.md generator describes a markdown file containing an ordered, checkable list of implementation tasks for an AI coding agent, popularized by GitHub Spec Kit and Amazon Kiro as part of spec-driven development (https://design.dev/ai/tasks-md-generator/, weight 0.27, weak backing). A markdown-based PRD and task workflow repository for AI-powered IDEs provides the same shape, originally built for Cursor (https://github.com/MannyAcevedo/ai-dev-tasks-PRD-template, weight 0.29, weak backing). An AI-native todo tracker for coding agents positions itself as persistent, version-controlled TODO tracking for Cursor, Claude, and Copilot (https://github.com/fxstein/ai-todo, weight 0.34, weak backing).

On the external-tracker side, Linear's official documentation covers its GitHub integration (https://linear.app/docs/github-integration, weight 0.59, authoritative backing), the one dig result on this subtopic above the 0.5 line. A two-level design guide recommends keeping Jira, Linear, or GitHub Issues as the organization's system of record while a local tool acts as the coding agent's system of action (https://gascity.com/guide/beads-with-jira-linear-github-issues/, weight 0.14, weak backing), and a docs page shows issue title, description, and metadata becoming part of an agent's prompt (https://docs.emdash.sh/issues, weight 0.30, weak backing).

## Ordering and checkpoints live here too

The task list target is also where Step 5's ordering discipline lands: dependencies satisfied, each task leaving the system working, a verification checkpoint after every 2 to 3 tasks, and high-risk tasks early to fail fast. Checkpoints are written as checklist items, for example "After Tasks 1 to 3: all tests pass, application builds without errors, core user flow works end-to-end, review with human before proceeding".

**Primary sources for this doc:** the source doc. **Weakly backed claims:** the tasks.md convention, PRD template workflow, agent todo trackers, and the system-of-record split (weights 0.14 to 0.34, weak backing). **Authoritative backing:** Linear's documented GitHub integration (weight 0.59).