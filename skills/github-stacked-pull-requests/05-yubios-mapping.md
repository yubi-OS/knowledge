# How stacked PRs map to yubiOS

Scope: where stacked pull requests fit in the yubiOS multi-component build: the primary repo and fork set, the `yubios` branch and PINNED.md pinning, the cross-fork stacking pattern, and the Git Data API write path.

Grounding spine: source doc `yubi-OS/yubiOS skills/github-stacked-pull-requests/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/github-stacked-pull-requests/SKILL.md). This is an internal-record subtopic: the grounding comes from the source doc, no dig was run.

## The multi-component shape

Source doc: yubiOS has a multi-component build consisting of a primary repo (`yubi-OS/yubiOS`) plus fork repos that ship as `yubios` branches pinned in `PINNED.md`. The fork set named in the source doc: bcvk, TFA (ARM Trusted Firmware), OP-TEE, optee_ftpm, ms-tpm-20-ref, edk2, edk2-platforms, U-Boot, and mkosi. Each fork carries a `yubios` branch, and the primary repo's `PINNED.md` records which fork tip the OS image is built against.

A change that crosses that boundary is the natural stacked-PR case, because the dependency between the fork change and the consuming change in the primary repo is exactly the layer relationship a stack encodes.

## Three fit scenarios

Source doc lists three:

1. A change touches a fork AND the primary repo. PR #1 lives in the fork, PR #2 lives in `yubi-OS/yubiOS` and consumes the new fork tip. The second PR's base is the fork PR's branch on its `yubios` branch mirror. The stack makes the cross-repo dependency visible and ordered instead of implicit.
2. A single yubiOS feature ships as three coordinated pieces: a Containerfile change, a sysroot overlay, and a workflow tweak. Three PRs, one merge. Each piece is reviewable by the specialist it concerns, and the atomic landing prevents a half-configured image state on `main`.
3. A multi-day initiative with natural phases: ADR, then Containerfile, then test, then workflow, then docs. Each phase is independently reviewable, and the stack sequences them without gating the whole initiative on one review.

## The pinned fork hazard and the pattern

Source doc: pinned fork topology means stacking across fork boundaries needs care, because the `yubios` branch on each fork is itself a moving target. The documented pattern:

1. PR #1 on the fork lands first.
2. The fork's `yubios` branch rebases on the new tip.
3. PR #2 on `yubi-OS/yubiOS` then stacks on the rebased `yubios` ref.

The order matters: stacking PR #2 against a fork tip that later rebases would leave the primary repo's PR pointing at a moving ref. Landing the fork PR first, rebasing `yubios`, then stacking the consumer PR pins the base to a state that will not move under you.

## The write path after landing

Source doc: the `github-api` skill's Git Data API pattern is the canonical write path for the post-merge rebase and the `PINNED.md` update. Concretely, once the fork PR lands, the follow-up commit that bumps the fork pin in `PINNED.md` and rebases the mirror ref goes through the Git Data API flow (blob, tree, commit, ref update) rather than an ad hoc local push. The branch hygiene rules of `git-workflow-and-versioning` still govern those commits (see 06-branch-hygiene.md).

## Relationship to the rest of the corpus

This doc is the yubiOS-specific layer on top of the generic mechanics (03-mechanics.md). The cross-repo case inherits every generic rule, per-PR protections, per-layer CI, one-click landing, and adds only the pinned-ref discipline described above. The verification checklist (09-verification.md) carries the corresponding post-merge item: any synced branches such as `PINNED.md` and mirror branches must be re-pinned in the same commit window per `git-workflow-and-versioning`'s commit hygiene.
