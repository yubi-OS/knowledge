# Documentation for Agents

Scope: the source doc's section on AI-agent context: rules files (CLAUDE.md and the like), spec files, ADRs as re-decision prevention, and inline gotchas as trap prevention.

## Why agents get a dedicated section (source doc)

The source doc introduces this section as "Special consideration for AI agent context". The premise follows from the skill's overview: documentation that captures the why is essential for "future humans and agents working in the codebase", and agents are a first-class reader, not an afterthought. An agent that arrives without project context will either re-derive conventions badly or re-decide settled decisions. The 4 artifacts below are the documentation surface an agent can consume mechanically.

## The 4 agent-facing artifacts (source doc)

1. **CLAUDE.md / rules files** — "Document project conventions so agents follow them." A rules file is where the non-obvious, project-specific conventions live: naming, structure, tooling, process. The source doc's verification checklist includes "Rules files (CLAUDE.md etc.) are current and accurate", which makes staleness an auditable failure, not a stylistic one.
2. **Spec files** — "Keep specs updated so agents build the right thing." The spec is the statement of intent; an agent building from a stale spec builds the wrong thing efficiently. The when-to-document trigger "Onboarding new team members (or agents)" covers this: the spec is the agent's onboarding document for in-flight work.
3. **ADRs** — "Help agents understand why past decisions were made (prevents re-deciding)." This is the highest-leverage artifact for agents. The source doc's rationalizations table prices the failure mode: "A 10-minute ADR prevents a 2-hour debate about the same decision six months later." An agent without the ADR is the debater in that sentence; with the ADR, the debate is skipped. The never-delete lifecycle rule (doc 04) is what makes the ADR corpus trustworthy for this purpose: present ADRs plus supersession pointers form a truthful decision history.
4. **Inline gotchas** — "Prevent agents from falling into known traps." The gotcha comment pattern from doc 05 (documented invariant, failure mode, ADR cross-reference) is exactly the artifact an agent reads at the point of contact with the trap.

## The agent as the audience for all the other docs

This section re-frames every other documentation surface in the corpus as agent-facing infrastructure:

- The README's Commands table (doc 07) is how an agent runs, tests, builds, and lints without asking.
- The API doc comments (doc 06) are how an agent learns a function's error contract before calling it.
- The why-comments (doc 05) are how an agent avoids "fixing" something that looks wrong but encodes a deliberate trade-off.
- The red flags list (source doc) reads as an agent audit: an agent reviewing a codebase can check for undocumented architectural decisions, commented-out code, and stale TODOs mechanically.

## External context on rules files

The dig for this subtopic was weak overall, with one notable hit: Anthropic's own guidance on steering Claude Code distinguishes when to use CLAUDE.md versus skills, hooks, and rules subagents (https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more, jev weight 0.36, weak backing). It corroborates the source doc's premise that a rules file is the conventional mechanism for feeding project conventions to an agent, while showing the surrounding mechanism landscape has grown more structured since the source doc's phrasing. That is drift worth noting, not a contradiction: the source doc says "document conventions in a rules file", the ecosystem answer is "document conventions in a rules file, and know when a convention is better expressed as a skill or hook".

Two other weak results map the same terrain: an explainer of AI config files including CLAUDE.md and AGENTS.md (https://dev.to/deployhq/claudemd-agentsmd-and-every-ai-config-file-explained-4pde, jev weight 0.10, weak backing) and a write-up on project context files for AI coding agents (https://eclipsesource.com/blogs/2025/11/20/mastering-project-context-files-for-ai-coding-agents/, jev weight 0.22, weak backing). Both treat the rules file as an established category. The remaining results were product pages and listicles scoring 0.03 to 0.08 and carry no claims here.

## The prevention frame

The 4 artifacts divide into 2 preventive functions. Convention and decision artifacts (rules files, ADRs) prevent wrong choices before the agent acts: they answer "what does this project do and why". Trap artifacts (inline gotchas, current specs) prevent wrong actions during the work: they answer "what will go wrong if I do the obvious thing". The source doc's verification checklist audits both halves in agent-readable terms: "Rules files (CLAUDE.md etc.) are current and accurate" for the first, "Known gotchas are documented inline where they matter" for the second.

## A maintenance loop, not a one-time write

The two "current" words in the checklist (rules files current and accurate, specs updated) imply a loop: documentation for agents is an artifact with a freshness requirement, like the changelog's version headings or the ADR status field. A practical discipline follows from the skill's own triggers: when you find yourself explaining the same thing to an agent repeatedly (trigger 6 of the When to Use list), that explanation is the signal to write it into the rules file. The agent-facing documentation surface is therefore self-completing under the skill's own trigger list: anything an agent needs more than once belongs in a file the next agent can read instead.
