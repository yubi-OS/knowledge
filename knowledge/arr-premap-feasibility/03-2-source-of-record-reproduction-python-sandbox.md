# 03. Source-of-record reproduction (Python, sandbox)

**Scope:** 2. Source-of-record reproduction (Python, sandbox): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md, no external web dig

## Why reproduce first

Before testing the deployed JavaScript against anything, the check confirmed that the Python source of record still produces the numbers in the arrangement-response record. If the reference itself had drifted, every later comparison would be comparing against a moving target.

## What was staged

The following files were staged unchanged from main:

- tools/lens-standard/lens_standard.py
- tools/lens-standard/arrangement_warp.py
- tools/spectral-standard/centroid_walk.py
- tools/spectral-standard/spectral_standard.py
- tools/edge-standard/edge_standard.py

The run script was work/py/repro.py, with all evidence generated under session/arr-premap/work/ and session/arr-premap/fresh/.

## Results

| Quantity | Record (ARRANGEMENT-RESPONSE) | Reproduced |
|---|---|---|
| Clean d_w (W 4096, K 4, spread, seed 42) | 2.7812 | 2.781185 (r2 0.98859) |
| astig 0.1 dD_w | -0.0528 | -0.0528 |
| Delaunay edges, clean | not recorded | 1025 |

**Verdict: the source of record reproduces.**

## Reading the parameters

- **W 4096**: the number of walkers.
- **K 4**: a walk configuration parameter recorded with the clean d_w.
- **spread**: the start-placement mode for walkers.
- **seed 42**: the fixed random seed that makes the walk deterministic.

Pinning all four is what lets a reproduction match to four decimals. The record gave 2.7812; the reproduction gave 2.781185, which rounds to the same value. The fit quality r2 0.98859 shows the MSD scaling used to extract d_w is close to a clean power law over the fitted window.

The astig 0.1 arm response dD_w reproduced exactly at -0.0528. That is the walk-exponent change when the arrangement is warped with 0.1 astigmatism.

## The new number: 1025 edges

The record never stated how many Delaunay edges its graph had. The reproduction recorded it: 1025 on the clean 366-point gasket. That number turned out to matter more than anything else in the reproduction:

- The deployed JS graph returned 1031 edges on the same points (doc 04).
- The addendum's independent check found 1014 forced edges (pairs with an open empty-circle interval, which every valid triangulation must contain) plus 50 degenerate candidates. The Python graph missed 14 of the 1014 forced edges.
- The canonical exact graph built later by lane A2 returned 1039 edges, matching the Euler count and containing every forced edge.

So the reproduction faithfully reproduced a graph that was itself incomplete. Reproduction confirms consistency with the record, not correctness of the record.

## Lane A2's later confirmation

The addendum reports that lane A2 also reproduced the record on the recorded graphs, with a deviation of 5e-5. This second, independent reproduction agrees with the first: the Python pipeline is internally consistent.

## The canonical graph changes the anchor

Under the canonical complete graph, the clean d_w is 2.8971 rather than the record's 2.7812, a shift of about 0.116. The adoption record later measured the deployed walk moving from 2.765024 (JS, incomplete) to 2.897099 (canonical) on the same 366 centres. The source-of-record anchor of 2.7812 therefore belongs to the incomplete-graph instrument.

## Input-order sensitivity

The addendum adds one more caution relevant to any reproduction: input ordering. Four orderings give clean d_w from 2.853 to 2.911 and trefoil dD_w from +1.51 to +1.65. The source calls this real and not gated. A reproduction that matches only because it used the same input order as the record is weaker evidence than it looks; the ordering should be pinned and recorded alongside seed and walker count.

## What the reproduction establishes

| Claim | Status |
|---|---|
| Python pipeline reproduces the record | Yes, to 4 decimals on d_w and dD_w |
| Record's edge count | Now known: 1025 |
| Record's graph is complete | No, 14 forced edges missing (addendum) |
| Record's d_w is the canonical value | No, canonical is 2.8971 |
| Order-invariant | No, 2.853 to 2.911 across 4 orderings |

## Why this step belongs in every feasibility check

It is cheap, it isolates drift in the reference from drift in the port, and in this case it surfaced the edge count that made the graph defect visible. Without the 1025 figure, the JS-vs-Python edge diff in doc 04 would have had nothing to compare against.
