# Bounded-coordinate robustness of the isolate instrument

> Scope: what happens to the isolate count and the radius profile when coordinates move by bounded amounts: the epsilon bounds, edge and nonedge stability conditions, the continued-isolation guarantee, and how this connects to the robust-geometric-predicates literature.

## The perturbation bounds

The research-phase record ([round-three results](https://github.com/yubi-OS/yubiOS/blob/e4be4854764f3217eaab08c01f15e62d5509e3ec/refs/wayfinder-round3-results-2026-09-13.md), program record) states the bounded-coordinate problem directly. If point displacements satisfy ||dp_i|| <= eps_i, then the pairwise distance changes by at most

```
|d'_ij - d_ij| <= eps_i + eps_j
```

From this triangle inequality, two stability conditions follow (program record):

- An edge is stable when d_ij + eps_i + eps_j < r. A strict inequality preserves the edge under any displacements within the bounds.
- A nonedge is stable when d_ij - eps_i - eps_j >= r. The strict and equality cases are distinct, and the distinction matters at thresholds.
- With a common bound eps, c_i >= r + 2 eps guarantees continued isolation of item i.

The record is careful about scope: these are conditional metric bounds. Real floating-point error allowances and the displacement bound itself must be justified separately; the inequalities do not justify themselves.

## Why this discipline matters

Nearest-neighbor structures are famously unstable under coordinate noise: membership of the graph can change under small perturbations of the underlying points, which is the motivating observation of recent stability work on nearest-neighbor forecasts ([Finite and Dynamic Stability Horizons for Nearest-Neighbor Future Prediction](https://arxiv.org/html/2609.25779v1), weight 0.28, weakly backed). The graph-neural-network literature studies the same fragility from the learning side, deriving stability bounds for graph convolutions under relative perturbations ([Stability of Graph Neural Networks to Relative Perturbations](https://ieeexplore.ieee.org/document/9054341), weight 0.65) and improved stability bounds for graph convolutional networks ([Improved Stability Bounds for Graph Convolutional Neural Networks](https://ieeexplore.ieee.org/document/10806975), weight 0.63). The wayfinder instrument responds to the same fragility with exact interval mathematics rather than with retraining or averaging.

## The robust-predicates tradition

There are two standard responses to floating-point fragility in geometric computation. One is exact or adaptive-precision predicates: Jonathan Richard Shewchuk's robust adaptive floating-point geometric predicates compute orientation and incircle tests exactly for radix-2 floating-point inputs, including machines compliant with IEEE 754 ([Robust Adaptive Floating-Point Geometric Predicates](https://people.eecs.berkeley.edu/~jrs/papers/robust-predicates.pdf), weight 0.83), with the companion paper on adaptive precision arithmetic giving the error bounds ([Adaptive Precision Floating-Point Arithmetic and Fast Robust Geometric Predicates](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf), weight 0.88). The approach is summarized and its reference implementation catalogued on the CMU page ([Fast Robust Predicates for Computational Geometry](https://www.cs.cmu.edu/~quake/robust.html), weight 0.66) with modern ports such as [georust/robust](https://github.com/georust/robust) (weight 0.60) and [dengwirda/robust-predicate](https://github.com/dengwirda/robust-predicate) (weight 0.76).

The radius instrument takes the second response: rather than making every predicate exact, it computes the exact breakpoints where answers can change and reports margins as real numbers. The two approaches are complementary; epsilon bounds answer "can this verdict flip", exact predicates answer "which verdict is correct at these exact coordinates".

## Verification evidence in the record

The record's own verification of these claims (program record):

- 20,000 bounded pair perturbations passed, plus 10,201 integer rectangle identities, including cases at threshold equality.
- The radius intervals reproduce all ten stored transitions between maps 66 and 76.
- The intervals are invariant under row reordering of the coordinate matrix.
- Independent finite-periodic-system checks for the related Ginzburg-Landau identity work gave maximum relative identity error 5.10e-16 (see the GL correction doc).

Float-to-integer and metric correspondence remain separate obligations in the record's implementation path; the perturbation analysis does not discharge them.
