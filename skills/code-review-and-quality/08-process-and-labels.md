# 08 Review Process and Severity Labels

Scope: the 5-step review process the skill prescribes, the severity prefix system, and the lead-with-what-matters ordering rule.

Grounding spine: `yubi-OS/yubiOS skills/code-review-and-quality/SKILL.md` (source doc). External mechanisms are cited with their jev weight.

## The 5 steps

The source doc prescribes 5 steps in order (source doc):

1. Understand the context. Before looking at code: what is this change trying to accomplish, what spec or task does it implement, what is the expected behavior change?
2. Review the tests first. Tests reveal intent and coverage: do tests exist, do they test behavior rather than implementation details, are edge cases covered, do they have descriptive names, would they catch a regression if the code changed?
3. Review the implementation. Walk each changed file with the 5 axes in order: correctness, readability, architecture, security, performance.
4. Categorize findings. Label every comment with its severity.
5. Verify the verification. Check the author's verification story: what tests were run, did the build pass, was the change tested manually, are there screenshots for UI changes, is there a before and after comparison?

Reading tests before implementation is the step most teams skip, and it is what makes step 3 cheap: the tests state the intent the implementation should match (source doc).

## The severity prefix system

The labeling system has 5 levels (source doc):

| Prefix | Meaning | Author action |
|--------|---------|---------------|
| no prefix | Required change | Must address before merge |
| Critical | Blocks merge | Security vulnerability, data loss, broken functionality |
| Nit | Minor, optional | Author may ignore: formatting, style preferences |
| Optional / Consider | Suggestion | Worth considering but not required |
| FYI | Informational only | No action needed, context for future reference |

The stated purpose: this prevents authors from treating all feedback as mandatory and wasting time on optional suggestions (source doc). The convention is standardized in the wider community as conventional comments, which uses the same label-as-prefix pattern so that review intent is machine-readable as well as human-readable (noul 0.29, weak, https://conventionalcomments.org/). Review comments without severity labels are on the skill's red-flag list for exactly the ambiguity they create (source doc).

## Lead with what matters

Findings are ordered by leverage: correctness and security first, then structural regressions and missed simplifications, then everything else (source doc). Two supporting rules: do not bury a real issue under cosmetic nits, and a few high-conviction comments beat a long list. The source doc states it memorably: if you have one structural problem and 10 nits, the structural problem is the review (source doc).

## What the labels do at merge time

The labels drive the final gate. The verification checklist requires all Critical issues resolved, all Required (no-prefix) changes resolved or explicitly deferred with justification, tests pass, build succeeds, and the verification story documented (source doc). Nits and FYIs carry no gate weight, which is what makes the gate enforceable without arguing about taste.

## The example review prompt

The source doc includes a ready-to-use prompt for a review agent: review this code change for correctness, security, and adherence to project conventions; the spec says X and the change should Y; flag issues as Critical, Required, Optional, or Nit (source doc). Note that the prompt compresses the label set to 4 by merging the no-prefix Required level into the instruction, which keeps the severity ladder intact for machine-driven review.

## Manual verification is part of the process

Step 5's manual-testing question is answerable, not rhetorical. Platform guidance defines what a manual test run record looks like: test suites, steps, outcomes, and attachments, which is what makes the reviewer's check auditable rather than a trust-based claim (noul 0.93, https://learn.microsoft.com/en-us/azure/devops/test/run-manual-tests?view=azure-devops). The "test the diff, not the app" framing from practitioner writing makes the same point from the other side: verification should be scoped to what changed (noul 0.15, weak, https://hackernoon.com/test-the-diff-not-the-app).
