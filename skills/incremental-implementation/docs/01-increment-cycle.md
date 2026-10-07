# 01 - The Increment Cycle

Scope: the implement, test, verify, commit loop that every increment follows, and why each slice must leave the system working and testable.

## The loop

The source doc (`yubi-OS/yubiOS skills/incremental-implementation/SKILL.md`) defines a single cycle that repeats for every slice: implement, test, verify, commit, then move to the next slice. The five steps are fixed:

1. Implement the smallest complete piece of functionality.
2. Test: run the test suite, or write a test if none exists.
3. Verify: confirm the slice works as expected, through tests passing, a successful build, or a manual check.
4. Commit with a descriptive message; the source doc points to `git-workflow-and-versioning` for atomic commit guidance.
5. Move to the next slice, carrying forward what you learned instead of restarting.

The defining property of the cycle is that each increment leaves the system in a working, testable state. The source doc states this directly in its Overview: "Build in thin vertical slices, implement one piece, test it, verify it, then expand."

## Why incremental beats big-bang

The distinction between iterative and incremental work matters for how you schedule verification. In the incremental model, each increment represents a portion of the overall system functionality, and each increment goes through a full cycle of development and testing before the next begins (https://www.geeksforgeeks.org/software-engineering/iterative-vs-incremental-model-in-software-development/, jev weight 0.25, weak backing). Mountain Goat Software describes the same split from the team side: iterative development means revisiting the same product repeatedly, incremental development means adding function in pieces, and a team that leans too hard on only one of the two loses the benefits of the other (https://www.mountaingoatsoftware.com/agile/new-to-agile-or-scrum/iterative-and-incremental, jev weight 0.69).

The practical payoff is early feedback. The incremental model collects feedback after delivering each functional increment, so users can evaluate and use partial functionality while the remaining features are still being built (https://gridfox.com/blog/iterative-model-and-incremental-model/, jev weight 0.16, weak backing). This is exactly what the source doc's cycle is designed to produce: a commit at the end of every loop is a checkpoint where the partial system is real and usable.

## Thin first slices

When a feature is new, the first increment should be a walking skeleton: a minimal end-to-end version of the system that goes through the real pipeline, built to validate that the components work together before you invest heavily in any one of them (https://distilledpatterns.org/patterns/walking-skeleton/, jev weight 0.35, weak backing). The source doc's vertical-slice example follows this shape: Slice 1 is "Create a task" spanning database, API, and basic UI, and it is only considered done when tests pass and a user can create a task through the UI.

## Verify without waste

The source doc closes the loop with an anti-waste rule for the verify step: run each verification command after a change that could affect it, and after a successful run do not repeat the same command unless the code has changed since. Re-running on unchanged code adds no information. The same rule appears in the skill's rationalizations table: "Let me run the build command again just to be sure" is a rationalization, and the correction is to run it again after subsequent edits, not as reassurance.

## Carry forward

The final step, "move to the next slice", is not a reset. Each slice starts from the state the previous slice committed. This is what keeps a 4-slice CRUD feature coherent: by Slice 4, the delete flow builds on the list flow from Slice 2 and the edit flow from Slice 3, all already tested and committed. If a slice fails its verify step, the failure surface is one slice wide, not one feature wide.
