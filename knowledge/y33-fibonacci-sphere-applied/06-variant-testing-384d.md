# Variant Testing at 384-D

Scope: why the native (l=3) 384-lobe basis failed the PC1+PC2 gate at 0.0156, how raising l to 128 or 384 fixes it, and the chosen (l=384, m=3, sin^384 polar) variant.

## The failure

The native basis, Y_3^3 evaluated with m running 3..384 step 3 and the sin^3 theta polar factor, fails the gate with PC1+PC2 = 0.0156 (internal ref: refs/y33-fibonacci-sphere-applied-2026-08-07.md). The recorded mechanism is the polar factor: sin^3 theta vanishes at the poles and peaks near the equator, leaving the 384 azimuthal lobes under-distinguished once PCA projects the basis values to 2-D.

The mathematics behind the mechanism is elementary but worth grounding. Spherical harmonics live on the sphere with the solid-angle measure d omega = sin theta d theta d phi, as the UCSC notes record alongside the orthonormality relation (https://scipp-legacy.pbsci.ucsc.edu/~haber/ph116C/SphericalHarmonics_12.pdf, weight 0.68). Any sin^N theta envelope with N >= 1 decays fastest away from the equator simply because 0 <= sin theta <= 1, and the decay sharpens as N grows. The convention care the reference literature insists on, theta as polar coordinate and phi as azimuthal (https://mathworld.wolfram.com/SphericalHarmonic.html, weight 0.86; same entry at 0.82 via the Wikipedia companion result), is exactly what the variant testing turns on: the polar exponent and the azimuthal order are separable knobs, and the native basis pins them to (l=3, m up to 384).

## The fix

Raising l to 128 or 384 sharpens the polar contrast: sin^128 theta and sin^384 theta peak much more sharply near the equator, giving the azimuthal lobes clear 2-D separability on S2 (internal ref: refs/y33-fibonacci-sphere-applied-2026-08-07.md). Three variants were tested in the 384-D rebuild, and the chosen variant is (l=384, m=3, sin^384 polar), which reaches PC1+PC2 = 1.0000, the boundary value where two principal components fully explain the variance (internal ref: refs/y33-fibonacci-sphere-applied-2026-08-07.md).

The reading that makes this a gate result and not a curiosity: PCA projects the basis into 2-D for inspection, and a basis whose values collapse into a nearly unexplained 2-D projection (0.0156) tells an auditor almost nothing, while a basis whose projection carries all the variance (1.0000) makes the azimuthal structure directly visible. This is the standard use of explained variance: the proportion of variance each component explains is the key interpretive output of a PCA (https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/multivariate/pca/interpret-the-key-results, weight 0.82), and the goal of dimensionality reduction is to move to a lower-dimensional space while maintaining as much information as possible (https://www.jeremyjordan.me/principal-components-analysis/, weight 0.60). Stanford course notes frame the same question as how many principal components are enough (https://web.stanford.edu/class/stats202/notes/Unsupervised/PCA.html, weight 0.83).

## Why this is specific to l, not m

The applied doc is explicit that both orderings were tested ((l=128, m=256) and (l=256, m=128)) and that this testing became Constraint 5 in rsi-phi-skill (internal ref: refs/y33-fibonacci-sphere-applied-2026-08-07.md). The functional forms of the harmonics, including their behavior as functions of the polar angle, are tabulated in the standard references (https://phys.libretexts.org/Bookshelves/Quantum_Mechanics/Introductory_Quantum_Mechanics_(Fitzpatrick), weight 0.75; spherical harmonics as functions on the sphere surface: https://brilliant.org/wiki/spherical-harmonics/, weight 0.72), so re-deriving an envelope change is a bounded check, not an open research question.

## Honest limits

The 0.0156 and 1.0000 values are the project's own measurements; no external source reproduces them, and this doc does not claim they generalize beyond the 384-D corpus basis. What the external sources support is the mechanism (the polar envelope behavior) and the evaluation method (explained variance as the interpretive lens), not the specific numbers.

## Sources considered

| source | weight |
|---|---|
| https://mathworld.wolfram.com/SphericalHarmonic.html | 0.86 |
| https://web.stanford.edu/class/stats202/notes/Unsupervised/PCA.html | 0.83 |
| https://en.wikipedia.org/wiki/Spherical_harmonics | 0.82 |
| https://phys.libretexts.org/Bookshelves/Quantum_Mechanics/Introductory_Quantum_Mechanics_(Fitzpatrick) | 0.75 |
| https://brilliant.org/wiki/spherical-harmonics/ | 0.72 |
| https://scipp-legacy.pbsci.ucsc.edu/~haber/ph116C/SphericalHarmonics_12.pdf | 0.68 |
| https://www.geeksforgeeks.org/data-analysis/principal-component-analysis-with-python/ | 0.67 |
| https://www.jeremyjordan.me/principal-components-analysis/ | 0.60 |
| https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/multivariate/pca/interpret-the-key-results | 0.82 |
| https://en.m.wikipedia.org/wiki/Sine_and_cosine | 0.20 (weak, not cited) |
| https://en.wikipedia.org/wiki/Principal_component_analysis | 0.20 (weak, not cited) |
| https://www.geeksforgeeks.org/data-analysis/principal-component-analysis-pca/ | 0.12 (weak, not cited) |
| https://www.pca.org/ | 0.10 (off-topic, not cited) |
