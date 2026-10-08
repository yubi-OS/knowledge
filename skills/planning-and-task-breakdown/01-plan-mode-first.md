# 01: Plan Mode First

**Scope:** Enter read-only plan mode before writing any code: read the spec and the relevant codebase sections, identify existing patterns, map dependencies, note risks, and let the plan document be the output of planning.

## The rule: planning is read-only

The source doc (yubi-OS/yubiOS skills/planning-and-task-breakdown/SKILL.md) states the process plainly: before writing any code, operate in read-only mode. The four planning inputs are the spec, the relevant codebase sections, the existing patterns and conventions, and the dependencies between components. Risks and unknowns are noted during this pass, not discovered mid-implementation. The output of planning is a plan document saved to `tasks/plan.md` and a task list recorded in the task list target (default `tasks/todo.md`), not implementation. The doc is explicit: do NOT write code during planning.

This is a discipline about state, not about thinking. A plan that is written down survives session boundaries and context compaction; the source doc's rationalizations table makes exactly this point against the objection "I can hold it all in my head".

## Independent corroboration: agent plan modes are a standard pattern

The pattern has shipped in mainstream agent tooling. VS Code's official agent documentation describes a planning flow where the prompt instructs the agent to "Propose an implementation plan and identify compatibility risks. Do not change project files. Wait for my approval before implementing" (https://code.visualstudio.com/docs/agents/run/planning, weight 0.62). The same source notes such a request guides the agent's behavior without changing the session's files. That is a vendor-documented statement of the same contract the source doc encodes: plan in a mode that cannot mutate the workspace, then get approval.

## Why the read-only constraint earns its cost

Practitioner write-ups give the failure modes that plan mode prevents, though these are weakly backed sources and should be read as field experience rather than measured results. A DEV Community article on forcing read-only planning argues that an AI agent hallucinates when it assumes a library exists without checking `package.json`, and that large uncontrolled changes make code reviews and diffs a nightmare; its prescription is to use the tool's Plan Mode or Ask Mode, or to inject a meta-prompt telling the agent to read first and wait for instructions (https://dev.to/mcsee/ai-coding-tip-003-force-read-only-planning-1d1m, weight 0.17, weak backing). A HackerNoon republication of the same advice repeats the fallback meta-prompt form for tools without a built-in plan mode (https://hackernoon.com/ai-coding-tip-003-force-read-only-planning, weight 0.13, weak backing).

Both weak sources agree with the strong one on the mechanism: the plan-first step exists so that the agent's first act on a codebase is reading and mapping, not editing. The source doc's own red-flags list puts "starting implementation without a written task list" at the top, and its verification checklist requires "the human has reviewed and approved the plan" before implementation starts.

## What counts as done planning

From the source doc, planning is complete when:

1. The spec and the code areas it touches have been read.
2. Existing patterns and conventions are identified.
3. Dependencies between components are mapped (the input to task ordering, covered in doc 02).
4. Risks and unknowns are written down (they land in the plan document's Risks section, covered in doc 06).
5. The plan document and the task list exist in the task list target.

Anything else produced during planning, such as prototype code, is implementation by definition and belongs to a task, not to the plan.

## How this doc fits the corpus

Plan mode is the entry gate of the whole process. The dependency graph (doc 02) and the task ordering (doc 06) both consume what read-only exploration produces. Skipping the gate is the first red flag the source doc names, and the rationalizations table treats "I'll figure it out as I go" as the direct cause of rework.

**Primary sources for this doc:** the source doc; VS Code agent planning documentation (weight 0.62, authoritative backing). **Weakly backed claims:** the DEV Community and HackerNoon field notes on hallucinated dependencies and diff size (weights 0.17 and 0.13).