# jev-corpus knowledge corpus

A knowledge corpus explicating the yubiOS skill `jev-corpus`: running the yubiOS corpus-math engine on the steady-orbit worker, including null-standardized corpus audit (V2 + curveball null, z, dBc), lens candidates, atom plans, tautology classification, drift, and placements via `/api/jev/corpus/*`. Ground source: yubi-OS/yubiOS `skills/jev-corpus/SKILL.md` (the primary source of record; every doc's grounding spine).

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-engine-architecture-parity.md | Deterministic JS on the steady-orbit worker, fixture parity vs the Python sources of record, the selftest gate |
| 02 | 02-audit-null-standardization.md | /audit: V2 share, curveball null, z, dBc, verdicts, idempotency, Decision-B multipass |
| 03 | 03-lens-atom-planning.md | Lens format candidates, real vs control pairs, atom DRY-RUN plans, expected_delta as geometry, the skip-list |
| 04 | 04-sign-gate-level-dbc.md | level_dbc = 20*log10(\|z\|) gate convention vs the audit dbc field, the sign gate, the bearing reading, nulls 400 |
| 06 | 06-scorer-v2-hysteresis.md | Structured-evidence scorer v2: pinned regex extraction, one batched request, threshold jitter, v2.1 hysteresis |
| 07 | 07-taste-instrument-edge-standard.md | Taste instrument axes (box-counting D, mirror symmetry, scale coherence), clef scoring, edge-standard-v1 |
| 08 | 08-rsi-chain-runbook.md | Audit-lens-edit-reaudit cycles, outcomes ledger pre-registration and supersedes, taskcheck gates, unit-round protocol |
| 09 | 09-operations-integration-errors.md | Auth and User-Agent, automation builtins purity, evolution integration, classify/placements, error codes, selftest discipline |

## Research summary

- Results collected: 87, all jev-weighted (noul, DefAPI direct, typesafe/jev-1.13, canonical template).
- Weight split: 46 high (>= 0.5) / 41 low (< 0.5).
- jev requests: 19 recorded (1 outline score validation, 18 noul weighting batches of 15), usage 31452 input / 5113 output tokens.
- Digs: 14 web-shaped queries across 7 subtopics (2 per subtopic); subtopic 09 is an internal-record subtopic, no dig.
- Redos: 7 (one dig redo per web-shaped subtopic, 14 new queries total, after the first-pass queries hit lexical keyword collisions), plus 1 weighting recalibration pass (the pool was re-weighted with the parent brief's canonical noul template after a domain-qualified instruction variant depressed the weight scale).
- Skipped docs: none after the outline. Subtopic 05 (viscoelastic instruments) was dropped at outline validation with score 0.42 against the drop/marginal/load-bearing criteria (padding-leaning); its content remains cited in docs 04, 06, and 08 where the runbook depends on it.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide via DefAPI direct (typesafe/jev-1.13) 200. All 14 dig queries returned 44-76 raw results each; no unresponsive engines reported.
