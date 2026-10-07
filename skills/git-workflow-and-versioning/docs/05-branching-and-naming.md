# 05 Branching and Naming

Scope: one feature per branch, branching from main, short-lived branches deleted after merge, and the skill's branch naming convention.

## The branching model

The ground source (yubi-OS/yubiOS skills/git-workflow-and-versioning/SKILL.md) shows a `main` (always deployable) with three short-lived children: `feature/task-creation`, `feature/user-settings`, and `fix/duplicate-tasks`. Its four rules:

- Branch from `main` (or the team's default branch).
- Keep branches short-lived: merge within 1 to 3 days; long-lived branches are hidden costs.
- Delete branches after merge.
- Prefer feature flags over long-lived branches for incomplete features.

The one-feature-per-branch discipline is what makes the delete-after-merge rule safe. A practitioner answer on branch deletion argues single-use, short-lived branches simplify the process by ensuring you only ever merge the branch back once (https://stackoverflow.com/questions/29316225/why-should-i-delete-feature-branches-when-merged-to-master, weight 0.10, weak backing). The trunk-based-development site describes short-lived feature branches where each PR gets its own branch, deleted after merge or integration, sometimes several per story (https://trunkbaseddevelopment.com/short-lived-feature-branches/, weight 0.35, weak backing). Another thread describes the common deletion timing, after merge, sometimes with `--no-ff` to keep the branch shape visible in the graph (https://stackoverflow.com/questions/3392392/when-is-the-right-time-to-delete-a-git-feature-branch, weight 0.11, weak backing). A beginner-oriented explainer sums up the lifecycle: merged, then deleted if short-lived (https://codemia.io/knowledge-hub/path/what_to_do_with_branch_after_merge, weight 0.12, weak backing).

Git itself is the authority underneath these conventions: git is a distributed version control system designed to handle everything from small to very large projects (https://git-scm.com/, weight 0.94 to 0.95 across dig hits; https://github.com/git-guides, weight 0.73 to 0.77). Branches in git are cheap pointers; the conventions exist to keep their usage disciplined, not because the mechanism is expensive.

## Naming convention

The skill's naming table:

```
feature/<short-description>  -> feature/task-creation
fix/<short-description>      -> fix/duplicate-tasks
chore/<short-description>    -> chore/update-deps
refactor/<short-description> -> refactor/auth-module
```

The pattern: a type prefix mirroring the commit types in doc 03, a slash, then a lowercase-hyphenated short description. Community conventions match this shape. Conventional Branch formalizes the same prefixes, feature/, bugfix/, hotfix/, release/, and chore/, with a grammar and a regex for enforcement on GitHub, GitLab, and Bitbucket (https://conventionalbranch.org/, weight 0.16, weak backing). General guides recommend the same prefix families plus ticket IDs and descriptive slugs (https://www.toolsmint.com/learn/git-branch-naming-conventions, weight 0.15, weak backing; https://www.geeksforgeeks.org/git/how-to-naming-conventions-for-git-branches/, weight 0.15, weak backing).

## Why naming discipline matters for agents

For agent-driven work the branch name is often the first thing a reviewer or the next agent session sees. A name like `feature/task-creation` pairs with the typed commit history on it (`feat: ...`) and with the change summary in the PR description (doc 08), so all three artifacts say the same thing about scope. The skill's red flag list warns against long-lived branches that diverge significantly from main (source doc); a named, typed branch plus the 1 to 3 day window is the concrete defense.

Practical rules for agents:

1. One feature or fix per branch, created from `main` (source doc).
2. Name it `<type>/<short-description>` matching the dominant commit type on the branch (source doc; corroborated at weights 0.15 to 0.16).
3. Merge within 1 to 3 days and delete the branch; if the work cannot land that fast, move it behind a feature flag rather than extending the branch (source doc).
4. Never force-push shared branches; the skill lists force-pushing to shared branches as a red flag (source doc).
