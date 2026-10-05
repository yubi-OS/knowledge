# Differential Curve Mechanics for Cross-Corpus Comparison

**Scope:** How the cross-corpus differential curve is fit: the 9-D primitive basis, union corpus construction, projection to a 2-D (u,v) plane, and cell occupancy counting.

## The setup: two corpora on one surface

The differential curve's core move is to stop treating a skill corpus and a self-doc corpus as two separate inventories and instead fit a single learned surface over their union. In the yubiOS case the union was the skill corpus (77 skills) plus the self-doc corpus (131 items across 10 memory files), giving a combined set of 208 items [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`].

Each item is first described by which structural primitives it covers. The primitive basis used across yubiOS corpora is the 10-primitive model defined by the `internal-big-picture` skill: attestation, trust chain, least privilege, declarative policy, continuous or adaptive behavior, immutability, audit and evidence, cryptographic identity, segmentation, and self-describing artifacts [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, MVP table note on `internal-big-picture`]. In the differential's union fit the effective basis was 19 dimensions (the union of the per-corpus bases), which matters later when asking whether isolated cells are real gaps or fit artifacts.

Binary primitive coverage per item produces a binary vector. Dimensionality reduction of binary data is a well-studied problem: mixture-of-latent-class models project d-variate binary vectors onto lower-dimensional spaces while preserving cluster structure [weight 0.94, https://www.sciencedirect.com/science/article/pii/S0047259X20302499]. The differential applies the same idea: project the binary coverage vectors into a shared 2-D (u, v) plane where distance means structural similarity.

## Projection and the learned surface

PCA-style projection is the standard tool for turning a high-dimensional binary matrix into 2 coordinates that retain as much variance as possible; principal components are the unit vectors along which the data's variance is best preserved [weight 0.19, weak backing, https://handwiki.org/wiki/Principal_component_analysis]. The differential's projection is learned rather than hand-drawn: the (u, v) coordinates come from fitting the union corpus, not from a fixed taxonomy.

A comparable 2026 approach maps similarity spaces across embedding models with synthetic anchors so that scores from different geometric spaces become comparable [weight 0.68, https://arxiv.org/html/2608.05857v1]. The differential faces the same cross-space problem: skill items and self-doc items come from different generative processes, so a shared plane plus a tolerance radius is what makes their positions comparable. Interactive tools like the TensorFlow Embedding Projector demonstrate the practical payoff of 2-D projections for spotting structure that is invisible in the raw vector space [weight 0.50, https://projector.tensorflow.org/].

## Cell occupancy counting

Once every item has a (u, v) coordinate, the plane is partitioned into cells at a chosen radius (r = 0.05 in the yubiOS baseline), and each item is assigned to the cell containing its coordinate. Occupancy is then counted per cell from both corpora:

- A cell holding only skill items is skill-only.
- A cell holding only self-doc items is selfdoc-only.
- A cell holding at least one item from each corpus is jointly occupied.

In the 2026-08-04 baseline fit this produced 25 skill-only cells, 50 selfdoc-only cells, and 0 jointly-occupied cells [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`].

Grid-based occupancy analysis over projected coordinates is a proven pattern outside software: an intrinsic assessment of OpenStreetMap contribution patterns sampled a region with a regular hexagonal grid and counted contributions per cell to find structural patterns [weight 0.73, https://media.ccc.de/v/sotm2019-at-1885-intrinsic-assessment-of-openstreetmap-contribution-patterns-through-ex]. The differential does the same thing to document corpora: the grid turns continuous positions into countable, comparable buckets.

## What the fit buys you

Because the surface is fit on the union, every cell is defined in the same coordinate frame for both corpora. That single frame is what makes the three-way bucket taxonomy possible at all: without a shared projection, "this skill has no documentation counterpart" would be a pairwise string-matching judgment rather than a geometric one. The fit is also cheap to redo, which is why the use case built on it treats re-fitting after each improvement cycle as the verification step rather than a one-off analysis [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`].

## Limits of the mechanics

Two mechanical caveats come directly from the baseline. First, the 0 joint anchors at r = 0.05 may be a property of the radius, not of the corpora. Second, some skill-only cells may be artifacts of the 19-D union basis rather than real gaps; the MVP's first test dispatches fresh-context subagents to check whether any self-doc item actually references each isolated skill [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`]. Projection artifacts in 2-D maps are a known hazard of dimensionality reduction generally: insights read off a 2-D projection do not always hold in the original high-dimensional space [weight 0.73, https://arxiv.org/abs/1705.05283].
