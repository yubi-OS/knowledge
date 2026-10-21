# 06. Gasket depth ladder (premap feasibility)

**Scope:** 5. Gasket depth ladder (premap feasibility): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md, no external web dig

## The experiment

`genGasket(512, 384, 3, depth)` was run for depth 1 to 6 (work/bench/ladder.mjs). The goal was to test whether Line B, the premap, can identify hierarchy depth from points, and at which depths a D reference is valid.

## Results

| Depth | N | (3^k+3)/2 | Nested in next | D | r2 | d_w |
|---|---|---|---|---|---|---|
| 1 | 3 | 3 | yes | 0.4463 | 0.4982 | not computed |
| 2 | 6 | 6 | yes | 0.4112 | 0.6817 | not computed |
| 3 | 15 | 15 | yes | 0.4818 | 0.9093 | not computed |
| 4 | 42 | 42 | yes | 0.6690 | 0.9794 | not computed (N below 300) |
| 5 | 123 | 123 | yes | 1.1178 | 0.9638 | not computed (N below 300) |
| 6 | 366 | 366 | yes | 1.5589 | 0.9964 | 2.7650 (JS) |

## Finding 1: counts follow (3^k+3)/2 and every level nests

The observed counts 3, 6, 15, 42, 123, 366 match (3^k+3)/2 for k = 1 to 6. Every level is contained in the next. **Containment is therefore a usable identification rule**: an observed point set can be placed at the deepest level whose template it fits inside.

Each count is three times the previous minus 3: 3*3-3 = 6, 3*6-3 = 15, 3*15-3 = 42, 3*42-3 = 123, 3*123-3 = 366. That recurrence is consistent with the closed form.

## Finding 2: only depth 6 gives a D reference

The gate is r2 >= 0.98 in the pinned 4 to 64 box window at L = 384. Depth 4 comes close (0.9794) but fails. Depth 5 drops back to 0.9638. Only depth 6 passes, at 0.9964. **The premap reports a D band only at depth 6. Shallower levels report identification and holes only.**

The D values also show why shallow levels cannot serve: D climbs from about 0.45 at depths 1 to 3 to 1.5589 at depth 6. With few disks, the box-counting fit sees isolated blobs, not a self-similar set, so its slope and its r2 are both poor. The ground-source research section lists the ideal gasket fractal dimension as d_f = ln3/ln2, about 1.585; the depth-6 value of 1.5589 is the only one in that neighbourhood.

## Finding 3: the walk needs about 300 points

The walk requires N of about 300 or more (amendment AM-6). Only depth 6 (N = 366) qualifies in this family. The d_w shown, 2.7650, is the JS value on the then-deployed incomplete graph; the adoption record later measured the canonical value as 2.897099. The research section lists the ideal gasket walk dimension as d_w = ln5/ln2, about 2.32, and the spectral dimension d_s = 2 ln3 / ln5.

## Line B verdict follows directly

GO, gold-family MVP only, because only depth 6 supports a D band and only depth 6 supports a walk. Identity frame only, because containment fails under displacement (risk table), so registration is Phase 2.

## Lane B1 confirmations (addendum)

| Check | Result |
|---|---|
| Tests | 120 pass |
| Template parity | 6 of 6 |
| Negatives | null on all 20 trials (largest negative f 0.0055) |
| Holes | exact |
| Depth-6 template D | 1.5589, r2 0.99636 |
| Predicted band below depth 6 | not_available, as designed |

The risk table requires that the absent band is reported as `not_available` with the reason, not as a silent null. B1 implements exactly that.

## The size-floor amendment

B1 found that containment has no size floor: one observed point on a depth-1 site returns level 1. A single point fits inside every template, so containment alone cannot reject it. The fix, logged as a pre-run amendment before the harness runs, is a minimum of 6 observed points, the depth-2 template size. No trial in the frozen matrix falls below 17 points, so no trial changes. The tri "40 percent" reading (keep 8 of 19) is flagged in the pre-registration and stays until the advisor confirms it.

## Lane B2 status

B2 wrote the pre-registration first (76 lines, frozen values copied verbatim from SPEC 3.3), then the route and harness. Stub tests pass 70 of 70. The harness has not run against the real module; the advisor runs it after the floor amendment is logged.

## Cost of the ladder's top rung

From the cost table: `genGasket(6)` takes 2 ms, integer-centre `renderDisks` 8 ms, `measureD` 134 ms on first call (JIT) and 49 ms per arm, `bowyerWatsonDelaunay` on 366 points 83 ms (1031 edges), and `randomWalks` with W 4096 and 256 steps 34 ms clean, 133 ms on an arm. These are Node timings, not workerd; they must be measured under workerd before any deploy.

## What the ladder settles

- Identification by containment: viable, with a 6-point floor.
- D band: depth 6 only.
- Walk: depth 6 only.
- Registration: out of scope until Phase 2.
