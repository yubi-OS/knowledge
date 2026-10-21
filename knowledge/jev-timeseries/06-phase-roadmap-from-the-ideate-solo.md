# 06. Phase roadmap from the ideate-solo

**Scope:** Phase roadmap (from the ideate-solo): detailed analysis grounded in yubi-OS/yubiOS refs/jev-timeseries-2026-10-08.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/jev-timeseries-2026-10-08.md, no external web dig

## Where the roadmap comes from

The jev-timeseries build began as an ideate-solo run. The directive asked to explore TimesFM and related time-series prediction work, source the main papers, and find where /jev/ could incorporate storage and prediction, pointing at Workers Analytics Engine. The ideate-solo one-pager selected `jev-timeseries-mvp` as the winner with a score of 19/20, and "go on all" triggered the full build. Phase 1 is what shipped (docs 01 to 05). The one-pager also defined three later phases. The ground-source doc states plainly: none of them has started.

## Phase 1 (shipped): storage plus forecast MVP

For reference, Phase 1 is the baseline every later phase builds on:

- WAE storage tier, binding `TS`, dataset `jev`, 3-month retention, with D1 as the system of record.
- Damped-trend Holt ETS v1, no seasonality, phi 0.98, alpha and beta grid 0.05 to 0.95, 20% holdout.
- Three bearer-gated routes and a console card.
- Known weakness: G2 band under-coverage (84/100), with a recorded v2 fix.

## Phase 2: the self-forecast loop

**Definition.** The evolution cycle consumes its own forecasts. Each forecast and its later outcome are written as `{predicted, realized}` rows into the outcomes ledger.

**Why it matters.** The source identifies this row shape with "the visco hysteresis shape". The outcomes ledger is the pre-registration instrument the rest of /jev/ already uses (append-only, enforced). Writing predicted-then-realized pairs turns every forecast into a scored prediction that cannot be quietly revised after the fact.

**Dependencies implied by Phase 1.**

- Forecasts need to be produced on a schedule rather than only on request.
- The realized value must be read back after the horizon has passed, which depends on the WAE read path and its seconds-scale propagation lag.
- G2 matters more here: if the band is systematically narrow, a self-forecast loop would record more misses than nominal coverage predicts. The v2 train-only residual_sd fix is a natural precondition.

## Phase 3: TimesFM 2.5 offline on the box

**Definition.** Run TimesFM 2.5 (Apache 2.0) offline on the box via the shell bridge, for long-horizon and quantile forecasts.

**Why offline.** The in-worker forecaster is deliberately small so it can be ported byte-for-byte between Python and JavaScript (G5 parity). A 200M-parameter foundation model with a 16k context and a quantile head, as recorded in the TSFM landscape corpus (yubi-OS/knowledge PR #334), does not fit that pattern. Running it off-worker keeps the worker lightweight and keeps the ETS path as the always-available baseline.

**What it adds.**

| Capability | ETS v1 | TimesFM 2.5 (planned) |
|---|---|---|
| Horizon | Short, step-scaled band | Long horizon |
| Uncertainty | Gaussian-style band from residual_sd | Quantile forecasts |
| Seasonality | None | Not limited to the v1 no-seasonality form |
| Runtime | In-worker | Offline on the box |

**Open questions the source leaves.** How results return to /jev/, how they are cached, and how they are scored against ETS are not specified. Phase 2's predicted/realized ledger would be the natural arbiter between the two forecasters.

## Phase 4: forecast-gated cron budget

**Definition.** A cron budget gated by forecasts.

**Interpretation within the record.** /jev/ runs scheduled work (the deploy records mention cron schedules that must stay intact), and the orchestrator is built around fail-closed gates. A forecast-gated budget would let predicted load or activity decide how much scheduled work runs. This is the phase where forecast quality becomes operationally load-bearing, which is why the G2 honesty in Phase 1 is important: a narrow band would make the gate overconfident.

## Sequencing logic

The phases form a dependency chain:

1. Phase 1 produces forecasts and stores trajectories.
2. Phase 2 scores forecasts against reality in an append-only ledger.
3. Phase 3 adds a stronger forecaster that Phase 2 can score against the baseline.
4. Phase 4 only spends real budget on forecasts after Phases 2 and 3 have measured their reliability.

## Status

Phase 1 shipped and is live on etag `f2313fa6`. Phases 2, 3, and 4 are recorded intentions with no work started. The v2 forecaster bump (train-only residual_sd) is the one concrete, pre-identified change, and it is logically upstream of Phase 2 and Phase 4.
