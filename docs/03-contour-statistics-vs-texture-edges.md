# Contour Statistics vs Texture Edge Maps: Why the Same Photograph Measures Two Different Fractal Dimensions

This doc isolates the exact failure mode that motivated the edge-map-standardization corpus: fractal dimension (D) measured on isolated contour statistics, the tradition behind the empirical-aesthetics stimuli literature, versus D measured on dense edge maps extracted from full photographs. The two pipelines process the same underlying image, yet they estimate D over fundamentally different point sets, so they produce different numbers that get compared as if they were the same quantity. This doc states what each pipeline actually measures, why the numbers diverge, and what a standardization effort has to pin down to make results comparable.

## The contour tradition: D on curated outlines

The empirical-aesthetics line of work measures fractal dimension of deliberately isolated outlines. The canonical stimulus set is landscape silhouette outlines: Hagerhall et al. established the relationship between landscape preference and the fractal dimension of silhouette outlines specifically, not of the full photographic texture (source: https://www.sciencedirect.com/science/article/pii/S0272494404000076, jev 0.81). Fractal dimension is also used as a standard measure of the statistical properties of images generally, including art, where the object of measurement is again the drawn or extracted contour (source: https://pubs.aip.org/aip/cha/article/34/6/063126/3297448/Fractal-contours-Order-chaos-and-art, jev 0.60).

The decisive property of this tradition is sparsity. A silhouette outline is a curated 1-dimensional set: one boundary, chosen by the experimenter, with everything else in the image discarded. Box-counting, the standard estimator for such images, is explicitly described as a single measure applied to fractal-like images (source: https://www.academia.edu/40173879/Fractal_Dimension_for_the_Analysis_of_Vascular, jev 0.55). The D that comes back is the dimension of that one curve under that one estimator. It is not a property of the photograph. It is a property of the photograph-as-reduced-to-one-boundary.

## The texture regime: D on dense edge maps

The contrasting pipeline extracts edges everywhere. The fractal-dimension estimation literature for images is built around segmented and thresholded regions rather than single curated outlines: biomedical image FD estimation covers a family of methods applied to segmented image content (source: https://cdn.intechopen.com/pdfs/39360/InTech-Fractal_dimension_estimation_methods_for_biomedical_images.pdf, jev 0.82), and feature-extraction work computes FD on segmented SEM images where the segmentation itself defines the measured set (source: https://onlinelibrary.wiley.com/doi/10.1155/2023/8564161, jev 0.77).

A dense edge map of a photograph contains every texture boundary the extractor fires on: grass, bark, fabric, water. The measured set is no longer one curve but a planar cloud of edge elements whose count and arrangement depend entirely on the extraction threshold. FracLac, the standard ImageJ plugin, treats contours and filled regions as distinct input classes and recommends benchmark images of known fractal dimension and lacunarity precisely because the input class changes what the estimator measures (source: https://imagej.net/ij/plugins/fraclac/FLHelp/Images.htm, jev 0.69).

## Why one photograph yields two different D values

The divergence is mechanical, not a measurement error. Three mechanisms stack:

1. **Different measured sets.** A silhouette contour and a dense texture edge map are different subsets of the same image with different mass-length scaling. Box-counting returns the dimension of whatever set you feed it, which is why the vascular-analysis literature stresses that box-counting is a single measure, not a definition of image fractality (source: https://www.academia.edu/40173879/Fractal_Dimension_for_the_Analysis_of_Vascular, jev 0.55).

2. **Different estimator behavior per input class.** Estimation methods differ in how they handle sparse curves versus filled or dense regions, which is why the estimation-methods literature treats method choice as a first-order variable (source: https://cdn.intechopen.com/pdfs/39360/InTech-Fractal_dimension_estimation_methods_for_biomedical_images.pdf, jev 0.82) and why FracLac separates contour from filled-region workflows and validates against known-D benchmarks (source: https://imagej.net/ij/plugins/fraclac/FLHelp/Images.htm, jev 0.69).

3. **Different extraction settings.** For the dense regime, the edge-extraction stage is part of the measurement. The contour-extraction literature treats extractor choice and configuration as outcome-relevant (weak backing: source: https://www.researchgate.net/publication/387253847, jev 0.35), and dedicated extraction tooling exposes those choices as parameters (weak backing: source: https://github.com/RafaelCasamaximo/contExt, jev 0.44). A threshold sweep on the same photo produces a family of edge maps and therefore a family of D values.

The consequence: the preference-relevant number from the aesthetics tradition and the texture number from a dense map are different quantities that both get called D. Neither is wrong; they are not commensurable.

## What this implies for standardization

- **Name the input class, not just the number.** contour-D (isolated outline) and edge-map-D (dense extraction) should be distinct reported metrics. The FracLac contour-versus-filled-region distinction is the precedent (source: https://imagej.net/ij/plugins/fraclac/FLHelp/Images.htm, jev 0.69).
- **Pin the extraction stage.** Extractor, thresholds, and segmentation must be recorded alongside D, since segmented-input FD is what the applied literature actually computes (source: https://onlinelibrary.wiley.com/doi/10.1155/2023/8564161, jev 0.77).
- **Benchmark against known-D images.** Validating every pipeline against images of known fractal dimension and lacunarity is the established practice (source: https://imagej.net/ij/plugins/fraclac/FLHelp/Images.htm, jev 0.69).
- **Treat box-counting as one estimator among a family.** The estimation-methods literature is a family, not a single recipe (source: https://cdn.intechopen.com/pdfs/39360/InTech-Fractal_dimension_estimation_methods_for_biomedical_images.pdf, jev 0.82).
- **Do not transfer aesthetic conclusions across regimes.** Preference findings are tied to their stimulus construction. The individual-differences literature on aesthetic response to fractal scaling is active but thinly grounded in this dig (weak backing: source: https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2016.00350/, jev 0.04; weak backing: source: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.01439/full, jev 0.05), which is all the more reason not to mix stimulus regimes silently.

## Sources considered

| source | url | weight | used |
| --- | --- | --- | --- |
| Hagerhall et al., landscape silhouette outlines and preference | https://www.sciencedirect.com/science/article/pii/S0272494404000076 | 0.81 | yes |
| Fractal Dimension Estimation Methods for Biomedical Images | https://cdn.intechopen.com/pdfs/39360/InTech-Fractal_dimension_estimation_methods_for_biomedical_images.pdf | 0.82 | yes |
| FD Image Processing for Feature Extraction (Wiley 2023) | https://onlinelibrary.wiley.com/doi/10.1155/2023/8564161 | 0.77 | yes |
| Digital Images in FracLac (ImageJ Wiki) | https://imagej.net/ij/plugins/fraclac/FLHelp/Images.htm | 0.69 | yes |
| Fractal contours: Order, chaos, and art (Chaos, AIP 2024) | https://pubs.aip.org/aip/cha/article/34/6/063126/3297448/Fractal-contours-Order-chaos-and-art | 0.60 | yes |
| FD for the Analysis of Vascular structures | https://www.academia.edu/40173879/Fractal_Dimension_for_the_Analysis_of_Vascular | 0.55 | yes |
| A comprehensive review of contour extraction | https://www.researchgate.net/publication/387253847 | 0.35 | yes (weak backing) |
| contExt: Software for contour extraction | https://github.com/RafaelCasamaximo/contExt | 0.44 | yes (weak backing) |
| Taxonomy of Individual Variations in Aesthetic Responses | https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2016.00350/ | 0.04 | yes (weak backing) |
| Preference for Fractal-Scaling Properties Across Synthetic stimuli | https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.01439/full | 0.05 | yes (weak backing) |
