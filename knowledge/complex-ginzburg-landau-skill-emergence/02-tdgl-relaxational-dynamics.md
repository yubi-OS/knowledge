# 02 - Time-dependent Ginzburg-Landau and the Lyapunov property

**Scope:** The time-dependent Ginzburg-Landau equation: relaxational dynamics, kinetic coefficient, and the Lyapunov property dF/dt <= 0 that makes F a free energy.

Source doc: `refs_corpus/complex-ginzburg-landau-skill-emergence.md` (yubi-OS/yubiOS refs/). Weights in parentheses are jev noul scores from the research DB.

## The TDGL equation

The time-dependent Ginzburg-Landau equations give the evolution in time of the steady-state equations of static GL theory. They are phenomenological but useful for qualitative predictions about time evolution (w=0.731, https://en.wikipedia.org/wiki/Time-dependent_Ginzburg%E2%80%93Landau_theory). In the source doc's notation,

∂_t ψ = −Γ δF/δψ* + ζ,

with kinetic coefficient Γ > 0 and optional noise ζ. Substituting the static functional gives ∂_t ψ = Γ[γD²ψ − αψ − β|ψ|²ψ] + ζ, where D = ∇ − iqA/ℏ (source doc §2.2).

TDGL is not merely a guess: a microscopic derivation was performed by Eliashberg and Gor'kov, valid in the gapless regime where depairing factors matter (w=0.936, https://link.springer.com/chapter/10.1007/978-3-030-23486-7_7). For a real-valued order parameter at equilibrium, exact solutions for the relaxation functions exist, which is what makes the theory testable as a dynamical model and not just a static ansatz (w=0.946, https://link.aps.org/doi/10.1103/PhysRevB.8.3423).

## The Lyapunov property

For purely relaxational dynamics, dF/dt ≤ 0. This is the property that makes F a genuine free energy rather than an arbitrary functional (source doc §2.2). The general concept is standard: a Lyapunov function for an autonomous system is a scalar function whose time derivative along trajectories is non-positive away from the equilibrium point (w=0.271, https://en.wikipedia.org/wiki/Lyapunov_function). In physical systems of PDE, the Lyapunov function typically arises from the second law of thermodynamics, with the free energy as the decreasing quantity (w=0.771, https://people.maths.ox.ac.uk/ball/Teaching/cdtsemiflows16.pdf). Lyapunov-like functionals can also be constructed for generalized Fokker-Planck equations and discussed in the context of free energy measures, which shows the property generalizes beyond the original GL setting (w=0.859, https://www.sciencedirect.com/science/article/pii/S0375960101006387).

The methodological point: positivity and monotone decrease are separate requirements, and the energy approach treats a positive definite function as a candidate and then studies its evolution along solutions rather than assuming it decreases (w=0.873, https://link.springer.com/content/pdf/10.1007/978-3-031-76246-8_4.pdf).

## Why this matters for the skill-corpus model

The source doc's corpus framework has no recorded dynamics at all. The corpus is measured at discrete cycles; there is no autonomous field evolution and no independently measured amplitude or phase (source doc errata E3). So the TDGL part of the analogy is the weakest link: the corpus supplies statics (a coverage matrix at each cycle) but no verified ∂_t ψ.

Two consequences follow. First, any claim that the corpus "relaxes" toward an ordered state is currently unsupported; it would need a time-resolved measurement, not a cycle-to-cycle comparison. Second, the Lyapunov property is what distinguishes an equilibrium GL model (doc 01) from the generic complex Ginzburg-Landau equation (doc 04). If the corpus dynamics are non-potential, dF/dt ≤ 0 fails and the whole equilibrium interpretation weakens. The source doc flags this in caveat 4: learning curves that oscillate are consistent with non-potential dynamics, and the observed saturation near V_2 ≈ 0.77 is consistent with both potential and non-potential dynamics (source doc §5).

The honest position is that TDGL provides the vocabulary for a dynamical hypothesis about skill emergence, and the empirical gate for that hypothesis is a measured relaxation time, which has not been recorded (source doc §4.7 leaves critical slowing down as an untested prediction).
