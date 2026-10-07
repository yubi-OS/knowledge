# 02 Atomic Commit Discipline

Scope: commit early and commit often, commits as save points, the implement-test-verify-commit loop, and atomic commits that do one logical thing.

## Commits as save points

The ground source (yubi-OS/yubiOS skills/git-workflow-and-versioning/SKILL.md) frames commits as save points and branches as sandboxes. Its rule 1 is "Commit Early, Commit Often: each successful increment gets its own commit. Don't accumulate large uncommitted changes." The prescribed work pattern is a loop: implement a slice, test, verify, commit, then move to the next slice. The explicit anti-pattern is "implement everything, hope it works, giant commit."

The rationale is recovery granularity: "If the next change breaks something, you can revert to the last known-good state instantly" (source doc). The skill's save point section makes the guarantee quantitative: you never lose more than one increment of work, and a failed step ends in `git reset --hard HEAD` back to the last successful state (doc 06 covers this pattern).

The long-standing community version of this rule is Seth Robertson's "Commit Early And Often" guidance, which frames frequent committing as the habit that makes later perfection possible (https://sethrobertson.github.io/GitBestPractices/, weight 0.26, weak backing). W3Schools' git best-practices page says the same in simpler terms: small, frequent commits make it easier to track changes and find bugs (https://www.w3schools.com/git/git_best_practices.asp, weight 0.13, weak backing).

## Atomic commits: one logical thing each

Rule 2 of the skill is atomicity: "Each commit does one logical thing." The source doc contrasts a good history, where each commit is self-contained (add a form component, then connect it to the API with loading state, then add tests), with a bad one that mixes a feature, a sidebar fix, a dependency update, and a utility refactor into a single commit.

The general definition used across practitioner references matches: an atomic commit is a single, complete, coherent logical change that compiles and passes its own tests on its own (https://aicodingpatterns.com/en/patterns/commits-atomicos-buenas-practicas/, weight 0.16, weak backing). Compile N Run's git docs describe atomic commits as a fundamental best practice that improves project history and makes collaboration smoother by making each commit a single logical change (https://www.compilenrun.com/docs/devops/git/git-best-practices/git-atomic-commits/, weight 0.12, weak backing). Gitopedia's phrasing adds the revert motivation: commit unrelated changes separately so each commit is a logical unit, making history easier to understand and revert (https://gitbybit.com/gitopedia/best-practices/atomic-commits, weight 0.13, weak backing).

Why atomicity matters operationally, per the skill and its corroboration:

- Review: a one-thing commit can be read in one pass (source doc, doc 04).
- Revert: an unwanted behavior change can be backed out without carrying unrelated edits with it (source doc, https://gitbybit.com/gitopedia/best-practices/atomic-commits, weight 0.13).
- Debug: `git bisect` walking a history of self-contained commits gives clean signal at each midpoint (source doc; git-bisect docs at https://git-scm.com/docs/git-bisect, weight 0.97).

## What "one increment" means in practice

The skill's good example history interleaves code, wiring, and tests as separate commits. That is the intent: a test commit is its own save point, not an appendix to a feature commit. The verification checklist in the source doc makes "commit does one logical thing" a per-commit gate, alongside message conventions (doc 03) and the no-mixed-concerns rule (doc 04).

The failure mode the skill warns about is accumulation: large uncommitted changes sitting in the working tree are listed first among its red flags (source doc). An agent working at high speed should treat an uncommitted working tree past one increment as a stop signal and commit or split before continuing.
