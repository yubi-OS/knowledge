# 08 - Audit trail and superseded digests: what to keep when a pin moves

Scope: preserving superseded digests in kept-for-audit blocks, single-source-of-truth hygiene, and the duplicate-table hazard that turns a digest file stale.

## The move that destroys information

When a pinned digest is replaced, the tempting edit is an overwrite: same row, new value. The yubiOS checklist forbids this for any table that maintains a "kept for audit only" block: the previous index digest moves into that block rather than being deleted, so the history of what was pinned, and therefore what was built, remains answerable after the bump (yubiOS refs: digest-bump-checklist-2026-07-25.md).

The reason is incident arithmetic. When a defect is later traced to a base image change, the first questions are "which builds used which image" and "when did the change happen." A superseded-digest block answers both from the repo itself: the old digest identifies the artifact, and the commit that moved it into the block dates the transition. An overwritten row answers neither. General provenance research makes the same argument at scale: frameworks for ML lifecycle provenance exist precisely because artifact lineage needs to be recorded as metadata alongside the artifact, not reconstructed from memory (https://arxiv.org/html/2502.19567v1, jev weight 0.83). The attestation architecture standardized in RFC 9334 formalizes the same idea for networked systems: claims about a system's state must be evidenced, not asserted (https://www.rfc-editor.org/info/rfc9334/, jev weight 0.81).

## What "audit only" means in practice

A kept-for-audit block is not a changelog. The digests it holds are dead references: nothing builds from them, and the block exists so that a reader can identify what a superseded digest referred to. The yubiOS convention applies this to the Container Images section, where prior `dhi.io/debian-base` index digests accumulate, and the checklist generalizes it: any table where a kept-for-audit block exists gets the same treatment on every bump, old value preserved, not deleted (yubiOS refs: digest-bump-checklist-2026-07-25.md).

Docker's hardened-image documentation gives the counterpart on the artifact side: image digests carry signed metadata and provenance, which is what makes a recorded old digest still verifiable later against the registry even after it stops being the active pin (https://docs.docker.com/dhi/explore/security-concepts/digests/, jev weight 0.85). The audit block plus registry history means the old digest remains checkable, not just remembered.

## Single source of truth, and its failure mode

The second half of this checklist is the duplication hazard. The yubiOS repo's own contributor instructions state: "Do not duplicate digest tables in this file. Show shape/examples only," referring to its own docs file, and the cross-cutting check is that no bump accidentally introduces a duplicate or stale digest reference in the documentation layer (yubiOS refs: digest-bump-checklist-2026-07-25.md). The pattern behind the rule: a single-source-of-truth design holds one authoritative copy of each piece of information from which all other references derive, and its documented benefit is eliminating the confusion of divergent copies (https://www.atlassian.com/work-management/knowledge-sharing/documentation/building-a-single-source-of-truth-ssot-for-your-team, jev weight 0.63). Documentation-drift analysis quantifies the cost when the rule is violated: the gap between what the docs say and what the system does grows, and stale references mislead readers precisely at decision moments (weak backing: https://datadef.io/guides/en/documentation-drift, jev weight 0.30; https://sync-o.io/blog/stale-documentation-engineering, jev weight 0.33).

For digest pins the drift is worse than cosmetic: a stale digest reference in a secondary document is a pin that someone may copy into a build, resurrecting an artifact the source of truth already superseded. The checklist's cross-cutting item exists to catch that copy in review.

## The three cross-cutting checks

The checklist groups three checks that apply to every bump regardless of category (yubiOS refs: digest-bump-checklist-2026-07-25.md):

1. No new duplicate or stale digest reference was introduced in documentation files that must show shape only.
2. Workflow-file changes inside the PR get the commit-message discipline the repo requires, because that specific path has no separate PR review step; a bundled bump must still carry a descriptive commit message.
3. Any value removed from a pinned table moves into the table's kept-for-audit block rather than disappearing.

Item 3 is the one that interacts with the other categories: it applies to container images today, but the rule is written per-table ("any table where a kept-for-audit block exists"), so a fork ref or download URL that had an audit block would get the same preservation.

## When preservation is not enough

A superseded block grows without bound if nothing is ever archived out of it. The honest limit: the audit block preserves the recent history a reviewer is likely to need, and older entries can be pruned once they are recoverable elsewhere, such as in git history, which itself records every value the row ever held. The checklist does not demand infinite retention; it demands that the removal of a superseded value be a deliberate, reviewable act rather than a side effect of a bump. The distinction between the two is the same one the single-source-of-truth literature draws: generated or derived state should be updated by a process, not silently mutated by hand (weak backing: https://www.docsie.io/blog/glossary/single-source-of-truth/, jev weight 0.38).

## Summary

Every bump produces two artifacts: the new pin and the retired one. The checklist's rule is to land both deliberately. The new pin goes into the active table with its verification evidence; the retired pin goes into the audit block with its replacement recorded; and nothing that documents pins is allowed to grow a second, quietly diverging copy of the table. That is the whole audit-trail discipline, and it costs one review item per bump.
