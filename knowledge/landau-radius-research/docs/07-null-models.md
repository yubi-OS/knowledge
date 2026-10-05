# Null-model discipline for the radius instrument

> Scope: which null models can and cannot calibrate the isolate count: the degree-preserving degeneracy, the bit-matrix conditional fixed-frame null, budget sensitivity of significance bands, and what a valid clearance null would need to define.

## The general rule: match the null to the statistic

A network property is only meaningful relative to a null model, and the choice of null determines what a statistic can show. The null-model literature in network science is explicit that constrained randomization must preserve exactly the structure the hypothesis does not concern: null models in network neuroscience preserve density and degree sequence while rewiring ([Null models in network neuroscience](https://www.nature.com/articles/s41583-022-00601-9), weight 0.50), and the configuration model formalizes this by decoupling the degree sequence from edge generation ([Counting Graphs and Null Models of Complex Networks](https://link.springer.com/chapter/10.1007/978-3-319-68705-6_1), weight 0.87). But a null that preserves too much can also destroy the signal: detectability constraints limit which meso-scale structure can even be detected against a configuration null ([Detectability constraints on meso-scale structure in complex networks](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0317670), weight 0.83).

The research-phase record ([round-three results](https://github.com/yubi-OS/yubiOS/blob/e4be4854764f3217eaab08c01f15e62d5509e3ec/refs/wayfinder-round3-results-2026-09-13.md), program record) adds a sharper, corpus-specific instance of this general trap.

## The degree-preserving null is degenerate for isolate counts

I(r0) is exactly the number of degree-zero vertices at radius r0. A degree-preserving graph null fixes the degree sequence, and therefore fixes the count of degree-zero vertices by definition. A local swap exercise kept all 62 map-74 isolates unchanged at every checkpoint; SD = 0 is required by definition, regardless of mixing (program record). Conclusion: a degree-preserving null cannot calibrate I(r0). The null is informative for statistics orthogonal to the degree sequence, and the record notes that the earlier Hodge analysis's degree-null was informative for cycle structure, but that does not make it informative for every graph statistic.

## The bit-matrix conditional fixed-frame null

The record's reusable control is the existing bit-matrix null, reinterpreted as an exploratory conditional fixed-frame null: preserve row and column margins, transform null bits using the observed frozen frame, and compute the same radius profile. It ran K = 40 draws at the existing 5Nd attempted-switch budget and at 20Nd for maps 66, 74 and 76; every sampled matrix preserved its margins (program record).

Descriptive results at r = 0.095 for final map 76 (program record):

- Real I = 64.
- Null means 71.10 at 5Nd and 70.125 at 20Nd, with sample SDs 7.58 and 9.54.

The record labels these exactly what they are: descriptive finite samples, not a demonstrated convergence result.

## Budget sensitivity kills the proposed ranking statistic

The mean clipped-clearance statistic is budget-sensitive in a disqualifying way (program record). Its final real value is approximately 0.04750. The observed outer empirical band was [0.05304, 0.06903] at the 5Nd budget and [0.04678, 0.07294] at 20Nd. The real value lies outside the first band and inside the second. The record's verdict: K = 40 and this difference are insufficient grounds to admit a new ranking statistic. The bands are pointwise, conditional on the fitted frame, and not adjusted for searching across radii, which is the multiple-comparisons exposure that sensitivity analyses must account for ([Wikipedia: Sensitivity analysis](https://en.wikipedia.org/wiki/Sensitivity_analysis), weight 0.57).

## What a valid clearance null would need

For a clearance curve, a proposed null must define how distances or the metric filtration are randomized. Rewiring an unweighted graph does not, by itself, define new geometric distances (program record). This is the same lesson the configuration-model literature teaches in graph space ([Counting Graphs and Null Models of Complex Networks](https://link.springer.com/chapter/10.1007/978-3-319-68705-6_1), weight 0.87) applied to metric space: the null must live in the space where the statistic lives.

No significance claim and no automatic ranking claim follows from the exploratory probes in the record, and the record says so.
