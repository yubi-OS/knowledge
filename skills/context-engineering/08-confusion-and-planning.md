# 08 - Confusion Management and Inline Planning

Scope: surfacing context conflicts and incomplete requirements explicitly instead of guessing, and the inline planning pattern that catches wrong directions before they are built on.

## When context conflicts

The source doc's example: the spec says "Use REST for all endpoints" while the existing codebase has GraphQL for the user profile query. The instruction is to never silently pick one interpretation. Instead, emit a confusion block that names the conflict, lists the options, and asks which approach to take: follow the spec and potentially deprecate GraphQL later, follow the existing pattern and update the spec, or ask because the conflict looks like an intentional decision.

The corresponding red flag is silent confusion: an agent guesses when it should ask. The anti-pattern table pairs it with its fix: surface ambiguity explicitly using the confusion management patterns.

Research on clarification behavior supports the skill's stance: an LLM-based coding assistant designed to ask clarification questions instead of guessing is an active research direction, and the paper framing asks the assistant to detect when requirements are underspecified and qualify the questions worth asking (weight 0.56, https://arxiv.org/html/2507.21285v1). Microsoft's agent fundamentals material places this on the practitioner side as well: agents operate over models that do not ask clarifying questions by default, so the harness has to force the ask (weight 0.52, https://learn.microsoft.com/en-us/agent-framework/journey/llm-fundamentals).

## When requirements are incomplete

The source doc gives a 3-step escalation:

1. Check existing code for precedent.
2. If no precedent exists, stop and ask.
3. Do not invent requirements. That is the human's job.

The example: the spec defines task creation but not what happens on a duplicate title. The confusion block again offers concrete options: allow duplicates (simplest), reject with a validation error (strictest), or append a number suffix like "Task (2)" (most user-friendly). Guideline 2 restates it as a rule: do not invent requirements.

The precedent check comes first because a codebase is usually its own best spec: if similar cases are handled somewhere, follow that pattern and note the decision, which keeps the answer consistent with the conventions the rules file already encodes.

## The inline planning pattern

For multi-step tasks, emit a lightweight plan before executing. The source doc's template is 3 numbered steps plus a closing line: "Executing unless you redirect." The example plans a task-creation endpoint: add the Zod schema validating title as required and description as optional, wire it into the POST /api/tasks route handler, add a test for the validation error response.

The value is timing. The source doc calls it a 30-second investment that prevents 30-minute rework: the plan surfaces a wrong direction while it is still one sentence, not after it has become 3 files of built-on-top-of work.

This is the same workflow the wider ecosystem converged on. Claude Academy teaches the explore-plan-code-commit workflow: explore the relevant files first, confirm the plan, then write code and commit (weight 0.64, https://academy.claude.com/courses/claude-code-101/the-explore-plan-code-commit-workflow). Claude Code's common-workflows doc shows the tool-native version: plan first, get approval, then implement (weight 0.57, https://code.claude.com/docs/en/common-workflows).

## Putting the three together

The three patterns are one stance in three situations: never let the agent resolve ambiguity by guessing. A conflict becomes a confusion block with options. A missing requirement becomes an options block after a precedent check. A multi-step task becomes a plan block that the user can redirect in place. Each block is short, numbered, and ends in a question or an explicit continue signal, which keeps the human's decision cheap.

## A worked sequence

The three patterns chain naturally inside one task:

1. The task arrives: "add task creation to the API".
2. The agent checks precedent for similar endpoints, finds task listing but not creation, and finds the spec silent on duplicate titles.
3. It emits a missing-requirement block with the 3 options and waits for the answer.
4. With the answer in hand, it emits a 3-step plan: schema, route, test.
5. No redirect arrives, so it executes.

Each block is short, numbered, and ends in a question or an explicit continue signal. The user's cost stays low because the options are enumerated: answering is a letter choice, not a paragraph.

## Why the plan block ends with a redirect hook

The closing line "Executing unless you redirect" is what makes the pattern cheap. Ending instead with an open question forces the user to author a response even when the plan is fine. The source doc's phrasing assigns the default to the agent and the veto to the human, which keeps the 30-second investment from becoming a 30-second tax on every task.

## Relationship to the other skills' territory

The confusion block surfaces facts the context already contains that disagree (spec versus codebase). It does not invent requirements, per guideline 2. When the gap is not a conflict but a missing capability, that is a spec problem for the owning skill, and the agent's output here is limited to naming the gap and the options. This boundary discipline is stated at the end of the source doc: every use stays inside the frontmatter description's scope, and anything beyond it is a different skill's job.
