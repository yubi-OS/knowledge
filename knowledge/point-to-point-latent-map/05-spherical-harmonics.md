# Spherical harmonic power spectra for point sets on the sphere

**Scope:** Spherical harmonic power spectra for point sets on the 2-sphere: expansion, angular power spectrum, decay under smoothing. The map reports an SH power spectrum of its point cloud on S² beside the Hamming shell spectrum; this doc grounds that idealized side.

## Design context

Once every item sits at a point p on S², the map summarizes the cloud's directional structure with the spherical harmonic (SH) power spectrum: it expands the point set's distribution over the sphere in spherical harmonics up to degree 3 and reports the power E_l per degree l. The design's heat-exponent identity asserts the decay E_l(t) = E_l(0) exp(-2 l (l+1) t), which is the heat-equation smoothing of the sphere whose Laplacian eigenvalues are l(l+1). This doc collects published grounding for the expansion, the power spectrum, and the correlation-function route.

## The spherical harmonic basis

Spherical harmonics are the eigenfunctions of the Laplace-Beltrami operator on the sphere. UCSD graduate lecture notes on spherical harmonics derive the association: the operator's eigenfunctions on the sphere are the functions Y_lm with eigenvalue -l(l+1), with 2l+1 eigenfunctions per degree l (m from -l to l) [https://www.igppweb.ucsd.edu/~parker/SIO239/sh.pdf, weight 0.87]. MathWorld's spherical harmonic entry states the same spectral family and gives the explicit polynomial forms of the low degrees [https://mathworld.wolfram.com/SphericalHarmonic.html, weight 0.75].

The SHTOOLS project, an open-source library for spherical harmonic analysis, documents real spherical harmonics: the real forms are orthonormal on the sphere under a stated normalization, and any square-integrable function on the sphere expands as a sum over degrees and orders with coefficients that can be computed by quadrature [https://shtools.github.io/SHTOOLS/real-spherical-harmonics.html, weight 0.91]. The Wikipedia overview of spherical harmonics appeared twice in the dig with divergent weights (0.11 and 0.86, one entry likely from a mirror); the normative content above carries the claim [https://en.wikipedia.org/wiki/Spherical_harmonics, weights 0.11 and 0.86].

Two course PDFs in the dig (UCSD and UC Santa Cruz) present the same basis construction with the low-degree polynomials worked out explicitly [https://williamsgj.people.charleston.edu/Legendre%20Function.pdf, weight 0.86] [https://scipp-legacy.pbsci.ucsc.edu/~haber/ph116C/SphericalHarmonics_12.pdf, weight 0.71].

## Power spectrum and angular correlation

Given an expansion f = sum_lm a_lm Y_lm, the power per degree is E_l = (1/(2l+1)) sum_m |a_lm|^2, up to normalization convention. SHTOOLS documents this power-spectrum convention for its coefficient arrays [https://shtools.github.io/SHTOOLS/real-spherical-harmonics.html, weight 0.91]. The design's E_l follows the same shape: per-degree mean squared coefficient, so the spectrum says how much of the cloud's angular structure lives at each angular wavelength.

The route from a point cloud to a spectrum goes through an angular correlation function: pair the points, bin by angular separation, and expand the resulting function of separation angle in Legendre polynomials or spherical harmonics. A peer-reviewed Chemical Physics Letters paper performs exactly this expansion for the angular pair correlation function of a point process, deriving the Legendre coefficients from the binned pair counts [https://www.sciencedirect.com/science/article/pii/0009261480806737, weight 0.91]. This is the mathematical template the map's degree-3 spectrum follows: the coefficient of degree l measures whether pairs of items cluster at the corresponding angular scale.

For localized rather than global structure, a Geophysical Journal International paper develops local spherical harmonic power spectra from local magnetic or gravity field data, showing how power spectra can be computed over patches instead of the whole sphere [https://academic.oup.com/gji/article/236/3/1668/7491095, weight 0.54]. The map computes global spectra only, but this source shows the same machinery generalizes when a corpus needs regional views.

## Heat smoothing and the exponent identity

The design asserts E_l(t) = E_l(0) exp(-2 l (l+1) t) for the smoothed spectrum at time t. The basis of this identity is the heat equation on the sphere: smoothing a distribution by the heat kernel multiplies each Laplacian eigenmode by exp(-lambda_l t), and the Laplacian eigenvalue at degree l is l(l+1), derived in the UCSD notes' eigenfunction discussion [https://www.igppweb.ucsd.edu/~parker/SIO239/sh.pdf, weight 0.87]. The factor of 2 in the exponent is a convention of the map's time parametrization and is asserted, not sourced. What the sources certify is the structure: exponential damping per degree, faster at higher degrees, so smoothing collapses fine angular structure first. The map's identity check "exponents ordered" (E_l decays faster for larger l at fixed t) is a direct consequence of the eigenvalue ladder l(l+1) being increasing in l [https://www.igppweb.ucsd.edu/~parker/SIO239/sh.pdf, weight 0.87].

A practical analysis calculator documents the per-degree decomposition as a user-facing product but is not normative for the math [https://metricgate.com/docs/spherical-harmonic-analysis/, weight 0.23, weak backing].

## What the SH side asserts

1. The sphere's Laplacian eigenfunctions are the spherical harmonics with eigenvalue -l(l+1), giving the exponential-in-l structure of any isotropic smoothing [https://www.igppweb.ucsd.edu/~parker/SIO239/sh.pdf, weight 0.87].
2. The per-degree power spectrum E_l is the standard summary of angular structure, computable from coefficients or from binned pair correlations [https://shtools.github.io/SHTOOLS/real-spherical-harmonics.html, weight 0.91] [https://www.sciencedirect.com/science/article/pii/0009261480806737, weight 0.91].
3. Degree truncation at l <= 3 is a coarse summary: it resolves angular scales of roughly a quarter of the sphere and nothing finer, which is precisely the idealization gap the Hamming side of the spectrum table exposes.

## Sources considered

| Source | Weight |
|---|---|
| Real spherical harmonics, SHTOOLS | 0.91 |
| Spherical harmonic expansions of the angular pair correlation function, Chemical Physics Letters | 0.91 |
| Spherical harmonics lecture notes, UCSD (Parker) | 0.87 (0.80 for second entry) |
| Legendre polynomials and spherical harmonics, College of Charleston | 0.86 |
| Spherical harmonics, Wikipedia (two entries) | 0.86 / 0.11 |
| Spherical harmonic, Wolfram MathWorld | 0.75 (0.70 for second entry) |
| The spherical harmonics, UC Santa Cruz | 0.71 |
| Local spherical harmonic power spectra, GJI | 0.54 |
| Spherical harmonic analysis calculator, MetricGate | 0.23 |
