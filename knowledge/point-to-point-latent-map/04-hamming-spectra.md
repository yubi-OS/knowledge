# Krawtchouk polynomials and the Hamming spectrum

**Scope:** Krawtchouk polynomials and the Hamming association scheme: spectra of binary data and the hypercube graph. The map reports a shell-occupancy spectrum on the Hamming cube beside its spherical spectrum; this doc grounds the algebra of that side-by-side comparison.

## Design context

The binarized corpus lives in {0,1}^d, the vertices of the d-dimensional hypercube. Its natural geometry is the Hamming metric: the distance between two items is the number of coordinates where they differ. The map computes each item's Hamming shell k (the number of 1 bits, in 0..d) and reports the shell occupancy distribution as one of two spectra. The other spectrum is the spherical harmonic power spectrum on S², an idealization; the design follows the rule that the sphere spectrum is the harsher of the two. This doc collects the published algebra of the Hamming side.

## The hypercube graph and its spectrum

The hypercube graph Q_n has the 2^n binary strings of length n as vertices, with an edge between strings differing in exactly one coordinate. Yale lecture notes on algebraic graphs derive the spectrum: Q_n is the Cartesian product of n copies of K_2, its adjacency eigenvalues are n minus 2k for k = 0..n, and the eigenvalue n - 2k has multiplicity C(n, k), the binomial coefficient [https://www.cs.yale.edu/homes/spielman/eigs/lect12.pdf, weight 0.91]. The lecture also derives the same spectrum through the cut-counting interpretation of hypercube edges.

A peer-reviewed paper on the spectral properties of hypercubes compiles the applications of this spectrum, including mixing behavior of random walks on the cube and eigenvalue-based bounds [https://www.sciencedirect.com/science/article/pii/S0377042721001709, weight 0.92]. A monograph on the spectral graph theory of the hypercube covers the same ground at book length and is available in the Internet Archive [https://archive.org/details/spectralgraphory109453852, weight 0.73].

Wikipedia's hypercube graph article states the same basic facts (2^n vertices, n-regular, bipartite, spectrum n - 2k with multiplicity C(n,k)) but the dig weighted it 0.19; the peer-reviewed and lecture sources above carry the claim [https://en.wikipedia.org/wiki/Hypercube_graph, weight 0.19, weak backing]. A Math StackExchange derivation walks the eigenvector construction by hand [https://math.stackexchange.com/questions/300105/how-to-find-the-spectrum-of-the-hypercube, weight 0.09, weak backing].

## Krawtchouk polynomials and the Hamming scheme

The Hamming association scheme H(d, 2) has the binary strings as its vertices and d relations, one per Hamming distance. Its adjacency matrices commute and simultaneously diagonalize, and the eigenvectors can be indexed by subsets of coordinates. Krawtchouk polynomials are the eigenvalue polynomials of this scheme: the eigenvalue of the distance-i relation on the class indexed by a size-j subset is the degree-i Krawtchouk polynomial K_i(j) in d.

The dig surfaced recent research formalizing this connection in generalized form: a 2026 Springer Journal of Algebraic Combinatorics paper studies bivariate affine q-Krawtchouk polynomials and the association schemes they generate, situating the classical univariate Krawtchouk family as the q = 2 Hamming-scheme case [https://link.springer.com/article/10.1007/s10801-026-01580-1, weight 0.64]. The same work is available as an arXiv preprint with the construction spelled out [https://arxiv.org/abs/2607.21913, weight 0.45] and as a Springer PDF [https://link.springer.com/content/pdf/10.1007/s10801-026-01580-1.pdf, weight 0.86]. A Taylor and Francis paper treats generalized Krawtchouk polynomials and their composition schemes [https://www.tandfonline.com/doi/abs/10.1080/09720529.2020.1721608, weight 0.86].

Wikipedia's Kravchuk polynomials article (alternative transliteration) gives the generating function and orthogonality relations but weighted 0.08 in the dig [https://en.wikipedia.org/wiki/Kravchuk_polynomials, weight 0.08, weak backing]; the peer-reviewed sources above carry the load.

## Why the shell spectrum is the weaker idealization

The hypercube spectrum is exactly solvable: eigenvalues n - 2k with binomial multiplicities. That solvability is what makes the shell occupancy distribution a cheap, honest diagnostic: the map can compare the observed count of items in each shell against the binomial null that a margin-free random matrix would give, and against the fixed-margin null that its curveball sampler draws. What the shell spectrum cannot see is geometry beyond the Hamming metric: two items at Hamming distance 3 sit at the same relation regardless of which coordinates differ.

The spherical spectrum on S², by contrast, distinguishes directions and is the harsher idealization in the design's ordering: a corpus that looks well-mixed in shell counts can still be anisotropic on the sphere. The two spectra are reported side by side for exactly this reason. The spherical side is treated in the spherical harmonics doc.

## What the Hamming side asserts

1. The hypercube's adjacency spectrum is n - 2k with multiplicity C(n, k), derived in standard lecture notes and compiled in the peer-reviewed spectral properties literature [https://www.cs.yale.edu/homes/spielman/eigs/lect12.pdf, weight 0.91].
2. Krawtchouk polynomials are the eigenvalue functions of the Hamming association scheme, the algebraic backbone of any Hamming-metric spectral report [https://link.springer.com/article/10.1007/s10801-026-01580-1, weight 0.64].
3. Shell occupancy is a projection of the data onto the distance-only structure of the cube; it is cheap and exact, and it under-resolves direction, which is why the map never reports it alone [https://www.sciencedirect.com/science/article/pii/S0377042721001709, weight 0.92].

## Sources considered

| Source | Weight |
|---|---|
| Spectral properties of hypercubes with applications, ScienceDirect | 0.92 |
| Algebraic graphs / hypercubes lecture, Yale (Spielman) | 0.91 |
| Bivariate affine q-Krawtchouk polynomials PDF, Springer | 0.86 |
| Generalized Krawtchouk polynomials and the composition scheme, Taylor and Francis | 0.86 |
| Bivariate affine q-Krawtchouk polynomials, Springer JoAC | 0.64 |
| Spectral graph theory of the hypercube, Internet Archive | 0.73 |
| Bivariate affine q-Krawtchouk arXiv preprint | 0.45 |
| Hypercube graph, Wikipedia | 0.19 |
| Spectral graph theory of the hypercube, ResearchGate | 0.17 |
| Kravchuk polynomials, Wikipedia | 0.08 |
| Hypercube spectrum, Math StackExchange | 0.09 |
