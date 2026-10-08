# 07 - Phase 4 Implement and the Companion Skills

Scope: executing one task at a time, the companion skills that own each mechanism, and the load-only-what-you-need context discipline.

## Phase 4's rule

The source doc (yubi-OS/yubiOS skills/spec-driven-development/SKILL.md) executes tasks one at a time and routes each mechanism to its owning skill: incremental-implementation for the delivery cadence, test-driven-development for proving behavior, and context-engineering to load the right spec sections and source files at each step rather than flooding the agent with the entire spec (source doc).

## Test-driven development

VS Code's guide defines test-driven development as a software development approach where you write tests before implementing functionality, creating a tight feedback loop that improves code quality, catches bugs early, and ensures the code meets requirements (weight 0.8, https://code.visualstudio.com/docs/agents/guides/test-driven-development-guide). IBM Developer's tutorial presents the same flow as five steps and frames unit tests as the cornerstone of TDD (weight 0.51, https://developer.ibm.com/articles/5-steps-of-test-driven-development/). The source doc's spec supports this mechanically: every task carries a Verify line, so the test to write first is already specified before implementation begins (source doc, doc 06).

## Context engineering

Anthropic defines context engineering as the art and science of curating what goes into a limited context window, noting that an agent running in a loop generates more and more data that could be relevant for the next turn of inference and that this information must be cyclically refined (weight 0.8, https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents). VS Code operationalizes it as a 3-step workflow: curate project-wide context, create an implementation plan, then generate implementation code, using custom instructions, custom agents, and prompt files to provide targeted project information (weight 0.86, https://code.visualstudio.com/docs/agents/guides/context-engineering-guide).

The source doc applies this to specs specifically: at each implementation step, load the right spec sections and source files rather than the entire spec (source doc). That is the same cyclic refinement Anthropic describes, applied to the artifact this skill produces.

## The canonical-source relationships

Two companion skills are named as canonical, not merely adjacent:

- planning-and-task-breakdown owns the dependency-graph mapping and vertical-slicing mechanics for Phases 2 and 3. Its text takes precedence on any divergence from the plan and task summaries inline in the source doc (source doc, doc 06).
- api-and-interface-design owns the contract between modules. The capability map records that billing depends on identity, but the contract between them belongs in the provider module's spec, designed per that skill (source doc, doc 02).

Two more companion skills execute: incremental-implementation delivers the tasks, and test-driven-development proves them. The boundary-case rule from the source doc's examples section generalizes: when the request only names a trigger without the artifact it acts on, route to the owning surface instead of improvising (source doc).

## Weakly-backed context

Third-party skill registries describing incremental implementation workflows surfaced in the dig (weight 0.11, weak, https://mcpmarket.com/tools/skills/incremental-implementation-workflow-1), as did community context-engineering guides (weight 0.24, weak, https://design.dev/guides/context-engineering/; weight 0.19, weak, https://github.com/bonigarcia/context-engineering). They corroborate that these are named, reusable practices, but the corpus cites them as weak only.

## What Phase 4 must not do

The red flags bound it: starting to write code without any written requirements, asking "should I just start building?" before clarifying what "done" means, and implementing features not mentioned in any spec or task list (source doc). One task at a time, verified, inside the approved map is the whole phase.
