# 01-0-what-is-where

**Scope.** 0. What is where: detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-integration-2026-10-16.md.

> Ground source: yubi-OS/yubiOS refs/arr-premap-integration-2026-10-16.md. External dig queries: cross-language numerical parity Python JavaScript IEEE 754; covariance matrix eigendecomposition 2x2 closed form.

## Where the integration output lives

The ground source (yubi-OS/yubiOS refs/arr-premap-integration-2026-10-16.md) opens with an inventory table, because an integration report is only auditable if every artifact it cites can be found. The build was session-only, with no worker, KV, D1, GitHub, or Cloudflare call, and offline runs only on Node 24.20.0 and Python 3.14.7. The output root is `session/subagent/arr-premap/advisor/`. The advisor did not write the build-root copy (`session/arr-premap/build/`) because its write scope is `session/subagent/` only; the lead copies the advisor root across.

| Path under advisor/ | Role |
|---|---|
| `lane-a1/`, `lane-a2/`, `lane-b1/`, `lane-b2/` | Unchanged lane copies, each with `manifest.sha256`, verified identical with `diff -r` |
| `worker-candidates/shared/disks.js` | The single renderDisksFloat, forwardPoint, gasketSites, gasketTemplate (SPEC section 5), tested by `shared/disks.test.mjs` |
| `worker-candidates/arrangement/` | Line A candidate; arrangement.js imports the shared helpers |
| `worker-candidates/premap/` | Line B candidate: premap.js, premap-route.js, harness_premap.mjs, PREREG with section 8 amendment log, two new test files |
| `worker-candidates/glue/jev-arr-glue.js` | Deps builders for the two routes |
| `worker-candidates/routes/jev-corpus-routes.js` and `PATCH-routes.diff` | Patched reference copy and diff; `git apply --check` passes; NOT applied |
| `worker-candidates/parts-staging/` | 60 deployed parts plus 7 new or changed parts, for an offline import check |
| `worker-candidates/DEPLOY-CHECKLIST.md` | Deploy checklist, NOT EXECUTED, Delaunay section first |
| `results/premap-results-2026-10-16.json` | The single frozen harness run |
| `analysis/`, `exploratory/`, `logs/` | T2, T6, T9 analysis; pre-declared T7 and T8 readings (sha256 75e0ef22...); every cited log |
| `staged-inputs.sha256` | Hashes of the staged JS and Python sources of record |

## Cross-language parity is the spine of the inventory

Most rows in that table exist to support one claim: a JS candidate and a Python reference compute the same thing. The raster parity check hashes canonical '1'/'0' rows with sha256 and requires identical hashes across Python and three JS copies. The walk parity question (A2) requires identical Delaunay edge sets. Bitwise agreement between languages is plausible because JavaScript numbers are IEEE 754 double-precision values, a point raised in the Stack Overflow thread at [Floating point number in JavaScript (IEEE 754) - Stack Overflow](https://stackoverflow.com/questions/55280847/floating-point-number-in-javascript-ieee-754) (clef weight: 0.0314) (weak backing, clef weight < 0.5); Python floats are also doubles on standard builds, though that second fact is not covered by any dig result. Libraries such as [GitHub - jarvma18/js-ieee754: Javascript IEEE-754 converter](https://github.com/jarvma18/js-ieee754) (clef weight: 0.1622) (weak backing, clef weight < 0.5) convert between JavaScript numbers and IEEE 754 binary forms, and [Encoding and decoding IEEE 754 floats in JavaScript](https://stackoverflow.com/questions/3740853/encoding-and-decoding-ieee-754-floats-in-javascript) (clef weight: 0.0775) (weak backing, clef weight < 0.5) discusses encoding and decoding floats in Node. All three are weak backing. The record's own evidence is stronger than any of them: hash-identical rasters on 7 sets with 0 pixel diffs, and the walk ladder check that returns the same clean d_w (2.8970993450106555) from both the default and the explicit pinned ladder.

## Rounding is where parity usually breaks

The record documents two rounding conventions. A1 rounds walk inputs with `Math.round(x*1e4)/1e4`; A2 uses exact half-even rounding. These differ only on exact ties, and A2 found no exact tie in the six walk sets, so no change was needed. This is the kind of detail an inventory has to carry: two implementations can agree on every tested input while differing in principle.

## Covariance and the 2x2 eigenproblem

The seed query for this doc asked about the closed-form eigendecomposition of a 2x2 covariance matrix, which is the standard way to get principal axes of a 2D point cloud. A covariance matrix gives the covariance between each pair of variables, per [Covariance matrix - Wikipedia](https://en.wikipedia.org/wiki/Covariance_matrix) (clef weight: 0.2005) (weak backing, clef weight < 0.5), and covariance is positive when variables move together, per [Covariance - Wikipedia](https://en.wikipedia.org/wiki/Covariance) (clef weight: 0.1371) (weak backing, clef weight < 0.5). Eigendecomposition factors a diagonalizable matrix into eigenvectors and a diagonal matrix of eigenvalues, per [Eigendecomposition of a matrix - Wikipedia](https://en.wikipedia.org/wiki/Eigendecomposition_of_a_matrix) (clef weight: 0.2814) (weak backing, clef weight < 0.5). Lecture notes on eigenvalues and within-group covariance appear at [PDF Multivariate Analysis Lecture 8: Eigenvalues, Covariance Matrices, and ...](https://yu-zhaoxia.github.io/teaching-multivariate/Lecture08.pdf) (clef weight: 0.2565) (weak backing, clef weight < 0.5). The question of a closed form for 2x2 eigenvectors, including the c = 0 edge case, is raised at [Is there a closed form expression for the eigenvectors of a 2x2 matrix?](https://math.stackexchange.com/questions/4103294/is-there-a-closed-form-expression-for-the-eigenvectors-of-a-2x2-matrix) (clef weight: 0.0471) (weak backing, clef weight < 0.5). The integration record itself does not compute covariance eigenvectors; arm warps are defined as astigmatism, trefoil, and spherical aberrations rather than as covariance changes. These citations are context for future registration work, which the record names as the first open gate.

## Off-topic results

[Cross - Wikipedia](https://en.wikipedia.org/wiki/Cross) (clef weight: 0.0211) (weak backing, clef weight < 0.5) (the geometric cross) and [bit manipulation - Checking parity of a number in Python](https://stackoverflow.com/questions/57548852/checking-parity-of-a-number-in-python) (clef weight: 0.0422) (weak backing, clef weight < 0.5) (bit parity of an integer) were matched on the words "cross" and "parity" and carry no claim.

## Why the inventory matters

Three rows in the inventory are marked as not done: the routes patch is not applied, the deploy checklist is not executed, and the build-root copy is not written. Placing those statuses next to the artifacts makes the report honest by construction. A reader cannot mistake a checked patch for a deployed one, because the inventory says which is which.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Encoding and decoding IEEE 754 floats in JavaScript | https://stackoverflow.com/questions/3740853/encoding-and-decoding-ieee-754-floats-in-javascript | 0.0775 | weak (< 0.5) |
| 2 | Floating point number in JavaScript (IEEE 754) - Stack Overflow | https://stackoverflow.com/questions/55280847/floating-point-number-in-javascript-ieee-754 | 0.0314 | weak (< 0.5) |
| 3 | GitHub - jarvma18/js-ieee754: Javascript IEEE-754 converter | https://github.com/jarvma18/js-ieee754 | 0.1622 | weak (< 0.5) |
| 4 | Cross - Wikipedia | https://en.wikipedia.org/wiki/Cross | 0.0211 | weak (< 0.5) |
| 5 | bit manipulation - Checking parity of a number in Python | https://stackoverflow.com/questions/57548852/checking-parity-of-a-number-in-python | 0.0422 | weak (< 0.5) |
| 6 | Eigendecomposition of a matrix - Wikipedia | https://en.wikipedia.org/wiki/Eigendecomposition_of_a_matrix | 0.2814 | weak (< 0.5) |
| 7 | Covariance - Wikipedia | https://en.wikipedia.org/wiki/Covariance | 0.1371 | weak (< 0.5) |
| 8 | Is there a closed form expression for the eigenvectors of a 2x2 matrix? | https://math.stackexchange.com/questions/4103294/is-there-a-closed-form-expression-for-the-eigenvectors-of-a-2x2-matrix | 0.0471 | weak (< 0.5) |
| 9 | Covariance matrix - Wikipedia | https://en.wikipedia.org/wiki/Covariance_matrix | 0.2005 | weak (< 0.5) |
| 10 | PDF Multivariate Analysis Lecture 8: Eigenvalues, Covariance Matrices, and ... | https://yu-zhaoxia.github.io/teaching-multivariate/Lecture08.pdf | 0.2565 | weak (< 0.5) |
