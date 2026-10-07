# knowledge-corpus-mint

Knowledge corpus minted from the ground source yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (19349 B, fetched 2026-10-07): how to mint a brand-new knowledge corpus from an input request, with a jev-validated outline, searXNG digs weighted per result, parallel author subagents, and a typed research DB.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-routing-and-scope.md | when to mint vs sibling skills (refs-refresh-sweep, curve-guided-rsi, parallel-deep-research, repo-refs-skill) and the anonymous-HTTP-only constraint |
| 02 | 02-endpoint-preflight-gate.md | the REQUIRED Phase 0 health gate on searXNG and decide, suspended engines, the after-close blind spot, STOP-not-degrade |
| 03 | 03-outline-decomposition-jev-validation.md | ref derivation, decomposition by the domain's joints, the ONE score-metric validation that drops padding |
| 04 | 04-searxng-dig-and-jev-weighting.md | 2 queries per doc, top 6 kept, noul weighting of every result, decide-failure = REDO never degrade |
| 05 | 05-author-fan-out-subagent-contract.md | one parallel subagent per doc, self-contained prompts, the authoring contract, orchestrator-owned writes |
| 06 | 06-research-db-schema-v2.md | preflight, outline, archive, digs, jev-log, db.ts: the typed DB that makes the corpus auditable |
| 07 | 07-git-data-api-push-and-verification.md | repo bootstrap seed, the one-chain utf-8 blob/tree/commit/ref/PR push, REQUIRED post-push verification |
| 08 | 08-merge-report-anti-patterns.md | merge via POST /merges, the single end-run report, and the accumulated anti-patterns and red flags |

Subtopics 01, 06, and 08 are internal-record subtopics: they are grounded in the source doc itself and no dig was run.

## Research summary

- Results collected: 60 (10 searXNG queries, top 6 kept each, 5 web-shaped subtopics)
- Weight split: high (>= 0.5) 13 / low (< 0.5) 47, 0 unweighted
- jev requests: 6 (1 outline score validation, 5 noul weighting batches of 12), usage 9801 input / 1224 output tokens, cost $0.000823
- Redos: 0 (all digs returned results on attempt 1; no decide failures)
- Skipped docs: none; gaps: none
- Preflight 2026-10-06: campaign preflight healthy (orchestrator): searXNG + decide; agent-side probe skipped per skills-variant speed optimization

Research DB under research-db/ (schema v2): preflight.json, outline.json, archive.json, digs/ (8 files), jev-log.json, db.ts.
