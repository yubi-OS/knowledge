# skills/taste-engine — knowledge corpus

Knowledge corpus explicating the yubiOS skill **Taste Engine** (ground source: `yubi-OS/yubiOS skills/taste-engine/SKILL.md`, 11,533 bytes, fetched 2026-10-08). Topic: running and extending the nature-based taste engine on the steady-orbit worker, the edge-standard-v1 standardized edge-map pipeline, and the validation discipline the instrument requires.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [instrument-design-doctrine](01-instrument-design-doctrine.md) | Three-stage design: deterministic extraction, one batched clef call with measured numbers, 0.45/0.55 hysteresis verdicts; no-composite-score doctrine; admitted:false default. |
| 02 | [score-route-contract](02-score-route-contract.md) | POST /taste/score: request/response shapes, image vs features paths, verdict rules, r2 low_confidence gate, family choice axis, order_seed position-bias control. |
| 03 | [batch-selftest-routes](03-batch-selftest-routes.md) | POST /taste/matrix paced fail-closed batching and GET /taste/selftest 13 checks with Python fixture parity at 4.4e-16. |
| 04 | [edge-standard-pipeline](04-edge-standard-pipeline.md) | Edge-standard-v1: ink-normalization threshold, 4-connected components, Moore outer-boundary tracing, pinned box-counting window, version-bump discipline. |
| 05 | [validation-discipline](05-validation-discipline.md) | Jitter tests, 21-point calibration sweeps, gold-set cross-validation (Viengkham and Spehar 2018), rayleigh-pattern admission protocol. |
| 06 | [falsification-corpus](06-falsification-corpus.md) | CI-guarded gen_v2.py anchors, the five deploy-lesson rules, the supersolid real-data record, and the v3 matched-extent control. |
| 07 | [deploy-lessons](07-deploy-lessons.md) | Six deploy lessons, each cost a fix cycle: clef 5012, decimal rendering, missing-import selftest gap, CF 10021 fixtures, live verification, jev/tasks method+url. |
| 08 | [adding-a-new-axis](08-adding-a-new-axis.md) | Axis-extension workflow: dictionary extension, fixture parity, jitter plus calibration, and the refs-recorded multi-class admission trial. |

## Research summary

- Results collected: 96 (16 searXNG queries, 2 per subtopic, top 6 per query kept)
- Weights: 96 weighted, 48 high (>= 0.5), 48 low (< 0.5)
- Jev requests: 9 (1 outline validation, 1 outline re-validation of t04 and t06, 7 noul weighting batches), usage 11,207 input / 1,914 output tokens
- Redos: 0 dig redos; 1 outline re-validation (t04 and t06 returned padding-majority on the first pass and were re-validated against the source doc's own dedicated sections, where both scored load-bearing)
- Skipped docs: none (8 of 8 authored)
- Gaps: none

## Research-db

Schema v2 under [research-db/](research-db/): preflight.json, outline.json, archive.json (96 entries, every entry weighted), jev-log.json (9 requests), db.ts (interfaces), digs/ (8 per-doc records).

## Preflight

Preflight 2026-10-06: campaign preflight healthy (orchestrator); jev-1.13 via DefAPI direct 200 (9 of 9 requests succeeded, zero retries needed).

The source doc remains the primary source of record; this corpus explicates it and cites it explicitly as "source doc" throughout.
