# 08 The planning doc publish-gate and drift-check discipline

Scope: the process rule added to the source doc on 2026-07-28, the failure mode it was created to catch, and the drift-check notes appended since. Internal-record subtopic: no dig, all claims from the source doc. Grounding spine: source doc yubi-OS/yubiOS docs/MILESTONE.md, fetched 2026-10-06 from https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MILESTONE.md.

## The rule

The source doc carries a section titled "Planning doc publish-gate (process rule, added 2026-07-28)" which grounds itself in the project's standing rules: "Per memory/github-yubios-KS9n5GAT/PROJECT_RULES.md (Planning doc publish-gate section), this doc was re-read against docs/BLOCKERS.md Last reviewed: 2026-07-25 immediately before this re-issue." (source doc). The rule has two components: a mandatory re-read of BLOCKERS.md immediately before any re-issue of a planning doc, and a required header.

The header requirement is stated verbatim: "Future re-issues must include a <last-reviewed-against-blockers> header stamped at the top of any planning doc that lands the same day BLOCKERS.md is reviewed." (source doc). The header exists to make the alignment claim visible at the top of the document rather than buried in a section.

## The failure mode it catches

The doc records its own motivating incident: "Same-day drift on the previous (2026-07-25) version of this doc — calling B-VM-CTAP2 'single highest-leverage blocker' when BLOCKERS.md same-day review had marked it RESOLVED — is the failure mode this rule is designed to catch." (source doc). The anatomy of the failure is worth keeping precisely: on 2026-07-25, BLOCKERS.md's same-day review marked B-VM-CTAP2 resolved (with the closure evidence: run 30139433902, OMN-48 Done, LUKS2 unlock to homed to pamu2fcfg to ed25519-sk end-to-end, no skips), while the milestone doc's same-day version still called that blocker the single highest-leverage one in the project (source doc). The two documents disagreed about the same fact on the same day, and nothing in the doc's structure forced the reconciliation.

The correction mechanism now embedded in milestone 2's section shows the rule working in practice: the blocker list is explicitly titled as corrected against the BLOCKERS.md review date, and the doc states "The 2026-07-28 review diff (corrected against the same-day BLOCKERS.md) remains the binding drift correction" (source doc).

## Drift-check notes after the gate

Two additional notes were appended to the source doc later, both dated 2026-09-18 and both recording the passage of the milestone target date:

- "2026-09-18 drift check (wayfinder round 10, cycle 12)": "the milestone target dated 2026-09-13 on the Production Proof & Release Gates project has passed; per the planning doctrine, the milestone state is Jenny's call; this note records the date passage only." (source doc).
- "2026-09-18 drift check (wayfinder round 11, cycle 11)": "MILESTONE.md: the passed 2026-09-13 target was flagged in round 10; still flagged; milestone state remains Jenny's call." (source doc).

Three things are notable about these notes. First, they demonstrate the drift-check pattern continuing past blocker alignment into schedule alignment: a target date in the planning doc can drift just like a blocker state can. Second, they record who owns the decision: the milestone state is explicitly Jenny's call, and the notes deliberately do not decide it, only record the passage. Third, the two rounds reference each other (round 11 confirms what round 10 flagged), which is the same confirm-then-bind pattern the blocker review stamps use.

## How the gate generalizes

The publish-gate is a rule about documents that mirror state held elsewhere. Its general form: before re-issuing a mirror, re-read the source of truth and stamp the re-read date visibly. The failure it prevents is not inaccuracy in the mirror's own content but staleness relative to the source of truth, which is invisible from the mirror alone. In the yubiOS planning stack, the sources of truth are BLOCKERS.md for blockers, Linear for issue state, and TODO.md for active work; MILESTONE.md is the layer that must be re-validated against all of them on re-issue, and the gate plus the header is the mechanism that makes that validation auditable after the fact.
