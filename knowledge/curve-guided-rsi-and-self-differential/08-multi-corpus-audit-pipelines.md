# 08. Reproducible multi-corpus audit pipelines

Scope: how the differential run is packaged as a one-shot pipeline, what gets persisted, the verification checklist, and the operational anti-patterns.

## The one-shot pipeline shape

The 2026-08-04 differential run lives in a single pipeline script (`session/diff-curves/differential_pipeline.py`) with all Stage 1-5 evidence persisted to a JSON artifact (`differential_fit.json`). One command loads both corpora, computes both coverage matrices, fits three curves (parent, offshoot combined, union), runs sparse-cell detection on all three planes, computes the overlay, and writes the JSON cache plus the markdown record ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

The load step is worth noting for reproducibility: skills come from an API and memory files from the filesystem, so the pipeline's inputs are two live sources with different volatility. The corpus state is whatever those sources contain at run time, which is why the run date and the corpus sizes (77 skills, 131 self-doc items) are recorded in the output ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

Reproducibility research supports this packaging: replayable data pipelines that record their inputs and intermediate results as inspectable artifacts are the established pattern for auditable multi-stage analysis, and the differential's JSON cache follows it [w=0.89, https://arxiv.org/html/2404.13682v1]. Pipeline best-practice guidance converges on the same shape: modular stages, persisted intermediate outputs, and artifacts that downstream consumers can re-read without re-running the pipeline [w=0.61, https://www.databricks.com/blog/data-pipeline-best-practices]. Persisting stage outputs as build artifacts that later stages and humans consume is standard CI practice [w=0.79, https://circleci.com/docs/guides/optimize/artifacts/].

## What gets persisted

The curve cache carries the (u,v) coordinates for both corpora in union space, alongside per-corpus fit metrics. The source doc's changelog lists the persisted fields: per-corpus Stage 1 metrics (N, PC1+PC2, R-squared, sparse counts), the union fit metrics, the overlay statistics, and the uv coordinate tables (77 skill entries and 131 self-doc entries). Everything a later RSI cycle needs to compare against the baseline is in one artifact ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

## The verification checklist

Stage 5 of the run is a fixed checklist, recorded with pass marks in the source doc:

1. N of at least 20 for each corpus.
2. PC1+PC2 of at least 0.40 at Stage 1 for every fit.
3. Holdout R-squared greater than 0 at Stage 5.
4. Sparse-cell count reported at Stage 1 per corpus.
5. Sparse-cell count reported at Stage 5 for the differential.
6. Delta of sparse-cell counts documented, even when no RSI has been applied (the honest no-change entries: parent 6 to 6, offshoot 7 to 7, differential 0 at baseline).
7. Per-corpus primitive basis preserved (parent 7-D, offshoot 6-D, union 19-D).
8. Curve cache persisted with uv coordinates for both corpora.

The checklist's sixth item is the interesting one: recording unchanged deltas turns the baseline into a closed-loop metric. A future cycle that reports its deltas is directly comparable to recorded zeros, which is what makes "the closed-loop metric FIRES on the differential baseline" a checkable statement rather than a slogan ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

## The changelog discipline

Each run appends a changelog entry with a fixed internal shape: cycle number, hypothesis, edit, single intent, validation with the concrete metrics, and result. The 2026-08-04 entry records the hypothesis (concat the two primitive bases into a union basis, fit one curve, report the overlay), the edit (the pipeline), and the full metric set. This makes each run self-describing: a reader can tell what was attempted, what was measured, and what changed without reading the pipeline code ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

## Operational anti-patterns

Three anti-patterns are documented from this run and its parents ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary):

1. Re-fitting the curve mid-run invalidates the sparse-cell snapshot. Detection and fit must happen in one pass on one coordinate set.
2. Mixing primitive bases (assigning one corpus's primitives to the other's items) silently corrupts the union fit; the zero-padding contract is load-bearing and must be asserted, not assumed.
3. Applying RSI to the union basis while letting it modify per-corpus Stage 1 fits destroys the cross-corpus baseline. Differential RSI records new coordinates; it never rewrites the recorded baselines.

## Human checkpoint

The pipeline ends at a human decision point: RSI Cycle 1 on the differential is staged but deferred to user approval, per the project rule that RSI edits produce PRs for review. The automation boundary is explicit: the pipeline computes and persists; only an approved cycle edits corpora ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).
