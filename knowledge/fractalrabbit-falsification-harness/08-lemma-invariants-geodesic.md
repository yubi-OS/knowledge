# 08 - Invariant testing for selection operators on the sphere

Scope: verifying that a selection operator obeys its mathematical invariant (never worsens the objective), using geodesic-distance properties on the sphere as the underlying guarantee.

## Invariants as the third leg of validation

Fit-quality gates and recovery metrics test a pipeline's outputs. Invariant tests verify the pipeline's logic: a property that must hold for every input if the implementation is correct. A violation is not a poor result, it is a bug or a misapplication. The documented harness's third test is of this kind: for every corpus item, the selection operator (the atom) computes the geodesic distance to the ideal pole before and after flipping one missing primitive, and the invariant is that the delta is never negative. The operator may fail to improve (delta of 0, a local minimum), but it may never worsen.

This style of verification parallels formal work on invariants in dynamical systems. Research on robust controlled invariants for discrete-time monotone dynamical systems characterizes, verifies, and computes invariant sets for monotone systems under state, input, and disturbance constraints [1] (weight 0.81), with a companion treatment for continuous-time monotone systems focusing on lower-closed specifications [2] (weight 0.90). The shared idea: monotone structure makes invariants provable and checkable, and a checkable invariant converts a mathematical claim into a runtime assertion.

## Why geodesic distance carries the guarantee

The delta invariant leans on a classical property of geodesics: length-minimizing curves are geodesics, and geodesics are locally length minimizing [3] (weight 0.92) [4] (weight 0.79). On the sphere, the locally-minimizing property of geodesics is what makes "move along the geodesic toward the target" a locally safe step: within the local neighborhood, the step cannot increase distance. The atom's argument assumes exactly this local structure; a negative delta would mean the implementation moved along something that was not the local geodesic, or measured distance inconsistently before and after.

A practical warning comes from differentiable-geometry work in simulation: using Euclidean approximations in place of true geodesic distances can create undesired local minima that hinder optimization, which is why geodesic distances are preferred despite their smoothness complications [5] (weight 0.91). The harness's implementation uses a chordal-distance proxy as the documented v1 choice (source document: falsification harness, 2026-08-06); the invariant test is precisely the check that catches a broken proxy, because a wrong proxy can produce negative deltas even when the true geodesic argument holds.

Community-level discussion makes the same point from the other direction: how local the length-minimizing property of geodesics actually is, beyond the cut locus, is a subtle question, and proofs proceed by first establishing properties of length-minimizing curves [6] (weak backing, weight 0.04). Encyclopedic background on geodesics notes the term's geodesy origin and its generalization to curved spaces [7] (weak backing, weight 0.09).

## What 1170 invocations establish

Across 10 seeds and roughly 117 items per seed, the harness ran the atom 1170 times and observed 0 invariant violations (source document: falsification harness results, 2026-08-06). This is the strongest form of evidence an invariant test can produce in an empirical setting: the property held on every input tried, including the lower tail seeds where the recovery test failed badly. The two results together are informative: the detector (T2) is unreliable on stochastic corpora, but the operator's per-item guarantee (T3) survives even on the seeds where the detector performs worst. Failure and validity are localized to different components, which is what a well-decomposed test suite is for.

The delta of 0 case deserves attention: a local minimum means the atom found no single primitive whose flip improves the distance. On a binary vector this is a real possibility (the corpus item may require a coordinated multi-bit change), and it is not a violation. The invariant's wording, "never negative," encodes this: stagnation is permitted, regression is not.

## Sources

[1] https://link.springer.com/article/10.1007/s00498-023-00368-z (weight 0.81)
[2] https://www.sciencedirect.com/science/article/pii/S2405896324005366 (weight 0.90)
[3] https://link.springer.com/content/pdf/10.1007/0-387-22726-1_6.pdf (weight 0.92)
[4] https://idv.sinica.edu.tw/ftliang/diff_geom/*diff_geometry(I)/11.27/geodesicmin1.pdf (weight 0.79)
[5] https://arxiv.org/html/2404.18610 (weight 0.91)
[6] https://math.stackexchange.com/questions/2997861/how-local-are-the-geodesics-being-length-minimizing (weight 0.04, weak)
[7] https://en.m.wikipedia.org/wiki/Geodesic (weight 0.09, weak)
