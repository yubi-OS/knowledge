# 04 Calibration gates

Scope: the verification suite: the epsilon_basis orthonormality unit test and its test-bug story, the spectral-mass gate rho >= 0.10, the high-degree mass gate <= 0.40, the holdout R2, and threshold calibration status.

## The gate set

The source doc (yubi-OS/yubiOS skills/hyperspherical-harmonic-curve/SKILL.md) verifies every fit with a named gate set: spectral-mass gate, holdout R2, matched-parameter ablation, and epsilon_basis (source doc, cycle 1 section list; cycle 3 measured values). Cycle 4 closed the last principle-only threshold by empirically validating all thresholds at v2 (source doc, cycle 4).

## epsilon_basis: the orthonormality unit test

The epsilon_basis test checks that the implemented basis is orthonormal by evaluating the Gram matrix on Monte Carlo samples. Two vectors are orthonormal when they are orthogonal unit vectors (weakly backed: https://en.wikipedia.org/wiki/Orthonormality, jev weight 0.32), and an orthonormal basis is a basis whose vectors are pairwise orthogonal with unit length (weakly backed: https://en.wikipedia.org/wiki/Orthonormal_basis, jev weight 0.35). On the sphere the inner product carries the surface measure, so uniform Monte Carlo sampling makes the discrete Gram matrix converge to (1/(4 pi)) times the identity, not the identity itself.

That normalization convention is the story of cycle 3. The v2 implementation compared G to I directly and reported max deviation 0.92, which looked like a basis-implementation bug. The actual bug was in the test: comparing G scaled by 1/(4 pi) to I gives a max deviation of 0.0163 on 32768 Monte Carlo samples (source doc, cycle 3). The basis was orthonormal all along. The skill records this as a discipline: a failing orthonormality test has two candidate culprits, the basis and the test's normalization, and the test must be checked first because the measure-weighted convention is easy to get wrong.

## The spectral-mass gate rho >= 0.10

The gate asks whether the fitted coefficient tensor actually puts spectral mass on the sphere representation, measured rho = 0.9774 on Phase 1 and 0.9830 on Phase 2 against a floor of 0.10 (source doc, cycle 3). The physics analogue is the angular power spectrum: in harmonic expansions of fields on the sphere, the quantity l(2l+1)C_l/(4 pi) gives the fluctuation power per logarithmic interval of angular scale, and C_l quantifies how much correlation power sits at each angular separation (weakly backed: https://wwwmpa.mpa-garching.mpg.de/~komatsu/presentation/imprs2020-4.pdf, jev weight 0.46). Modern cosmology pipelines model such power-spectrum multipoles through spherical harmonic expansions as a matter of course (weakly backed: https://arxiv.org/html/2404.04812v2, jev weight 0.48). The gate transplants that idea: a corpus fit whose spectral mass concentrates in the lowest modes may be underfitting corpus structure, and the floor exists to catch that.

## The high-degree mass gate <= 0.40

The complementary gate bounds the mass in high-degree modes: measured 0.2059 and 0.1782 against a ceiling of 0.40 (source doc, cycle 3). The spherical-harmonic literature connects high-degree content to localized, multipole-like structure: spherical harmonics represent multipole fields, and the degree index corresponds to angular frequency (weakly backed: https://en.wikipedia.org/wiki/Spherical_harmonics, jev weight 0.51; the one strong-weighted external source in this corpus's dig set). A ceiling on high-degree mass is the sphere version of a high-frequency cutoff: it rejects fits that chase per-file noise with rapidly oscillating basis functions.

## Holdout R2 and the threshold calibration record

The holdout R2 check completes the set: fit on one split, score on held-out points, so the gates measure generalization rather than in-sample memorization. The measured holdout R2 values feed directly into the Phase 1 and Phase 2 ablation accounting in doc 03. Cycle 4's threshold calibration note closes the loop: the rho floor, the high-degree ceiling, the cross-ratio tolerance, and the ablation decision bands are all empirically validated at v2, no longer principle-only (source doc, cycle 4). Any future gate added to this suite should arrive with its own measured calibration, not an argued constant.
