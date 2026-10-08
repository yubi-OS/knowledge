# 07 Operating Modes, Granularity Rule, and Scale

Scope: the 4 operating modes, the corpus-size granularity rule, and the scale table from 100 to 100,000 files, plus the external grounding for the sparse-cell detector and the sphere lift. Source doc: yubi-OS/yubiOS skills/repo-refs-skill/SKILL.md.

## The 4 operating modes

Mode A, cold-start refresh: a new session opens on a repo with no cached refs/ archive. Pull the listing (GET /repos/{r}/contents/refs?per_page=100), fetch every full body, compute 9-D coverage per file aggregated to file level, then Stage 1, Stage 2, Stage 3, Stage 5 (no Stage 4, because there is no prior archive to RSI). Save session/repo-refs-archive-<repo>-<date>.json and push the human-readable summary to refs/repo-refs-coverage-map-<repo>-<date>.md.

Mode B, incremental refresh: read the cached archive, pull deltas via GET /repos/{r}/commits?path=refs&since=<last_run_timestamp>, merge, re-fit (Stage 1 + 2), run Stage 4 on the sparse-cell list, save and push.

Mode C, deep-research cycle: run Mode A or B first, dispatch 3 to N parallel subagents per parallel-deep-research, augment the archive with corpus_as_deep_research items, re-fit, run Stage 4, push the synthesized output to refs/<topic>-YYYY-MM-DD.md, and push the coverage map.

Mode D, target-file RSI: a single refs/ doc needs prioritized RSI without the full corpus fit. Read the cached archive, isolate the target file, apply single-action-curve-rsi, compute (d_pre, d_post, delta). If delta > 0 apply the edit; if delta <= 0 defer to Stage 3 of the full corpus fit.

The lifecycle maps runs to modes: initial run is Mode A (cycle 1 is the gap-mapping cycle), subsequent runs are Mode B, deep-research cycles are Mode C, single-file RSI is Mode D. Re-fit cadence: when the corpus grows by at least 25% or on explicit user request. Cache TTL is 7 days; push cadence is per cycle.

## The granularity rule

| Corpus size | Granularity | Stage-1 fit quality |
|---|---|---|
| N < 20 | Decompose each file by major section (`## N. ...`) | PCA degenerates; use the NSS 12-axis sweep instead |
| 20 <= N < 30 | One file per row, no decomposition | Mobius identity init; freeze |
| N >= 30 | One file per row | Mobius refine per cycle; re-fit cadence at 25% corpus growth |

The decomposition rule exists because the 2-D PCA top-2 needs at least 2 distinct points to span the plane; below 20 items the curve fit degenerates and the skill falls back to the NSS 12-axis sweep, Mode A only, no Stage 3 dispatch (source doc, Key Assumptions item 3). A doc with sections ## 1 through ## 12 becomes 12 items.

## Scale

The source doc's scale table: small repos under 100 files fit in under 1 second in a single batch; about 1,000 files take about 5 seconds with PCA and Mobius refine per cycle; about 10,000 files take about 30 seconds with sampling to 1,000 for Mobius and full PCA; 100,000+ files take minutes with sampling to 10,000 and per-corpus basis auto-derivation. The 129-file yubiOS refs/ corpus fits in under 1 second on a workstation without sampling.

## External grounding for the math (weak, per jev noul)

The dig targeted the two mechanical components: nearest-neighbor sparse detection and the sphere lift. All results weighted below 0.5:

- SciPy's cKDTree is the documented k-d tree index for rapid nearest-neighbor lookup, which Stage 2 uses with chordal radius r about 0.095 on 5,000 equal-area S2 points (weight 0.05, weak, docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.cKDTree.html; the project site at scipy.org weighted 0.06, weak).
- Stereographic projection maps the sphere to a plane through a pole, a standard perspective projection (weight 0.05, weak, en.wikipedia.org/wiki/Stereographic_projection; Wolfram MathWorld at mathworld.wolfram.com/StereographicProjection.html weighted 0.06, weak).
- A Mobius transformation is realizable geometrically as inverse stereographic projection, a rigid motion of the sphere, then stereographic projection back, which is exactly the reparameterization family the Stage 1 lift draws from (weight 0.04, weak, en.wikipedia.org/wiki/M%C3%B6bius_transformation; a Trinity College Dublin course PDF weighted 0.02, weak).

All dig results are weak backing; the parameters (r about 0.095, the 5,000-point equal-area sample, the PC1+PC2 gate at 0.40) are stated in the source doc and its upstream hyperspherical-harmonic-curve.

## Why the thresholds matter

The source doc derives r about 0.095 from the 5,000-point equal-area sample and warns that r = 0.05 would fake a pre/post improvement: cell-count change without delta change (Key Assumptions item 7). The ideal pole is the all-ones vector (1,1,...,1) in {0,1}^9 lifted the same way, the fully-archetyped doc; it stays fixed rather than being replaced by the Frechet mean because the corpus is small and a data-dependent mean would shift cycle to cycle (Key Assumptions item 6). Mobius refinement is identity-init for cycle 1 and L-BFGS-B-refined from cycle 2 only when N_files >= 30, with cross-ratio preservation checked on 100 held-out 4-tuples; a refinement train with R^2 <= 0 means the basis cannot be improved by reparameterization, so freeze phi_theta = identity.
