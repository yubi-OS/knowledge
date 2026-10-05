# 08 Testability and admission nulls: pre-registration as a design gate

Scope: testability discipline: pre-registered degeneracy check on the curveball null (SD0 threshold), the admission null gating the v2 continuous channel, and the WebGPU reverse-diffusion bet left at G5.

## The pattern: un-testable bets get converted or deferred

The source record applies one discipline across all variations: an assumption that would silently invalidate the design is either converted into a cheap pre-registered test or explicitly deferred behind a gate. It never ships an assumption unmeasured (internal record).

## The degeneracy check on the curveball null

The finalist's acknowledged un-testable-sounding bet was that a median-binarized embedding cloud produces a non-degenerate curveball null. The record converts it: run the null and look at SD0, the null standard deviation of the V2 statistic. The pre-registration is concrete: if SD0[V2] < 1e-3, the coordinate is inadmissible and the app says so (internal record). This is a degeneracy check in the statistical sense: a degenerate distribution is one whose support collapses to a set of measure zero (https://en.wikipedia.org/wiki/Degenerate_distribution, weight 0.33, weakly backed), and a null with near-zero variance cannot support a meaningful z score.

## Why pre-register the threshold

Pre-registration makes threshold choices binding before results are seen. The methodological literature describes preregistration as making research more efficient, including enabling sequential testing procedures that reduce required sample sizes (https://www.psychologicalscience.org/observer/research-preregistration-101, weight 0.86). The record applies this at the software level: the 1e-3 threshold and the admissibility verdict are fixed in the MVP before any corpus is run, so the tool cannot quietly lower the bar on a bad coordinate (internal record).

## The null-family context

The curveball null sits in the permutation-test family: a permutation test is an exact statistical hypothesis test computed by re-randomizing the observed data (https://en.wikipedia.org/wiki/Permutation_test, weight 0.81). Where no analytic null distribution is known, Monte Carlo permutation tests estimate it empirically, which is the standard approach in ordination and network analysis (https://www.davidzeleny.net/anadat-r/doku.php/en:monte_carlo, weight 0.58). A focused treatment frames permutation tests as answering how to test a hypothesis without assuming a parametric model, using exact null distributions from exchangeability (https://theorempath.com/topics/permutation-tests, weight 0.56). One caution from recent work transfers directly: in Monte Carlo permutation tests, more permutations do not always increase power, a non-monotonicity worth knowing when budgeting null draws (https://arxiv.org/pdf/2605.03886, weight 0.59). The record's design inherits all of this: the curveball null is the fibre-preserving instantiation of the general permutation idea (internal record).

## The admission null for the v2 continuous channel

V6, the continuous slerp channel, is deferred behind its own admission null: no fixed-margin fibre exists for continuous rows, so the null would have to be rotation-invariant (uniform on the sphere), a different and weaker medium. The record's rule is that V6 enters only after that null passes its own admission check, symmetric to the SD0 gate on the binary side (internal record). The gate keeps the certificate story honest: a geometry change is not allowed to silently change which checks can fail.

## What stays un-testable for now: V2 at G5

The one variation left entirely open is V2, full Riemannian score-based reverse diffusion in the browser (WebGPU). It got T=1 in scoring because it needs kernel-smoothed targets for the roughly 2000 atomic points before the first honest number, months of work; the record parks it in the papers README as G5, the long-horizon item (internal record). The scoring outlier justification is the testability reasoning made explicit: a design whose first honest output is months away loses to one whose first honest output is a load-time check.

## The transferable rule

The record's testability rule, stated generally: every load-bearing assumption must be either (a) a proved identity, (b) a pre-registered measurement with a numeric threshold, or (c) explicitly deferred behind a named admission gate. Nothing else may reach the deployed artifact. The SD0 check is (b), the V6 null is (c), the Lean identities are (a) (internal record).
