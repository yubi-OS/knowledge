# Image Normalization for Measurement

Deterministic image pre-processing is the difference between a measurement pipeline that reproduces and one that drifts. This doc defines what a standardized pipeline must pin: the resize policy, the grayscale conversion formula, the contrast normalization rule, and the binarization threshold decision. Each stage is a choice point where two implementations of the "same" preprocessing silently produce different numbers, so every stage must name its exact operation, parameter, and order of application.

## Resize policy

Pin four things: target dimensions, the interpolation filter, the filter application order relative to other stages, and the coordinate convention.

The filter choice is the main lever. Common resampling filters are nearest neighbor, bilinear, bicubic, Lanczos, and area/box (pixel averaging); Lanczos is widely used as a high-quality filter that produces sharp, detailed results, especially for photographs and offline processing (source: https://snap-tools.net/blog/image-resizing-algorithms, redo dig, unweighted). Nearest neighbor is fast but produces blocky results; bilinear and bicubic interpolate over successively larger neighborhoods (background; also described at https://upliftorch.com/tools/image-resize/en/blog/image-interpolation.html, redo dig, unweighted). For measurement, the practical rule: nearest neighbor preserves original pixel values (good for label masks), while bilinear/area averaging preserves intensities but blurs them (good for grayscale measurement images). Pin one per image class.

Interpolation happens any time an image is remapped from one pixel grid to another (source: https://www.cambridgeincolour.com/tutorials/image-interpolation.htm, redo dig, unweighted), which is exactly why it belongs in the standard: resizing is a remap, and a remap changes measured values. Pin the order: resize before or after grayscale conversion, and never silently. A pipeline that resizes RGB then converts to grayscale is not interchangeable with one that converts then resizes, because luma weighting and spatial averaging do not commute.

## Grayscale conversion

Pin the luma coefficient set. RGB to grayscale is not a single formula; it is a family of weightings.

The classic BT.601 weights emphasize the green channel heavily: 0.299 R, 0.587 G, 0.114 B (source: https://en.wikipedia.org/wiki/Rec._601, weak backing, jev 0.18). BT.709 uses 0.2126 R, 0.7152 G, 0.0722 B (source: https://www.ecech.com/t/grayscale-conversion-with-luminance-weighting/, weak backing, jev 0.21). GIMP's decision to use Rec. 709 over Rec. 601 for luma shows this is a live, deliberate choice, not a settled default (source: https://salivity.github.io/gimp/article/why-gimp-uses-rec-709-over-rec-601-for-luma, weak backing, jev 0.34). A pipeline that says "convert to grayscale" without naming the coefficients is underspecified: two libraries, or two versions of one library, can pick different weightings and shift every downstream intensity-derived measurement.

The deeper issue is gamma. The coefficients above are defined for linear-light values; applying them to gamma-encoded sRGB values produces a luma rather than a physically meaningful luminance. Gamma correction itself is a power-law remap where exponents above 1 darken shadows and exponents below 1 lighten dark regions (source: https://en.wikipedia.org/wiki/Gamma_correction, redo dig, unweighted). Pin whether the pipeline linearizes before weighting (and with what decode, e.g. sRGB EOTF) or accepts luma directly, and pin the exponent convention: libraries disagree on whether the parameter is the exponent or its inverse (source: https://stackoverflow.com/questions/16521003/gamma-correction-formula-gamma-or-1-gamma, redo dig, unweighted). A gamma value above 1 weights output toward darker values; below 1 toward lighter ones (source: https://www.mathworks.com/help/images/gamma-correction.html, redo dig, unweighted).

## Contrast normalization

Pin the normalization rule as a formula plus its statistics source. Normalization maps pixel values to a defined range, classically min-max to [0, 1] or [0, 255] (source: https://en.wikipedia.org/wiki/Normalization_(image_processing), weak backing, jev 0.29). The Bio-image Analysis Notebooks treat normalization as a basic image-analysis operation applied before measurement (source: https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/12_image_analysis_basics/normalization.html, weak backing, jev 0.43).

The reproducibility trap is not the formula, it is the scope of the statistics. Min-max normalization can compute min and max per image, per batch, per channel, or per dataset. Those four choices give four different outputs for the same input pixel. A standard must state: per-image or per-dataset, per-channel or joint, and whether outlier clipping (e.g. percentile clipping) is applied before computing min and max. Also pin the arithmetic type (uint8 rounding vs float32) since intermediate rounding is lossy and order-dependent.

## Binarization thresholds

Pin the threshold decision rule: fixed threshold or data-derived adaptive threshold, and if adaptive, the exact algorithm.

Otsu's method is the canonical adaptive choice: it thresholds by minimizing intra-class variance, and is available in scikit-image alongside global and local threshold families, including local mean-based filters for uneven illumination (source: https://scikit-image.org/docs/stable/auto_examples/applications/plot_thresholding_guide.html, jev 0.69). The algorithm is well-established in the binarization literature (source: https://www.researchgate.net/publication/277076039_Image_Binarization_using_Otsu_Thresholding_Algorithm, jev 0.63). Even with Otsu, pin the implementation and version: thresholding libraries offer multiple named variants (global Otsu, local thresholding, multi-Otsu), and a "thresholding" step that does not name the variant and the library version is not reproducible across environments.

If the pipeline uses a fixed threshold instead, pin the exact value, the value range it applies to (0 to 255 vs 0 to 1), and whether it applies before or after normalization. A fixed threshold applied after min-max normalization to [0, 1] is numerically a different rule than the same threshold applied to raw 8-bit values.

## Reproducibility practice

A standard is complete when a second team can reproduce the numbers. That requires pinning, in one place: (1) stage order (resize, grayscale, normalize, binarize, or a documented alternative), (2) every parameter including interpolation filter, luma coefficients, linearization decision, normalization scope, and threshold rule, (3) the software stack: library names and versions for resampling and thresholding, since defaults differ across libraries, and (4) golden fixtures: one input image with the exact expected output bytes after each stage, so a change in any pinned choice is caught by a byte-level diff. Any pipeline change to these pins is a major version bump, because it invalidates every measurement taken under the previous configuration.

## Sources considered

| source | url | weight | used |
|---|---|---|---|
| Thresholding, skimage 0.26.0 docs | https://scikit-image.org/docs/stable/auto_examples/applications/plot_thresholding_guide.html | 0.69 | yes |
| Image Binarization using Otsu Thresholding Algorithm | https://www.researchgate.net/publication/277076039_Image_Binarization_using_Otsu_Thresholding_Algorithm | 0.63 | yes |
| Normalization, Bio-image Analysis Notebooks | https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/12_image_analysis_basics/normalization.html | 0.43 | yes (weak) |
| Why GIMP Uses Rec. 709 Over Rec. 601 for Luma | https://salivity.github.io/gimp/article/why-gimp-uses-rec-709-over-rec-601-for-luma | 0.34 | yes (weak) |
| Normalization (image processing), Wikipedia | https://en.wikipedia.org/wiki/Normalization_(image_processing) | 0.29 | yes (weak) |
| Greyscale Conversion With Luminance Weighting | https://www.ecech.com/t/grayscale-conversion-with-luminance-weighting/ | 0.21 | yes (weak) |
| Rec. 601, Wikipedia | https://en.wikipedia.org/wiki/Rec._601 | 0.18 | yes (weak) |
| Grayscale Conversion: Average, BT.601, BT.709, and Luminance | https://www.toolnestai.net/blog/grayscale-converter | 0.17 | no |
| Image Scaling Algorithms: Bilinear, Bicubic | https://upliftorch.com/tools/image-resize/en/blog/image-interpolation.html | redo dig | yes (unweighted) |
| Understanding Digital Image Interpolation | https://www.cambridgeincolour.com/tutorials/image-interpolation.htm | redo dig | yes (unweighted) |
| Image Resizing Algorithms: Nearest vs Bilinear vs Lanczos | https://snap-tools.net/blog/image-resizing-algorithms | redo dig | yes (unweighted) |
| Gamma correction, Wikipedia | https://en.wikipedia.org/wiki/Gamma_correction | redo dig | yes (unweighted) |
| Gamma correction formula, Stack Overflow | https://stackoverflow.com/questions/16521003/gamma-correction-formula-gamma-or-1-gamma | redo dig | yes (unweighted) |
| Gamma Correction, MathWorks | https://www.mathworks.com/help/images/gamma-correction.html | redo dig | yes (unweighted) |
