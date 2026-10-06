# 04 - Radial polynomials, recurrences, and the identity-measurement split

Scope: how the Zernike radial polynomials R_n^m are defined and evaluated (factorial closed forms, recurrences, quadrature and interpolation), and what the program's house-style split between identity-type and measurement-type claims means for them. This doc is the corpus's record of what is kernel-checkable about the basis and what is not.

## Closed forms and recurrences

Many references define the radial components of the Zernike polynomials with a function that contains factorials, and Noll's equation 2 is the commonly cited instance (University of Arizona, G. Smith, noul 0.84). The factorial form is exact but numerically delicate: the conventional representation of Zernike radial polynomials gives unsatisfactory results for large values of the degree n, and some methods therefore employ recurrences instead (WSEAS paper on spectral representation, noul 0.63). A practitioner notebook comparing evaluation methods finds two primary approaches differing in both speed and accuracy for the radial part (DESC documentation, Zernike Polynomial Evaluation, noul 0.74).

Modern numerical work goes beyond stable evaluation: a Yale technical report develops quadrature rules and interpolation schemes for Zernike polynomials using a tensor product of equispaced nodes, and introduces new properties of Zernike polynomials in higher dimensions (Yale TR1539, noul 0.90). Reference implementations matter for reproducibility: standard references such as MathWorld describe the polynomials as a set of orthogonal polynomials arising in the expansion of a wavefront function for optical systems with circular pupils (MathWorld, noul 0.79), and expanded sets with arbitrary numbers of higher-order terms appear routinely in raytracing reports (Telescope Optics, noul 0.86).

## The Jacobi identification: recorded but unconfirmed

The program's refs doc states that the Zernike radial polynomials are Jacobi polynomials, calling this standard and pointing at Born and Wolf's appendix. This dig did not surface an independent web source stating that identification in so many words: the sources retrieved cover the factorial closed forms, the recurrences, and the evaluation practice, but none of the kept snippets names the Jacobi connection. This corpus therefore records the identification as a program assertion awaiting its own source pass, not as a dig-confirmed fact. The related Wikipedia article on Jacobi polynomials was retrieved but weighted weak (noul 0.27), below the citation bar, so it does not back the claim.

## What is identity-type

The program's house style (stated in the refs doc of 2026-08-24) separates claims into identity-type and measurement-type. Identity-type claims are exact and kernel-checkable, like the Narayana row checks in section 11 of the program's CurvedCorpus.lean. For the Zernike radial polynomials, the identity-type facts asserted by the refs doc are: exact integer-coefficient closed forms for R_n^m via binomial sums, the normalization R_n^m(1) = 1, and the parity structure of the radial degrees. These are the kind of statements a proof assistant or a small exact-arithmetic test can verify for all n up to a bound, and they are consistent with the factorial-plus-binomial definitions the numerical literature uses (Arizona, noul 0.84; WSEAS, noul 0.63). The dig confirms the algebraic shape (factorial and binomial formulas, recurrences) but not the specific Lean-level identities, which remain the program's own.

## What is measurement-type

Everything downstream of the basis being applied to actual corpus data is measurement-type: any Zernike spectrum of the corpus point distribution, any aberrated-lens delta-J improvement, any classification fit. Per the refs doc, all of these face seeded nulls in CI and are never elevated to theorems. The numerical literature supplies an argument for why this discipline matters specifically for Zernike: evaluation at large degree is numerically unstable in the naive representation (noul 0.63), so a spectrum computed naively could manufacture or destroy apparent signal. Seeded, reproducible pipelines are the audit's answer, and the evaluation-comparison literature (noul 0.74, 0.90) is the practical guide for choosing them.

## Why the split matters here

The split is what lets the corpus use one century-old basis without importing a century of unverifiable claims. The identity-type layer can be checked mechanically and frozen; the measurement-type layer is always re-run against nulls. Doc 07 develops the null side.

## Sources

- Yale TR1539, Zernike Polynomials: Evaluation, Quadrature, and Interpolation (noul 0.90): https://engineering.yale.edu/application/files/3517/3685/9497/TR1539.pdf
- University of Arizona, Zernike Polynomials (noul 0.84): https://webs.optics.arizona.edu/gsmith/Zernike.html
- Telescope Optics, Zernike coefficients (noul 0.86): https://www.telescope-optics.net/zernike_coefficients.htm
- DESC documentation, Zernike Polynomial Evaluation (noul 0.74): https://unalmis.github.io/DESC/notebooks/zernike_eval.html
- MathWorld, Zernike Polynomial (noul 0.79): https://mathworld.wolfram.com/ZernikePolynomial.html
- WSEAS, Zernike Polynomials and their Spectral Representation (noul 0.63): https://wseas.com/journals/eeacs/2021/eeacs2021-001.pdf
- MSU archive, Zernike Polynomial (noul 0.70): https://archive.lib.msu.edu/crcmath/math/math/z/z027.htm
- Wikipedia, Zernike polynomials (noul 0.52): https://en.wikipedia.org/wiki/Zernike_polynomials
