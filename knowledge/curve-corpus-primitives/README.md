# corpus geometry for audit: curve-corpus-primitives

Knowledge corpus minted from yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md (2026-10-05). Topic: placing a document corpus on S2 via learned primitive bases, PCA, stereographic lift, spherical-harmonic ridge fits, null models (column permutation, curveball, iid), and sparse-cell gap finding; contrasted with embedding maps, topic models, and fixed regex bases.

## Docs

1. [01-learned-primitive-bases.md](01-learned-primitive-bases.md) - mining term clusters from the corpus, LLM pruning to at most 10 primitives, non-determinism, and basis reuse per FIT id.
2. [02-binary-coverage-vectors-pca.md](02-binary-coverage-vectors-pca.md) - the 0/1 coverage matrix, PCA to 2 components, and why binary joint patterns beat simplex mixtures for audit.
3. [03-stereographic-lift-sphere.md](03-stereographic-lift-sphere.md) - inverse stereographic lift of the principal plane onto the 2-sphere, and why the audit wants a compact manifold.
4. [04-spherical-harmonic-ridge-fits.md](04-spherical-harmonic-ridge-fits.md) - the degree-3 real spherical-harmonic ridge fit, fitting irregular samples, and the matched-parameter ablation history.
5. [05-null-models-corpus-geometry.md](05-null-models-corpus-geometry.md) - column permutation, curveball, and iid nulls; what each preserves and destroys; which verdicts each licenses.
6. [06-sparse-cells-lens-generation.md](06-sparse-cells-lens-generation.md) - equal-area cells (HEALPix lineage), sparse-cell detection, and authored coverage lenses.
7. [07-rejected-alternatives.md](07-rejected-alternatives.md) - dense embeddings with UMAP/t-SNE, LDA topic models, fixed regex bases, and flat Fourier surfaces, with the reason each loses.
8. [08-audit-boundaries-flip-conditions.md](08-audit-boundaries-flip-conditions.md) - the audit versus retrieval versus description versus checklist boundary, and the two flip conditions.

## Research summary

- Results collected: 96 (16 searxng queries, top 6 kept per query).
- Weight split: high 55 / low 41 / unweighted 0.
- Jev request count: 22 total (1 outline validation over 8 subtopics, 20 result-weighting batches of 5, 1 retried after a 429).
- Outline validation: 8 subtopics proposed, 8 kept (noul 0.7524 to 0.9494, floor 0.4).
- Redos performed: 0.
- Skipped docs: none.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.
