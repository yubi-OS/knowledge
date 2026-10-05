# The isolate count as a corpus instrument

> Scope: the isolate count I(r) at canonical radius 0.095 as the wayfinder program's core instrument: its definition, the maps 66 to 76 audit, and what prediction grading does and does not show.

## The instrument

The wayfinder program embeds a document corpus as points on a sphere and studies the graph formed by joining points closer than a radius r. A radius-neighbor graph is the standard construction: every pair of points whose distance falls within the radius is joined, and a point with no neighbor inside the radius is an isolate ([scikit-learn radius_neighbors_graph](https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.radius_neighbors_graph.html), weight 0.80). Point-pattern analysis has long treated isolation and nearest-neighbour distance as first-class summaries of a point configuration ([pythongis nearest neighbour analysis](https://pythongis.org/part2/chapter-06/nb/07-nearest-neighbour.html), weight 0.52).

The implemented graph uses a strict edge test d < r. An item is isolated at radius r when its nearest-neighbour clearance c_i satisfies r <= c_i, and a tie at r = c_i still counts as isolated. The canonical radius is 0.095, and the research-phase record keeps it fixed: no post hoc best-scoring radius is selected.

The [yubi-OS/yubiOS repository](https://github.com/yubi-OS/yubiOS) carries the program's code and records (weight 0.77). Relevant artifacts include the [wayfinder audit trail](https://github.com/yubi-OS/yubiOS/blob/main/refs/wayfinder-audit-2026-09-09.md) (weight 0.72), the [WayfinderBounds.lean](https://github.com/yubi-OS/yubiOS/blob/main/papers/data/lean/WayfinderBounds.lean) verification file (weight 0.51), and the [point-map tool README](https://github.com/yubi-OS/yubiOS/blob/main/tools/point-map/README.md) describing the real 301x24 re-embedding fixture (weight 0.50).

## The maps 66 to 76 audit

The September 2026 research-phase record ([round-three results](https://github.com/yubi-OS/yubiOS/blob/e4be4854764f3217eaab08c01f15e62d5509e3ec/refs/wayfinder-round3-results-2026-09-13.md), program record) retrieved all eleven stored maps 66 through 76 from the live map API (https://steady-orbit.systems-a.workers.dev/api/maps/66 through https://steady-orbit.systems-a.workers.dev/api/maps/76) and recomputed every isolation count from full-precision coordinates rather than trusting stored summaries. Its audit findings:

- Final map 76 has 176 items, 64 isolates, and V2 = 0.31855.
- All maps use frame a045c8d3f4ff939b, and all shared points have exactly zero coordinate movement across the trail.
- At radius 0.095 the total count rises from 61 of 168 to 64 of 176; the isolated fraction changes only slightly.
- [PR 232](https://github.com/yubi-OS/yubiOS/pull/232) is merged at commit e4be4854764f3217eaab08c01f15e62d5509e3ec, the inspected main HEAD, and the latest green lean-check run predates the merge commit, so it is not mislabeled as a run on PR 232's own code (program record).

## Prediction grading

The runtime trail contains eight ADDs and two source-text CHANGEs; one CHANGE has a recorded generic-rung prediction, one is described as a verification edit without one. Generic rung predictions were exactly correct on 5 of 8 ADDs, and on 5 of 9 across all nine recorded predictions (program record). The record draws the right boundary: a correctly predicted +1 isolate is an instrumentation success, not automatically a quality improvement. Exact post-preview ledgers and independently graded task quality remain separate endpoints.

## Census labels need wording fixes, not a recount

The isolate census ([isolate census record](https://github.com/yubi-OS/yubiOS/blob/e4be4854764f3217eaab08c01f15e62d5509e3ec/refs/wayfinder-round3-isolate-census-2026-09-13.md), program record) holds 66 class entries but only 62 unique documents, with four cross-class duplicates. The unique-name set matches the 62 map-74 isolates exactly. The record concludes that the "one class per doc" wording needs correction, not the underlying isolate count.

## What this doc does not claim

I(0.095) is a descriptive statistic of the frozen frame. The radius profile and corpus size belong beside the single count (see the sensitivity doc), and no physical or thermodynamic claim follows from the instrument itself.
