# 04 - Quality feature extraction for skill corpora

Scope: the 31 measurable features that give each skill a position in quality space before any embedding is learned, and the pruning that keeps the feature matrix honest.

## The feature set

The application extracts 31 columns per SKILL.md file in four families:

- Structural counts: bytes, lines, words, headings, bullets, code blocks, table rows, links, and cross-references to other skills. These are the cheapest objective signals that a document is substantive rather than a stub.
- Semantic flags: presence of use-when guidance, trigger phrases, a verification section, an antipatterns section, a changelog, and a count of frontmatter fields. These measure whether the file carries the operational sections that make a skill actionable.
- Metadata binaries: has_scripts, has_references, has_assets, has_cache.
- Keyword families: raw and density counts for four families (yubios, ci, kernel, meta), giving both absolute and size-normalized signals.

This mirrors the software-documentation-quality literature, which derives quality aspects from the literature and designs metrics that measure them, validated with developer surveys [0.653, strong] [0.711, strong]. Academic frameworks decompose documentation quality into explicit dimensions rather than a single score [0.815, strong], and metrics-based approaches built on the Goal-Question-Metric paradigm deliberately leave quality goals to the project's owners [0.521, strong]. The 31-feature set is that philosophy applied to agent skill files: measure many concrete dimensions, let the downstream model weight them.

## Pruning and the PCA spectrum

Two of the 31 columns (has_assets, has_cache) had zero variance across the 62-skill corpus and were flagged and dropped; a feature every item shares carries no ordering information.

PCA on the remaining quality matrix gave a slowly decaying spectrum: PC1 explained 23.4 percent, PC2 16.9 percent, PC3 12.5 percent, PC4 8.4 percent, PC5 6.0 percent. There is no single dominant quality axis; skill quality in this corpus is genuinely multi-dimensional.

That decay rate is itself diagnostic information. When the first component explains under 40 percent of variance, the standard warning is that a 1-D summary of the feature space is thin. In the learned-latent-curve application that reading turned out to point at the wrong layer: the 1-D curve on good targets generalized fine (holdout R2 +0.144), so the low PC1 was absorbed rather than fatal (see doc 06). What the spectrum still usefully tells you is how much ordering signal exists at all, and how many t coordinates a future 2-D surface would have to earn.

## Determinism

Feature extraction must be deterministic: every one of the 31 values is computed from the file bytes with fixed rules, so the 62 x 31 matrix, its z-scores, and the PCA scores are reproducible. This matters because the t coordinate (doc 02) is built from the PCA top-1 of exactly this matrix; a nondeterministic feature layer would silently move every point on the curve.
