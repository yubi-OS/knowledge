# 02 The Five Principles

Scope: the skill's Five Principles, which act as the governing rules over every simplification pass: preserve behavior exactly, follow project conventions, prefer clarity over cleverness, maintain balance against over-simplification, and scope to what changed.

## Principle 1: Preserve Behavior Exactly

The source doc makes behavior preservation the first and hardest rule: do not change what the code does, only how it expresses it. All inputs, outputs, side effects, error behavior, and edge cases must remain identical. If you are not sure a simplification preserves behavior, do not make it (source doc, The Five Principles).

The principle comes with a 4-question checklist the source doc says to ask before every change: does this produce the same output for every input, does it maintain the same error behavior, does it preserve the same side effects and ordering, and do all existing tests still pass without modification (source doc).

This is the canonical definition of refactoring in the literature. Martin Fowler's definition is "a change made to the internal structure of software to make it easier to understand and cheaper to modify without changing its observable behavior" (https://martinfowler.com/bliki/DefinitionOfRefactoring.html, jev 0.91). Wikipedia's entry carries the same framing: restructuring that changes the factoring without changing external behavior, improving non-functional attributes while preserving functionality (https://en.wikipedia.org/wiki/Code_refactoring, jev 0.43, weak backing).

## Principle 2: Follow Project Conventions

Simplification means making code more consistent with the codebase, not imposing external preferences. The source doc prescribes a 3-step preparation: read CLAUDE.md or the project's conventions file, study how neighboring code handles similar patterns, then match the project's style for import ordering and module system, function declaration style, naming conventions, error handling patterns, and type annotation depth (source doc).

Its verdict is sharp: simplification that breaks project consistency is not simplification, it is churn (source doc). This also bounds the agent's taste: a style preference imported from another codebase or from the model's training data does not justify a rename.

## Principle 3: Prefer Clarity Over Cleverness

Explicit code beats compact code when the compact version requires a mental pause to parse. The source doc gives 2 TypeScript contrasts: a dense nested ternary chain replaced by an if/else chain in a named function, and a chained reduce with inline logic replaced by a named intermediate step (a Map built in a plain loop) (source doc).

A weakly-weighted but aligned practitioner source puts the cost case plainly: readable code is more valuable than clever code because engineers spend more time reading code than writing it, which yields easier maintenance and fewer regressions (https://remarkablemark.org/blog/2022/01/16/readable-versus-clever-code/, jev 0.27, weak backing). A second writeup makes the economic version of the same point: readable code usually creates more engineering value than clever code because most product work needs maintainability more than theoretical optimization (https://www.storypointlab.com/blog/why-readability-beats-clever-code, jev 0.17, weak backing).

## Principle 4: Maintain Balance

The source doc names over-simplification as the skill's failure mode and lists 4 traps (source doc):

1. Inlining too aggressively: removing a helper that gave a concept a name makes the call site harder to read.
2. Combining unrelated logic: two simple functions merged into one complex function is not simpler.
3. Removing "unnecessary" abstraction: some abstractions exist for extensibility or testability, not complexity.
4. Optimizing for line count: fewer lines is not the goal, easier comprehension is.

Trap 3 is the hardest to apply mechanically, because it requires judging what an abstraction is for. The complexity-smell literature offers a concrete test for the "might be useful later" case: speculative generality is the smell where an unused class, method, field or parameter exists "just in case" for anticipated future features that never arrive, making code harder to understand and support (https://refactoring.guru/smells/speculative-generality, jev 0.56). An abstraction with a real current consumer is not speculative; an abstraction whose only caller is hypothetical is.

## Principle 5: Scope to What Changed

Default to simplifying recently modified code. Avoid drive-by refactors of unrelated code unless explicitly asked to broaden scope. The source doc's rationale: unscoped simplification creates noise in diffs and risks unintended regressions (source doc).

## How the principles relate

The 5 principles are ordered constraints, not a checklist of equal options. Principle 1 (behavior) is absolute and gates everything else. Principles 2 (conventions) and 5 (scope) bound where the agent may act. Principle 3 (clarity) defines the direction of change. Principle 4 (balance) guards against overshooting the direction. A change that fails any one of them is not shipped as a simplification, even if it is small and local.

## Sources

- Source doc: yubi-OS/yubiOS skills/code-simplification/SKILL.md (The Five Principles).
- https://martinfowler.com/bliki/DefinitionOfRefactoring.html, jev 0.91.
- https://refactoring.guru/smells/speculative-generality, jev 0.56.
- https://www.artima.com/articles/refactoring-with-martin-fowler, jev 0.60.
- https://en.wikipedia.org/wiki/Code_refactoring, jev 0.43 (weak backing).
- https://remarkablemark.org/blog/2022/01/16/readable-versus-clever-code/, jev 0.27 (weak backing).
- https://www.storypointlab.com/blog/why-readability-beats-clever-code, jev 0.17 (weak backing).
