# 05. Reproducibility across seeds: the criterion that bites

Scope: reproducibility across independent seeds as the criterion that bites: verdict_reproducible_all, verdict flips under different null seeds, and why a seed-dependent verdict is not a reading.

Program-specific statements derive from the instrument's trial record of 2026-09-19 (yubiOS refs/admission-trials-2026-09-19.md). External claims are cited inline with jev weight; weights below 0.5 are labeled weak backing.

## Researcher degrees of freedom, mechanized

The trial record's central observation is that reproducibility is the criterion that actually refuses blocks. On the refs/ round-13 baseline (map 431, N=223), the axis trial excluded 6 axes under one null seed and 7 under the second; one axis's verdict flipped, so the block is not admitted even though every null is non-degenerate and the sample is large. The same mechanism refused the spectra E3/even/odd blocks and the radius profile on refs/ 78, and the radius profile on skills/ 81, where the single grid point I(0.115) was excluded under one seed only.

This is the garden of forking paths made mechanical. Gelman and Loken's analysis argues that data-dependent analysis, the garden of forking paths, explains why many statistically significant comparisons do not hold up (The statistical crisis in science, Gelman and Loken, Columbia Statistics, weight 0.849). Their companion note on p-hacking adds the psychological trap: each analysis choice feels forced, conditional on the data already seen, so the degrees of freedom do not feel like degrees of freedom at all (Gelman, p-hacking and the research hypothesis, unpublished manuscript, weight 0.677). A null seed is exactly such a choice: with K=40 draws, the estimated tails depend on which draws were taken, and a verdict computed from one draw set is one path through the garden.

## Why seed-dependence is fatal for an admission criterion

An admission decision is a binary report about a corpus frame. If the report would change under a different random draw set, it is not a property of the data; it is a property of the sampling. The Monte Carlo literature is blunt about this: Monte Carlo methods obtain results by repeated random sampling, and the estimate carries sampling variability that shrinks only with more draws (Wikipedia, Monte Carlo method, weight 0.763). With 40 draws, a statistic sitting near the null boundary can flip from excluded to not-excluded across seeds. The trial's response is `verdict_reproducible`: every per-statistic verdict must agree across the two independent seeds, and `verdicts_reproducible_all` failing is the most common `why_not` in the recorded results.

The design treats this as a refusal, not as noise to smooth over. Averaging across seeds would produce a stable number, but the stability would be manufactured: the underlying verdicts still disagree, and the disagreement is itself information, namely that the statistic's position relative to the null tails is fragile at K=40. Sensitivity analysis is the standard tool for locating such fragility; variance-based reliability methods quantify how changes in inputs propagate to outputs and are the classical approach for stability problems (arXiv 2408.06664, weight 0.926 for the PDF, 0.695 for the HTML version). The two-seed requirement is a deliberately coarse sensitivity check, chosen because it is cheap and its failure is unambiguous.

## The forking paths connection, stated precisely

The garden of forking paths is defined as a problem in frequentist hypothesis testing through which researchers can unintentionally produce false positives through legitimate analytical choices (Wikipedia, forking paths problem, weight 0.115, weak backing). The trial framework eliminates the unintentional part by enumerating the paths: two seeds, fixed K, fixed grid, fixed margins, and published criteria per block. But it does not pretend the paths are harmless: it makes seed-dependence an explicit refusal criterion, so that a result which only exists on one path is never reported as a reading. Researcher degrees of freedom are the choices researchers make when conducting a study, from data collection to analysis details (Kirkegaard, researcher degrees of freedom as sensitivity analysis, weight 0.515); the framework's contribution is converting those choices from hidden degrees of freedom into recorded, testable parameters.

## What this costs and what it buys

The cost is visible in the results table: several blocks with clean statistics and non-degenerate nulls are refused purely on reproducibility. The record's own wording is that "a verdict that depends on which 40 draws you took is not a reading; the trial says so instead of averaging it away." The benefit is that admitted blocks carry a stronger meaning: their verdicts survived two independent null draw sets, their nulls were non-degenerate, and their margins were preserved. On the six stored baselines, the admitted set is strictly smaller than the not-excluded set, and the difference between the two is exactly the set of seed-fragile results.

## Sources

Primary (weight >= 0.5): arXiv 2408.06664 variance-based reliability sensitivity (0.926 PDF, 0.695 HTML), Gelman and Loken statistical crisis in science (0.849), Wikipedia Monte Carlo method (0.763), Gelman p-hacking note (0.677). Weak backing (weight < 0.5): Kirkegaard researcher degrees of freedom (0.515), Wikipedia forking paths problem (0.115).
