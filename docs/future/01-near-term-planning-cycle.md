# 01. Near-Term Planning Cycle

Scope: how the yubiOS future-work ledger anchors its planning horizon in dated evidence refreshes, and how the ledger hands work off to SPEC.md, ADR.md, and BLOCKERS.md instead of carrying active requirements itself.

## The ledger is a staging area, not a baseline

The future-work ledger opens by declaring its own status: "roadmap and research backlog", last reviewed 2026-07-21 (source doc, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md). The same paragraph fixes the boundary between it and the normative documents: "This file tracks future work that is not yet the normative baseline. Active requirements belong in SPEC.md; accepted decisions belong in ADR.md; open blockers belong in BLOCKERS.md" (source doc, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md).

That sentence is the load-bearing rule of the whole document. An item living in FUTURE.md is, by definition, work whose requirements are not yet settled, whose decision is not yet accepted, or whose blocker is not yet filed. The three sibling documents each own one of those states:

- SPEC.md owns active requirements.
- ADR.md owns accepted decisions.
- BLOCKERS.md owns open blockers.

The ledger never competes with them. This is why every later section of the doc ends with "evidence needed before promotion" lists rather than with requirements: promotion means leaving this document.

## Dated evidence refreshes set the planning horizon

The Near-Term Planning Cycle section does not contain plans of its own. It points at two dated evidence artifacts and one earlier baseline (source doc, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md):

- The current evidence refresh is `refs/ci-evidence-2026-07-21.md`.
- It is paired with the systemd-family progress snapshot `refs/systemd-upstream-progress-2026-07-21.md`.
- The earlier planning baseline remains `refs/planning-cycle-2026-07-11.md`.

The pattern is deliberate: the cycle-level state of the project lives in dated refs documents, and the ledger just links to the freshest pair. The 10-day gap between the 2026-07-11 planning baseline and the 2026-07-21 refresh shows the intended cadence: a planning baseline is superseded by evidence refreshes that carry newer CI and upstream data, but the baseline itself is kept rather than replaced so the history of the planning thread stays readable.

This internal-record subtopic has no dig: the planning-cycle section of the source doc names only repo-internal artifacts, so the corpus grounds it in the source doc alone.

## Drift checking closes the loop

The doc ends with a dated drift-check section headed "2026-09-18 drift check (wayfinder round 11, cycle 7)" (source doc, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md). Its content is minimal by design: the lead rung of round 9 named FUTURE.md (change:bit0, delta 0), the file passed the frozen check without repair, and "this drift check records that and nothing more".

Two structural facts follow from that entry. First, the ledger is not just maintained by hand; it is periodically re-validated by an automated drift-check process that runs on rounds and cycles, and the outcome is appended to the file itself. Second, the entry records a non-event (passed without repair) rather than silently skipping the check, which keeps the audit trail continuous: a reader can see when the file was last verified, not just when it was last edited.

## Why this structure matters for long-horizon planning

The combination of the three mechanisms gives the ledger a precise lifecycle. Work enters as milestones and ideas (docs 02 to 09 of this corpus), sits in the backlog with its evidence requirements stated, gets re-validated by dated drift checks, and exits through the promotion gate defined in doc 10 (exit criteria). The planning cycle section is the entry point that tells a maintainer where the current evidence lives before they touch any milestone, and the SPEC/ADR/BLOCKERS split is the exit map that tells them where promoted work goes. Neither mechanism invents new facts; both are pointers, which is why the doc can stay short while the underlying evidence documents grow.

## Sources for this doc

All claims in this doc come from the ground source: yubi-OS/yubiOS `docs/FUTURE.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md), fetched 2026-10-06. This is an internal-record subtopic, no dig: the section references repo-internal artifacts only, and no external mechanism is named.
