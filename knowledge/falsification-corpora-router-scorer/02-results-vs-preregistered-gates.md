# 02. Results vs preregistered gates

**Scope:** Results vs preregistered gates: detailed analysis grounded in yubi-OS/yubiOS refs/falsification-corpora-router-scorer-2026-10-06.md.

## Two corpora, two verdicts

The ground source (yubi-OS/yubiOS refs/falsification-corpora-router-scorer-2026-10-06.md) reports results against preregistered gates for both corpora. The router corpus matched 11 of 12 rows and failed on R11. The scorer slice failed its recall gates and passed specificity. The source treats both failures as the valuable result.

## Router corpus: 11/12 match, verdict FAIL-on-R11

| Row | Artifact | Observed | Band | Gate | Verdict |
|---|---|---|---|---|---|
| R1 | gasket-v2-L384 | D 1.558937, n 366, d_w 2.255452 | hierarchy-image | allowed | PASS |
| R2 | tri | D 1.263595 | ordered-image | allowed | PASS |
| R3 to R7 | shuffle x5 | D 1.0302 to 1.0456, n_traced 19 | ordered-image | allowed | PASS |
| R8 | pumpkin_ring | D 0.977190 | sparse-image | allowed | PASS |
| R9 | pumpkin_field | D 1.038390 | ordered-image | allowed | PASS |
| R10 | gasket-astig-0.20 | astig est 0.2139; spherical -0.3978 out of envelope | n/a | blocked reroute_not_converged | PASS (amendment 2) |
| R11 | gasket-trefoil-1e-4 | D 1.5108, d_w 2.588, n 366 | hierarchy-confirmed | allowed | MISMATCH (F1) |
| R12 | gasket-trefoil-3e-4 | spherical 0.318, trefoil 2.43e-4 out of envelope | n/a | blocked reroute_not_converged | PASS |

R1's D equals the anchor 1.5589. R10 fired corrected-hierarchy but the spherical cross-mode reading exceeded its 1/3 bound, so the warp was skipped and the reroute blocked; the source calls the cross-mode contamination itself a finding. R12 matched an earlier live negative run (cr_b11bbeee22ed5425).

**R11 is the failure.** The prediction was corrected-hierarchy, then re-select, then allowed. Observed: corrected-hierarchy did NOT fire despite detect_score 9999, and the row landed in hierarchy-confirmed with reroute null. The source records this as finding F1, "not absorbed."

## Band edges and hysteresis

Band assignment with explicit edges is a thresholding problem, and the dig surfaced the hysteresis-thresholding literature that frames it. scikit-image documents hysteresis thresholding as accepting regions above a low threshold when they connect to regions above a high threshold [Hysteresis thresholding: skimage 0.26.0 documentation](https://scikit-image.org/docs/stable/auto_examples/filters/plot_hysteresis.html) (weak backing, clef weight < 0.5; clef weight: 0.3163). Springer and IEEE work describe hysteresis thresholding architectures and adaptive variants for shape detection [PDF Chapter 7 Hysteresis Thresholding - Springer](https://link.springer.com/content/pdf/10.1007/978-1-4614-1857-3_7.pdf) (weak backing, clef weight < 0.5; clef weight: 0.2998) [Adaptive Hysteresis Thresholding & Shape Detection Using Artificial ...](https://xplorestaging.ieee.org/document/11215105/) (weak backing, clef weight < 0.5; clef weight: 0.2574); a thesis applies two thresholds, minVal and maxVal [University of technology](https://ye-htet-uom.github.io/assets/thesis/ME.pdf) (weak backing, clef weight < 0.5; clef weight: 0.1778); and the Wikipedia hysteresis entry gives the general concept [Hysteresis - Wikipedia](https://en.wikipedia.org/wiki/Hysteresis) (weak backing, clef weight < 0.5; clef weight: 0.2206). The router's pair-band logic, where a second measurement (d_w) gates a band, plays a similar two-condition role, and F1 shows why the exact clause values must be known before predictions are exact.

## Scorer slice: recall FAIL, specificity PASS

- **Inputs family (I1 to I4).** The extractor found **1 to 2 of 3 to 5** canonical planted items against floors of 3/3/4/2. Recall gate **FAIL 0/4**. Decision probability about 0.01 to 0.04, which would never flip true. The source says this quantifies the refs4 extraction-recall lesson on maximally canonical phrasing: it is not a heading-only-doc artifact.
- **Composition family (C1 to C4).** C1 PASS (2/2), C2 FAIL (2/3), C3 PASS (4/4), C4 FAIL (3/5). Item-level recall **11/14 = 0.786**.
- **Distractor vocabulary (D1 to D4).** Specificity **PASS 4/4**: inputs axis 0 everywhere; composition at most 1 with p below 0.55 on all distractors. The source's summary: "The extractor does not over-credit; it under-recalls."
- **Collateral (report-only).** assumption_set credited on 4/8 planted docs with p above 0.55 (finding F3, cross-axis bleed).

## Reading recall and specificity correctly

Precision and recall are standard definitions: recall is the true positive rate, or sensitivity [Precision and recall - Wikipedia](https://en.wikipedia.org/wiki/Precision_and_recall) (weak backing, clef weight < 0.5; clef weight: 0.3544), and the distinction from specificity is spelled out in tutorial treatments [Precision, Recall, Sensitivity and Specificity - OpenGenus IQ](https://iq.opengenus.org/precision-recall-sensitivity-specificity/) (weak backing, clef weight < 0.5; clef weight: 0.1315). The scorer result is a classic high-specificity, low-recall profile. Rule-based extraction literature notes that achieving both high precision and high recall with regular expressions is hard [Improving Recall of Regular Expressions for Information Extraction](https://link.springer.com/chapter/10.1007/978-3-642-35063-4_33) (weak backing, clef weight < 0.5; clef weight: 0.2904) [PDF Improving Recall of Regular Expressions for Information Extraction](https://link.springer.com/content/pdf/10.1007/978-3-642-35063-4_33.pdf) (weak backing, clef weight < 0.5; clef weight: 0.1328). The dictionary sense of precision [PRECISION Definition & Meaning - Merriam-Webster](https://www.merriam-webster.com/dictionary/precision) (weak backing, clef weight < 0.5; clef weight: 0.0403) adds nothing technical.

## Why the failures count as success

The source logged no post-hoc gate movement. The router miss and the scorer recall failure both stand as recorded FAILs with findings attached. A falsification corpus that only produced passes would not have shown that the /bands surface hides operative clauses, or that the extractor under-recalls even on canonical phrasing.

## Evidence quality note

All 10 dig results for this subtopic are below 0.5 (highest 0.3544, precision and recall). They explain vocabulary; every number comes from the ground source.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | GitHub - MilkThink-Lab/RouterEval: A Comprehensive Benchmark for ... | https://github.com/MilkThink-Lab/RouterEval | 0.2640 | weak (< 0.5) |
| 2 | Glossary of computer science - Wikipedia | https://en.wikipedia.org/wiki/Glossary_of_computer_science | 0.0420 | weak (< 0.5) |
| 3 | RouterBench: A Benchmark for Multi-LLM Routing System | https://arxiv.org/html/2403.12031v1 | 0.4362 | weak (< 0.5) |
| 4 | Benchmark V1 Methodology | https://imagebench.ai/methodology-v1 | 0.2894 | weak (< 0.5) |
| 5 | RouterEval: A Comprehensive Benchmark for Routing LLMs to Explore Model ... | https://aclanthology.org/2025.findings-emnlp.208/ | 0.5268 | authoritative (>= 0.5) |
| 6 | 7 Proven Strategies for LLM Regression Testing Using Golden Datasets vs ... | https://www.techment.com/blogs/llm-regression-testing/ | 0.2598 | weak (< 0.5) |
| 7 | Building a "Golden Dataset" for AI Evaluation: A Step-by-Step Guide | https://www.getmaxim.ai/articles/building-a-golden-dataset-for-ai-evaluation-a-step-by-step-guide/ | 0.1620 | weak (< 0.5) |
| 8 | Setting Up Golden Datasets for LLM Regression Testing | https://chuksforge.com/blog/setting-up-golden-datasets-llm-regression-testing | 0.1597 | weak (< 0.5) |
| 9 | “Golden” Official Lyric Video / KPop Demon Hunters / Sony Animation | https://www.youtube.com/watch?v=yebNIHKAC4A | 0.0430 | weak (< 0.5) |
| 10 | List of datasets for machine learning research | https://handwiki.org/wiki/List_of_datasets_for_machine_learning_research | 0.1128 | weak (< 0.5) |
