# 04-3-walk-leg-and-the-delaunay-defect-t6-t7-t8-t9

**Scope.** 3. Walk leg and the Delaunay defect (T6, T7, T8, T9): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-integration-2026-10-16.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-integration-2026-10-16.md, no external web dig

## The defect

The ground source identifies the deployed Delaunay as `bowyerWatsonDelaunay` in bundle part `jev-spectral-centroid.js` (sha256 `bc9c04d8...`). The staged port (`work/tools/spectral-standard/jev-spectral-centroid.js`, sha256 `6fcc76ac...`) is the same code, differing only in a trailing newline and the `jev-lens-math.js` import path.

An independent check (`work/bench/mustedges.mjs`, run unchanged) on the clean 366-droplet gasket finds 1014 forced pairs (an open empty-circle interval exists) and 50 degenerate candidates.

| Graph | Edges | Forced edges missed | Edges outside forced plus degenerate |
|---|---|---|---|
| Deployed JS | 1031 | 8 | 0 |
| Recorded Python | 1025 | 14 | not stated |
| Canonical (exact) | 1039 | 0 | not stated |

A forced edge must appear in every valid Delaunay triangulation. Missing one is a correctness defect, not a tie-break choice.

## Consumers reached

- `jev-spectral.js` calls `bowyerWatsonDelaunay` at lines 45 and 166 (spectral walk in points mode, and the oracle).
- `jev-spectral-centroid.js` builds the graph at line 384 and exports `walkCentroidMode` at line 448.
- `jev-router.js` imports `walkCentroidMode` (line 41) and calls it at line 341 for the V4 pair-band `spectral.d_w` clause.
- `jev-corpus-routes.js` reaches all of these through `/api/jev/corpus/spectral/*` and `/api/jev/corpus/oracle`.
- `jev-lens.js` is NOT a consumer; it only mentions the sibling module in a comment.

## Gate table A1 to A6 (T6)

| Gate | Arm | Deployed graph | Canonical graph |
|---|---|---|---|
| A1 (band 0.05) | astig 0.1 | PASS, -0.001647 | FAIL, -0.051347 |
| A1 | astig 0.2 | PASS, -0.015675 | FAIL, -0.071193 |
| A1 | trefoil 1e-4 | PASS, +0.042440 | FAIL, +1.450679 |
| A1 | trefoil 1.5e-4 | PASS, +0.029286 | FAIL, +1.186312 |
| A1 | spherical 0.06 | reported, +0.081709 | reported, +2.801672 |
| A2 (ratio 1/3) | all five | FAIL: 0.495, 0.398, 0.959, 0.737, 1.071 | same (graph-free) |
| A3 (no drops) | all five | PASS, 0 dropped | PASS |
| A4 (walk anchor 2.7812 +/- 0.10) | clean | PASS, 2.765024 | FAIL, 2.897099 (diff 0.116) |
| A5 (D anchor 1.558937 +/- 1e-4) | clean | PASS | PASS |
| A6 (canonical agreement 0.01) | arm diffs | FAIL: 0.0497, 0.0555, 1.4082, 1.1570, 2.7200 | self-comparison |

The canonical clean d_w is 2.897099 (r2 0.98676); the deployed clean d_w is 2.765024; the record's 2.781185 sits between and matches neither. Astig 0.1 fails on the canonical graph by only 0.0013 (0.051347 against a 0.05 band).

## Trefoil diagnostic (T8, pre-declared)

For trefoil 1e-4, 60 canonical edges are absent from the recorded Python arm graph, with lengths 24.3 to 402.6 px (median 110.1). 58 of the 60 are forced; the other 2 sit beyond the top 30 and were not classified. The top 10 extra edges are 286 to 403 px and all forced.

| Removed | Edges | d_w | dD_w vs canonical clean |
|---|---|---|---|
| k = 0 | 1084 | 4.347779 | +1.450679 |
| k = 10 | 1074 | 3.575243 | +0.678143 |
| k = 30 | 1054 | 2.982225 | +0.085125 |
| k = 60 | 1024 | 2.792416 | -0.104683 |

Pre-declared rule: the jump is "carried by the long extra edges" if removing the top 10 reduces dD_w by at least 0.5 x 1.4507 = 0.7253. Observed reduction: 0.7725, about 53 percent. The reading holds. Caveat: the k = 60 row compares a recorded arm graph with a canonical clean graph, so its sign flip mixes two graphs.

## Walk hierarchy check (T7, pre-declared)

Sets: clean gasket; gasket jittered by uniform offsets in [-7.5, 7.5) per axis (seed 42); 366 uniform random points in [0, 512)^2 (seed 42). Walk W 4096, K 4, spread, seed 42.

| Set | Canonical d_w | r2 | E | Deployed d_w | r2 |
|---|---|---|---|---|---|
| clean | 2.897099 | 0.98676 | 1039 | 2.765024 | 0.99155 |
| jittered | 3.711553 | 0.96545 | 1082 | 3.327606 | 0.97327 |
| random | 3.825096 | 0.95654 | 1080 | 3.448428 | 0.96177 |

Rule: the reading survives only if d_w(a) - d_w(c) >= 0.15 and d_w(a) - d_w(b) > 0. Observed a - c = -0.928 and a - b = -0.814. The reading does not survive. The separation is large but its sign is opposite to the pre-declared assumption: the clean gasket has the lower walk exponent. The advisor does not reinterpret the verdict.

The jitter moves so far because the clean gasket's nearest-neighbour distance is 11.66 px (median and minimum, maximum 12.00), and jitter of up to about 10.6 px diagonally is comparable. Sets b and c have r2 below 0.98 and are flagged low confidence; N = 366 is above the record's N of about 300 (AM-6), so this run cannot establish saturation.
