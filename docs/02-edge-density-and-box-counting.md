# Edge Density and Box Counting: Why Ink Thickness Moves the Measured Fractal Dimension

## Scope

This doc covers how edge-map ink density, edge-pixel count, and edge stroke width bias box-counting fractal-dimension (D) estimates of edge maps. It explains the mechanism, reports what the literature says about controlling it, and derives the pipeline requirements a standardized taste-measurement pipeline must pin before D values from different runs are comparable. Grounding is limited to the sources listed at the end; each claim carries its source URL and jev weight, and claims with weight below 0.5 are labeled as weak backing.

## The mechanism: box counting counts occupied boxes, and ink makes boxes

Box counting estimates D as the negative slope of log N(epsilon) versus log epsilon, where N(epsilon) is the number of boxes of side epsilon needed to cover the set (source: https://en.wikipedia.org/wiki/Fractal_dimension, jev 0.24, weak backing). Because N is a count of occupied boxes, anything that adds ink to the edge map changes N at small epsilon. A 1-pixel-wide edge and a 3-pixel-wide rendering of the same contour occupy different box counts at fine scales, so the fitted slope, and therefore the reported D, differs even when the underlying contour is identical.

The crossover is predictable from the definition (weak backing, arithmetic derived from it): for a straight contour of pixel length L rendered k pixels wide, N(epsilon) behaves like L/epsilon for epsilon larger than the stroke width k, so the slope approaches 1, the dimension of a line. For epsilon smaller than k, the stroke fills 2D area and N(epsilon) approaches area/epsilon^2, so the slope approaches 2. The measured D therefore depends on where the epsilon range sits relative to stroke width. Thicker edges push the D estimate toward 2; thinner edges toward 1. Any pipeline step that changes edge thickness (threshold level, non-maximum suppression, dilation, anti-aliasing) shifts the measured D without the underlying shape changing at all.

## What the literature says

The vision-science literature treats edge-map D as a scale-dependent roughness statistic and flags the extraction step as a first-order confound: a Journal of Vision study on semi-automated edge extraction and fractal box counting presents edge Df as a measure of edge roughness across scales and documents the concerns that arise from how edges are extracted before counting (source: https://jov.arvojournals.org/article.aspx?articleid=2433877, jev 0.91). That is the strongest direct backing in this dig: the edge-extraction stage, not the counting stage, is where comparability is won or lost.

A review of fractal dimension estimation for fracture networks reports that box counting is widely applied but that the seemingly straightforward procedure has pitfalls, and surveys corrective practices (source: https://link.springer.com/article/10.1007/s11004-025-10249-7, jev 0.75). The fracture-network community reaches the same conclusion from a different domain: naive box counting on a digitized line network is sensitive to how the lines are rasterized and preprocessed.

Methodological papers converge on the same point for images. A Results in Engineering paper proposes an effective method to compute the box-counting dimension specifically because the standard procedure is sensitive to implementation choices (source: https://www.sciencedirect.com/science/article/pii/S2590123020300128, jev 0.86). Texture-analysis work makes preprocessing explicit: a Procedia Engineering survey of fractal-dimension texture analysis treats the binarization and edge-map production step as part of the measurement method, not an incidental detail (source: https://www.sciencedirect.com/science/article/pii/S1877705812022618, jev 0.74). Work on color texture images likewise conditions the estimate on how the image is converted to the counted set before any box is laid down (source: https://link.springer.com/article/10.1007/s10851-019-00912-0, jev 0.85; mirrored at https://dl.acm.org/doi/10.1007/s10851-019-00912-0, jev 0.70).

None of these sources publishes a single universal ink-density correction factor, so the pipeline should not invent one. What the literature supports is the weaker and more robust claim: D estimates are conditional on the edge-extraction and ink-production stage, and uncontrolled variation there is a documented failure mode.

## What a standardized pipeline must pin

Three requirements follow directly.

1. Pin the edge operator and its parameters. The same image run through different edge thresholds produces different edge-pixel counts, and the J Vision result (jev 0.91) plus the fracture-network review (jev 0.75) both locate the comparability hazard at exactly this stage. Fix the operator, the threshold policy, and any non-maximum-suppression settings in the pipeline spec.

2. Pin the ink normalization. Because box counting counts occupied boxes, edge-pixel count and stroke width are inputs to the estimate, not outputs of it. The pipeline must either normalize edge maps to a target ink density (a fixed fraction of edge pixels per image area) or record the achieved density alongside every D value so cross-run comparisons can condition on it. The texture-analysis surveys (jev 0.74, 0.85) support treating this as part of the method definition.

3. Pin the epsilon range relative to stroke width. The crossover argument (weak backing, derived from the box-counting definition) implies that the fitted slope is only stable when the smallest epsilon stays above the typical stroke width. A pipeline that fixes both the epsilon ladder and the ink production step removes the dominant free parameter.

Together these pins are the core reason a taste-measurement pipeline must control ink density: without them, measured D tracks the renderer, not the design being judged.

## Sources considered

| source | url | weight | used |
| --- | --- | --- | --- |
| An Edgy Image Statistic: Semi-Automated Edge Extraction and Fractal Box Counting (Journal of Vision) | https://jov.arvojournals.org/article.aspx?articleid=2433877 | 0.91 | yes |
| An effective method to compute the box-counting dimension (Results in Engineering) | https://www.sciencedirect.com/science/article/pii/S2590123020300128 | 0.86 | yes |
| Fractal Dimension Estimation for Color Texture Images (Springer) | https://link.springer.com/article/10.1007/s10851-019-00912-0 | 0.85 | yes |
| Fractal Dimension of Fracture Network: A Review and New Perspectives (Springer) | https://link.springer.com/article/10.1007/s11004-025-10249-7 | 0.75 | yes |
| Fractal Dimension Based Texture Analysis of Digital Images (Procedia Engineering) | https://www.sciencedirect.com/science/article/pii/S1877705812022618 | 0.74 | yes |
| Fractal Dimension Estimation for Color Texture Images (ACM mirror) | https://dl.acm.org/doi/10.1007/s10851-019-00912-0 | 0.70 | yes |
| Fractal dimension (Wikipedia) | https://en.wikipedia.org/wiki/Fractal_dimension | 0.24 | yes, weak backing only |
