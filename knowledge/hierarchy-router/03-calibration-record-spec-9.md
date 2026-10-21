# 03. Calibration Record (Spec Section 9)

**Scope:** Calibration record (spec §9): detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-router-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/hierarchy-router-2026-10-06.md, no external web dig

## What section 9 required

The SPEC's section 9 calls for calibration on the gold falsification-corpus fixtures. The build record ran **all 6 fixtures through the LIVE route**, not a local harness, so the calibration covers parsing, measurement, banding, and gating together.

## The calibration table

| Artifact | Expected D | Live D | Expected band | Routed band | Gate | Hit |
|---|---|---|---|---|---|---|
| gasket-L384 | 1.5589 | 1.558937 | hierarchy-image | hierarchy-image | allowed | HIT |
| gasket-L256 | 1.5967 | 1.596710 | hierarchy-image | hierarchy-image | allowed | HIT |
| tri | 1.2636 | 1.263595 | ordered-image | ordered-image | allowed | HIT |
| shuffle-s42 | 1.0355 | 1.035474 | ordered-image | ordered-image | allowed | HIT |
| pumpkin_ring | 0.9772 | 0.977190 | sparse-image | sparse-image | allowed | HIT |
| pumpkin_field | 1.0384 | 1.038390 | ordered-image | ordered-image | allowed | HIT |

**Result: 6/6 HIT, delta = 0 at 4 decimals.**

## Reading the result

The record's interpretation: the routing bands sit exactly where the falsification corpus pinned them. Band edges [1.0, 1.45, 2.0] are **confirmed on live traffic**.

Delta = 0 at 4 decimals means the live route reproduced the falsification corpus's expected D for every fixture to the 4th decimal (each live value rounds to its expected value). Because edge-standard-v1 is deterministic, this is the expected outcome of a correct deploy; a nonzero delta would indicate a version mismatch or a broken port.

## Margin to the band edges

| Artifact | Live D | Nearest edge | Margin |
|---|---|---|---|
| gasket-L384 | 1.5589 | 1.45 | +0.109 |
| gasket-L256 | 1.5967 | 1.45 | +0.147 |
| tri | 1.2636 | 1.45 | -0.186 |
| shuffle-s42 | 1.0355 | 1.0 | +0.036 |
| pumpkin_ring | 0.9772 | 1.0 | -0.023 |
| pumpkin_field | 1.0384 | 1.0 | +0.038 |

The 1.0 edge is the tight one. Three fixtures sit within 0.04 of it on either side. Because the measurement is deterministic, a small margin does not make routing flaky for these exact artifacts, but it does mean nearby real-world artifacts may cross between sparse-image and ordered-image with small structural differences. Both of those bands route to lane-classify, so a crossing at the 1.0 edge does not change the lane. The 1.45 edge, which separates lane-draft from lane-classify, has margins above 0.1 on all fixtures.

## The f3_sierpinski warning

The record adds an explicit caution: the taste fixture `f3_sierpinski` measures D about 1.35 to 1.44 under edge-standard-v1 and lands in **ordered-image**. It is **not** a hierarchy exemplar and **must not** be used to tune the 1.45 edge.

Why this matters: the name suggests a Sierpinski shape, and a reader might expect it in hierarchy-image. Its rendered form (in the taste fixture pack) measures below the edge. If someone lowered the 1.45 edge to capture it, they would be tuning a band to a fixture's name rather than to the pre-registered corpus, which is exactly the post-hoc adjustment the falsification discipline forbids.

## Fixture roles

| Fixture | Role in the corpus |
|---|---|
| gasket-L384, gasket-L256 | hierarchical exemplars at two render sizes |
| tri | ordered, non-hierarchical geometry |
| shuffle-s42 | order-destroyed control (seeded shuffle) |
| pumpkin_ring | sparse ordered structure |
| pumpkin_field | ordered field |

Two gasket sizes test that the hierarchy reading survives a change of render scale (D 1.5589 at L384 versus 1.5967 at L256; both above the edge).

## What calibration does and does not establish

- **Establishes**: the deployed route reproduces corpus D exactly and the band edges classify the gold set as pre-registered.
- **Does not establish**: performance on real-world, non-corpus images; that is outside section 9.
- **Does not apply to multimodal**: the multimodal band has its own calibration sweep (doc 04), because it does not route on D.
