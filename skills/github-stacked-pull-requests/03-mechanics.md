# Mechanics: topology, merge semantics, protections, merge queue

Scope: the branch topology of a stack, the stack map UI, merge semantics for full and partial landing, how branch protections apply per layer, and merge queue integration.

Grounding spine: source doc `yubi-OS/yubiOS skills/github-stacked-pull-requests/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/github-stacked-pull-requests/SKILL.md). Claims marked "source doc" come from that file.

## Branch topology

Source doc: each layer is its own branch. PR #1's branch is forked off `main`. PR #2's branch is forked off PR #1's branch. PR #1's `base` is `main`; PR #2's `base` is PR #1's branch. Only PR #1 has `main` as its target.

This is the invariant that makes everything else work: the base pointer encodes the dependency. GitHub derives the stack order from the base pointers, so the topology is not maintained by naming convention or by a manifest; it is the PR graph itself. The red-flags doc (08-red-flags.md) covers the failure where the wiring is wrong, for example a stack where no layer targets `main` directly because PR #1 was accidentally pointed at PR #2.

## The stack map

Source doc: when you open any PR in the stack, github.com shows a small diagram at the top of the conversation tab: where this layer sits, what is above it, what is below it, and the merge status of each sibling. Reviewers do not have to guess context. The map is derived state: it follows from the base pointers, so it cannot drift from the actual topology.

## Merge semantics

Two landing modes, both from the source doc:

1. Full stack: when you click Merge on the topmost ready PR, GitHub merges that PR and every unmerged PR below it in one operation. The merge is atomic from the operator's point of view: one click lands the whole chain in order.
2. Partial stack: to land part of a stack, merge one or more lower layers. The PRs above automatically rebase and retarget to the new tip. This is what keeps a partially landed stack usable: the remaining layers become a smaller stack rooted at the new base instead of dangling off a merged branch.

## Branch protections still apply

Source doc: required reviews, required checks, and required statuses are evaluated per-PR. The stack does not bypass `main`'s protection rules; it just sequences the merges.

The GitHub Docs page "About stacked pull requests" (https://docs.github.com/en/pull-requests/get-started/about-stacked-prs, weight 0.97) confirms and sharpens this: the merge requirements for any pull request in the stack are determined by the bottom pull request's base branch, typically `main`, and branch protection rules such as CODEOWNER approvals are enforced on every pull request in the stack. Practically: a mid-stack PR is not evaluated against its parent layer's protections but against the protections that would apply at `main`, so an inner layer cannot ship with weaker checks than the bottom layer would face.

## Merge queue

Source doc: stacks land straight into the merge queue the same way single PRs do. Each layer goes through the queue independently and gets merged when its turn comes. The "merge everything in one click" still works: clicking merge on the top PR enqueues the whole stack atomically.

The public preview changelog (https://github.blog/changelog/2026-07-30-stacked-pull-requests-are-now-in-public-preview/, weight 0.81) frames merge queue support as the piece that rolled out progressively over the weeks after 2026-07-30, separate from the core stacked-PR rollout. The GA changelog (https://github.blog/changelog/2026-10-06-stacked-pull-requests-generally-available/, weight 0.75) closes that gap: with general availability as of 2026-10-06, the feature set described by the source doc, including queue integration, is the shipped behavior.

## Consequences for CI

Because required checks fire per layer on the full diff against that layer's base (source doc, branch hygiene section), each layer is a real CI unit, not a shadow of the final diff. A layer that was green when it landed is not enough for the layers above: they carry their own checks against their own bases. This is why the source doc's verification checklist includes `gh stack status` before merging, and why a red bottom layer blocks the whole stack (see 07-anti-patterns.md).
