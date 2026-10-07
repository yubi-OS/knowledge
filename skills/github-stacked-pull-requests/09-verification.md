# Verification checklists

Scope: the three verification checklists the source doc specifies, before opening a stack, before merging, and after merging, with the reasoning behind each item.

Grounding spine: source doc `yubi-OS/yubiOS skills/github-stacked-pull-requests/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/github-stacked-pull-requests/SKILL.md). This is an internal-record subtopic: the grounding comes from the source doc, no dig was run.

## Before opening a stack

The source doc lists four checks:

1. Each layer has one logical concern, about 100 to 300 lines. This is the sizing contract from the when-to-use criteria (02-when-to-use.md) applied per layer rather than to the whole change. The upper bound here (300) is tighter than the general 1000-line single-PR ceiling because each layer must be a review unit, not just a smaller diff.
2. PR #1's base is `main`; every other PR's base is the layer below it. This is the topology invariant from the mechanics (03-mechanics.md). Checking it before opening catches the mis-wiring red flag (08-red-flags.md, flag 3) at the cheapest possible moment, before any reviewer time is spent.
3. Each layer's branch name describes the concern, `pr-1-fix-foo`, not `stack`. The naming rule from the hygiene rules (06-branch-hygiene.md). Branch names are the review navigation surface for the whole chain.
4. PR descriptions link the layer above and below. The context-linking requirement, the positive form of red flag 5. Descriptions that link both neighbors let a reviewer enter the stack at any layer and walk in either direction.

All four are structural checks: none requires reading code. That is deliberate. They verify that the stack is a stack before any content review starts.

## Before merging

The source doc lists four checks:

1. The bottom layer is green on CI, or all layers above are stack-merging with the bottom layer's fix queued. The first clause is the baseline; the second acknowledges the real-world case where the bottom failed after the upper layers were already in flight, and the fix is queued. Either way the gate is: the base the stack will land on must be sound.
2. All required reviews per layer satisfied. Branch protections are evaluated per PR (03-mechanics.md), so this is not one approval for the stack; it is the union of every layer's required reviews. Missing one is a merge-time surprise the queue will surface as a rejection.
3. Each layer's diff against its base is what the PR description says. This is the anti-drift check: it catches scope slip (red flag 2) and stale descriptions after rebase (red flag 4). It is also the check that makes the one-click merge honest, because the merge ships exactly the reviewed diffs.
4. `gh stack status` shows the stack shape you expect. The CLI command (04-gh-stack-cli.md) is the machine check of everything the human checks above asserted: layer count, order, and per-layer state as GitHub sees them, not as the author remembers them.

## After merging

The source doc lists three checks:

1. `git log --oneline` on `main` shows the layers landing in order. The confirmation that the atomic landing produced the intended linear history, the final proof that the topology and the merge semantics did what the map promised.
2. Any synced branches (PINNED.md, mirror branches) are re-pinned in the same commit window per `git-workflow-and-versioning`'s commit hygiene. This is the yubiOS-specific item (05-yubios-mapping.md): after a cross-fork stack lands, the fork tip moved, so the `yubios` ref and the primary repo's pin must be updated in the same bounded window, via the `github-api` Git Data API write path, or the next build silently builds a different tree than the PRs that were just reviewed.
3. The closed PRs in the stack link to a follow-up issue if the work continues. The lifecycle handoff: a partial or fully landed stack that leaves work undone must not let that work live only in the closed PR chain, which reviewers will not revisit.

## How the checklists compose

The three lists cover the stack lifecycle in order, and each one is cheaper than discovering its omission later: structural checks before opening cost minutes, content and CI checks before merging cost one review cycle, and the post-merge checks cost a commit window. The source doc's red flags (08-red-flags.md) are what the checklists look like when skipped: every flag there is the observable residue of a missed checklist item.
