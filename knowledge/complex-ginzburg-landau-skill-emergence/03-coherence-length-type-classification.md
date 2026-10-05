# 03 - Coherence length, penetration depth, and the type classification

**Scope:** Coherence length xi, penetration depth lambda, the GL parameter kappa, type-I versus type-II classification, critical fields, and Abrikosov vortex lattices.

Source doc: `refs_corpus/complex-ginzburg-landau-skill-emergence.md` (yubi-OS/yubiOS refs/). Weights in parentheses are jev noul scores from the research DB.

## The two length scales

The Ginzburg-Landau coherence length ξ is the characteristic scale over which the order parameter (the density of the superconducting component) varies (w=0.824, https://en.wikipedia.org/wiki/Type-II_superconductor; w=0.560, https://rashid-phy.github.io/me/pdf/notes/Superconductor_Theory.pdf). In the GL framework it follows from balancing the gradient term against the quadratic term: ξ = √(γ/|α|). It is the length over which ψ heals after a perturbation, and it approximates the vortex core radius (source doc §2.3).

The penetration depth λ is the characteristic length of the decay of a magnetic field inside the superconductor due to surface currents (w=0.410, weak backing, https://www.preprints.org/manuscript/202408.1060). Both ξ and λ diverge as α → 0, which is the signature of criticality on both length scales (source doc §2.3; w=0.909, https://www.tcm.phy.cam.ac.uk/~achc2/phase/GL.pdf).

## The GL parameter and the type classification

The Ginzburg-Landau parameter κ is the ratio λ/ξ, and it classifies all superconductors (w=0.885, https://bingweb.binghamton.edu/~suzuki/seniorlab_pdf/8_ginzburg_landau_theory_for_superconductivity.pdf). Superconductors with κ < 1/√2 are type I and show a complete Meissner effect up to a single thermodynamic critical field. Superconductors with κ > 1/√2 are type II: above the lower critical field H_c1 they enter a mixed state in which magnetic flux penetrates as quantized vortices, remaining superconducting up to the upper critical field H_c2 (w=0.824, https://en.wikipedia.org/wiki/Type-II_superconductor; w=0.572, weak backing, https://yusukehashimotolab.github.io/AI-Knowledge-Notes/knowledge/en/MS/superconductivity-intermediate/chapter-2.html).

Salasnich's lecture notes develop exactly this chain: GL phenomenological theory, coupling to the magnetic field, London penetration depth, and the GL equation, valid close to the transition temperature T_c (w=0.887, https://materia.dfa.unipd.it/salasnich/phd/phd2020-gle.pdf). Standard graduate treatments cover the scaling theory of second-order transitions and lower and upper critical dimensions alongside this material (w=0.931, https://web.pa.msu.edu/people/duxbury/courses/phy831/LectureNotesAndProblemsPart4.pdf).

## Vortices and the Abrikosov lattice

In a type-II material, isolated vortices enter above H_c1. Each vortex is a topological defect: the phase of ψ winds by 2πn around a core where |ψ| → 0. Vortex density increases with field until cores overlap near H_c2. Between H_c1 and H_c2, vortex interactions favor an approximately triangular Abrikosov lattice (source doc §2.4). In practice vortices can also be trapped on material defects even when they are not thermodynamically favored, which is why defect populations in real samples are rarely clean periodic arrays (w=0.824, https://en.wikipedia.org/wiki/Type-II_superconductor).

## The corpus reading, with its warning label

The source doc maps ξ to the transition width in log N (the range over which emergence propagates), λ to a persistence or propagation scale, and κ = λ/ξ to the ratio of generalization to transition width: sharp localized emergence versus distributed robust emergence (source doc §3.1). In GL terms, κ > 1/√2 would mean the corpus behaves type-II, with persistent defects (vortices), while κ < 1/√2 would mean defects annihilate and a clean ordered phase is reached (source doc §4.6).

This mapping is currently the least grounded part of the framework. The errata record shows the type-I reading built on a broken comparison (see doc 09), and neither ξ nor λ has an operational measurement procedure in the corpus. The defensible content of this doc is the physics: two diverging length scales, one dimensionless ratio, and a classification that predicts whether defects persist. The defensible corpus commitment is methodological: before using κ language about skills, define how ξ and λ would be measured from empirical correlation lengths (source doc §4.6, §7).
