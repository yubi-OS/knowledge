# 07 Moebius refinement strategy and re-fit cadence

Scope: the two refinement modes for phi_theta, the selection rule between them, the re-fit triggers (25 percent corpus growth, prior-art hit), and what a re-fit cycle must record.

## The two modes

The source doc (yubi-OS/yubiOS skills/hyperspherical-harmonic-curve/SKILL.md, Moebius Refinement Strategy section) defines exactly two modes for maintaining the corpus-level Moebius transformation.

Primary mode, joint refine per cycle when needed, is the default for small or fresh corpora with N_items < 30. Each Stage-3 cycle re-fits phi_theta jointly across all files using the closed-form ridge solve plus the L-BFGS-B refinement, and the cross-ratio preservation check on 100 held-out 4-tuples gates the new phi_theta before it is accepted. Cost is O(N_items times fit_cost) per cycle, expensive but exact (source doc).

Fallback mode, refine once at corpus-creation, is the default for large or mature corpora with N_items >= 30. phi_theta is fit once during the initial corpus-creation Stage-1 sweep and then frozen for all subsequent cycles. The PCA basis (W2, mu) is re-derived per cycle because that is cheap, but the domain warp stays fixed. The source doc gives the reason: this makes the composition Lemma 1 through Theorem 1 the cleanest possible, because per-file S2 points share a stable coordinate system across cycles (source doc).

## The selection rule

```
IF N_items < 30 OR (corpus growth since last refine > 25%):
    USE primary mode (joint refine per cycle)
ELSE:
    USE fallback mode (refine-once at corpus-creation)
```

(source doc, selection rule block.) Two forces are balanced here. Small corpora change relatively when one item lands, so the joint re-fit stays affordable and keeps the coordinate system maximally current. Large corpora are stable enough that a frozen warp is worth more than an updated one: the freeze means per-cycle atom deltas are directly comparable without a Moebius drift correction (source doc). A corpus that grows by more than 25 percent since the last refine flips back to primary mode because the geometry has shifted enough to need re-fitting.

The freeze has a machine-learning analogue: transfer-learning workflows routinely freeze pretrained parameters and train only the new layers, which protects the learned representation from drifting while the rest of the system changes around it (weakly backed: https://www.tensorflow.org/guide/keras/transfer_learning, jev weight 0.11). The skill applies the same discipline to a geometric object rather than network weights.

## Measured case: the enriched 73-skill corpus

The changelog records one live application of the rule. After cycle 9, the corpus was enriched from 70 to 73 skills via PR #179 (adding keylime, k8s-pss-restricted, and falco, closing 17 residual cells), and the Phase H multi-seed fit on the enriched corpus held K_kept = 2, below the 25 percent re-fit trigger (source doc, cycle 9 entry). A 3-item addition to a 70-item corpus is about 4 percent growth, so the rule says hold the frozen warp and keep measuring against it. That is the selection rule working as designed: no re-fit churn on small perturbations.

## What a re-fit must record

The source doc requires the selection rule's outcome to be recorded per cycle in the Empirical Validation section (source doc). A re-fit cycle therefore leaves an audit trail with at least: the mode selected and why (N_items, growth percentage), the fit outputs of the closed-form ridge and L-BFGS-B refinement, and the cross-ratio gate result on the 100 held-out 4-tuples. The gate value matters even on a pass: doc 02 records the cycle-3 max cross-ratio error of 3.08e-07 against the 1e-4 tolerance, and a future re-fit should produce its own number, not inherit the old one.

The L-BFGS-B half of the re-fit uses a quasi-Newton method with bound constraints; SciPy's implementation is the standard reference and its documentation records the algorithm's provenance, the Morales and Nocedal 2011 remark on L-BFGS-B (weakly backed: https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.fmin_l_bfgs_b.html, jev weight 0.29; https://docs.scipy.org/doc/scipy/reference/optimize.minimize-lbfgsb.html, jev weight 0.22).

## The three re-fit triggers, summarized

1. Corpus size crosses the N_items = 30 boundary in either direction.
2. Corpus growth since the last refine exceeds 25 percent.
3. The lifecycle's third trigger from the changelog: a prior-art hit surfaces that covers the variant's composition (source doc, cycle 5 trailing note). None of the 11 grep patterns matched either verified paper as of v5, so this trigger has not fired.

Between triggers, do nothing: the fixpoint discipline of doc 09 means an untriggered re-fit is churn, not diligence.
