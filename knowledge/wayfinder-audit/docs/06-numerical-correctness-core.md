# Numerical correctness: identities, measurements, and antipodes

Scope: the numerical repairs in the v0.2 audit, covering covariance-trace normalization, the rank gate as measurement, Metropolis-Hastings detailed balance versus stochastic flux, stable stationary normalization, SLERP antipode handling, and identity-failure aborts.

## Normalization: covariance trace, not a false identity

The V2 scoring uses covariance-trace normalization. The audited defect was an identity claim: the old code treated the gate/rank equivalence as if the gate were equivalent to the rank condition. The correction is that the identity can hold with both inequalities false: the gate/rank equivalence is an identity, while the rank gate is a measurement. Treating a measurement as an identity lets a pass silently certify something the identity does not assert.

## Detailed balance versus stochastic flux

The audit separates analytical Metropolis-Hastings detailed balance from stochastic flux. Detailed balance is the reversibility condition that makes a target distribution stationary for the Markov chain; it has anchored MCMC since 1953 (https://en.wikipedia.org/wiki/Detailed_balance, weight 0.548) and is the central proof step of the Metropolis-Hastings algorithm (https://www.statlect.com/fundamentals-of-statistics/Metropolis-Hastings-algorithm, weight 0.672; https://www.math.cmu.edu/~gautam/c/2024-387/notes/09-metropolis-hastings2.html, weight 0.741; https://en.wikipedia.org/wiki/Metropolis%E2%80%93Hastings_algorithm, weight 0.827). The teaching literature is careful about what detailed balance alone buys: it is "a necessary condition for a random walk to asymptotically reach a stationary distribution", with ergodicity still required for true convergence (https://kkhauser.web.illinois.edu/teaching/notes/MetropolisExplanation.pdf, weight 0.773).

That distinction is exactly what the audit preserves: detailed balance is an analytical property of the transition kernel, while observed flux is a stochastic property of a finite run. The repair keeps the two from being substituted for each other, which is the same error class as the gate/rank confusion in the previous section.

## Stable stationary probabilities

Stationary probability estimates from finite chains need numerically stable normalization. The repair normalizes with a stable scheme rather than naive accumulation, so the stationary vector does not inherit catastrophic cancellation from the chain statistics.

## SLERP at the antipodes

Placement lift uses spherical interpolation, and spherical interpolation has a known degenerate case: two antipodal points do not define a unique great arc. Slerp interpolates along the geodesic with constant angular velocity (https://splines.readthedocs.io/en/latest/rotation/slerp.html, weight 0.622; https://www.emergentmind.com/topics/spherical-linear-interpolation-slerp, weight 0.690). Production implementations document the same structure; MathWorks documents slerp endpoints mapping to interpolation coefficients 0 and 1 (https://www.mathworks.com/help/fusion/ref/quaternion.slerp.html, weight 0.884). The definitional source is Shoemake's popularization in computer graphics (https://en.wikipedia.org/wiki/Spherical_linear_interpolation, weight 0.224, weak). The audited defect was unhandled antipodes; the repair handles them explicitly so that interpolation between opposite points is deterministic instead of undefined or numerically explosive.

## Identity certificates stop the pipeline

The final numerical repair is fail-closed persistence. False identity certificates, cases where a claimed invariance fails its own check, stop computation before any state is persisted. This is the same design posture as the API preflight (doc 08) and the rejection checks: a broken invariant is an error that halts, not a warning that flows downstream. The local numerical suite backs the implementation with the existing real 301x24 embedding fixture, identity-failure mutation tests, malformed frames and no-op correspondence; 57 tests pass with no skipped assertions (audit record).

## Why the separation matters for the audit's conclusions

Each of these repairs removes a way for a numerical accident to be promoted into a scientific claim. An identity that can hold with both inequalities false cannot certify rank. Detailed balance cannot certify mixing of a finite chain. A stable normalization cannot change what the chain measures, only how honestly it reports. SLERP handling removes an undefined value that would otherwise surface as unexplained placement jitter. None of these repairs adds capability; all of them remove false certificates, which is the audit's core movement across the whole release.
