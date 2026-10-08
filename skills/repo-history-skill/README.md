# repo-history-skill Knowledge Corpus

Knowledge corpus explicating the yubiOS skill `repo-history-skill`: the refreshable deep-archival routine that builds a joined git + Linear corpus of repo history, fits a hyper-sphere RSI curve on it, runs a bounded recursive-self-improvement loop on the archive itself, and accepts a deep-research topic per cycle.

Ground source: `yubi-OS/yubiOS skills/repo-history-skill/SKILL.md` (55804 bytes). The corpus explicates the skill; the SKILL.md remains the primary source of record.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-two-substrates.md | The five sub-corpora (4 git + 1 Linear), field sets, fetch traps |
| 02 | 02-cross-corpus-join.md | The 3 join keys and the 4 join anti-patterns |
| 03 | 03-primitive-basis-detection.md | The 9-D primitive basis, regexes, near-constant filter, cycle 0/1 measurements (internal-record, no dig) |
| 04 | 04-hypersphere-lift.md | PCA top-2, stereographic projection, Moebius reparameterization and its measured collapse |
| 05 | 05-sparse-cell-partition.md | Equal-area S2 partition, cKDTree sparse-cell detection, granularity rule |
| 06 | 06-rsi-loop-fixpoint.md | The bounded RSI loop, cycle cap 3, fixpoint rule, Mode D atom (internal-record, no dig) |
| 07 | 07-operating-modes-deep-research.md | Modes A-D, incremental refresh with 7-day cache TTL, deep-research hook (internal-record, no dig) |
| 08 | 08-verification-gates-scale.md | Fit-quality gates, red flags, scale table, GitHub/Linear rate-limit guards |

## Research summary

- Results collected: 60 (10 searXNG queries across 5 web-shaped subtopics; top 6 kept per query)
- Weight split: 31 high (>= 0.5) / 29 low (< 0.5)
- jev requests: 6 (1 outline score validation + 5 noul weighting batches), usage 6747/1224 tokens (input/output)
- Redo counts: 0 (all digs returned 44 to 54 raw results on first attempt)
- Skipped docs: none; subtopics 03, 06, 07 are internal-record subtopics and skip searXNG by design, citing the source doc only
- Weighting endpoint: DefAPI direct POST https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13, batches of 12, 0 failed requests

Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator-side; 10 agent digs 44-54 results); DefAPI direct /api/v1/decisions (jev-1.13) 200.

## research-db

Schema v2: `preflight.json`, `outline.json`, `archive.json` (60 entries, every weight non-null), `digs/<NN>-<slug>.json` (8 files), `jev-log.json` (6 entries), `db.ts` (TypeScript interfaces).
