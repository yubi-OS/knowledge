# 01. What was built

**Scope:** What was built: detailed analysis grounded in yubi-OS/yubiOS refs/falsification-corpora-router-scorer-2026-10-06.md.

## Context

The ground source (yubi-OS/yubiOS refs/falsification-corpora-router-scorer-2026-10-06.md) is the Lane D record of a parallel build launched on refs/falsification-harness-coverage-2026-10-06.md (merged via PR #294). It reports the first slices of two falsification corpora: a router corpus exercising `POST /api/jev/route` end-to-end, and a scorer gold set testing the extractor behind `POST /api/jev/corpus/scorer/score`. The source states plainly that nothing was pushed to any repo; all artifacts live in `session/subagent/lane-d-corpora/`.

## Build item 1: gold renders from the source of record

The repo tarball (main) was fetched and `gen_v2.py` re-run locally. Before any rendering, the generator's selftest ran **30/30 PASS** against `anchors.json`. Only then were renders produced: **11 renders at 512 by 512**, saved as PGMs in `renders/` with sha256 hashes pinned.

The 11 renders:

- `gasket-v2-L384`
- `tri`
- `shuffle` at 5 pinned seeds
- `pumpkin_ring`, `pumpkin_field`
- three warped gaskets produced by the pinned arrangement-arm forward map (`ASTIG_KAPPA=0.5`, `TREFOIL_ZOOM_K=460`): `astig-0.20`, `trefoil-1e-4`, `trefoil-3e-4`

Transport used `artifact.image.{gray_b64,width,height}`, with the lens selected via `artifact.any.lens_family="gasket"` (amendment 1).

The design choice worth noting is the ordering: selftest first, render second. A gold corpus is only gold if its generator reproduces known anchors before producing new data. This is the same idea behind "golden datasets" in model regression testing, where practitioners curate a fixed, trusted reference set and evaluate against it repeatedly [7 Proven Strategies for LLM Regression Testing Using Golden Datasets vs ...](https://www.techment.com/blogs/llm-regression-testing/) (weak backing, clef weight < 0.5; clef weight: 0.2598).

## Build item 2: preregistrations written before measurement

Two preregistration documents were written before any live call:

- **`router-preregistration.md`**: for each family, the expected band and expected gate. Real policy-v12 band edges were fetched live. Tolerances: D plus or minus 0.010; band EXACT; gate EXACT; component counts EXACT; gasket spectral dimension d_w pinned at 2.2555 plus or minus 0.08 from a prior live run (cr_b15752003ba1a4ef).
- **`scorer-preregistration.md`**: a 12-doc slice design, a recall floor of 0.75, distractor specificity, and full-build sizing of about 64 docs.

An `amendments-log.md` was opened empty, then given 3 pre-run entries: the lens family spelling, an R10 expected-gate amendment, and a scorer schema probe authorization.

## Build item 3: router corpus executed

All **12 rows** ran through live `POST /api/jev/route` at **policy v12**. Results are in `router-corpus-results.json`, with a run id recorded per row (from cr_3d7e7963c81f0118 to cr_2db2613357ceeeb0). That brings the router's behavior into the same frame as public router benchmarks. RouterEval, an EMNLP 2025 Findings paper, argues that the lack of comprehensive open-source benchmarks has hindered router development [RouterEval: A Comprehensive Benchmark for Routing LLMs to Explore Model ...](https://aclanthology.org/2025.findings-emnlp.208/) (clef weight: 0.5268), and its GitHub repo describes a benchmark spanning 12 LLM evaluations [GitHub - MilkThink-Lab/RouterEval: A Comprehensive Benchmark for ...](https://github.com/MilkThink-Lab/RouterEval) (weak backing, clef weight < 0.5; clef weight: 0.2640). RouterBench proposes a theoretical framework and comparative analysis for multi-LLM routing [RouterBench: A Benchmark for Multi-LLM Routing System](https://arxiv.org/html/2403.12031v1) (weak backing, clef weight < 0.5; clef weight: 0.4362). Those benchmarks score which model a router picks; the Lane D router corpus scores whether a measurement-driven router lands each artifact in the preregistered band and gate.

## Build item 4: scorer gold slice executed

**12 synthetic docs plus 1 neutral schema probe** went through live `POST /api/jev/corpus/scorer/score` (scorer-v2.2). Results are in `scorer-slice-results.json`. Total cost was about **$0.0026**, under the $0.01 cap.

Golden-set guidance from industry argues for structuring sets by domain and sizing deliberately [Setting Up Golden Datasets for LLM Regression Testing](https://chuksforge.com/blog/setting-up-golden-datasets-llm-regression-testing) (weak backing, clef weight < 0.5; clef weight: 0.1597) and for curating sets that mirror production [Building a "Golden Dataset" for AI Evaluation: A Step-by-Step Guide](https://www.getmaxim.ai/articles/building-a-golden-dataset-for-ai-evaluation-a-step-by-step-guide/) (weak backing, clef weight < 0.5; clef weight: 0.1620). The Lane D slice takes a stricter route: synthetic docs with planted, countable items, so ground truth is known by construction rather than by annotation. ImageBench's methodology similarly emphasizes reproducibility through fixed prompt definitions and deterministic routing policy [Benchmark V1 Methodology](https://imagebench.ai/methodology-v1) (weak backing, clef weight < 0.5; clef weight: 0.2894).

## The artifact list

Per the source: the two preregistrations and the amendments log; the two results JSON files; `renders/*.pgm` (11 source-of-record renders) and `route_requests.jsonl`; and `yubiOS-main/`, the extracted repo sources used (gen_v2.py, edge_standard.py, jev-router.js, lens_standard.py, anchors.json, the falsification SKILL.md, and the refs doc).

## Evidence quality note

1 of 10 dig results clears 0.5 (RouterEval at ACL Anthology). The others, including a computer-science glossary [Glossary of computer science - Wikipedia](https://en.wikipedia.org/wiki/Glossary_of_computer_science) (weak backing, clef weight < 0.5; clef weight: 0.0420), a dataset list [List of datasets for machine learning research](https://handwiki.org/wiki/List_of_datasets_for_machine_learning_research) (weak backing, clef weight < 0.5; clef weight: 0.1128), and a music video [“Golden” Official Lyric Video | KPop Demon Hunters | Sony Animation](https://www.youtube.com/watch?v=yebNIHKAC4A) (weak backing, clef weight < 0.5; clef weight: 0.0430), are weak or off-topic. Every number above comes from the ground source.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Precision and recall - Wikipedia | https://en.wikipedia.org/wiki/Precision_and_recall | 0.3544 | weak (< 0.5) |
| 2 | PDF Improving Recall of Regular Expressions for Information Extraction | https://link.springer.com/content/pdf/10.1007/978-3-642-35063-4_33.pdf | 0.1328 | weak (< 0.5) |
| 3 | Precision, Recall, Sensitivity and Specificity - OpenGenus IQ | https://iq.opengenus.org/precision-recall-sensitivity-specificity/ | 0.1315 | weak (< 0.5) |
| 4 | Improving Recall of Regular Expressions for Information Extraction | https://link.springer.com/chapter/10.1007/978-3-642-35063-4_33 | 0.2904 | weak (< 0.5) |
| 5 | PRECISION Definition & Meaning - Merriam-Webster | https://www.merriam-webster.com/dictionary/precision | 0.0403 | weak (< 0.5) |
| 6 | Hysteresis - Wikipedia | https://en.wikipedia.org/wiki/Hysteresis | 0.2206 | weak (< 0.5) |
| 7 | Hysteresis thresholding: skimage 0.26.0 documentation | https://scikit-image.org/docs/stable/auto_examples/filters/plot_hysteresis.html | 0.3163 | weak (< 0.5) |
| 8 | Adaptive Hysteresis Thresholding & Shape Detection Using Artificial ... | https://xplorestaging.ieee.org/document/11215105/ | 0.2574 | weak (< 0.5) |
| 9 | PDF Chapter 7 Hysteresis Thresholding - Springer | https://link.springer.com/content/pdf/10.1007/978-1-4614-1857-3_7.pdf | 0.2998 | weak (< 0.5) |
| 10 | University of technology | https://ye-htet-uom.github.io/assets/thesis/ME.pdf | 0.1778 | weak (< 0.5) |
