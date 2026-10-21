# 04. Known Follow-Ups, Recorded Not Hidden

**Scope:** Known follow-ups (recorded, not hidden): detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-router-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/hierarchy-router-2026-10-06.md, no external web dig

## The principle

The build record titles this section "Known follow-ups (recorded, not hidden)". Four items were open at ship time. Two were later resolved in addenda; this doc records all four and their outcomes.

## Follow-up 1: dispatch-leg outcome capture

- **Symptom**: the first live auto-dispatch (gasket to lane-draft, a 70b model call, in-request after the pipeline) left the action state `unknown` after 1 attempt.
- **Safety held**: reconcile-before-repeat held. No auto-retry, no false terminal state.
- **Proposed fix at ship time**: capture the runLLM outcome synchronously in dispatchRouteAction, then reconcile and close the seed task.
- **Actual outcome**: resolved in the first addendum, but the root cause was different from the proposed fix. See doc 06.

The record of a proposed fix that turned out to be wrong is itself useful: it shows the follow-up list was a hypothesis list, not a commitment to a specific patch.

## Follow-up 2: multimodal band stays provisional

- **At ship time**: shipped with `calibration: "provisional"`; never auto-dispatches; requires a 21-point calibration sweep on real multi-input artifacts.
- **Actual outcome**: resolved in the second addendum (2026-10-06, about 04:40 PT).

### The sweep, with criteria pre-registered

- jitter sd <= 0.02 required;
- paired hint-discrimination delta >= 0.15 required;
- a 21-point morphological axis recorded as a property, not gated.

**Leg 1, jitter: PASS.** 5 re-calls x 2 artifact classes with a fixed neutral hint: gasket-L384 sd = 0 (5 x 0.1434), shuffle-s42 sd = 0 (5 x 0.5226). Clef is deterministic on fixed instructions plus fixed images.

**Leg 2, hint discrimination: PASS with margin.**

| Artifact | Hint | Score |
|---|---|---|
| gasket-L384 | hierarchical Sierpinski-gasket arrangement | 0.9527 (match) |
| gasket-L384 | random scattered field | 0.0357 (mismatch) |
| shuffle-s42 | random scattered field | 0.8463 (match) |
| shuffle-s42 | hierarchical Sierpinski-gasket | 0.1271 (mismatch) |
| gasket-L384 | no hint | 0.8330 (baseline) |

Mean matched 0.8995 versus mean mismatched 0.0814: paired delta 0.818, well above 0.15.

**Leg 3, morphological axis (property only):** 21 gaskets, depth 0 to 6 x L in {192, 256, 320}. Spearman rho(score, depth) = 0.322, rho(score, D) = 0.288, weak, as expected for a hint-anchored score. One low outlier: d6-L192 at 0.1062. This is why image artifacts route on deterministic D and the multimodal band is the hint-artifact-match lane.

**Instruction sensitivity:** a vague neutral hint scored 0.1434 on a gasket that scored 0.9527 with a matched hint and 0.833 with no hint. Callers get out what they describe.

**Verdict**: 2/2 gated criteria PASS; multimodal-probe flipped to calibrated via **policy v8** (audited promote, learning `l_9bf21d1a3df53c33`, actor jenny; 26 v7-bound approvals expired, expected). Post-v8 proof: a hint-only multimodal artifact scored 0.8498, was allowed, dispatched to lane-draft (text_len 2395), verified_success, and task `t_1af9a2adaf22e8f7` reached terminal in-request. Pending approvals: 0.

**Caller caveat**: degenerate 8x8 stub PNGs fail clef inference (error 3043) and return 422 MEASUREMENT_FAILED; all 31 real-render calls succeeded.

## Follow-up 3: console Router card

- Deployed to KV `jev-index.html`: band table, recent routes, route form.
- Parser-validated: 0 unmatched closes.
- Two pre-existing KV-edit scars repaired: the taste-card comment opener and the split `corpus-nulls` input.
- **Deploy gotcha logged**: curl `-d` strips CRLF; KV PUTs of HTML must use `--data-binary`.

## Follow-up 4: skills amendments deferred

The jev-orchestrator and steady-orbit-deploy router sections were deferred to the next doc pass. Until then, the SPEC and the build record are the contracts.

## Status board

| # | Item | Status |
|---|---|---|
| 1 | dispatch-leg outcome | resolved (addendum 1; root cause in verify) |
| 2 | multimodal calibration | resolved (addendum 2; policy v8) |
| 3 | console Router card | shipped at build time |
| 4 | skills amendments | deferred |
