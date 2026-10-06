# 02 Axis 1: Correctness

Scope: the first review axis, whether the code does what it claims to do, including spec match, edge and error paths, test quality, and the classic defect classes.

Grounding spine: `yubi-OS/yubiOS skills/code-review-and-quality/SKILL.md` (source doc). External mechanisms are cited with their jev weight.

## What the axis asks

The source doc opens the axis with one question: does the code do what it claims to do? (source doc). It then breaks that into 5 checks the reviewer walks through (source doc):

1. Does it match the spec or task requirements?
2. Are edge cases handled: null, empty, boundary values?
3. Are error paths handled, not just the happy path?
4. Does it pass all tests, and are the tests actually testing the right things?
5. Are there off-by-one errors, race conditions, or state inconsistencies?

The order matters. Spec match comes first because a correct-looking implementation of the wrong task is still wrong. Edge cases and error paths come before test status because a green suite can pass while covering neither.

## Tests are the reviewer's evidence, not the author's alibi

The skill's rationalization table rejects "the tests pass, so it's good": tests are necessary but not sufficient, and they do not catch architecture problems, security issues, or readability concerns (source doc). The red-flag list adds "no regression tests with bug fix PRs" (source doc), meaning a bug fix without a test that would fail on the old code is itself a review finding.

The review checklist encodes 4 correctness boxes: the change matches spec and task requirements, edge cases are handled, error paths are handled, and tests cover the change adequately (source doc). A developer checklist published as a review aid covers the same ground, pairing edge-case handling with input validation as the first correctness checks a reviewer walks (noul 0.67, https://hyrax.dev/learn/code-review-checklist).

## Defect classes the axis names

Off-by-one errors, race conditions, and state inconsistencies are named as the specific defect classes the reviewer hunts for (source doc). These share a property: they pass casual testing because they appear at boundaries and under concurrency, not on the happy path. This is why the axis handles them together with edge-case coverage rather than as a separate discipline.

## How the axis connects to the rest of the skill

Correctness is the first axis in the implementation walk: for each file changed the reviewer asks, in order, does this code do what the test says it should (correctness), can I understand this without help (readability), does this fit the system (architecture), any vulnerabilities (security), any bottlenecks (performance) (source doc). Correctness leads the walk.

The findings framework puts correctness failures at the top of the severity ladder. A Critical prefix blocks merge and is reserved for security vulnerability, data loss, and broken functionality; a no-prefix finding is a Required change that must be addressed before merge (source doc). A correctness bug that will hit production is the canonical case the honesty section warns against softening: calling it "a minor concern" when it is a bug that will reach production is dishonest review (source doc).

## Verification of the verification

Step 5 of the review process asks the reviewer to check the author's verification story: what tests were run, did the build pass, was the change tested manually, are there screenshots for UI changes, is there a before and after comparison (source doc). This is the correctness axis applied to the author's own claims. Platform guidance for structured manual testing, such as Azure Test Plans run records, is the standard mechanism for making "tested manually" auditable rather than asserted (noul 0.93, https://learn.microsoft.com/en-us/azure/devops/test/run-manual-tests?view=azure-devops).

The axis closes only when the story is documented: the final verification checklist requires the verification story to be written down, not just performed (source doc).
