# lensing-question-space-brainstorm

Minted knowledge corpus from yubi-OS/yubiOS refs/ `lensing-question-space-brainstorm-2026-08-13.md`. Topic: lensing the question space, connecting null-standardized question-space corpus audits to established mathematical proofs (Hodge theory, spectral methods), the brainstormed anchors and the resulting gap map.

## Docs

| NN | doc | one-line scope |
|---|---|---|
| 01 | [01-conformal-mapping-lens](./01-conformal-mapping-lens.md) | Mobius/conformal maps as refractive-index design: Leonhardt Science 2006 optical conformal mapping, transformation optics, Schmiele et al flat lenses |
| 02 | [02-fermat-eikonal-variational](./02-fermat-eikonal-variational.md) | Fermat's principle on conformally flat metrics, the eikonal equation, and Snell's law as the corner condition at index discontinuities |
| 03 | [03-matched-null-vacuum-spectrum](./03-matched-null-vacuum-spectrum.md) | The matched marginal null as vacuum metric: Marchenko-Pastur spectrum, fixed-margin ensembles and variance profiles (Lyu-Mukherjee) |
| 04 | [04-effective-dimension-ladder](./04-effective-dimension-ladder.md) | Effective dimension as a smooth dial: participation ratio, stable rank, intrinsic dimension, Zhang's effective dimension, Johnson-Lindenstrauss |
| 05 | [05-fisher-rao-intent-geometry](./05-fisher-rao-intent-geometry.md) | Fisher-Rao information geometry as the unique invariant geometry of sufficiency: Rao 1945, Cencov's theorem, Efron's statistical curvature |
| 06 | [06-sbi-embedding-networks](./06-sbi-embedding-networks.md) | Simulation-based inference and neural posterior estimation with embedding networks as the learned compression between observation and parameters |
| 07 | [07-caustics-catastrophe-theory](./07-caustics-catastrophe-theory.md) | Caustics as degenerate ray maps: Arnold-Thom catastrophe theory, fold and cusp classification, and singularities of transport maps |
| 08 | [08-snell-basis-interfaces](./08-snell-basis-interfaces.md) | Refraction at basis interfaces: conservation laws for null-standardized signals crossing bases, achromatic coordinates, dispersion across the dimension ladder |
| 09 | [09-powering-conformal-lens](./09-powering-conformal-lens.md) | Actually powering the lens: null-constrained Mobius map optimization for family concentration with anti-caustic rank and condition-number guards |
| 10 | [10-wasserstein-geodesics](./10-wasserstein-geodesics.md) | The Wasserstein channel: Benamou-Brenier dynamic optimal transport, W2 geodesics between distributions, transport-map singularities as caustic analogs |

## Research summary

- Results collected: 120 (20 searXNG queries, top 6 kept per query).
- Weight split: 62 results at weight >= 0.5 (primary/official), 58 at weight < 0.5 (weak; cited only with a weak-backing label in text).
- Jev requests: 24 (1 outline score validation, 23 noul weighting batches of 5). Usage: 19146 input / 0 output tokens.
- Redo counts: 0 dig redos; 0 rescore redos. All 120 results weighted on the first pass; 3 transient 429s from /api/decide were retried after 30s sleeps per the redo policy.
- Skipped docs: none. All 10 subtopics digged strongly enough to author honestly (4 to 8 primary results each).
- Every doc: ~600 to 1200 words; each factual claim carries its source URL and the jev weight backing it; claims with no source were deleted, weak (< 0.5) claims are labeled in text.

## Gaps / skips

None. No doc was skipped. Gaps A through F of the source brainstorm are documented as open experimental gaps inside the docs themselves; that is their status in the source material, not a mint failure.

## Provenance

- Source doc: yubi-OS/yubiOS refs/ lensing-question-space-brainstorm-2026-08-13.md (read in full; not copied into the corpus).
- Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200. Probe observed this mint: searXNG 52 results on the probe query, decide 200, model clef.
- Metrics: score (outline) and noul (source weighting) via clef on /api/decide.
