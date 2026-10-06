# 05 - Guard and Verify

Scope: Steps 5 and 6 of the triage checklist, the regression test that fails without the fix, and the 6-item end-to-end verification gate.

## Step 5: Guard against recurrence

The source doc's Step 5 requires writing a test that catches this specific failure, with a worked example: task titles containing special characters broke search, so the guard test creates a task titled with quotes and angle brackets, searches for it, and asserts both the result count and the exact title round-trip.

The property that makes the test a guard rather than a decoration is stated explicitly: it should fail without the fix and pass with it (source doc). A test that passes before and after proves nothing about the bug; it is the before-failure that gives the test its diagnostic power. Regression testing as a practice exists to check that code modifications are not harming existing functionality or introducing new bugs (https://www.ibm.com/think/topics/regression-testing, w 0.6), which is the portfolio-level version of the same idea: every fix leaves behind one more tripwire in the suite.

The source doc's Red Flags list makes the guard mandatory, not optional: "No regression test added after a bug fix" is itself a red flag (source doc).

## Step 6: Verify end to end

Step 6 runs four checks with the repository's own commands (npm shown, substitute the repo's own):

```
npm test -- --grep "specific test"   # the fix's own test
npm test                             # full suite, regression check
npm run build                        # type and compilation errors
npm run dev                          # manual spot check if applicable
```

The progression matters: the focused test proves the fix, the full suite proves the fix did not break anything else, the build proves type-level consistency, and the manual check proves the user-visible scenario. The source doc also ties this step to a cross-skill dependency: the repository's own test command discovery is delegated to the test-driven-development skill's Discover the Stack First section (source doc).

## The verification checklist

The source doc closes with a 6-item checklist applied after fixing a bug:

- [ ] Root cause is identified and documented
- [ ] Fix addresses the root cause, not just symptoms
- [ ] A regression test exists that fails without the fix
- [ ] All existing tests pass
- [ ] Build succeeds
- [ ] The original bug scenario is verified end-to-end

The checklist is binary. A fix that cannot pass all 6 items is not verified, and "it works now" without the checklist is the exact failure mode the source doc's Red Flags section names (source doc). Items 1 and 2 are the audit hooks: they require the cause to be written down, which is what makes the fix reviewable by someone who did not watch the debugging session.

The RESUME gate from doc 01 is this checklist. Verification passing is the only condition under which the stop-the-line rule lets feature work resume.
