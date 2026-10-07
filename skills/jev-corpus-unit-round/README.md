# jev-corpus-unit-round knowledge corpus

Knowledge corpus explicating the yubiOS skill `skills/jev-corpus-unit-round/SKILL.md`: how one unit round of the jev-corpus RSI chain runs on the steady-orbit worker, from pin through frozen baseline check, one atomic change, hysteresis re-score, the level_dbc gate, taskcheck-gated commit or revert, snapback, rollups, and the round record on a draft PR.

Ground source: yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md (12,071 bytes, fetched 2026-10-06). The corpus explicates and deepens the skill; the skill file remains the source of record.

## Contents

| doc | scope |
|---|---|
| 01-setup-and-source-of-truth.md | AGENT.md as source of truth, required connections, User-Agent discipline, selftest gate, stop-don't-guess |
| 02-pin-and-matrix-scoring.md | Pin the SHA, fresh codeload pull, per-doc scoring at concurrency 12, resumable JSONL |
| 03-frozen-baseline-check.md | Audit at nulls 400 with the level_dbc gate, the frozen frame map, control family, lens, 3-phase fetch plan |
| 04-candidates-and-rung-joins.md | Skip-list from the ledger, ladder rungs, rung joins over create-isolate, lens demoted to detectability filter |
| 05-atomic-change-and-preregistration.md | One CHANGE or one ADD, content rules C5/C6/C7, outcomes pre-registration, preview one-name constraint |
| 06-hysteresis-and-gate-audit.md | Mandatory hysteresis re-score (0.45/0.55/pre_row), gate-grade audit at nulls 400, realized delta convention |
| 07-bearing-snapback-keep-revert.md | Direction reading, snapback series, keep rule, taskcheck C1-C7, Git Data API commit chain, revert verdicts |
| 08-realized-row-remap-rollups.md | Supersedes contract, realized row before remap, visco rollups, round record, draft PR and GraphQL merge path |
| 09-failure-lessons-and-examples.md | Nine rounds of harness lessons, worked change/add/revert examples, the six guidelines |

## Research summary

- Results collected: 84 (top 6 per query across 14 searXNG queries over 7 web-shaped subtopics; 2 internal-record subtopics skipped the dig by design).
- Weight split: 31 results at weight >= 0.5 (primary backing), 53 at weight < 0.5 (weak backing, labeled as such where cited).
- jev decisions: 8 requests total (1 outline validation with 9 score questions, 7 noul weighting batches of 12), via DefAPI direct (https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13).
- Redos: 0 dig redos, 0 weighting retries.
- Skipped docs: none. All 9 outline subtopics validated load-bearing (score 1.21 to 1.9, no score-0 drops) and all 9 were authored.

## Preflight

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide via DefAPI direct, api.defapi.org/api/v1/decisions, model typesafe/jev-1.13 (agent-side probe skipped for speed per the skills-variant brief).

## Research database

Under `research-db/`: `preflight.json`, `outline.json`, `archive.json` (84 entries, all weighted, none null), `digs/` (9 records, one per subtopic), `jev-log.json` (8 entries with usage tokens), and `db.ts` (TypeScript interfaces for every shape).
