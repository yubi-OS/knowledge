# 05 - The measure subcommand and its statistics

Scope: everything measure reports, the frozen fit pipeline behind the numbers, and why each statistic exists.

Source of record: yubi-OS/yubiOS skills/curved-corpus-create/SKILL.md. External mechanisms named by the doc (participation ratio, Shannon rank, Marchenko-Pastur relaxation, Otsu bimodality) are grounded by the dig; results are weak and labeled.

## The reported statistics

The measure subcommand reports [source doc]:

- Correlation-matrix spectrum: V2, participation ratio r_eff, Shannon effective rank, mean off-diagonal rho.
- Row-mass mean and sd, and Otsu bimodality.
- Column marginals.
- PCA top-2, then stereographic lift to S^2, then ridge-SH fit: sphere R^2, chordal residual mean and p95, design rank and condition number, Y_3^3 probe.
- Per null draw set: V2_mean, V2_sd, dV2, dV2z.

## What each statistic watches

V2 is the headline concentration statistic of the regime; it is only meaningful against its null. The participation ratio r_eff measures how many eigenvalues carry the spectrum's mass; it is a scale-dependent dimensionality measure studied in its own right [weak backing: https://www.biorxiv.org/content/10.1101/2020.12.19.423618v3.full.pdf, jev weight 0.49]. The Shannon effective rank is the exponential of spectral entropy, an alternative effective-dimension estimate used in spectral analyses [weak backing: https://arxiv.org/html/2610.02283v1, jev weight 0.45].

The null ensemble summary is the decision payload: dV2z = (V2 - E_0[V2_curveball]) / SD_0[V2_curveball] is the primary statistic [source doc]. It asks how many null-standard deviations the observed V2 sits above the curveball null's mean.

## The frozen fit pipeline

The fit pipeline is frozen [source doc]: PCA top-2 to stereographic lift from the south pole to S^2, identity-init Mobius (a=d=1, b=c=0), then closed-form ridge C* = (Phi^T Phi + lambda I)^-1 Phi^T Z with lambda = 1e-3, then chordal S^2 residuals per item. The design matrix has 16 columns (L = 3 real SH), and measure reports design_numrank and design_cond so a collapsed design is visible.

## Relaxation toward 2/D

The source doc states that V2 nulls relax toward 2/D like Marchenko-Pastur in D/N [source doc]. The Marchenko-Pastur law describes the limiting eigenvalue distribution of large random matrices and its bulk edge scales with aspect ratio [weak backing: https://en.wikipedia.org/wiki/Marchenko%E2%80%93Pastur_distribution, jev weight 0.42]. This is the mathematical reason behind guideline 3 (doc 09): a null computed at a different N or d is not the same null.

## Otsu bimodality and row mass

Row-mass mean and sd plus Otsu bimodality watch for a row-mass split: rows whose total 1-counts form two clusters. Otsu's method selects a threshold maximizing between-class variance of a histogram; used here as a bimodality diagnostic on the row-mass distribution [weak backing: https://www.biorxiv.org/content/10.1101/2020.12.19.423618v3.full.pdf, jev weight 0.49]. The red-flags table (doc 09) uses this: dV2z large under iid or column-permutation nulls but near 0 under curveball means you are measuring row-mass bimodality, not structure [source doc].

## Diagnostics, not evidence

Sphere R^2 and PC1+PC2 are diagnostics, not evidence [source doc, guideline 6]. The gate PC1+PC2 >= 0.40 is reported, never trusted alone [source doc].

## Worked output, annotated

The source doc's example 1 measure output, annotated field by field [source doc]:

```
V2 = 0.4477   r_eff = 6.837   sphere_r2 = 0.4330   chordal_resid_mean = 0.5509
PC1+PC2 = 0.4474 (gate_pass=true)   design_numrank = 16   design_cond = 1.006
curveball: V2_mean = 0.2864  V2_sd = 0.0091  dV2 = +0.1613  dV2z = +17.67
```

Reading it in the order the guidelines demand: the raw V2 = 0.4477 is not reported alone; the curveball line supplies its null (V2_mean = 0.2864, V2_sd = 0.0091), so dV2 = +0.1613 and dV2z = +17.67. The gate line PC1+PC2 = 0.4474 (gate_pass=true) is reported but, per guideline 6, treated as a diagnostic: the decision rests on dV2z. design_numrank = 16 and design_cond = 1.006 confirm the SH design did not collapse, so sphere_r2 = 0.4330 is a meaningful diagnostic.

## reps and the null ensemble

The --reps flag sets how many null draws back each statistic. Example 1 uses reps 200 for the planted corpus; example 2 uses reps 80 for the null [source doc]. The null ensemble size is part of the experimental design recorded in each calibration lens's parameters (doc 07), and a too-small ensemble shows up as an under-mixed null: FPR at |z|>3 above 0.05 [source doc, red flags].
