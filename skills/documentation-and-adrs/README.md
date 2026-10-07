# documentation-and-adrs

Knowledge corpus explicating the yubiOS **documentation-and-adrs** skill (ground source: yubi-OS/yubiOS `skills/documentation-and-adrs/SKILL.md`, 14887 bytes). The skill records decisions and documentation: Architecture Decision Records, documenting context for future engineers and agents, and the documentation discipline it teaches. This corpus deepens it; the SKILL.md remains the primary source of record.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-documenting-decisions.md](01-documenting-decisions.md) | The core thesis: document decisions, not just code. |
| 02 | [02-adr-when-to-write.md](02-adr-when-to-write.md) | When an ADR is warranted: framework and dependency choices, data model and schema design, authentication strategy, API architecture (REST vs GraphQL vs tRPC), build tooling and hosting infrastructure, and any decision that would be expensive to reverse.. |
| 03 | [03-adr-template-and-lifecycle.md](03-adr-template-and-lifecycle.md) | The ADR template in docs/decisions/ with sequential numbering: Status, Date, Context, Decision, Alternatives Considered, Consequences. |
| 04 | [04-inline-comments-why-not-what.md](04-inline-comments-why-not-what.md) | Inline documentation discipline: comment the why not the what; the sliding-window rate-limit comment example; do not comment self-evident code; no TODO-instead-of-do-it; no commented-out code because git has history; documenting known gotchas with JSDoc blocks that link to ADRs.. |
| 05 | [05-api-documentation.md](05-api-documentation.md) | API documentation for public surfaces: inline types with TSDoc for TypeScript (params, returns, throws, examples) as the preferred form, and OpenAPI/Swagger specs for REST endpoints with schemas and response codes.. |
| 06 | [06-readme-structure.md](06-readme-structure.md) | README structure every project should have: one-paragraph description, quick start steps, commands table, architecture overview that links to ADRs, and a contributing section.. |
| 07 | [07-changelog-maintenance.md](07-changelog-maintenance.md) | Changelog maintenance for shipped features: version-dated entries with Added, Fixed, and Changed sections, issue references, and the Keep a Changelog convention behind that format.. |
| 08 | [08-docs-for-agents.md](08-docs-for-agents.md) | Documentation written for AI agents: CLAUDE.md and rules files to encode project conventions, keeping spec files updated so agents build the right thing, ADRs to prevent agents re-deciding settled questions, and inline gotchas to keep agents out of known traps.. |
| 09 | [09-rationalizations-and-red-flags.md](09-rationalizations-and-red-flags.md) | INTERNAL-RECORD subtopic, no dig. |
| 10 | [10-primitive-coverage-and-audit.md](10-primitive-coverage-and-audit.md) | INTERNAL-RECORD subtopic, no dig. |

## Research summary

- Results collected: 144 (top 6 per query, 2 queries per web-shaped subtopic; 8 subtopics dug, 2 internal-record subtopics undug)
- Weight split: 18 high (>= 0.5) / 126 low (< 0.5), every result weighted
- jev requests: 13, usage 18730 input / 2838 output tokens (model typesafe/jev-1.13 via DefAPI direct; outline validation score metric, weighting noul metric)
- Outline: 10 subtopics proposed, 0 dropped (lowest score 0.8, subtopic 10 kept as internal-record)
- Redos: 4 redo round covering 4 subtopics (01, 04, 06, 08) after first-pass digs returned polluted results; 8 replacement queries
- Skipped docs: none
- Gaps: searXNG noise was high for subtopics 01, 04, 06 (dictionary entries and unrelated sites); docs for those subtopics ground primarily in the source doc with weak-backed (< 0.5) citations labeled as such in text

## Sources

Every factual claim carries its source URL and jev weight. Claims from the source doc are attributed to "source doc" (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md). Results weighted below 0.5 are labeled weak in the text.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); weighting endpoint api.defapi.org/api/v1/decisions (typesafe/jev-1.13), agent-side probe skipped per SKILLS-variant speed protocol.
