# browser-testing-with-devtools

Knowledge corpus explicating the yubiOS skill `browser-testing-with-devtools` (yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md): testing in real browsers via Chrome DevTools MCP, DOM inspection, console errors, network requests, performance profiling, and the visual verification discipline the skill teaches.

The source doc is the primary source of record; every doc below cites it as its grounding spine and adds searXNG-dig sources with jev-1.13 weighting for the external mechanisms the skill references.

## Corpus index

| Doc | Scope |
|---|---|
| [01-mcp-setup.md](01-mcp-setup.md) | Installing and configuring Chrome DevTools MCP: npx entry, the 3 profile modes, and the Sauna runtime translation |
| [02-tool-capabilities.md](02-tool-capabilities.md) | The 8 DevTools MCP capabilities and how they compose into verification loops |
| [03-profile-isolation.md](03-profile-isolation.md) | Blast radius of agent-attached browsers and the 4 profile-isolation rules |
| [04-untrusted-content.md](04-untrusted-content.md) | Browser content as untrusted data, the 4 data-handling rules, and the 5 JavaScript execution constraints |
| [05-ui-debugging-workflow.md](05-ui-debugging-workflow.md) | The 5-step UI bug workflow: reproduce, inspect, diagnose, fix, verify |
| [06-network-debugging.md](06-network-debugging.md) | The capture, analyze, diagnose, fix and verify network workflow with the status-code mapping |
| [07-performance-profiling.md](07-performance-profiling.md) | The baseline, identify, fix, measure performance loop (LCP, CLS, INP, long tasks) |
| [08-test-plans-screenshots.md](08-test-plans-screenshots.md) | Structured test plans for complex UI bugs and screenshot-based visual regression |
| [09-console-accessibility.md](09-console-accessibility.md) | Console analysis by level, the clean console standard, and the 5-check accessibility procedure |
| [10-rationalizations-verification.md](10-rationalizations-verification.md) | Rationalization table, 12 red flags, the 8-item verification checklist, and the RSI closure sections |

## Research summary

- Source doc: yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md, 21790 bytes, fetched 2026-10-06.
- Outline: 10 subtopics decomposed by the SKILL.md's own sections; jev score validation kept all 10 (lowest t10 at 0.58, kept because it is an internal-record subtopic grounded entirely in the source doc; next lowest t04 at 0.93).
- Results collected: 105 unique results over 18 searXNG queries (2 per web-shaped subtopic, top 6 per query, deduped per subtopic). Subtopic 10 is internal-record and was not dug.
- Weights: 15 high (>= 0.5), 90 low (< 0.5). Every cited claim carries its URL and jev weight; weak (< 0.5) backing is labeled in text.
- Jev requests: 11 total (1 outline validation with 10 questions, 3 pass-1 weighting batches superseded by the full-corpus pass, 7 full weighting batches of 15). Usage: 19195 input tokens, 2999 output tokens.
- Redos: 0 (no searXNG dig failed; no jev request failed after retry).
- Docs kept: 10. Docs skipped: 0.
- Gaps: the digs for subtopics 04 (untrusted content), 05 (UI workflow), 07 (performance), and 08 (test plans) returned no result at or above the 0.5 threshold; those docs are grounded in the source doc with weak dig corroboration, labeled in text. A future refresh should weight official sources (web.dev, Chrome for Developers, OWASP directly) for those subtopics.

## Method notes

- Weighting and outline validation ran through DefAPI direct (https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13) per the 2026-10-06 speed optimization; the steady-orbit relay was not needed.
- Post-push verification uses the Git blobs API rather than raw.githubusercontent per the same optimization.

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side; agent-side probe skipped for speed); /api/decide (typesafe/jev-1.13 via DefAPI direct) 200 on all 11 requests.
