# 03. Instrument Contract (Pinned: Any Change Is a Major Version Bump)

**Scope:** Instrument contract (pinned: any change to these is a major version bump): detailed analysis grounded in yubi-OS/yubiOS refs/SPEC-spectral-oracle-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/SPEC-spectral-oracle-2026-10-06.md, no external web dig

## The pinning rule

The SPEC's section header is itself the rule: any change to the instrument contract is a **major version bump**. This mirrors edge-standard-v1, where changing coverage, minimum component, or scale window invalidates every prior measurement.

## Two modes

### Walk mode

- **Input**: a binary mask or an explicit graph.
- **Graph build**: on ink pixels, 8-connected for masks.
- **Process**: seeded random walks.
- **Measurements**:
  - d_w from mean-square displacement: <r^2(t)> proportional to t^(2/d_w).
  - d_s from return probability: P(0,t) proportional to t^(-d_s/2).

On a regular lattice, MSD grows linearly in t (d_w = 2). On a fractal, walkers are trapped in dead ends and bottlenecks, so MSD grows more slowly and d_w > 2. For the gasket, d_w = ln5/ln2, about 2.32193, giving an MSD exponent alpha = 2/d_w, about 0.861. Return probability decays more slowly on low-dimensional or hierarchical structures; its exponent gives d_s directly.

### Series mode

- **Input**: any 1D ordered series (Laplacian eigenvalues, PSD bins).
- **Measurement**: integrated counting exponent, log N(omega <= x) versus log x, over the pinned window.

## Pinned parameters

| Parameter | Value | Why |
|---|---|---|
| Walk-step ladder | taste scale lattice [4, 6, 9, 13, 20, 29, 43, 64] times a step-scale factor | same 8-point log ladder as box counting; factor places a level-4+ gasket's hierarchy inside the window |
| Walkers | 64 | |
| PRNG | mulberry32, seed derived from input sha | identical in JS and Python so walks are byte-identical |
| r2 gate | >= 0.98 on every fitted exponent | same gate as taste |
| Series window | ranks r in [N/8, N/2] | middle band; excludes edge effects; fit over the same 8-point lattice in rank space |

The ladder is pre-registered in the harness and never retuned to an outcome. Reusing the box-counting lattice means the geometric and dynamical axes are sampled at the same log scales, which matters when they are combined in one identity.

The seed rule (sha-derived) gives two properties at once: the same input always produces the same walks (determinism), and different inputs get decorrelated walks.

## Outputs (deterministic)

```
{mode, d_w, d_w_r2, d_s, d_s_r2, alpha_msd,
 einstein: {d_s, two_D_over_d_w, delta,
            verdict: consistent|inconsistent|insufficient},
 log_periodic: {present: bool, method: "residual-octave-alternation"},
 run_id}
```

Every exponent ships with its r2. `alpha_msd` is reported separately from d_w even though alpha = 2/d_w, so the raw fit is auditable.

## The Einstein gate

- **consistent** iff |d_s - 2*D/d_w| <= 0.10 **and** all three inputs measured at r2 >= 0.98.
- **inconsistent** when the inputs are all well-measured but the delta exceeds 0.10.
- **insufficient** is the third verdict in the output schema; the natural reading, given the conjunction in the consistent rule, is that it covers cases where an input fails the r2 gate or is missing.

**Where D comes from**: either the caller (edge-standard features, stamped `source: caller` per taste doctrine) or a paired edge-standard call in oracle mode. Stamping provenance means a consumer can tell a caller-supplied D from one the oracle measured itself.

Worked gold check: D = 1.585, d_w = 2.32193 gives 2D/d_w = 1.3653; d_s = 1.36507; delta about 0.0002, well inside 0.10.

## Log-periodic signature

The `log_periodic` field uses the method `residual-octave-alternation`: after the global power-law fit, inspect whether residuals alternate sign across successive octave bands. Exact gasket spectra are log-periodically modulated (Fukushima-Shima), so presence is expected on gold. The SPEC treats it as a secondary gate and never as a fit parameter (doc 04, row 8).

## What the contract deliberately omits

There is no free parameter for window choice, walker count, or gate thresholds at call time. A caller cannot ask for a looser r2 or a wider band. That is the point: every reading under `spectral-standard-v1` was made under the same rules, so readings are comparable across time and implementations.
