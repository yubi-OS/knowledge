# 04 - Achromatic coordinates: the Parseval shares

**Scope.** Parseval shares E_lm as scale-free, dimension-invariant (achromatic) coordinates, and the design rule that anything compared across the D-ladder should live in achromatic coordinates.

## What Parseval gives

Parseval's theorem is the energy conservation statement for the Fourier transform: the energy of a signal is preserved, so the sum of squares in the time domain equals the sum of squares in the spectral domain (weight 0.3021, weak, https://en.wikipedia.org/wiki/Parseval%27s_theorem). Proof notes from Imperial College call it the energy theorem and derive it directly from the transform's unitarity, with the left-hand side energy in temporal space and the right-hand side energy in spectral space (weight 0.6082, https://wwwf.imperial.ac.uk/~jdg/eeft3.pdf). A course handout from Imperial College states the same energy-conservation reading for the continuous transform (weight 0.5833, http://www.ee.ic.ac.uk/hp/staff/dmb/courses/E1Fourier/00700_TransformParseval_p.pdf). A 2022 IEEE paper generalizes the statement, showing there is a nonlinear invariant function for the DFT beyond the quadratic energy (weight 0.8658, https://ieeexplore.ieee.org/abstract/document/9729813).

The framework's coordinates are the per-mode energy shares E_lm of a corpus's spherical-harmonic spectrum: because the basis is orthonormal, the 16 shares (l up to 3) sum to 1 at any corpus size N and any embedding dimension d. The shares are what survives Parseval: the energy split across modes is invariant under the transforms that change N and d, which is why the same 16 entries appear at any point of the ladder.

## The achromatic analogy

In optics, an achromatic lens corrects chromatic aberration: it brings two wavelengths to a common focus so the lens's behavior does not depend on the color passing through it (weight 0.1877, weak, https://en.wikipedia.org/wiki/Achromatic_lens). The engineering reference at RP Photonics defines achromatic optics as the family of designs that minimize chromatic aberrations over broad wavelength ranges, using doublets, apochromats, and achromatic waveplates (weight 0.7501, https://www.rp-photonics.com/achromatic_optics.html). A practical design guide covers how achromatic doublets combine elements with different dispersive properties to hold focus across the band (weight 0.5522, https://photonedgeoptics.com/blog/achromatic-doublet-lens-chromatic-aberration-guide/).

The framework mapping: wavelength plays the role of dimension d. A coordinate is achromatic if its value does not change when d changes, the way an achromatic lens's focus does not change when the wavelength changes. The Parseval shares pass this test: they are the same 16 entries at any N and d, and they are scale-free along a fold. That makes them the achromatic coordinates of the is-this-x map, and it grounds the design rule twin to the membership condition: prefer achromatic coordinates for anything compared across the D-ladder.

## Why this matters for the rest of the corpus

Two downstream items depend on this doc:

1. The diffusion-time estimator of doc 08 is "dimension-comparable by construction" precisely because it is built on the achromatic shares; a t-hat fitted on a dimensionful coordinate would not transfer across the ladder.
2. The SLERP fold of doc 07 composes with the achromatic coordinates: making the fold rungs intrinsic to the sphere removes one unit dependence, and the shares remove the remaining scale dependence.

## Sources considered

| result | weight | used |
|---|---|---|
| IEEE linear Parseval theorem | 0.8658 | yes |
| Achromatic optics (RP Photonics) | 0.7501 | yes |
| Imperial Parseval proofs PDF | 0.6082 | yes |
| Imperial transforms course PDF | 0.5833 | yes |
| Achromatic doublet guide | 0.5522 | yes |
| handprint light and the eye | 0.5117 | weak, no |
| Parseval's theorem Wikipedia | 0.3021 | weak, cited as definition |
| Achromatic lenses (Avantier) | 0.3041 | weak, no |
| Achromatic lens Wikipedia | 0.1877 | weak, cited as definition |
| YouTube channel (off topic) | 0.4182 | no |
| TutorialsPoint Parseval | 0.0789 | weak, no |
| Merriam-Webster achromatic | 0.3315 | weak, no |
