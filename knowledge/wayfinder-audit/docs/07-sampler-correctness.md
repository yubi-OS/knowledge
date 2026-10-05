# Sampler correctness: switch chains, self-loops, and honest margins

Scope: how the audit replaced a biased stopping rule with a symmetric checkerboard-switch chain, what that sampler preserves, what it honestly declines to claim, and where the Curveball lineage stands.

## The defect

The pre-audit sampler stopped on successful moves. A chain that halts its proposal loop whenever a move is accepted samples the jump chain: the sequence of realized transitions, with all the rejected proposals removed. That is not the intended equilibrium walk. It biases the sampled distribution toward periods of high acceptance and changes the effective transition kernel, because a real Markov chain at stationarity includes self-loops, states where the proposal is rejected and the chain stays put.

## The repair

The audited sampler is a symmetric checkerboard-switch chain with three explicit properties:

1. Self-loops are included. A rejected proposal is a step of the chain, not a pause outside it.
2. Attempted proposals are counted. Mixing diagnostics see the proposal rate, not just the acceptance rate.
3. The chain is symmetric. It preserves row and column margins of the binary matrices it resamples.

The release also states what the sampler is not: it is a switch chain, not full Curveball. This naming discipline matters because Curveball is a distinct algorithm family with its own guarantees, not a synonym for any switching scheme.

## The switch and Curveball lineages

The switch model is "the best known Markov chain approach for sampling graphs with fixed degree sequence", finding approximately uniform samples of bipartite, undirected or directed graphs "by repeatedly switching the ends of non-adjacent edge pairs" (https://arxiv.org/html/1609.05137v2, weight 0.793). Curveball is the newer alternative in the same family, randomizing the binary bi-adjacency matrix of a bipartite graph by trading the disjoint neighborhoods of pairs of vertices, like card trades between kids (https://arxiv.org/pdf/1609.05137v2, weight 0.661). Both preserve the degree sequence, which is the row-and-column-margin property the audited chain preserves.

Margin preservation is a statement about the chain's algebra: stochastic matrices describe Markov chains, with rows (or columns) summing to one, which is what keeps the marginal distribution well-defined across steps (https://en.wikipedia.org/wiki/Stochastic_matrix, weight 0.827; https://math.colgate.edu/math312/WWBook_Markov.pdf, weight 0.826). Transition matrices are the standard tool for analyzing a chain's behavior (https://www.stat.auckland.ac.nz/~fewster/325/notes/ch8.pdf, weight 0.763), and convergence questions are treated in the standard Cambridge notes on Markov chains (https://www.statslab.cam.ac.uk/~rrw1/markov/M.pdf, weight 0.589).

## What stays unproved

The audit is explicit that finite mixing at K=40 is not established for every corpus. Margin identities are algebraic facts about the chain; they are not a mixing proof. The teaching note cited above makes the general point in one line: detailed balance and related structure are necessary conditions, while ergodicity and finite-time convergence need their own arguments. The empirical tails in the audited sampler expose their finite resolution, and the z-score remains descriptive rather than a calibrated test. None of these gaps is papered over: the release records "finite mixing is still not proved by the margin identities" as a standing limitation.

## Why stopping on success was the wrong statistics

Consider what the old rule measures. If acceptance probability is p, the old rule advances the chain every 1/p successful moves in expectation but only samples states along successful paths. At stationarity, the fraction of steps that are self-loops is meaningful for the walk's variance and autocorrelation; removing them changes both. Counting attempted proposals restores the denominator. A symmetric chain with self-loops has a known kernel; a jump chain with a data-dependent stopping rule has a kernel that depends on the acceptance pattern of the run, which is exactly the kind of hidden dependence the rest of the audit removes.

## Relation to the rest of the release

The sampler repair pairs with the numerical repairs in doc 06: both remove hidden state-dependence. The detailed-balance-versus-flux separation (doc 06) is the analytical half; this chain redesign is the sampling half. Together they let the null-model machinery produce descriptive z-scores whose provenance is stated: from a specified symmetric chain with counted proposals, not from a stopping heuristic. What they still do not deliver is a proof of mixing, which the evidence-standard doc (doc 10) carries as an open limitation.
