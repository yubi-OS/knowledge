# 03: Generator design

**Scope:** Generator design rules: scale-band pinning across the instrument's scale lattice, uniform elements far below the finest spacing, ink-coverage arithmetic computed before rendering, and empirical per-class element survival checks.

Grounding spine: the source doc `yubi-OS/yubiOS skills/falsification-corpus/SKILL.md`, plus searXNG digs weighted by jev noul.

## Why generator design is instrument design

A known-answer corpus only works if the generator classes produce structures the instrument can read at all. The source doc gives 4 rules, each backed by a measured failure from the 2026-10-06 supersolid run.

## Rule 1: scale-band pinning

The corpus structure must SPAN the instrument's window. Count your hierarchy depths against the scale lattice and confirm each level's contour-to-point transition size sits outside the pinned scales. If a transition lands inside the window, every level contaminates the same band and the measurement cannot separate them.

The digs show why the scale lattice is load-bearing for box counting specifically: in box counting, the information recorded is whether each box contains pixels of the target class, and the box-counting dimension is a fit over the scale range you count at (jev weight 0.39, weak backing, https://en.wikipedia.org/wiki/Box_counting). A generator whose feature sizes collide with the counting scales therefore corrupts the very fit the gate will judge.

## Rule 2: uniform element size far below the finest spacing

Never size-grade elements by hierarchy depth. All elements get one radius, and that radius must be small compared to the smallest gap at the finest scale. Size-graded elements put each level's contour-to-point transition inside the window and collapse the measurement: the source doc measured D 0.9478 on a gasket that should read ~1.585.

## Rule 3: ink-coverage arithmetic before rendering

Compute the render's ink coverage against the instrument's normalization target BEFORE rendering. If your binary masks can exceed the normalization band, the normalization rule can threshold them to an empty set silently. The source doc measured this: binary renders above ~12% ink were argmin-thresholded to t=255, producing an empty mask with no error.

The worked arithmetic from the run: 366 droplets at r=3 on a 384-canvas give ink area ~ 366 * pi * 9 ~ 10,348 px, which is ~ 7.0% of 147,456. That sits inside the 6%-normalization argmin band and safely under the ~12% empty-mask cliff. The source doc's instruction: do this division per class BEFORE rendering. A class whose ink falls outside the band is a design bug, not a run finding.

## Rule 4: empirical element survival checks

MIN_COMPONENT-style element checks are done empirically, not by trusting the generator. Run the instrument's component filters on each generator class pre-run and confirm every element survives. The source doc measured: an isolated small disk at r=2 traces 0 boundary pixels and vanishes, while r=3 traces 16. The closing line is the skill's epistemology in miniature: "Do not trust the generator's intent; check the instrument's view."

## Render discipline

The source doc pins the render contract: fixed canvas (pinned grid, e.g. 512x512), deterministic seeds, raw 8-bit gray row-major, and the same encoding path for every class so parity comparisons are like-for-like. Deterministic seeds matter for a reason the reproducibility dig makes explicit: reproducibility is a major principle underpinning the scientific method (jev weight 0.41, weak backing, https://en.wikipedia.org/wiki/Reproducibility), and byte-reproducible reruns are what make a corpus result re-checkable at all.

## The known-and-controllable precedent

The digs found two research artifacts that treat "known and controllable" as the design requirement for synthetic corpora. A synthetic benchmarking pipeline for camera calibration generates datasets with ground-truth parameters and selects the optimal algorithm per configuration (jev weight 0.48, weak backing, https://arxiv.org/pdf/2307.01013). StereoGenBench requires paired data in which the variables that determine binocular geometry, camera baseline, intrinsics, scene depth, and camera motion, are known and controllable, and notes existing resources provide only subsets of these variables (jev weight 0.41, weak backing, https://arxiv.org/abs/2605.23237). The falsification corpus makes the same demand one level stricter: not just known parameters, but known expected measurement outputs on the instrument's own scale lattice.

## Design bug vs run finding

The source doc's sharpest rule separates classes of surprise. If a class's ink coverage falls outside the normalization band, that is a design bug to fix before rendering. If a class passes design and still fails the gate, that is a run finding about the instrument. Generator design is where that separation is earned: every check in this doc runs before the first measurement, so the gate's verdicts are clean.
