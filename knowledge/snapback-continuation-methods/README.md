# snapback-continuation-methods

**Minted 2026-10-02** from the viscoelastic data-layout research request. Purpose: the structural-stability half of the program — what snap-back means mechanically (round 3 of the jev-corpus RSI chain was a snap-back: edit load rose, measured structure fell), how continuation methods trace paths past limit points, and how load-unload loops measure elastic recovery vs dissipation.

Consumer programs: the jev-corpus sign-gate and the proposed snap-back detector + hysteresis rollup (`00-analyses` cross-ref: see `knowledge/linear-viscoelasticity/00-ideate-and-missing-links.md` for the instrument-side analysis).

## Docs

| doc | scope |
|---|---|
| 01-snap-through-snap-back-limit-points.md | Snap-through vs snap-back: limit points on the load-displacement path, load vs displacement control, classic examples |
| 02-riks-arc-length-continuation.md | Riks/arc-length continuation: the constraint that traces the equilibrium path past limit points; Wempner/Riks origins, Crisfield variants |
| 03-stability-criteria-bifurcation.md | Energy/second-variation stability criteria, bifurcation vs limit-point instability, Koiter post-buckling, eigenvalue criteria |
| 04-creep-buckling-viscoelastic-stability.md | Creep buckling and time-dependent stability: why the elastic-viscoelastic correspondence does NOT carry to stability |
| 05-tracking-unstable-branches-computational.md | Computational branch tracking: branch switching, limit-point detection, solver stabilization and its pitfalls |
| 06-hysteresis-recovery-measured-loops.md | Hysteresis and recovery in load-unload loops: recovery fraction, loop area as dissipated energy, Mullins effect |

## Research summary

All 6 docs authored from dig + primary-source verification; each carries a jev-weighted dig record in `research-db/digs/`. The jev outline triage scored this outline 1.04/2 ("mixed, trim some"): docs 01, 02, 04, 06 are the load-bearing set for the data-layout program; 03 and 05 are kept as structural context (both fully sourced).

## Research DB

- `preflight.json` (shared preflight with the linear-viscoelasticity corpus, 2026-10-02)
- `digs/01.json` .. `digs/06.json`: per-doc dig results with jev weights and task lineage
- `archive.json`, `db.ts`, `qc-log.json`
