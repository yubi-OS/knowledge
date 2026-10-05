# Reusable evidence summaries, dated snapshots, and downstream citation

Scope: writing a reusable external evidence-boundary summary, dating it, and the supersession rule (later evidence supersedes snapshot lines without back-editing), plus how downstream business docs cite the canonical boundary.

## The reusable summary

An evidence-boundary document earns its keep when its conclusion can be pasted into any external document without modification. The yubiOS snapshot (OMN-68, 2026-07-25) ends with exactly such a paragraph: yubiOS is a public, LGPL-2.1-licensed, work-in-progress FIDO2-first immutable OS; the codebase, CI pipeline, and design documentation are real and inspectable at github.com/yubi-OS/yubiOS; as of 2026-07-25 the boot and build pipeline runs in CI, FIDO2 unlock is not yet proven even in a VM (B-VM-CTAP2 open), no physical-hardware validation, paid pilot, design partner, or customer interview has occurred, and ARM64 support is early groundwork; yubiOS is not affiliated with or endorsed by Yubico; anything beyond these facts is aspirational until a specific PR or CI run closes the relevant blocker.

The paragraph has five properties worth copying:

1. It opens with checkable facts only (license, public status, inspection date).
2. It states gaps as named blocker identifiers, so each gap is individually falsifiable.
3. It carries the never-claim (non-affiliation) inline, not in a footnote.
4. It closes with the supersession rule: the live blocker list is the single source of truth, and any statement beyond the facts is aspirational until evidence closes a blocker.
5. It is short enough to reuse verbatim, which is what makes it "reusable" rather than a summary.

## Dating and the no-back-edit rule

The snapshot is a photograph of status at a stated date, grounded in BLOCKERS.md as reviewed 2026-07-22 and the repo as inspected 2026-07-25. Its own recommendation section fixes the maintenance policy: KEEP as a dated snapshot; the live docs/BLOCKERS.md on main remains the single source of truth for current status, and any later closure (runs or PRs that retired B-VM-CTAP2, B-REAL-FIDO2, or B-BOOTC-SEAL) supersedes the corresponding line without being back-edited into the snapshot.

This is the correct policy for status documents, and changelog practice supplies the general form. A changelog is a curated, ordered list of notable changes per version, meant to make it easy to see precisely what changed between two releases (https://common-changelog.org/, weight 0.35, weak). Real-world changelogs record events with dates and references without rewriting history: a long-running project changelog logs dated entries pointing at issues for background (http://practical-scheme.net/gauche/ChangeLog.txt, weight 0.84, primary example). A data-platform changelog primer describes the two-point-in-time view explicitly: a changelog is a view of the changes that occurred between two snapshots (https://www.palantir.com/docs/foundry/iceberg/changelog-primer, weight 0.90, primary vendor documentation). Translated to documents: the snapshot is the snapshot; the blocker list is the log; supersession is how readers get from one to the other without anyone editing history.

The stale-documentation playbook cited in the blockers doc gives the operational triage: use git age and link checks to find what lies, then delete, date-stamp, fix, or automate (https://datadef.io/guides/en/stale-documentation, weight 0.50, secondary). A dated snapshot with a supersession rule is the date-stamp option; the blocker list is the automated option.

## Downstream citation: one boundary, many inheritors

The snapshot's dependency map answers the open question of whether every business document should restate its own evidence claims: no. OMN-65 (PR #103) and OMN-73 (PR #118) both referenced an evidence-boundary document rather than drafting their own, and the snapshot states that every other landed business doc (OMN-66/67/71/73/78/81/84) should be read against this boundary rather than restating claims independently. OMN-69 (who pays and why) is instructed to read it before finalizing target-customer claims.

A documentation convention states the rule in contract language: other documents MUST point to the canonical home instead of restating the fact; a document MAY orient the reader with a summary, but a summary that reproduces the definitions of its target is a restatement, even when it links to the target (https://seiso.fog.moe/0.1.1/convention, weight 0.69, secondary). The yubiOS reusable summary threads this needle: it is the sanctioned short form, dated and deferring, while every downstream document's specific claims still cite the canonical boundary.

A platform vendor's documentation-practice overview describes the institutional commitment behind this (https://canonical.com/documentation, weight 0.53, secondary), and an engineering-blog treatment of making technical documentation easier (https://getdx.com/blog/making-technical-documentation-easier/, weight 0.30, weak) covers adjacent ground at lower rigor.

## The full lifecycle, in one loop

The complete pattern this corpus observes across the yubiOS snapshot and its ecosystem:

1. The live system (BLOCKERS.md on main) holds current status, updated by the events that change it.
2. Dated snapshots record the boundary at points in time and are never back-edited.
3. Downstream documents cite the canonical boundary and reuse the dated summary verbatim.
4. Closure events (CI runs, merged PRs) retire blockers by identifier in the live system.
5. When enough closures accumulate to move the gate position, a new snapshot is drafted; the old one remains as history.
6. A drift check (the source doc carries one from 2026-09-18) re-verifies that dated claims are read as historical positions, not current ones, and adds additive notes rather than editing claims.

The failure modes are all familiar: downstream docs that redraw the boundary (fixed by the inheritance rule), snapshots that get silently updated into lies about their own date (fixed by no-back-edit), and summaries that drift from the canonical list (fixed by making the summary cite blocker identifiers, so any drift is a diff anyone can run).
