# 04 - The generic complex Ginzburg-Landau equation

**Scope:** The generic complex Ginzburg-Landau equation with dispersive coefficients c1 and c3: plane waves, spiral defects, defect chaos, and the equal-coefficient Lyapunov exception.

Source doc: `refs_corpus/complex-ginzburg-landau-skill-emergence.md` (yubi-OS/yubiOS refs/). Weights in parentheses are jev noul scores from the research DB.

## The amplitude equation and its zoo

The cubic complex Ginzburg-Landau equation is one of the most-studied nonlinear equations in physics. It describes, qualitatively and often quantitatively, a vast variety of phenomena from nonlinear waves to second-order phase transitions, superconductivity, superfluidity, and Bose-Einstein condensation (w=0.917, https://arxiv.org/abs/cond-mat/0106115). In the source doc's normalized form:

∂_t A = μA + (1 + ic₁)∇²A − (1 + ic₃)|A|²A + η.

The real Ginzburg-Landau equation (c₁ = c₃ = 0) can be derived from a Lyapunov functional, or free energy, that decreases under the dynamics (w=0.860, https://homes.lorentz.leidenuniv.nl/~saarloos/Patternf/cgl.html). With nonzero imaginary coefficients, the equation is a non-equilibrium amplitude equation: no scalar potential governs it generically, and its phenomenology becomes that of pattern formation rather than relaxation. It supports plane waves, phase slips, spiral defects, sources and sinks, and defect chaos (source doc §2.5; w=0.917, https://arxiv.org/abs/cond-mat/0106115). In fluid terms this is the same family of mechanisms seen in the transition from laminar to irregular flow as a control parameter increases (w=0.624, http://www.scholarpedia.org/article/Transition_to_turbulence).

## The equal-coefficient exception (erratum E1)

The source doc's original §2.5 claimed that for nonzero imaginary coefficients no scalar free energy decreases monotonically. The 2026-09-13 erratum narrows this claim. It is correct for generic (unequal) coefficients but false for the equal-coefficient case, which the original text swept in with the rest (source doc errata E1).

For the normalized, noise-free CGLE with equal dispersive coefficient β, move to the rotating frame B = e^(iβt)A. The dynamics become ∂_t B = (1 + iβ)G(B) with G(B) = B − |B|²B + ΔB. The functional F[B] = ∫ (|∇B|² − |B|² + ½|B|⁴) dx then satisfies

dF/dt = −2∫ |G|² dx ≤ 0.

The reactive part iβ is annihilated by the real part and drops out of the dissipation rate. So equal nonzero β is not gradient flow, but it admits F as a Lyapunov functional with a purely reactive component that does no work against F. Global phase rotation leaves F unchanged (source doc errata E1).

The correction is supported numerically: finite periodic-system checks of the identity at β = 0, 0.7, 1.5, and −2 gave a maximum relative identity error of 5.10 × 10⁻¹⁶, while an unequal-coefficient counterexample at b = 2, c = −1 produced a positive directional derivative of 1.730246 × 10⁻⁵, confirmed independently by a symmetric energy difference of 1.730247 × 10⁻⁵ (source doc errata E1). Independent numerical study of the Graham functional as a Lyapunov potential for the CGLE found it decreases monotonically toward plane-wave attractors in non-chaotic regions of parameter space, which is consistent with the equal-coefficient picture (w=0.896, https://arxiv.org/abs/cond-mat/9508115).

## Limits of the correction

Two limits matter. Ḟ ≤ 0 alone does not prove the field converges to a time-independent state. And noise, forcing, or unequal coefficients each require separate analysis (source doc errata E1). The correction is about the existence of a Lyapunov functional in one special case, nothing more.

## What this means for the corpus model

The GL equation describes the nonlinear evolution of small disturbances near a finite-wavelength bifurcation from a stable to an unstable state (w=0.830, https://en.wikipedia.org/wiki/Ginzburg%E2%80%93Landau_equation), and GL theory is the equilibrium special case of the CGLE (source doc §2.5). For skill emergence, the practical import is diagnostic: if corpus dynamics were relaxational, an effective free energy would exist and measurement noise would only blur it. If the dynamics have non-vanishing dispersive character, oscillations, defect chaos, and history-dependence are expected and a free-energy interpretation fails. The corpus record shows saturation at V_2 ≈ 0.72 to 0.77 across cycles 14 to 23, which is consistent with both regimes, so the CGLE currently constrains interpretation rather than making a discriminating prediction (source doc §5, caveat 4; §3.5).
