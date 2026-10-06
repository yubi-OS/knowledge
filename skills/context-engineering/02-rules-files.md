# 02 - Rules Files

Scope: authoring the level 1 rules file, its four sections, the tool-specific equivalents, and the content selection rule that keeps it high-leverage.

The source doc calls the rules file "the highest-leverage context you can provide" because it persists across sessions and is loaded automatically. It prescribes a four-section template: Tech Stack, Commands, Code Conventions, and Boundaries, plus one short example of a well-written component in the project's own style.

## The four sections

- Tech Stack: the exact versions, for example React 18, TypeScript 5, Vite, Tailwind CSS 4, Node.js 22, Express, PostgreSQL, Prisma (source doc).
- Commands: build, test, lint, dev, and type check commands verbatim (source doc). Claude Code's best-practices doc confirms the intent: CLAUDE.md is a special file read at the start of every conversation and should include bash commands, code style, and workflow rules (weight 0.75, https://code.claude.com/docs/en/best-practices).
- Code Conventions: functional components with hooks, named exports, colocated tests, shared utilities like cn(), error boundaries at route level (source doc examples).
- Boundaries: never commit .env files or secrets, never add dependencies without checking bundle size, ask before schema changes, always run tests before committing (source doc).

The Patterns section carries one example in the project's own style. This pairs with the anti-pattern the source doc names separately: missing examples makes the agent invent a new style instead of following yours.

## The equivalents

The source doc lists the equivalent files per tool: .cursorrules or .cursor/rules/*.md for Cursor, .windsurfrules for Windsurf, .github/copilot-instructions.md for GitHub Copilot, and AGENTS.md for OpenAI Codex. A third-party comparison confirms the same five filenames are the recognized set across tools today (weakly backed, weight 0.20, https://www.tokencentric.app/blog/ai-coding-config-files-compared).

AGENTS.md is now an open format, described as a README for agents adopted by over 60k open-source projects (weakly backed, weight 0.23, https://agents.md/). This is a dated drift note: the source doc assigns AGENTS.md to OpenAI Codex specifically, while the format has since generalized across tools.

## Content selection

The source doc's Common Rationalizations table answers the main failure mode: agents cannot read your mind, and writing a rules file takes 10 minutes that saves hours. Two supporting practices from the ecosystem:

- Anthropic's steering article places CLAUDE.md as the right home for project-wide conventions, with skills for procedures and hooks for enforcement, so the rules file does not absorb everything (weight 0.79, https://claude.com/resources/articles/steering-claude-code-skills-hooks-rules-subagents-and-more).
- A 2026 guide recommends keeping the file under 200 lines and containing only universally-applicable rules, pointing to detailed docs by file reference instead of inlining them (weakly backed, weight 0.11, https://maketocreate.com/claude-md-best-practices-the-complete-2026-guide/).

Claude Code's memory doc implements the loading mechanics: memory files load in a hierarchy of enterprise, project, and user scopes, which means a rule placed in the wrong scope silently applies to the wrong range of work (weight 0.68, https://code.claude.com/docs/en/memory).

## Boundaries of the rules file

The source doc is explicit that implicit knowledge does not exist: if a project-specific rule is not written down, the agent does not know it. The file is the mechanism that converts tribal convention into loaded context, and its boundaries section is the enforcement surface for things the agent must never do without asking.

## Drift note on tool coverage

The source doc's equivalents list predates the AGENTS.md generalization. RuleStack's 2026 comparison tracks per-tool instruction files beyond the source doc's five, including Cline rules alongside Copilot instructions and Cursor rules (weakly backed, weight 0.19, https://rulestack.thecompound.tech/compare/copilot-instructions-vs-cline-rules). The practical reading: whatever the filename, the content contract the source doc teaches transfers unchanged, because the four sections describe what the agent needs, not what any one tool parses.

## The commands section as automation

The commands list is the section most often underwritten. The source doc's template includes 5: build, test, lint with autofix, dev, and a no-emit type check. These exist so the agent can self-verify after every change instead of asking the human to run commands for it. The boundaries section then decides which of those runs are mandatory before commit, which is why the two sections work as a pair: commands make verification possible, boundaries make it non-optional.

## Common failure modes in practice

- A rules file with only conventions and no commands leaves the agent guessing how to verify its own work, which pushes verification cost back onto the human.
- A rules file that inlines entire specs violates the level 2 loading discipline in doc 03; the rules file should point to sections, not absorb them.
- Boundaries phrased as preferences instead of prohibitions read as advisory. The source doc's boundary examples are all imperatives: never, never, ask before, always.
