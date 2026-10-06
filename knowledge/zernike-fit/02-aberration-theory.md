# 02 - Aberration theory and the semantics of the low-order modes

Scope: what the low-order Zernike modes mean in optical aberration theory (defocus, astigmatism, coma, spherical aberration), the Born and Wolf treatment the program's slot 1 leans on, and why an aberrated-lens extension family inherits interpretable degrees of freedom. The program context: the curved-corpus program's lens family in PSL(2,C) is Moebius, conformal, an aberration-free lens family by construction, and the 2026-08-24 refs doc proposes perturbing the pre-lift disk coordinates with a low-order Zernike displacement field before the stereographic lift.

## The classical account

Aberration theory is old: astigmatism and spherical aberration have been known since the 1800s, and in 1934 Frits Zernike created mathematical functions to describe them systematically (University of Arizona, G. Smith, noul 0.85). Born and Wolf's Principles of Optics is the standard treatise: its chapter 5 carries the primary aberration theory, including the addition theorem for the primary aberrations and the primary aberration coefficients of a general centred lens system via the Seidel formulae (publisher preview, noul 0.52, primary but thin), and its section 9.2.1 is titled "The circle polynomials of Zernike" (Cambridge Core book page, noul 0.83). A teaching development of the same material cites Principles of Optics directly for the wavefront form Wq(theta) built from cos q theta, sin q theta, and constants (NAU lecture notes PDF, noul 0.70).

## What Zernike modes buy aberration theory

The operational claim is quantitative description: Zernike polynomials are used for a quantitative description of wavefront distortions, with methods for minimizing aberrations (RP Photonics encyclopedia entry, noul 0.83). Each mode names one classical aberration, and the correspondence is stable enough to teach with simulations: defocus, astigmatism, coma, and spherical Zernike aberrations were simulated as phase errors on an aperture in a teaching exercise (ResearchGate, noul 0.62).

The standard crosswalk between Zernike coefficients and named aberrations uses peak aberration coefficients: S for lower-order spherical aberration, C for coma, A for astigmatism, and P for defocus, with wavefront error expressed in units of these coefficients (Telescope Optics, Zernike coefficients page, noul 0.74). Defocus therefore appears as one of the low-order Zernike terms, not as an exotic addition (same source, noul 0.86 for the expanded set).

One concrete mixed-term example shows why the semantics matter computationally: in the Wyant metrology notes, Zernike term 8 in the working table shows that for each wave of third-order spherical aberration present, one wave of defocus should be subtracted (Basic Wavefront Aberration Theory for Optical Metrology, University of Arizona, Wyant, noul 0.91). Modes are not independent narratives; they interact, and the interaction is arithmetic on coefficients.

## The aberrated-lens proposal (program slot 1)

The program's refs doc reads its own lens family in this dictionary: the PSL(2,C) lens family phi_theta is Moebius, hence conformal, hence an aberration-free lens family by construction, so the family it optimized in unified v2 was a 6-parameter ideal-lens family. The proposed extension is an aberrated lens: perturb the pre-lift PCA disk coordinates by a displacement field built from low-order Zernike modes, defocus Z_2^0, astigmatism Z_2^(+-2), coma Z_3^(+-1), spherical Z_4^0, before the stereographic lift, optimized jointly with or after the Moebius degrees of freedom under the same anti-caustic guard and the same null-standardized objective.

What the web dig confirms about this proposal is the interpretability premise: each Zernike coefficient is one named aberration with a century of usage, with published crosswalks to peak aberration coefficients (noul 0.74, 0.91). What the dig cannot confirm is the program-side claim that the optimum converges onto the anti-caustic rim with condition number 997.8 of 1000; that number is internal to the program's papers and is reported here as the program's own claim, not as an independently verified fact.

## Why the membership bar still applies

The refs doc is explicit that the aberration coordinates face the same membership condition as every other coordinate, and notes that both A_1 and the flow coordinate u failed it. The optics literature supplies no shortcut here: the interpretable semantics of a coefficient say nothing about whether that coefficient's channel carries corpus signal above a null. The audit-relevant statement is the negative one: if the delta-J improvement arrives only through aberration terms, the corpus signal is non-conformal, which is a finding either way.

## Sources

- Cambridge Core, Principles of Optics section 9.2.1 (noul 0.83): https://www.cambridge.org/core/books/principles-of-optics/circle-polynomials-of-zernike-921/381
- Wyant, Basic Wavefront Aberration Theory for Optical Metrology (noul 0.91): https://wp.optics.arizona.edu/jcwyant/wp-content/uploads/sites/13/2016/08/Zernikes.pdf
- University of Arizona, Zernike Polynomials (noul 0.85): https://webs.optics.arizona.edu/gsmith/Zernike.html
- RP Photonics, Optical Aberrations (noul 0.83): https://www.rp-photonics.com/optical_aberrations.html
- Telescope Optics, Zernike coefficients (noul 0.74 and 0.86): https://www.telescope-optics.net/zernike_coefficients.htm
- Telescope Optics, Zernike aberrations (noul 0.77): https://www.telescope-optics.net/zernike_aberrations.htm
- NAU lecture notes on Zernike polynomials and optical aberrations (noul 0.70): https://jan.ucc.nau.edu/jmn3/students/zernike.pdf
- ResearchGate, simulations of 4 types of optical aberrations using Zernike (noul 0.62): https://www.researchgate.net/publication/334389792_Simulations_of_Four_Types_of_Optical_Aberrations_using_Zernik
- Principles of Optics publisher preview (noul 0.52, primary but thin): https://api.pageplace.de/preview/DT0400.9781139632607_A23868457/preview-9781139632607_A23868457
