# 09 - Transferring falsification results from synthetic to real corpora

Scope: what a validation result measured on a synthetic generator does and does not tell you about the pipeline's behavior on real data, and how to structure the transfer question.

## The gap is a property, not an accident

A falsification harness validates a pipeline against the generator's distribution. Every passing result is conditional on that distribution. When the pipeline's real target is a different distribution (real corpora instead of synthetic ones), the transfer question becomes empirical: does the property that held synthetically hold on real inputs? The synthetic-to-real literature treats this as a structural problem. Work on the synthetic-real gap in machine learning demonstrates improved tradeoffs between the amount of real training data used and model accuracy through transfer-learning bridges, contributing to understanding of the gap itself [1] (weight 0.92). Distribution-shift research formalizes the underlying difficulty: statistical properties differ between training and test datasets, directly impacting generalization and robustness [2] (weight 0.77), and out-of-distribution generalization surveys identify formal characterization of the distributional shift as the first pivotal issue in addressing the problem [3] (weight 0.85).

## Which properties transfer, and which do not

The harness's three results do not transfer uniformly, and the reason is instructive.

Properties that depend on the pipeline's internal logic transfer best. The fit-quality gate (T1) and the atom's delta invariant (T3) held on 10 of 10 synthetic seeds. The invariant in particular is a mathematical property checked empirically; if the implementation is correct, it holds on any corpus, synthetic or real. What the synthetic sweep establishes is that the implementation passes the check and that the check is discriminating enough to run on 1170 invocations without trivially passing.

Properties that depend on the data's geometry transfer worst. The sparse-cell recovery rate (T2) failed on 60 percent of seeds. Its value is a function of where natural clusters fall in the projected plane, which is a property of the generator. A real corpus has different cluster geometry, so the 55 percent mean recovery number cannot be read as a prediction for real data; it can only be read as evidence that the detector's sensitivity is distribution-sensitive. The source document states this explicitly: whether real corpora cluster similarly to the synthetic one determines whether similar 40 to 60 percent reliability should be expected, and real corpora with more structure may recover better.

Practitioner guidance on synthetic data says the same thing from the data side: synthetic data helps only when it expands the real task distribution; if the generated examples repeat shallow templates or model-prior assumptions, the data does not generalize [4] (weak backing, weight 0.47). Commercial transfer-measurement services operationalize the check directly, measuring how synthetic datasets transfer to real-world performance and surfacing the gaps [5] (weak backing, weight 0.21), and topic surveys define performance transferability as exactly the measure of how well models trained on simulated data maintain predictive performance under real-world conditions [6] (weak backing, weight 0.11).

## How to run the transfer empirically

The harness design makes the transfer test cheap, because the tests are corpus-agnostic: the same three gates run on any (N, 9) coverage matrix. The documented next step is to apply the same harness to a real corpus (the source document names the skill corpus from the same repository as the candidate) and compare recovery distributions. The comparison answers the open question directly, with one important control: the real corpus's primitive basis must be stated, because a different basis changes the geometry being tested.

A structured transfer protocol:

1. Derive the real corpus's primitive vectors using a stated, grounded basis.
2. Run T1 and record whether the real corpus clears the fit gate at all; a real corpus below the gate is unfit for the pipeline regardless of detector behavior.
3. Run T2 with the same planted-combination methodology, adapted to the real basis's rare combinations, and report the full distribution across resampling or seed variation where the corpus permits.
4. Run T3 on every real item; any violation is an implementation-level finding that takes priority over the statistical questions.
5. Compare distributions, not point estimates, against the synthetic baseline (mean 55 percent, median 70 percent, 40 percent gate pass rate).

## What remains unknown

The transfer question in the source document is genuinely open: the harness was built to produce the falsification signal, and applying it to a real corpus is the recorded next step. Until that run exists, the defensible claims are the internal ones (the pipeline's logic is invariant-clean; its fit gate is robustly met on structured synthetic corpora; its prioritization lens is distribution-sensitive), not predictive claims about real-corpus reliability.

## Sources

[1] https://arxiv.org/html/2405.03243v1 (weight 0.92)
[2] https://arxiv.org/pdf/2405.01978 (weight 0.77)
[3] https://arxiv.org/pdf/2108.13624 (weight 0.85)
[4] https://perspectives.nvidia.com/synthethic-data-generation/synthetic-training-data-generalization-tools/ (weight 0.47, weak)
[5] https://www.datafylab.com/offerings/synthetic-to-real-validation (weight 0.21, weak)
[6] https://www.emergentmind.com/topics/performance-transferability-to-real-world-data (weight 0.11, weak)
