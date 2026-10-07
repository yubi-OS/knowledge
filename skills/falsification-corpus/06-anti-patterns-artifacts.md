# 06: Anti-patterns and corpus artifacts

**Scope:** The 8 anti-patterns the skill teaches (each one cost a fix or a review) and the corpus artifact set: generators, results JSON, amendments log, parity manifests, renders, all version-stamped and byte-reproducible.

Grounding spine: the source doc `yubi-OS/yubiOS skills/falsification-corpus/SKILL.md`, plus searXNG digs weighted by jev noul.

## The 8 anti-patterns

The source doc's anti-patterns section carries the annotation "each one cost a fix or a review," meaning every entry is a real incident from the 2026-10-06 supersolid run, not a hypothetical.

1. **Size-grading elements by hierarchy depth.** Puts every level's contour-to-point transition inside the pinned window; the read collapses. Fix: uniform elements far below the finest spacing. The measured cost: D 0.9478 on a gasket that should read ~1.585.
2. **Silent empty masks from normalization rules.** Coverage-based thresholding can return an empty set with no error when ink exceeds the band. Fix: assert non-empty masks on every run. Measured cost: renders above ~12% ink were argmin-thresholded to t=255 with no error raised.
3. **Gate windows written against imagined scales.** A window with no realization on the actual scale lattice is unfalsifiable and unfailable. Fix: enumerate the lattice; check the window pre-run. The example: "s ~ 16-64" has no two-octave span on the lattice [4,6,9,13,20,29,43,64].
4. **Post-hoc gate movement.** Adjusting the gate after seeing results destroys the test. Fix: pre-run amendments only, with a-priori justification, dated in the log.
5. **Trusting analytic bias models over measured convergence.** Sign errors in modeled bias are common; measured L-convergence is ground truth. Never evaluate a gate at an uncalibrated L. Measured cost: two advisor bias models predicted the wrong sign of render bias.
6. **Near-degeneracy predictions without matched-extent controls.** If you predict two classes read nearly equal, the corpus must hold extent fixed or the prediction is untestable. Measured case: predicted near-degenerate, measured difference 0.23, extents differed 236px vs 384px.
7. **Promising a 2D read on structurally 1D data.** Check dimensionality before committing the real-data pass. Measured case: a waveguide platform's data is 1D profiles only.
8. **Asserting class survival from generator intent.** Component filters silently drop classes; only empirical per-class element checks catch it. Measured case: an r=2 disk traces 0 boundary pixels and vanishes.

The word "silent" recurs in anti-patterns 2 and 8, and the choice is deliberate: Merriam-Webster defines silent as making no sound, and figuratively as failing to disclose something (jev weight 0.85, https://www.merriam-webster.com/dictionary/silent; Cambridge Dictionary, weight 0.76, https://dictionary.cambridge.org/dictionary/english/silent). A silent failure produces no error to catch, which is why the skill replaces error handling with assertions (non-empty masks, component counts) that fire on the happy path. A weak-backed dig on ETL pipelines describes the identical shape: a write to the warehouse fails, a broad catch swallows it, the job exits 0, and nothing was written (jev weight 0.16, weak backing, https://www.notilens.com/blog/etl-pipeline-silent-failure-monitoring).

## The corpus artifacts

The source doc lists 5 artifacts to keep, all versioned:

1. **Generators:** one deterministic function per class, seeds recorded, versioned alongside the instrument.
2. **Results JSON:** per class, D, slope subset, r2, component count, and the render parameters that produced it.
3. **Amendments log:** dated, append-only, every pre-run gate change with its a-priori justification.
4. **Parity manifests:** the identical renders and per-class deltas between port and source of record.
5. **Renders:** the actual bitmaps (PGM/PNG), so any result is re-runnable without re-deriving the generator.

The version-stamping rule is absolute: every artifact carries the instrument version it ran under; a result without a version stamp is uninterpretable. This pairs with guideline 9 (instrument parameter changes are major version bumps) and guideline 10 (keep renders, results JSON, and the amendments log versioned together; reruns must be byte-reproducible from recorded seeds).

The reproducibility dig gives the general principle these artifacts instantiate: reproducibility is closely related to replicability and repeatability and is a major principle underpinning the scientific method (jev weight 0.41, weak backing, https://en.wikipedia.org/wiki/Reproducibility). The corpus makes it concrete: seeds, raw renders, and version stamps are what make a rerun byte-identical rather than approximately similar.

## Why the artifacts are the audit trail

Each artifact answers a different audit question. The generators answer "what was measured on"; the results JSON answers "what did the instrument say"; the amendments log answers "did the gate move"; the parity manifests answer "do the two implementations agree"; and the renders answer "can any of this be checked again without trusting anyone's description of it." Together they make a falsification run replayable by a stranger, which is the property that lets a PASS be trusted and a FAIL be diagnosed.
