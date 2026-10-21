# 03. Snapback corpus and results

**Scope:** 2. Snapback corpus + results: detailed analysis grounded in yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md, no external web dig

## Artifacts

Two files carry the snapback evidence: `snapback-corpus.json` (843 cases with seeds and pinned expected values) and `snapback-results.json` (852 per-case records plus gate verdicts).

## Corpus composition

The corpus is built from labeled classes, each with a predicted verdict:

| Class | Count | Meaning |
|---|---|---|
| A aligned-meaningful | 12 | Realized deltas agree in sign with predictions; continue |
| B aligned-negative | 4 | Aligned but negative-direction deltas |
| C inverted-halt | 10 | Inversions severe enough to halt the round |
| D isolated-inversion | 8 | Single isolated inversions |
| E zero-no-flip | 6 | Zero deltas; no flip |
| F recorded round-3 series | 1 | Source-of-record fixture from the repo |
| F2 clean-single-inversion | 1 | Fixture with one clean inversion |
| F3 prereg fallback | 1 | Retained synthetic fallback |
| G ledger-path | 4 | Cases served from the ledger rather than inline series |
| N noisy tiers | 4 x 200 = 800 | Seeded noise at p = 0.05, 0.10, 0.20, 0.30 |

Classes A through F3 sum to 43, matching the record's "43 pre-N cases", and 43 plus 800 noisy cases gives the 843-case corpus. The results file holds 852 records. The record does not itemize the extra 9, but the arithmetic is consistent with the 4 ledger-path cases plus the 5 duplicate posts used by the determinism gate (G5); that reconciliation is an inference from the stated counts, not a statement in the record.

## Generator parameters

- Deterministic LCG generators seeded with `0xC0FFEE ^ case_index` (the limitations section states it as `global_case_index`).
- Magnitudes drawn in [0.5, 5.5]; series length n at most 10.
- Generation order A, B, C, D, E, F, F2, F3, then N tier-major.
- Per-case SHA-256 of the canonical series recorded so that the corpus file and the runner can be checked for parity.

The SHA digests are what make reruns auditable: a regenerated corpus that differs by a single point produces a different digest, so drift between the generator and the runner is detectable rather than silent.

## Gate results

| Gate | Definition | Result |
|---|---|---|
| G1 noiseless verdict | Classes A to F, 100% match | PASS 43/43; verdict AND `gate_input.action` match prediction everywhere |
| G2 exact runs | `inversion_runs` and `run_lengths` exact | PASS in every noiseless case and all ledger-path cycle labels |
| G3 noisy per-trial | Live verdict equals the independent pinned oracle, 100% | PASS 800/800 |
| G4 noisy-tier FPR | Within plus or minus 0.04 of analytic | PASS 4/4 tiers |
| G5 determinism | Duplicate posts identical, `run_id` excluded | PASS 5/5 |
| G6 shape and parity | Pinned fields present, `n_points` correct, `source` inline or ledger correct | PASS; 0 SHA mismatches, 0 generator-consistency mismatches |

## The G4 false-positive profile

| Noise p | Measured FPR | Analytic FPR | Absolute gap |
|---|---|---|---|
| 0.05 | 0.025 | 0.02138 | 0.004 |
| 0.10 | 0.060 | 0.08025 | 0.020 |
| 0.20 | 0.280 | 0.27334 | 0.007 |
| 0.30 | 0.475 | 0.50359 | 0.029 |

All four gaps sit inside the 0.04 window. The profile also shows something about the gate design rather than the endpoint: false halts rise steeply with noise, reaching roughly half of trials at p=0.30. G3 and G4 answer different questions. G3 asks whether the endpoint computes the right verdict on noisy input (it does, 800/800). G4 asks whether the halt rule's false-alarm rate matches theory (it does, within tolerance). A high FPR at p=0.30 is a property of the decision rule under heavy noise, not an endpoint defect.

## The headline anchor

Class F is the most important single case. The true recorded round-3 series, taken from `tools/visco-instruments/fixtures/visco-fixtures.json`, reproduced live exactly: runs `[[4],[6,7],[10]]`, run lengths `[1,2,1]`, verdict `snapback`, action `halt_round`. That matches the recorded end-to-end in `refs/visco-instruments-2026-10-02.md`. Before amendment 04:35Z, class F was a synthetic fallback; upgrading it to the real series turned the corpus from "consistent with the design" into "consistent with history".

## Rerun requirements

Any rerun must regenerate from the pinned seeds in the pinned order, 43 pre-N cases then 800 N cases tier-major. The 04:40Z amendment documents exactly what happens when the offset is wrong: the p=0.20 and p=0.30 tiers measured an unintended corpus, and those 400 calls had to be discarded and rerun.
