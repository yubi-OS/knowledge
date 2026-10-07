# 04 - Scope Discipline

Scope: Rule 0.5, touch only what the task requires, the noticed-but-not-touching pattern, and resisting opportunistic cleanup and scope expansion while implementing an increment.

## The rule

The source doc (`yubi-OS/yubiOS skills/incremental-implementation/SKILL.md`) states Rule 0.5 in 5 words: "Touch only what the task requires." It then lists the behaviors that violate it:

1. Do not "clean up" code adjacent to your change.
2. Do not refactor imports in files you are not modifying.
3. Do not remove comments you do not fully understand.
4. Do not add features not in the spec because they "seem useful".
5. Do not modernize syntax in files you are only reading.

Each of these is a small change that looks free at the moment of writing but lands in a different review, a different rollback, and a different blast radius than the task's own change.

## The noticed-but-not-touching pattern

For improvements you see but should not make, the source doc prescribes a written capture instead of a fix. The template:

```
NOTICED BUT NOT TOUCHING:
- src/utils/format.ts has an unused import (unrelated to this task)
- The auth middleware could use better error messages (separate task)
-> Want me to create tasks for these?
```

The final line routes the findings into the planning system rather than the current diff. This is the disciplined response to the tension between two well-known impulses: the boy scout rule ("leave the code better than you found it") and the fact that mixing cleanup into feature changes makes review harder. On the developer level, opportunistic refactoring is about leaving code better than you found it; on the systemic level it is about allocating part of the team's capacity to improvement deliberately (https://www.jonmellman.com/posts/on-opportunistic-refactoring/, jev weight 0.27, weak backing).

## Opportunistic refactoring, done right

The discipline does not forbid opportunistic improvement entirely. Martin Fowler's definition: refactoring does not need to be planned out; mostly it is done opportunistically, to fix problems while working on another task (https://martinfowler.com/bliki/OpportunisticRefactoring.html, jev weight 0.85). The source doc reconciles the two by scope: opportunistic refactoring is allowed when the cleanup is inside the task's own touched surface, and must be split out when it is not. The red-flag list makes the boundary concrete: "Let me just quickly add this too" scope expansion and "touching files outside the task scope while I'm here" are both red flags.

The cost of ignoring the boundary is review quality. Reviewers flag that refactoring mixed into feature changes makes line-by-line diff comparison difficult, which weakens the review exactly where the feature change needs scrutiny (https://softwareengineering.stackexchange.com/questions/244807/reconciling-the-boy-scout-rule-and-opportunistic-refactoring-with-code-reviews, jev weight 0.14, weak backing).

## Scope creep, the project-level version

What the source doc guards against at the increment level has a formal name at the project level: scope creep is the uncontrolled expansion of the original project scope without corresponding adjustments to time, budget, or resources (https://codemastersintl.com/blog/what-is-scope-creep-in-software-development, jev weight 0.17, weak backing). Project scope is the outline of requirements and deliverables, usually defined at the beginning of project planning (https://asana.com/resources/what-is-scope-creep, jev weight 0.34, weak backing). An increment that adds a "seem useful" feature is the smallest unit of scope creep: it expands the deliverable without expanding the plan.

## The agent angle

The source doc's agent-delegation section applies scope discipline to instructions: be explicit about what is in scope and what is NOT in scope for each increment. Its worked example tells the agent to start with just the database schema change and the API endpoint, explicitly defers the UI to the next increment, and requires running the repository's test and build commands afterward. Scope is a property you state, not one you hope the implementer infers.
