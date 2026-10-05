# 09 - Testable predictions and diagnostics for the phase-transition model

**Scope:** The diagnostic suite for cycle 24: saturation, dV2/dlogN critical-point detection, order parameter exponent fit, fluctuation peak, susceptibility, kappa classification, critical slowing down, universality collapse, plus the 2/9 bound erratum.

Source doc: `refs_corpus/complex-ginzburg-landau-skill-emergence.md` (yubi-OS/yubiOS refs/). Weights in parentheses are jev noul scores from the research DB. Statements marked "record" come from the source doc's internal measurement record.

## The eight diagnostics

The GL framing earns predictive force only if its diagnostics are run. The source doc specifies eight (source doc §4):

1. Saturation: V_2(N) should approach a limiting value as N grows (record prediction: 0.77 to 0.79 with a denser self-corpus).
2. Critical point detection: compute dV_2/d log N across corpus sizes; N_c is where the slope is maximal. Measure V_2 at N = 100, 200, 500, 1000, 2000, 5000 (source doc §4.2).
3. Order parameter exponent: mean-field GL predicts |ψ| ∝ (N − N_c)^(1/2); fit β_emp from the cycle-4-through-16 data, expecting roughly 0.3 to 0.6 (source doc §4.3).
4. Fluctuation diagnostic: bootstrap the 9-primitive coverage matrix and measure Var[V_2(N)] across seeds; near the transition, Var[V_2]/V_2 should peak (source doc §4.4).
5. Susceptibility: χ(N) = dV_2/dh for a perturbation h such as adding or removing a row; near N_c, χ should diverge or scale with size. Compute via leave-one-out analysis (source doc §4.5).
6. Type classification: compute κ = λ/ξ from empirical correlation lengths (source doc §4.6).
7. Critical slowing down: measure recovery time after a corpus perturbation as a function of N (source doc §4.7).
8. Universality: rescaled V_2(N) curves from different corpus constructions should collapse onto a single curve; test against an external corpus (source doc §4.8).

## What the diagnostics literature says about each

Finite-size scaling is the standard machinery for diagnostics 2 through 5. The finite-size scaling ansatz handles a system with a parameter undergoing a transition at a critical value, with divergences in the correlation length and susceptibility (w=0.522, https://pyfssa.readthedocs.io/en/stable/fss-theory.html). Critical exponents extracted by finite-size scaling analysis are the accepted method for classifying a transition, as demonstrated for a finite-time dynamical phase transition whose exponents matched a known universality class (w=0.799, https://link.aps.org/doi/10.1103/PhysRevE.110.064156). Scaling laws express the physics of criticality as homogeneous functions of the relevant variables (w=0.631, http://www.scholarpedia.org/article/Scaling_laws). For diagnostic 4, measurements of full order-parameter fluctuation distributions across a continuous transition show that non-Gaussian statistics and critical scaling are visible in the fluctuations, which is exactly the signal a bootstrap variance test looks for (w=0.733, https://www.nature.com/articles/s41586-026-10811-1). For diagnostic 8, rescaling data with known static and dynamic critical exponents to obtain universal scaling functions for the order parameter and susceptibility is established practice (w=0.921, https://www.sciencedirect.com/science/article/pii/S0550321325000185). Critical slowing down, diagnostic 7, is characterized by a dynamic critical exponent that perturbations to the system's structure measurably modify (w=0.448, weak backing, https://arxiv.org/html/2610.01176).

## The 2/9 erratum: a bound that pointed the wrong way

The original §4.1 predicted V_2(N) saturates near 2/9 ≈ 0.78, and §4.6 reasoned from 0.7657 < 0.78 to a type-I classification. Erratum E2 records two faults (source doc errata E2).

First, the arithmetic is wrong: 2/9 = 0.2222, not 0.78. The numeral 0.78 has no derivation anywhere in the original text; it was carried forward unchecked.

Second, the direction of the bound is inverted. For a nonzero positive-semidefinite 9-D covariance, 2/9 is the isotropic lower bound on the top-two variance share, the value attained when all nine eigenvalues are equal. Any anisotropy raises PC1 + PC2 above 2/9, and the trivial upper bound is 1. So 2/9 is a floor, not a saturation ceiling, and a measurement of 0.7657 sits far above that floor rather than approaching it from below.

The correction is deliberately narrow: it fixes a bound and its arithmetic only. It supplies no evidence that V_2 saturates, no exponent, and no transition (source doc errata E2). A later paper in the corpus distinguishes the isotropic floor from ensemble-specific measured values, and that treatment has precedence over the original §4.1 and §4.6 (source doc errata E2).

## What remains falsified regardless

Erratum E3 draws the boundary: the corrections in E1 and E2 do not reopen any empirical claim. The predictions recorded as P2, P4, and P5 remain falsified under their own recorded protocols in the corpus's falsification record, and the retired Hodge/vortex interpretation and the dimensionally invalid quantized-flow claim remain retired (source doc errata E3).

## The decision tree

The diagnostics discriminate exactly two endings. If the saturation, fluctuation peak, and susceptibility diagnostics all fire near a common N_c, the corpus has evidence for a genuine transition and the GL framing becomes a load-bearing causal model. If they do not, the +0.4664 climb is a crossover or a metric artifact, and the framing remains a useful vocabulary but loses predictive force (source doc §5, caveat 7; §7). The 0-dimensional character of the corpus means fluctuation corrections are large, so even a positive result would support qualitative structure, not mean-field exponents (source doc §5, caveat 6).
