# IBSI as the Reference Model for Standardizing Image-Derived Features

The Image Biomarker Standardisation Initiative (IBSI) is the canonical worked example of what standardizing image-derived features across independent pipelines actually looks like. It is an independent international collaboration whose stated work runs in phases: a benchmarking phase followed by a validation phase using multi-modality datasets (source: https://theibsi.github.io/, jev 0.52). Its relevance to the edge-map / fractal-dimension pipeline is not topical (IBSI targets radiomic image biomarkers, not edge maps), but structural: IBSI solved the problem of many independent implementations of the same feature definitions drifting apart, and the mechanism it used transfers directly. Weak backing: IBSI is explicitly framed as a response to reproducibility gaps in imaging and computational analysis, with standardization as the remedy (source: https://link.springer.com/article/10.1007/s00330-023-10164-7, jev 0.33, weak backing).

## What IBSI standardizes

IBSI standardizes the processing chain upstream of the feature, not just the feature definition itself. The core artifact is a pinned, shared preprocessing chain plus standardized feature definitions, published so that any implementation can be checked against the same reference (source: https://ibsi.readthedocs.io/en/latest/, jev 0.51). The motivation is the known failure mode: different preprocessing pipelines and implementations compute nominally identical features and get different values, making results non-comparable across sites. The standardized radiomics approach published in Radiology addresses exactly this, producing agreed feature definitions and processing conventions (source: https://pubs.rsna.org/doi/10.1148/radiol.2020191145, jev 0.39, weak backing).

## How IBSI validates

The validation mechanism rests on a digital phantom used as a standardized benchmarking tool for consistent validation across implementations (source: https://aapm.onlinelibrary.wiley.com/doi/10.1002/acm2.70110, jev 0.68). The same source is available as an epdf mirror (source: https://aapm.onlinelibrary.wiley.com/doi/epdf/10.1002/acm2.70110, jev 0.64). The mechanism has three parts:

1. A fixed synthetic input (the digital phantom) that every implementation feeds through its own code.
2. Published benchmark values that each implementation's output is compared against.
3. Multi-implementation agreement as the pass criterion: implementations converge on the same values for the same input, so cross-implementation variance becomes measurable and correctable rather than invisible.

Weak backing: a second phase (IBSI 2) extends this with validation on multi-modality datasets (source: https://theibsi.github.io/ibsi2/, jev 0.46, weak backing), consistent with the phases named on the main site (source: https://theibsi.github.io/, jev 0.52).

## What an edge-map / fractal-dimension pipeline should borrow

The transfer is direct. An edge-map pipeline with fractal dimension (D) estimation faces the same risk IBSI addresses: box-counting, Higuchi, and spectral estimators, plus edge-detector parameter choices, produce D values that differ across implementations for the same image in ways nobody notices until two pipelines disagree.

Concretely, the IBSI analogue is:

1. **A fixed parameter set.** Publish the pinned preprocessing chain (image source, grayscale conversion, threshold or Canny parameters, box sizes or lag range) the way IBSI pins its processing chain, so results are reproducible from a spec alone (source: https://ibsi.readthedocs.io/en/latest/, jev 0.51).
2. **Fixture images with expected D values.** Build the analogue of the digital phantom: a small set of synthetic images (an exact Koch curve, a flat gradient, white noise) with analytically known or pre-computed D values, treated as a standardized benchmarking tool for consistent validation across implementations (source: https://aapm.onlinelibrary.wiley.com/doi/10.1002/acm2.70110, jev 0.68). Real photographs can serve the multi-modality role that IBSI 2 datasets serve (source: https://theibsi.github.io/ibsi2/, jev 0.46, weak backing).
3. **Cross-implementation parity tests.** Run the fixtures through at least 2 independent implementations of the D estimator and fail CI if outputs diverge beyond a stated tolerance, mirroring IBSI's benchmark-against-published-values, multi-implementation agreement loop (source: https://aapm.onlinelibrary.wiley.com/doi/10.1002/acm2.70110, jev 0.68).

## Caveats

The strongest source in this dig (jev 0.68) grounds the digital-phantom-as-benchmark mechanism; the claim that IBSI publishes per-feature benchmark values that implementations check against is inferred from that framing plus the readthedocs reference and carries moderate confidence (source: https://ibsi.readthedocs.io/en/latest/, jev 0.51). The Radiology and Eur Radiol sources (jev 0.39, 0.33, both weak backing) support the general reproducibility motivation only and were not used for any mechanism claims. No source in this dig was read in full; all claims rest on the indexed abstracts and descriptions returned by the dig.

## Sources considered

| source | url | weight | used |
| --- | --- | --- | --- |
| Evaluating feature extraction reproducibility across image biomarker pipelines (JACMP) | https://aapm.onlinelibrary.wiley.com/doi/10.1002/acm2.70110 | 0.68 | yes |
| Same paper, epdf mirror | https://aapm.onlinelibrary.wiley.com/doi/epdf/10.1002/acm2.70110 | 0.64 | yes (corroborating mirror) |
| IBSI official site | https://theibsi.github.io/ | 0.52 | yes |
| IBSI readthedocs | https://ibsi.readthedocs.io/en/latest/ | 0.51 | yes |
| IBSI 2 | https://theibsi.github.io/ibsi2/ | 0.46 | yes (weak backing) |
| The Image Biomarker Standardisation Initiative: Standardized... (Radiology) | https://pubs.rsna.org/doi/10.1148/radiol.2020191145 | 0.39 | yes (weak backing, motivation only) |
| Achieving imaging and computational reproducibility (Eur Radiol) | https://link.springer.com/article/10.1007/s00330-023-10164-7 | 0.33 | yes (weak backing, motivation only) |
