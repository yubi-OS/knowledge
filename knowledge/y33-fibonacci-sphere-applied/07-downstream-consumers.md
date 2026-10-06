# Downstream Consumers

Scope: who consumes the applied y33 machinery and what each consumer gets: paper readers, RSI loop users, and the render pipeline.

## Three consumers

The applied doc names three downstream consumer classes (internal ref: refs/y33-fibonacci-sphere-applied-2026-08-07.md):

1. Paper readers. The Methods section of papers/learned-latent-curves-2026-08-06.tex now carries a runnable sampling scheme (Fibonacci) and an explicit angular-probe primitive (Y_3^3), so the diagnostic grid is reproducible from the paper alone.
2. RSI loop users. rsi-phi-skill is the operational entry point, dispatched per cycle, using the same conventions as the paper.
3. The render pipeline. The 384-D Fibonacci-sphere basis feeds the papers/data/series/384-D/384-D/ time-series entry, and the keystone visualization shows the gate status.

## Paper readers: reproducibility as the deliverable

The revised passage records the rationale: the reader should be able to reproduce the diagnostic grid from the paper alone, without inferring the sampling scheme from context (internal ref: refs/y33-fibonacci-sphere-paper-revised-passage-2026-08-07.md). The visualization claim is externally corroborated in kind, not in instance: interactive spherical-harmonics visualizers where l and m are selected directly and animated are an established tool category (https://icgem.gfz.de/vis3d/tutorial, weight 0.72 in the doc 03 dig, 0.41 in this dig), and the family Y_3^3 belongs to forms an orthogonal system basic to expanding general functions on the sphere (https://en.wikipedia.org/wiki/Spherical_harmonics, weight 0.17 in this dig, weak; 0.84 in the doc 03 dig).

## RSI loop users: conventions as a contract

For the RSI loop, the deliverable is that the skill and the paper share constants: the golden-ratio indexing, the Condon-Shortley normalization, the 384-lobe default, and the chosen (l=384, m=3) variant (internal refs: refs/y33-fibonacci-sphere-applied-2026-08-07.md and skills/rsi-phi-skill/SKILL.md). The external grounding for treating spherical harmonics as a production-grade basis is the transform literature: spherical harmonic transforms at high degrees with efficient gradients for machine learning are an active, well-supported area (https://www.sciencedirect.com/science/article/pii/S0021999124003589, weight 0.87, from the doc 04 dig), and real spherical harmonics are a smooth, orthogonal, symmetry-adapted basis used across graphics, signal processing, geology, and quantum chemistry (https://arxiv.org/pdf/2302.08381v1, weight 0.70, from the doc 04 dig).

## Render pipeline: Fibonacci grids are not exotic

The render pipeline consumes the 384-D basis as a time-series entry. The external literature shows Fibonacci grids deployed operationally for exactly this kind of uniform sphere sampling: the TUW-GEO fibgrid package implements the Fibonacci grid as a method for distributing points uniformly across the sphere's surface, inspired by the Fibonacci sequence and the golden angle for near-equal-area distribution, aimed at unbiased global sampling (https://github.com/TUW-GEO/fibgrid, weight 0.81; PyPI listing of the same package, weight 0.47, weak). Generalized Fibonacci grids additionally have the property that when stretched or compressed along certain directions the grid points keep approximately equal distances to all their neighbors, which is exploited to obtain deterministic samples of arbitrary Gaussians (https://isas.iar.kit.edu/pdf/Fusion21_Frisch.pdf, weight 0.89). Adjacent geoscience sampling work grounds the domain (https://www.lyellcollection.org/doi/abs/10.1144/SP313.11, weight 0.60, tangential).

## What each consumer should check

- Paper readers: the two insertions match the companion artifacts' synchronization table (doc 03).
- RSI loop users: the skill's constants match the paper's, including the dual-ordering constraint (doc 04).
- Render pipeline consumers: the 384-D entry reflects the chosen variant and the PC1+PC2 = 1.0000 gate result (docs 05 and 06).

## Sources considered

| source | weight |
|---|---|
| https://isas.iar.kit.edu/pdf/Fusion21_Frisch.pdf | 0.89 |
| https://github.com/TUW-GEO/fibgrid | 0.81 |
| https://www.lyellcollection.org/doi/abs/10.1144/SP313.11 | 0.60 |
| https://pypi.org/project/fibgrid/ | 0.47 (weak) |
| https://icgem.gfz.de/vis3d/tutorial | 0.41 (weak in this dig) |
| https://geomagnetism.ga.gov.au/agrf-calculations/agrf-form | 0.12 (weak, not cited) |
| https://en.m.wikipedia.org/wiki/Fibonacci_sequence | 0.22 (weak, not cited) |
| https://elysiatools.com/en/visualizations/spherical-harmonics-explorer | 0.37 (weak, not cited) |
| https://sangillee.com/2024-12-22-spherical-harmonics-visualizer/ | 0.34 (weak, not cited) |
| https://spatialaudio.online/utilities/spherical-harmonics-explorer | 0.34 (weak, not cited) |
| https://www.merriam-webster.com/dictionary/spherical | 0.28 (off-topic, not cited) |
| https://en.wikipedia.org/wiki/Spherical_harmonics | 0.17 (weak in this dig) |
