# knowledge/visco-instruments

Knowledge corpus on **viscoelastic instruments as corpus-audit API surfaces: persistence-under-regrading, hysteresis rollups, Prony-series relaxation fits, and snapback detection exposed on a worker, with the build record of shipping them**. Minted 2026-10-05 from yubi-OS/yubiOS `refs/visco-instruments-2026-10-02.md`.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-persistence-under-regrading.md](01-persistence-under-regrading.md) | The `/visco/persistence` route: base and loaded matrix audits, persistence of flipped cells under caller-supplied independent re-graded rows, inter-pass scorer offset, and the test-retest / inter-annotator-agreement grounding. |
| 02 | [02-hysteresis-rollups.md](02-hysteresis-rollups.md) | The `/visco/hysteresis` route: closing supersedes chains, sum/mean absolute predicted-minus-realized error per round, the 102.9 dBc-units round-3 calibration case, the `no_data` empty-ledger shape, and the hysteresis-loop physics. |
| 03 | [03-prony-relaxation-fits.md](03-prony-relaxation-fits.md) | The `/visco/prony` route: deterministic tau grid + NNLS fitting with K <= 3 arms, time-basis selection, the honest r2 = 0.069 live fit, and why constrained identification is the right method family. |
| 04 | [04-snapback-detection.md](04-snapback-detection.md) | The `/visco/snapback` route: sign-inversion detection with recorded inversion runs `[[4],[6,7],[10]]`, advisory `gate_input` verdicts that never auto-action, and the structural-mechanics origin of the name. |
| 05 | [05-fixture-parity-instrument-system.md](05-fixture-parity-instrument-system.md) | `tools/visco-instruments/` as the system of record: verify_visco.py, generate_fixtures.py, CONTRACTS.md, JSON fixtures, and the never-re-derived, fixture-parity-tested JS port. |
| 06 | [06-parallel-build-lanes.md](06-parallel-build-lanes.md) | The Lane A/B/C/advisor build: 15/15 selftest, 9/9 parity on first run, live ledger schema discovery, and the 5 reconciled contract ambiguities including two runtime bugs. |
| 07 | [07-worker-deploy-modules-api.md](07-worker-deploy-modules-api.md) | The 37-part modules-API deploy: new `jev-visco-math.js` part, metadata rebuilt from live settings, 13 bindings and 2 cron schedules preserved, byte-identical entry module, etag-recorded. |
| 08 | [08-live-e2e-verification.md](08-live-e2e-verification.md) | Post-deploy verification: selftest with visco parity checks, fixture-exact snapback, honest low r2, empty-ledger shape, live persistence run, and the deployment-gates consumer contract. |
| 09 | [09-design-decisions-deferrals.md](09-design-decisions-deferrals.md) | The five jev-qualified decisions carried into v1 (0.83 / 0.88 / 0.82 / 0.89 / 0.97), the explicit out-of-scope list, and the R-collapses-to-1 deferral rationale. |
| 10 | [10-viscoelastic-foundations.md](10-viscoelastic-foundations.md) | The physics vocabulary: linear viscoelasticity, Boltzmann superposition, creep and recovery, stress relaxation, Prony series, hysteresis loops, and how each maps to a corpus-audit instrument. |

## Research summary

- Results collected: 144 (120 from the original 20-query dig, 24 from the redo dig of subtopics 05 and 08). Top 6 kept per query.
- Weight split: 56 results at jev weight >= 0.5 (authoritative backing), 88 results below 0.5 (weak backing; cited only when labeled as such in the docs). 0 results left unweighted.
- Jev requests: 32 total (1 preflight probe, 1 outline validation with 10 score questions, 26 noul weighting batches, 5 redo weighting batches), usage 24373 input tokens / 0 output tokens, model `clef` on `/api/decide`.
- Redo counts: 2 (subtopic 05 fixture-parity-instrument-system and subtopic 08 live-e2e-verification, one redo each with different queries after thin attempt-1 digs).
- Skipped docs: none. All 10 subtopics authored.
- Per-doc sources: every doc lists its sources inline with jev weights; internal build-record claims cite the primary source at https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md and the companion replay record at https://raw.githubusercontent.com/yubi-OS/knowledge/main/knowledge/linear-viscoelasticity/08-creep-recovery-replay.md.

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01 | 12 | 7 (2 off-topic hits excluded from citation) |
| 02 | 12 | 4 |
| 03 | 12 | 7 (1 off-topic hit excluded from citation) |
| 04 | 12 | 4 |
| 05 | 24 (after redo) | 5 (attempt 1: 2, of which 1 off-topic; attempt 2: 3) |
| 06 | 12 | 6 |
| 07 | 12 | 5 |
| 08 | 24 (after redo) | 3 |
| 09 | 12 | 6 |
| 10 | 12 | 9 |

## Research-db

`research-db/` holds the machine record (schema v2): `preflight.json`, `outline.json` (with the full jev validation answers), `archive.json` (all 144 weighted results with their complete decision records), `digs/<NN>-<slug>.json` (one dig record per subtopic with redo logs), `jev-log.json` (one entry per jev HTTP request), and `db.ts` (TypeScript interfaces).

Preflight 2026-10-05: searXNG healthy (probe queries returned 40 and 47 results; several upstream engines rate-limited, aggregate results unaffected); /api/decide (clef) 200.
