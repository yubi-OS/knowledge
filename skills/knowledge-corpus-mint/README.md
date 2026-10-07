# knowledge-corpus-mint (skills ground source)

Knowledge corpus explicating the yubiOS skill **knowledge-corpus-mint** (ground source: yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md, 19349 B fetched 2026-10-07): minting brand-new knowledge corpora from an input request, with a jev-validated outline, searXNG digs with per-result quality weighting, parallel author subagents, and landing in yubi-OS/knowledge with a typed research DB.

## Docs

| NN | doc | scope |
| --- | --- | --- |
| 01 | 01-routing-when-to-use.md | When to mint vs route to refs-refresh-sweep, repo-refs-skill, curve-guided-rsi, or parallel-deep-research. |
| 02 | 02-pipeline-phases.md | The 8-phase pipeline end to end and the dependencies between phases. |
| 03 | 03-endpoint-preflight.md | The three backing endpoints and the Phase 0 health gate, probes, and failure modes. |
| 04 | 04-outline-jev-validation.md | Phase 1: ref derivation, decomposition by the domain's joints, score-metric validation with drop-0 semantics. |
| 05 | 05-dig-and-weighting.md | Phase 2: searXNG dig mechanics, top-6 keeping, noul weighting, and the decide-failure-means-REDO rule. |
| 06 | 06-research-db-schema.md | Research-db schema v2, the six files, and the plain-UTF-8 (never base64) rule. |
| 07 | 07-author-fanout-contract.md | Phase 4: subagent fan-out, the authoring contract, and orchestrator-owned commits. |
| 08 | 08-git-data-api-landing.md | Phase 5: the Git Data API landing chain and the two post-push verification checks. |
| 09 | 09-anti-patterns-history.md | Anti-patterns, red flags, and the incident history behind them (PRs #12, #16, #21, wave-27). |
| 10 | 10-merge-and-report.md | Phase 6-7: merge via /merges, the draft:false no-op gotcha, and the final report shape. |

Docs 01, 02, 06, and 09 are internal-record subtopics grounded in the source doc only (no dig, no fabricated world claims).

## Research summary

- Results collected: 72 (12 searXNG queries x top 6), all 72 weighted (37 high >= 0.5, 35 low < 0.5), zero null weights.
- Jev requests: 7 total (1 outline score validation with 10 questions, 6 noul weighting batches of 12), usage 8597 input / 1474 output tokens, total cost about 0.00072 USD.
- Redos: 0 (no dig redo, no decide failure).
- Skipped docs: 0. Gaps: none.
- Weighting endpoint: DefAPI direct (https://api.defapi.org/api/v1/decisions), model typesafe/jev-1.13-20260917; worker relay not needed (no 403/429).

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator probe); /api/decide (clef) 200.

## Research DB

research-db/ carries preflight.json, outline.json, archive.json (72 entries), digs/ (10 records, one per doc), jev-log.json (7 requests), and db.ts (typed interfaces). Plain UTF-8 JSON only.
