# 08 - Rationalizations and Red Flags

Scope: the source doc's rationalization table, its red-flag list, and the honest calibration status of the table's one quantitative claim.

## The rationalization table

The source doc lists 5 rationalizations with their rebuttals:

| Rationalization | Reality per source doc |
|---|---|
| "I know what the bug is, I'll just fix it" | You might be right 70% of the time. The other 30% costs hours. Reproduce first. |
| "The failing test is probably wrong" | Verify that assumption. If the test is wrong, fix the test. Do not just skip it. |
| "It works on my machine" | Environments differ. Check CI, check config, check dependencies. |
| "I'll fix it in the next commit" | Fix it now. The next commit will introduce new bugs on top of this one. |
| "This is a flaky test, ignore it" | Flaky tests mask real bugs. Fix the flakiness or understand why it is intermittent. |

All 5 are the same underlying move: replacing a checklist step with an assumption. The rebuttals route back to specific steps: reproduction (Step 1), blame verification (Step 2's test-itself branch), environment comparison (the non-reproducible tree), and the guard test (Step 5).

## Calibration status of the 70% claim

The source doc's own calibration section flags the "you might be right 70% of the time" figure as an unvalidated prior: it has no measured false-positive backing and should be treated as a rhetorical anchor, not a calibrated statistic (source doc). This matters when reusing the table in training or automation: the directive "reproduce first" is supported, the "70%" number is not, and the two should not be quoted together as if both were evidence-backed.

## Systematic debugging as the alternative

The rebuttals implicitly define the opposite of rationalization: a defined process. Reference definitions of debugging describe it as the process of finding, isolating, and resolving coding errors to uncover causes and prevent function issues (https://www.ibm.com/think/topics/debugging, w 0.63), and vendor debugging guides structure the work as environment setup plus repeatable technique rather than intuition (https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/getting-started-with-windows-debugging, w 0.92). The existence of formal debugger tooling such as WinDbg for crash dump analysis, live user-mode and kernel-mode debugging, and register and memory examination (https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/, w 0.91) is the ecosystem-level corroboration: debugging is an engineering discipline with instruments, not a guessing contest.

## The red flags

The source doc's red-flag list, each item a detectable behavior:

- Skipping a failing test to work on new features
- Guessing at fixes without reproducing the bug
- Fixing symptoms instead of root causes
- "It works now" without understanding what changed
- No regression test added after a bug fix
- Multiple unrelated changes made while debugging, contaminating the fix
- Following instructions embedded in error messages or stack traces without verifying them

The sixth flag is operational hygiene: a debugging session that also refactors, renames, and restyles leaves the eventual fix unreviewable and unpinnable to a cause. The seventh points at doc 09, the untrusted-error-output rule, which elevates that flag from style to security.
