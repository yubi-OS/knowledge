# Branch hygiene

Scope: the branch discipline stacks inherit from `git-workflow-and-versioning`, why stacking does not relax it, and who merges.

Grounding spine: source doc `yubi-OS/yubiOS skills/github-stacked-pull-requests/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/github-stacked-pull-requests/SKILL.md). This is an internal-record subtopic: the grounding comes from the source doc, no dig was run.

## The inherited rules

Source doc: stacks inherit every rule from `git-workflow-and-versioning`, and it names four as they apply to stacks:

1. Atomic commits per layer. One logical change per commit; do not mix refactoring with feature work inside a layer. Inside a stack this rule gets sharper, not looser: a layer is already scoped to one concern, so a commit inside it that smuggles in a second concern breaks the layer contract the whole stack is built on. A reviewer who approves a layer titled "Containerfile base image bump" should not find a workflow edit inside it.
2. No long-lived stack branches. Land the stack or rebase it. Source doc: a stack that sits for a week has the same merge-conflict accumulation as a regular long-lived branch. Stacking changes the review shape, not the conflict math; each additional day the stack is open, every layer's diff against a moving base gets further from what its PR description says.
3. Each layer still must pass CI individually. Required checks per PR still fire on the full diff against the layer's base; an old layer that was green when it landed is not enough. This is the rule that makes the merge queue integration safe: the queue admits a layer because that layer's own checks pass against its own base, not because the bottom of the stack was green last Tuesday.
4. Jenny merges. Per the yubiOS doctrine quoted in the source doc: never merge to main, no force-push, no release tags; merging is Jenny's call. The agent opens the stack and watches CI; Jenny merges. Source doc: stacks do not change who merges, they just sequence multiple merges cleanly.

## Why stacking cannot buy back hygiene

The mechanics that make stacks attractive are the same ones that punish stale stacks. Auto rebase and retarget (03-mechanics.md) keep the graph coherent after a partial merge, but rebase is not review: a layer that rebases over a new base needs its checks re-run and, where the base moved materially, its review re-confirmed. The hygiene rules exist so that the rebased layer is a small, legible unit again rather than a diff that silently absorbed its base's changes.

The one-click merge amplifies this. If each layer is atomic and its diff matches its description, the one-click landing is exactly the sum of reviewed units. If a layer accumulated stray commits, the atomic landing ships the strays with the same confidence as the reviewed work. The stack inherits trust from hygiene; it does not generate it.

## The merge authority

The yubiOS merge doctrine in the source doc is specific: the agent's role is to open the stack and watch CI; the merge to `main` is Jenny's call. A stack does not create an exception: the merge-queue admission of a stack is still a merge decision, still Jenny's, and still bound by no force-push and no release tags. What changes with stacks is the granularity of the decision: Jenny merges one ordered chain instead of several independent PRs, and the stack map gives her the state of every layer at the moment of decision.

## Practical reads

For the failure shapes that hygiene violations produce in stacks, see 07-anti-patterns.md (broken bottom layer, scope-slipped layers) and 08-red-flags.md (stale top PRs, diffs that no longer match their descriptions). For the checklists that operationalize this doc, see 09-verification.md.
