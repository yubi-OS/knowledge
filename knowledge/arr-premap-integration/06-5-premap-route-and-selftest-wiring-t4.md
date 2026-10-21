# 06-5-premap-route-and-selftest-wiring-t4

**Scope.** 5. Premap route and selftest wiring (T4): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-integration-2026-10-16.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-integration-2026-10-16.md, no external web dig

## Contract between two lanes

Line B was built by two lanes: B1 wrote the premap module and B2 wrote the route plus a stub-backed test suite. The ground source's section 5 checks the B1 result shape against what the B2 route expects.

| Field | B1 returns | B2 expects | Match |
|---|---|---|---|
| identification | level, reason, by_depth | same | yes |
| holes (level set) | count, sites, reason: null | count, sites | yes |
| holes (level null) | count: null, sites: [], reason | count, sites with count an integer | no, fixed |
| predicted_band | status, D_template, r2_template, band | status measured or not_available | yes |
| fill_measure | the 11 FILL_KEYS | the same 11 keys | yes |
| run_id | null (route sets it) | route sets it | yes |

Five of six fields matched on first integration. The one mismatch was the shape of holes when no level is identified.

## The null-level holes fix

The B2 route returned 500 PREMAP_RESULT_INVALID on every negative, because B1 returns `count: null` when the level is null and B2 required an integer. The fix in the candidate route accepts a null level with either `count: null, sites: []` (the B1 shape) or `count: 0, sites: []` (the B2 stub shape). The response always reports `count: null`. Any site list with a null level is rejected. The B2 test that encoded the count-0 shape still passes unchanged.

Three design points stand out. First, the fix is permissive on input (two shapes) and canonical on output (always null), which is a classic robustness choice at an interface boundary. Second, it fails closed on the dangerous case: a null level with a non-empty site list would mean holes predicted without an identified template, and that is rejected. Third, no test was edited to make the integration pass.

## Selftest wiring

The route needs `deps.premap.selftest`, which lived in `premap-selftest.js`. It is now exposed to the route, and `premap-integration.test.mjs` runs 19 selftest checks through the route with the real module, all passing. This closes lane discrepancy 3.

## Test results with the real module

- B2 stub suite, unchanged: 70 of 70 pass after the route edit.
- Integration suite (route to real module): 12 of 12 pass.

The 12 integration tests cover: the selftest; a depth-6 POST with and without measure; the uniform negative; the single-point floor (Amendment 1); a six-point level 2; full observation; a 413 response for 801 points; and two fail-closed stubs. The 413 case implies an upper bound of 800 observed points per request. The six-point level-2 case sits exactly at MIN_OBSERVED = 6, the depth-2 template size, and the single-point case sits below it, so the floor is tested on both sides.

## Deps-injected routes

The glue file `worker-candidates/glue/jev-arr-glue.js` builds the deps for both routes from the deployed walk, the deployed measure, and the shared renderer. The routes never import the deployed modules directly. This is what lets the same route code run against stubs (B2 suite), the real module (integration suite), and eventually the deployed bundle, with only the deps object changing.

## The routes patch

`PATCH-routes.diff` changes only delegate lines in `jev-corpus-routes.js`. `git apply --check` passes against the pre-deploy part. It is NOT applied. `parts-staging/` holds 60 deployed parts plus the 7 new or changed parts, with import rewrites, and was used only for an offline import check. The parts were not run under workerd.

## What remains before go

From the record's "What is NOT done" and open decisions:

1. No deploy; the patch is checked but not applied.
2. No workerd CPU measurement; Node only.
3. A6 not wired on the live route; it needs the canonical Delaunay part.
4. The arrangement response does not label its walk graph; recommended before go.
5. Deploy go (decision 5): approve the seven new parts and the routes patch per `DEPLOY-CHECKLIST.md`, after a workerd CPU measurement and the walk-graph label.

## Full test totals

| Suite | Pass | Fail | Todo |
|---|---|---|---|
| B1 premap.test.mjs | 120 | 0 | 0 |
| B2 premap-route.test.mjs (stub) | 70 | 0 | 0 |
| premap-amendment1.test.mjs | 11 | 0 | 0 |
| premap-integration.test.mjs | 12 | 0 | 0 |
| shared/disks.test.mjs | 13 | 0 | 0 |
| A1 arrangement.test.mjs | 51 | 0 | 6 |
| A2 delaunay-exact.test.mjs | 13 | 0 | 0 |
| A2 delaunay_exact.py selftest | 48 | 0 | n/a |
| Node total | 290 | 0 | 6 |

The Node total is the sum of the seven JS suites: 120 + 70 + 11 + 12 + 13 + 51 + 13 = 290. The Python selftest is counted separately.
