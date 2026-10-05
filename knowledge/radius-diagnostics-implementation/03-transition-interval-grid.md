# 03: The fixed diagnostic grid and transition intervals

Scope: the fixed grid 0.075, 0.085, 0.095, 0.105, 0.115; maximal same-delta and same-sign intervals containing the operative radius 0.095 within domain [0,2]; right-endpoint cells instead of midpoints; and the explicit brackets, domain endpoints and named witnesses that make the intervals auditable.

## Why a fixed grid

A step function like I(r) is fully determined by its jumps, but reporting every jump is noisy and comparing two profiles needs a common set of evaluation points. The diagnostic therefore evaluates on a fixed grid of five radii: 0.075, 0.085, 0.095, 0.105, 0.115. The operative radius 0.095 sits at the centre. Because the grid is fixed, attempts to set a different grid are rejected (doc 05); a diagnostic with a movable grid is a different instrument between runs and cannot be compared honestly.

The fixed-grid pattern has strong precedent in threshold-sweep statistics. Automated step-change detection research evaluates across a sweep of thresholds precisely so that changes are located between evaluation points rather than asserted at one (source: https://ieeexplore.ieee.org/document/11008635 , jev weight 0.87). The general step-function structure is standard: a function that is piecewise constant, with each constant subfunction defined on an interval, and intervals distinguished by their endpoints (source: https://en.wikipedia.org/wiki/Step_function , jev weight 0.24, weak backing).

## Transition intervals

Between consecutive grid points the count can stay flat, change by a fixed delta, or change sign of its slope. The diagnostic reports, for each maximal interval:

1. A same-delta interval: a maximal stretch of the sweep on which the count changes by the same amount per grid step.
2. A same-sign interval: a maximal stretch on which the count moves in one direction (monotone increase or decrease) even if the delta magnitude varies.

The reported intervals are required to contain 0.095 and are bounded within the domain [0,2]. Brackets are explicit: an interval states whether its endpoints are included. Domain endpoints are explicit too, because an interval that runs into the domain edge is a different animal from one bounded by an actual transition on both sides.

The maximal-interval requirement is what makes the report canonical: two observers computing intervals from the same profile get the same intervals, because "maximal" pins down the boundaries. Without it, interval reporting would be a matter of taste.

## Right-endpoint cells, not midpoints

Each grid cell spans from one grid value to the next, for example 0.095 to 0.105. A natural-seeming convention is to treat the cell as its midpoint, 0.100. The diagnostic rejects this and uses the right endpoint instead. The reason is floating point: the midpoint between two adjacent representable Float64 values can round onto the excluded left boundary of the cell, which would attribute a count to the wrong cell. Adjacent Float64 breakpoints are close enough that the midpoint hazard is a live case, not a theoretical one (doc 04 details the rounding mechanics).

The endpoint-versus-midpoint choice is a recognized modeling decision in other threshold-based domains. Life-cycle assessment distinguishes midpoint and endpoint approaches systematically, and the choice changes results (source: https://link.springer.com/article/10.1007/s11367-014-0743-0 , jev weight 0.69); the midpoint/endpoint comparison recurs in green-building rating methods with the same structure (source: https://www.sciencedirect.com/science/article/pii/S0959652618302452 , jev weight 0.62). The lesson generalizes: pick the convention deliberately, document it, and keep it fixed.

For the radius diagnostic the choice is not aesthetic. With right-endpoint cells, a cell's reported value is the count at its right endpoint, which is conservative in the isolation sense: it never claims more isolation inside the cell than the count at the cell's upper edge supports. A midpoint convention has no such directionality and additionally carries the rounding hazard.

## Brackets, witnesses, and the 8-witness cap

Three reporting obligations make each transition interval auditable:

1. Correct bracketing. Each interval states its bracket explicitly, for example (0.085, 0.095] style semantics mapped onto the grid, with included and excluded endpoints distinguished. This matters because reporting convention for intervals determines how a reader interprets the boundary; interval-notation references make the include/exclude distinction the core of bracket semantics (source: https://www.mathsisfun.com/sets/intervals.html , jev weight 0.31, weak backing).
2. Explicit domain endpoints. Where an interval touches 0 or 2, that fact is stated rather than implied.
3. Named witnesses. Each interval endpoint lists the items whose clearances sit exactly at or immediately inside the boundary, with at most 8 shown plus total/shown counts when more exist. Full item names are preserved so a reviewer can trace any witness back to the corpus. Witness lists are how a bracket claim becomes checkable: the reader can verify that the named items do sit at the boundary.

The cap exists to keep payloads bounded and the UI readable while the totals preserve the full picture. Witness caps, adjacency at Float64 breakpoints, and strict ties are exactly the cases the test suite exercises (doc 09).

## What the intervals do not mean

The transition intervals are properties of the computed Float64 counts on the fixed grid. They are not statistical confidence intervals: no distributional assumption is involved and no probability statement is being made (source: https://ieeexplore.ieee.org/document/11008635 , jev weight 0.87, for the step-change framing that the detection target is a change in the signal, not an uncertainty band). They are also not exact-arithmetic proofs: the brackets are correct relative to the computed distances, and error bounds on the distances themselves remain caller assumptions (doc 05).

## Summary

1. The grid is fixed at 0.075, 0.085, 0.095, 0.105, 0.115 with the operative radius at the centre; attempts to move it are rejected.
2. Transition reporting uses maximal same-delta and same-sign intervals containing 0.095 within domain [0,2], with explicit brackets and domain endpoints.
3. Cells use their right endpoint because a Float64 midpoint can round onto the excluded left boundary.
4. Named witnesses, capped at 8 shown with total/shown counts, make each boundary claim traceable to specific corpus items.

Project record: the motivating implementation ships these intervals, brackets and witness caps in its radius diagnostics module, per https://github.com/yubi-OS/yubiOS/pull/233 .
