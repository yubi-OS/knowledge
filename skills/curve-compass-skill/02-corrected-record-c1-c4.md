# 02 The corrected record (C1 to C4)

**Scope:** the four corrections the skill mandates before any statistic from the corpus-math regime is reported: V2 as a dimension artifact, the gate as a rank identity, the curveball null with its formal retraction, and the demonstration that there is no critical point.

Ground spine: source doc, yubi-OS/yubiOS skills/curve-compass-skill/SKILL.md. The source doc states the governing rule first: do not report any statistic from this regime without the null it is standardized against. The four corrections below are why (source doc).

## C1: V2 is a dimension artifact

When the correlation matrix has tr Sigma = D, the statistic V2 = (lambda_1 + lambda_2)/D is a share of a fixed total, not an absolute mass (source doc). Appending a column that does not load on the leading plane adds about 1 to the denominator and o(1) to the numerator, so V2 is non-increasing in D with a flat-spectrum floor of 2/D (source doc). Measured on the identical 2286 rows: V2 = 0.7235 at D = 9 and V2 = 0.2940 at D = 24 (source doc). Comparing V2 across different D is therefore meaningless, and the skill lists it as an anti-pattern (source doc).

The general lesson matches the literature: the participation ratio, the standard effective-dimensionality statistic built from eigenvalue shares, depends on the spectral context in which it is computed (https://pmc.ncbi.nlm.nih.gov/articles/PMC9403367/, jev weight 0.41, weak, general background; https://www.biorxiv.org/content/10.1101/2020.12.19.423618v3.full.pdf, jev weight 0.30, weak, general background).

## C2: the gate is a rank identity

The shipped estimator does not compute the participation ratio. It reports the two-share proxy r_hat = 2/V2, so the gate V2 at least 0.40 is equivalent to r_hat at most 5 by definition, a definitional identity with zero empirical content (source doc). The identity table in the source doc lists this coordinate as carrying no data.

## C3: the corrected null, and a retraction

Under the fixed-margin (curveball) ensemble, drawn by two independently validated uniform samplers, the 2286 by 9 matrix has real V2 = 0.7235293730732693 and curveball V2 = 0.709180 plus or minus 0.001183, giving dV2 = +0.014415 and dV2z = +12.13 (source doc). The curveball null is the class of sampler that preserves both row and column margins of a binary matrix: the Curveball algorithm samples bipartite graphs and binary matrices with fixed degree sequences, applying several switches simultaneously as trades (https://arxiv.org/html/1609.05137v2, jev weight 0.53).

Retraction (source doc): an intermediate analysis reported the same null as 0.8005 plus or minus 0.0017, hence z = -45.8. That value does not reproduce, its sign is wrong, and every downstream statement resting on it is withdrawn. The retraction is part of the corrected record, not a footnote to it.

## C4: there is no critical point

With the null recomputed at each N, the source doc reports dV2 = +0.0058, +0.0175, +0.0175, +0.0135, +0.0153, +0.0145, +0.0144 across N = 40, 79, 160, 320, 640, 1280, 2286. The signal is flat for N at least 79 with no interior maximum (source doc).

A genuine critical point has a specific signature that this flatness lacks. Exactly at a critical point the correlation length is infinite and no other length scale except the sample size cuts off the decay of correlation functions (https://www.mit.edu/~8.334/lectures/lec6.pdf, jev weight 0.55; https://ocw.mit.edu/courses/8-334-statistical-mechanics-ii-statistical-physics-of-fields-spring-2014/31f360cf7db5b66068eacc5240c17aeb_MIT8_334S14_Lec6.pdf, jev weight 0.50). At a critical point the isothermal susceptibility diverges, while the specific heat may remain finite (https://www.mdpi.com/1099-4300/22/5/502, jev weight 0.56). The source doc's own falsification table closes the loop: the fluctuation peak, the susceptibility divergence and the critical slowing-down are all falsified or unsupported, so the "critical point" was the null's own finite-size inflation (source doc).

## Why this section is binding

The skill's guideline 1 states: never report a statistic without its null; a number without a null is a number without a claim (source doc). C1 through C4 are the documented history of what happens when that rule is skipped: a dimension artifact read as structure (C1), a definitional identity read as a gate (C2), a broken null read as a 45.8 sigma result (C3), and a flat curve read as a phase transition (C4). The corrected record is the reason the compass insists on dV2z against the curveball null as the primary statistic and treats everything else as continuity context (source doc).

**Sources kept:** 3 results with jev weight at least 0.5 (mit.edu lec6 0.55, mdpi.com 0.56, ocw.mit.edu 0.50), 2 weak background results labeled in text, plus the source doc as primary source of record.
