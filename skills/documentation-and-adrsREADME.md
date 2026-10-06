# skills/documentation-and-adrs

Knowledge corpus explicating the yubiOS skill `documentation-and-adrs` (ground source: `yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md`, 14887 B, fetched 2026-10-06). The corpus records decisions and documentation, Architecture Decision Records, documenting context for future engineers and agents, and the documentation discipline the skill teaches. The ground source is the primary source of record; the corpus explicates it and carries searXNG dig evidence for the external mechanisms it names.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-document-why-not-what.md](01-document-why-not-what.md) | Document the why (context, constraints, trade-offs); triggers for when to document and when not to |
| 02 | [02-adr-when-and-value.md](02-adr-when-and-value.md) | When to write an ADR; ADRs as the highest-value documentation |
| 03 | [03-adr-template-anatomy.md](03-adr-template-anatomy.md) | ADR template fields and the docs/decisions/ storage convention |
| 04 | [04-adr-lifecycle-supersede.md](04-adr-lifecycle-supersede.md) | Status lifecycle, never-delete rule, supersession discipline |
| 05 | [05-inline-comments-why.md](05-inline-comments-why.md) | Comment the why not the what; gotchas; the 3 anti-patterns |
| 06 | [06-api-documentation.md](06-api-documentation.md) | Inline typed docs for TypeScript and OpenAPI for REST |
| 07 | [07-readme-structure.md](07-readme-structure.md) | The 5 required README sections and the ADR-linking architecture section |
| 08 | [08-changelog-maintenance.md](08-changelog-maintenance.md) | Added/Fixed/Changed with dates and issue references |
| 09 | [09-agent-documentation.md](09-agent-documentation.md) | Rules files, spec files, ADRs, and gotchas for agent readers |
| 10 | [10-rationalizations-and-verification.md](10-rationalizations-and-verification.md) | Rationalization table, red flags, verification checklist (internal-record) |

## Research summary

- Outline: 10 subtopics proposed, 10 kept, 0 dropped (jev score validation: all scored 1.21 or above on the 0-2 load-bearing scale).
- Results collected: 156 across 25 searXNG queries (18 first-attempt + 7 redo queries). Weight split: 47 high (>= 0.5) / 109 low (< 0.5).
- jev requests: 12 (1 outline score validation + 11 noul weighting batches of 15 or fewer), usage 14394 input / 3162 output tokens. Weighting ran direct against api.defapi.org (typesafe/jev-1.13); zero 429s, no retries needed.
- Redos: 6 subtopics redug with different queries after attempt-1 results came back as off-topic noise (01, 02, 03, 05, 07, 09). No result was rescored; redo_of is null throughout.
- Docs kept/skipped: 10 / 0. No doc was skipped; doc 10 is grounded in the source doc alone as an internal-record subtopic (no dig, per the mint speed rules).
- Gap note: searXNG returned heavy dictionary/homepage noise on short multi-word queries; docs 01, 04, and 05 therefore lean on weak-backed digs (weight < 0.5, labeled in text) plus the source doc's own spine. The strongest dig domains were OpenAPI/TSDoc (all results >= 0.87) and Keep a Changelog (>= 0.77).

Per-doc results kept: { "01-document-why-not-what": 5, "02-adr-when-and-value": 4, "03-adr-template-anatomy": 4, "04-adr-lifecycle-supersede": 4, "05-inline-comments-why": 4, "06-api-documentation": 6, "07-readme-structure": 4, "08-changelog-maintenance": 4, "09-agent-documentation": 5, "10-rationalizations-and-verification": 0 }.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator-run); /api/decide preflight run orchestrator-side, agent-side probe skipped for speed.
