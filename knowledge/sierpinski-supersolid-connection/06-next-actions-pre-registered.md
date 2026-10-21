# 06. Next actions (pre-registered)

**Scope:** Next actions (pre-registered): detailed analysis grounded in yubi-OS/yubiOS refs/sierpinski-supersolid-connection-2026-10-06.md.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/sierpinski-supersolid-connection-2026-10-06.md, no external web dig

## The original pre-registered list

The ground source lists 5 next actions, written before any generator ran.

1. **Build three generators** (Python stdlib, adjacent to `tools/edge-standard/`, under fixture-parity discipline): a triangular lattice (19 droplets, diameter 40, spacing 64); a Sierpinski gasket (39 droplets at 32/16/8); a shuffle (19 droplets, minimum gap 48). Render 640 by 640 gray.
2. **Run all three through the live `/taste/edge-standard`** with multiple seeds; replace analytic D bands with measured ones; the gate is the Sierpinski local slope 1.585 plus or minus 0.05 over s about 16 to 64.
3. **Public-imagery pass** restricted to panels with spacing at least about 40 px, preferring the Trypogeorgos Zenodo dataset (native data over figure extraction) and the Brakensiek 2026 sequence figures, recording `under_inked` and `low_confidence` per image, with edge-standard run rows as the audit trail.
4. **Only if the measurement discriminates:** draft the Sierpinski-gasket droplet-crystal proposal (with the Lane 2 differentiation paragraph) and the `supersolid_order` axis (psi6 plus s*), with admission via the rayleigh-pattern trial.
5. **Never:** retune TARGET_COVERAGE, MIN_COMPONENT, or the window toward a D outcome; flip `admitted` from this result alone.

## What happened to each action

### Actions 1 and 2: executed, with a logged amendment cycle

The generators ran the same day. v1 missed the gasket gate (local slope 1.1149). After advisor review and amendments logged before v2, the v2 design (uniform r=3, 6 depths, 366 droplets, 512 by 512) passed at L=384 with slope 1.5968 and r-squared 0.999. Two details diverged from the original action text, both by amendment rather than drift: the gate window became {13, 20, 29, 43, 64} because "16 to 64" is ill-posed on the pinned scale set; and an L-convergence calibration (L=256 versus L=384) was required before gate evaluation. Live-route parity confirmed all 4 classes within 4.5e-5 of local, with run rows cr_6f652cfed686aae1, cr_87bffecea50f0c31, cr_aad7cfcd6615e546, and cr_7dcb87d362eb7809.

### Action 3: executed, with a structural surprise

The Trypogeorgos dataset (CC-BY-4.0, 204 MB) turned out to hold 1D profiles, so it could not test 2D classes. Norcia et al. 2021 Fig. 2b supplied 8 single-trial in-situ panels extracted at 600 dpi (native 279 by 377). Three representatives ran through the live route at half resolution: run rows cr_dff7352880876a09, cr_83615312b8f10d47, and cr_ca3331c4bb8aaacc, each within 4.9e-5 of local. At half resolution r-squared dropped to 0.931 to 0.972 and `low_confidence` fired correctly; native-resolution local r-squared was 0.983 to 0.998.

### Action 4: partially resolved

The discrimination condition was met only for hierarchy. The `supersolid_order` axis is REFUTED as designed (Addendum 7), because D does not read order at matched extent. The Sierpinski-gasket droplet-crystal proposal stays alive and strengthened, but the source does not record it as drafted.

### Action 5: honored

No pinned parameter was retuned. The source records that no gate was moved post-hoc and that `admitted` was not flipped.

## The updated next actions

Addendum 5 updated the list to: (a) a v3 matched-extent shuffle control; (b) a real-figure pass preferring the Zenodo dataset; (c) the axis only if real data discriminates.

Addendum 6 updated it again: (a) the v3 control plus a matched-extent read across the Norcia panels to separate droplet number from dimensionality; (b) multi-trial averaged in-situ images to denoise per-panel verdicts, since Fig. 2b is single-trial by design; (c) the axis stays gated on a discriminating measurement on controlled real data, not on the trend alone.

Addendum 7 then executed (a). The control was pre-registered in `v3-preregistration.md`, with results in `v3-results.json`.

## What remains open after Addendum 7

Reading the record as of Addendum 7, these items have no recorded completion:

- **Multi-trial averaged in-situ images** to denoise the Norcia verdicts.
- **Drafting the Sierpinski-gasket droplet-crystal proposal** with the Lane 2 differentiation paragraph.
- **A real hierarchical candidate.** Every real morphology measured reads at or below 1.37; the gasket signature has only been observed synthetically.

## The discipline the list encodes

Every action has a gate, every gate was written before measurement, and the "Never" item names the parameters that may not move. The record shows the discipline holding under pressure: v1 failure, a sign-wrong advisor model, and a refuted prediction were all recorded rather than absorbed.
