# 04. JS port against the source of record (Node 24, sandbox)

**Scope:** 3. JS port against the source of record (Node 24, sandbox): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md, no external web dig

## Setup

The deployed JS modules were run unchanged over the full pinned matrix in Node 24 (work/bench/matrix_js.mjs). Python values come from the arrangement-response record.

## Results

| Arm | D (JS) | D (record) | dD (JS) | dD (record) | dD_w (JS) | dD_w (Python) | JS edges |
|---|---|---|---|---|---|---|---|
| clean | 1.5589 | 1.5589 | | | d_w 2.7650 | d_w 2.7812 | 1031 (Python 1025) |
| astig 0.1 | 1.5124 | 1.5124 | -0.0465 | -0.0465 | -0.0016 | -0.0528 | 1031 |
| astig 0.2 | 1.4493 | 1.4493 | -0.1097 | -0.1097 | -0.0157 | -0.0597 | 1031 |
| trefoil 1e-4 | 1.5108 | 1.5108 | -0.0481 | -0.0481 | +0.0424 | +0.0112 | 1031 |
| trefoil 1.5e-4 | 1.4909 | 1.4909 | -0.0681 | -0.0681 | +0.0293 | -0.0110 | 1032 |
| spherical 0.06 | 1.5327 | 1.5327 | -0.0262 | -0.0262 | +0.0817 | -0.0479 | 1039 |

## Finding 1: the D leg is implementation-invariant

Every arm matches the record to 4 decimals on D and dD. The source notes this is expected, since no Delaunay is involved in computing D.

## Finding 2: the walk leg is not

- Clean d_w differs by 0.016 (2.7650 vs 2.7812).
- Arm responses differ by up to 0.051 (astig 0.1: -0.0016 vs -0.0528).
- The sign flips for trefoil 1.5e-4 (+0.0293 vs -0.0110) and spherical 0.06 (+0.0817 vs -0.0479).
- The spherical arm exceeds the 0.05 band in JS (+0.0817) but not in Python (-0.0479).

## Finding 3: per-arm verdicts do not reproduce

The record's per-arm A1 verdicts show 2 marginal fails in Python. The JS port shows 0 fails on astig and 1 fail on spherical. The headline claim, "walk exponent nearly affine invariant, hierarchy signal more than 10 times larger", holds in magnitude: |dD_w| is at most 0.082 against a 0.66 gasket-vs-lattice separation, roughly 8 to 11 times. The per-arm pass or fail pattern does not hold.

## Finding 4: the edge sets differ

JS returns 1031 edges on the clean gasket; Python returns 1025. All 6 JS-only edges sit at degenerate corner configurations of the coarse gasket, for example (346,189)-(364,220), (214,106)-(190,147), and (298,106)-(316,137). Collinear and cocircular ties are resolved differently by the two implementations.

Note also the JS edge column: 1031 on most arms, 1032 on trefoil 1.5e-4, 1039 on spherical 0.06. The graph's edge count itself responds to the warp, which is one route by which the walk exponent moves.

## Conclusion at the time of the check

The walk leg cannot carry a stable pass or fail verdict until the tie-break is pinned. The D leg and the pixel arm can ship as planned.

## The addendum: from tie-break to correctness defect

After the build lanes returned, lane A2 found a defect beyond tie-breaking, confirmed by an independent check with no implementation in the loop (work/bench/mustedges.mjs):

- On the clean 366-droplet gasket, 1014 pairs have an open empty-circle interval, so every triangulation must contain them. 50 more pairs are degenerate candidates.
- The deployed JS graph (1031 edges) misses 8 of the 1014 forced edges. The recorded Python graph (1025) misses 14.
- Neither graph has an edge outside the forced set plus the degenerate candidates.

So both implementations were not just resolving ties differently; both were dropping edges that are not ties at all.

Lane A2's exact-integer Delaunay with Simulation of Simplicity returns 1039 edges, matching the Euler count and containing every forced edge. JS and Python outputs match on 33 of 33 sets, and walks agree to 0.0 between languages.

## A1 under the canonical graph

| Arm | dD_w, canonical |
|---|---|
| astig 0.1 | -0.0513 |
| astig 0.2 | -0.0712 |
| trefoil 1e-4 | +1.4507 |
| trefoil 1.5e-4 | +1.1863 |

A1 fails on all four gated arms in both languages. Clean canonical d_w is 2.8971 against the record's 2.7812. The record's reading ("walk exponent nearly affine invariant, trefoil passes") does not hold on a complete graph. The trefoil responses jump by more than an order of magnitude; the adoption record later attributed most of that to 10 long forced edges the old graph omitted.

## Consequence for every walk consumer

Every walk-leg consumer was running on an incomplete graph: the oracle centroid walk, the spectral walk in points mode, the router's d_w measurement and its pair-band clauses. The walk anchors and gates in the falsification record were computed on the same incomplete graphs. The fix changes d_w for every consumer, so it needed Jenny's decision and a re-anchor; nothing was deployed in this build.

## Lane A1 results relevant to the port

A1: 57 tests, 51 pass, 6 todo (the walk gap tests). D matches the record for every arm to about 1e-15; raster sha256 matches Python. Gate A2 fails on all five arms: the arrangement arm carries 40 to 107 percent of the pixel dD against a one-third gate. The deployed warpMask drops out-of-canvas ink silently, so gate A3 cannot see pixel-arm drops.
