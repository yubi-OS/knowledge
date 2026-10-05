# 01. The gauge-free Rayleigh Z_m statistic

Scope: what the Rayleigh family of angular-uniformity statistics measures, why the Z_m form is rotation-invariant and bin-free, and why the azimuth trial used it instead of binned sector counts.

## What the Rayleigh test measures

The Rayleigh test is the standard nonparametric test of uniformity for directional (circular) data. It computes the mean resultant length of the observed angles and tests whether that length is larger than expected under uniformity; a large mean resultant length means the angles cluster, and the test rejects uniformity ([Astropy docs, w 0.85](https://docs.astropy.org/en/stable/api/astropy.stats.rayleightest.html); [R circular package, w 0.76](https://rdrr.io/cran/circular/man/rayleigh.test.html)). The same construction appears across the R ecosystem under slightly different names: `rayleigh_test` in tectonicr ([CRAN reference, w 0.83](https://search.r-project.org/CRAN/refmans/tectonicr/html/rayleigh_test.html)) and `rayleigh` in the Directional package ([CRAN reference, w 0.62](https://rdrr.io/cran/Directional/rayleigh.html)). A course-textbook treatment with the test's derivation and its exact small-sample form is the UBC astrostatistics chapter on the Rayleigh test ([UBC chapter 9 PDF, w 0.80](https://www.astro.ubc.ca/people/jvw/ASTROSTATS/Answers/Chap9/chapter%209%20rayleigh%20test.pdf)).

The key quantity behind all of these is the first moment of the angle distribution, the mean resultant vector. Directional statistics references treat the resultant length as the fundamental summary of concentration for angular data ([Wikipedia: Directional statistics, w 0.80](https://en.wikipedia.org/wiki/Directional_statistics)).

## The harmonic family Z_m

The azimuth trial generalized this from m = 1 to the harmonic family

```
Z_m = N * |(1/N) * sum_j exp(i m phi_j)|^2
```

for m = 1, 2, 3, 4, 6, 12, reported against an empirical null with a plus-one tail, no Gaussian translation (source record: azimuth-trial-2026-09-19, section 1). This is the standard second-order (multi-harmonic) extension of the Rayleigh test idea: instead of only asking whether the first moment of the angles vanishes, ask whether the m-th Fourier mode of the angular distribution has power ([UBC chapter 9 PDF, w 0.80](https://www.astro.ubc.ca/people/jvw/ASTROSTATS/Answers/Chap9/chapter%209%20rayleigh%20test.pdf) covers the m = 1 case and its exact null; the harmonic family follows the same construction).

Each higher harmonic m tests for m-fold angular clustering rather than simple concentration. m = 1 detects clumping toward one direction; m = 3 detects three-fold symmetry; m = 12 detects twelve-fold symmetry. The trial's hypothesis space was exactly this: any angular periodicity in how documents land on the placement plane.

## Why the statistic is gauge-free

Two invariances make Z_m suitable as a corpus diagnostic, and both matter because the placement plane's orientation is arbitrary.

1. Global rotation. A global rotation of the placement plane by angle alpha multiplies each term exp(i m phi_j) by exp(i m alpha), so the whole sum acquires one unit-modulus factor exp(i m alpha). The modulus, and therefore Z_m, is unchanged. Mean resultant lengths are likewise rotation-invariant summaries of angular data ([Wikipedia: Directional statistics, w 0.80](https://en.wikipedia.org/wiki/Directional_statistics)).
2. Axis sign flips. Flipping the sign of one placement axis conjugates the angles (phi -> -phi), conjugating each exp(i m phi_j) term. Conjugation preserves every modulus, so Z_m is again unchanged.

Consequence: Z_m cannot fire on an artifact of how the PCA plane happened to be oriented, whereas a binned sector statistic can. The trial's source record states this design rationale directly: "bin-free and rotation-invariant, because the sector index is neither" (source record: azimuth-trial-2026-09-19, section 1). A sector count with fixed origin and width changes when the chart rotates; Z_m does not.

## The empirical null discipline

The trial reported every Z_m against a refit empirical null: each null draw of the data got its own placement PCA2 rather than being projected through the frame fitted on the real data. Placing null draws through the real data's fitted frame would hand the real corpus an in-sample advantage by construction (source record, section 1: the "in-sample R-squared = 1.0000 trap"). This is the same logic bootstrap and permutation treatments of PCA apply when they emphasize resampling the whole pipeline, not just scoring through a fixed fit ([Princeton lecture on bootstrap and permutation tests, w 0.63](https://pillowlab.princeton.edu/teaching/mathtools16/slides/lec21_Bootstrap.pdf); [arXiv: exact bootstrap PCA, w 0.91](https://arxiv.org/pdf/1405.0922v1)).

Tails were plus-one empirical tails at resolution 1/(K+1) with K = 40 or K = 200 draws, two independent seeds. No rates, no Gaussian translation of the tail (source record, section 7).

## Why this statistic survived while the channel did not

The verdict of the trial was not that Z_m is a bad instrument. It is that the instrument was applied at the wrong chart and on an atomized corpus (source record, sections 3 to 5). The statistic itself is gauge-free, refit-nulled, and exact at the tail resolution it reports. The failure modes the trial identified, atomicity manufacturing a false m = 1 positive and the identity chart being blind to the m = 3 structure, are properties of the input and the chart, not of Z_m. That distinction is what leaves Rayleigh Z_m (for m >= 2) standing at the end of the record as the recommended corpus-level angular readout, alongside the angular gap spectrum, with circular variance explicitly excluded (source record, section 6, item 4).
