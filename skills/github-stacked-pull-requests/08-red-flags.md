# Red flags

Scope: the six observable signals, from the source doc, that a stack is drifting from healthy: what each one looks like and what it indicates.

Grounding spine: source doc `yubi-OS/yubiOS skills/github-stacked-pull-requests/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/github-stacked-pull-requests/SKILL.md). This is an internal-record subtopic: the grounding comes from the source doc, no dig was run.

Red flags are the diagnostic layer: anti-patterns (07-anti-patterns.md) are practices to avoid, red flags are states to catch early. Every red flag below is quoted from the source doc and then unpacked.

## 1. Stack branch names that do not reflect the layer

`fix`, `tmp`, `wip`. The source doc's verification checklist requires branch names that describe the concern (`pr-1-fix-foo`, not `stack`). The cost of a non-descriptive name is paid at review time: the stack map shows the shape of the chain, but the names are what reviewers use to navigate it, and `wip` above `wip` above `wip` turns the map into noise. It also blocks the red-flag checks below, because diff-vs-name comparisons need names that say something.

## 2. A layer whose diff is bigger than the layer above it

Source doc: scope slipped. In a healthy stack, size decreases as you go up: the bottom layer carries the foundational change and each upper layer adds a bounded increment. An upper layer bigger than the one below it means the layer boundary was drawn in the wrong place, or that late work was dumped into a convenient existing layer instead of being scoped. Both are the scope-drift the hygiene rules warn about, detectable early from the diffs alone.

## 3. No layer targets `main` directly

Source doc: someone made PR #1 target PR #2 by accident. This is a wiring error, and it inverts the stack: the base pointers no longer encode a bottom-up dependency, so the merge semantics (merge the top and everything below lands) no longer mean what the operator thinks they mean. Because the stack map is derived from base pointers, a mis-wired stack renders a coherent-looking map for a structure that is not the intended one. The check is cheap: exactly one PR, the bottom one, has `main` as its base.

## 4. The top PR has been open for weeks

Source doc: rebase or close it. This is the no-long-lived-branches hygiene rule surfacing as a per-PR signal. A top layer that lives for weeks accumulates the same conflict debt as any long-lived branch, and because it is the top, everything below it is frozen behind it too. The remedy is binary: rebase and refresh the stack, or close the top layer and land the rest.

## 5. PR descriptions that do not reference the stack map or the layer below

Source doc: reviewers cannot find the context. The stack map gives the position, and the PR description is what gives the reviewer the entry point into the chain: which layer this is, what the layer below delivered, and why this layer exists on top of it. A description written as if the PR were standalone forces every reviewer to reconstruct the chain by hand, which is the exact cost the feature exists to remove.

## 6. Required checks passing on every layer but `main` is red

Source doc: the stack landed against a stale base; sync before merging. This is the most dangerous flag because every local signal is green. It means the layers' checks ran against a base that has since moved (a sibling PR merged to `main`, a `yubios` rebase in the cross-fork case, see 05-yubios-mapping.md), and the stack's diffs no longer represent what merging them would actually produce. The corrective action is in the source doc's own words: sync before merging, then let the per-layer checks re-run against the fresh base.

## Using the flags together

The six flags cover the three axes a stack can drift on: naming and wiring (flags 1 and 3), scope and size (flag 2), and time and base drift (flags 4 through 6). All six are checkable without opening a single file diff, which is what makes them practical as a pre-review or pre-merge scan: `gh stack status` for shape and state, branch names and bases for wiring, diff sizes for scope, PR ages for staleness, and `main`'s own CI for base drift.
