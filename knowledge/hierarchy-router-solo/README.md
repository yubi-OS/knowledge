# Hierarchy-detector routing regime [SOLO]

Knowledge corpus minted in the 22-corpus `refs/` mint wave (Lane 2).

- **Corpus slug:** `hierarchy-router-solo`
- **Ground-source document:** `yubi-OS/yubiOS refs/hierarchy-router-solo-2026-10-06.md`
- **Local source copy:** `session/refs_wave22/sources/hierarchy-router-solo.md`

## Documents

| NN | File | One-line scope | Clef outline score |
|---|---|---|---|
| 01 | [01-problem-statement.md](01-problem-statement.md) | Problem Statement: externally dug (searXNG + clef) | 1.6799 |
| 02 | [02-grounding-what-exists.md](02-grounding-what-exists.md) | Grounding (what exists): externally dug (searXNG + clef) | 1.7412 |
| 03 | [03-recommended-direction.md](03-recommended-direction.md) | Recommended Direction: internal-record explication of the ground source | 0.9171 |
| 04 | [04-key-assumptions-to-validate.md](04-key-assumptions-to-validate.md) | Key Assumptions to Validate: internal-record explication of the ground source | 1.3075 |
| 05 | [05-mvp-scope-one-atomic-loop.md](05-mvp-scope-one-atomic-loop.md) | MVP Scope (one atomic loop): internal-record explication of the ground source | 1.3505 |
| 06 | [06-not-doing-and-why.md](06-not-doing-and-why.md) | Not Doing (and Why): internal-record explication of the ground source | 1.0682 |

Outline scores come from `research-db/outline.json` (`validation.answers.t01..t06.score`), the clef `score` metric over 3 levels lowest-first (padding / marginal / load-bearing). No subtopic was dropped.

## Research summary

- **20 results collected** (2 searXNG seed queries for docs 01 and 02, 10 kept results each).
- **Quality weighting (clef noul):** high >= 0.5: **0**; low < 0.5: **20** (from `meta.stats`).
- **5 jev requests** to `/api/decide`, **0 redos**, **0 skips**.
- Docs 01 and 02 cite dig results inline with their exact clef weight; sources below 0.5 are labelled weak backing. Docs 03 to 06 are internal-record subtopics explicated directly from the ground source with no external web dig.

## Dig highlights (top 3 by clef weight)

- **Doc 01:** [Tropos: calibration-robust routing for multi-model AI](https://joperjoker.github.io/biomimetic-ai-orchestration/) (0.2537, weak); [Multi Model AI: Routing and Orchestration Guide - Openbase](https://openbase.ai/blog/multi-model-ai) (0.2402, weak); [Deterministic Guardrails for AI Agents | SovereignClaw](https://sovereignclaw.com/research/deterministic-guardrails) (0.2308, weak)
- **Doc 02:** [Human-in-the-Loop with AG-UI | Microsoft Learn](https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/ui/ag-ui/human-in-the-loop) (0.4420, weak); [Human-in-the-Loop AI Approval Workflows | AxonFlow Documentation](https://docs.getaxonflow.com/docs/governance/human-in-the-loop/) (0.2240, weak); [Human-in-the-Loop Approval Framework - Agentic Patterns](https://www.agentic-patterns.com/patterns/human-in-loop-approval-framework/) (0.2191, weak)

## How to read this corpus

1. Start with docs 01 and 02: they frame the subtopic and pair every ground-source claim with the external dig, citing each result inline with its exact clef weight. Anything below 0.5 is explicitly labelled weak backing and is used for context only, never as authority.
2. Docs 03 to 06 explicate the ground source section by section (equations, parameters, gates, and empirical records), with no external web dig. Treat `yubi-OS/yubiOS refs/hierarchy-router-solo-2026-10-06.md` as the authority for every number in them.
3. Each 01/02 doc ends with a `Sources Considered` table listing all 10 dig results and their weights, so the evidence base is auditable without re-running the dig.
4. Writing conventions: numbers as digits, no em dashes, headings for wayfinding, and honest gaps stated rather than padded.

## Preflight

Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200
