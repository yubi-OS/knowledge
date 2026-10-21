# 04-falsification-gates-and-empirical-results

**Scope.** Pre-registered gates, measured empirical numbers, and verification verdicts. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-walk-leg-verdict-2026-10-17.md, no external web dig

## Pre-registration as the organising principle

The ground source states that each of the three build lines was pre-registered before measurement. This doc collects every gate, every measured number, and every verdict across the record in one place.

## Validation gate

| Check | Requirement | Result |
|---|---|---|
| Router mask path reproduces live values | 5 live values (d_w and D on gold renders) | Reproduced to 4e-7 |

## Item 1 gates (frozen rules)

| Rule | What it asserted | Measured | Verdict |
|---|---|---|---|
| D3 (regime) | Hierarchy positives fall in D range [1, 1.45) | Depth-6 gasket D from 1.559 to 1.601 | FAILED |
| D1 (direction) | Positives and negatives separate on d_w in the assumed direction | Smallest positive d_w 2.044 (L 384); largest negative 4.645 (uniform random, seed 8); margin -2.60 | FAILED |

Under policy v23: all 10 uniform-random seeds selected hierarchy-spectral (median d_w 2.93 versus 2.04 to 2.36 for the gasket); the hexagonal variant also selected it; the jittered gasket was blocked by the 300-droplet floor at 267 to 284 traced components.

Artifact count: 26 (gasket positives at L 320, 352, 384; uniform random, hexagonal, jittered-gasket negatives over 10 seeds; tri and depth-5 references).

## Policy v24 live checks

| Check | Result |
|---|---|
| Health policy_version | 24 |
| Router selftest | All 24 checks pass |
| Band table | No hierarchy-spectral entry |
| Movement | 11 uniform-random negatives from hierarchy-spectral (lane-draft) to ordered-image (lane-classify); 0 gasket positives move; 6 gold calibration artifacts keep their bands |

## Item 2 gates

The frozen rule has three parts: sign readings (gasket versus each random seed), a hexagonal control (expected d_w 2.0 plus or minus 0.15), and a saturation check (random median gap within a limit of 0.10, with per-seed agreement).

| Line | N | Gasket vs random | Hex control | Saturation | Verdict |
|---|---|---|---|---|---|
| 2 | 366 | Below every seed, median gap -0.541 | 2.995 (fail) | Fail | UNINTERPRETABLE |
| 2 | 1095 | Below every seed, median gap -0.146 | 2.373 (fail) | Fail | UNINTERPRETABLE |
| 2b | 3282 | Above 10 of 10, gap +0.109; gasket 2.371, random median 2.263 | 2.143 (pass by 0.007) | Fail: gap 0.108 vs 0.10; 4 of 10 seeds within limit | UNINTERPRETABLE |

Per-seed notes at N = 3282: walk seed 7 fails the control; walk seed 1 passes everything.

## Reading the control numbers

The hexagonal control converges toward 2.0 as N grows: 2.995, then 2.373, then 2.143. Its error shrinks from 0.995 to 0.373 to 0.143, entering the 0.15 tolerance only at the largest size. This is the signature of a pre-asymptotic estimator. The gasket-minus-random gap moves in parallel (-0.541, -0.146, +0.109), so the sign reading is not stable across N.

## Item 3 measurements

| Measure | Value |
|---|---|
| Mirror lines found in KV, in order | 518 of 518 |
| Lines replaced or removed | 0 |
| KV-only lines | 78, in 3 blocks |
| Asserted replacements for item 1 | 3 |
| Propagation verification | Matched on check 3, checks 20 s apart |
| Content errors reported | 6 (including 25 em dashes on 21 lines) |

## The unmet measurement

One quantity was never measured: the router's own d_w, the 64-walker walk on the mask grid. Both item-2 lines used the 4096-walker walk on the points path. Any future gate on the router clause has to measure that estimator, not the points-path one.

## What a revisit would require

The record specifies the conditions under which the walk leg could be re-opened: a larger N, a saturation-insensitive estimator or a return-probability dimension, and a new pre-registration. None is scheduled. Until then, every walk reading is diagnostic and cannot move a routing decision.

## Verdict summary

- Item 1: both frozen rules failed; band deleted; v24 promoted and verified live.
- Item 2: UNINTERPRETABLE at all three sizes under the frozen rule; walk leg demoted to diagnostic.
- Item 3: KV canonical confirmed, mirror lossless to sync, router edits applied and verified, six errors reported.
