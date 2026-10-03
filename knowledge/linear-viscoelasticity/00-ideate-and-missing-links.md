# Ideate-solo one-pager + missing-links analysis (2026-10-02)

This corpus was minted to ground the following two analyses. The one-pager is the ideate-solo output on the source idea (viscoelastic rigidity and snap-back of data as laid out by an envharness-style harness, giving the decision engine the right mechanics); the missing-links analysis is where the viscoelastic reading exposes concrete gaps in the /jev/ and /api/jev/corpus instruments. Both were jev-qualified (see qc-log.json).

---

# Viscoelastic Data-Layout Mechanics for the Jev Decision Engine [SOLO]

Date: 2026-10-02
Source: ideate-solo (no dialogue)
Scope class: systemic
Variations generated: 5
Finalist: V5 (single creep-recovery instrument)
Input corpus: D. Roylance, *Engineering Viscoelasticity* (MIT, 2001), 37 pp.

## Problem Statement

How might the way an envharness-style harness lays out data (edit -> place -> measure) be characterized by viscoelastic mechanics (rigidity, creep, relaxation, snap-back) so the jev decision engine gets rate-aware, history-aware instruments instead of the static audits it has today?

## The mapping (why this is not a metaphor)

Every linear-viscoelasticity primitive has a same-shaped object already in the yubiOS stack:

| Viscoelastic object | yubiOS counterpart | Evidence |
|---|---|---|
| Strain field eps(t) | the coverage/placement state (matrix flips, map placements) | rounds 1-3 matrices |
| Stress sigma(t) | measured structure level (dBc, z, V2) | /api/jev/corpus/audit outputs |
| Glassy modulus Eg (instant, reversible) | the frozen frame: rule_hash, baseline_id, task check | AGENT.md contract |
| Relaxation modulus E_rel(t) = ke + sum kj exp(-t/tau_j) | metric response decaying over edit-time (Prony series over edit history) | outcomes ledger rows |
| Creep compliance C_crp(t) | metric drift under a sustained directive stream (round 3: cells kept flipping, dBc kept sinking) | PR #278 record |
| Loss tangent tan delta = W_dis/W_st | hysteresis per edit cycle: predict-vs-realized area in the outcomes ledger | round-3 lesson 2 (ledger skipped) |
| Snap-back (continuation instability) | round 3: +0.64 dBc realized against negative-direction predictions; edit load rose, measured structure fell, the layout "snapped back" | PR #278 closed UNMERGED |
| Time-temperature superposition, shift factor a_T | policy version as temperature: policy v1->v5 changed response rates (allowed methods, validators) without changing the moduli (gate shape, terminal states) | policy history |
| Thermorheologically simple material | the worker: one shift factor per policy version moves every response curve without reshaping it | /api/jev policy |

The structural gift: the papers' basis already diagonalizes exponential relaxation. Heat-kernel modes decay as E_l(t) = E_l(0) exp(-2l(l+1)t) (papers/README.md F9); a Prony relaxation modulus is the same exp(-t/tau) family per mode. So a corpus relaxation spectrum is measurable in coordinates the stack already computes.

## Recommended Direction (V5 + V2 hybrid)

Ship ONE new instrument first: the creep-recovery (load-unload) test. For a candidate edit: audit -> apply edit -> re-audit -> revert edit -> re-audit. Two numbers fall out with no new math:

- recovery fraction R = (metric returned toward baseline) / (metric moved under load). R near 1 = elastic (the edit changed state, not structure); R near 0 = plastic (real structural change). Round 3's axis-fill padding is predicted to show high R: the matrix kept the flips, the structure did not.
- hysteresis area H = predict-vs-realized area around the load-unload loop, computed from the outcomes ledger rows (predicted_delta vs observed_delta, supersedes chains). H/loop is the loss tangent analog: dissipated effort per edit cycle. W_dis/W_st = 2 pi tan delta becomes the per-round waste metric.

Then the second ship (V2, the constraint-removal version): a `/api/jev/corpus/visco` surface computing a Prony-series relaxation modulus E_rel(t) = ke + sum kj exp(-t/tau_j) from the accumulated audit history (audit after each cycle already exists per the sign-gate runbook), plus a snap-back detector that fires when consecutive realized deltas flip sign against the pre-registered prediction (mechanizing the round-3 lesson instead of leaving it in the runbook prose).

## Key Assumptions to Validate

- [ ] Recovery fraction separates grounded edits from padding. Test: run the load-unload loop on one known-good round-1-style edit (frame/FPS numbers) and one known-bad round-3-style axis fill; R should separate. Cost: 6 audits on existing matrices.
- [ ] Hysteresis area is computable from existing ledger rows. Test: replay round 3's pending/realized rows; if supersedes chains are too sparse, the instrument defines what to pre-register next round.
- [ ] Exponential decay fits the audit history. Test: fit ke + sum kj exp(-t/tau_j) to the 10 audit points per round from the 3 rounds already run (30 points total); a 2-arm fit is already falsifiable.

## MVP Scope

1. Replaying round 3 through the load-unload loop (6 audits, ~$0 marginal).
2. A viscoelastic-reading section in the round record format: R, H, and the fitted tau_j alongside dBc start->end.
3. If R separates: file the /api/jev/corpus/visco proposal as a jev-corpus extension (audit history is already persisted in /api/jev/corpus/runs).

## Not Doing (and Why)

- Full complex-modulus dynamic loading (sinusoidal edit trains) — needs a controlled edit generator we do not have; creep/relaxation first.
- Lean §16 formalization of Boltzmann superposition before the instrument shows signal — proofs follow evidence in this program (§15 followed the audit).
- Changing the gate's mechanics (making approvals "viscous") — policy is Jenny's lever; this work only measures.

## Open Questions

- Is edit-time the right independent variable, or is commit-time (wall clock) better for tau? Edit-time is causal; wall-clock interacts with cron cadence. Recommend edit-time first.
- Does the curveball null need a time-dependent version, or is per-audit nulling sufficient for R and H? Per-audit first (each audit carries its own null today).

## Generation log (for review)

- V1 [Inversion] "The gate as viscoelastic material" — classify gate kinds by mechanical regime (fail-closed = glassy, auto kinds = viscous flow, approvals = creep compliance). Score 3+4+3+4 = 14. Reframing, no new measurement; becomes vocabulary for the instrument doc.
- V2 [Constraint removal] "Full viscoelastic instrument suite" — creep, relaxation, dynamic loading, loss tangent, master curves via time-policy superposition on /api/jev/corpus/visco. Score 5+3+4+3 = 15. Right destination, wrong first step.
- V3 [Audience shift] "Lead-machine elasticity" — the same mechanics applied to the lead pipeline (draft -> hold_for_review -> approve as load-unload on lead quality). Score 2+3+2+2 = 9. Dropped below threshold: lead quality has no repeated measurement yet; the corpus rounds do.
- V4 [Combination] "Outcomes-ledger hysteresis" — viscoelastic mechanics fused with the pre-registration ledger; predicted = load, realized = strain. Score 4+5+4+5 = 18. Co-finalist; absorbed into V5 (H is V5's second number).
- V5 [Simplification] "One creep-recovery test" — R and H from load-unload audits on existing history. Score 5+5+4+5 = 19. Winner.

## Stress-test of V5

- Strongest critique: two audit points per edit cannot distinguish elastic recovery from scorer noise (dBc has its own null variance). Counter: each audit carries its own curveball null and z; R is computed on the z-normalized level, and the positive control (/api/map/control) already exists to calibrate noise per frame.
- Second-order effects: if R separates, the lens candidates gain a predicted-R column, so the RSI chain can decline content-resistant fills BEFORE burning a cycle instead of after (round 3's failure mode, caught one cycle earlier).
- Un-testable bet: that structural response is approximately linear in the edit's "load" (superposition holds). If edits interact superlinearly, Prony fitting degrades to a bookkeeping exercise. This is exactly the assumption linear viscoelasticity itself makes, and the Roylance notes frame it as "a usable engineering approximation", which is the honest bar here.


---

# Missing links: viscoelastic mechanics vs the /jev/ and /api/jev/corpus instruments (2026-10-02)

Subject: where the viscoelastic reading of data-layout (Roylance, *Engineering Viscoelasticity*) exposes concrete gaps in the steady-orbit worker's instrument set, and what closes each one. Companion to the ideate-solo one-pager in this session. Sources: live endpoint contracts from `jev-corpus` and `jev-orchestrator` skills, the wayfinder AGENT.md, `refs/envharness-lean-replacement-audit-2026-09-01.md`, papers/README.md F9, and the three RSI-round records.

## Link 0. What exists today (the baseline)

- **Static structural audits**: `/api/jev/corpus/audit` (V2, z, verdict, dBc, shares, E_l) — instantaneous, each carrying its own curveball null.
- **Difference without history**: `/api/jev/corpus/drift` compares two matrices or two spectra — a finite difference, not a time integral. No memory of the path taken between the two states.
- **Pre-registration without closure math**: `/api/outcomes` stores predicted_delta and observed_delta per row with supersedes chains, but nothing integrates them. The ledger is a load-strain dataset nobody loads.
- **Rate signal without a rate model**: the hourly evolution cycle's `metrics.corpus.drift_vs_prev` is a one-step difference. The Prony structure (multiple relaxation times) is invisible to it.
- **Runbook rules where instruments should be**: the dBc sign gate lives in prose (AGENT.md). Round 3's wrong-signed trajectory was caught by discipline, not by measurement.

## The five missing links

### L1. No time-dependent instrument at all (creep, relaxation, dissipation)

Every corpus endpoint is an instantaneous modulus. Linear viscoelasticity's three canonical tests have no counterpart:

| Roylance test | Measures | /jev/ counterpart | Gap |
|---|---|---|---|
| Creep (constant load, strain grows) | C_crp(t) | repeated audit under a sustained directive stream | none: no endpoint accumulates strain-under-load history |
| Stress relaxation (constant strain, stress decays) | E_rel(t) | audit history after a frozen layout | none: audit history exists in `/api/jev/corpus/runs` (last 50) but nothing fits E_rel = ke + sum kj exp(-t/tau_j) |
| Dynamic loading (sinusoidal) | storage/loss moduli E', E'' | none | none |

Close: the load-unload (creep-recovery) loop needs only existing endpoints (audit -> edit -> audit -> revert -> audit). It is the MVP in the ideate one-pager. The rest needs a new surface (L3).

### L2. No snap-back detector; the round-3 lesson is prose, not code

In structural stability, snap-back is the continuation branch reversing: load rises, displacement falls. Round 3 is exactly this: 10 cycles of axis-fill edits (load rose: cells flipped), realized dBc went +0.64 against negative-direction predictions (measured structure fell), the trajectory snapped back. The sign gate caught it only because a human-authored runbook said "stop on wrong sign". Missing: a detector that watches consecutive realized-vs-predicted deltas in `/api/outcomes` and flags sign-inversion + a minimal recovery-fraction measurement (audit after revert) on any flagged candidate. Mechanizing lesson 1 costs one small module in `jev-corpus-deps.js` plus one route; it turns the runbook rule into a fail-closed gate input, which is where it belongs (the deterministic gate must not need prose to protect it).

### L3. No relaxation-modulus surface (Prony series over audit history)

The papers' own basis already diagonalizes exponential relaxation: heat-kernel modes decay as E_l(t) = E_l(0) exp(-2l(l+1)t) (papers/README.md F9), and a Wiechert/Prony relaxation modulus is the same exp(-t/tau) family per arm (Roylance Eq. 36). So a corpus relaxation spectrum is a fit in coordinates the stack already computes. Missing surface: `/api/jev/corpus/visco` reading the accumulated audit rows (runs table + outcomes ledger), fitting a K-arm Prony series per metric (dBc, z, V2), and returning `{ke, arms:[{k_j, tau_j}], fit_quality}`. K=2 is the minimum falsifiable version; 30 audit points exist across rounds 1-3 already.

### L4. No dissipation metric on the ledger (hysteresis / loss tangent)

Predict = load, realized = strain, supersedes = unloading path. The loop area around a load-unload cycle is the dissipated work; W_dis/W_st = 2 pi tan delta (Roylance Eq. 18) is the per-cycle waste fraction. The ledger has all the inputs and no integrator. Missing: a `POST /api/jev/corpus/visco/hysteresis` (or a ledger-side rollup) that closes each supersedes chain into a loop and returns hysteresis area per round. Round 3's wasted effort would have been measurable mid-round instead of at PR review.

### L5. Policy version is an unexploited shift factor (time-temperature superposition)

Roylance: for thermorheologically simple materials, temperature shifts every response curve along log-time by a_T without reshaping it (WLF Eq. 50). The gate is the same shape: policy v1 -> v5 changed response *rates* (allowed methods, validators, approval semantics) without changing the *moduli* (gate shape, six terminal states, fail-closed rule). Missing: treat policy version as the corpus's temperature. Concretely: per-policy shift factors a_T(v) on response curves (approve latency, gate verdict distribution, retry behavior) would let pre-v5 and post-v5 behavior be compared on one master curve. This is also the first testable claim: if the worker is NOT thermorheologically simple (shape changes across a policy bump, like round 3's validator addition reshaping resend.send outcomes), that falsifies the simple-material assumption and the WLF analog gets restricted to rate-only changes. The Roylance notes themselves flag this: thermorheological simplicity is an empirical property, not an axiom.

### L6 (bonus, ties to the envharness program). Tier-2 swap gains a time layer

The 2026-09-01 audit proposed replacing envharness's `ObjectiveSignal.score` (raw window means, no matched null) with curveball dV2z gated at the +15.6 dBc floor. The viscoelastic reading adds the missing dimension: a DifficultyZone band test on an instantaneous score cannot distinguish an environment whose difficulty is elastically reverting (agent adapts, metric snaps back) from one that is plastically hardening (real difficulty, metric stays moved). A viscoelastic objective would score the *lag* (phase angle delta between action distributions and difficulty bands) and the recovery fraction between mutation windows. That is the "right mechanics" the harness was missing: acceptance statistics with memory, not just better instantaneous statistics.

## What already matches (no gap, cite it)

- Frozen frame = glassy state: rule_hash, baseline_id, and the frozen task check are the elastic (instantaneously reversible, shape-preserving) regime. Re-mapping with the same d/seed/threshold returns consistent placements: elastic recovery by construction.
- Coverage-matrix flips = plastic state: cells stay flipped even when the measured level regresses (round 3). Two state spaces with different moduli, which is precisely why matrix-space alone fooled round 3.
- Duhamel/Boltzmann superposition = the correct formalization target for edit history: sigma(t) = integral E_rel(t - xi) dstrain(xi). CurvedCorpus.lean §12 already carries the decibel laws (bpow additivity, square-doubling, injectivity), so a dBc-scale relaxation modulus keeps the kernel-checked level laws; §15's harness algebra gives the edit-event semantics.
- The gate as material: fail-closed = glassy (rigid, no flow), auto kinds = viscous flow, human approvals = creep compliance (time-dependent yield under sustained load, with expiry = recovery). Vocabulary only; the gate mechanics stay untouched.

## Ship order (jev-qualified, see QC log)

1. Creep-recovery replay on round 3's edits (existing endpoints, ~6 audits).
2. Hysteresis rollup on the outcomes ledger (small).
3. Snap-back detector wired as gate input (small module).
4. /api/jev/corpus/visco Prony surface (needs L1 history to exist first).
5. Policy-as-temperature study (analysis, no code).
