# repo-refs-skill Knowledge Corpus

Minted from the ground source yubi-OS/yubiOS skills/repo-refs-skill/SKILL.md (45,767 bytes, fetched 2026-10-08). The corpus explicates the skill: a refreshable deep-archival routine for a repo's refs/ directory that enumerates every refs/*.md, fits a hyper-sphere RSI curve on 9-D primitive coverage, runs the bounded recursive-self-improvement loop on the archive, and dispatches parallel deep-research subagents per cycle to fill sparse cells.

## Index

| Doc | Scope |
|---|---|
| 01-when-to-use-routing.md | Triggers, when NOT to use, sibling-skill routing map (internal-record, no dig) |
| 02-substrate-refs-api.md | The refs/*.md substrate over the GitHub Contents API: listing, pagination, per-file fetch, naming, rate budget |
| 03-nine-d-primitive-basis.md | The 9 binary primitives, detection regexes, cycle-0 validation, near-constant filter |
| 05-refreshable-incremental-cache.md | Incremental --since refresh, session cache, 7-day TTL, refresh cadence |
| 06-deep-research-hook.md | The 3-stream parallel subagent intake and write-through push to refs/ |
| 07-operating-modes-granularity.md | Modes A through D, the granularity rule, scale from 100 to 100k files |
| 08-anti-patterns-red-flags.md | 10 anti-patterns, 9 red flags, 17-item verification checklist (internal-record, no dig) |
| 09-skill-interaction-assumptions.md | Interaction map, the 10 key assumptions, lifecycle and output shape (internal-record, no dig) |

Doc 04 (five-stage-pipeline) was dropped at outline validation: the jev score metric returned 0.20 with probability 0.87 on "padding: drop". Its load-bearing content (sparse-cell detection, the fit gates, the atom dispatch) is covered inside docs 03, 07, and 08.

## Research summary

- Results collected: 60 (top 6 per query, 10 queries over 5 web-shaped subtopics; 2 queries per subtopic). The 3 internal-record subtopics cite the source doc only and ran no dig.
- Weight split: 1 result at weight >= 0.5, 59 below 0.5. The single authoritative result is the GitHub Contents API reference (0.62). All sub-0.5 citations are labeled weak in the doc text.
- jev: 11 requests total (1 outline score request, 10 noul weighting requests in 2 passes of 5 batches of 12), model typesafe/jev-1.13 via DefAPI direct. Usage: outline 1,450 in / 139 out; weighting pass 2 (canonical) 7,582 in / 1,220 out across 5 batches; weighting pass 1 (5 batches) recorded 1,479 in / 244 out for batch 1 before the execution-environment failure; the remaining batch usage was not captured.
- Weighting ran twice: pass 1 lost its full decision records to a sandbox persistence failure, so pass 2 (same 60 results, full answer objects captured) is the canonical weighted archive in research-db/archive.json.
- Redos: 0 dig redos (all 10 first-attempt queries returned 43 to 57 raw results). 0 skipped docs.
- Gaps: the 03-nine-d-primitive-basis and 07-operating-modes-granularity digs returned only weak external sources (all below 0.5); their docs carry the source doc as the grounding spine and label every dig citation weak.

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side; agent-side probe skipped for speed per the skills-variant brief); decide endpoint DefAPI direct (api.defapi.org/api/v1/decisions, model typesafe/jev-1.13) returned 200 on first request.
