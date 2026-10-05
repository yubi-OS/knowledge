# 01. The Pfister research catalog as ingest substrate

**Scope.** What the wayfinder research ingest actually collected from Tomas Pfister's arXiv record, how it mapped onto `google-research` repositories, and why a catalog of an author's record is a substrate and not a set of discoveries.

## Who the catalog is about

Tomas Pfister is Head of AI Research at Google Cloud, a role his Google Research profile, Google Scholar page, and personal site all confirm [1][2][3]. He joined Google from Apple, where he cofounded Apple's central AI research group and published Apple's first research paper, winning a Best Paper Award at CVPR 2017 [1][3]. The profile lists key achievements in synthetic image realism and automated detection of facial micro-expressions, which explains the later arc of his group's work toward semi-supervised and interpretable applied ML [1].

## The repositories the record maps to

The ingest uploaded a catalog of Pfister's arXiv record, 135 author-record hits, and mapped it onto `google-research` repositories. Project provenance: the catalog and its mapping are recorded in the yubi-OS refs corpus document `pfister-keystone-methods-wayfinder-2026-09-17.md` (internal primary source, unweighted). The mapped repos include:

- `tft`, the Temporal Fusion Transformer, an attention-based architecture that combines high-performance multi-horizon forecasting with interpretable insights into temporal dynamics [4][5].
- `timesfm`, a decoder-only pretrained time-series foundation model, published at ICML 2024 [6].
- `fixmatch`, the semi-supervised method that combines consistency regularization and pseudo-labeling and reaches 94.93 percent accuracy on CIFAR-10 with 250 labels [7][8].
- `uda`, `tabnet`, `composed_image_retrieval`, `syn-rep-learn`, and `business_metric_aware_forecasting` (project provenance, internal primary source).
- The anomaly-detection work: CutPaste and SPADE, covered in doc 03.
- The LLM-era papers, Distilling Step-by-Step and Chain of Agents (project provenance, internal primary source).

An author-record hit count is not a discovery count. 135 hits means 135 catalog entries attributable to the author record, several of which are the same result appearing as paper, repo, and publication page [4][6][7]. The ingest treats the catalog as a map of method families, and the downstream transplant screen (doc 04) consumes method families, not paper titles.

## Why an author catalog is the right unit of ingest

The three method families that survived the transplant screen are exactly the families the catalog organizes: anomaly detection with synthetic positive controls (CutPaste, SPADE) [9][10], decision-aware forecasting evaluation (Temporal Fusion Transformer's interpretability and the forecasting practice literature) [4][11], and semi-supervised label economy (FixMatch's pseudo-label and consistency machinery) [7][8]. A catalog keyed on the author's record groups these families together because they share a methodological stance, which a topic-keyed search would not have done.

## Sources

1. https://research.google/people/105803/ (noul 0.9192)
2. https://scholar.google.com/citations?user=ahSpJOAAAAAJ&hl=en (noul 0.8926)
3. https://tomas.pfister.fi/ (noul 0.6511)
4. https://research.google/pubs/temporal-fusion-transformers-for-interpretable-multi-horizon-time-series-forecasting/ (noul 0.8962)
5. https://arxiv.org/abs/1912.09363 (noul 0.8096)
6. https://github.com/google-research/timesfm/ (noul 0.9111)
7. https://research.google/pubs/fixmatch-simplifying-semi-supervised-learning-with-consistency-and-confidence/ (noul 0.8378)
8. https://arxiv.org/abs/2001.07685 (noul 0.6892)
9. https://ieeexplore.ieee.org/document/9578875 (noul 0.9411)
10. https://arxiv.org/abs/2104.04015 (noul 0.6054)
11. https://www.sciencedirect.com/science/article/pii/S0169207021001758 (noul 0.9187)
