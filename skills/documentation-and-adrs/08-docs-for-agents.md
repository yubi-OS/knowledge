# Documentation for Agents

Scope: the source doc's 4-part prescription for AI-agent-facing documentation (rules files, spec files, ADRs, inline gotchas) and the grounded ecosystem context for each surface.

## Why agents are a distinct audience

The source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md, "Documentation for Agents") devotes a dedicated section to "Special consideration for AI agent context". The premise matches the skill's overall audience claim (doc 01): documentation is consumed by future humans *and* agents, and agents have a specific failure mode the other audiences do not: they re-decide. Without a record of why a decision was made, an agent treats a settled question as open and produces a plausible-looking second answer that conflicts with the first.

## The 4 surfaces

Per the source doc:

1. **CLAUDE.md / rules files.** Document project conventions so agents follow them. This is the instruction surface an agent reads before acting.
2. **Spec files.** Keep specs updated so agents build the right thing. A stale spec is worse than none: an agent follows it faithfully into the wrong artifact.
3. **ADRs.** Help agents understand why past decisions were made, which prevents re-deciding. This is the surface doc 02 and doc 03 build out.
4. **Inline gotchas.** Prevent agents from falling into known traps. This is the gotcha-comment pattern from doc 04, aimed at the agent that would otherwise "fix" code whose strange shape is load-bearing.

## Ecosystem grounding

The dig grounds each surface in the current ecosystem:

- **Rules files are a real, standardized surface.** GitHub's documentation for Copilot coding agent covers adding repository custom instructions (https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions, weight 0.69): repository-level instruction files that Copilot reads on every task. The AGENTS.md project (https://agents.md/, weight 0.13, and its repository https://github.com/agentsmd/agents.md, weight 0.37) proposes an open standard for the same idea: a single file of agent instructions at the repo root. Both are consistent with the source doc's CLAUDE.md bullet; the source doc names Claude's file, and the ecosystem has generalized the pattern.
- **Claude's rules-file mechanics are documented.** The Claude Code memory documentation (https://code.claude.com/docs/en/memory, weight 0.56) describes CLAUDE.md as the project memory file Claude Code reads automatically, covering project conventions, commands, and style guidance. That is exactly the source doc's first bullet, and it is the only agent-specific documentation surface with a high-weight official reference in this dig.
- **ADR-as-agent-memory is the same claim the corpus makes.** A weak-backed practitioner guide to AI agent memory files (https://hackernoon.com/the-complete-guide-to-ai-agent-memory-files-claudemd-agentsmd-and-beyond, weight 0.17) surveys CLAUDE.md, AGENTS.md, and related files together; below threshold, cite as corroboration only.

## The maintenance contract

Two of the 4 surfaces carry a maintenance obligation the others do not. Rules files and specs rot: a convention that is no longer enforced, or a spec describing a design that shipped differently, actively misleads an agent. The source doc's verification checklist (doc 09) includes "Rules files (CLAUDE.md etc.) are current and accurate", which makes currency a checkable property, not an aspiration. ADRs, by contrast, are append-only by design (doc 03: never delete, supersede instead), so their staleness mode is different: an ADR is never wrong about the past, only potentially superseded, and the Status line records which.

The inline-gotcha surface has the same property as comments generally: a gotcha on *why* (this ordering is required because the theme context is unavailable during SSR) stays true as long as the code it describes is true, so it survives refactors better than comments on *what*.

## Practical workflow

Combining the source doc with the grounded ecosystem:

1. When a convention is enforced repeatedly (linting exception, ordering rule, naming pattern), write it in the rules file rather than relying on agents inferring it from the codebase.
2. When a feature is specified before it is built, treat the spec file as part of the deliverable: updating it is the same step as shipping the feature, per the source doc's "keep specs updated so agents build the right thing".
3. When a decision is settled, write the ADR (doc 02's trigger list) and reference it from inline comments (doc 04's ADR-003 pattern) so an agent that hits the trap can climb to the rationale.
4. When code is non-obvious on purpose, document the gotcha inline with the failure mode, not just the rule.

## Drift note

The source doc's agent-documentation section predates the AGENTS.md standardization wave; the corpus records this as context, not contradiction. The 4 surfaces (rules file, specs, ADRs, inline gotchas) are unchanged; only the file-name conventions have generalized beyond CLAUDE.md, with GitHub's repository custom instructions (weight 0.69) and the AGENTS.md repository (weight 0.37) as the dated, grounded evidence of that generalization.
