Scope: the Prove-It Pattern for bug fixes: reproduce the reported bug with a failing test before touching the fix, fix until the test passes, then run the full suite to guard regressions.

# 02: The Prove-It Pattern

Grounding spine: the source doc "yubi-OS/yubiOS skills/test-driven-development/SKILL.md", "The Prove-It Pattern (Bug Fixes)" section and the frontmatter description ("when a bug report arrives").

## The rule: reproduce before you fix

The source doc is explicit: "When a bug is reported, do not start by trying to fix it. Start by writing a test that reproduces it." The flow it specifies is a five-step chain:

1. Bug report arrives.
2. Write a test that demonstrates the bug.
3. Test FAILS, confirming the bug exists.
4. Implement the fix.
5. Test PASSES, proving the fix works, then run the full test suite for regressions.

The failing reproduction test is what turns a bug report from prose into a falsifiable artifact. Until step 3 happens, the fix is being written against a guess.

## Worked example from the source doc

The source doc uses a timestamp bug: "Completing a task does not update the completedAt timestamp." The reproduction test creates a task, completes it, and asserts completedAt is a Date. That assertion fails on the current code, which confirms the bug. The fix is a two-field update: status "completed" and completedAt set to new Date(). The test then passes, and the doc notes the test now doubles as a regression guard: the bug cannot silently return without failing that test.

## Why this order beats fix-first

The source doc's rationale is that a fix written without a reproduction test can be merged while "All tests pass" even though no test covers the broken behavior; the Red Flags section lists "Bug fixes without reproduction tests" as a red flag. The test-first order also disambiguates the report: if the reproduction test passes immediately, the bug is environment-specific, already fixed, or misreported, and the fixer learns that before writing any code.

External corroboration is thinner here than for other subtopics. The bugnet.io post "How to Turn Every Bug You Fix Into a Regression Test" (https://bugnet.io/blog/how-to-turn-every-bug-you-fix-into-a-regression-test, jev weight 0.15, weak) states the same core rule: for each fixed bug, add a regression test that fails on the old behavior so the bug cannot silently return, and "a bug fixed without a test is a bug that can come back." The softaguide regression-testing entry (https://softaguide.com/software-testing/regression-testing/, jev weight 0.15, weak) defines regression testing as re-running tests after a change to confirm that things which used to work still work, and notes that every fix, feature, refactor, or dependency bump risks breaking something elsewhere. The testdevlab piece on bug reproduction (https://www.testdevlab.com/blog/issue-reproduction-why-reproducing-bugs-matter, jev weight 0.20, weak) argues reproduction steps should let anyone replicate the issue on the same device and environment, which is the manual-testing analogue of a deterministic reproduction test.

All three are weak-weighted (below 0.5) and are cited as corroboration only. The authoritative spine for this pattern is the source doc itself.

## Regression guard as the exit criterion

The final step in the source doc's flow is running the full test suite, not just the new test. The new test proves the specific bug is fixed; the full suite proves the fix did not break anything else. This matters because bug fixes are concentrated edits made under time pressure, which is exactly when collateral damage is most likely. The roadmap.sh automated-regression-testing guide (https://roadmap.sh/ai-engineer/automated-regression-testing, jev weight 0.17, weak) makes the complementary point that running the entire suite after every commit is a common mistake at scale, so teams should keep the suite fast enough that the source doc's instruction is actually followable.

## Relation to the TDD cycle

The Prove-It Pattern is the TDD cycle applied to defect reports: RED is the reproduction test, GREEN is the fix, REFACTOR is optional cleanup. The difference is motivational. In feature work RED defines new behavior; in bug work RED pins existing broken behavior so it cannot regress unnoticed.
