# learned-latent-curve on yubiOS: the full flow from coverage matrices to gap-finding

Knowledge corpus minted 2026-10-05 from yubi-OS/yubiOS `refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md`. Topic: applying learned-latent-curve to a real artifact corpus, the full flow from primitive coverage matrices through PCA and curve/surface fits to gap-finding, including the consolidated superseding version (v3) and the v4 negative result.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-coverage-matrices.md](01-coverage-matrices.md) | Building the 9-D binary primitive coverage matrix: the 10 primitives, keyword dictionaries, dropping the collapsed self-describing column, binary versus graded variants |
| 02 | [02-pca-t-coordinate.md](02-pca-t-coordinate.md) | Deriving 1-D and 2-D t coordinates from PCA of the coverage matrix, explained variance as the go/no-go gate |
| 03 | [03-one-d-curve-fit.md](03-one-d-curve-fit.md) | The 1-D fits v1 (raw content, fail) and v2 (coverage basis, first pass): sanity cosines, holdout gates |
| 04 | [04-two-d-surface.md](04-two-d-surface.md) | The v3 2-D learned surface: separable Fourier basis, closed-form ridge, honest gradient finding, headline metrics |
| 05 | [05-negative-embedding-target.md](05-negative-embedding-target.md) | The v4 negative finding: MiniLM sentence-transformer target, effective rank 211 diagnosis, why dense embeddings fail |
| 06 | [06-corpus-hygiene.md](06-corpus-hygiene.md) | Corpus hygiene that changed the fit: .gitkeep filtering 213 to 211, 14 hand-classified coverage overrides |
| 07 | [07-gap-finding-ops.md](07-gap-finding-ops.md) | Operationalizing the fit: the scalar knob t, the 3-step projection pipeline, uncovered-territory queries |
| 08 | [08-supersession-lifecycle.md](08-supersession-lifecycle.md) | Supersession and lifecycle: the consolidated doc replacing v1-v3, v4 retained as negative evidence, fit caches |
| 09 | [09-gates-antipatterns.md](09-gates-antipatterns.md) | Metric gates and anti-patterns: PC1 >= 0.40 heuristic versus holdout R-squared ground truth, overfitting variants |

## Research summary

- Results collected: 108 (18 searXNG queries, 2 per subtopic, top 6 per query)
- Weight split: 31 authoritative (>= 0.5) / 77 weak (< 0.5) of 108
- Jev requests: 24 (1 preflight probe, 1 outline validation, 22 weighting batches), usage 19018 input / 0 output tokens
- Redo counts: 0 dig redos; 2 HTTP-level redo retries inside the weighting loop (429 Too Many Requests, recovered after the 30 s backoff per the redo rule)
- Skipped docs: none; all 9 subtopics authored
- Internal provenance: yubiOS-specific facts (fit metrics, corpus numbers, file paths) cite the consolidated flow doc itself as the internal primary source and are marked "not jev-weighted". External technique claims cite jev-weighted web sources with the weight inline; claims backed only by weight < 0.5 sources are labeled weak backing in text.

Per-doc source counts (kept / primary >= 0.5):

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01 | 12 | 4 |
| 02 | 12 | 1 |
| 03 | 12 | 6 |
| 04 | 12 | 2 |
| 05 | 12 | 6 |
| 06 | 12 | 1 |
| 07 | 12 | 4 |
| 08 | 12 | 4 |
| 09 | 12 | 3 |

## Gaps / skips

None. All 9 outline subtopics validated (lowest score t08 = 0.98, marginal bucket, kept on dig strength) and all 9 were authored. The dig for subtopic 06 (corpus hygiene) returned mostly generic curation material, so that doc leans on internal provenance and labels its weak external backing explicitly.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.
