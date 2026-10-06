# 06 - Null ensembles and the primary statistic

Scope: the three matched nulls, why curveball is the primary decision null, the N and d matching rule, and dV2z as the headline number.

Source of record: yubi-OS/yubiOS skills/curved-corpus-create/SKILL.md. The curveball algorithm's origin is grounded by a primary dig result.

## The three nulls

The skill generates matched nulls in three kinds [source doc]:

1. curveball: preserves BOTH row sums and column sums. Each null draw is a binary matrix with identical marginals to the data, differing only in which cells carry the 1s.
2. column-permutation: permutes each column independently, preserving column sums but scrambling row structure.
3. iid: independent Bernoulli draws at the base rate, preserving nothing but density.

The curveball procedure comes from ecology, where binary presence-absence matrices needed randomization that preserves row and column totals; the canonical description is "a fast and unbiased procedure to randomize ecological binary matrices with fixed row and column sums" [primary source: https://www.nature.com/articles/ncomms5114, jev weight 0.85; weak mirror: https://www.researchgate.net/publication/263016185_A_fast_and_unbiased_procedure_to_randomize_ecological_binary_matrices_with_fixed_row_and_column_sums, jev weight 0.58].

## Why curveball decides

Guideline 2 is explicit: use the curveball null for the primary decision [source doc]. The reason is what the null preserves. The iid and column-permutation nulls destroy row-mass structure, so a corpus whose rows differ in mass will look "structured" against them without having any curve. The red-flags table names the exact failure: dV2z large under iid or colperm but near 0 under curveball means you are measuring row-mass bimodality, not structure [source doc].

## The matching rule

Guideline 3: match the null's N and d to the data [source doc]. V2 nulls relax toward 2/D like Marchenko-Pastur in D/N [source doc]. Comparing a real N=40 value to a null computed at N=2286 manufactures a critical point that is not there [source doc]. The nulls are therefore always generated at the same N and d as the corpus under test.

## The primary statistic

dV2z = (V2 - E_0[V2_curveball]) / SD_0[V2_curveball] is the primary statistic [source doc]. In words: how many standard deviations of the curveball null's V2 distribution does the observed V2 sit above the null mean. The measure subcommand emits per-null {V2_mean, V2_sd, dV2, dV2z} for each requested null kind [source doc].

A negative dV2z is itself a signal: dV2z large and negative means the corpus is less concentrated than its marginals allow [source doc, red flags].

## Trade count and sparse matrices

The curveball trade count defaults to 5N and should be raised for very sparse or very dense matrices [source doc, constraints]. Too few trades leaves the null ensemble under-mixed, which shows up as a false-positive-rate failure in the calibration pack (doc 07): FPR at |z|>3 above 0.05 means the null ensemble is under-mixed [source doc, red flags].

## Supplying nulls to other channels

Nulls are a product, not just an internal step. The source doc's example 5 shows the loop for generating a bank of nulls for another channel: 200 seeds of generate --kind null at N=2286, d=9, one JSON per seed [source doc]. The Composition table records that the Hodge channel (C-hodge-pivot) consumes generated corpora as Hodge nulls, bidirectionally [source doc].

## Worked contrast

The two source-doc examples give the contrast the nulls exist to produce [source doc]:

- Planted corpus (amplitude 1.5, N = 200, d = 9, seed 11), 200 curveball reps: V2 = 0.4477, curveball V2_mean = 0.2864, V2_sd = 0.0091, dV2 = +0.1613, dV2z = +17.67.
- Null corpus (same N and d, seed 12), 80 reps: V2 = 0.2850, dV2z = -0.116.

Same dimensions, different kind. The planted corpus sits 17.67 null standard deviations above its null mean; the null corpus sits 0.12 below its own. Any pipeline whose verdicts disagree with this contrast is mis-measuring.

## Why the ecology null fits binary matrices

The curveball randomization was built for exactly the data shape this skill requires: binary matrices with fixed row and column totals, where naive swap methods are biased or slow [primary source: https://www.nature.com/articles/ncomms5114, jev weight 0.85]. The skill's use of it is direct: the null ensemble preserves the marginals the data actually has, so the only remaining difference between data and null is the correlation structure, which is what V2 measures.

## What "matched" rules out

The three nulls are matched to the corpus by N, d, and marginal structure. What they are NOT matched by is the curve: that is the one thing the planted corpus has and the nulls lack. The column-permutation null preserves column sums but destroys any row-level coupling; the iid null preserves only density. This gradient of preservation is the diagnostic ladder: a corpus that separates from iid but not from curveball has row-mass bimodality, not structure [source doc, red flags].
