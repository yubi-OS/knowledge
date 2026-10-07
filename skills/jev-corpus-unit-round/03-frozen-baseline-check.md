# The frozen baseline check

Scope: step 3 of the runflow. One audit with a 400-draw null, the frozen frame map and its control family, the lens snapshot, and the 3-phase concurrent fetch plan that runs them.

## The audit and the gate statistic

`POST /api/jev/corpus/audit {matrix, labels, nulls: 400}` produces the gate statistic: `level_dbc = 20*log10(|z|)` (source doc yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md, following the verify_claims.py claim-8 law). The source doc is emphatic: NEVER gate on the `dbc` field. The `dbc` field is an L2 share-spectrum distance to the null vacuum, it is negative when close, and it is uncorrelated with z at cycle scale (source doc).

The two quantities answer different questions, and only one of them is a gate. The dB (decibel) convention expresses a ratio as a logarithm: the 20*log10 form is the amplitude-ratio convention, distinct from the 10*log10 power-ratio convention (https://www.britannica.com/science/decibel, weight 0.81; https://en.wikipedia.org/wiki/Decibel, weight 0.75). So `level_dbc` reads as "how many decibels above the null floor is the z statistic", a signed, monotone quantity that increases as the corpus moves further from the null. The raw `dbc` field is an unnormalized distance whose sign convention is inverted relative to closeness, which is exactly the wrong property for a gate that must rise when a change is real.

The audit draws 400 nulls. The null draws are a permutation-style null distribution: shuffle the association between data and labels, recompute the statistic, and use the resulting distribution as the reference scale (https://en.wikipedia.org/wiki/Permutation_test, weight 0.67; https://en.wikipedia.org/wiki/Permutation, weight 0.71). The z statistic is then the corpus's distance from that null in standard deviations, and the gate reads it in dB.

## The frozen frame

`POST /api/map {texts, names, labels, d:9, seed:20260906, threshold:'median', K:40, T:0.05}` is the frozen frame (source doc). The parameters are constants of the protocol, not knobs: dimension 9, a fixed seed, median threshold, K 40, T 0.05. Freezing matters because the round's predicted and realized deltas are both read against this exact geometry; a re-frozen frame with different parameters would make the two incomparable.

The `/api/jev/corpus/placements` route may 404 with upstream error 1042; the direct `/api/map` texts flow is the working path (source doc). Like the batch scorer route in step 2, the specialized route is the one that breaks.

The control family runs against the frozen frame: `POST /api/map/control {baseline_id, texts, names}` as the positive control, plus `/api/map/admission`, `/api/map/azimuth`, and `/api/map/axis-redundancy`. The source doc says to record the verdicts whatever they are (source doc). The control is ordered after the map for a hard structural reason: it requires `baseline_id`, which only exists once the map has returned.

## The lens snapshot

`POST /api/jev/corpus/lens {matrix, labels, top, skip}` takes one snapshot per unit, and that snapshot feeds `GET /api/jev/corpus/visco/mobility`, the saturation series (source doc). One snapshot per unit, no more: the mobility series is only meaningful when its points are unit-spaced.

## The 3-phase fetch plan

The reference harness (`scripts/baseline.mjs --dir <refs-dir> --out <workdir> --skip skip.json`) encodes the optimized fetch plan, taking a sequential run of about 100 seconds down to about 38 seconds (source doc). Every step of the baseline check is required at every unit interval (source doc). The plan:

1. Phase A: score the matrix at concurrency 12 in parallel with the map.
2. Phase B: audit in parallel with control (which needs the map id), admission, azimuth, axis-redundancy, and lens. The control is the flakiest call: 3 retries on 503 and 1102, 33.9 seconds measured, and it has 1102'd once at 257 docs (source doc).
3. Phase C: read the rungs.

The one ordering constraint inside Phase B is the control's dependency on `baseline_id`; everything else in the phase is independent. That is why the control sits in Phase B overlapping the audit rather than overlapping the score block directly (source doc).

## Nulls 100 is not gate-grade

The refs7 F2 finding: z deltas measured at nulls 100 are not gate-grade. refs6's +0.29 and +0.71 z-revisions collapsed to -0.61 and -0.26 when re-measured at 400 (source doc). The lesson is baked into the flow as an absolute: 400 nulls, always, before acting on any delta.

## What this record does not claim

This record does not describe how the scorer produces matrix rows (doc 02), how candidates are derived from the frozen frame (doc 04), or the internal formulas of the audit statistic beyond what the source doc states. The nulls=400 requirement and the level_dbc convention are stated here as protocol constants carried by the source doc and the verify_claims.py law it cites.

Sources: yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md (source doc); Britannica on the decibel (https://www.britannica.com/science/decibel, weight 0.81); Wikipedia, Decibel (https://en.wikipedia.org/wiki/Decibel, weight 0.75); Wikipedia, Permutation (https://en.wikipedia.org/wiki/Permutation, weight 0.71); Wikipedia, Permutation test (https://en.wikipedia.org/wiki/Permutation_test, weight 0.67).
