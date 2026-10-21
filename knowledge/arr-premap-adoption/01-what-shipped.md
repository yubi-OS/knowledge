# 01. What shipped

**Scope:** What shipped: detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md.

> Ground source: yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md. External dig: dig_context_01.json (10 Clef-weighted searXNG results).

## Decision

Jenny decided on 2026-10-16 to adopt the exact-predicate Delaunay, deploy it, and merge PR #319 first. PR #319 carried the docs, specs, and the feasibility record; it is merged as squash commit db404b6e. Everything below is from `yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md` unless a dig source is cited.

## The deploy

- **Etag**: eb4862465f3375c35f0a6de776838f9960b8bdd58c88c2935397a4376240510a.
- **Module count**: 61, which is the 60 pre-deploy parts plus one new part.
- **Every other part** is byte-identical to the pre-deploy snapshot.

## Changed parts

| Part | Change |
|---|---|
| jev-spectral-centroid.js | `bowyerWatsonDelaunay` keeps its input contract and return shape but delegates triangulation to jev-delaunay-exact.js. The Bowyer-Watson body is removed. |
| jev-spectral.js | `walkPoints` uses the exact graph and 4 dp coordinates and reports `delaunay: "exact-sos-v1"`. The selftest follows the same graph and coordinates. |
| fixtures/spectral-fixtures.mjs | The c2 edges and the c2 walk (trace and d_w) are regenerated on the canonical graph. |

**New part**: jev-delaunay-exact.js, the lane A2 build: exact integer predicates, a Simulation of Simplicity tie-break, and 4 dp rounding.

## Why replace Bowyer-Watson

Bowyer-Watson is an incremental algorithm that adds points one at a time to a valid Delaunay triangulation of a subset, removing triangles whose circumcircle contains the new point, per [Bowyer–Watson algorithm - Wikipedia](https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm) (clef weight: 0.1032) (weak backing, clef weight < 0.5). Tutorial implementations describe the same loop, per [Bowyer-Watson Algorithm for Delaunay Triangulation - Gorilla Sun](https://www.gorillasun.de/blog/bowyer-watson-algorithm-for-delaunay-triangulation/) (clef weight: 0.1251) (weak backing, clef weight < 0.5) and [Bowyer–Watson Algorithm for Delaunay Triangulation](https://every-algorithm.github.io/2024/02/12/bowyerwatson_algorithm.html) (clef weight: 0.1399) (weak backing, clef weight < 0.5); one notes that failing to handle the boundary case can produce degenerate or overlapping triangles, per [Bowyer–Watson Algorithm for Delaunay Triangulation](https://every-algorithm.github.io/2024/02/12/bowyerwatson_algorithm.html) (clef weight: 0.1399) (weak backing, clef weight < 0.5). A blog post on the empty-circumcircle rule illustrates how the Delaunay answer flips the moment a fourth point crosses into a circumcircle, per [Delaunay Triangulation - the Empty-Circumcircle Rule and Bowyer-Watson ...](https://cfdblog.cc/en/posts/2026-05-27-delaunay-bowyer-watson-empty-circumcircle/) (clef weight: 0.1775) (weak backing, clef weight < 0.5). That flip is exactly where a floating-point incircle test becomes fragile: when four points are nearly cocircular, the sign of the test is decided by rounding error. (One dig result is about a bow-making craft and is off-topic, per [Bowyer - Wikipedia](https://en.m.wikipedia.org/wiki/Bowyer) (clef weight: 0.0496) (weak backing, clef weight < 0.5).)

The feasibility record (PR #319) measured the consequence on the 366-centre gasket: the deployed JS graph had 1031 edges, the recorded Python graph 1025, and both missed edges that every valid triangulation must contain (8 and 14 respectively of 1014 forced edges). The adopted graph returns 1039 edges, matching the Euler count and containing every forced edge.

## Exact predicates and the tie-break

The robust-predicate literature behind this fix is Shewchuk's. His publications page lists "Robust Adaptive Floating-Point Geometric Predicates" (Symposium on Computational Geometry, ACM, May 1996), per [Fast Robust Predicates for Computational Geometry](https://www.cs.cmu.edu/~quake/robust.html) (clef weight: 0.0953) (weak backing, clef weight < 0.5). The paper describes fast C implementations of the 2D and 3D orientation and incircle tests over ordinary floating-point inputs, per [PDF Robust Adaptive Floating-Point Geometric Predicates](https://people.eecs.berkeley.edu/~jrs/papers/robust-predicates.pdf) (clef weight: 0.1289) (weak backing, clef weight < 0.5), and the longer article covers adaptive-precision arithmetic on IEEE 754 machines with exact rounding, per [PDF Adaptive Precision Floating-Point Arithmetic and Fast Robust Geometric ...](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf) (clef weight: 0.1877) (weak backing, clef weight < 0.5). A JavaScript port provides orient2d, orient3d, incircle, and insphere tests not susceptible to floating-point error, per [GitHub - mourner/robust-predicates: Fast robust predicates for...](https://github.com/mourner/robust-predicates) (clef weight: 0.2549) (weak backing, clef weight < 0.5), and libigl ships a C copy of Shewchuk's exact predicates, per [libigl/libigl-predicates: Exact predicates from Shewchuk ... - GitHub](https://github.com/libigl/libigl-predicates) (clef weight: 0.1970) (weak backing, clef weight < 0.5). Every one of these results scored below 0.5 on clef weighting, so they are cited as background, not as authority for the build.

The adopted part takes a different route to exactness than adaptive floating point: it rounds coordinates to 4 dp and evaluates predicates in exact integer arithmetic, so orientation and incircle signs are exact by construction. Exactness alone does not resolve true ties (exactly collinear or cocircular points); the Simulation of Simplicity tie-break assigns those a deterministic answer. The feasibility record notes Simulation of Simplicity (Edelsbrunner and Mucke, ACM TOG 1990) as the standard method and flags that the DOI it recalled was not re-verified.

## Fixture regeneration discipline

Before regenerating the c2 fixture on the canonical graph, the build first reproduced the old fixture on the old graph: trace exact, d_w equal to 1e-9. This proves the regeneration harness was faithful before its output was trusted.

## Bindings, crons, rollback

- 15 live bindings: 14 explicit plus `secret_text` kept (AE_SQL_TOKEN).
- Crons unchanged: `0 * * * *` and `*/5 * * * *`.
- Rollback: `session/deploy-2026-10-16/pre/` holds bundle.raw, the 60 parts, manifest.json (sha256 per part), settings.json, and schedules.json. Rollback re-PUTs those parts with the same metadata, including `keep_bindings ["secret_text"]`.

## Contract preservation

Keeping `bowyerWatsonDelaunay`'s name, input contract, and return shape means no caller changed. The swap is visible only in the output (more edges, different d_w) and in the `exact-sos-v1` label that `walkPoints` now reports, which lets consumers tell which graph produced a number.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Bowyer–Watson algorithm - Wikipedia | https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm | 0.1032 | weak (< 0.5) |
| 2 | Bowyer-Watson Algorithm for Delaunay Triangulation - Gorilla Sun | https://www.gorillasun.de/blog/bowyer-watson-algorithm-for-delaunay-triangulation/ | 0.1251 | weak (< 0.5) |
| 3 | Bowyer–Watson Algorithm for Delaunay Triangulation | https://every-algorithm.github.io/2024/02/12/bowyerwatson_algorithm.html | 0.1399 | weak (< 0.5) |
| 4 | Bowyer - Wikipedia | https://en.m.wikipedia.org/wiki/Bowyer | 0.0496 | weak (< 0.5) |
| 5 | Delaunay Triangulation - the Empty-Circumcircle Rule and Bowyer-Watson ... | https://cfdblog.cc/en/posts/2026-05-27-delaunay-bowyer-watson-empty-circumcircle/ | 0.1775 | weak (< 0.5) |
| 6 | Fast Robust Predicates for Computational Geometry | https://www.cs.cmu.edu/~quake/robust.html | 0.0953 | weak (< 0.5) |
| 7 | PDF Robust Adaptive Floating-Point Geometric Predicates | https://people.eecs.berkeley.edu/~jrs/papers/robust-predicates.pdf | 0.1289 | weak (< 0.5) |
| 8 | GitHub - mourner/robust-predicates: Fast robust predicates for... | https://github.com/mourner/robust-predicates | 0.2549 | weak (< 0.5) |
| 9 | PDF Adaptive Precision Floating-Point Arithmetic and Fast Robust Geometric ... | https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf | 0.1877 | weak (< 0.5) |
| 10 | libigl/libigl-predicates: Exact predicates from Shewchuk ... - GitHub | https://github.com/libigl/libigl-predicates | 0.1970 | weak (< 0.5) |
