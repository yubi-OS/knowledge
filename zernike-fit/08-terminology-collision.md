# 08 - Terminology collision: optical defocus versus heat-flow defocus

Scope: the naming collision the program's refs doc flags between optical defocus (a deterministic quadratic rephasing, the Zernike Z_2^0 mode) and the program's own spherical defocus (stochastic heat flow in a time parameter t). Two different objects share one word; if Zernike language enters the papers unflagged, the optical dictionary corrupts. This doc records what the external sources say about each side of the collision.

## Optical defocus: deterministic and geometric

On the optics side, defocus is a displacement: defocus error occurs when the point of observation is displaced from the best focus, the diffraction focus where peak diffraction intensity is achieved (Telescope Optics, defocus page, noul 0.85). In lens-design terms, a lens introduces a path length difference or phase shift, and how that phase shift affects the image is the aberration; defocus is the first and simplest such aberration treated alongside the Zernike expansion in standard coursework (lens design lecture notes, Imaging Aberrations, Defocus, and Zernike Polynomials, noul 0.54, primary but thin). Defocus is one of the four named low-order aberrations carried by the peak aberration coefficients S, C, A, and P (Telescope Optics, coefficients page, noul 0.74, per doc 02).

The deterministic character is the point: optical defocus is a fixed quadratic rephasing of the field across the pupil, computable exactly from geometry, not a random process. The weak-backing Wikipedia article on defocus aberration was retrieved (noul 0.45) and is consistent with this reading but stays below the citation bar, so the deterministic characterization rests on the 0.85 and 0.54 sources above.

## Heat-flow blur: deterministic equation, stochastic reading

On the other side of the collision, the heat equation has a precise correspondence to the Gaussian blur operator in image processing: in an infinite plane, simulating the heat equation up to time t is equivalent to Gaussian blur with a kernel width set by t (arXiv 2206.13397, noul 0.61). Diffusion-model research extends the equivalence: blurring can equivalently be defined through a Gaussian diffusion process with non-isotropic noise, bridging blur operators and stochastic diffusion processes (arXiv 2209.05557, Blurring Diffusion Models, noul 0.52, primary but thin). The weak-backing Wikipedia article on the heat equation (noul 0.26) is background only.

So the collision is sharp: one defocus is a quadratic phase profile, the other is a diffusion time. A sentence that says "defocus moves the spectrum toward low frequencies" is true for heat flow and false for Z_2^0, which preserves orthogonality and mixes only within its azimuthal sector (the mode-mixing caution of doc 06, noul 0.87).

## The program's discipline (source-doc claim)

The refs doc states that the program's spherical defocus is stochastic heat flow in t, a different object from the optics term, and requires the papers' optical-language discipline paragraph to flag the collision if Zernike vocabulary enters. The external sources support that the two usages are genuinely different objects with a shared name: the optics usage (noul 0.85, 0.74) is a deterministic aberration coefficient; the diffusion usage (noul 0.61, 0.52) is a blur or diffusion time. No source in this dig uses the two in one breath, which is itself evidence the collision is real rather than pedantic: the two literatures do not currently share the word carefully.

## Why the flag matters operationally

The corpus is additive across docs: a Zernike channel (docs 01, 05) and a heat-flow coordinate already live in the same papers. If both are called defocus, a reader cannot tell which object a coefficient refers to, and the null-standardized results become unauditable. The fix is textual and cheap: one flagging sentence in the optical-language paragraph, plus distinct symbols. This doc exists so that future papers can cite an external confirmation that both usages are established in their own literatures and that the collision is between two real objects, not a sloppy paraphrase of one.

## Sources

- Telescope Optics, defocus (noul 0.85): https://telescope-optics.net/defocus1.htm
- arXiv 2206.13397, heat equation and Gaussian blur correspondence (noul 0.61): https://arxiv.org/pdf/2206.13397
- Lens design lecture, Imaging Aberrations, Defocus, and Zernike Polynomials (noul 0.54, primary but thin): https://myplace.frontier.com/~stevebrainerd1/PHOTOLITHOGRAPHY/Week%206%20Lens%20Design%20-%20Imaging%20Aberrations%20Defocus%20and%20Zernike%20Polynomials.pdf
- arXiv 2209.05557, Blurring Diffusion Models (noul 0.52): https://arxiv.org/html/2209.05557v3
- Telescope Optics, Zernike coefficients (noul 0.74): https://www.telescope-optics.net/zernike_coefficients.htm
- Wikipedia, heat equation (noul 0.26, weak): https://en.wikipedia.org/wiki/Heat_equation
- Wikipedia, defocus aberration (noul 0.45, weak): https://en.wikipedia.org/wiki/Defocus_aberration
