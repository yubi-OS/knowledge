# 08 The hierarchy router: measurement-gated routing

Scope: the route endpoint, the routing bands in live policy, the route.dispatch builtin, router verify semantics, calibration on record, and caller caveats.

## Route proposal vs gate disposition

The hierarchy router adds measurement-gated routing to the worker. POST /api/jev/route accepts any artifact modality: image (a deterministic edge-standard-v1 D measurement), text (a structured-evidence scorer), and multimodal or any (one clef noul call over the caller hint plus data-URI images and any measured context) (source doc, Hierarchy Router section).

The invariant is one line: the detector proposes the route; the gate disposes. Measurements are data, never authorization (source doc). The routing action {tool: route.dispatch, method: POST, url: https://jev.route/<target>, body: {target, artifact_ref, band_id}} passes the same fail-closed gate as every action (doc 02). On allow, the router auto-dispatches (the approve-leg contract) and the task closes in-request.

## Bands live in policy, not code

Band lookup reads routing.bands from the LIVE policy at call time (source doc). Policy v7 added routing.bands: hierarchy-image with D of at least 1.45 routes to lane-draft; ordered-image with D in [1.0, 1.45) routes to lane-classify; sparse-image with D in [0, 1.0) routes to lane-classify; multimodal-probe routes to lane-draft. Policy v7 also added the route.dispatch builtin (hosts jev.route, methods POST, targets lane-draft and lane-classify, model_routes classify and draft). Policy v8 flipped multimodal-probe to calibrated after its sweep (source doc).

Because bands are policy data, changing routing behavior is a policy edit, not a code deploy, and (per doc 02) a policy version bump expires approvals bound to older versions.

## Verify semantics for route.dispatch

The route.dispatch branch in jev-verify defines model dispatches as verified_success only when the captured response text is non-empty, and automation dispatches as verified from the run task's terminal state. The evidence carries route_verify with basis model_text or automation_run_state (source doc). Without this branch the stock status_range predicate finds nothing decidable on a model response and would demote a successful dispatch to unknown (source doc). This is the doc 04 lesson applied to builtins: verification needs declared predicates and branches for the action type.

## Endpoints and calibration on record

Router endpoints: POST /api/jev/route, GET /api/jev/route/bands, POST /api/jev/route/selftest (21 checks), and GET /api/jev/route/runs (kind router rows, idempotent per artifact sha256) (source doc).

Calibration recorded in the source doc: image bands went 6 of 6 HIT through the live route, with band edges 1.0, 1.45, and 2.0 confirmed and gaskets at 1.55 or above against the 1.45 edge. The multimodal band went 2 of 2 sweep PASS, with jitter sd 0 on both classes and a hint-discrimination paired delta of 0.818 (source doc).

## Caller caveats

1. Degenerate stub images (an 8 by 8 PNG) fail clef inference with error 3043, producing 422 MEASUREMENT_FAILED. Use real images (source doc).
2. Same-artifact re-routes dedupe to the existing task via idempotency. A re-route is NOT a re-dispatch (source doc).
3. There are no text bands in v1: text artifacts measure but route fail-closed blocked (source doc). This is the fail-closed principle applied to an uncalibrated modality.
4. The task verify endpoint REQUIRES body.action_id. Without it the handler resolves action to null and returns 500 (source doc).

## Hint quality is the caller's job

Multimodal routing quality depends on caller hint quality: a vague hint scores 0.14 on a gasket that scores 0.95 with a matched hint. Callers get out what they describe (source doc).

## Background on the measurement

The D measurement is a fractal dimension of an edge map. Box counting is the standard estimation method: overlay boxes of decreasing size and count how many contain edge pixels, with the dimension falling out of the log-log slope (https://en.wikipedia.org/wiki/Fractal_dimension, weight 0.05, weak; https://en.wikipedia.org/wiki/Box_counting, weight 0.03, weak; https://porespy.org/examples/metrics/tutorials/box_count.html, weight 0.05, weak). Calibration discipline, in the sense of confidence that actually means what it claims, is the standard concern behind band edges and sweep gates (https://scale.com/blog/calibrated-confidence, weight 0.08, weak; https://arxiv.org/abs/2106.07977, weight 0.06, weak).

## Sources

- Source doc: skills/jev-orchestrator/SKILL.md in yubi-OS/yubiOS (section: Hierarchy Router).
- https://en.wikipedia.org/wiki/Fractal_dimension (weight 0.05, weak)
- https://en.wikipedia.org/wiki/Box_counting (weight 0.03, weak)
- https://porespy.org/examples/metrics/tutorials/box_count.html (weight 0.05, weak)
- https://scale.com/blog/calibrated-confidence (weight 0.08, weak)
- https://arxiv.org/abs/2106.07977 (weight 0.06, weak)
