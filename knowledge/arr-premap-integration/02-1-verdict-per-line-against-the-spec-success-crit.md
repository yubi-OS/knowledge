# 02-1-verdict-per-line-against-the-spec-success-crit

**Scope.** 1. Verdict per line against the SPEC success criteria (SPEC section 7): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-integration-2026-10-16.md.

> Ground source: yubi-OS/yubiOS refs/arr-premap-integration-2026-10-16.md. External dig queries: Delaunay triangulation deterministic tie-breaking; software integration testing regression anchor.

## The SPEC section 7 success criteria

The ground source (yubi-OS/yubiOS refs/arr-premap-integration-2026-10-16.md) evaluates each line against the success criteria in SPEC section 7 and gives a verdict per line plus one for the advisor itself.

## Line A: arrangement-response-v1

| Criterion | Result | Evidence |
|---|---|---|
| JS D leg reproduces the record for every arm to 4 dp | PASS | clean 1.558937; astig 0.1 1.5124136; astig 0.2 1.4492639; trefoil 1e-4 1.5108395; trefoil 1.5e-4 1.4908528; spherical 0.06 1.5327455 |
| Pixel arm reproduces Lane F | PASS | pixel dD -0.094016, -0.275691, -0.050175, -0.092404, -0.024446 |
| Raster parity, Python and JS hash identical | PASS | 7 sets, 0 pixel diffs |
| Route, validation, gates implemented | PASS | A1 suite 51 pass, 0 fail, 6 todo |
| Canonical edge parity JS to Python (A2) | PASS, lane-reported | 33 of 33 sets; advisor reran A2 Python selftest (48/48) and JS tests (13/13), not the 33-set script |
| Gap tests reported honestly | PASS | 6 todo tests kept as todo |
| Walk leg reproduces the record | NOT MET | Walk verdicts depend on the deployed Delaunay defect; under the canonical graph A1 fails on all four gated arms |

**Verdict:** GO for the D leg, the pixel arm, the raster, and the route. HOLD for the walk leg until Jenny decides the Delaunay question.

## Line B: premap-v1

| Criterion | Result |
|---|---|
| Template parity 6 of 6 | PASS: counts 3, 6, 15, 42, 123, 366, each nesting in the next, ordered output equal to staged genGasket |
| P1, P1n, P2, P3, P4 reported, no silent nulls | PASS: no error rows, every verdict has its count |
| Identity frame only, no claim about real arrangements | PASS: scope stated in the PREREG |

**Verdict:** PASS for the identity-frame gold MVP. Registration for real data is the first open gate.

The template counts follow the gasket recursion: from depth 2 onward each count is 3 times the previous count minus 3 (3 x 6 - 3 = 15, 3 x 15 - 3 = 42, 3 x 42 - 3 = 123, 3 x 123 - 3 = 366), consistent with shared corner sites between sub-triangles.

## Advisor

All suites green (Node 290 pass, 0 fail, 6 todo; Python A2 selftest 48 pass), integration report and deploy checklist written, nothing deployed.

## Why the walk leg is the only NOT MET

The walk leg runs on a Delaunay graph. A Delaunay triangulation subdivides the convex hull of a point set into triangles whose circumcircles contain no other points, per [Delaunay triangulation - Wikipedia](https://en.wikipedia.org/wiki/Delaunay_triangulation) (clef weight: 0.5260), the only dig result at or above 0.5 for this doc. The MIT 6.838 handout notes that some sets of more than 3 points may lie on the same circle, forming empty convex polygons that can be triangulated in more than one way, per [PDF Delaunay Triangulations](https://people.csail.mit.edu/indyk//6.838/handouts/lec9.pdf) (clef weight: 0.2021) (weak backing, clef weight < 0.5). That is exactly the degeneracy the record measures: on the clean 366-droplet gasket, 1014 pairs are forced and 50 are degenerate candidates, and the choice among degenerate triangulations is where implementations diverge. The TU Wien thesis chapter surveys construction algorithms (divide-and-conquer, sweepline, incremental), per [5. Delaunay Triangulation - TU Wien](https://www.iue.tuwien.ac.at/phd/fleischmann/node41.html) (clef weight: 0.2838) (weak backing, clef weight < 0.5); the deployed code is an incremental Bowyer-Watson variant. A degeneracy-exact construction must break ties deterministically. The record goes further and shows the deployed graph does not only break ties differently: it misses 8 forced edges, which no valid Delaunay triangulation may omit.

## Regression anchors versus integration checks

The SPEC criteria mix two testing ideas. "Reproduces the record to 4 dp" is a regression check: does the new candidate reproduce previously recorded values? "Route, validation, gates implemented" and "edge parity JS to Python" are integration checks: do separately built parts agree and compose? Industry comparisons draw this line, describing integration testing as checking how parts work together and regression testing as checking whether a change broke something that worked, per [Regression Testing vs Integration Testing: Key Differences](https://www.functionize.com/automated-testing/regression-testing-vs-integration-testing) (clef weight: 0.1292) (weak backing, clef weight < 0.5). Similar framing appears in [Regression Testing Vs Integration Testing: In-Depth Comparison](https://testsigma.com/blog/integration-testing-vs-regression-testing/) (clef weight: 0.1354) (weak backing, clef weight < 0.5), [Regression Testing - Software Engineering - GeeksforGeeks](https://www.geeksforgeeks.org/software-engineering/software-engineering-regression-testing/) (clef weight: 0.1329) (weak backing, clef weight < 0.5), [Difference Between Regression and Integration Testing](https://www.softwaretestingo.com/regression-and-integration-testing/) (clef weight: 0.0777) (weak backing, clef weight < 0.5), and [Regression Testing Vs Integration Testing - The Difference](https://www.globalapptesting.com/blog/regression-testing-vs-integration-testing) (clef weight: 0.0709) (weak backing, clef weight < 0.5). All are vendor blog posts, all weak backing, and they add vocabulary only. The record's practice is stricter than any of them: regression anchors are pinned to explicit numbers (A4 walk anchor 2.7812 plus or minus 0.10, A5 D anchor 1.558937 plus or minus 1e-4), and a failed anchor is reported, not re-anchored.

## A regression anchor that does not reproduce

The most instructive finding is the record's per-arm reading. The original record says "astig fails, trefoil passes". On the recorded JS graph all four gated arms pass; on the canonical graph all four fail. Neither graph reproduces the original reading. A regression anchor that cannot be reproduced on any available implementation is evidence that the anchor was itself implementation-dependent, which is why the walk leg goes to HOLD rather than to FAIL or PASS.

## Off-topic results

[Old Man Kissing Porn Pics & Naked Photos - PornPics.com](https://www.pornpics.com/?q=old+man+kissing) (clef weight: 0.0350) (weak backing, clef weight < 0.5) is an off-topic adult-content result and [Delaunay Triangulation (Geometry Nodes Tutorial) - YouTube](https://www.youtube.com/watch?v=HyW54cI8Qdo) (clef weight: 0.0979) (weak backing, clef weight < 0.5) is a Blender geometry-nodes video tutorial. Neither carries any claim.

## Reading the verdicts together

The split verdict on Line A is the key output. GO and HOLD sit side by side because the D leg is graph-free and the walk leg is not. The record refuses to let a defect in one leg block the other, and refuses to let a passing leg hide the defect in the other.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Delaunay triangulation - Wikipedia | https://en.wikipedia.org/wiki/Delaunay_triangulation | 0.5260 | authoritative (>= 0.5) |
| 2 | PDF Delaunay Triangulations | https://people.csail.mit.edu/indyk//6.838/handouts/lec9.pdf | 0.2021 | weak (< 0.5) |
| 3 | 5. Delaunay Triangulation - TU Wien | https://www.iue.tuwien.ac.at/phd/fleischmann/node41.html | 0.2838 | weak (< 0.5) |
| 4 | Old Man Kissing Porn Pics & Naked Photos - PornPics.com | https://www.pornpics.com/?q=old+man+kissing | 0.0350 | weak (< 0.5) |
| 5 | Delaunay Triangulation (Geometry Nodes Tutorial) - YouTube | https://www.youtube.com/watch?v=HyW54cI8Qdo | 0.0979 | weak (< 0.5) |
| 6 | Regression Testing Vs Integration Testing: In-Depth Comparison | https://testsigma.com/blog/integration-testing-vs-regression-testing/ | 0.1354 | weak (< 0.5) |
| 7 | Regression Testing - Software Engineering - GeeksforGeeks | https://www.geeksforgeeks.org/software-engineering/software-engineering-regression-testing/ | 0.1329 | weak (< 0.5) |
| 8 | Difference Between Regression and Integration Testing | https://www.softwaretestingo.com/regression-and-integration-testing/ | 0.0777 | weak (< 0.5) |
| 9 | Regression Testing vs Integration Testing: Key Differences | https://www.functionize.com/automated-testing/regression-testing-vs-integration-testing | 0.1292 | weak (< 0.5) |
| 10 | Regression Testing Vs Integration Testing - The Difference | https://www.globalapptesting.com/blog/regression-testing-vs-integration-testing | 0.0709 | weak (< 0.5) |
