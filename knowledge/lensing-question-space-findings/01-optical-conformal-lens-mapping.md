# 01 - The Mobius chart is already a lens: optical conformal mapping and ray optics

**Scope.** The Mobius conformal reparameterization phi_theta read as a literal optical lens via Leonhardt's optical conformal mapping, and the is-this-x atom's geodesic-only criterion read as discrete Fermat/Snell ray optics.

## The conformal mapping result

Leonhardt's optical conformal mapping paper (Science 312, issue 5781, 2006) shows that an invisibility device should guide light around an object as if nothing were there, and that ideal invisibility devices are impossible owing to the wave nature of light (weight 0.865, https://www.science.org/doi/10.1126/science.1126493). The full author PDF is hosted on the journal site (weight 0.8127, https://www.science.org/doi/suppl/10.1126/science.1126493/suppl_file/pap.pdf) and a preprint version "Optical Conformal Mapping and Dielectric Invisibility Devices" is on arXiv (weight 0.8677, https://arxiv.org/pdf/physics/0602092.pdf; abstract page weight 0.6481, https://arxiv.org/abs/physics/0602092). The core mechanism: a coordinate transformation defines a spatially varying refractive index that steers rays along chosen paths.

The framework mapping is exact, not metaphor: the family phi_theta in PSL(2,C) with index profile n(z) = |phi_theta'(z)| has the same mathematical form as Leonhardt's conformal index profiles. The source findings doc (yubiOS refs/lensing-question-space-findings-2026-08-13.md, consolidated 2026-08-13) states that every run to date has frozen phi_theta at the identity, which means the framework has been carrying an unpowered lens: refining phi_theta is lens design in the literal optical sense.

Transformation optics is the broader engineering field that applies metamaterials derived from coordinate transformations to direct electromagnetic radiation (weight 0.1157, weak, https://en.wikipedia.org/wiki/Transformation_optics). The framework's claim is narrower and stronger than the wiki summary: it is a bijection between a named 6-parameter complex group and a measured corpus statistic, so the optical reading inherits the literature's design vocabulary rather than loose analogy.

## The atom as a ray tracer

The geodesic-only criterion of the is-this-x atom is discrete Fermat's principle: the Phi(k) ladder plays the role of the eikonal S on coverage shells, and the monotonicity rule Delta >= 0 means rays never move backward in optical path length (source findings doc). The external anchors:

- A 2024 Springer chapter reviews the classical Fermat principle as a fundamental result of the calculus of variations and derives the Euler-Lagrange equations for the optical path length functional, from which Snell's law follows in homogeneous media (weight 0.8809, https://link.springer.com/chapter/10.1007/978-3-031-46614-4_4).
- A geometrical-optics book chapter derives the eikonal equation, the Sommerfeld-Runge law, and Snell's law from the rigorous construction of wavefronts and rays (weight 0.9284, https://iopscience.iop.org/book/mono/978-0-7503-1716-0/chapter/bk978-0-7503-1716-0ch9).
- A 2026 arXiv survey of the Fermat principle in general relativity traces its evolution from classical optics to the modern variational formulation (weight 0.6901, https://arxiv.org/html/2605.01532; the PDF version scored 0.2858, weak, https://arxiv.org/pdf/2605.01532).

Fermat's principle is the standard link between ray optics and wave optics, with Snell's law as its most familiar corollary (weight 0.085, weak, https://en.wikipedia.org/wiki/Fermat%27s_principle). The source findings doc cites Kalaba and Ueno (JOSA 64:317, 1974) and Tyc (JOSA A 14:2850, 1997) for the corner-condition reading of Snell's law at an index discontinuity; the dig did not surface those two papers directly, so that specific attribution rests on the source doc, while the general Fermat-implies-Snell chain is dig-backed above.

## Design consequence

If phi_theta is a lens, lens-design vocabulary applies to the refinement agenda: powering the lens (optimizing phi_theta) must be judged against the null image staying diffuse, and over-focus is a defect, not a win (see doc 03 on caustics). The strongest dig sources for this doc are the journal-hosted Leonhardt paper and the IOP and Springer optics chapters, all at weight 0.86 or above.

## Sources considered

| result | weight | used |
|---|---|---|
| science.org/doi/10.1126/science.1126493 | 0.865 | yes |
| Science supplemental PDF | 0.8127 | yes |
| arXiv physics/0602092 PDF | 0.8677 | yes |
| arXiv physics/0602092 abstract | 0.6481 | yes |
| Springer Fermat/Snell chapter | 0.8809 | yes |
| IOP geometrical optics chapter | 0.9284 | yes |
| arXiv 2605.01532 HTML survey | 0.6901 | yes |
| arXiv 2605.01532 PDF | 0.2858 | weak, no |
| ResearchGate Optical Conformal Mapping | 0.4876 | weak, no |
| Wikipedia Transformation optics | 0.1157 | weak, cited as field context |
| Wikipedia Fermat's principle | 0.085 | weak, cited as context |
| YouTube result (off topic) | 0.0264 | no |
