# 03. Jaccard overlap as a system coherence measurement

Scope: binarizing the differential (u,v) plane into cell grids, intersecting per-corpus occupancy, and reading Jaccard overlap as the cross-corpus coherence metric.

## The measurement

After the differential fit places all 208 items in one (u,v) plane, the pipeline asks: how much territory do the two corpora share? The measurement binarizes a 21x21 grid (441 cells) per corpus, marking each cell occupied or empty depending on whether at least one item of that corpus lands in it, then intersects the two binary maps ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

The run's numbers:

| Stat | Value |
|---|---|
| Cells occupied by yubiOS only | 25 |
| Cells occupied by self-doc only | 50 |
| Cells occupied by both | 6 |
| Empty cells | 360 |
| Jaccard overlap | 0.0741 |

The yubiOS corpus occupies 31 cells (25 plus 6), the self-doc corpus occupies 56 (50 plus 6), and 6 cells are jointly occupied. Jaccard is intersection over union: 6 divided by (31 + 56 minus 6) = 6 over 81 = 0.0741. Only about 7.4 percent of (u,v) cells are populated by both corpora ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

## Reading the number

A Jaccard of 0.074 is small but non-zero. The source doc reads it as the cross-corpus overlap signature: the two corpora have related but distinct structural patterns. Zero would mean the corpora share no coverage neighborhoods at all (the audit surfaces are entirely disjoint); a large value would mean the corpora are structurally redundant (two views of the same thing). The middle value says the audits are complementary with a thin connecting ridge ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

The 6 jointly-occupied cells are called the structural alignment anchors: (u,v) coordinates where a yubiOS skill and a self-doc item have similar primitive coverage patterns. They are the natural first targets for cross-corpus RSI, because aligning an item pair that already shares a cell is the smallest move that raises coherence ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

## Why Jaccard rather than another similarity

Jaccard similarity is set intersection over set union, defined on sets of any kind; it is the standard measure when comparing binary membership structures, and it ignores mutual emptiness (360 empty cells contribute nothing), which is what makes it the right choice here: two corpora that both leave a region empty should not count as "coherent" about it [w=0.88, https://www.ibm.com/think/topics/jaccard-similarity]. Jaccard is widely used as a set-overlap metric across information retrieval and data-mining contexts [w=0.78, https://www.sciencedirect.com/topics/computer-science/jaccard-similarity]. The formula and its properties (0 for disjoint sets, 1 for identical sets, monotone in intersection) are documented as the canonical definition [w=0.51, https://en.wikipedia.org/wiki/Jaccard_index].

Corpus-level overlap measurement has established precedent beyond set counts. Comparative document analysis for large text corpora builds cross-corpus alignment structures and reports shared-structure statistics between document collections [w=0.68, https://dl.acm.org/doi/10.1145/3018661.3018690]. Bidirectional topic matching quantifies thematic overlap between two document collections from both directions, a measurement symmetric like Jaccard [w=0.81, https://arxiv.org/html/2412.18376v1]. Latent semantic analysis supplies the general pattern the differential follows: project heterogeneous documents into one shared low-dimensional space so cross-collection comparison becomes geometric proximity [w=0.82, http://www.scholarpedia.org/article/Latent_semantic_analysis].

## Coherence as a tracked metric

Because the Jaccard value is computed from a persisted (u,v) cache, it can be re-computed after each RSI cycle without re-fitting. The source doc treats the 0.0741 value plus the 6 anchor cells as the baseline that a cross-corpus RSI cycle should move: more jointly-occupied cells, higher Jaccard, means the two audits are becoming one system rather than two parallel ones ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

## Discipline notes

The grid resolution (21x21) and the binarization rule are part of the measurement contract; changing either invalidates comparison with the recorded 0.0741. The source doc's anti-pattern list also forbids re-fitting the curve mid-run, which would silently move items between cells and change the Jaccard without any real corpus change ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).
