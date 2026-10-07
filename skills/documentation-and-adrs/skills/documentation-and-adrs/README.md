# skills/documentation-and-adrs

Knowledge corpus minted from the yubiOS skill `yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md` (14,887 B fetched 2026-10-07). The corpus explicates the skill: recording decisions and documentation, Architecture Decision Records, documenting context for future engineers and agents, and the documentation discipline the skill teaches. The source SKILL.md is the primary source of record; every doc cites it as its grounding spine, plus weighted dig results for the external mechanisms the skill references (ADR canon, TSDoc, OpenAPI, Keep a Changelog, agent rules files).

## Index

| NN | doc | scope |
|---|---|---|
| 01 | [01-document-decisions-not-code.md](01-document-decisions-not-code.md) | The overview philosophy: documentation captures the why (context, constraints, trade-offs), not the what |
| 02 | [02-when-to-document.md](02-when-to-document.md) | The 6 triggers and 3 anti-triggers for using the skill, with the expensive-to-reverse test |
| 03 | [03-adr-anatomy.md](03-adr-anatomy.md) | When to write an ADR and the 6-section template with the worked PostgreSQL example |
| 04 | [04-adr-lifecycle.md](04-adr-lifecycle.md) | PROPOSED to ACCEPTED to SUPERSEDED or DEPRECATED, never delete, supersede by new ADR |
| 05 | [05-inline-comments.md](05-inline-comments.md) | Comment the why not the what, the 3 exclusions, and inline gotcha blocks with ADR links |
| 06 | [06-api-documentation.md](06-api-documentation.md) | Inline-with-types TypeScript API docs and OpenAPI specs for REST |
| 07 | [07-readme-changelog.md](07-readme-changelog.md) | README structure (Quick Start, Commands, Architecture, Contributing) and changelog format |
| 08 | [08-docs-for-agents.md](08-docs-for-agents.md) | CLAUDE.md / rules files, specs, ADRs as re-decision prevention, inline gotchas for agents |
| 09 | [09-rationalizations-red-flags.md](09-rationalizations-red-flags.md) | Rationalizations table, 7 red flags, verification checklist, and primitive-coverage edits |

## Research summary

- Results collected: 96 (2 searXNG queries per web-shaped subtopic, top 6 kept per query; 8 subtopics dug)
- Weight split: 16 high (>= 0.5) / 80 low (< 0.5), all 96 weighted, none null
- Jev requests: 10 logged (1 outline validation + 8 weighting batches + 1 response-shape probe) plus 8 discarded first-pass weighting requests whose answers were misparsed (response shape `{"noul": p}` discovered via probe, weighting rerun). Usage: 11,954 input / 1,995 output tokens on the logged requests.
- Redos: 0 (no dig needed a redo; one weighting pass was discarded and rerun for a parse-shape fix, logged above)
- Skipped docs: 0. Subtopic 09 (rationalizations, red flags, verification checklist) is an internal-record subtopic: no dig was run, claims are sourced from the ground SKILL.md itself.
- Subtopics dropped at outline validation: 0 of 9 (scores 1.46 to 1.97; drop line is 0)

Weak-backing discipline: claims backed by dig results scoring < 0.5 are labeled "weak backing" in the doc text; claims from the ground source are attributed to it explicitly as source-doc claims.

## Preflight

2026-10-06: searXNG campaign preflight healthy (orchestrator); weighting via DefAPI direct (typesafe/jev-1.13), agent-side probe skipped per mint-brief speed optimization 3.

## research-db

`research-db/` holds schema v2 records: `preflight.json`, `outline.json`, `archive.json` (96 weighted result entries), `digs/NN-<slug>.json` (9 dig records), `jev-log.json`, and `db.ts` (TypeScript interfaces for all shapes).
