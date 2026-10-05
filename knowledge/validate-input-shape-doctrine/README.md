# validate-input-shape-doctrine

Knowledge corpus on the validate-input-shape doctrine and CI gate: validating workflow input shapes before dispatch, the doctrine behind it, and how the gate catches malformed inputs before CI burns runners. Minted from yubi-OS/yubiOS refs/validate-input-shape-doctrine-2026-08-04.md on 2026-10-05.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-failure-mode-anatomy.md](docs/01-failure-mode-anatomy.md) | The five 2026-07-26 to 07-30 dispatch and contract failures and the implicit-contract meta-pattern |
| 02 | [02-doctrine-rules.md](docs/02-doctrine-rules.md) | The eight numbered doctrine rules |
| 03 | [03-workflow-dispatch-api-contract.md](docs/03-workflow-dispatch-api-contract.md) | The GitHub workflow_dispatch REST API contract, HTTP 422 semantics, input types, actionlint gaps |
| 04 | [04-gate-architecture.md](docs/04-gate-architecture.md) | The validate-input-shape composite action, validator design contract, findings schema, fixtures |
| 05 | [05-lex-sort-dropin-naming.md](docs/05-lex-sort-dropin-naming.md) | Lex-sort ordering semantics in drop-in directories and the fire-after naming convention |
| 06 | [06-tag-form-coverage.md](docs/06-tag-form-coverage.md) | Image tag form coverage as a cross-workflow contract |
| 07 | [07-dispatcher-payload-intersection.md](docs/07-dispatcher-payload-intersection.md) | Dispatcher payload intersection, audit echo, dynamic-input limits, runtime complement |
| 08 | [08-validator-testing-strategy.md](docs/08-validator-testing-strategy.md) | Fixtures, unit, integration, regression, and adversarial test layers |
| 09 | [09-phased-rollout.md](docs/09-phased-rollout.md) | Phased enforcement, branch protection, rollback design |

## Outline validation (jev score)

| NN | slug | score | verdict |
|---|---|---|---|
| 01 | failure-mode-anatomy | 1.17 | kept |
| 02 | doctrine-rules | 1.96 | kept |
| 03 | workflow-dispatch-api-contract | 1.69 | kept |
| 04 | gate-architecture | 1.93 | kept |
| 05 | lex-sort-dropin-naming | 0.86 | kept |
| 06 | tag-form-coverage | 1.35 | kept |
| 07 | dispatcher-payload-intersection | 1.77 | kept |
| 08 | validator-testing-strategy | 1.57 | kept |
| 09 | phased-rollout | 1.46 | kept |

All 9 subtopics scored 1 or above (no score-0 drop); 05 scored 0.86 (marginal) and was kept because its dig returned 4 primary man-page sources.

## Research summary

- Results collected: 94 unique results (deduplicated by URL) from 18 searXNG queries (2 per subtopic, top 6 kept per query, 40 to 62 raw results per query).
- Weight split: 34 high (weight >= 0.5) / 60 low (weight < 0.5) of 94.
- Jev requests: 21 total (16427 input tokens / 0 output tokens): 1 probe, 1 outline validation (9 score questions), 19 weighting batches (5 noul questions each).
- Redos: 0. Every jev /api/decide call succeeded on first attempt; no dig was thin enough to require a redo.
- Skipped docs: none. All 9 outline subtopics kept and authored.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Per-doc sources

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01 failure-mode-anatomy | 12 | 5 |
| 02 doctrine-rules | 8 | 2 |
| 03 workflow-dispatch-api-contract | 10 | 2 |
| 04 gate-architecture | 11 | 5 |
| 05 lex-sort-dropin-naming | 12 | 8 |
| 06 tag-form-coverage | 12 | 3 |
| 07 dispatcher-payload-intersection | 6 | 3 |
| 08 validator-testing-strategy | 12 | 3 |
| 09 phased-rollout | 11 | 3 |

## Research DB

Under `research-db/`: `preflight.json`, `outline.json`, `archive.json` (94 weighted entries), `jev-log.json`, `db.ts` (TypeScript interfaces mapping every file shape), and `digs/` (9 per-subtopic dig records).
