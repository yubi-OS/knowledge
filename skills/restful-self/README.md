# restful-self knowledge corpus

Minted 2026-10-08 from the ground source yubi-OS/yubiOS skills/restful-self/SKILL.md (13,900 B). Ground source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/restful-self/SKILL.md. The source doc is the primary source of record; every doc below cites it as "(source doc)" for its grounding spine, with jev-weighted web sources for the external mechanisms the skill references (deliberate rest, productivity theater, monotasking, journaling research, timeboxing, Pomodoro, metacognition, LLM introspection).

## Docs

| NN | file | scope |
|---|---|---|
| 01 | 01-why-restful-self-exists.md | The evidence-not-pause drift in the self-archaeology cadence and why a non-producing register is needed |
| 02 | 02-fire-signals.md | The 5 bounded trigger signals and the circuit-breaker analogy |
| 03 | 03-protocol-four-steps.md | The 4-step protocol: read once, observe the shape, sit, write only if writing is the rest |
| 04 | 04-anti-patterns.md | The 6 failure modes that disqualify a rest session |
| 05 | 05-exit-criteria.md | The 4 bounded exits, timeboxing grounding, and the stuck state |
| 06 | 06-self-recognition.md | Behavioral (not introspective) recognition checklists for mode state |
| 07 | 07-worked-examples.md | The 3 protocol walkthroughs explicated |
| 08 | 08-pair-with-skills.md | Pairings with self-archaeology, negative-skill-space, parallel-deep-research |
| 09 | 09-guidelines-and-red-flags.md | The 8 guidelines and the 8-item red-flag checklist |
| 10 | 10-provenance-and-coverage.md | Source lineage, build record, and the 2026-09-17 coverage-note corrections |

## Research summary

- Results collected: 72 across 12 searXNG queries (2 per web-shaped subtopic, 6 web-shaped subtopics; 4 subtopics were internal-record and dug none).
- Results archived and weighted: 45 (the other 27 were off-topic query noise, mostly dictionary homonyms and unrelated domains, dropped before weighting so the archive carries only judged results).
- Weight split: high (>= 0.5) 2 / low (< 0.5) 43. The rest-and-productivity domain is dominated by secondary and popular sources, which the jev noul metric reflects; every weak-backed claim in the docs is labeled as such in text.
- Highest-weighted sources: Harvard Health on monotasking (0.70), MDPI Behavioral Sciences on Pomodoro vs self-regulated breaks (0.61).
- jev requests: 5 successful (1 outline validation, 4 weighting batches of 9 to 12 questions) plus 1 failed validation request (400, retried with criteria arrays). Endpoint used: https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13 (DefAPI direct per the skills-variant brief). Usage: 6,879 input tokens / 957 output tokens across successful requests.
- Redos: 0. No subtopic's dig was thin enough to require a redo; every web-shaped subtopic kept 2 or more on-topic weighted results.
- Skipped docs: none. All 10 subtopics authored. Gaps: none.
- Preflight 2026-10-06: campaign preflight healthy (orchestrator-side); agent-side probe skipped per the skills-variant speed brief. searXNG: https://p01--n8n-service--mcx7zcrbvdyt.code.run/webhook/searxng; decide: https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13.

## research-db

Schema v2 under research-db/: preflight.json, outline.json, archive.json (45 weighted entries), digs/ (10 records, one per subtopic), jev-log.json (6 request records), db.ts (interfaces).
