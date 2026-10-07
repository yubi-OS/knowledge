# 06 Worktrees and Save Points

Scope: git worktrees for parallel agent work, the save point pattern for bounded recovery, and using git itself for debugging (bisect, blame, log, diff).

## Worktrees for parallel agents

The ground source (yubi-OS/yubiOS skills/git-workflow-and-versioning/SKILL.md) prescribes `git worktree add` for running multiple branches simultaneously when parallel AI agents are at work. Its example creates `../project-feature-a` on `feature/task-creation` and `../project-feature-b` on `feature/user-settings`, so each directory is a separate checkout with its own branch, then removes the worktree with `git worktree remove` when done. Four stated benefits:

- Multiple agents can work on different features simultaneously.
- No branch switching needed; each directory has its own branch.
- If one experiment fails, delete the worktree and nothing is lost.
- Changes are isolated until explicitly merged.

Git's own documentation and guides are the canonical backing for the mechanism: worktrees let one repository have multiple working directories, each checked out to a different branch (https://git-scm.com/, weight 0.95; https://github.com/git-guides, weight 0.77 and 0.65 across dig hits). Practitioner walkthroughs confirm the motivation: work on multiple branches simultaneously without stashing or constant checkouts, with parallel directories juggling features, hotfixes, and testing (https://barrd.dev/article/parallel-development-without-the-headaches-using-git-worktree/, weight 0.17, weak backing; https://geekworkbench.com/blog/technical/git-worktree-parallel-work/, weight 0.14, weak backing; https://dev.to/medamine_/git-worktrees-for-parallel-development-simplified-with-worktreewise-38bb, weight 0.11, weak backing; https://codesamplez.com/productivity/git-worktree, weight 0.14, weak backing).

For the multi-agent context the skill targets, the isolation property is the point: two agents editing simultaneously in one checkout would race on the index and the working tree; worktrees give each agent a private working tree over the same object database, with merge as the explicit synchronization point.

## The save point pattern

The skill's save point diagram is the operational loop for a single agent:

- Make a change. If the test passes: commit, continue.
- If the test fails: revert to the last commit, investigate.
- Repeat until the feature is complete, leaving a clean commit history.

The guarantee stated in the source doc: "you never lose more than one increment of work. If an agent goes off the rails, `git reset --hard HEAD` takes you back to the last successful state." This pairs with the atomic-commit discipline (doc 02): the loop is only as safe as the last commit is small and self-contained.

## Git for debugging

The skill's debugging toolbox, with the canonical source for each:

- `git bisect`: binary search for the commit that introduced a bug. Mark a bad commit and a known-good commit; git checks out midpoints and you test each to narrow down (source doc). The git-bisect documentation states the binary search algorithm and usage directly (https://git-scm.com/docs/git-bisect, weight 0.97). Bisect works well on atomic histories: each midpoint being a one-logical-thing commit gives a clean good/bad signal.
- `git log --oneline -20` and `git diff HEAD~5..HEAD -- src/`: view what changed recently (source doc).
- `git blame <file>`: find who last changed a specific line (source doc).
- `git log --grep="keyword" --oneline`: search commit messages, which only pays off under the message conventions of doc 03 (source doc).

Community how-tos on finding the introducing commit match the git-bisect documentation's framing (https://github.com/oppia/oppia/wiki/How-to-find-the-commit-which-introduced-a-bug, weight 0.24, weak backing; https://www.dev-toolbox.tech/tools/git-cheat-sheet/examples/git-bisect-debugging, weight 0.11, weak backing).

## Agent checklist for this doc

1. Parallel agents get worktrees, not shared checkouts (source doc).
2. Every increment ends in either a commit or a revert; no third state (source doc).
3. Recovery tool of first resort is `git reset --hard HEAD` to the last good commit (source doc).
4. Bug hunts start with bisect over the typed, atomic history (source doc; https://git-scm.com/docs/git-bisect, weight 0.97).
