# Parameter sensitivity of the isolate count

> Scope: the fixed predeclared radius grid 0.075 to 0.115, the sign reversals across cycles 4, 6, 9 and 10, and why sensitivity to an instrument parameter is not evidence of physical glassiness.

## Why the grid was fixed in advance

The research-phase record ([round-three results](https://github.com/yubi-OS/yubiOS/blob/e4be4854764f3217eaab08c01f15e62d5509e3ec/refs/wayfinder-round3-results-2026-09-13.md), program record) used a local diagnostic at radii 0.075, 0.085, 0.095, 0.105 and 0.115, fixed before the sweep ran, with no best-scoring radius selected afterwards. This mirrors the preregistration discipline used across the sciences: a pre-analysis plan commits the analyst to choices before the data are seen, which defeats post hoc narrative-fitting ([Pre-Analysis Plans in R](https://r-statistics.co/Pre-Analysis-Plans-in-R.html), weight 0.60; [Statistical Analysis Plan template](https://cdn.clinicaltrials.gov/large-docs/42/NCT03112642/SAP_001.pdf), weight 0.73). Sensitivity analysis as a discipline measures how inputs or parameters propagate to outputs and is distinct from uncertainty analysis ([Wikipedia: Sensitivity analysis](https://en.wikipedia.org/wiki/Sensitivity_analysis), weight 0.57; [MATLAB sensitivity analysis](https://www.mathworks.com/help/sldo/sensitivity-analysis.html), weight 0.66).

## The sweep result

The record's sweep of the change in isolate count, ΔI, per added item:

| Cycle | Added item | ΔI(.075) | ΔI(.085) | ΔI(.095) | ΔI(.105) | ΔI(.115) |
|---|---|---:|---:|---:|---:|---:|
| 4 | systemd-v262-refresh | -1 | -1 | -1 | 0 | 0 |
| 6 | adjacent-problems-mirror-provenance | +1 | +1 | -1 | -1 | -1 |
| 9 | round3-isolate-census | +1 | +1 | +1 | -1 | -1 |
| 10 | round3-results | +1 | +1 | +1 | -1 | 0 |

Cycles 6, 9 and 10 reverse sign across the grid; cycle 4 becomes neutral at larger radii (program record). This is sensitivity to an instrument parameter. The record explicitly declines to read it as evidence for physical glassiness or a thermodynamic transition.

## Sensitivity in graph-based pipelines is the norm, not the exception

This result sits inside a broader literature finding. A systematic study of graph-based clustering found that results depend strongly on how the graph is constructed and on its parameters ([A Systematic Study of Graph Construction and Parameter Sensitivity in Clustering](https://inass.org/wp-content/uploads/2025/06/2025093054-2.pdf), weight 0.60). Threshold shifts change conclusions in the same way for other graph statistics ([thresh_shift, Brown University](https://www.dam.brown.edu/people/cklivans/thresh_shift.pdf), weight 0.78). A comparative review of sensitivity-analysis techniques ([arXiv 2506.11471](https://arxiv.org/html/2506.11471v1), weight 0.57) frames local versus global parameter sweeps as standard practice for exactly this kind of instrument audit.

The correct response to parameter sensitivity is not to hide it. The record's design choice is to report the sweep beside the canonical count: the radius profile and corpus size belong beside the single number I(0.095), not beneath it.

## What sensitivity does not license

Three things the record refuses to infer from the sweep (program record):

1. A physical phase transition. A sign reversal on a 5-point radius grid is a property of a finite discrete instrument, not evidence of glassy or thermodynamic behavior.
2. A better radius. Because the grid was predeclared, no radius may be promoted after the fact for scoring better.
3. An improved forecast. Retrospective agreement between sweep outcomes and predictions is not re-labeled as better forecasting; usefulness is evaluated on a fresh, independently graded trial.
