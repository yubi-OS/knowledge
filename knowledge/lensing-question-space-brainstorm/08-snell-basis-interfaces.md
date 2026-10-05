# 08 - Snell's Law at Basis Interfaces and Achromatic Coordinates

**Scope.** Gap B made concrete: the claim that null-standardized signals obey a Snell-type conservation law when crossing feature-basis interfaces (9-D to 16-D to 384-D), the achromatic-coordinate design rule, and what the ladder data can falsify in an afternoon.

## Refraction as a conservation law at interfaces

The established physics: at an interface between media, the angles obey n1 sin(theta1) = n2 sin(theta2), a conservation law following from the variational principle. Generalized treatments extend refraction laws to metasurface and gradient-index interfaces where the classical form generalizes [https://www.nature.com/articles/s41377-020-00411-7.pdf, jev weight 0.89], and derivations of Snell's law from variational and wave-optical standpoints are standard [https://physicsfundamentals.org/blog/snells-law, jev weight 0.66; https://arxiv.org/pdf/2204.09154, jev weight 0.83, weak-to-moderate backing for the specific paper]. The corpus claim to test (Gap B): crossing bases, the null-standardized signal obeys n1 sin(theta1) = n2 sin(theta2) with n_D determined by the null, for example n_D proportional to 1/SD0[V2](D).

## What the ladder data can falsify

The source document's operational claim: Table 1 plus the per-D null SDs contain everything needed to test a specific conservation law, with zero new data collection. The procedure is pure re-analysis: for each basis crossing in the ladder, compute the incident "angle" of the family's standardized signal relative to the crossing direction, compute n_D from the null SDs, and check whether the conserved quantity n sin(theta) is constant across the crossing. Two outcomes are both informative:

- A surviving invariant means the medium's dispersion is matched to a conserved quantity, and that invariant is a new corpus coordinate.
- No surviving invariant means the medium is dispersive with no achromatic pair beyond the Parseval shares, which is itself a publishable characterization [source document, Gap B].

## Achromatic coordinates: the design rule

An achromatic lens focuses all wavelengths alike; achromatic design (doublets, apochromats) exists precisely to cancel dispersion across a wavelength range [https://en.wikipedia.org/wiki/Achromatic_lens, jev weight 0.78; https://www.rp-photonics.com/achromatic_optics.html, jev weight 0.77]. Classical design techniques for achromatic optical systems are formalized with Wigner-algebra methods [https://www.weizmann.ac.il/complex/AFriesem/pdf/AAFriesem021.pdf, jev weight 0.74], and achromatic waveguide lenses demonstrate the principle in integrated optics [https://www.apollooptical.com/hubfs/articles/ao30_2558.pdf, jev weight 0.55].

The corpus twin of the design rule: a dimension-comparable coordinate is one whose value does not move along the D-ladder. The corpus already found its achromatic coordinates: the Parseval shares E_lm (Eq. 40), the same 16 entries whatever N and d, scale-free along the fold [source document, Section 3]. The rule "prefer achromatic coordinates for anything meant to compare corpora across dimension" follows.

## Dispersion relation across the ladder

The dimension ladder's fitted null laws (Eq. 18) are the medium's dispersion relation: how the null V2 varies with dimension. In the optical analogy, dimension plays wavelength: basis crossings are interfaces between media of different "index" (as measured by the null SD), and the achromatic question is whether any coordinate is invariant across all of them. This vocabulary is admitted only where a metric and a variational problem are both specified; per the source document's Section 5, the one place both exist today is the atom (chordal metric on S^2, geodesic-only argmin).

## Honesty constraint

No dig result provides a corpus-side Snell invariant; this document's experimental claims are proposals from the source document, grounded in the optics literature above. The test is cheap because the data exist; it has not been run.
