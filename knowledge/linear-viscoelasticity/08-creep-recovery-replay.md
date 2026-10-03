# Creep-recovery (load-unload) replay of jev-corpus round 3 (2026-10-02)

The MVP instrument test from `00-ideate-and-missing-links.md`, executed against the recorded round-3 history. Corpus pinned at the round's base SHA `379a9f2a` (244 refs/ docs); the load = the round's own documented axis-fill cells; the unload = the base text re-scored; the persistence leg = a blind independent grader reading the loaded text. All audits ran on the worker (`/api/jev/corpus/audit`, 200 nulls). Full machine record: `research-db/creep-recovery-replay.json`.

## Setup

- 8 grader lanes re-scored the full corpus (prefer-0 rubric, >=2 distinct evidence hits per axis, quotes recorded). 244/244 scored. Column sums drifted from the recorded pass (density 0.7128 vs recorded 0.641); audience matched exactly (69), the biggest drifts were assumption_set +56 and adjacent_problems +41.
- Intra-protocol determinism: the 5 edited docs' base rows re-scored identically (60/60 axes); the baseline audit repeated cached with the identical run id.

## Audit legs

| matrix | V2 | z | dBc | run |
|---|---|---|---|---|
| M0 (re-scored baseline) | 0.4268 | 7.20 | -16.88 | cr_8d58079cba6bbd9f |
| M10 (load: 9 flips applied) | 0.4203 | 7.93 | -14.32 | cr_7a7af5fc20573ee4 |
| M_persist (blind head-state rows) | 0.4178 | 6.24 | -13.66 | cr_4958b6985eef7248 |
| M_unload | = M0 exactly (deterministic) | | | cached |

## Findings

1. **Scorer variance dominates the gate (5.77 dBc).** The replayed baseline sits at -16.88 where the recorded pass read -11.11, on the same corpus at the same SHA. The round was gated on a +0.64 effect inside a 5.8-wide grader-pass band. The sign gate needs the pinned-scorer + re-score-only-edited-rows discipline, now with a number on it.
2. **R is trivial under deterministic scoring.** The text-revert unload returns the matrix exactly; recovery fraction R = 1.0 for every edit class. The elastic/plastic separation does not live in the revert leg under a deterministic scorer.
3. **Persistence is the discriminating measurement (9/9).** A blind independent grader credits all 9 applied flips from the loaded text, and the measured level moves FURTHER from baseline (+3.22 dBc) rather than back toward it. Round 3's axis-fills were substantive enough to persist under re-grading; the regression was the corpus-level response direction, not cell fragility.
4. **The load sign is a frame property.** The replay's load leg (+2.57) reproduces round 3's sign (+0.64): in this frame, filling cells moves dBc toward the null mechanically.
5. **Prediction-vs-realized hysteresis is large and measurable.** From the recorded round: lens expected +9.79 to +11.50 per candidate against realized per-cycle deltas summing to +0.65; sum |predicted - realized| = 102.9 dBc-units across 10 cycles (mean 10.29/cycle). That is the dissipation metric the outcomes ledger was designed to catch.

## Jev qualification (worker /api/decide, task ta2687dc-26ae-4e58-95b5-bca58c34b4f0)

- interpretation_quality: 1.59/2, P(sound) 0.60 (sound with caveats)
- persist_beats_R: 0.92 (persistence-under-independent-re-grading is the more informative measurement)
- gate_noise_risk: 0.89 (the scorer-variance finding materially threatens the sign gate as run)

## Instrument implications for /api/jev/corpus/visco

1. Lead with the re-grade (persistence) leg, not the revert (R) leg.
2. Hysteresis rollup on /api/outcomes supersedes chains, using the recorded round as the calibration case (102.9 dBc-units dissipated).
3. Pin the scoring prompt; re-score only edited rows; report scorer variance with every round (lesson 5, now quantified).
4. R becomes non-trivial only with a rate-dependent or stochastic scorer; deterministic scoring collapses the elastic/plastic distinction into the persistence test.
