# 03 - Catastrophe optics and the classification of caustics

Scope: the classical bridge that reads caustic types off the aberration function, centered on Berry and Upstill's 1980 Progress in Optics chapter and Nye's 1999 book. The program context: the unified v2 paper leaves caustic classification as catastrophe-theoretic and open (Gap E), and the refs doc proposes expanding the design map near each of its 14 machine-precision rank-2 degeneracies in Zernike or polynomial normal forms and reading the catastrophe type off the dominant coefficients.

## The founding chapter

The canonical modern source is M. V. Berry and C. Upstill, "Catastrophe optics: morphologies of caustics and their diffraction patterns," published as a chapter of Progress in Optics volume XVIII in 1980. The publication record with author and date fields is confirmed in the Technion research information system: TY JOUR, T1 Catastrophe optics, T2 Morphologies of caustics and their diffraction patterns, AU Berry, M. V., AU Upstill, C., PY 1980 (Technion CRIS record, noul 0.81). The publisher's chapter page locates it in Progress in Optics on ScienceDirect (noul 0.76).

The chapter's method is stated in its own opening: in catastrophe optics one starts from a smooth function of state variables and control parameters, constructs the gradient map, and enquires about the caustics it produces (Berry's own posted PDF of the chapter, michaelberryphysics.wordpress.com, noul 0.61). The same chapter page describes wave motion in catastrophe optics in terms of contrast and intensity around caustic morphologies (ScienceDirect chapter abstract, noul 0.76).

A 2024 arXiv survey of catastrophe optics confirms the subject is still active and frames the same hierarchy: work climbs from the fold to more challenging stable caustic structures, implying progressively harder mathematics (arXiv 2404.11153, noul 0.78).

## Caustics in nature

The physical motivation is captured by Nye's book, Natural Focusing and Fine Structure of Light: Caustics and Wave Dislocations, whose publisher page records that in the mid 1970s it began to be understood that when natural processes focus light, as when sunlight is reflected from the sea at sunset, the resulting light caustics fall into the catastrophe classes (Google Books record, noul 0.69). This is the observational fact the classification theory accounts for: generic focusing produces fold and cusp caustics, and higher-order umbilics appear only at special parameter values.

## The bridge to aberration theory

The bridge the program relies on, that caustic types are the catastrophes of the aberration function, is the organizing claim of the Berry and Upstill chapter: the aberration function plays the role of the generating function whose gradient map has the caustics as its singular set (Berry PDF, noul 0.61). The dig returned no source that states the mapping from individual Zernike modes to named catastrophes (spherical aberration to fold and cusp, astigmatism to elliptic and hyperbolic umbilics) in exactly that form. That mapping is asserted in the program's refs doc with Born and Wolf chapter 9 and Nye as background reading; this corpus records it as the program's positioning, supported here only at the level of the general catastrophe-optics framework.

## What operationalization means (program slot 2)

The refs doc converts this vocabulary into a computation: expand the design map near each of the 14 machine-precision V2 equal to 1.0000 rank-2 degeneracies in Zernike or polynomial normal forms, read the catastrophe type off the dominant coefficients, and check stability under the one-column perturbation of Gap E. The external sources ground the reading side of this: catastrophe optics is precisely the discipline of reading caustic morphology off the local normal form of a generating function (noul 0.61, 0.76). They say nothing about the corpus's own 14 degeneracies; those numbers are internal results of the program's unified v2 paper and are carried here as the program's claims.

The stability-check half of the proposal maps to a real theorem-shape in catastrophe theory, the stability of caustic types under small perturbations of the control parameters, which is what makes a one-column perturbation test meaningful rather than arbitrary (arXiv 2404.11153, noul 0.78, for the stability framing).

## Why this matters for the audit

If the classification computation works, Gap E stops being a vocabulary gap and becomes a measured classification with a null-controlled stability check. If the dominant coefficients do not organize into catastrophe normal forms, that is also a finding: the degeneracies of the corpus's design map are not optical-caustic-like, and the optical dictionary is being stretched past its range of validity.

## Sources

- Technion CRIS record for Berry and Upstill 1980 (noul 0.81): https://cris.technion.ac.il/en/publications/catastrophe-optics-morphologies-of-caustics-and-their-diffraction-patterns
- ScienceDirect Progress in Optics chapter (noul 0.76): https://www.sciencedirect.com/science/chapter/bookseries/pii/S0079663808702154
- Berry chapter PDF on the author's site (noul 0.61): https://michaelberryphysics.wordpress.com/wp-content/uploads/2022/02/berry089-1.pdf
- arXiv 2404.11153, Catastrophe Optics survey (noul 0.78): https://arxiv.org/pdf/2404.11153v1
- Google Books record for Nye, Natural Focusing and Fine Structure of Light (noul 0.69): https://books.google.com/books/about/Natural_Focusing_and_Fine_Structure_of_L.html?id=L5j0jl7Ge
