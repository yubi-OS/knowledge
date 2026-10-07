# Anti-patterns

Scope: the five stacked-PR anti-patterns the source doc names, why each one fails, and what to do instead.

Grounding spine: source doc `yubi-OS/yubiOS skills/github-stacked-pull-requests/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/github-stacked-pull-requests/SKILL.md). This is an internal-record subtopic: the grounding comes from the source doc, no dig was run.

## 1. The 12-layer stack

Source doc: reviewers lose the plot. If the change needs more than about 8 layers, split the change, because there is a real feature boundary that has not been drawn yet.

The failure is cognitive, not mechanical. Nothing in the stack mechanics stops you from adding a ninth, tenth, or twelfth layer; the mechanics will keep the graph coherent. What degrades is the human system the stack exists to serve: reviewers tracking an inter-layer dependency map longer than a screen, a merge order that nobody can reason about at once, and a stack map that has become a project plan in disguise. The corrective is to stop stacking and go back to scope: the extra layers are evidence the change bundles two or more separable concerns, and each concern should be its own stack or its own single PR.

## 2. The broken bottom layer

Source doc: if PR #1 fails CI, the whole stack is stuck. Fix the bottom first, then sync the layers above.

This follows directly from the topology: every layer's branch is forked off the one below it, so the bottom layer's failure is inherited by every diff above it, both in the CI sense (the upper layers carry the broken code) and in the merge sense (nothing can land below a red base). The anti-pattern is not having a red bottom layer, which happens, it is working top-down when it happens: pushing fixes to upper layers while the base stays red produces commits that will be rewritten once the real fix lands below. The source doc's order is fix the bottom first, then sync the layers above so they rebase over the corrected base.

## 3. Forcing linear history through stacks

Source doc: stacks are linear, but they also create a chain of dependent PRs. If your org's `require_linear_history` rule rejects dependent branches, stacked PRs will not satisfy it. Fix the rule first, or use a different shape (a single PR with smaller commits).

The tempting reading is that a stack is linear and therefore satisfies a linear-history policy. The source doc rejects that inference: the policy concern behind `require_linear_history` is typically the merge-commit graph, and a chain of dependent branches is a different structure that the rule may still reject. Do not discover this at merge time; check the org setting before building the stack (the source doc makes the same check explicit in its when-not-to-use list).

## 4. A stack as a workaround for unclear scope

Source doc: if the layers do not each have one reviewable concern, the change is underspecified. Go back to `spec-driven-development` before opening PRs.

This is the anti-pattern that produces the other four. A stack cannot add structure to a change that does not have it; it can only make the missing structure visible as layers that overlap, or as one dominant layer that carries most of the diff while the others are cosmetic. When layering feels forced, the correct move per the source doc is upstream: resolve the scope with `spec-driven-development`, then let the layers fall out of the spec.

## 5. Skipping review on inner layers

Source doc: every layer still needs its own reviewer and its own required checks.

The rationalization is that inner layers are "already in the stack", meaning their content will be re-reviewed implicitly when the upper layers are judged. That reading is wrong twice: mechanics-wise, branch protections are evaluated per PR (03-mechanics.md), so an unreviewed inner layer is a merge blocker, not a formality; and content-wise, an inner layer's diff is the one reviewers of upper layers never see directly, because upper layers show only their own delta against the layer below.

## What the anti-patterns share

Each one is a way the stack's automation creates false comfort: the graph stays coherent, the map renders, the merge button waits, so the human decisions underneath, scope, review, green CI, feel taken care of. They are not. The stack sequences human work; it does not do it.
