# 04 Snapback detection

Scope: the `/visco/snapback` route: sign-inversion detection on predicted-vs-realized series, emitting gate_input verdicts (halt_round / continue) that advise but never auto-action, matching the Python fixture exactly on recorded rounds.

## What the route does

`POST /visco/snapback` takes a series of predicted-versus-realized results and detects sign inversions: points where the direction of movement reverses. It returns the detected inversion runs and emits a `gate_input` verdict, either `halt_round` or `continue`, that a caller can feed to its own gate. The route never performs an action itself [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

The recorded fixture case is the round-3 series: live verification found inversion runs `[[4],[6,7],[10]]`, verdict `snapback`, gate_input `halt_round`, matching the Python fixture exactly [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md]. Fixture-exact agreement between the live worker and the Python system of record is the parity guarantee, not an accident of tuning.

## Where the name comes from

In structural mechanics, snap-back is a severe instability. During crack propagation a snap-back instability appears when the energy released by the advancing crack exceeds the energy dissipated in forming the new fracture surfaces; in such scenarios the applied system must shed energy and the response reverses [source: https://repository.kaust.edu.sa/server/api/core/bitstreams/3163f33d-adec-40e4-aa19-8a01871ccfc2/content, jev weight 0.8877]. Snap-back is distinguished from snap-through by what reverses: in snap-back both load and displacement reverse, while in snap-through only the load reverses; it occurs in shallow arches, domes, and fracture problems [source: https://novasolver.jp/en/structural/buckling/snap-back.html, jev weight 0.4077, weak backing]. Structural analysis treats snap-through and snap-back as abrupt jumps to a new equilibrium state at limit points on the load-displacement curve [source: https://www.bohrium.com/en/sciencepedia/feynman/computational_solid_mechanics_graduate-snap-through_and_snap-back_instability_analysis, jev weight 0.1347, weak backing].

The corpus-audit borrowing is directional: a corpus round that was predicted to improve the metric but whose realized measurements start moving the other way has "snapped back". The inversion run marks the round index where the direction flipped.

## Detection, not action

The route's output discipline matters as much as its detector. Change-point detection is the statistical problem of identifying times at which the statistical properties of a time series change abruptly [source: https://en.wikipedia.org/wiki/Change_detection, jev weight 0.1924, weak backing; broader survey: https://www.sciencedirect.com/science/article/pii/S0957417424002070, jev weight 0.8976]. Sequential change-point detection in high-dimensional time series is an active research area with considerable practical use [source: http://arxiv.org/abs/2006.00636v1, jev weight 0.8865], and the field maintains indexed topic coverage across publications [source: https://www.nature.com/nature-index/topics/l4/change-point-detection-in-time-series-analysis, jev weight 0.6453].

Detection and action are separable concerns, and the visco instrument keeps them separate by design: the detector emits a `gate_input` string, and the caller's gate consumes it. The build record states the route "never auto-actions" [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md]. This mirrors the deployment-gates pattern in release engineering, where gates are conditions evaluated on a pipeline and a failed gate stops promotion only because the pipeline, not the check, enforces the stop [source: https://learn.microsoft.com/en-us/azure/devops/pipelines/release/approvals/gates?view=azure-devops, jev weight 0.944].

## Inversion runs as evidence

The recorded inversion runs `[[4],[6,7],[10]]` carry structure beyond a boolean: they locate three distinct reversal events, one isolated at index 4, a two-step run at indices 6 and 7, and one at index 10. An isolated single-point inversion and a sustained multi-step run are different evidence strengths, and the fixture preserves that distinction so a gate policy can weight them differently. The verdict `snapback` and the gate input `halt_round` were produced for this series by both the Python system of record and the live worker [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

## Relation to the other instruments

Snapback detection complements the hysteresis rollup: the rollup quantifies how much predicted-versus-realized error accumulated across a whole chain (102.9 dBc-units in the round-3 calibration case [source: https://raw.githubusercontent.com/yubi-OS/knowledge/main/knowledge/linear-viscoelasticity/08-creep-recovery-replay.md, internal replay record]), while snapback flags the moment the error changes character, from over- or under-prediction to outright directional reversal. A round can dissipate heavily without ever snapping back, and it can snap back once on an otherwise tight chain; the two instruments answer different questions about the same ledger.
