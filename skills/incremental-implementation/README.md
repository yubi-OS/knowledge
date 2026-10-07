# skills/incremental-implementation - Knowledge Corpus

Knowledge corpus minted from the ground source `yubi-OS/yubiOS skills/incremental-implementation/SKILL.md`. Topic: delivering changes incrementally, decomposing multi-file features into ordered shippable steps rather than one large write. The corpus explicates and deepens the skill; the SKILL.md remains the primary source of record.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-increment-cycle.md](docs/01-increment-cycle.md) | The implement, test, verify, commit loop and why each slice must leave the system working and testable |
| 02 | [02-slicing-strategies.md](docs/02-slicing-strategies.md) | Vertical slices, contract-first slicing, and risk-first slicing |
| 03 | [03-simplicity-first.md](docs/03-simplicity-first.md) | Rule 0: simplest thing that could work, simplicity checks, no premature abstraction |
| 04 | [04-scope-discipline.md](docs/04-scope-discipline.md) | Rule 0.5: touch only what the task requires, noticed-but-not-touching |
| 05 | [05-keep-it-compilable.md](docs/05-keep-it-compilable.md) | Rules 1 and 2: one logical change per increment, never broken between slices |
| 06 | [06-feature-flags-and-safe-defaults.md](docs/06-feature-flags-and-safe-defaults.md) | Rules 3 and 4: flags for incomplete features, safe conservative defaults |
| 07 | [07-rollback-friendliness.md](docs/07-rollback-friendliness.md) | Rule 5: independently revertable increments and migrations with rollback |
| 08 | [08-agent-delegation-and-checklist.md](docs/08-agent-delegation-and-checklist.md) | Agent delegation, the increment checklist, verification, rationalizations, red flags (internal-record, no dig) |

## Research summary

- Results collected: 84 (kept top 6 per query, 2 queries per web-shaped subtopic, 7 web-shaped subtopics; subtopic 08 is internal-record with no dig)
- Weight split: 31 high (jev weight >= 0.5) / 53 low (< 0.5)
- Per doc (results kept / primary >= 0.5): 01 increment cycle 12/6, 02 slicing strategies 12/5, 03 simplicity first 12/3, 04 scope discipline 12/3, 05 keep it compilable 12/5, 06 feature flags and safe defaults 12/3, 07 rollback friendliness 12/6
- jev requests: 8 (1 outline score request + 7 noul weighting batches of 12), usage logged in research-db/jev-log.json
- Redos: 0 (all 14 dig queries returned results on the first attempt; all 84 weighting decisions returned noul on the first attempt)
- Skipped docs: none
- Gaps: none

## Research-db

Under `research-db/`: preflight.json, outline.json, archive.json (all 84 weighted results with full decision records), digs/ (one record per subtopic), jev-log.json (one entry per jev HTTP request), db.ts (TypeScript interfaces for every shape above).

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide via DefAPI direct (typesafe/jev-1.13) 200.
