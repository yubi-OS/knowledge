# Metropolis-Hastings chains on discrete state spaces

**Scope:** Metropolis-Hastings chains on discrete state spaces: acceptance ratios, detailed balance, flux symmetry and convergence diagnostics. The map's compass edges are a Metropolis chain over Hamming shells driven by the free-energy landscape F_T(k) = Phi(k) - T log C(d,k); this doc grounds the sampler mathematics and its diagnostics.

## Design context

The compass edge set is produced by a designed Markov chain, not by the data alone: proposals move an item's bit pattern one step up or down the shell ladder, acceptance follows the Metropolis rule against the shell potential F_T(k), and the output is the stationary shell distribution pi_T(k), its mean and variance, the acceptance rate, and the crossing temperature T_x where the chain's modal shell flips. Every one of these outputs is a property of the designed chain, and the design carries the standing warning that equilibrium statements are statements about the chain, never facts about the corpus. This doc grounds the sampler and its diagnostics in published sources.

## The Metropolis-Hastings acceptance rule

The Metropolis-Hastings algorithm constructs a Markov chain with a prescribed stationary distribution pi. Given a proposal distribution q(x' | x) and the current state x, the candidate x' is accepted with probability min(1, (pi(x') q(x | x')) / (pi(x) q(x' | x))), and the chain stays put otherwise. Wikipedia's algorithm article states the rule and its symmetric-proposal special case (plain Metropolis), where the q ratio drops out and acceptance is min(1, pi(x')/pi(x)) [https://en.wikipedia.org/wiki/Metropolis%E2%80%93Hastings_algorithm, weight 0.84]. StatLect's treatment walks the same derivation and emphasizes that the q ratio corrects for asymmetric proposals [https://www.statlect.com/fundamentals-of-statistics/Metropolis-Hastings-algorithm, weight 0.70].

The compass chain uses a signed one-step proposal on shells (up with probability proportional to available 0 bits, down with probability proportional to available 1 bits), which is asymmetric in general, so the full MH ratio applies: for a target proportional to exp(-F_T(k)/T'), the acceptance of a move k -> k' is min(1, exp(-(F_T(k') - F_T(k))/T') q(k|k')/q(k'|k)). The design fixes the computational temperature at 1 and drives behavior through the landscape T in F_T, keeping the ratio arithmetic exact in integers times exponentials.

A course note from the University of Illinois proves the detailed balance condition directly: the acceptance rule makes the flow from x to x' equal the flow from x' to x, so pi is stationary [https://kkhauser.web.illinois.edu/teaching/notes/MetropolisExplanation.pdf, weight 0.74]. Cornell's ermongroup lecture notes present the same correctness argument with the transition-kernel algebra [https://ermongroup.github.io/cs323-notes/probabilistic/mh/, weight 0.54].

## Flux symmetry as a runtime check

Detailed balance says the equilibrium flow across each boundary is zero: J(k -> k+1) = pi(k) P(k -> k+1) - pi(k+1) P(k+1 -> k) = 0 in stationarity. The map measures the empirical flux on each rung of the shell ladder from the realized chain and standardizes it, checking |z(J)| <= 3 per rung. This is an instance check, not an identity: the theorem guarantees the exact chain equilibrates to zero flux, while the rung check asks whether this finite run at this temperature shows it. A failed flux check is a finding about the run (too short, not mixed, or a code defect), and the design routes it to the measurement-certificate class where red is allowed.

The distinction matters because the flux check can fail honestly. A 2026 arXiv paper on the spectral gap of the binary fixed-margin swap chain shows that mixing times for exactly this family of binary chains can be slow, so a finite run's empirical flux can deviate without any code bug [https://arxiv.org/abs/2606.22636, weight 0.34, weak backing].

## Convergence diagnostics

The chain's outputs (pi_T, <k>, Var[k], T_x) are only meaningful after the chain has mixed. Stan's bayesplot documentation catalogues the standard visual diagnostics: trace plots for stationarity, autocorrelation plots for effective sample size, and rank-normalized R-hat for between-chain agreement [https://mc-stan.org/bayesplot/articles/visual-mcmc-diagnostics.html, weight 0.93]. A survey paper on convergence diagnostics for MCMC formalizes the same battery and warns that no single diagnostic proves convergence; each can fail to detect non-convergence in specific chains [https://arxiv.org/pdf/1909.11827, weight 0.93]. A physics course module on MCMC diagnostics derives the effective sample size from autocorrelation time and recommends discarding an initial burn-in window [https://furnstahl.github.io/Physics-8820/notebooks/MCMC_sampling_I/MCMC-diagnostics.html, weight 0.62].

The compass chain applies a subset of this battery adapted to a 1-D state space: the acceptance rate (a low rate means the landscape is too steep at this temperature), the realized shell trajectory (stationarity by eye on the marginal), and the flux z-checks. It deliberately does not claim convergence from any single statistic, per the survey's warning [https://arxiv.org/pdf/1909.11827, weight 0.93].

A marketing-heavy guide page in the dig carried weak weight and is not relied on [https://www.numberanalytics.com/blog/ultimate-metropolis-hastings-algorithm, weight 0.13, weak backing].

## What the sampler asserts

1. The Metropolis-Hastings rule is the standard construction of a chain with prescribed stationary distribution, correct by detailed balance [https://kkhauser.web.illinois.edu/teaching/notes/MetropolisExplanation.pdf, weight 0.74].
2. Empirical flux symmetry per rung is an instance-level check of that balance for a finite run, and its failure is a measurement, not a contradiction [https://en.wikipedia.org/wiki/Metropolis%E2%80%93Hastings_algorithm, weight 0.84].
3. No single diagnostic certifies convergence; the map's outputs carry the chain's diagnostics alongside them so the reader can judge [https://arxiv.org/pdf/1909.11827, weight 0.93].

## Sources considered

| Source | Weight |
|---|---|
| Convergence diagnostics for MCMC, arXiv survey | 0.93 |
| Visual MCMC diagnostics, bayesplot (Stan) | 0.93 |
| Metropolis-Hastings algorithm, Wikipedia | 0.84 |
| Metropolis detailed balance note, U. Illinois | 0.74 |
| Metropolis-Hastings algorithm, StatLect | 0.70 |
| MCMC diagnostics module, OSU Physics | 0.62 |
| Metropolis-Hastings notes, Cornell ermongroup | 0.54 |
| Metropolis-Hastings with demonstration, Kelighine | 0.63 |
| Spectral gap for the binary fixed-margin swap chain, arXiv | 0.34 |
| MCMC convergence notes, W&M Econ | 0.26 |
| Markov chain Monte Carlo, Wikipedia | 0.19 |
| Metropolis-Hastings guide, NumberAnalytics | 0.13 |
| MCMC LLC (off topic) | 0.12 |
