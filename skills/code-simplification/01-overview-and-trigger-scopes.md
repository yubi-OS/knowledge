# 01 Overview and Trigger Scopes

Scope: what the code-simplification skill is for, the single test it applies to every change, and the trigger lists (when to use, when not to use) that define its boundary.

## The goal, per the source doc

The skill's ground doc is `yubi-OS/yubiOS skills/code-simplification/SKILL.md` (source doc). Its Overview states the core thesis: simplify code by reducing complexity while preserving exact behavior. The goal is not fewer lines. It is code that is easier to read, understand, modify, and debug. The source doc dates from the yubiOS skill corpus and credits the Claude Code Simplifier plugin as its inspiration, adapted as a model-agnostic, process-driven skill for any AI coding agent.

The skill reduces everything it does to one test: "Would a new team member understand this faster than the original?" If the answer is no, the change is not a simplification no matter how small the diff. This is a deliberate inversion of the common line-count metric: a 1-line nested ternary is not simpler than a 5-line if/else, because simplicity is about comprehension speed, not line count (source doc, Common Rationalizations).

External literature converges on the same definition. Martin Fowler defines refactoring as "a change made to the internal structure of software to make it easier to understand and cheaper to modify without changing its observable behavior" (https://martinfowler.com/bliki/DefinitionOfRefactoring.html, jev 0.91). In a 2003 artima interview Fowler restates it the same way: changes that improve internal structure without changing external behavior (https://www.artima.com/articles/refactoring-with-martin-fowler, jev 0.60). Refactoring.Guru frames the purpose as paying off technical debt through systematic improvement without new functionality (https://refactoring.guru/refactoring, jev 0.52).

## When to use

The source doc lists 6 triggers (source doc, When to Use):

1. After a feature is working and tests pass, but the implementation feels heavier than it needs to be.
2. During code review when readability or complexity issues are flagged.
3. When you encounter deeply nested logic, long functions, or unclear names.
4. When refactoring code written under time pressure.
5. When consolidating related logic scattered across files.
6. After merging changes that introduced duplication or inconsistency.

All 6 triggers share one precondition: the code already works. The skill operates after the behavior exists and is pinned by passing tests. This matches the broader refactoring literature, where refactoring is restructuring that preserves external behavior, so tests are the harness that makes restructuring safe (https://en.wikipedia.org/wiki/Code_refactoring, jev 0.43, weak backing).

## When NOT to use

The source doc names 4 counter-triggers (source doc):

1. Code is already clean and readable. Do not simplify for the sake of it.
2. You do not understand what the code does yet. Comprehend before you simplify.
3. The code is performance-critical and the "simpler" version would be measurably slower.
4. You are about to rewrite the module entirely. Simplifying throwaway code wastes effort.

The second and third triggers are the operative ones in practice. Comprehension-before-change is exactly what Chesterton's Fence enforces, and the skill makes it a hard gate (see doc 03). Performance is an explicit carve-out: the skill optimizes comprehension, not runtime, so any change that trades measurable speed for readability is out of scope.

## The timing question: opportunistic, not scheduled

The refactoring literature supports the skill's trigger-first stance. Refactoring.Guru's "When to refactor" page argues for opportunistic refactoring tied to concrete work, and gives the Rule of Three schedule for duplication: do it the first time, repeat it the second, refactor on the third (https://refactoring.guru/refactoring/when, jev 0.63). Wikipedia records the same rule of thumb: "three strikes and you refactor" is used to decide when similar pieces of code should be refactored to avoid duplication (https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming), jev 0.47, weak backing). A practitioner writeup adds the counterpoint the source doc encodes as restraint: following clean-code rules mechanically can create more code to maintain, which is why the trigger lists gate entry (https://understandlegacycode.com/blog/refactoring-rule-of-three/, jev 0.28, weak backing).

## Boundary

The source doc's Guidelines close with a scope rule: every use stays inside the frontmatter description's scope, and anything beyond it is a different skill's job (source doc). In the yubiOS corpus that means simplification is distinct from code review (which evaluates changes on multiple axes), from test-driven development (which pins behavior before it exists), and from security review (which adds requirements). Simplification only reshapes what is already there.

## Sources

- Source doc: yubi-OS/yubiOS skills/code-simplification/SKILL.md (Overview, When to Use, Guidelines).
- https://martinfowler.com/bliki/DefinitionOfRefactoring.html, jev 0.91.
- https://www.artima.com/articles/refactoring-with-martin-fowler, jev 0.60.
- https://refactoring.guru/refactoring, jev 0.52.
- https://refactoring.guru/refactoring/when, jev 0.63.
- https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming), jev 0.47 (weak backing).
- https://understandlegacycode.com/blog/refactoring-rule-of-three/, jev 0.28 (weak backing).
- https://en.wikipedia.org/wiki/Code_refactoring, jev 0.43 (weak backing).
