# Sparse cells and lens generation

Scope: tiling the sphere with equal-area cells, detecting sparse cells in the fitted curve, and turning sparse members into authored coverage lenses.

## Equal-area cells

The lifted and fitted corpus lives on a compact sphere, which makes it tileable. The method partitions the sphere into equal-area cells so that every cell carries the same a priori weight, and a cell's sparseness is a property of the corpus rather than of an unequal partition. Equal-area spherical partitioning is a solved problem with mature machinery. HEALPix, the Hierarchical Equal Area isoLatitude Pixelization, is a genuinely curvilinear partition of the sphere into exactly equal-area quadrilaterals, with a base resolution of 12 pixels in 3 rings around the poles and equator (https://healpix.sourceforge.io/pdf/intro.pdf, jev high 0.8812). A data-structure paper describes HEALPix as designed for spherically mapped point data, with hierarchical refinement as a first-class operation (https://pmc.ncbi.nlm.nih.gov/articles/PMC5484980/, jev high 0.9122), and a regridding study notes that the HEALPix grid's hierarchical equal-area subdivision trivializes coarsening and refinement operations (https://gmd.copernicus.org/articles/19/6545/2026/, jev high 0.9022). An alternative subdivision method divides the sphere into latitudinal bands of near-constant span, then divides each band into equal-area cells (https://arxiv.org/pdf/1612.03467, jev high 0.7921).

The corpus method's requirement is weaker than HEALPix's full machinery: any equal-area tiling with a fixed cell count per fit works, because the cells are bins for counting members, not a coordinate system. What matters is that cell areas are equal, so "this cell has 1 member" means the same thing in every cell.

## What a sparse cell is

A cell is sparse when its member files are few and the fitted spherical-harmonic value over it is low, after the column-permutation null has failed to reproduce that sparseness. The two conditions do different work: member count is empirical, fitted value is smooth interpolation, and the null check stops frequency artifacts from masquerading as gaps. A cell that is empty because the corpus never talks about that joint primitive pattern is a different object from a cell that is empty because one primitive is rare everywhere; only the first is a candidate lens (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

On the yubiOS corpus itself, the pole of the fitted curve is dominated by verification-chain and YubiKey-boot documents, and the pole's sector is Failure modes. The primitives most often absent from the sparse cells are rootless privilege and container isolation. That is the shape of a real audit finding: not "the corpus is thin" but "the corpus is thin exactly where privilege separation and container boundaries would thicken it" (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

## From sparse cell to lens

A lens is a authored coverage pattern: a statement of which primitives a future document must cover to fill a named sparse cell, written so a human can act on it and a later fit can verify it. The pipeline from finding to lens is mechanical on the geometry side and human on the authoring side:

1. The geometry names the cell: its position on the sphere and its member files.
2. The learned basis names the deficit: which of the 10 primitives the members lack.
3. The null model vetoes false gaps: if permutation reproduces the sparseness, no lens is authored.
4. A human writes the lens: the pattern to cover, in the vocabulary of the basis.

The lens idea is the prescription layer that separates this method from description-only analysis. A topic model can say the corpus is mostly about X; only a named-axis geometry can say the corpus lacks the joint pattern (rootless privilege, container isolation) in the neighbourhood of these files, and what a new document must cover to change that (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

## Adjacent tooling, honestly weighted

The searxng dig for this subtopic surfaced several tools that audit corpora for coverage gaps, and none of them carried a high jev weight. A control-first coverage and blind-spot analysis tool over an evidence corpus exists as audit-labs/control-coverage (https://github.com/audit-labs/control-coverage, jev low 0.2870); an OpenAgent Eval tutorial audits a document corpus for staleness, duplicates, and coverage gaps (https://openagenthq.github.io/openagent-eval/examples/corpus/, jev low 0.3683); a multi-lens code audit tool named RepoLens applies 280 expert agents across review lenses (https://github.com/TheMorpheus407/RepoLens, jev low 0.3000); and a lens-driven cross-decision corpus audit tool applies 10 universal lenses across decisions, glossary entries, and spec sections (https://github.com/Gunther-Schulz/coherence-audit, jev low 0.2204). These are cited as evidence that lens-shaped corpus auditing exists as a tool category, not as sources for any claim about the corpus geometry method. None of them, at the weight recorded here, can support a factual claim about how sparse cells should be detected; that role belongs to the equal-area and null-model machinery above.

## Why equal-area, not Voronoi

An alternative is to let cell boundaries follow the data, as in a Voronoi or k-means partition. The method refuses it for the same reason it refuses unnameable embeddings: data-following boundaries make sparse cells self-fulfilling, since a dense region grabs more cells and leaves fewer for thin regions, flattening exactly the signal the audit exists to find. Equal-area cells keep the measurement independent of the thing measured (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).
