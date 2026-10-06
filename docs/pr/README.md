# docs/pr: the yubiOS public-relations campaign corpus

A knowledge corpus explicating the yubiOS public-relations campaign document (ground source: yubi-OS/yubiOS docs/PR.md, fetched 2026-10-06, 39634 bytes). The corpus explicates the campaign story, the claims it makes and their claim boundaries, the channels, and how the PR narrative relates to the verified threat model. The source doc's own sections dictated the outline. In this corpus, PR means Public Relations, not pull request.

## Contents

| NN | Doc | One-line scope |
|---|---|---|
| 01 | 01-campaign-thesis.md | The executive decision, the thesis sentence, the owner-present versus platform-booted split, and the 90-day outcome targets |
| 02 | 02-positioning-foundations.md | Credible ownership, 2026 category timing (bootc, Fedora Atomic, Amutable, SLSA, CISA), whitespace, and the comparison map |
| 03 | 03-audiences-message-house.md | The 4-tier audience table, category, core promise, 5 pillars, narrative ladder, and descriptors |
| 04 | 04-claim-ledger.md | Per-topic approved wording, evidence links, and forbidden claims |
| 05 | 05-readiness-gates.md | Gates 0 to 3 with evidence requirements, allowed language, and dig corroboration of the firmware mechanisms |
| 06 | 06-campaign-waves.md | Waves 0 to 3: triggers, themes, and deliverables |
| 07 | 07-channel-plan.md | Owned channels, earned and community channels, and pitch angles keyed to gates |
| 08 | 08-press-kit-outreach.md | Press-kit checklist, draft outreach templates, Yubico-brand and FIDO2 dig corroboration, and the 9-question FAQ |
| 09 | 09-runbook-risk-measurement.md | The D-14 to D+30 runbook, risk/response table, measurement dashboard, and role-based approvals |

Docs 01, 03, 04, 06, and 09 are internal-record subtopics: the source doc names no external mechanisms in their scope, so no searXNG dig was run and every claim cites the source doc.

## Research summary

- Subtopics: 9 outlined, 0 dropped, 9 authored, 0 skipped.
- Results collected: 48 (2 queries each for the 4 web-shaped subtopics: 02, 05, 07, 08), top 6 kept per query.
- Weight split: 24 high (>= 0.5) / 24 low (< 0.5).
- Jev requests: 11 (11855 input tokens, 1937 output tokens), all logged in research-db/jev-log.json with per-request endpoints.
- Redo counts: 1 weighting-redo round (see below). 0 dig redos.
- Skipped docs: none.

Weighting redo: the first DefAPI-direct weighting pass (4 requests, 2026-10-06T09:52Z) returned inverted-looking noul values (0.02 to 0.34 for all 48 results) because the instructions deviated from the canonical parent-brief phrasing. A control probe against the steady-orbit clef relay (bootc GitHub 0.8772, brandfetch 0.148) and a matched DefAPI control with canonical phrasing (0.79, 0.11) confirmed the canonical phrasing is calibrated. All 48 results were rescored with canonical phrasing; those weights are the ones shipped.

Marginal outline scores kept by dig strength: 05-readiness-gates scored 0.75 and kept on the strength of 7 high-weight results; 07-channel-plan scored 0.40 and kept on the strength of the canonical outlet-guidance sources (LWN FAQ 0.61, Hacker News guidelines 0.62).

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side); decide model typesafe/jev-1.13 healthy via DefAPI direct with steady-orbit relay as fallback.
