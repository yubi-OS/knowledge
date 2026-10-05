# 02. Spherical harmonics as a functional basis on the sphere

Scope: real spherical harmonics as an orthonormal, complete functional basis on the 2 sphere: degrees, span properties, and use as fitting functions in regression.

## The basis and where it is used

Spherical harmonics provide a smooth, orthogonal, and symmetry adapted basis to expand functions on a sphere, and they are used routinely in computer graphics, signal processing, and fields of science ranging from geology onward (https://arxiv.org/pdf/2302.08381v1, weight 0.8487). In acoustic engineering, spherical harmonic expansions are widely used to represent sound fields, with one stated reason being that spherical harmonics form an orthonormal basis for the space of square integrable functions defined on the spherical surface (https://www.jstage.jst.go.jp/article/ast/46/5/46_e25.10/_pdf, weight 0.7726). A reference overview states that the orthonormal basis formed by spherical harmonics is significant because it provides a complete and efficient representation of functions on the unit sphere (https://www.sciencedirect.com/topics/computer-science/spherical-harmonic, weight 0.5427).

## Where the basis comes from

The classical construction asks for the eigenvalues and eigenfunctions of the surface Laplacian; just as in R3 the eigenvectors of a symmetric matrix provide an orthogonal basis for the space, the surface Laplacian supplies an orthogonal basis on the sphere (https://www.igppweb.ucsd.edu/~parker/SIO239/sh.pdf, weight 0.8053). Spherical harmonics satisfy the spherical harmonic differential equation, which is the angular part of Laplace's equation in spherical coordinates (https://mathworld.wolfram.com/SphericalHarmonic.html, weight 0.8139). Group theory supplies the deeper structure: the addition theorem follows almost immediately from the transformation properties of the spherical harmonics under rotation (https://scipp-legacy.pbsci.ucsc.edu/~haber/ph116C/SphericalHarmonics_12.pdf, weight 0.6557).

## What this means for fitting targets

Because spherical harmonics form an orthonormal basis for square integrable functions on the spherical surface (https://www.jstage.jst.go.jp/article/ast/46/5/46_e25.10/_pdf, weight 0.7726), a finite truncation of that basis up to a fixed degree L spans a definite finite dimensional function space. Any target function that lies inside that truncated span can be represented exactly by the expansion; any component outside the truncated span cannot be represented at all, no matter how many samples are provided. This is the span property that makes spherical harmonics useful as a reference arm in a coordinate benchmark: the achievable fit is determined by which harmonics the truncation includes, and the eigenfunction origin of the basis (https://www.igppweb.ucsd.edu/~parker/SIO239/sh.pdf, weight 0.8053) is what makes the truncation degrees meaningful rather than arbitrary.

Fast evaluation matters for instrument status: a 2023 arXiv paper develops fast evaluation of real spherical harmonics and their derivatives precisely because the basis is used so routinely across applications (https://arxiv.org/pdf/2302.08381v1, weight 0.8487). Real spherical harmonics are the variant used when targets are real valued.

## Implications for benchmark design

1. The truncated SH span is exactly characterizable. Given a maximum degree L, the span of the included harmonics is a known function space, so a benchmark designer can state in advance whether a candidate target is representable. The completeness claim for the infinite basis (https://www.sciencedirect.com/topics/computer-science/spherical-harmonic, weight 0.5427) does not transfer to the truncation; only the truncated span is guaranteed.
2. The basis is symmetric adapted and orthogonal (https://arxiv.org/pdf/2302.08381v1, weight 0.8487), so least squares fitting against SH features is well conditioned in a way an arbitrary feature set is not.
3. The basis lives on the sphere itself, not on a flat chart, which is what distinguishes it from tensor product constructions on periodic flat coordinates (see doc 03).

Weak backing section: the Wikipedia and Citizendium spherical harmonics articles scored low in this dig (https://en.wikipedia.org/wiki/Spherical_harmonics, weak backing, weight 0.1533; https://citizendium.org/wiki/Spherical_harmonics, weak backing, weight 0.2153), and two search hits were off topic (https://www.realapp.com/, weight 0.0371; https://www.merriam-webster.com/dictionary/spherical, weight 0.0518). No factual claim above relies on them.
