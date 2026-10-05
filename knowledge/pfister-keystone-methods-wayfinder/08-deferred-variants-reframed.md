# 08. Deferred variants, reframed: axis-trial/1 and consistency/1

**Scope.** How the 2 deferred screen variations shipped as trials rather than gates: the leave-one-out axis-redundancy trial against a fixed-margin null, and the consistency reading with caller-supplied variants.

## The deferral reasons became the design constraints

The screen deferred V3 because a new per-axis statistic needs its own admission null before it can appear anywhere, and V5 because a consistency filter would read as a geometric keep/revert gate. Both were shipped on the same day (PR #236, commit `f66308be`) only after being reframed so the objection becomes the design. Project provenance for this section: the yubi-OS refs corpus document `pfister-keystone-methods-wayfinder-2026-09-17.md` (internal primary source, unweighted).

## V3 to POST /api/map/axis-redundancy (axis-trial/1)

The route is itself the admission trial. It measures leave-one-out nearest-neighbour predictability of bit j from the other d minus 1 bits, recipe `loo-nn-vote/1`, computed on the stored bits and on K draws of the existing fixed-margin chain (`PM._internal.nullDraw`, margins certified per call, seed `map.seed XOR 0x5bd1e995`).

- Column margins are fixed under the null, so the majority-guess baseline cancels and the comparison isolates inter-axis dependence beyond the margins.
- Verdicts are exclusion-only: an axis is either excluded by the data or `not-excluded`. Descriptive z plus a plus-one tail at resolution 1/(K+1) is the whole statistic.
- `admitted:false` is hard-coded. The words `weights`, `importance`, `rank`, and `admit` are rejected as inputs. Nothing is written and no embedding is run.

Leave-one-out validation is an established evaluation pattern [1], and the fixed-margin permutation logic mirrors decision problems over fixed-radius neighborhoods in approximate nearest-neighbour work [2]. The trial is the yubiOS admission discipline: the null is computed, not assumed.

The live smoke on map 77 ran the trial with K=40 in 0.67 seconds: all 9 axes came back `not-excluded`, observed hits 5 to 7 against null means 4.8 to 5.7, every axis z within 0.85 in absolute value, total z 0.69, p 0.54, margins preserved over 21,600 attempts with 1,267 accepted. On that 12-document frame no axis is distinguishable from the fixed-margin null. The record is a trial record, not an admission decision.

## V5 to POST /api/map/consistency (consistency/1)

The route measures 1 candidate under 1 to 3 caller-supplied variants through the real preview path and reports sign agreement as a stability statement about the reading. It never generates variants itself: `augment`, `generate_variants`, `gate`, and `strength` are all rejected as inputs. `task_verdict` stays `not-tested`, so nothing in the response can be read as a keep/revert instruction.

Test-time augmentation, averaging model outputs over augmentations at inference time, is the general pattern here [3][4]; the yubiOS version inverts it: the caller supplies the variants and the endpoint only reports whether the readings agree. In the live smoke, the 3 variants of the pfister refs doc were all quantization-silent and `all_same_sign:true` held, sign_exact 3 of 3 against a predicted 0.

## Why reframe rather than delete

The screen in doc 04 marked both variants "defer", not "reject": the mechanisms were sound but the honesty boundary had no slot for them. Shipping them as trials converts the boundary from a veto into a schedule. The deferral reason names the missing evidence; the trial is the instrument that produces it; and until the evidence exists, the trial's own outputs are shaped so that no endpoint can treat them as decisions.

## Sources

1. https://besjournals.onlinelibrary.wiley.com/doi/full/10.1111/2041-210X.13851 (noul 0.8301)
2. https://theoryofcomputing.org/articles/v008a014/v008a014.pdf (noul 0.8370)
3. https://arxiv.org/pdf/2402.06892v1 (noul 0.9471)
4. https://link.springer.com/chapter/10.1007/978-3-030-92185-9_46 (noul 0.7779)
