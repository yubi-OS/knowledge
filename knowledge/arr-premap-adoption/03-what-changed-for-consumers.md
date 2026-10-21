# 03. What changed for consumers

**Scope:** What changed for consumers: detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md, no external web dig

## Who consumes the walk graph

The walk graph feeds every walk-leg measurement on the worker. The feasibility record lists them: the oracle centroid walk, the spectral walk in points mode, the router's d_w measurement, and its pair-band clauses. The adoption record states what changed for the two consumers whose outputs operators read: the router and the oracle.

## Router

**Lane assignments did not change.** The six gold artifacts keep their lanes.

**The gasket's route path changed.** The gasket's d_w is now 2.04 (2.043963 in the gold table), below the 2.4 threshold on the hierarchy-confirmed band. It therefore routes through hierarchy-image, which the calibration record already names for it. Both bands target lane-draft, so the destination lane is the same; what changed is which band clause carries the decision.

**Why the other gold artifacts are unaffected.** The pair bands that carry a d_w clause require at least 300 traced droplets. Shuffle and tri have 19 traced droplets and the pumpkins have 6, so no d_w clause can fire for them regardless of their new values.

| Artifact | Traced droplets | Eligible for d_w pair band (needs >= 300) | Lane changed |
|---|---|---|---|
| gasket-v2-L384 | 366 | Yes | No (band clause changed, lane same) |
| shuffle-s42 | 19 | No | No |
| pumpkin_field | 6 | No | No |
| pumpkin_ring | 6 | No | No |
| tri | 19 | No | No |

The source names six gold artifacts for the router and five in the oracle table; the sixth is not named in this record, and its lane is stated as unchanged.

## Oracle

**d_w values move.** In the centroid walk, d_w moved as the gold table shows: 4.175736 to 3.481099 (shuffle-s42), 7.770301 to 6.584950 (pumpkin_field), 4.505589 to 4.843677 (pumpkin_ring), 2.255452 to 2.043963 (gasket-v2-L384), 2.958820 to 2.881828 (tri).

**Einstein verdicts did not change on the gold set.** They remain insufficient on gasket and shuffle, and inconsistent on pumpkin and tri. Numbers moved; categorical conclusions did not.

**D did not move.** D is computed on the pixel mask without a triangulation, so the adoption leaves it untouched on all five renders.

## What a consumer should do differently

1. **Treat pre-2026-10-16 d_w values as a different instrument.** Any stored walk value computed before this deploy came from the incomplete graph. Comparing it to a post-deploy value mixes two instruments.
2. **Read the graph label.** `walkPoints` reports `delaunay: "exact-sos-v1"`. That label is how a consumer can tell which graph produced a number.
3. **Do not lean on the 2.4 threshold for large arrangements yet.** The adoption flags it explicitly as calibrated on the incomplete graph (open item 1, doc 04). Today it only affects the gasket, and the outcome there agrees with the calibration record. Any real arrangement of 300 or more droplets is the case where it could misroute.

## Magnitude of the shifts

| Artifact | d_w delta | Relative change |
|---|---|---|
| shuffle-s42 | -0.694637 | about -16.6% |
| pumpkin_field | -1.185351 | about -15.3% |
| pumpkin_ring | +0.338088 | about +7.5% |
| gasket-v2-L384 | -0.211489 | about -9.4% |
| tri | -0.076992 | about -2.6% |

Deltas are computed from the table values in the source. These are not small corrections; a threshold tuned on old values can sit on the wrong side of new ones, which is exactly what happened to the gasket at 2.4.

## Why contract preservation mattered

Because `bowyerWatsonDelaunay` kept its input contract and return shape (doc 01), none of these consumers needed code changes. Their outputs changed only because the graph underneath them became complete. That isolates the cause of every shift to the triangulation, which made the six-decimal prediction-match in the verification possible.

## Unchanged by design

- Lanes of all gold artifacts.
- Einstein verdict categories on the gold set.
- D on every render.
- Crons and bindings (doc 06).
