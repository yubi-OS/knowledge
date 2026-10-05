# 07. The Krawtchouk spectrum of the binary Hamming scheme

Scope: the exact spectral decomposition of a {0,1}^d corpus over the Hamming association scheme, and why the record ranks it the chart-free alternative to angular statistics.

## The setting: a binary corpus is a multiset on a hypercube

A corpus of d-bit patterns is a function on the vertices of the d-dimensional hypercube {0, 1}^d. The trial's fixture lives at d = 9, so its state space has 512 vertices (source record: azimuth-trial-2026-09-19, sections 3 and 6). The Hamming association scheme H(d, 2) is the algebraic structure on exactly this vertex set: two vertices are in relation i when their Hamming distance is i, with relations 0 through d ([MathWorld: Hamming Scheme, w 0.35, weak](https://mathworld.wolfram.com/HammingScheme.html); [Wikipedia: Hamming scheme, w 0.41, weak](https://en.wikipedia.org/wiki/Hamming_scheme)). Association schemes are the standard algebraic skeleton for coding-theory distance questions ([Springer: The Association Schemes of Coding Theory, w 0.89](https://link.springer.com/content/pdf/10.1007/978-94-010-1826-5_7.pdf); [Wikipedia: Association scheme, w 0.22, weak](https://en.wikipedia.org/wiki/Association_scheme)).

The weak weightings on the two definitional sources reflect the mint's preference for primary treatments; the Springer coding-theory chapter at w 0.89 is the authoritative source for both the scheme and its role in coding theory.

## Krawtchouk polynomials as the spectrum

The eigenspaces of the Hamming scheme are spanned by Krawtchouk polynomials: the functions that diagonalize the distance-i adjacency operators of the hypercube ([Wikipedia: Kravchuk polynomials, w 0.77](https://en.wikipedia.org/wiki/Kravchuk_polynomials)). Delsarte's linear-programming theory of codes is built on this fact: Krawtchouk values appear as the eigenvalues of the Hamming scheme's adjacency matrices, and the LP bound for codes is an optimization over Krawtchouk-weighted polynomials ([UT Austin lecture notes: Linear programming bounds for codes via a covering argument, w 0.82](https://www.cs.utexas.edu/~danama/courses/codes/lec8-LP-bound.pdf)). On the analysis side, the same polynomials are the Fourier basis for functions on the Boolean cube: the Fourier expansion of a function f: {0,1}^d -> R runs over characters indexed by subset size k, and the Krawtchouk polynomials govern how distance statistics mix across levels ([UCSD CSE 291 lecture notes: Fourier analysis, the basics, w 0.51](https://cseweb.ucsd.edu/~slovett/teaching/WI17-CSE291/1-basics.pdf)).

## What the record claims for it

The record's reignition path 3 (source record, section 6, item 3): a {0,1}^9 corpus decomposes exactly over H(9, 2); azimuth is a lossy shadow of a Krawtchouk-mode pattern. The properties it lists are:

- Exact. The decomposition is finite and algebraic, not an asymptotic approximation. Every function on 512 vertices is a finite sum of Krawtchouk-basis components ([Springer: The Association Schemes of Coding Theory, w 0.89](https://link.springer.com/content/pdf/10.1007/978-94-010-1826-5_7.pdf)).
- Finite. 512 vertices, d + 1 = 10 levels, exact arithmetic.
- Chart-free. No placement plane, no PCA, no Moebius chart. The statistic lives on the cube, so the chart-dependence problem (doc 05) does not arise. This matters because the record's entire surviving path runs through chart choice; the Krawtchouk route is the one path that removes the chart from the question rather than optimizing it.
- Gauge-free. No rotation, no origin, no arbitrary bin edges, for the same reason: the Hamming metric is intrinsic to the bit patterns ([MathWorld: Hamming Scheme, w 0.35, weak](https://mathworld.wolfram.com/HammingScheme.html)).
- The fixed-margin null runs on it directly. The checkerboard-switch null used throughout the trial (source record, sections 2 and 3) preserves row and column margins of the bit matrix, so a spectral statistic over {0,1}^9 can be nulled by the same machinery without a placement step.

## Why "lossy shadow"

The word lossy in the record's sentence carries the key limitation. A Krawtchouk mode is a function of the whole bit pattern; the azimuth is a function of the two placement scores, which are themselves functions of the pattern through a projection. Going from the exact spectral object to a single angle on a plane discards information. So the Krawtchouk route does not recover the azimuth as such. It offers an exact, chart-free alternative in which any angular regularity the azimuth was shadowing should appear as structure in the spectrum.

The relationship is the same kind of correspondence the binary-embedding literature exploits: statistics on projected binary vectors can be studied through the exact geometry of the ambient cube, where the analysis is finite and lossless ([arXiv: The High-Dimensional Geometry of Binary Neural Networks, w 0.88](https://arxiv.org/pdf/1705.07199.pdf); [Springer: Binary Vectors for Fast Distance and Similarity Estimation, w 0.85](https://link.springer.com/article/10.1007/s10559-017-9914-x)).

## Where it sits among the reignition paths

The record orders five paths (source record, section 6). The Krawtchouk spectrum is path 3, after the powered lens (path 1, doc 05) and the continuous placement as second coordinate (path 2, doc 08), and before retiring the sector index as a statistic (path 4, doc 01) and the retrieval-only use (path 5). Its distinctive virtue relative to paths 1 and 2 is the absence of fitting: no six-parameter chart to guard, no selection null needed, no eigengap fragility. Its distinctive cost is that it abandons the angular framing entirely and asks the corpus's spectral question in its native algebra.

Applied coding-theory work continues to use Krawtchouk polynomials as the workhorse for binary-code questions, which keeps the machinery and its literature accessible ([Springer: Infinite families of minimal binary codes via Krawtchouk polynomials, w 0.30, weak](https://link.springer.com/article/10.1007/s10623-023-01353-y); [ResearchGate preprint version, w 0.52](https://www.researchgate.net/profile/Rene_Rodriguez-Aldama/publication/373160953_Infinite_families_o)).
