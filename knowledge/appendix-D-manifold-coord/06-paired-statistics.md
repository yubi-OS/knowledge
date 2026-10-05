# 06. Paired statistics for seeded benchmarks

Scope: paired per-seed analysis for benchmark evaluation: seeded replication, paired deltas, t-tests, win counts, and what they do and do not establish.

## The conventional protocol and its weakness

Across learning based simulators and benchmark environments, evaluation typically runs each algorithm or intervention under independently sampled random seeds and reports aggregate statistics such as the mean and standard deviation (https://arxiv.org/pdf/2512.24145v1, weight 0.8195). Independent sampling discards the pairing structure: when both arms of a comparison run on the same seed, per-seed differences are available, and the paper argues paired seed evaluation is the statistically reliable alternative for learning based benchmarks (https://arxiv.org/pdf/2512.24145v1, weight 0.8195).

The pairing matters because variance across seeds is shared. If arm A and arm B both run on seed k, the difference A minus B cancels whatever seed k made easy, leaving the treatment effect. Summing those paired differences across seeds gives a paired delta with its own mean and standard deviation, which is the input to a paired t test.

## Significance testing as a methodological requirement

Consistently checking the statistical significance of experimental results is described as one of the mandatory methodological steps to address the reproducibility crisis in deep reinforcement learning, and a dedicated tutorial paper explains how the number of random seeds affects statistical power (https://arxiv.org/pdf/1806.08295, weight 0.7822; abstract page https://arxiv.org/abs/1806.08295, weight 0.7447). Practical guidance from that line of work recommends Welch's t test with a significance level below 0.05 and at least 20 different random seeds (https://domrigby.github.io/general_training/StatisticallyEvaluatingRL.html, weak backing, weight 0.2775).

The paired t test itself is a standard tool for comparing machine learning classifiers: hypothesis testing provides a framework for making data decisions and helps the researcher extrapolate from the sample to the larger population (https://towardsdatascience.com/paired-t-test-to-evaluate-machine-learning-classifiers-1f395a6c93fa/, weight 0.5181).

## What a benchmark number actually is

Every benchmark number is a random variable: it depends on which items were sampled, which random seeds were used, which prompts and decoding parameters were chosen, and, when a model grades a model, which judge was trusted (https://prakashkagitha.github.io/llm-stack-book/11-evaluation/06-statistical-rigor-eval.html, weak backing, weight 0.4137). This is the epistemic basis for reporting uncertainty with every comparison rather than a bare mean.

## Win counts and paired deltas together

Given per-seed paired deltas, two complementary summaries are standard.

- The paired delta mean and standard deviation, with a t statistic and one-sided or two-sided p value, establishes whether the mean difference is distinguishable from zero. This is the significance machinery of the seeds literature (https://arxiv.org/pdf/1806.08295, weight 0.7822).
- Win counts, the tally of how many seeds each arm wins, are a descriptive robustness check that follows directly from the same per-seed data. A large mean delta with a lopsided win count is consistent; a large mean delta carried by one or two seeds is fragile. Win counts do not replace the test; they expose whether the test's input is uniform or driven by outliers.

## What paired statistics do not establish

1. Significance is about the seeds sampled, not about new target designs. A paired t test on 10 seeds says the difference is reliable across those seeds; it does not validate the benchmark's target design. That requires the span analysis of doc 05.
2. Welch's t test assumes approximately normal per-seed deltas; with few seeds the normal approximation is the weak link, which is why the power analysis literature emphasizes seed counts (https://arxiv.org/pdf/1806.08295, weight 0.7822).
3. Aggregate statistics over independently sampled seeds hide pairing structure (https://arxiv.org/pdf/2512.24145v1, weight 0.8195), so meta-analyses of published numbers cannot recover paired tests after the fact. The pairing must be designed in.

Weak backing section: a GeeksforGeeks t test page scored low (https://www.geeksforgeeks.org/data-science/t-test/, weak backing, weight 0.35), as did an Information Retrieval discussion post on significance practice (https://www.linkedin.com/posts/frommholz_followers-what-is-your-take-on-reporting-activity-7210294161529360385-9WzT, weak backing, weight 0.1456), a dictionary entry (https://www.merriam-webster.com/dictionary/statistical, weight 0.079), and two off topic hits (https://handwiki.org/wiki/Software:List_of_RNA-Seq_bioinformatics_tools, weight 0.0333; https://www.newgrounds.com/portal/view/470962, weight 0.0244). No factual claim above relies on them.
