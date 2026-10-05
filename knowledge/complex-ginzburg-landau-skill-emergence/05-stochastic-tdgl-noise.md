# 05 - Stochastic TDGL: noise, fluctuation-dissipation, and threshold shifts

**Scope:** Stochastic TDGL: Langevin noise, fluctuation-dissipation, how noise seeds symmetry breaking, rounds transitions, and shifts apparent emergence thresholds.

Source doc: `refs_corpus/complex-ginzburg-landau-skill-emergence.md` (yubi-OS/yubiOS refs/). Weights in parentheses are jev noul scores from the research DB.

## The Langevin form

A stochastic TDGL equation has the Langevin form ∂_t ψ = −Γ δF/δψ* + ζ(r, t). A Langevin equation is a stochastic differential equation describing how a system evolves under a combination of deterministic and fluctuating (random) forces (w=0.721, https://en.wikipedia.org/wiki/Langevin_equation). For equilibrium thermal noise, the noise strength is tied to dissipation through the fluctuation-dissipation relation: ⟨ζ(r, t)ζ*(r', t')⟩ = 2Γ k_B T δ(r − r')δ(t − t') (source doc §2.6). This is the textbook structure: a deterministic drift plus white noise whose amplitude is fixed by temperature and the friction coefficient, so the system relaxes to the correct thermal equilibrium distribution (w=0.845, https://arxiv.org/pdf/1606.08263). The second fluctuation-dissipation theorem gives the companion relation for the fluctuating force itself, and a solution formulated as an initial value problem approaches a stationary process exactly when this relation holds (w=0.693, https://arxiv.org/html/2507.17350v1).

The stochastic Ginzburg-Landau equation is not just a perturbative device. Exact solutions exist for the real-valued stochastic GL equation forced by multiplicative noise in the Itô sense, which matters because the equation occurs in numerous applications (w=0.926, https://www.sciencedirect.com/science/article/pii/S2211379721001583). The requirement is sharp: to satisfy fluctuation-dissipation and relax toward thermal equilibrium at long times, specific relationships between the parameters of the time-dependent equation must hold (w=0.845, https://arxiv.org/pdf/1606.08263).

## The four roles of noise

The source doc assigns noise four roles in emergence measurements:

1. It seeds symmetry breaking when the deterministic ψ = 0 state is unstable.
2. It produces fluctuations and finite-size rounding near the transition.
3. During a parameter sweep it can delay or advance the apparent transition.
4. In spatial systems it nucleates domains, defects, and competing patterns (source doc §2.6).

The general literature agrees that noise is not merely a disordering agent: it can act constructively, inducing, shifting, or rounding transitions and sculpting phase diagrams and scaling laws (w=0.091, weak backing, https://www.emergentmind.com/topics/noise-induced-phase-transitions). In a related setting, environmental noise shifts or destroys the detectability of a measurement-induced phase transition, and specific operations can protect the transition's threshold from that noise, a direct example of a transition threshold that is not an intrinsic property of the system alone (w=0.720, https://arxiv.org/html/2406.14109v3).

## The measurement lesson

The consequence for emergence measurements is the source doc's central point: an apparent emergence threshold need not coincide with α = 0. It may be shifted by noise amplitude, sweep rate, finite corpus size, initialization, and observation threshold (source doc §2.6). Dynamic phase transition measurements in driven kinetic Ising systems show exactly this dependence: the measured transition properties depend on the driving protocol and the additive noise present in the simulation (w=0.407, weak backing, https://www.sciencedirect.com/science/article/pii/S0378437121004453).

Applied to the skill-corpus case, this reframes the empirical record. The corpus measurements are taken at discrete cycle points, effectively a finite sweep rate over N. Sampling variance, prompt variability, and seed variation are the corpus analogues of ζ (source doc §3.1). The Jaccard = 0.182 measurement disagreement between two scoring methods and the 14 refused rows are fluctuation-level quantities, not system-level ones (source doc §1). A threshold read off a single sweep is therefore a convolution of the underlying transition with measurement noise. The defensible claim is that the corpus crossed from a sparse to a densely organized regime somewhere in the N ≈ 80 to 500 range; the defensible uncertainty is that the exact N_c, its sharpness, and even the existence of a true transition rather than a crossover all depend on quantities the corpus has not yet controlled (source doc §5, caveats 6 and 7).

The actionable diagnostic comes from doc 09: bootstrap the coverage matrix and measure Var[V_2(N)] across seeds. Near a genuine transition, the relative fluctuation Var[V_2]/V_2 should peak (source doc §4.4). If no peak appears at any N, the threshold being observed is measurement artifact, and the noise story ends the phase-transition story.
