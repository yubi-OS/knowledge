# 05. The JS renderer cannot draw warped centers

**Scope:** 4. The JS renderer cannot draw warped centers: detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md, no external web dig

## The defect

`renderDisks` in jev-lens-math.js loops from `Math.max(0, cy - r)` using fractional bounds. For any warped centre it throws:

```
Cannot set properties of undefined (setting '256.05')
```

The error text shows the mechanism. A warped centre such as cy = 256.05 produces a fractional loop start. The loop then indexes a row array with a non-integer key. In JavaScript, `rows[256.05]` is undefined, and attempting to set a property on undefined throws.

## Why integer renders never exposed it

Gasket integer renders are identical under both rules, per the source. With integer centres and integer radii, `cy - r` is an integer, every loop index is an integer, and the row lookup succeeds. The renderer worked for every input the deployed system had ever produced. The arrangement line is the first consumer that warps centres to fractional positions (astigmatism, trefoil, spherical arms), so it is the first to hit the bug.

## The fix: a float-safe rasterizer with the Python rule

A float-safe rasterizer that follows the Python `to_rows` rule reproduces the arm D values in the JS port table exactly. The rule has two parts:

1. **Trunc bounds.** Loop bounds are truncated to integers before iterating, so every index is an integer row or column.
2. **Coverage test.** A pixel is set when the squared distance from the pixel to the disk centre is at most r squared.

**Requirement.** Lane A1 must ship that rasterizer. Without it, no arrangement arm can run at all, regardless of what the D or walk legs would show.

## Verification of the fix

From the addendum, lane A1 delivered:

| Check | Result |
|---|---|
| D vs record, every arm | Match to about 1e-15 |
| Raster sha256 vs Python | Match |
| Pixel-arm dD vs Lane F | Match to six decimals |
| Tests | 57 total, 51 pass, 6 todo (walk gap tests) |

A raster sha256 match is a stronger check than matching D: it shows the two rasterizers set the identical set of pixels, so any downstream measurement on the mask must agree. The risk table in the ground-source doc lists the mitigation as exactly this: a float-safe rasterizer with a Python parity hash.

## Why the coverage rule matters for D

D is a box-counting dimension measured on the rendered mask. Which pixels a disk sets decides which boxes are occupied at each scale. Two rasterizers that disagree on edge pixels can produce different D values for the same arrangement, especially at the small box sizes of the pinned 4 to 64 window. Matching the Python rule bit-for-bit removes the rasterizer as a source of D variation, so arm D differences reflect the warp, not the renderer.

The research section of the ground-source doc lists a canonical finite-resolution correction for droplet rasterization as open: no universal law was found. That is a reason to pin one rule and hash it, rather than to search for a "correct" one.

## A related defect in the same module family

The addendum notes the deployed `warpMask` drops out-of-canvas ink silently. When a warp pushes ink past the canvas edge, it disappears without a record. Consequence: gate A3 cannot see pixel-arm drops. This is a second silent-failure path on the warped-geometry side; one throws, the other loses data quietly. The throwing one is arguably easier to fix because it announces itself.

## Gate outcomes the rasterizer exposed

With the renderer fixed, lane A1 could run the gates. Gate A2 fails on all five arms: the arrangement arm carries 40 to 107 percent of the pixel dD, against a one-third gate. That result could not have been measured before the fix, because the arms could not render.

## Risk table entry

| Risk | Impact | Mitigation |
|---|---|---|
| JS renderer throws on fractional centres | Arrangement arm cannot run | Float-safe rasterizer with Python parity hash |

## Status within the verdicts

The pixel arm's GO in the verdict table (doc 01) is conditional on this fix. The D leg is implementation-invariant only once the renderer can draw the input. Section 4 of the ground-source doc is therefore a prerequisite for Line A, not a side note.

## Lessons recorded

- A renderer tested only on integer inputs has an untested domain.
- Parity with the source of record should be checked at the raster level (hash), not only at the summary-statistic level.
- Silent clipping (warpMask) and loud throws (renderDisks) both need tests; the loud one is found first.
