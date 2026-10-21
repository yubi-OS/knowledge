# Lane D record: falsification corpora first slices (router end-to-end + scorer extractor gold set)

Knowledge corpus minted in the 22-corpus `refs/` mint wave (Lane 2).

- **Corpus slug:** `falsification-corpora-router-scorer`
- **Ground-source document:** `yubi-OS/yubiOS refs/falsification-corpora-router-scorer-2026-10-06.md`
- **Local source copy:** `session/refs_wave22/sources/falsification-corpora-router-scorer.md`

## Documents

| NN | File | One-line scope | Clef outline score |
|---|---|---|---|
| 01 | [01-what-was-built.md](01-what-was-built.md) | What was built: externally dug (searXNG + clef) | 1.8371 |
| 02 | [02-results-vs-preregistered-gates.md](02-results-vs-preregistered-gates.md) | Results vs preregistered gates: externally dug (searXNG + clef) | 1.8283 |
| 03 | [03-amendments-logged.md](03-amendments-logged.md) | Amendments logged: internal-record explication of the ground source | 0.6925 |
| 04 | [04-findings-for-the-full-build.md](04-findings-for-the-full-build.md) | Findings (for the full build): internal-record explication of the ground source | 1.6298 |
| 05 | [05-honest-limitations.md](05-honest-limitations.md) | Honest limitations: internal-record explication of the ground source | 1.3876 |
| 06 | [06-what-the-full-build-needs.md](06-what-the-full-build-needs.md) | What the full build needs: internal-record explication of the ground source | 1.1369 |

Outline scores come from `research-db/outline.json` (`validation.answers.t01..t06.score`), the clef `score` metric over 3 levels lowest-first (padding / marginal / load-bearing). No subtopic was dropped.

## Research summary

- **20 results collected** (2 searXNG seed queries for docs 01 and 02, 10 kept results each).
- **Quality weighting (clef noul):** high >= 0.5: **1**; low < 0.5: **19** (from `meta.stats`).
- **5 jev requests** to `/api/decide`, **0 redos**, **0 skips**.
- Docs 01 and 02 cite dig results inline with their exact clef weight; sources below 0.5 are labelled weak backing. Docs 03 to 06 are internal-record subtopics explicated directly from the ground source with no external web dig.

## Dig highlights (top 3 by clef weight)

- **Doc 01:** [Precision and recall - Wikipedia](https://en.wikipedia.org/wiki/Precision_and_recall) (0.3544, weak); [Hysteresis thresholding: skimage 0.26.0 documentation](https://scikit-image.org/docs/stable/auto_examples/filters/plot_hysteresis.html) (0.3163, weak); [PDF Chapter 7 Hysteresis Thresholding - Springer](https://link.springer.com/content/pdf/10.1007/978-1-4614-1857-3_7.pdf) (0.2998, weak)
- **Doc 02:** [RouterEval: A Comprehensive Benchmark for Routing LLMs to Explore Model ...](https://aclanthology.org/2025.findings-emnlp.208/) (0.5268); [RouterBench: A Benchmark for Multi-LLM Routing System](https://arxiv.org/html/2403.12031v1) (0.4362, weak); [Benchmark V1 Methodology](https://imagebench.ai/methodology-v1) (0.2894, weak)

## How to read this corpus

1. Start with docs 01 and 02: they frame the subtopic and pair every ground-source claim with the external dig, citing each result inline with its exact clef weight. Anything below 0.5 is explicitly labelled weak backing and is used for context only, never as authority.
2. Docs 03 to 06 explicate the ground source section by section (equations, parameters, gates, and empirical records), with no external web dig. Treat `yubi-OS/yubiOS refs/falsification-corpora-router-scorer-2026-10-06.md` as the authority for every number in them.
3. Each 01/02 doc ends with a `Sources Considered` table listing all 10 dig results and their weights, so the evidence base is auditable without re-running the dig.
4. Writing conventions: numbers as digits, no em dashes, headings for wayfinding, and honest gaps stated rather than padded.

## Preflight

Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200
