# When to use stacked PRs

Scope: the decision criteria for picking stacked pull requests, the explicit counter-cases where a single PR wins, and the broader stacked-diffs practice the feature formalizes.

Grounding spine: source doc `yubi-OS/yubiOS skills/github-stacked-pull-requests/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/github-stacked-pull-requests/SKILL.md). Claims marked "source doc" come from that file.

## The five use criteria

Source doc lists five conditions, any one of which justifies a stack:

1. The change naturally splits into 3 to 8 reviewable layers, one logical concern per layer. Layer count is the primary signal: if you cannot name the concern of each layer in one sentence, the stack is not the shape of the problem yet.
2. A single-PR diff would push past about 1000 lines or span multiple components. The size threshold is a review-bandwidth threshold, not a hard limit; a 1200-line diff in one file is a different problem than a 1200-line diff across a Containerfile, a sysroot overlay, and a workflow.
3. Different reviewers need to sign off on different layers in parallel. The stack makes review parallelizable: each reviewer gets a small diff scoped to their concern, and approvals accumulate per layer rather than serially on one giant diff.
4. The base branch is itself still in flight. This is the case a plain feature branch cannot express: if PR #1 depends on a feature branch whose own PR is unmerged, stacking puts the dependency in the graph instead of in a comment.
5. The change would force reviewers to context-switch across files that belong to different concerns. The layer boundary is a context boundary, and keeping each reviewer inside one context is the point.

## The five counter-cases

Source doc is equally explicit about when NOT to stack:

1. A one-file fix or small refactor: a single PR is faster to review and merge. The stack's coordination cost is only worth paying above the layer-count threshold.
2. A hotfix to `main`: there is no time to coordinate a stack, and the review bottleneck the stack solves does not apply to an urgent fix.
3. Layers that cannot be cleanly separated, for example a single function signature change that touches every layer. If every layer depends on a change that itself cannot be isolated, there is no stack to draw.
4. Branch protection rules that require a linear history. Source doc notes stacks ARE linear (each layer is one branch off the previous) but instructs you to check the org's `require_linear_history` setting before relying on it, because dependent branches can still be rejected by that rule.
5. A CI fix that only needs to land in one place. There is no layering win and the queue adds latency.

## The numbers behind the criteria

The thresholds are consistent across the source doc: 3 to 8 layers as the healthy range, about 100 lines per layer as the target diff size, about 1000 lines as the single-PR ceiling. The source doc's anti-patterns section sets the upper bound explicitly: a 12-layer stack makes reviewers lose the plot, and if a change needs more than about 8 layers, the change itself needs to be split because there is a real feature boundary that has not been drawn yet.

## Stacked diffs as a practice

The native feature formalizes a practice that predates it. The Pragmatic Engineer's "Stacked Diffs" piece (https://newsletter.pragmaticengineer.com/p/stacked-diffs, weight 0.32, weak backing, labeled as such) describes the core idea: you keep working on your main branch, make a small change, stack the next change on top of it, and worry about reviews later rather than blocking work on review latency. Treat this as background context on why the workflow exists, not as GitHub product documentation.

A practical guide to the GitHub-native workflow (https://betterstack.com/community/guides/linux/github-stacked/, weight 0.21, weak backing, labeled as such) frames the same steps the source doc and the CLI docs describe: understand what stacked PRs are, install the `gh stack` extension, build a stack with the GitHub CLI, then review and merge stacks on GitHub. Both weak sources are consistent with the source doc; neither contradicts it.

## The routing rule

Source doc: every use stays inside the frontmatter description's scope, and anything beyond it is a different skill's job. Concretely: unclear scope routes to `spec-driven-development` before any PR is opened, commit discipline inside each layer routes to `git-workflow-and-versioning`, and the mechanical write path (branch creation, rebase commits, PINNED.md updates) routes to `github-api`.
