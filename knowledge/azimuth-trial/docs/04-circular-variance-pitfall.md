# 04. Circular variance and resultant-length pitfalls

Scope: what circular variance is, why it is the same confounded quantity that failed as the m = 1 diagnostic, and the resulting permanent exclusion rule.

## The definition

Circular variance is a standard measure of spread for angular data. It is defined in terms of the mean resultant length R-bar: circular variance is 1 minus R-bar, where R-bar is the length of the vector average of the unit vectors pointing at the observed angles ([Wikipedia: Circular mean, w 0.68](https://en.wikipedia.org/wiki/Circular_mean); [Wikipedia: Directional statistics, w 0.80](https://en.wikipedia.org/wiki/Directional_statistics)). R-bar itself is a first-class summary in the circular statistics literature: the R `circular` package exposes it directly as `rho.circular`, the mean resultant length ([CRAN: rho.circular, w 0.83](https://search.r-project.org/CRAN/refmans/circular/html/rho.circular.html)), and general-purpose circular-data-analysis references build their spread measures on the same quantity ([NCSS: Circular Data Analysis, w 0.64](https://www.ncss.com/wp-content/themes/ncss/pdf/Procedures/NCSS/Circular_Data_Analysis.pdf)).

In symbols: V = 1 - R-bar, with R-bar = |(1/N) sum_j exp(i phi_j)|. A tight cluster has R-bar near 1 and circular variance near 0; a uniform spread has R-bar near 0 and circular variance near 1.

## Why that is the m = 1 statistic in disguise

Compare with the trial's harmonic statistic from doc 01: Z_1 = N * |(1/N) sum_j exp(i phi_j)|^2 = N * R-bar^2. Circular variance is a strictly decreasing affine function of exactly the same first moment. This is the point the source record makes in its errata: "Circular variance is 1 - R-bar_1, the same structurally confounded m = 1 quantity. The endpoint correctly lists it as permanently not admitted" (source record: azimuth-trial-2026-09-19, errata 5).

So recommending circular variance would have been recommending the failed diagnostic under another name. The m = 1 channel failed for two structural reasons (docs 01 and 03): the PCA centering forces the radius-weighted first moment to zero, making unweighted Z_1 a measure of radius-angle coupling rather than of angle, and the atomicity of the binary corpus put the apparent signal entirely in the duplicate rows. Both defects carry over unchanged to circular variance, because both act on the same sum.

## The confounding mechanism, stated once

Two separate confounds hit first-moment statistics on this corpus:

1. Radius-angle coupling. After centering, sum_j r_j * exp(i phi_j) = 0 identically, so any apparent first-harmonic structure in the unweighted sum is a statement about how radius correlates with angle across the point masses, not about where the angles sit (source record, errata 2).
2. Multiplicity. The 301 documents are 167 distinct patterns at d = 9 (44.5 percent collision, source record section 3), and duplicates pile identical angles into the sum. A first-moment statistic on the full corpus reads the multiplicity structure as angular structure. This is the repeated-measurement bias of circular estimators: duplicated measurements of the same underlying direction bias the sample mean resultant unless the multiplicity is modeled ([PMC/IEEE: Estimation of Circular Statistics in the Presence of Measurement Bias, w 0.86](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10964323/); [ScienceDirect: circular repeated measurement designs, w 0.55](https://www.sciencedirect.com/science/article/pii/S2307410824000622)).

A second-moment or higher-harmonic statistic (Z_m for m >= 2) escapes the centering identity because centering only kills the first moment. It does not escape the multiplicity problem, which is why the dedup analysis (doc 03) was needed separately.

## The general class of circularity pitfalls

The trial's exclusion rule is a specific instance of a broader failure family: statistics computed on quantities that were themselves used to construct the analysis. The circular-analysis literature calls the general pattern double-dipping or circular analysis: using the same data twice, once to select and once to test, inflates apparent effects ([PMC: Breaking the circularity in circular analyses, w 0.77](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7721178/)). The azimuth case is a structural cousin: the coordinate (angle) was constructed by the same PCA whose centering constraint binds the statistic being computed on it.

## The verdict and its scope

The record's operative rule: replace corpus-level angular readouts with Rayleigh Z_m for m >= 2 and the angular gap spectrum, and never circular variance; sector numbers survive only as opaque display labels (source record, section 6, item 4). Two scope limits on that rule, both from the source record:

- It is a verdict about corpus-level angular readouts on this class of fixtures (discrete binary corpora placed by PCA), not about circular variance in general applied data analysis. On ordinary continuous directional data with no centering coupling and no multiplicities, circular variance is a legitimate spread measure ([NCSS: Circular Data Analysis, w 0.64](https://www.ncss.com/wp-content/themes/ncss/pdf/Procedures/NCSS/Circular_Data_Analysis.pdf)).
- The exclusion is structural, not empirical: it would survive any amount of additional data collection, because the identity that kills the first moment comes from centering, not from sample size.

Popularization-level references to circular variance exist but were weighted low in this mint ([MetricGate: circular mean resultant length, w 0.36, weak](https://metricgate.com/docs/circular-mean-resultant-length/)), so the definition above is grounded on the R reference and directional-statistics sources instead.
