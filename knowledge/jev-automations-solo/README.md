# jev-automations-solo

Knowledge corpus minted from yubi-OS/yubiOS `refs/jev-automations-solo-2026-09-30.md` (the ideate-solo framing log for the Jev Automations build: design variations for worker-hosted LLM automations on the steady-orbit worker, scoring, selection, and the finalist architecture decisions). Minted 2026-10-05.

## Corpus docs

| NN | slug | scope |
|---|---|---|
| 01 | automation-registry | Versioned automation templates in D1/KV, deploy as new-version-plus-activate, dispatch-stamped versions, and the config-drift critique |
| 02 | llama-model-routing | Per-stage model routing on Workers AI: 8b for classification, 70b for generation, cost accounting per task |
| 03 | json-mode-action-proposals | LLM-proposed actions as machine-readable JSON, structured-output reliability rates, and schema validation before execution |
| 04 | prompt-intake-console | The prompt console: prompts become gated tasks, untrusted-input separation, propose-then-validate |
| 05 | cron-scheduler-limits | Worker cron scheduling, the 30 second CPU limit, batch sizing, and chunked long-running research |
| 06 | llama-guard-safety-pass | llama-guard-3-8b outbound safety classification with advisory verdicts recorded as evidence, never authorizing |
| 07 | deterministic-gate-decision-layer | Keeping the deterministic gate and jev-1.13 while LLMs propose, draft, and flag |
| 08 | variation-generation-scoring | The ideate-solo method: lens-based variation generation, P/S/D/T scoring, drop threshold, stress-test |

## Research summary

- Results collected: 96 (8 subtopics, 2 searXNG queries each, top 6 per query kept)
- Weight split: 29 results with jev weight >= 0.5 (authoritative backing), 67 with weight < 0.5 (weak backing, labeled as such in the docs)
- Jev requests: 22 (1 preflight probe, 1 outline score validation, 20 noul weighting batches of 5), usage 17085 input tokens, 0 output tokens
- Redo counts: 0 (no dig required a redo; no /api/decide call required more than the retry on 429)
- Skipped docs: none. All 8 outline subtopics scored load-bearing (1.33 to 1.84 on the score metric) and all 8 digs produced enough material to author honestly.

## Preflight

Preflight 2026-10-05: searXNG probe healthy (5 results returned); /api/decide (clef) 200 with probe answer noul 0.9652.

## Files

- `README.md` - this index
- `01-automation-registry.md` ... `08-variation-generation-scoring.md` - the 8 corpus docs
- `research-db/` - preflight.json, outline.json, archive.json (96 weighted results), digs/ (8 per-subtopic dig records), jev-log.json (22 request records), db.ts (type map)
