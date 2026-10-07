# What stacked pull requests are

Scope: what stacked pull requests are, the shape of a stack, how review and landing work, and the feature timeline from the 2026-07-30 public preview to the 2026-10-06 general availability.

Grounding spine: source doc `yubi-OS/yubiOS skills/github-stacked-pull-requests/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/github-stacked-pull-requests/SKILL.md). Claims marked "source doc" come from that file.

## The definition

Source doc: stacked pull requests are an ordered series of pull requests where each PR targets the layer below it. The bottom layer targets `main`. Reviewers see only that layer's diff, so a reviewer of PR #2 never has to read the changes that belong to PR #1 to judge PR #2 on its own terms.

The stack shape, as the source doc draws it: PR #3 sits at the top of the stack, PR #2 targets PR #1's branch, and PR #1 (the bottom of the stack) targets `main`. Each layer is one branch forked off the branch of the layer below it, and only the bottom PR has `main` as its target.

Landing is the second half of the definition. Source doc: stacks land together in a single click, or one layer at a time. When a lower layer merges, anything above it auto-rebases and retargets to the new tip, so the remaining stack stays coherent without manual branch surgery.

## Why the shape exists

Source doc: the pattern exists to solve the "one giant PR" review bottleneck. The same logical change ships as 3 to 8 small, focused pull requests that each touch about 100 lines, are reviewed in parallel, and merge atomically. The unit of review becomes the layer, not the whole change, and the unit of landing stays the whole stack.

Two pieces of supporting surface come with the model. Source doc: a CLI extension makes the day-to-day mechanics bearable, and github.com shows the stack map at the top of every PR in the chain so the context of each layer is obvious to reviewers without asking.

## Timeline: public preview to general availability

The public preview announcement (https://github.blog/changelog/2026-07-30-stacked-pull-requests-are-now-in-public-preview/, weight 0.81) states that stacked pull requests began rolling out in public preview to all repositories over the days following 2026-07-30, and that merge queue support for stacked pull requests was rolling out progressively over the coming weeks. This matches the source doc, which describes the feature as "built into GitHub since 2026-07-30 public preview" with the CLI extension `gh extension install github/gh-stack`.

Drift correction (dated): the source doc describes the feature as in public preview. The follow-up changelog entry (https://github.blog/changelog/2026-10-06-stacked-pull-requests-generally-available/, weight 0.75) announces that GitHub stacked pull requests are now generally available as of 2026-10-06, described as smaller, focused pull requests that you can review independently and merge together. Read any statement about "public preview" status in the source doc as historical; the feature has since moved to GA.

## What the stack map changes

Source doc: the stack map is a small diagram shown at the top of the conversation tab of any PR in the stack. It answers four questions without leaving the page: where this layer sits, what is above it, what is below it, and the merge status of each sibling layer.

This is the part that makes the pattern usable rather than merely possible. Before the native feature, stacked-diff workflows existed for years as a discipline (see 02-when-to-use.md for the practice background), but the reader had to reconstruct the chain by hand from branch names. Source doc: reviewers "don't have to guess context" with the native map.

## What a stack is not

Source doc: a stack is not a replacement for review discipline. Every layer still needs its own reviewer and its own required checks, and the stack does not bypass `main`'s protection rules; it sequences the merges (see 03-mechanics.md). It is also not a way to avoid drawing a real feature boundary: if the layers do not each have one reviewable concern, the change is underspecified, which the source doc routes back to `spec-driven-development` before any PR is opened.

## Relation to the yubiOS corpus

This doc explicates the "What It Is" section of the source doc. The mechanics live in 03-mechanics.md, the CLI in 04-gh-stack-cli.md, and the yubiOS-specific fork topology in 05-yubios-mapping.md.
