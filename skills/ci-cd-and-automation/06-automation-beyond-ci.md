# 06 - Automation Beyond CI

## Scope

The automation that surrounds the pipeline itself: dependency update bots, the build cop role that keeps main green, and the branch protection settings that turn CI results into merge enforcement.

## Dependabot and Renovate (source doc)

The source doc prescribes a `.github/dependabot.yml` with version 2, npm package ecosystem, root directory, a weekly schedule, and an open-pull-requests limit of 5 (source doc). The limit is the operative detail: without it, a backlog of update PRs trains the team to ignore dependency churn. The weekly interval keeps the queue small enough that each update gets a real review.

The dig on this subtopic returned only weak-backed comparisons of Dependabot versus Renovate: configuration-grouping and automerge strategy comparisons at weights 0.11 to 0.22 (for example https://rafter.so/blog/renovate-vs-dependabot at 0.18, https://safeguard.sh/resources/blog/dependency-update-automation-strategies at 0.19, both weak). The recurring theme in that material, which is consistent with the source doc's configuration, is that grouping, scheduling, and automerge controls exist to keep security-relevant updates visible rather than buried. Treat the vendor comparisons as orientation only.

## Build cop role (source doc)

The source doc assigns the build cop responsibility explicitly: designate someone responsible for keeping CI green. "When the build breaks, the Build Cop's job is to fix or revert. Not the person whose change caused the break" (source doc). The rationale is distribution of failure: without a designated owner, "broken builds accumulate while everyone assumes someone else will fix it" (source doc). This is a human-process automation; it exists because the machine cannot assign blame-repair, and deferring repair to the breaking author serializes all work behind one person.

## PR checks and branch protection (source doc)

The source doc lists four repository settings:

1. Required reviews: at least 1 approval before merge.
2. Required status checks: CI must pass before merge.
3. Branch protection: no force-pushes to main.
4. Auto-merge: if all checks pass and approved, merge automatically (source doc).

GitHub's official documentation confirms the enforcement surface: a branch protection rule can enforce workflows such as requiring an approving review or passing status checks for all pull requests merged into the protected branch (https://docs.github.com/articles/enabling-required-status-checks, weight 0.94). Protection rules also define whether collaborators can delete or force-push to the branch and can set requirements for pushes such as passing status checks or a linear commit history (https://docs.github.com/articles/about-required-status-checks, weight 0.93). These two sources directly substantiate items 1 through 3; auto-merge (item 4) is a repository setting that combines the same signals automatically.

## Why enforcement matters

The pipeline (doc 01) only protects main if its results are binding. Required status checks convert a green run from information into a precondition; branch protection converts review approval from custom into a gate. The source doc's verification checklist requires exactly this wiring: "Failures block merge (branch protection configured)" (source doc). Without it, the no-gate-skipped rule degrades into social convention, and the red flag "CI failures ignored or silenced" becomes the default trajectory (source doc).

## Configuration summary

- Dependabot: version 2, npm, directory /, weekly, open-pull-requests-limit 5 (source doc).
- Build cop: rotation or standing assignment; fix or revert, never idle-accumulate (source doc).
- Branch protection: 1 approving review, required passing status checks, no force-push to main (source doc; https://docs.github.com/articles/enabling-required-status-checks, weight 0.94; https://docs.github.com/articles/about-required-status-checks, weight 0.93).
- Auto-merge: enabled once checks and approval are satisfied (source doc).

## Relation to the skill

This subtopic is the enforcement and maintenance layer around the CI pipeline. The pipeline (doc 01) defines what is checked; this doc defines what those checks are allowed to block and who repairs breakage. The source doc places all four settings in one section precisely because they fail together: an unenforced pipeline and an unowned broken build produce the same outcome, which is a main branch nobody can trust.
