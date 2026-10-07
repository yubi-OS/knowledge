# 05 - Keep It Compilable

Scope: Rules 1 and 2 from the source doc, one logical change per increment, and never leaving the codebase broken between slices.

## Rule 1: one thing at a time

The source doc (`yubi-OS/yubiOS skills/incremental-implementation/SKILL.md`) defines Rule 1 as: "Each increment changes one logical thing. Don't mix concerns." Its contrast example: one commit that adds a new component, refactors an existing one, and updates the build config is bad; 3 separate commits, one for each change, is good.

The atomic-commit literature states the same property as the definition of the unit: commit unrelated changes separately, so that each commit is a logical unit of work, which makes the history of changes easier to understand (https://gitbybit.com/gitopedia/best-practices/atomic-commits, jev weight 0.14, weak backing). A popular treatment compresses it to "one logical change per commit: each commit should represent a single, complete, and reversible change" (https://hackernoon.com/small-commits-big-wins-how-atomic-changes-transform-developer-life, jev weight 0.15, weak backing). The database meaning of the term backs the word choice: atomic commits in database systems fulfil atomicity and consistency, where consistency is only achieved if every change in the atomic operation is applied or none is (https://en.wikipedia.org/wiki/Atomic_commit, jev weight 0.51).

## Rule 2: the always-green discipline

Rule 2 states: "After each increment, the project must build and existing tests must pass. Don't leave the codebase in a broken state between slices." This is the integration-level version of the same discipline. Continuous Integration is defined as a software development practice where each member of a team merges their changes into a shared mainline frequently, and the practice only works if every merge keeps the mainline buildable (https://martinfowler.com/articles/continuousIntegration.html, jev weight 0.87).

The mechanism behind the rule is diagnostic locality: when every slice is verified before the next begins, a failure at Slice N implicates only Slice N. The source doc's rationalizations table names the failure mode of skipping this: "It's faster to do it all at once" feels faster until something breaks and you cannot find which of 500 changed lines caused it. A broken mainline multiplies this cost across everyone integrating during the broken window.

## What "compilable" covers

The source doc's increment checklist enumerates the verification set that Rule 2 requires after each increment, run with the repository's own commands:

1. All existing tests still pass (the repository's test command: `npm test`, `./gradlew test`, `pytest`, and so on).
2. The build succeeds (the repository's build command).
3. Type checking passes, where the stack has one (`npx tsc --noEmit`, `mypy`, and similar).
4. Linting passes (the repository's lint command).

Each verification is scoped to the repository's own tooling rather than a generic script, which is what makes the rule cheap to follow: the commands already exist, the discipline is only to run them at the right moments. The doc's anti-waste note applies here too: run each command after a change that could affect it, and do not repeat a successful run on unchanged code.

## Sizing the increments

Rule 1 and Rule 2 together set the increment size. The source doc's red flags define the upper bound: more than 100 lines of code written without running tests, multiple unrelated changes in a single increment, and large uncommitted changes accumulating are all red flags. The lower bound is the rationalization the doc rejects: "These changes are too small to commit separately" is answered with "Small commits are free. Large commits hide bugs and make rollbacks painful."

A practical reading: if an increment cannot pass the checklist, it is too large or mixes concerns, and the fix is to split it into smaller slices, each of which can.
