# context-engineering knowledge corpus

Explication of the yubiOS **context-engineering** skill (ground source: `yubi-OS/yubiOS skills/context-engineering/SKILL.md`): optimizing agent context setup, configuring rules files, managing output quality degradation, and the context-design discipline the skill teaches. The outline follows the SKILL.md's own sections.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-context-hierarchy.md](01-context-hierarchy.md) | The 5-level persistence hierarchy, from always-loaded rules files down to conversation history |
| 02 | [02-rules-files.md](02-rules-files.md) | Authoring CLAUDE.md and its equivalents; the four sections and content selection |
| 03 | [03-specs-and-source-files.md](03-specs-and-source-files.md) | Loading spec sections per feature; pre-task source loading; the 3 trust levels |
| 04 | [04-error-and-conversation.md](04-error-and-conversation.md) | Feeding specific errors back; fresh sessions, progress summaries, deliberate compaction |
| 05 | [05-packing-strategies.md](05-packing-strategies.md) | The brain dump, the selective include, and the hierarchical summary project map |
| 06 | [06-budget-management.md](06-budget-management.md) | Trim at 75 percent; what to cut vs protect; compress before dropping; recency ordering |
| 07 | [07-mcp-integrations.md](07-mcp-integrations.md) | MCP servers for richer context: Context7, Chrome DevTools, PostgreSQL, Filesystem, GitHub |
| 08 | [08-confusion-and-planning.md](08-confusion-and-planning.md) | Surfacing conflicts and missing requirements; the inline planning pattern |
| 09 | [09-anti-patterns-and-verification.md](09-anti-patterns-and-verification.md) | The skill's failure taxonomy (7 anti-patterns, 4 rationalizations, 6 red flags) and verification checklist |

## Research summary

- Results collected: 168 (top 6 per query, deduplicated across subtopics)
- Weight split: 31 high (weight >= 0.5) / 137 low (weight < 0.5, labeled weakly backed in docs)
- jev requests: 14 (1 outline score validation + 13 noul weighting batches), usage 17262 input / 3386 output tokens
- Model: typesafe/jev-1.13 via https://api.defapi.org/api/v1/decisions (weighting direct; no relay needed, zero 429s)
- Redos: 5 (subtopics 01, 04, 07, 08 redone once; subtopic 05 redone twice after 0 high-weight results)
- Skipped docs: none. Subtopic 09 is an internal-record subtopic with no dig by design (sourced entirely from the SKILL.md).
- Research-db: [research-db/](research-db/) (preflight, outline, archive, digs, jev-log, db.ts)

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator-run, agent probe skipped for speed); DefAPI api.defapi.org/api/v1/decisions (typesafe/jev-1.13) 200 across all 14 requests.
