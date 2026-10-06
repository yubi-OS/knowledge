# 01 - Zernike basis fundamentals

Scope: what the Zernike polynomials are as a mathematical object (an orthogonal polynomial system on the unit disk), where they came from (Zernike 1934), and how the standard indexing and normalization were fixed (Noll 1976). This is the foundation layer the rest of the corpus stands on: before Zernike polynomials can be an audit instrument for a point distribution on a disk, the basis itself has to be pinned down.

## Definition and orthogonality

The Zernike polynomials are two-dimensional orthogonal polynomials over the unit disc, the interior of the unit circle with 0 <= r < 1, expressed in polar coordinates (Koornwinder's disc-polynomial paper, ScienceDirect, noul 0.97). A survey formulation states the same fact in optics language: the Zernike polynomials are a complete set of continuous functions orthogonal over a unit circle, first developed by Zernike in 1934 (ResearchGate review, noul 0.70). Orthogonality on the disk with respect to the Lebesgue measure is the modern functional-analytic restatement: "Zernike polynomials are polynomials in two variables which are orthogonal on the unit disk with respect to the Lebesgue measure" (ScienceDirect, Approximation via gradients on the ball, noul 0.93).

A reference chapter describes them as "a set of polynomials, defined on the unit circle," used there to describe the wavefront of a Ti:Sa laser pulse (Springer chapter, noul 0.89). The standard tabulation orders the first 21 polynomials by radial degree n and azimuthal order (Wikipedia, Zernike polynomials, noul 0.55, weak-ish but consistent with the other sources here).

## Origin: Zernike 1934

The presently known Zernike polynomials were introduced by Zernike in 1934 due to their possible applications in optics; they are now a main ingredient of the theory of orthogonal systems on the disk and of integrable and superintegrable systems (Zernike functions paper, mathphys.uva.es, noul 0.92). An independent review repeats the 1934 origin and the wide subsequent uptake (ResearchGate, noul 0.70). The 1934 Physica paper itself was not directly retrievable in this dig; the two secondary confirmations above carry the dating.

## Noll 1976: indexing and normalization

The canonical modern reference is Robert J. Noll, "Zernike polynomials and atmospheric turbulence," Journal of the Optical Society of America 66 (3), 207 to 211, 1976 (Optica Publishing Group issue and abstract pages, noul 0.89 and 0.87). That paper discusses general properties of the polynomials including their Fourier transforms, integral representations, and derivatives, and gives a Zernike representation of the wavefront through atmospheric turbulence (abstract page, noul 0.89).

One detail matters for anyone implementing the basis: Noll's polynomials are "slightly different than the usual set in that a different normalization is used. The normalization chosen is convenient" for his turbulence application (Noll PDF mirror, noul 0.73). This is why downstream literature speaks of "Noll indexing" versus other conventions, and why any implementation must state which normalization it uses before comparing coefficient magnitudes.

## Why this basis for a corpus audit

The program context for this corpus (the yubiOS curved-corpus refs doc of 2026-08-24) claims that Zernike polynomials are THE orthogonal basis on the unit disk for expanding a deviation from ideal, citing Zernike 1934, Noll 1976, and Born and Wolf chapter 9. The web dig independently confirms the object (orthogonal on the disk, complete, continuous) and the two dated anchors (1934, 1976). The superlative claim, that this is the canonical basis for the pre-lift disk representation of a corpus point distribution, is the program's own framing and is examined in doc 05 rather than asserted here.

The load-bearing fact the audit depends on is structural: orthogonality is what turns a spectrum into shares. A complete orthogonal system on the disk means any square-integrable deviation field on the disk has an expansion whose coefficients are separable channels. That is the property the audit program wants to borrow, and it is exactly the property the primary sources above establish.

## Implementation cautions

Three cautions recur across the sources. First, normalization conventions differ between authors, and Noll himself deviated from the "usual set" for convenience (noul 0.73). Second, the tabulated first 21 polynomials are an ordering convention, not the system's limit (Wikipedia, noul 0.55). Third, the disc polynomials extend to higher dimensions, so any disk-only implementation is a choice, not a constraint of the mathematics (ScienceDirect disc polynomials, noul 0.97).

## Sources

- ScienceDirect, Generalized Zernike or disc polynomials (noul 0.97): https://www.sciencedirect.com/science/article/pii/S0377042704001852
- Zernike functions paper, mathphys.uva.es (noul 0.92): https://mathphys.uva.es/files/2019/08/zernike.pdf
- Optica abstract page for Noll 1976 (noul 0.89): https://opg.optica.org/josa/abstract.cfm?uri=josa-66-3-207
- Springer chapter on Zernike polynomials (noul 0.89): https://link.springer.com/chapter/10.1007/978-3-642-15040-1_14
- Optica issue page JOSA 66 (3) (noul 0.87): https://opg.optica.org/josa/issue.cfm?volume=66&issue=3
- Noll 1976 PDF mirror (noul 0.73): http://www-n.oca.eu/carbillet/enseignement/METEOR-AAO/session-02/Noll-JOSA66-1976.pdf
- ResearchGate review (noul 0.70): https://www.researchgate.net/publication/365058351_Zernike_polynomials_and_their_applications
- ScienceDirect, Approximation via gradients on the ball (noul 0.93): https://www.sciencedirect.com/science/article/pii/S0377042723002029
- Wikipedia, Zernike polynomials (noul 0.55): https://en.wikipedia.org/wiki/Zernike_polynomials
