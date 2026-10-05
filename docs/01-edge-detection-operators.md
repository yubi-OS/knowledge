# Deterministic Edge and Contour Operators for Binary Edge-Map Production

This doc covers the operator choices available when a pipeline must produce a binary edge map deterministically: the gradient-based first-derivative operators (Sobel, Prewitt), the multi-stage Canny detector, the second-derivative Marr-Hildreth (Laplacian of Gaussian) detector, and morphological operators. For each, it records the parameter surface a standardized pipeline must pin, and what each operator does to measured structure in the resulting edge map. All claims are grounded in the retrieved dig corpus with inline jev weights; claims below the 0.5 authority line are labeled weak backing.

## Operator families

Three families appear in the retrieved corpus. Gradient-based first-derivative operators compute image intensity gradients and are the classic approach to edge detection; the Sobel and Prewitt operators are the canonical members, and a dedicated comparison of the two finds them close in behavior while differing in measurable detection performance (source: https://pdfs.semanticscholar.org/cb5f/3f22467e2f535f355fe55656e70374610fde.pdf, jev 0.68). Survey literature groups all such techniques together and treats operator selection as a comparative decision, not a settled default (source: https://arxiv.org/pdf/1311.4963, jev 0.75).

The Canny detector is a multi-stage pipeline: Gaussian smoothing, gradient magnitude computation, non-maximum suppression to thin the response, and hysteresis thresholding with two thresholds to join strong and weak edge pixels into contiguous curves (source: https://scikit-image.org/docs/stable/auto_examples/edges/plot_canny.html, jev 0.77; source: https://docs.opencv.org/5.0/tutorials/imgproc/imgtrans/canny_detector/canny_detector.html, jev 0.76). OpenCV documents the same stages in its tutorial, making the two independent library references agree on the stage structure (source: https://docs.opencv.org/5.0/tutorials/imgproc/imgtrans/canny_detector/canny_detector.html, jev 0.76).

Marr-Hildreth is the second-derivative alternative: it smooths with a Gaussian, takes the Laplacian, and marks zero crossings as edges. Historical survey material records that Marr-Hildreth was popular before Canny and sits in the same gradient-derivative lineage (weak-backing framing via source: https://www.ijera.com/papers/Vol4_issue3/Version%201/EX4301908912.pdf, jev 0.51). Because its zero-crossing output depends on a continuous-valued Laplacian of Gaussian, it is the least binary-native of the three families.

Morphological edge operators (for example a morphological gradient built from dilation minus erosion) are within the requested scope, but no retrieved source in this dig covers them. No factual claim about their parameter surface or effect on the edge map is asserted here; the gap is recorded so a later dig can fill it.

## Parameter surfaces to pin

For Canny, the standardized pipeline must pin two parameter classes. First, the Gaussian smoothing width: skimage exposes this directly as a sigma parameter on its Canny implementation, which applies a derivative-of-Gaussian filter rather than separate smoothing and differentiation stages (source: https://scikit-image.org/docs/stable/auto_examples/edges/plot_canny.html, jev 0.77). Second, the threshold pair. OpenCV recommends keeping the two hysteresis thresholds within a ratio of 2:1 to 3:1, meaning the upper threshold is 2 to 3 times the lower (source: https://docs.opencv.org/5.0/tutorials/imgproc/imgtrans/canny_detector/canny_detector.html, jev 0.76). Hysteresis thresholding itself is the mechanism that converts the continuous gradient magnitude into the binary map: pixels above the high threshold are strong edges, pixels between the two thresholds are kept only if connected to strong edges (source: https://scikit-image.org/docs/stable/auto_examples/edges/plot_canny.html, jev 0.77).

For Sobel and Prewitt, the pinned surface is the kernel (fixed 3x3 first-derivative masks) and the gradient magnitude or direction combination rule applied afterwards. The Sobel-versus-Prewitt comparison shows this small surface still produces different detection results, so the operator choice itself is a pinned parameter, not just the thresholds (source: https://pdfs.semanticscholar.org/cb5f/3f22467e2f535f355fe55656e70374610fde.pdf, jev 0.68).

For Marr-Hildreth, the Gaussian sigma of the LoG kernel is the dominant parameter and, like Canny's sigma, controls the spatial scale of detected structure (source: https://www.ijera.com/papers/Vol4_issue3/Version%201/EX4301908912.pdf, jev 0.51).

## What each operator does to the edge map

Raw gradient operators (Sobel, Prewitt) return a thick, continuous-valued gradient magnitude; producing a binary map from them requires an additional thresholding step the pipeline must pin. Canny's non-maximum suppression thins those thick bands to 1-pixel-wide ridges before thresholding, and hysteresis connects them, so the resulting edge map is thin and spatially coherent rather than a thresholded magnitude blob (source: https://docs.opencv.org/5.0/tutorials/imgproc/imgtrans/canny_detector/canny_detector.html, jev 0.76). This is why Canny is the family with the most parameters (sigma plus two thresholds) but also the most standardized output structure (source: https://scikit-image.org/docs/stable/auto_examples/edges/plot_canny.html, jev 0.77).

Comparative studies find the choice among operators shifts edge-map quality measurably, and that no single operator wins across all image conditions, which is the direct justification for pinning the operator per pipeline instead of leaving it default (source: https://arxiv.org/pdf/1311.4963, jev 0.75).

## Determinism notes

All three operators are deterministic given pinned inputs: fixed sigma, fixed thresholds, and fixed kernel definitions fully determine the output for a fixed input image, since the stages are convolutions, sorting-free local operations, and fixed-order hysteresis (source: https://scikit-image.org/docs/stable/auto_examples/edges/plot_canny.html, jev 0.77; source: https://docs.opencv.org/5.0/tutorials/imgproc/imgtrans/canny_detector/canny_detector.html, jev 0.76). GPU-vendor implementations of Canny exist (NVIDIA VPI exposes it as a library primitive), and weak backing supports their availability, but their floating-point scheduling may differ from CPU libraries, which matters if the standard requires bit-exact cross-platform reproduction (weak backing: source: https://docs.nvidia.com/vpi/4.0/algo_canny_edge_detector.html, jev 0.48).

## Weak-backing historical context

Wikipedia's Canny article attributes the detector to John Canny and lists its design goals as good detection, good localization, and a single response per edge; the specific historical attribution and the three-goal framing are weakly backed in this corpus (source: https://en.wikipedia.org/wiki/Canny_edge_detector, jev 0.27, weak backing). Wikipedia's general edge-detection overview places Canny, Sobel, and Marr-Hildreth in one taxonomy of common operators; that taxonomy placement is weakly backed (source: https://en.wikipedia.org/wiki/Edge_detection, jev 0.22, weak backing).

## Sources considered

| source | url | weight | used |
| --- | --- | --- | --- |
| Canny Edge Detector, OpenCV Tutorials | https://docs.opencv.org/5.0/tutorials/imgproc/imgtrans/canny_detector/canny_detector.html | 0.76 | yes |
| Canny edge detector, skimage docs | https://scikit-image.org/docs/stable/auto_examples/edges/plot_canny.html | 0.77 | yes |
| A Comparison of Sobel and Prewitt Edge Detection Operators | https://pdfs.semanticscholar.org/cb5f/3f22467e2f535f355fe55656e70374610fde.pdf | 0.68 | yes |
| Study and Comparison of Various Techniques of Image Edge Detection | https://www.ijera.com/papers/Vol4_issue3/Version%201/EX4301908912.pdf | 0.51 | yes |
| Comparative Study of Image Edge Detection Algorithms | https://arxiv.org/pdf/1311.4963 | 0.75 | yes |
| Canny edge detector, Wikipedia | https://en.wikipedia.org/wiki/Canny_edge_detector | 0.27 | yes, weak |
| VPI Canny edge detector, NVIDIA | https://docs.nvidia.com/vpi/4.0/algo_canny_edge_detector.html | 0.48 | yes, weak |
| Edge detection, Wikipedia | https://en.wikipedia.org/wiki/Edge_detection | 0.22 | yes, weak |
