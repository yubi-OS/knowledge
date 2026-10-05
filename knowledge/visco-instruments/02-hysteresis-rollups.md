# 02 Hysteresis rollups

Scope: the `/visco/hysteresis` route: closing supersedes chains in an outcomes ledger and rolling up sum/mean absolute predicted-minus-realized error per round, including the correct empty-ledger shape.

## What the route does

`GET /visco/hysteresis?baseline_id=N` walks the supersedes chains in the outcomes ledger, closes each chain, and returns per-round rollups of the absolute difference between predicted and realized outcomes: sum and mean of `|predicted - realized|` per round [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md]. The route is one of four bearer-auth instrument routes shipped under `/api/jev/corpus/visco/*` on 2026-10-03 [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

The empty-ledger case is a defined shape, not an error: requesting a baseline id that has no chains, for example `baseline_id=999999`, returns `{loops:[], verdict:"no_data"}` [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md]. A rollup endpoint that silently returns a zero-filled summary would be lying about a ledger it never read; the `no_data` verdict makes absence observable.

## The calibration case: 102.9 dBc-units dissipated

The rollup is calibrated against the recorded round-3 history. From the recorded round: the lens expected +9.79 to +11.50 per candidate, while the realized per-cycle deltas summed to +0.65; the sum of `|predicted - realized|` across 10 cycles is 102.9 dBc-units, a mean of 10.29 per cycle [source: internal replay record, https://raw.githubusercontent.com/yubi-OS/knowledge/main/knowledge/linear-viscoelasticity/08-creep-recovery-replay.md]. The replay identified exactly this quantity as the dissipation metric the outcomes ledger was designed to catch [source: internal replay record, https://raw.githubusercontent.com/yubi-OS/knowledge/main/knowledge/linear-viscoelasticity/08-creep-recovery-replay.md].

The build lane verified the anchor end to end: the Python lane reproduced the 102.86 hysteresis anchor exactly in its selftest, and the JavaScript port passed 9/9 fixture parity on its first run against the same fixtures [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

## The borrowed physics

The name is literal. In viscoelastic materials the loading and unloading stress-strain curves do not coincide; the energy absorbed during one loading-unloading cycle is given by the area within the hysteresis loop, and the shape of the loop depends on the rates of loading and unloading [source: https://www.doitpoms.ac.uk/tlplib/bioelasticity/viscoelasticity-hysteresis.php, jev weight 0.7328]. The same teaching material notes that in the elastic regime the strain is recoverable while the curve is not the same for loading and unloading [source: https://eng.libretexts.org/Bookshelves/Materials_Science/TLP_Library_I/23%3A_Elasticity_in_Biological_Materials/23.7%3A_Viscoelasticity_and_Hysteresis, jev weight 0.6731]. Under cyclic loading and unloading, viscoelastic materials exhibit hysteresis as a phase lag that leads to dissipation of mechanical energy [source: https://www.sciencedirect.com/science/article/pii/S1468121809000376, jev weight 0.8429].

The corpus-audit mapping is: predicted deltas are the loading branch, realized deltas are the unloading branch, and the rolled-up absolute error per cycle is the loop area. A round whose predictions match realizations has a small loop; a round that predicted an order of magnitude more improvement than it delivered dissipates the difference as rollup error, which is precisely what the 102.9 dBc-units calibration case measures.

## Why sum and mean absolute error

The rollup uses sum and mean of absolute error rather than signed error. Cumulative absolute forecast error (CAFE) was proposed in the production-planning literature specifically to evaluate forecasting methods in terms of total cost, capturing not only forecasting errors but their cumulative effect [source: https://www.sciencedirect.com/science/article/pii/S0360835218300883, jev weight 0.9202]. Absolute error is sign-symmetric, so over-optimism and over-pessimism accumulate identically, which is the property a dissipation metric needs. The instrument reports both sum and mean per round so a caller can see both the total dissipated across a chain and the per-cycle rate.

## Chain closing

The supersedes chain is the ledger's unit of accounting: each outcome supersedes an earlier prediction, and the chain must be closed before per-round rollups are meaningful. The route performs that closing internally rather than requiring callers to pre-resolve chains [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md]. Combined with the `no_data` verdict for unknown baseline ids, the contract is: a caller either receives a closed-chain rollup or an explicit statement that there is nothing to roll up.
