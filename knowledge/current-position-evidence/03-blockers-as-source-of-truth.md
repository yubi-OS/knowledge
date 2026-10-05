# Blockers as the single source of truth for project status

Scope: maintaining a live, numbered blocker list as the single source of truth for current project status, with dated snapshot documents deferring to it rather than restating status.

## The pattern

A blocker list is a numbered, maintained document where every gap between "what the project claims" and "what is proven" gets an entry. The yubiOS project runs docs/BLOCKERS.md on main as its live list; its evidence-boundary snapshot (OMN-68, 2026-07-25) draws every "not yet proven" statement from that list as reviewed 2026-07-22, and names BLOCKERS.md as the single source of truth for current status. When a blocker closes, the closure happens in the live list (with a PR or CI run as the closing evidence), and dated snapshots are not back-edited; they simply become historical.

The general principle is the standard "single source of truth" pattern from collaboration tooling: a central location where team members find the most accurate and current information about a project or process (https://www.atlassian.com/work-management/knowledge-sharing/documentation/building-a-single-source-of-truth-ssot-for-your-team, weight 0.63, secondary). The failure mode it prevents is N documents restating status N ways, each drifting at its own rate.

## Why numbered blockers beat prose

Numbered, individually-named blockers (the yubiOS list uses identifiers like B-VM-CTAP2, B-REAL-FIDO2, B-HARDENING-RUNTIME, B-BOOTC-SEAL, B-ARM64-PATHA, B-RK3588-TPL) buy three properties that prose status pages do not:

1. Citable closure. A blocker is retired by a specific artifact: the yubiOS snapshot cites B-VM-SSH and B-VM-BOOTLOADER-UPDATE as retired by CI run 29872832727. A prose "mostly working" page cannot be retired by anything.
2. Downstream citation. A business document can say "claims X are off-limits until B-Y closes" and the condition is checkable forever.
3. Staleness detection. If the blocker list's last review date is old relative to the snapshot citing it, the citation is suspect. The yubiOS snapshot carries both dates for exactly this reason.

A stale-documentation playbook describes the analogous triage for docs generally: find what lies using git age and link checks, then triage into delete, date-stamp, fix, or automate (https://datadef.io/guides/en/stale-documentation, weight 0.50, secondary). Date-stamping is the operation a dated snapshot performs; the blocker list is the "automate" end, because closure events (CI runs, merged PRs) flow into it from tooling rather than from prose updates.

## The restatement rule

The discipline that makes the pattern work is: other documents must not restate current status, only cite it. A documentation convention drawn from an internal style guide states it sharply: other documents MUST point to the canonical home instead of restating the fact; a document MAY orient the reader with a summary, but a summary that reproduces the definitions of its target is a restatement even when it links to the target (https://seiso.fog.moe/0.1.1/convention, weight 0.69, secondary). The yubiOS snapshot's reusable external summary (its section 5) is the sanctioned short form precisely because it is dated and explicitly defers to the live list.

Engineering-adjacent sources converge on the same rule from the drift angle: one validation-focused doc holds that a change "is incomplete until its canonical reference and executable evidence change in the same work item" (https://tsonic.org/docs/validation/documentation-drift/, weight 0.38, weak), meaning status changes land in the canonical system as part of the change itself, not in a later editorial pass. WordPress's documentation handbook treats its issue tracker as the central place for doc work, with no documentation hosted there, separating the tracking surface from the artifact surface (https://make.wordpress.org/docs/handbook/github-repository-and-projects/documentation-issue-tracker/, weight 0.41, weak).

## Where the pattern breaks, and the fix

Vendor and PM-tool material on blockers tends to treat them as workflow impediments to be cleared quickly (https://plane.so/blog/project-blockers-definition-examples-and-how-to-overcome-them, weight 0.36, weak; https://www.projectmanagertemplate.com/post/project-impediment-management-a-complete-guide, weight 0.46, weak). That framing is wrong for evidence-boundary blockers: these blockers are not obstacles to project progress; they are the difference between a claim and its proof, and most of them cannot be "managed away," only closed by real work. The fix is scope discipline: the blocker list tracks evidence gaps, not general todos. General todos belong in TODO.md; the blocker list holds only the named conditions that gate claims.

The yubiOS snapshot adds one more structural guard: business-side evidence gaps (no completed customer interviews, no design partners, no paid pilot, no published covenant, no Technical Preview entry-criteria sign-off) appear in the same list structure as technical ones, so commercial and technical status are gated by the same mechanism. A snapshot that mixes the two classes risks one class's language bleeding into the other; a numbered list keeps them parallel and countable.
