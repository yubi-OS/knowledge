# 05 - Multi-seed sweeps and why single-seed results mislead

Scope: estimator instability under reseeding, how multi-seed sweeps expose lucky single runs, and the reporting discipline that separates a robust metric from a lucky one.

## The single-seed trap

A stochastic pipeline evaluated once produces one number, and that number is a draw from a distribution, not the distribution. The documented falsification harness is a concrete demonstration: evaluated on a single seed (42), all three tests passed, with sparse-cell recovery at exactly the 80 percent gate. Evaluated across 10 seeds, the same test passed on only 40 percent of seeds, with mean recovery of 55 percent, median 70 percent, and a lower tail reaching 0 percent (source document: falsification harness results, 2026-08-06). Seed 42 was the top of the distribution, not its center.

This pattern is well documented in machine learning evaluation research. A study of random seeds in fine-tuning found significant variance at both macro and micro levels and introduced a consistency metric measuring the stability of individual predictions across runs [1] (weight 0.76). Evaluation of visual question answering benchmarks similarly observes that point estimates overlook significant performance variance caused by stochastic outputs, training seed sensitivity, and hyperparameter configuration [2] (weight 0.81).

## What multi-seed sweeps buy

Averaging across multiple runs, including different seeds, and computing mean and standard deviation for selected metrics gives a more stable and reliable estimate of algorithm behavior than any single run [3] (weight 0.87). This is the design principle behind the Du-IN repository's systematic multi-seed experimental design, which repeats each experimental configuration across multiple random initializations so that reported results are not artifacts of a single random initialization [4] (weight 0.50).

More sophisticated designs control the variance directly. Paired seed evaluation propagates variance reduction through the evaluation pipeline, yielding tighter confidence intervals, higher statistical power, improved directional stability, and substantial effective sample size gains at fixed computational budgets [5] (weight 0.78). The lesson generalizes: when compute is limited, spending it on paired comparisons across seeds buys more valid information than spending it on more data points within one seed.

For the harness specifically, the sweep converts three single numbers into three distributions. Only the recovery-rate distribution has meaningful spread, and that spread is the falsification signal. The fit-quality and invariant tests have no meaningful seed variance, which is itself evidence that those properties are properties of the pipeline design rather than of any particular dataset draw.

## Formal treatments of seed stability

Seed-induced variability has been formalized rather than merely observed. Recent work formalizes random seed stability via a concentration condition and proves that certain subsampling schemes guarantee stability, addressing how prediction variance across seeds propagates into downstream estimators [6] (weak backing, weight 0.12). Topic-level summaries describe random seed variance as measurable fluctuation in outputs due solely to the pseudorandom seed, arising from weight initialization, data shuffling, and hardware nondeterminism [7] (weak backing, weight 0.42; same source re-encountered at weight 0.13 [8]).

## Reporting discipline

1. Report mean, median, and the tail. For the harness recovery rate, mean 55 percent and median 70 percent tell different stories, and both differ from the lucky single seed.
2. State the gate before the sweep. A pass rate of 40 percent on a pre-committed 80 percent gate is a verdict; a gate chosen after seeing the distribution is a rationalization.
3. Treat "passes on some seeds" as a property, not a footnote. It quantifies reliability: a downstream consumer can expect roughly a 40 percent chance the detector meets the bar on a fresh corpus.
4. Distinguish sources of variance. Seed variance in the corpus generator is different from seed variance in the detector's internals; the harness varies the former while holding the latter fixed, which is the cleaner experimental design.

## Sources

[1] https://arxiv.org/html/2503.07329v2 (weight 0.76)
[2] https://arxiv.org/html/2508.02645 (weight 0.81)
[3] https://arxiv.org/html/2405.18077 (weight 0.87)
[4] https://deepwiki.com/liulab-repository/Du-IN/4.3-multi-seed-experiments (weight 0.50)
[5] https://arxiv.org/pdf/2512.24145v1 (weight 0.78)
[6] https://arxiv.org/html/2604.17694v1 (weight 0.12, weak)
[7] https://www.emergentmind.com/topics/random-seed-variance (weight 0.42, weak)
[8] https://www.emergentmind.com/topics/random-seed-variance (weight 0.13, weak)
