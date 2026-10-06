# 05 - Disk versus sphere: the pre-lift and post-lift spectral bases

Scope: the two orthogonal bases that bracket the program's stereographic lift, Zernike polynomials on the unit disk and spherical harmonics on the sphere, and what a comparison of their spectra can and cannot isolate. This is the corpus's record of the structural fact behind program slot 3.

## The two bases

On the sphere side: spherical harmonics form a complete set of orthogonal functions on spherical domains and arise from solving Laplace's equation there; standard tabulations list the harmonics and their properties (Wikipedia, Spherical harmonics, noul 0.84 and 0.80). On the disk side: Zernike polynomials are polynomials in two variables orthogonal on the unit disk with respect to the Lebesgue measure (ScienceDirect, Approximation via gradients on the ball, noul 0.93), and the disc polynomials generalize the family to higher dimensions (ScienceDirect, Generalized Zernike or disc polynomials, noul 0.94).

Both systems predate their modern formalizations in analysis: the Zernike polynomials were introduced by Zernike in 1934 for optics applications (arXiv 1902.08017, noul 0.72), and the modern mathematical literature underlines their role in integrable and superintegrable systems with a wide bibliography (mathphys.uva.es, noul 0.90).

## The program's structural claim (slot 3)

The program's refs doc makes this the core structural argument: the corpus lives on the PCA disk BEFORE the stereographic lift, while the 16 spherical harmonics only exist after it. Zernike polynomials are therefore the canonical orthogonal system on the pre-lift disk, and the Zernike spectrum of the corpus point distribution is the pre-lift twin of the E_lm Parseval shares computed post-lift. Comparing the two spectra isolates the lift's own footprint, which is exactly the dependence the is-this-x paper built the Hodge channel to avoid; a Zernike channel would measure that dependence instead of dodging it. The refs doc adds the admission rule: every Zernike share coordinate faces the curveball null with a z > 3 threshold or is inadmissible.

What this dig confirms is the mathematics each half of the comparison needs: a complete orthogonal basis on the disk (noul 0.93, 0.94) and a complete orthogonal basis on the sphere (noul 0.84). Both expansions produce coefficient spectra of a fixed distribution, so a difference of spectra is a well-defined comparison once both bases are normalized. The program's specific claim about the lift's footprint, that the comparison isolates it, is the program's own inference and is recorded as such: the sources establish the two spectra, not the interpretation of their difference.

## Why bases matter before the lift

The general point, that the choice of orthogonal basis determines what a spectral analysis sees, is visible in applied practice. In experimental fluid data, a global modal decomposition is used because dominant flow structures are not always obvious and dynamics may be chaotic, multimodal, and intermittent (Springer, cloud cavitation study, noul 0.67). In point-cloud engineering, orthogonal-basis expansions are the transport representation of choice for depth-sensor data (arXiv 2512.03819, noul 0.72). These are analogies, not evidence about the corpus, but they show the practice is routine: expand in a basis, read the spectrum, compare against a null.

## The disk-side discipline

One asymmetry is worth recording. The program already has a post-lift spectral channel with an admission protocol (the 16 spherical harmonics with null controls). A pre-lift Zernike channel would be new instrumentation, and the refs doc is explicit that it inherits the same membership condition rather than getting grandfathered in. The sources in this doc supply the basis and the orthogonality; doc 07 supplies the null machinery the new channel would face.

## Sources

- ScienceDirect, Approximation via gradients on the ball, the Zernike case (noul 0.93): https://www.sciencedirect.com/science/article/pii/S0377042723002029
- ScienceDirect, Generalized Zernike or disc polynomials (noul 0.94): https://www.sciencedirect.com/science/article/pii/S0377042704001852
- Wikipedia, Spherical harmonics (noul 0.84, 0.80): https://en.wikipedia.org/wiki/Spherical_harmonics
- mathphys.uva.es, Zernike functions paper (noul 0.90): https://mathphys.uva.es/files/2019/08/zernike.pdf
- arXiv 1902.08017 (noul 0.72): https://arxiv.org/pdf/1902.08017
- Springer, data-driven spatiotemporal analysis of cloud cavitation (noul 0.67): https://link.springer.com/article/10.1007/s00348-024-03949-z
- arXiv 2512.03819, orthogonal-basis wireless point cloud transmission (noul 0.72): https://arxiv.org/pdf/2512.03819
