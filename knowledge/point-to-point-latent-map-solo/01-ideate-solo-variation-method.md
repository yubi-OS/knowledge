# 01 Ideate solo variation method: how the 7 variations were generated and scored

Scope: how the 7 design variations were generated (forced lenses: inversion, constraint removal, audience shift, combination, simplification) and scored on the P/S/D/T matrix with threshold 8.

## The record being examined

The source record (yubiOS refs/point-to-point-latent-map-solo-2026-09-06.md, internal record) is a solo ideation session: no dialogue partner, no human in the loop. It generated 7 named variations for the same problem (mapping an unlabeled latent cloud onto sphere geometry as a deployable browser and Worker tool), scored each on 4 axes, picked one finalist (V4, "Proof-carrying point map", total 19), and kept 3 runners-up (V1 and V5 at 14, V3 at 14, V6 at 13, V7 at 13).

## Forced lenses as a design-space sampler

The session explicitly logged which lenses were "forced outside habit": Inversion (twice, as V1 and V7), and Audience shift (V3). This is a form of design space exploration, the practice of searching for design solutions that best meet specific requirements by exploring a space of potential design points (https://www.sciencedirect.com/topics/computer-science/design-space-exploration, weight 0.54). Research on systematic design space exploration treats the enumeration of alternative mappings as the core activity that makes exploration more than improvisation (https://dl.acm.org/doi/10.1145/3647640, weight 0.81). The lens-forcing move serves the same purpose as the orthogonal dimensions in recent structured design-space models: a representation that models a design space with orthogonal dimensions and discrete selectable elements makes combinations explicit instead of accidental (https://arxiv.org/html/2506.10587v1, weight 0.77). In the record, the lenses are the orthogonal dimensions (what to invert, what audience, what to combine) and the 7 variations are the selectable elements.

## Scoring axes and threshold

Each variation was scored on 4 axes: P (painkiller), S (switching cost, where higher means easier), D (defensibility), and T (testability), summed to a total with a threshold of 8. Nothing was dropped below the threshold; the record says so explicitly and keeps V2 in the log as the long-horizon item despite the lowest total (10) (internal record).

Scoring ideas against a shared set of criteria before selection is a standard idea-evaluation practice in commercial ideation tooling, which frames a matrix of criteria such as feasibility, impact, and strategic alignment as the objective basis for prioritizing ideas (https://qmarkets.net/resources/article/idea-matrix/, weight 0.30, weakly backed). Practitioner guides similarly describe a standardized evaluation process assessing potential value, feasibility, and risk before investing time (https://ideawake.com/idea-evaluation-process-and-criteria/, weight 0.41, weakly backed) and structured workshop methods for scoring and rating ideas (https://www.ideaclouds.net/resources/workshop-methods/idea-evaluation-methods/, weight 0.39, weakly backed). These commercial sources are practitioner marketing-adjacent pages, so their backing is weak; the load-bearing evidence for the method is the internal record itself plus the academic design-space-exploration literature above.

## Outlier justifications are part of the scoring

The record does not treat the raw numbers as self-explanatory. It attaches explicit outlier justifications: V4 got P=5 because the recurring pain in the program is claims outrunning evidence (a retracted z=-45.8 result, templated patches in PR #202, an unexecuted null), and a map that refuses to draw an edge without a passing certificate attacks that pain directly. V4 got D=5 because nobody else has a Lean-anchored corpus-audit tool. V2 got T=1 because browser-side score-based diffusion training needs kernel-smoothed targets first, months of work before the first honest number. V5 got D=1 because a static visualization can be rebuilt by anyone in an afternoon (internal record).

## What this structure buys

Three properties fall out of the generate-then-score shape. First, coverage: forcing lenses guarantees at least one variation per dimension family, which is the same rationale the DSE literature gives for systematic enumeration (https://dl.acm.org/doi/10.1145/3647640, weight 0.81). Second, comparability: a single 4-axis scale makes 7 heterogeneous designs comparable, the same job an idea matrix does for a business (https://qmarkets.net/resources/article/idea-matrix/, weight 0.30, weakly backed). Third, auditability of taste: outlier justifications turn a number into an argument, which is what let the session fold V1 into V4, demote V3 to a deployment target, and defer V6 to a v2 channel rather than treat the totals as final (internal record).

## Generation-log discipline

The record closes with a generation log: lenses forced, nothing dropped below threshold, and one notable reclassification. The winner's "un-testable bet" (that a median-binarized embedding cloud produces a non-degenerate curveball null) was reclassified as testable and cheap, then pre-registered into the MVP as an explicit SD0 check. That move, converting an assumed risk into a measured gate at design time rather than after deployment, is the session's most transferable practice (internal record).
