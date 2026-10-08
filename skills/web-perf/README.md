# web-perf: Knowledge Corpus

Corpus minted from the yubiOS skill `yubi-OS/yubiOS skills/web-perf/SKILL.md` (9227 B fetched), whose topic is analyzing web performance using Chrome DevTools MCP: Core Web Vitals (LCP, INP, CLS), render-blocking resources, network dependency chains, layout shifts, caching issues, and accessibility gaps. The skill is the primary source of record; every doc below explicates and deepens it, citing the source doc for its claims and searXNG-dug web sources (jev-weighted) for the external mechanisms it references.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-mcp-setup.md](01-mcp-setup.md) | chrome-devtools-mcp installation, configuration flags, browser support boundary, telemetry, and the verify-tools-first gate |
| 02 | [02-trace-capture.md](02-trace-capture.md) | Phase 1 performance trace capture: navigate_page plus performance_start_trace(autoStop, reload) and trace troubleshooting |
| 03 | [03-cwv-thresholds.md](03-cwv-thresholds.md) | Core Web Vitals and lab metric thresholds (TTFB, FCP, LCP, INP, TBT, CLS, Speed Index) and their origin |
| 04 | [04-insight-analysis.md](04-insight-analysis.md) | Phase 2 insight analysis via performance_analyze_insight: insight catalog, naming drift, insightSetId discovery |
| 05 | [05-network-analysis.md](05-network-analysis.md) | Phase 3 network analysis: render-blocking resources, dependency chains, preloads, caching headers, payloads, preconnects |
| 07 | [07-codebase-analysis.md](07-codebase-analysis.md) | Phase 5 codebase analysis: framework and bundler detection, tree-shaking, unused JS/CSS, polyfills, compression and minification |
| 08 | [08-audit-reporting.md](08-audit-reporting.md) | Output format and prioritization guidelines; Lighthouse scoring mechanics and field-data framing |

## Research summary

- Results collected and weighted: 51 (26 high >= 0.5 / 25 low < 0.5).
- jev requests: 5 (1 outline score validation + 4 noul weighting batches), usage 6493 input / 1109 output tokens. Weighting ran through DefAPI direct (https://api.defapi.org/api/decisions, model typesafe/jev-1.13); the outline validation used the same endpoint.
- Redos: 7, one per subtopic dig. Attempt 1 queries returned heavily polluted result sets (browser download pages, dictionaries, unrelated sites); every subtopic was re-dug with sharper technical queries (see research-db/digs/ redo_log).
- Docs kept/skipped: 7 / 0 skipped. Subtopic 06 (accessibility snapshot) was dropped at outline validation with score 0.21 (80% probability of "padding: drop"); no doc failed at the dig stage.
- Research DB: schema v2 under [research-db/](research-db/): preflight.json, outline.json, archive.json (51 weighted entries), digs/ (7 per-subtopic dig records), jev-log.json, db.ts.

## Preflight

Preflight 2026-10-06: campaign preflight healthy (orchestrator-side, searXNG + decide); agent-side probe skipped for speed per the skills-variant brief. DefAPI direct weighting measured zero 429s across 4 batches.

## Gaps

None. All 7 kept subtopics dug and authored. The dropped subtopic 06 (accessibility snapshot) is recorded in outline.json with its full validation answer.
