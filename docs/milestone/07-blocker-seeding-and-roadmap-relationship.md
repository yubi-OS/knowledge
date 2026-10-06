# 07 Blocker seeding and relationship to the broader roadmap

Scope: how the milestone doc names blockers without tracking them, and how it divides labor with TODO.md, BLOCKERS.md, and FUTURE.md. Internal-record subtopic: no dig, all claims from the source doc. Grounding spine: source doc yubi-OS/yubiOS docs/MILESTONE.md, fetched 2026-10-06 from https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MILESTONE.md.

## The blocker-seeding model

The source doc's self-description sets the rule: "BLOCKERS.md — the single source of truth for open blockers; this doc only names which blockers seed which milestone, it does not track their live status." (source doc). Seeding is a one-directional reference: each milestone section lists the blockers that motivated or constrain it, but the live state of any blocker (open, contained, resolved) lives only in BLOCKERS.md.

The doc demonstrates the model's failure mode and its correction in one place. Milestone 2's blocker section is titled "Seeded blockers (corrected 2026-07-28 against BLOCKERS.md Last reviewed 2026-07-25)" and contains three entries with three different statuses: B-VM-CTAP2 marked RESOLVED 2026-07-25 with closure evidence (run 30139433902, OMN-48 Done, the LUKS2 unlock to homed to pamu2fcfg to ed25519-sk chain end-to-end with no skips), B-QEMU-ZBOOT marked a contained workaround rather than an open failure, and B-REAL-FIDO2 marked NOW READY TO EXECUTE because the gate it was waiting on is now open (source doc). Even the corrections are anchored to a BLOCKERS.md review date, not to free-floating assertion.

## The division of labor

The doc names three sibling documents and draws a boundary with each (source doc):

- **TODO.md**: "the active, detailed task list; check there for current work-in-progress." (source doc). The milestone doc carries status snapshots with dates; TODO.md carries the live task detail.
- **BLOCKERS.md**: "the single source of truth for open blockers" (source doc), as quoted above.
- **FUTURE.md**: "longer-horizon research and planning cycles, including Milestone F (ARM64 Owner-Owned Root of Trust) which overlaps with milestone 1 above but is tracked at a different altitude (research backlog vs execution milestone)." (source doc).

The altitude distinction in the FUTURE.md entry is the subtlest of the three. The same subject matter (ARM64 owner-owned root of trust) appears in both documents, but the milestone tracks execution evidence while the research item tracks design work. A reader must not collapse the two into one workstream or double-count their progress.

## How the status percentages relate to the mirror

The status lines under each milestone ("0%", "65.6%", "6.25%", "25%", all as of 2026-07-28) are mirror readings of Linear state, and the doc's header says so: it is a mirror of the Linear project "yubiOS Production Proof & Release Gates" (id a9a0701b-d1be-448c-a194-e573c82bd9f8, team OMNI-AGENT) per OMN-64/OMN-44 (source doc). The percentages therefore have a defined provenance: they summarize the child-issue states listed in each milestone section at the stated review date. They are not independently recomputed metrics, and any discrepancy between the doc and Linear is resolved in Linear's favor by the doc's own framing.

## The review-cadence contract

Each milestone section stamps its blocker list against a specific BLOCKERS.md review date (2026-07-25 in every seeded-blockers line), and the doc's Goal section stamps itself against a later review (2026-07-30, sha 7501fa0c13a4) (source doc). This produces a two-level drift discipline: the doc as a whole is reviewed against BLOCKERS.md, and within the doc each milestone's blocker list carries its own alignment stamp. The 2026-07-30 stamp is explicit about its own nature: "a no-new-retirements confirmation", deferring to the 2026-07-28 review diff as the binding drift correction (source doc). The process rule that formalizes this discipline is covered in doc 08.

## What a consumer should and should not do with this doc

Reading the model strictly: use MILESTONE.md for scope, ownership, gates, and sequencing of the four milestones; use TODO.md for current work in progress; use BLOCKERS.md for the live state of any blocker named here; use FUTURE.md for anything that smells like research rather than execution (source doc). The doc's own last line of self-description is "planning-only", with implementation revisited only after repo-side coding work resumes on each milestone, per OMN-44's framing (source doc).
