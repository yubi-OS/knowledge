# 06 - Spherical Harmonics Software Pitfalls

Scope: numerical implementation pitfalls: scipy.special.sph_harm deprecation and the sph_harm_y argument-order/convention pinning, coverage gaps in lie_learn and e3nn, and pre-fit epsilon_basis validation on a Monte Carlo sample.

## The scipy deprecation and the new API

scipy.special.sph_harm is deprecated since SciPy 1.15.0 and scheduled for removal in SciPy 1.17.0, with scipy.special.sph_harm_y named as the replacement (https://docs.scipy.org/doc/scipy-1.16.1/reference/generated/scipy.special.sph_harm.html, weight 0.94). The migration is not a rename: sph_harm_y has a different call signature, which library users had to track through the deprecation window (https://scipython.com/blog/visualizing-the-real-forms-of-the-spherical-harmonics/, weight 0.58). Downstream projects logged the breakage as they migrated (https://github.com/pyfar/spharpy/issues/83, weak backing, weight 0.09). The general SciPy guidance for upgrades is to run code with deprecation warnings enabled and check for DeprecationWarning instances before the removal lands (https://docs.scipy.org/doc/scipy/release/1.14.0-notes.html, weight 0.77).

## Argument order and convention pinning

The sph_harm_y manual is explicit that the convention trap is real: in SciPy, theta is the polar angle and phi is the azimuthal angle, while it is common elsewhere to see the opposite convention, theta as azimuthal and phi as polar (https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.sph_harm_y.html, weight 0.95). The same page documents that SciPy's spherical harmonics include the Condon-Shortley phase, another axis on which implementations disagree silently. A swapped-argument bug does not raise: the fit proceeds and returns coefficients for a rotated, reflected, or phase-flipped basis.

The yubiOS design record therefore pins the library and the convention: use sph_harm_y, assert the argument order explicitly in the call site, and validate the assembled basis before fitting with epsilon_basis below 1e-3 on a 4096-point Monte Carlo sample on S2 (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05). The pre-fit check exists because basis errors are invisible to downstream fit diagnostics; doc 04's verification stack catches fit-level degradation but not a wrong basis.

## What the alternative libraries cover

e3nn provides spherical harmonics as equivariant building blocks for neural networks, with normalization options and unit-vector projection onto the sphere before projection onto the harmonics (https://docs.e3nn.org/en/stable/api/o3/o3_sh.html, weight 0.80). Its harmonics are the S2 family; the design record states that e3nn does not implement S3 harmonics (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05), consistent with the library's S2-focused API surface.

lie_learn is a Python package for computations involving Lie groups and manifolds, documented as covering mainly the sphere S2 and the rotation group SO3, written to support machine-learning projects such as harmonic exponential families (https://github.com/AMLab-Amsterdam/lie_learn, weight 0.58). The design record draws the same coverage conclusion: lie_learn does not implement S3 harmonics, so an N=3 basis would have to be hand-rolled, which the record rejects as unsafe without a pre-fit epsilon_basis validation (same record).

Community explorations of spherical harmonics as an equivariant basis for functions on the sphere, including numerical harmonic transforms, exist as reference implementations for the S2 case (https://github.com/brian-hepler-phd/Spherical-CNN, weak backing, weight 0.55). The general background on where spherical harmonics appear (multipole expansions, electron configurations, gravitational and magnetic fields) is standard reference material (https://en.wikipedia.org/wiki/Spherical_harmonics, weak backing, weight 0.17 in this query's entry).

## Practical checklist

Combining the sources, the implementation checklist the design record encodes is (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05; library facts from the URLs above):

1. Call sph_harm_y, not sph_harm; the old name is on a removal path in SciPy 1.17.0.
2. Assert argument order at the call site; theta polar, phi azimuthal in SciPy's convention.
3. Record the phase convention; SciPy includes the Condon-Shortley phase.
4. Pre-fit validation: epsilon_basis below 1e-3 on a 4096-point Monte Carlo sample.
5. For N=3, expect no off-the-shelf basis from lie_learn or e3nn; treat a hand-rolled S3 basis as unvalidated until the Monte Carlo check passes.

SciPy itself remains the umbrella library for the optimization, integration, and eigenvalue machinery around the fit (https://scipy.org/, weight 0.79).
