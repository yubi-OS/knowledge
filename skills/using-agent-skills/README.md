# using-agent-skills knowledge corpus

Knowledge corpus explicating the yubiOS skill `yubi-OS/yubiOS skills/using-agent-skills/SKILL.md` (16,438 B, fetched 2026-10-08): the meta-skill that governs how all other skills are discovered and invoked at session start or task start. The SKILL.md is the primary source of record; this corpus explicates and deepens it.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-skill-discovery-decision-tree.md](01-skill-discovery-decision-tree.md) | Routing an incoming task to the right skill by development phase and trigger question |
| 02 | [02-meta-skill-role-progressive-disclosure.md](02-meta-skill-role-progressive-disclosure.md) | How the meta-skill governs discovery and invocation of every other skill; progressive disclosure of SKILL.md packages |
| 03 | [03-core-operating-behaviors.md](03-core-operating-behaviors.md) | The 6 non-negotiable always-on behaviors |
| 04 | [04-failure-modes.md](04-failure-modes.md) | The 10 failure modes that look like productivity, mapped to countering behaviors |
| 05 | [05-skill-composition-lifecycle-sequence.md](05-skill-composition-lifecycle-sequence.md) | The 4 skill rules and the 16-step lifecycle sequence; tailoring to smaller tasks |
| 06 | [06-phase-map-quick-reference.md](06-phase-map-quick-reference.md) | The Define/Plan/Build/Verify/Review/Ship phase map, 23 skills |
| 07 | [07-verification-and-definition-of-done.md](07-verification-and-definition-of-done.md) | Verify-don't-assume; per-skill verification vs the Definition of Done bar |
| 08 | [08-corpus-audit-primitive-integration.md](08-corpus-audit-primitive-integration.md) | curve-guided-rsi primitive-coverage sections and their audit trails |
| 09 | [09-scope-boundary-guidelines.md](09-scope-boundary-guidelines.md) | Frontmatter scope, boundary-case routing, guidelines |

## Research summary

- Results collected: 58 (kept top 6 per query across 12 query attempts, deduplicated by URL)
- Weight split: 9 high (>= 0.5) / 49 low (< 0.5); 0 unweighted
- Jev requests: 10 (1 outline validation + 9 weighting batches across 2 passes; see research-db/jev-log.json), usage 12575 input / 2437 output tokens
- Redos: 2 dig redos (subtopic 03 and subtopic 07, each re-queried once with different queries after thin first passes); 1 weighting re-pass after an index-mapping bug in the first weighting run (logged in jev-log.json; all 58 results carry final authoritative weights)
- Skipped docs: none
- Gaps: none

Docs 05, 06, 08, 09 are internal-record subtopics: their content is the source doc's own rules, sequence, table, audit sections, and scope rules, so no searXNG dig was run and they cite the source doc directly.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); DefAPI decide (typesafe/jev-1.13) 200.

## Research DB (schema v2)

- `research-db/preflight.json` - preflight record
- `research-db/outline.json` - topic decomposition + score validation
- `research-db/archive.json` - all 58 collected results with noul decisions
- `research-db/digs/` - one dig record per subtopic (9 files)
- `research-db/jev-log.json` - one entry per jev HTTP request
- `research-db/db.ts` - TypeScript interfaces for all shapes
