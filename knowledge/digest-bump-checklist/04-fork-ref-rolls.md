# 04 - Internal fork refs: release commits, pinned source commits, and the extension check

Scope: rolling a maintained fork (TF-A, bcvk, edk2, mkosi and peers): the fetch workflow's automatic roll semantics, when a bump is not automatic, and re-verifying project-specific extensions by hand.

## Two commits per fork

A maintained fork is pinned by two distinct values: the upstream release or reference commit, and the pinned source commit the project actually builds from. When the fork is a clean follow of upstream, these are equal. When the fork carries project-specific patches, the pinned source commit extends the release commit, and the pair must be updated deliberately rather than mechanically (yubiOS refs: digest-bump-checklist-2026-07-25.md).

This is the general shape of long-term fork maintenance. Working with long-term forks in git is painful precisely because the fork accumulates its own commits on top of an upstream base, and naive sync strategies either discard those commits or merge upstream history into the fork in ways that make future rebases harder (https://amboar.github.io/notes/2021/09/16/history-preserving-fork-maintenance-with-git.html, jev weight 0.43). The two-column pin is the bookkeeping answer: it makes the divergence explicit and reviewable on every bump.

## What the fetch workflow automates

The yubiOS workflow `fetch-released-tag-ref.yml` resolves the newest stable upstream tag in each configured release family, peels annotated tags, and proves that both the release commit and the approved source commit can be fetched from the fork with complete trees (yubiOS refs: digest-bump-checklist-2026-07-25.md). The proof step matters: a tag that resolves in the registry but cannot be fetched with a full tree is a broken pin, and discovering that at build time is worse than discovering it in the fetch workflow.

The automation rule is conditional: "When those commits are equal, the workflow rolls every textual use automatically." In the equal case, a bump is mechanical: the new release commit replaces the old one everywhere it appears textually, and the fetch workflow does it. The checklist's job in that case is to confirm the equality actually holds after the refresh, not to assume it (yubiOS refs: digest-bump-checklist-2026-07-25.md).

## When the roll is not automatic

When the two commits differ, the automatic roll does not apply. In the yubiOS tree at the time the checklist was written, three forks were in this state, each with a pinned source commit ahead of its release commit: bcvk, optee_ftpm, and mkosi. For these, the release commit moves and the pinned source commit must be moved manually, after re-verifying that the fork's extension still applies cleanly on top of the new upstream release (yubiOS refs: digest-bump-checklist-2026-07-25.md).

The project's own rationale for this gate is worth quoting: the design "prevents a refresh from silently removing bcvk device support, the mkosi profile, or OP-TEE volatile test storage." The hazard is precisely that a naive automation would rebase onto the new release, hit a conflict, and either drop the extension or resolve it wrong without anyone noticing. Manual re-verification is the one step the fetch workflow cannot do (yubiOS refs: digest-bump-checklist-2026-07-25.md).

## The rebase discipline underneath

The manual step is a rebase of the extension onto the new release tip. Git's rebase machinery provides the primitives and their semantics. `git rebase --onto <newbase> <upstream> <branch>` replays commits onto a different base, and the documented behavior for already-applied changes is that "if the upstream branch already contains a change you have made (for example, because you mailed a patch which was applied upstream), then that commit will be skipped" (https://git-scm.com/docs/git-rebase, jev weight 0.95; the 2.9.5-era documentation states the same skip rule: https://git-scm.com/docs/git-rebase/2.9.5, jev weight 0.92). That skip rule is a convenience for upstreamed patches and a hazard for fork extensions: an extension commit that upstream has since absorbed an equivalent of will be skipped rather than flagged, so the re-verification must diff the result, not trust the rebase exit code. The Ubuntu manpage documents the same semantics (https://manpages.ubuntu.com/manpages/focal/man1/git-rebase.1.html, jev weight 0.81).

Kernel-fork practice makes the same point operationally: maintainers of close-to-mainline kernel forks rebase their patch sets on every release and treat "does the patch set still apply and build" as the per-release checkpoint, preferring patches sent upstream so the set shrinks over time (https://wiki.postmarketos.org/wiki/Rebase_a_close-to-mainline_kernel, jev weight 0.70). The yubiOS equivalent is: after rebasing the extension onto the new release, confirm the extension's purpose is still served and that no part of it was silently skipped as already-upstream.

## The checklist items, in order

1. Run the fetch workflow and read its proof output: newest stable tag resolved, annotated tag peeled, both commits fetchable with complete trees.
2. Compare release commit and pinned source commit for the fork being bumped.
3. If equal: confirm the automatic roll covered every textual use, update the Internal yubi-OS Fork Refs table's two columns, done.
4. If different: rebase the extension onto the new release commit, verify the extension applies and functions (device support, profile, storage behavior), then update both columns deliberately.
5. Open a PR under the same policy as every other bump.

## One special case: EDK2

The yubiOS tree bounds EDK2 to `edk2-stable202602`, the newest stable release that still provides the StandaloneMM `ArmBaseLib` consumed by the paired pre-removal `edk2-platforms` snapshot (yubiOS refs: digest-bump-checklist-2026-07-25.md). A newer EDK2 release that drops that API breaks the pairing, because the platform snapshot is pinned separately and its compatibility window is defined by the API. The lesson generalizes: when a fork pin exists because of a paired dependency, the bump check is not "is there a newer release" but "does the newer release still satisfy the constraint that justified the current pin."
