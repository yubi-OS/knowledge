# 06 - The falsification corpus

## Scope

This doc covers the falsification corpus built for edge-standard-v1 in 2026-10-06: the CI-guarded synthetic anchors, the five deploy-lesson-class rules the corpus produced, the real-data record against supersolid experiments, and the v3 matched-extent control that resolved the order-versus-disorder question. Grounding spine: the source doc (yubi-OS/yubiOS skills/taste-engine/SKILL.md).

## What the corpus is and why it is CI-guarded

edge-standard-v1 was tested as a supersolid droplet-morphology measure via a falsification corpus, and the corpus itself is CI-guarded: `tools/edge-standard/falsification/gen_v2.py --selftest` asserts the measured anchors and must be run after any pipeline change (source doc). The anchors are known-answer cases: gasket-v2 at L=384 with local slope 1.5968 over the scale set {13, 20, 29, 43, 64} against Sierpinski theory at 1.585; the triangle at 1.2636; the shuffle at roughly 1.035; and the pumpkin pair, ring 0.9772 and field 1.0384 (source doc).

The Sierpinski gasket is the right anchor because its fractal dimension is exactly known: the Sierpinski triangle is a self-similar fractal with Hausdorff dimension log 3 over log 2, about 1.585 (source: https://en.wikipedia.org/wiki/Sierpi%C5%84ski_triangle, jev weight 0.77). A measured 1.5968 against a theoretical 1.585 is a 0.012 gap, which is what a finite-resolution box-counting estimate of an ideal fractal should produce. The CI guard means a pipeline change that silently degrades box counting fails a check instead of quietly shipping.

## The five rules

The corpus produced five findings, stated as rules:

1. Binary renders above roughly 12 percent ink are silently thresholded to an EMPTY set by the argmin rule, so masks must be asserted non-empty on every run (source doc, rule 1). This is doc 04's under-inked flag in its sharpest form: the failure is silent without the assert.
2. Gate windows must be checked against the pinned scale lattice [4, 6, 9, 13, 20, 29, 43, 64] BEFORE running. The pre-registered "16-64" window was ill-posed on that lattice because no two-octave span exists on it; it was amended to {13, 20, 29, 43, 64} before v2 with a-priori justification, logged, and never moved post-hoc (source doc, rule 2). This is the pre-registration discipline: the window is justified before results are seen, and changing it after seeing results is what pre-registration exists to prevent.
3. Render bias is r/L-dependent: measured -0.099 at L=256 and +0.012 at L=384. Calibrate by L-convergence, meaning the same generator run at two canvas sizes, because analytic bias models got the sign wrong (source doc, rule 3). The empirical lesson: when you cannot derive the bias, measure it at two scales and interpolate; when an analytic model and a measurement disagree, trust the measurement.
4. Keep element size uniform and much smaller than the finest hierarchy spacing. Size-grading elements by hierarchy depth puts each level's contour-to-point transition inside the pinned window; that was the v1 gate failure, D 0.9478 (source doc, rule 4).
5. Order-versus-disorder is extent-confounded in naive designs: the triangle at 1.2636 versus the shuffle at roughly 1.035 was predicted to be near-degenerate, and matched-extent controls are required (source doc, rule 5). Rule 5 is what the v3 control then proved conclusively, below.

## The real-data record

The corpus was tested against real supersolid data. Norcia 2021 Figure 2b's 8 in-situ panels across the 1D to 2D transition read D 0.98 to 1.37, with single-trial noise and extent-confounded conditions; the r2 low_confidence gate fired at half resolution on real data exactly as designed (source doc). The Trypogeorgos Zenodo data is 1D profiles only, so there is no threshold signature in D; strips read 1.24 to 1.50 (source doc). Live-route parity was max delta 4.9e-5 (source doc). The canonical record is `refs/sierpinski-supersolid-connection-2026-10-06.md`.

The physics context is real: supersolidity of polariton condensates in photonic crystal waveguides is published in Physical Review Letters (source: https://link.aps.org/doi/10.1103/PhysRevLett.134.056002, jev weight 0.88), and emerging supersolidity in photonic-crystal polariton lattices is published in Nature in March 2025 (source: https://www.nature.com/articles/s41586-025-08616-9, jev weight 0.87). The polariton supersolid line of work provides experimental evidence of the supersolid phase in driven-dissipative, non-equilibrium contexts (source: https://arxiv.org/html/2407.02373v1, jev weight 0.63). A Bose-Einstein condensate is the underlying state of matter for these systems, formed when a dilute boson gas is cooled near absolute zero (source: https://en.wikipedia.org/wiki/Bose%E2%80%93Einstein_condensate, jev weight 0.65). The corpus's role is measurement-side: whether edge-standard-v1's D, built for images, reads the droplet morphologies in these panels in a way that tracks the published 1D to 2D transition. The record shows it does so with stated limitations (single-trial noise, extent confounds, no threshold signature in 1D profiles), which is why the limitations are recorded rather than rounded away.

## The v3 matched-extent control

The v3 matched-extent control, dated 2026-10-06, settled the tri-versus-shuffle question: jittered lattice 1.2609 versus lattice 1.2636. The tri/shuffle gap was array extent, not order (source doc, Addendum 7). The conclusion is sharp and general: D is a hierarchy and fill detector, not an order parameter (source doc). Rule 5 said naive designs confound extent with order; the matched-extent control is the experimental fix, and its result changed what the instrument is allowed to claim about a measured D.

## How to use this doc

If you change anything in the edge-standard pipeline, run `gen_v2.py --selftest` first; if you add a new generator or gate window, follow the pre-registration shape of rule 2 (a-priori justification, logged, never moved post-hoc); and if you draw a conclusion about what D means for a new artifact class, build the matched-extent control before believing the order-related interpretation.
