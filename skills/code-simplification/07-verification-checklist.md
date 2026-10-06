# 07 The Verification Checklist

Scope: the skill's post-pass verification checklist, the 9 gates a simplification pass must clear before it counts as done, and the external review practice behind them.

## The checklist

The source doc closes its process with 9 checkboxes to clear after completing a simplification pass (source doc, Verification):

1. All existing tests pass without modification.
2. Build succeeds with no new warnings.
3. Linter and formatter pass, no style regressions.
4. Each simplification is a reviewable, incremental change.
5. The diff is clean, no unrelated changes mixed in.
6. Simplified code follows project conventions, checked against CLAUDE.md or equivalent.
7. No error handling was removed or weakened.
8. No dead code was left behind: unused imports, unreachable branches.
9. A teammate or review agent would approve the change as a net improvement.

## What each gate protects

Gates 1 through 3 are the mechanical safety net. Gate 1 is the behavior-preservation contract: tests pass unmodified, so the observable behavior is pinned. The refactoring-checklist literature states it directly: do not ignore test failures, because unit tests are what establish that refactoring did not change functionality, and tests must pass both before and after a refactoring commit (https://hilton.org.uk/blog/refactoring-checklist, jev 0.26, weak backing). Gates 2 and 3 extend the same idea to the toolchain: a clean build with no new warnings and a passing linter catch the accidental regressions that tests miss, especially style drift introduced by the simplification itself.

Gate 4 enforces the incremental discipline from Step 3: each simplification lands as a reviewable unit, which is what lets a reviewer bisect a bad change. Gate 5 is the scope discipline from Principle 5 expressed as a diff property: no unrelated changes mixed in. The source doc repeats both in its red flags (batching many simplifications into one large commit; refactoring outside scope), so the checklist is where the principles become checkable facts.

Gate 6 closes the loop on Principle 2: conventions are verified against CLAUDE.md or the project's equivalent file, not against the agent's own taste. Gate 7 is the error-handling invariant, the strongest absolute rule besides behavior preservation: removing or weakening error handling to make code cleaner is a listed red flag, and the checklist tests for it explicitly.

Gate 8 is the no-residue rule: a simplification pass must not leave unused imports or unreachable branches behind, which are the mechanical remnants of a refactor that removed calls but not their support.

Gate 9 is the human-in-the-loop backstop, stated as a simulation: would a teammate or review agent approve this as a net improvement? The code-review literature treats checklists as the mechanism for making review discussable and repeatable; a comprehensive code review checklist maintains code quality, catches bugs early, and facilitates knowledge sharing (https://dev.to/everettbutler/code-review-checklist-a-comprehensive-guide-cfh, jev 0.14, weak backing), and a second guide frames the checklist as a tool to drive better discussion and catch more issues (https://getdx.com/blog/code-review-checklist/, jev 0.19, weak backing). Gate 9 imports that practice into the skill: the pass is not done when the code compiles, it is done when a hypothetical reviewer would approve it.

## Checklist and process fit

The checklist is the exit gate of the 4-step process from doc 03. It is also the input to Step 4's whole-result comparison: if any gate fails, the source doc's instruction is to revert the failing simplification rather than to argue it through (source doc). In an agent setting the checklist doubles as an automated verification script: gates 1 to 3 and 8 are runnable (test suite, build, linter, dead-code scan), which means 4 of the 9 gates can be enforced mechanically in CI before a human ever looks.

## Sources

- Source doc: yubi-OS/yubiOS skills/code-simplification/SKILL.md (Verification, Red Flags, The Five Principles).
- https://hilton.org.uk/blog/refactoring-checklist, jev 0.26 (weak backing).
- https://getdx.com/blog/code-review-checklist/, jev 0.19 (weak backing).
- https://dev.to/everettbutler/code-review-checklist-a-comprehensive-guide-cfh, jev 0.14 (weak backing).
- https://refactoring.guru/refactoring/how-to, jev 0.56.
