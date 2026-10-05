# 07. The six stored baselines: reading the results table

Scope: the six stored baseline results (maps 436, 431, 78, 81, 326, 296): which diagnostics admitted where, the N threshold refusals, and the first frame where all four diagnostics admitted at once.

Program-specific statements derive from the instrument's trial record of 2026-09-19 (yubiOS refs/admission-trials-2026-09-19.md). External claims are cited inline with jev weight; weights below 0.5 are labeled weak backing.

## The table

The unified admission call was run on six stored baselines with K=40 and default seeds. The recorded outcomes are:

| map | corpus | N | rayleigh | axis | spectra | radius |
|---|---|---|---|---|---|---|
| 436 | refs/ round-13 close | 226 | True | True (excl 7/7) | True | True |
| 431 | refs/ round-13 baseline | 223 | True | False (`verdicts_reproducible_all`) | True | True |
| 78 | refs/ round-4 baseline | 178 | True | False (`verdicts_reproducible_all`) | False (`verdicts_reproducible_all`) | False (`verdicts_reproducible_all`) |
| 81 | skills/ round-1 baseline | 495 | True | True (excl 9/9) | True | False (`verdicts_reproducible_all`) |
| 326 | skills/ round-12 baseline | 112 | True | True (excl 3/3) | False (`verdicts_reproducible_all`) | True |
| 296 | docs/ round-11 baseline | 21 | False | False (`n_at_least_100`) | False (`n_at_least_100`) | False (`n_at_least_100`) |

## The N floor dominates the smallest frame

Map 296 has N=21, and every trial refuses it on `n_at_least_100` alone; the rayleigh trial is simply False. This is deliberate floor behavior, and the small-sample literature explains why a floor is needed rather than a case-by-case judgment. Simulated examples demonstrate that small sample sizes make estimates of means, medians, and proportions unreliable and conclusions unstable (Why is a small sample size not enough?, The Oncologist, weight 0.859, also mirrored at PMC11379640, weight 0.893). Small samples pose structural challenges for quantitative analysis regardless of the care taken in analysis (On the scientific study of small samples, The Leadership Quarterly, weight 0.893). The cognitive failure mode is well documented as sample size neglect: incorrect statistical conclusions drawn because the sample size is not considered, with small samples carrying higher variance (Investopedia, sample size neglect, weight 0.625). The floor converts these risks into a mechanical refusal.

## The reproducibility criterion does the rest of the refusing

Every other refusal in the table is `verdicts_reproducible_all`: the per-statistic verdicts disagreed between the two independent null seeds. Map 431 lost the axis trial because 6 axes were excluded under one seed and 7 under the other; map 78 lost axis, spectra, and radius the same way; map 81 lost radius because the single grid point I(0.115) was excluded under one seed only. The reproducibility literature supports treating such instability as disqualifying rather than noisy: a lack of standard definitions for reproducibility complicates the field, and the paper reviews the literature to clarify what reproducibility means for statistical results (Statistical perspectives on reproducibility: definitions and challenges, Springer, weight 0.915). Reproducibility of results and conclusions is essential, and problems with it have been widely discussed (Statistical Reproducibility, Springer reference-work entry, weight 0.762). An analysis involves hundreds of large and small decisions, and some of those decisions can dramatically affect conclusions (Applied Multivariate Statistics in R, UW Pressbooks, weight 0.604); the two-seed rule pins one of those decisions down and refuses the frame when it does not hold.

## What the table says about the corpus frames

Three patterns are worth reading out of the table. First, the radius I(r) counts are not-excluded on every refs/ and docs/ frame: the isolate profile of the refs/ point cloud is what a margin-matched random bit matrix also produces, so the profile carries no detectable signal beyond its margins. Second, the spectra shares are strongly excluded from the fixed-margin null on refs/ 436 and skills/ 81, reproducibly, so the shares are admitted for reporting there; the record stresses this is the first time the card's numbers carry a null and it does not make them homology or physics. Third, exclusions can be large and still fail admission: maps 431 (6/7 or 7/7 axes) and 81 (9/9 axes) excluded nearly everything under at least one seed, and 431 still refused the axis block because the two seeds disagreed on one axis.

## The first all-four frame

Refs/ 436, the round-13 close, is the first frame on which all four diagnostics are admitted at once. Its observed values are recorded verbatim for the archive: spectra shares E0 0.43457396894193234, E1 0.4663251610438744, E2 0.038721576679943956, E3 0.06037929333424935, even 0.4732955456218763, odd 0.5267044543781237; radius I(r) on the grid I(0.075)=34, I(0.085)=29, I(0.095)=23, I(0.105)=14, I(0.115)=7.

Software-engineering evidence supports the value of the underlying discipline: experiments are too often validated by ad hoc human effort, and a paper listing frequent threats to statistical conclusion validity is what rigorous checking looks like in practice (SIGPLAN Research Highlights, weight 0.865). Computational reproducibility across environments has gained significant attention in fields like neuroimaging for exactly the same reason the trials pin seeds, grids, and margins (HAL, hal-04480308, weight 0.530).

## Sources

Primary (weight >= 0.5): Springer statistical perspectives on reproducibility (0.915), PMC small sample size (0.893), The Oncologist small sample size (0.859), The Leadership Quarterly small samples (0.893), SIGPLAN Research Highlights (0.865), Springer statistical reproducibility (0.762), Investopedia sample size neglect (0.625), UW Pressbooks reproducible research (0.604), HAL neuroimaging reproducibility (0.530). Weak backing (weight < 0.5): ResearchGate mirror of the reproducibility paper (0.582 counts as moderate and is the same paper as the Springer original), Wikipedia reproducibility (0.106).
