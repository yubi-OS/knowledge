# endpoints - yubiOS Endpoint Surface Knowledge Corpus

Ground source: yubi-OS/yubiOS docs/ENDPOINTS.md (the steady-orbit endpoint reference, fetched 2026-10-06, 83159 bytes). This corpus explicates and deepens the doc; the doc itself remains the primary source of record.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-lane-assembly-methodology.md | How the five lanes (A-E) plus the R1/R2/R3 refresh assembled the reference, with the reconciliation arithmetic (121 rows, 109 paths, 85 assigned). |
| 02 | 02-capability-map-domains.md | The 13 capability domains, dagger placement, and the bearer/none auth model. |
| 03 | 03-jev-orchestrator-endpoints.md | The /api/jev task lifecycle, approvals, pause, summary, learnings and promote routes with terminal states and gate invariants. |
| 04 | 04-automations-evolution-endpoints.md | Automations stage pipelines and the evolution sweep/directive/cycle/atom/candle/memory routes, cron dispatch and CAS firing. |
| 05 | 05-corpus-taste-visco-endpoints.md | Corpus audit/lens/atom/classify/placements, the taste instrument, and the visco measurement gates. |
| 06 | 06-wayfinder-map-endpoints.md | The /api/map family on the frozen pointmap/0.2 frame, diagnostics, admission trials, stored maps and KV overflow. |
| 07 | 07-ingestion-outcomes-fits-endpoints.md | repo-items, chunked/v1 embedding, vector search, the append-only outcomes ledger, and the FIT legacy surface. |
| 08 | 08-public-relays-dig-proxy-endpoints.md | The CORS-open relays (tts, stt, contact, chat, decide, site-assistant, brain preview) and the searxng dig proxy. |
| 09 | 09-platform-surface-ops-console.md | Health, AGENT.md, llms.txt, the /jev console, v19 site routes, KV assets, and the scheduled entrypoint. |
| 10 | 10-documented-vs-code-verification.md | The Lane B/R3 cross-reference, the Lean verification map, CI jobs, cross-domain flows and the resource map. |

## Research summary

- Results collected: 96 (84 from the initial digs across 7 web-shaped subtopics, 2 queries each; 12 from the NN06 redo).
- Weight split: 11 high (>= 0.5), 85 low (< 0.5). Every result carries its weight in research-db/archive.json.
- jev: 10 requests (1 outline score validation + 8 noul weighting batches + 1 redo-weighting batch) via DefAPI direct (https://api.defapi.org/api/v1/decisions, typesafe/jev-1.13). Usage: 12014 input tokens, 1935 output tokens. Outline validation: all 10 subtopics kept, 0 dropped.
- Digs: 7 web-shaped subtopics dug (2 queries each, 14 queries); 3 subtopics (01, 02, 10) are internal-record subtopics and were not dug, per the docs-variant speed optimization; they cite the source doc.
- Redos: 1 (NN06 wayfinder-map-endpoints: attempt 1 returned 0 of 12 results above weight 0.5; redo attempt 2 with different queries still returned weak results, so the doc cites those as weak with the weight labels shown).
- Skipped docs: none.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide via DefAPI direct (typesafe/jev-1.13), agent-side probe skipped for speed per the docs-variant.

Source doc note: the ground source was fetched in full (83159 bytes) before outlining; no corpus claim contradicts it.
