# Exact radius mathematics: clearance, profile and clipped integral

> Scope: the nearest-neighbour clearance c_i, the antitonic step profile I(r), the clipped integral S_R, exact breakpoints, and per-edit stability intervals that make the radius instrument exact instead of grid-sampled.

## The clearance definition

For a point p_i on the frozen sphere, the nearest-neighbour clearance is

```
c_i = min_{j != i} ||p_i - p_j||_2
```

Because the implemented graph uses the strict edge test d < r, the isolation indicator at radius r is

```
I(r) = sum_i 1[r <= c_i]
```

Nearest-neighbour distances on spherical surfaces are a studied object in their own right; the distribution of nearest-neighbour and contact distances for a binomial point process on a sphere is derived analytically in [Nearest Neighbor and Contact Distance Distribution for Binomial Point Process on Spherical Surfaces](https://ieeexplore.ieee.org/document/9177073) (weight 0.87). Nearest-neighbour methods treat these distances as the basic statistic of a point configuration ([Nearest neighbor methods, Iowa State University](https://pdixon.stat.iastate.edu/stat406/NearestNeighbor.pdf), weight 0.68).

## Three exact consequences

The research-phase record ([round-three results](https://github.com/yubi-OS/yubiOS/blob/e4be4854764f3217eaab08c01f15e62d5509e3ec/refs/wayfinder-round3-results-2026-09-13.md), program record) draws out the consequences of computing I(r) from clearances rather than from a radius grid:

1. I(r) is non-increasing as r increases. Antitonicity is structural, not a sampling artifact.
2. An item is isolated on the closed interval [0, c_i]. A tie at r = c_i remains isolated, so interval endpoints are exact, not fuzzy.
3. The profile is a step function, so exact breakpoints are available without radius-grid optimization. Jump detection on monotone step functions is a solved algorithmic problem ([An optimal algorithm for finding all the jumps of a monotone step-function](https://www.sciencedirect.com/science/article/pii/0196677485900434), weight 0.69).

This replaces the standard practice of evaluating a statistic on a parameter grid and hoping the grid brackets the interesting behavior ([MATLAB waveform analysis parameters and thresholds](https://www.mathworks.com/help/signal-integrity/ug/waveform-analysis-parameters-and-thresholds.html), weight 0.84, describes the grid-and-threshold idiom for signals). The clearance formulation removes the grid from the mathematics entirely.

## The clipped integral S_R

The clipped integral of the profile is

```
S_R = ∫_0^R I(r) dr = sum_i min(R, c_i)
```

Three cautions from the record (program record):

- S_R has distance units. It is not I(r), not a free energy, and not a confidence score.
- Report both S_R and S_R/N when corpora of different sizes are compared, since the raw sum scales with item count.
- Squared-distance variants require a squared-radius variable throughout; units cannot be mixed between the two conventions.

## Exact stability intervals for actual edits

From the union of before and after clearance breakpoints, ΔI(r) is constant on intervals of the form (left, right]. The local implementation recovered these maximal intervals containing r = 0.095 (program record):

| Cycle | ΔI(.095) | Same-delta, same-sign interval (chord units) |
|---|---:|---|
| 4 | -1 | (0, 0.1017510391] |
| 6 | -1 | (0.0945581803, 0.2536978734] |
| 9 | +1 | [0, 0.0959283949] |
| 10 | +1 | [0, 0.1041970168] |

Cycle 6's negative reading sits only 0.00044182 above its lower boundary; cycle 9's positive reading sits only 0.00092839 below its upper boundary. These are exact frozen-coordinate parameter clearances. They are not statistical uncertainty intervals and not pre-edit forecasts.

A preview can display this information before the user applies a candidate to the repository, because the candidate has already been embedded when it reaches preview. The record's display rule: preserve the canonical r = 0.095 count and show the sensitivity beside it.
