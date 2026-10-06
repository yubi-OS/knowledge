# 01 - The Context Hierarchy

Scope: the skill's 5-level persistence hierarchy, from always-loaded rules files down to accumulating conversation history, and why ordering context by persistence is the core structural decision.

The source doc (yubi-OS/yubiOS skills/context-engineering/SKILL.md) opens with the thesis: feed agents the right information at the right time. Context is the single biggest lever for agent output quality; too little and the agent hallucinates, too much and it loses focus. Context engineering is the deliberate curation of what the agent sees, when it sees it, and how it is structured.

## The 5 levels

The source doc structures context from most persistent to most transient:

1. Rules files (CLAUDE.md and equivalents). Always loaded, project-wide.
2. Spec and architecture docs. Loaded per feature or session.
3. Relevant source files. Loaded per task.
4. Error output and test results. Loaded per iteration.
5. Conversation history. Accumulates and needs compaction.

The persistence gradient matters because each level has a different load discipline. Rules files are loaded for you by the tool every session, so they must stay small and universal. Spec docs are opt-in per feature, so they can be longer but must be sectioned. Source files are the working material. Error output is disposable once understood. Conversation history is the slowest moving liability: it grows on its own and only shrinks when you act.

## Why the hierarchy holds up

Anthropic's context engineering essay argues the same point from the outside: a context window is a finite resource with diminishing marginal returns, and curation beats accumulation (weight 0.80, https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents). The essay frames context as a narrowning resource over a long task, so the items with the highest persistence must be the ones that survive every compaction.

Anthropic's building-effective-agents essay makes the complement claim: agents need the minimal sufficient set of information at each step, and the biggest wins come from letting the agent pull context on demand rather than front-loading everything (weight 0.69, https://www.anthropic.com/engineering/building-effective-agents). That is the per-task and per-iteration behavior of levels 3 and 4 stated as an industry pattern.

Cursor's agent best-practices guide confirms the level 1 discipline with a live implementation: rules are always included in context, while skills are loaded dynamically when the agent decides they are relevant, which keeps the context window clean (weight 0.52, https://cursor.com/blog/agent-best-practices). This is a dated drift note against the source doc: the rules-file layer has split into always-on rules and on-demand skills since the source doc was written, and the split is a refinement, not a contradiction.

Claude Code's memory documentation implements the same layering on the tool side: CLAUDE.md files are picked up automatically at startup from a hierarchy of locations (project, user, and enterprise scopes), and additional memory files can be imported on demand (weight 0.68, https://code.claude.com/docs/en/memory).

## How to use the hierarchy

- Put anything that must survive every session in level 1, and keep it short. Anything not worth that cost moves down a level.
- Level 2 content should be sectioned so a feature session can load only its section. The source doc's guideline 1 is explicit: load the relevant spec section when starting a feature, not the entire spec.
- Level 3 content is loaded just before work, by the 4-step pre-task loading routine covered in doc 03.
- Level 4 content should be the minimal error, not the full log.
- Level 5 is managed by session discipline: fresh sessions on task switches, progress summaries, deliberate compaction (doc 04).

## Skill boundaries

Every use of this skill stays inside its frontmatter scope: starting a new session, declining output quality, task switching, and rules-file configuration (source doc). Anything beyond that scope is a different skill's job.
