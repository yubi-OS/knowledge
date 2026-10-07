# 04 Change Sizing and Concern Separation

Scope: the skill's size targets (~100 lines per commit/PR, split at ~1000), keeping formatting separate from behavior, and keeping refactors separate from features.

## The size ladder

The ground source (yubi-OS/yubiOS skills/git-workflow-and-versioning/SKILL.md) sets an explicit ladder:

- ~100 lines: easy to review, easy to revert. This is the target per commit and per PR.
- ~300 lines: acceptable for a single logical change.
- ~1000 lines: split into smaller changes.

The skill points at the splitting strategies in `code-review-and-quality` for how to break large changes down. Its rationalizations table closes the loop: "I'll split this change later" fails because large changes are harder to review, riskier to deploy, and harder to revert; split before submitting, not after (source doc).

External sizing research is directionally consistent with the ladder, with different thresholds. An engineering-metrics guide cites Google research that review quality degrades significantly above 200 lines of changed code, and that smaller PRs get reviewed faster, catch more bugs, and merge more frequently (https://www.em-tools.io/engineering-metrics/pull-request-size, weight 0.11, weak backing). A review-focused blog cites SmartBear's Cisco study showing defect-detection ability drops as review size grows, and suggests aiming under ~400 changed lines (https://pyor.review/blog/how-big-should-a-pull-request-be, weight 0.14, weak backing). A PR-size practices guide covers the same territory (https://staging-graphite-splash.vercel.app/guides/best-practices-managing-pr-size, weight 0.11, weak backing). The numbers differ across sources; the direction, smaller is better and there is a hard ceiling where splitting becomes mandatory, is shared. The skill's 1000-line hard split point is its own conservative choice.

## Concern separation

The skill's rule 4: "Don't combine formatting changes with behavior changes. Don't combine refactors with features. Each type of change should be a separate commit, and ideally a separate PR." Its example contrasts two clean commits (`refactor: extract validation logic to shared utility`, then `feat: add phone number validation to registration`) against the mixed single message `refactor validation and add phone number field`.

The skill adds a nuance: small cleanups such as renaming a variable can be included in a feature commit at reviewer discretion (source doc). The rule is a default, with a narrow carve-out for trivially small cleanups.

The separation rationale is review comprehension. A splitting guide puts "separate refactoring from features" first among its strategies, because mixed PRs confuse reviewers about what changed and why (https://www.thedroidsonroids.com/blog/splitting-pull-request, weight 0.16, weak backing). The practitioner question of whether to interleave refactoring with feature development has a long history on Stack Overflow, with the accepted answer favoring separation, especially for mechanical refactors and reformatting (https://stackoverflow.com/questions/1511480/refactoring-and-non-refactoring-changes-as-separate-check-ins, weight 0.11, weak backing).

## How sizing and separation compose

The two rules interact. Concern separation is what makes the ~100-line target reachable: a refactor extracted from a feature is usually reviewable alone. Sizing is what makes the skill's trunk-based merge window (doc 01) realistic: a 1 to 3 day branch composed of ~100-line commits lands as a sequence of small PRs rather than one divergence event.

For agents, the operational check is the per-commit verification list: no formatting-only changes mixed with behavior changes, and commit does one logical thing (source doc). When a change would cross ~1000 lines, the correct move is to stop and split along its natural joints (refactor first, then feature slices), not to submit and apologize in the PR description.

Red flags from the source doc that indicate this rule is being violated: formatting changes mixed with behavior changes, and large uncommitted changes accumulating. Both are also the failure signatures that make a revert costly, which is the skill's core motivation for atomic, small, separated changes.
