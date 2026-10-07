# 04 - The sign gate and the level_dBc convention

Scope: which statistic the round gate reads, why level_dbc = 20*log10(|z|) and not the audit's dbc field, the bearing reading of predicted vs realized deltas, and gate-grade audit resolution.

## Two statistics with one name

Source doc (sign convention, corrected 2026-10-03, refs6 finding): the round gate reads `level_dbc = 20*log10(|z|)`, the verify_claims.py claim-8 corpus level, now returned by `/audit`. Improvement is level UP: the corpus is more distinguishable from the null. The audit's `dbc` field is a different statistic, an L2 share-spectrum distance to the null-vacuum mean, negative when close, and it is uncorrelated with z at cycle scale. Source doc instruction: "do not gate on it."

The correction was earned by evidence, not preference. Across refs6's consecutive audit states the two statistics moved in opposite directions 4 of 5 times; the round's only keep moved z by minus 0.22 while dbc moved by minus 1.64; two reverted edits had z of plus 0.29 and plus 0.71 (source doc). Gate-grade audits use `nulls: 400` because the default 100 carries sd-estimation noise on z (source doc).

The dBc side of the name is standard decibel arithmetic. A decibel is a relative unit expressing the ratio of two values on a logarithmic scale (Britannica, https://www.britannica.com/science/decibel, jev weight 0.80; Wikipedia gives the formal definition via the ratio 10^(N/10) for power, https://en.wikipedia.org/wiki/Decibel, jev weight 0.71). The 20-times factor is the amplitude-ratio form: dB = 20 log10(V2/V1) for amplitudes versus 10 log10(P2/P1) for power, because power scales with amplitude squared (electricalflux worked examples, https://electricalflux.com/learn-components/formula-to-calculate-decibels-worked-examples, jev weight 0.07 - weak backing; MIT OCW lecture notes on the decibel as a logarithmic amplitude measure, https://ocw.mit.edu/courses/2-004-dynamics-and-control-ii-spring-2008/f8706caa7aecebcc533553fb154778d0_lecture_33.pdf, jev weight 0.85). Reading a z score in dB via 20*log10(|z|) therefore puts the gate statistic on the same log scale engineers use for amplitude ratios; the logarithm is the inverse of exponentiation and compresses multiplicative change into additive units (Wikipedia, https://en.wikipedia.org/wiki/Logarithm, jev weight 0.61).

## The sign gate per cycle

Source doc, runbook lesson 1: improvement means dBc MORE NEGATIVE under the old share convention and level UP under the corrected convention; either way the gate is a sign gate on the realized delta. Re-audit after every cycle; if the realized delta has the wrong sign, stop, revert that edit, record the negative result, re-lens. Never finish 10 cycles on a wrong-signed trajectory. Round 3 ran all 10 cycles because each individual prediction (plus 9.8 to plus 11.5 dBc versus its paired control) looked good while the realized total was plus 0.64 (source doc).

A sign gate is a deliberate reduction of the decision to direction. The effect-direction plot methodology in evidence synthesis does the same: it uses a sign test to synthesize the direction of effect across studies for an outcome domain, separating direction from magnitude (Wiley, Journal of Research Synthesis Methods, https://onlinelibrary.wiley.com/doi/full/10.1002/jrsm.1458, jev weight 0.81). Direction is cheap to measure reliably; magnitude estimates are noisier, and the engine separates the two concerns (see the bearing rule below).

## The bearing reading

Source doc, lesson 10 (the user's 2026-10-03 directive): the sign is a bearing, not a verdict. Read the predicted-realized pair in the level convention as a direction:

- aligned plus meaningful magnitude: keep.
- aligned plus tiny: small-but-real; keep candidate and report the magnitude honestly, never auto-drop a positive realized level delta.
- inverted: the text moved the corpus against the geometry; revert.
- zero: no-flip.

The snapback inversion detector only means something once both sides are in the level convention. Before the correction it compared a level-convention prediction against a share-dbc realization and flagged every true keep as an inversion (source doc). This is a unit-mismatch bug class: two numbers only comparable when they are computed in the same convention. The pre-correction failure mode was structural, not statistical.

Preregistration discipline supports separating the prediction from the verdict: preregistration means specifying hypotheses and analysis plans before observing outcomes, which reduces opportunistic flexibility (APA, https://www.apa.org/pubs/journals/resources/preregistration, jev weight 0.90; Lakens on preregistration and registered reports, https://psicostat.github.io/4ms-winter-school/slides/Lakens-4M-18-2-2025-Preregistration.pdf, jev weight 0.06 - weak backing). The engine's version: predicted_delta is registered in the outcomes ledger before the edit; realized_delta is appended after the re-audit; the gate compares them only in the level convention.

## Why gate-grade audits need nulls 400

The z statistic is standardized against the null draws' mean and sd (doc 02). With 100 draws, the sd estimate itself is noisy, so z inherits that noise and small true effects cannot be separated from sampling jitter of the instrument. At 400 draws the sd estimate tightens and the multipass band (inter_pass_offset_dbc, doc 02) shrinks. The cost is linear in nulls, so the protocol reserves 400-null audits for gate decisions and uses the 100-null default for cheap intermediate reads (source doc).

## Practical checklist

1. Before gating, confirm both numbers are in the level convention (level_dbc from z, not the audit dbc field).
2. Run the gate-grade audit with nulls 400.
3. Compare the realized level delta against the pre-registered predicted_delta as a bearing: aligned, inverted, or zero.
4. Revert on inversion; record the negative result and re-lens; never accumulate wrong-signed edits.
5. For multipass states, require sign consistency across passes and magnitude above inter_pass_offset_dbc before calling an effect plastic (source doc, Decision-B lesson 0).
