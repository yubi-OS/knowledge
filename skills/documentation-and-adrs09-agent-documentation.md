# 09. Documentation for agents

Scope: the skill's special section on AI agent context: CLAUDE.md and rules files for conventions, current spec files, ADRs as anti-re-deciding records, and inline gotchas as trap prevention.

## The skill's 4 mechanisms (source doc)

The source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md) has a section titled "Documentation for Agents" listing 4 kinds of documentation with agent-specific purposes:

1. CLAUDE.md / rules files: document project conventions so agents follow them.
2. Spec files: keep specs updated so agents build the right thing.
3. ADRs: help agents understand why past decisions were made, which prevents re-deciding.
4. Inline gotchas: prevent agents from falling into known traps.

The first sentence of the skill (doc 01) already named agents as first-class readers: "This context is essential for future humans and agents working in the codebase." This section is where the agent audience gets its own tooling.

## Rules files in practice

The canonical practitioner guidance for rules files matches the skill's framing: "Learn how to use CLAUDE.md files to give Claude Code persistent context about your project structure, coding standards, and workflows" (https://claude.com/blog/using-claude-md-files, jev 0.63). Persistent context is the property that matters: conventions written once in a rules file are read by every agent session without re-explanation, which is the skill's trigger 6 (explaining the same thing repeatedly) applied to an agent audience.

A weak-backed tool page demonstrates the pattern's spread by generating AGENTS.md and CLAUDE.md rules files from a style domain (https://modern-css.com/ai/, jev 0.14, weak backing), and the agentic coding product context the rules files address is described by its vendor as a tool that "understands your codebase, edits files, runs commands" (https://claude.com/product/claude-code, jev 0.31, weak backing). Weak backing, but consistent: the agent is an active committer, so conventions written for it function as guardrails on writes, not just reading material.

## ADRs as anti-re-deciding records

The skill's claim is precise: ADRs help agents "understand why past decisions were made (prevents re-deciding)". An agent that cannot see the decision record will treat a settled decision as an open question, propose the previously rejected alternative, and spend review cycles relitigating it. The ADR's Alternatives Considered section is the part that does the prevention work: the rejected options and their rejection reasons are exactly what an agent needs to not re-propose them.

The upstream skill source for this same discipline makes the workflow concrete: "Before creating an ADR, inspect the available repository context for an established convention — existing ADRs, project instructions, and ADR-related configuration or tooling (e.g. an .adr-dir file)" (https://github.com/addyosmani/agent-skills/blob/main/skills/documentation-and-adrs/SKILL.md, jev 0.42, weak backing). Reading existing ADRs before writing a new one is the same discipline applied to the agent's own output: check the record before adding to it.

## Specs and gotchas

Spec files close the loop on correctness: "Keep specs updated so agents build the right thing." A stale spec is an actively harmful document for an agent audience because the agent trusts it; for human readers a stale spec is merely confusing. This gives spec currency a higher priority in agent-heavy repos than the skill states for docs generally.

Inline gotchas (doc 05) get an agent-specific justification: they "prevent agents from falling into known traps." The gotcha comment on `initializeTheme` (hydration ordering, SSR theme context) is exactly the kind of non-obvious sequencing constraint an agent cannot infer from the type signature and will violate unless warned at the call site.

## Practice notes

1. Treat the rules file as the agent's onboarding document: conventions, workflows, and pointers to specs and ADRs, kept current.
2. When a decision is recorded in an ADR, also reference it from the rules file if agents will otherwise violate it routinely.
3. Update specs in the same change that invalidates them; an outdated spec is worse for an agent than no spec.
4. Write gotchas at the point of danger with the ADR cross-reference, since agents read files locally rather than wikis.
5. Verify agent-facing docs (rules files, specs, ADRs) as part of the skill's post-documentation checklist, which requires "Rules files (CLAUDE.md etc.) are current and accurate".
