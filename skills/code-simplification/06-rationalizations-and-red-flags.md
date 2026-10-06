# 06 Rationalizations and Red Flags

Scope: the skill's 7 common rationalizations and the 7 red flags that indicate a simplification went wrong, and why the skill needs both a pre-change and post-change guard.

## The rationalizations

The source doc pairs each rationalization with its reality (source doc, Common Rationalizations):

1. "It's working, no need to touch it." Reality: working code that is hard to read will be hard to fix when it breaks. Simplifying now saves time on every future change.
2. "Fewer lines is always simpler." Reality: a 1-line nested ternary is not simpler than a 5-line if/else. Simplicity is about comprehension speed, not line count.
3. "I'll just quickly simplify this unrelated code too." Reality: unscoped simplification creates noisy diffs and risks regressions in code you did not intend to change. Stay focused.
4. "The types make it self-documenting." Reality: types document structure, not intent. A well-named function explains why better than a type signature explains what.
5. "This abstraction might be useful later." Reality: do not preserve speculative abstractions. If it is not used now, it is complexity without value. Remove it and re-add when needed.
6. "The original author must have had a reason." Reality: maybe. Check git blame and apply Chesterton's Fence. But accumulated complexity often has no reason; it is just the residue of iteration under pressure.
7. "I'll refactor while adding this feature." Reality: separate refactoring from feature work. Mixed changes are harder to review, revert, and understand in history.

Rationalization 5 is the one with the strongest independent literature. The speculative generality smell is defined as an unused class, method, field or parameter, created "just in case" to support anticipated future features that never get implemented, making code hard to understand and support (https://refactoring.guru/smells/speculative-generality, jev 0.56). A design-focused writeup frames premature abstraction as an instinct, a reflex rooted in the desire for control rather than a rule of good design (https://techstories.blog/systemdesign/premature-abstraction/, jev 0.17, weak backing). The anti-pattern tradition itself is book-borne: several books popularized the idea and teaching of anti-patterns in software (https://en.wikipedia.org/wiki/List_of_software_anti-patterns, jev 0.32, weak backing).

Rationalization 6 deserves a note because it cuts both ways. The skill does not dismiss the original author's reasoning; it mandates the Chesterton's Fence check from Step 1 (understand before touching). What it rejects is using "must have had a reason" as a reason to never investigate: accumulated complexity often has no reason at all beyond iteration pressure.

## The red flags

The source doc lists 7 red flags, each signaling that a simplification attempt has gone wrong (source doc):

1. Simplification that requires modifying tests to pass. You likely changed behavior.
2. "Simplified" code that is longer and harder to follow than the original.
3. Renaming things to match your preferences rather than project conventions.
4. Removing error handling because "it makes the code cleaner".
5. Simplifying code you do not fully understand.
6. Batching many simplifications into one large, hard-to-review commit.
7. Refactoring code outside the scope of the current task without being asked.

Red flag 1 is the sharpest diagnostic and the one the whole skill leans on. Tests are the behavior-preservation harness; a simplification that needs test edits has, by the skill's own definition, changed behavior. Refactoring guidance states the same obligation in the imperative: do not ignore test failures, because you need unit tests to establish that refactoring did not change functionality, and tests must pass both before and after a refactoring commit (https://hilton.org.uk/blog/refactoring-checklist, jev 0.26, weak backing).

Red flags 3 and 7 are Principle 2 and Principle 5 expressed as failure symptoms; red flags 2 and 4 are Principle 4 (balance) gone wrong in opposite directions, one by over-editing, one by mistaking error handling for complexity. Red flag 5 loops back to Step 1's hard gate: if the comprehension questions cannot be answered, the simplification does not start.

## Why both lists

The rationalizations guard the decision to simplify; the red flags guard the result. An agent can pass every rationalization (only touching in-scope, understood code) and still produce red-flag 6, a batched commit that no reviewer can follow. The two lists together define what the skill considers an honest simplification pass: one that starts for the right reason, and one that ends in a state its own checklist would approve (see doc 07 for the verification list the red flags feed into).

For agent deployment specifically, the rationalizations table doubles as an input filter for model-generated justifications. A simplification proposal phrased as any of the 7 rationalizations is rejected before code is touched, which is cheaper than discovering the same failure in review.

## Sources

- Source doc: yubi-OS/yubiOS skills/code-simplification/SKILL.md (Common Rationalizations, Red Flags).
- https://refactoring.guru/smells/speculative-generality, jev 0.56.
- https://hilton.org.uk/blog/refactoring-checklist, jev 0.26 (weak backing).
- https://en.wikipedia.org/wiki/List_of_software_anti-patterns, jev 0.32 (weak backing).
- https://techstories.blog/systemdesign/premature-abstraction/, jev 0.17 (weak backing).
