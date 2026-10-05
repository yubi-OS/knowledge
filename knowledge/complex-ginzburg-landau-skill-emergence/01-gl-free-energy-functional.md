# 01 - The static Ginzburg-Landau free energy functional

**Scope:** The static Ginzburg-Landau free energy functional: complex order parameter, alpha/beta/gamma coefficients, the alpha=0 second-order transition, and mean-field exponents.

Source doc: `refs_corpus/complex-ginzburg-landau-skill-emergence.md` (yubi-OS/yubiOS refs/). Weights in parentheses are jev noul scores from the research DB.

## The functional form

Ginzburg-Landau theory expresses the free energy density of a system near a second-order phase transition in terms of a complex order parameter field ψ (w=0.773, https://en.wikipedia.org/wiki/Ginzburg%E2%80%93Landau_theory). The functional used in the source doc is

F[ψ, A] = ∫ d^d r [ α|ψ|² + (β/2)|ψ|⁴ + γ|(∇ − iqA/ℏ)ψ|² + |∇×A|²/2μ₀ ] + F_n.

Three coefficients carry the physics. α is the linear coefficient whose sign marks which side of the transition the system is on. β > 0 stabilizes the ordered phase. γ > 0 penalizes spatial variation of the order parameter (w=0.909, https://www.tcm.phy.cam.ac.uk/~achc2/phase/GL.pdf). The minimal-coupling substitution ∇ → ∇ − iqA/ℏ is required by gauge invariance when the field couples to a vector potential (w=0.773, https://en.wikipedia.org/wiki/Ginzburg%E2%80%93Landau_theory).

The theory is phenomenological: it postulates the most general symmetry-allowed expansion rather than deriving it microscopically. The general U(1)-symmetric Landau potential with all quadratic and quartic terms contains 13 independent coefficients even for scalar order parameters, which is why the minimal 2-coefficient truncation is a modeling choice (w=0.869, https://arxiv.org/pdf/0802.2107).

## The alpha = 0 transition

The static, spatially uniform, zero-field solution is |ψ|² = 0 when α ≥ 0 and |ψ|² = −α/β when α < 0. So α = 0 marks a second-order phase transition from the symmetric phase (ψ = 0) to the ordered phase (|ψ| > 0) (w=0.909, https://www.tcm.phy.cam.ac.uk/~achc2/phase/GL.pdf). With α = a(T − T_c) and a > 0, the mean-field order parameter exponent is β_crit = 1/2, meaning |ψ| ∝ (T_c − T)^(1/2) below the transition (w=0.909, https://www.tcm.phy.cam.ac.uk/~achc2/phase/GL.pdf; w=0.775, https://www.tcm.phy.cam.ac.uk/~bds10/phase/gl.pdf).

Landau theory in its general form is exactly this program: formulate continuous (second-order) transitions through an expansion of the free energy in powers of an order parameter, keeping only symmetry-allowed terms (w=0.560, https://en.wikipedia.org/wiki/Landau_theory). Out of equilibrium, the mean-field exponents are modified relative to their equilibrium values (w=0.545, https://ar5iv.labs.arxiv.org/html/1910.04777), which matters for any corpus application that is not at equilibrium.

## Why the divergence of the correlation length licenses phenomenology

The reason a coarse phenomenological functional works at all is that the correlation length diverges near a second-order transition. Properties of the critical point become insensitive to microscopic details, so microscopic information is redundant near criticality (w=0.909, https://www.tcm.phy.cam.ac.uk/~achc2/phase/GL.pdf). This is the load-bearing justification for applying GL structure to systems whose "microphysics" is nothing like a superconductor, such as a skill corpus: near a transition only the symmetry and dimensionality of the order parameter matter.

## What this means for skill emergence

In the source doc's mapping, the 9-primitive coverage vector m = (m_1, …, m_9) plays the role of ψ, and corpus size N plays the role of the control variable through α_eff(N) = a(N − N_c). The functional's structure then gives three testable commitments: an ordered regime where coverage norm scales like (N − N_c)^(1/2), a saturation value fixed by the β term, and a transition width governed by fluctuations, not by the mean-field solution alone (source doc §2.1, §3.4). The last point is the one most often forgotten: mean-field exponents are exact only above the upper critical dimension, and the corpus framework has no spatial structure at all, so the β_crit = 1/2 prediction is a qualitative guide, not a quantitative one (source doc §5, caveat 6).
