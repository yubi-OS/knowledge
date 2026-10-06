# docs/milestone: the yubiOS milestone definitions

Knowledge corpus explicating the yubiOS planning doc `docs/MILESTONE.md` (yubi-OS/yubiOS), fetched 2026-10-06 (9840 bytes). The corpus decomposes the doc by its own sections: each milestone's scope and gates, the evidence standards, and the sequencing the doc records. The source doc is the primary source of record; dig-backed claims carry their URL and jev weight.

## Docs

- `01-goal-and-workstreams.md`: the project goal, the four main workstreams, and the Linear mirror arrangement.
- `02-milestone-1-arm64-path-a.md`: ARM64 Path A production proof, scope, gates, ownership, blockers, 0% status.
- `03-milestone-2-token-backed-vm-ci.md`: token-backed VM and CI coverage, the delivered software path, corrected blockers, 65.6% status.
- `04-milestone-3-sealed-composefs.md`: sealed composefs boot chain, the critical path and long-pole status, 6.25%.
- `05-milestone-4-runtime-supply-chain.md`: runtime hardening and supply-chain validation, 25%, checklist deliverables.
- `06-cross-milestone-items.md`: items with no parent, mirror infra, standalone FIDO2 validation, hygiene, research.
- `07-blocker-seeding-and-roadmap-relationship.md`: the blocker-seeding model and the TODO/BLOCKERS/FUTURE division of labor.
- `08-planning-publish-gate.md`: the planning doc publish-gate rule and the drift-check discipline.

## Research summary

- Results collected: 60 (5 web-shaped subtopics, 2 queries each, top 6 kept per query; 3 internal-record subtopics skipped digs by design).
- Weight split (jev noul): high 14 / low 46 of 60. Kept per doc: 01 3, 02 2, 03 4, 04 4, 05 1; docs 06-08 source-doc only.
- jev requests: 5 (1 outline score, 4 noul weighting batches of 15) via DefAPI direct, 0 redos.
- jev usage: 7686 input / 1220 output tokens.
- Skipped docs: none. Gaps: none. Milestone 4's dig returned only 1 authoritative result (slsa.dev); its doc leans correspondingly harder on the source doc.
- Redos: 0.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide weighting done via DefAPI direct (api.defapi.org/api/v1/decisions, typesafe/jev-1.13), agent-side probe skipped for speed per mint brief.

Outline validation: 8 subtopics scored, none dropped (t01 1.55, t02 1.64, t03 1.35, t04 1.53, t05 1.21, t06 1.19, t07 0.74, t08 0.94).
