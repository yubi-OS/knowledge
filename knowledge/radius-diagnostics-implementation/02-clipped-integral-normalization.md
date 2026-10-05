# 02: The clipped integral S_R and normalization by N

Scope: why the radius diagnostic reports S_R = sum of min(R, c_i) alongside the indicator count, what the clip does mathematically, and why S_R/N is kept visible instead of being silently folded into one number.

## From a count to an integral

I(r) from doc 01 is a step function: the number of items isolated at radius r. An alternative single-number summary asks a slightly different question: how much clearance mass sits below a reference radius R? The answer is the clipped integral of the indicator:

S_R = sum over items of min(R, c_i).

Each item contributes its clearance c_i if it is smaller than R, and R if it is larger. This is the integral of the "isolation indicator" clipped at the reference radius: items far above R stop contributing beyond R, and items below R contribute their exact shortfall. The shape is familiar from empirical distribution function theory: an indicator count against a threshold is a step function, and statistical functionals of the empirical distribution are built from exactly such counts (source: https://nchenderson.github.io/elements-nonpar-stat/edf.html , jev weight 0.79). The empirical CDF literature makes the underlying point directly: the EDF is an estimate of the underlying cumulative distribution and is built by counting observations at or below each value (source: https://library.virginia.edu/data/articles/understanding-empirical-cumulative-distribution-functions , jev weight 0.74).

The clip is what makes S_R a bounded, comparable quantity rather than a raw sum of distances. Without the clip, one extremely isolated item would dominate the sum; with the clip, contribution saturates at R. This is the same reason bounded summaries are preferred in threshold-sweep statistics generally.

## The spatial-statistics precedent: Ripley's K

The closest well-known relative of this construction is Ripley's K function, which counts points within a distance r of a typical point and studies how that count changes as r changes. ArcGIS documents the multi-distance version exactly in these terms: it determines whether features exhibit clustering across a range of distances, by evaluating counts at multiple neighborhood sizes (source: https://doc.esri.com/en/arcgis-pro/latest/tool-reference/spatial-statistics/multi-distance-spatial-cluster-analysis.html , jev weight 0.90). The tool documentation is explicit that the K-function "illustrates how the spatial clustering or dispersion of feature centroids changes when the neighborhood size changes", which is the sweep structure the radius profile inherits (source: https://doc.esri.com/en/arcgis-pro/latest/tool-reference/spatial-statistics/h-how-multi-distance-spatial-cluster-analysis-ripl.html , jev weight 0.89). Survey work on accelerating space-time Ripley's K describes the function as a multi-distance point-pattern method for studying spatial arrangement (source: https://arxiv.org/pdf/1912.04753 , jev weight 0.82), and practitioner documentation covers computing and interpreting the function as a curve over distance rather than a single number (source: https://docs.muspan.co.uk/latest/_collections/spatial_analysis_methods/Spatial%20stats%20-%205%20-%20RipleysK.html , jev weight 0.68).

The lesson the diagnostic takes from this literature is the curve, not the test. Ripley's K is usually used for significance testing against a null pattern; the radius profile deliberately uses the same sweep shape only descriptively, as a diagnostic.

## Why S_R/N is reported separately

Raw S_R scales with corpus size: add items, and the sum grows even if nothing about the geometry changed. Dividing by N, the number of items, produces a per-item mean clipped clearance, which is comparable across corpora of different sizes. The diagnostic reports both S_R and S_R/N, so that a change in the raw number is decomposable into "the corpus got bigger" versus "the geometry changed".

This split is the same discipline that normalization practices in count-based data analysis enforce. In single-cell and microbiome count data, size factors are computed precisely so that systematic count differences caused by sample size are removed before comparison; the RAIDA method, for example, computes size factors from observed counts before ratios are formed (source: https://pmc.ncbi.nlm.nih.gov/articles/PMC10461514/ , jev weight 0.85), and the standard scRNA-seq workflow divides counts by a computed scaling factor to get normalized values (source: https://jhudatascience.org/GDSCN_Book_Statistics_for_Genomics_scRNA-seq/normalization.html , jev weight 0.81). Bioconductor documentation makes the assumption behind this explicit: systematic differences in count size across the non-differentially-expressed majority are treated as bias to remove (source: https://bioconductor.org/books/3.14/OSCA.basic/normalization.html , jev weight 0.54).

The diagnostic inverts the emphasis. Instead of normalizing first and reporting one number, it reports the normalized value and the raw value side by side. The reason is diagnostic intent: a growth in N is itself an interesting event for a corpus instrument, and hiding it inside a normalized statistic would destroy that signal.

## What S_R is not

Three things S_R is not:

1. It is not a probability or a p-value. No null model is fitted; the profile is descriptive (contrast Ripley's K, where the same curve is typically compared against a random-positioning expectation, as in the ArcGIS tool framing above).
2. It is not an exact-arithmetic proof. The clipped integral is computed in Float64 from Float64 clearances; the boundary correctness of that computation is handled in docs 03 and 04.
3. It is not a substitute for the indicator count at the operative radius. S_R aggregates across the whole range below R and so can hide a change concentrated near the operative radius; I(r) at the fixed grid points does not.

## Summary

1. S_R = sum of min(R, c_i) is the clipped integral of the isolation indicator, saturating each item's contribution at R.
2. The construction is a first cousin of Ripley's K, which counts within a distance across a sweep of distances; the diagnostic borrows the sweep shape but not the significance-testing use.
3. S_R/N is reported next to S_R so that corpus growth is visible instead of being normalized away; this mirrors size-factor normalization discipline in count data.
4. Both numbers are Float64 quantities over computed distances, diagnostic-only, and make no statistical or physical claim.

Project record: the motivating implementation defines these quantities in its radius diagnostics module and reports S_R/N separately, per https://github.com/yubi-OS/yubiOS/pull/233 .
