# 03 Axis 2: Readability and Simplicity

Scope: the second review axis, whether another engineer or agent can understand the code without the author explaining it, plus the simplicity heuristics the skill encodes.

Grounding spine: `yubi-OS/yubiOS skills/code-review-and-quality/SKILL.md` (source doc). External mechanisms are cited with their jev weight.

## The test the axis applies

The source doc states the axis as a transfer test: can another engineer, or agent, understand this code without the author explaining it? (source doc). If the answer needs a walkthrough, the code fails the axis regardless of how it runs.

## The checks the reviewer walks

The source doc lists the axis checks (source doc):

1. Names are descriptive and consistent with project conventions. Names like `temp`, `data`, and `result` without context are called out as failures.
2. Control flow is straightforward: avoid nested ternaries and deep callbacks.
3. Code is organized logically, with related code grouped and clear module boundaries.
4. "Clever" tricks are flagged for simplification.
5. Comments clarify non-obvious intent, but obvious code is not commented.

Two of these checks are bolded in the source doc as the axis's distinctive standards. First: could this be done in fewer lines? 1000 lines where 100 suffice is a failure (source doc). Second: are abstractions earning their complexity? The rule is to not generalize until the third use case (source doc). The rule of three is the classical formulation of that heuristic in the literature: duplicated code may be copied twice, but a third occurrence should be refactored into a shared abstraction (noul 0.47, weak, https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming)). The source doc's phrasing matches that standard.

## Dead code artifacts

The axis explicitly asks for dead code artifacts: no-op variables such as `_unused`, backwards-compat shims kept for nobody, and `// removed` comments (source doc). These are readability failures because each one forces a reader to ask whether it matters. The skill pairs the detection with a rule from its dead code hygiene section: list what is now unused, then ask before deleting, and never silently delete things the reviewer is unsure about (source doc).

## The two design-smell patterns

The source doc bolds 2 patterns that elevate readability findings from nits to structural complaints (source doc):

1. A new conditional bolted onto an unrelated flow. This is a design smell, not a nit: the fix is to push the logic into its own helper, state, or policy instead of tangling an existing path.
2. Repeated conditionals on the same shape. These signal a missing model or dispatcher, and a "temporary" branch is usually permanent debt.

Both patterns convert a local readability observation into a named structural remedy, which the structural remedies doc (07 in this corpus) catalogs.

## What the axis is not

It is not a style gate and not an opportunity to block on taste. The approval standard says a reviewer should not block a change because it is not exactly how they would have written it (source doc). The severity labels exist so this holds in practice: formatting and style preferences are explicitly the domain of the Nit prefix, which the author may ignore (source doc). A readability finding earns Required status only when the code genuinely fails the transfer test or one of the design-smell patterns fires.

The red-flag list repeats the theme at the process level: review comments without severity labels make it unclear what is required versus optional, and that ambiguity is itself a review failure (source doc).
