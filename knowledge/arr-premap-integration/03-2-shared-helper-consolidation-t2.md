# 03-2-shared-helper-consolidation-t2

**Scope.** 2. Shared helper consolidation (T2): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-integration-2026-10-16.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-integration-2026-10-16.md, no external web dig

## Before consolidation

The ground source records that, before consolidation, there were three private raster copies: A1 `renderDisksFloat` in arrangement.js, B1 `renderDisksFloat` in premap.js, and B2 `renderDisksFloatInline` in the harness. There were also two forwardPoint and gasket copies (B1 `buildGasketSites` and `gasketTemplate`, and A1's forwardPoint), plus the staged JS genGasket. Each lane had built what it needed in isolation. The risk of duplicated renderers is silent drift: two copies can disagree by a pixel and every D measurement downstream inherits the difference.

## After consolidation

There is now one of each in `worker-candidates/shared/disks.js`. arrangement.js and premap.js import from it; the harness imports it. The B2 test import name `renderDisksFloatInline` is kept as an alias to the same function, so the B2 test file runs unchanged. That alias is a small but deliberate choice: the consolidation does not edit a lane's tests to make them pass.

## The parity check

Raster comparison uses `analysis/raster_parity.mjs` and `analysis/py_raster_hashes.py`, with sha256 over the canonical '1'/'0' rows (the `lens_standard.canonical_mask` convention).

| Set | n | Ink | Python hash prefix | A1, B1, B2, Shared | Pixel diffs |
|---|---|---|---|---|---|
| clean gasket | 366 | 10614 | bf3f7398... | all same | 0 |
| tri | 19 | 15143 | 6138abea... | all same | 0 |
| astig 0.1 | 366 | 10348 | d7bc75d0... | all same | 0 |
| astig 0.2 | 366 | 10295 | 7af8c432... | all same | 0 |
| trefoil 1e-4 | 366 | 10338 | b25c418c... | all same | 0 |
| trefoil 1.5e-4 | 366 | 10337 | 0a44ce55... | all same | 0 |
| spherical 0.06 | 366 | 10365 | 98c426e4... | all same | 0 |

Every row has 5 matching implementations (an independent Python run, three original JS copies, and the shared copy) and 0 pixel diffs.

## What the ink counts say

Ink is the number of set pixels. The clean gasket has 10614. Every warped arm has less ink, from 10295 (astig 0.2) to 10365 (spherical 0.06): arrangement warps that move disks closer together increase overlap, so the union covers fewer pixels. The tri set has only 19 disks but 15143 ink pixels, because the tri reference uses larger disks. These counts are a useful sanity check on the renderer independent of the hash.

## The five supporting checks

1. The Python hashes match A1's recorded `raster-hashes.json` on all seven sets.
2. A1's recorded astig 0.1 hash `d7bc75d0...` and trefoil 1e-4 hash `b25c418c...` match Python. The record names this as the specific check the SPEC asks for.
3. B1's raster matches A1's on the gasket and the tri (0 pixel diffs).
4. The warp disks from the candidate arrangement equal the original on all five arms.
5. forwardPoint: the A1 fixture (324 tuples, tolerance 1e-12) passes on the shared copy through the candidate suite.

## Suite counts after consolidation

| Suite | Pass |
|---|---|
| A1 | 51 |
| B1 | 120 |
| B2 stub | 70 |
| shared | 13 |
| integration and Amendment 1 | 23 |

The 23 integration and Amendment 1 passes are the 12 integration tests plus 11 Amendment 1 tests listed in the record's section 9 totals.

## Why hash parity, not tolerance parity

A raster is binary, so equality is the right criterion: either every pixel matches or it does not. Using sha256 over a canonical row encoding turns a 2D comparison into a single string comparison and makes the result auditable from the hash prefix alone. Tolerance-based parity (like the 1e-12 forwardPoint fixture) is used only where the quantity is continuous.

## Lane discrepancy resolved

This consolidation closes lane discrepancy 6 in the record ("Renderer copies: three raster copies and two gasket or forward copies"), resolved with one shared module, hash-identical on seven sets, zero pixel diffs. It also makes discrepancy 2 moot: A1 had reported that `trefoilBeta` was not exported, when it is exported at `jev-lens-math.js` line 302. With the formula held once in the shared copy, the question no longer matters.

## What consolidation does not change

No frozen value changes. The harness now uses the shared renderer, which the record lists among "non-amendment integration edits (no frozen value changed)". Because the shared renderer is hash-identical to every prior copy, swapping it in cannot alter any D measurement, and the parity table above is the proof.
