# 07 - Calibration: power, false positives, and the detection threshold

Scope: the calibrate subcommand as a lens-format experiment design, the verdict rule, and how the detection threshold is defined.

Source of record: yubi-OS/yubiOS skills/curved-corpus-create/SKILL.md. The measurement-science framing is grounded by a weak dig.

## What calibrate does

For each amplitude in a pre-declared sweep, calibrate runs trials independent planted corpora, each measured against reps curveball draws [source doc]. Each amplitude produces one lens, not one table row [source doc, v1.1.0].

## The lens

Each calibration lens carries [source doc]:

- hypothesis: "amplitude >= A produces |dV2z| > 3 at the specified N"
- method: "trials independent planted corpora measured against reps curveball draws"
- parameters: {amplitude, N, d, modes, trials, reps, seed}
- delta: {mean_dV2z, sd_dV2z, mean_V2, mean_R2, power_at_z_3, FPR_at_z_3, FPR_at_z_2}
- verdict: YES (power >= 0.8 and FPR_at_z_3 < 0.05) | PARTIAL (power >= 0.5 but FPR fails or power < 0.8) | NO (power < 0.5)
- score: 0 to 50 (50 = full pass, 0 = degenerate)
- caveat: "amplitude ladder is per the specified sweep; the per-trial sd may exceed the per-step amplitude difference"

Power and FPR are lens-level, never aggregated [source doc]. The lens is the unit of experimental record; averaging across lenses would destroy exactly the per-amplitude information the sweep exists to produce.

## The detection threshold

The detection threshold is the smallest swept amplitude with a YES verdict [source doc]. It is NOT a Gaussian-tail crossing [source doc, example 3]. The source doc's example calibration pack shows the shape: amplitude 0.00 yields mean_dV2z 0.18 and power 0.00 (YES, null as expected); amplitude 0.50 yields mean_dV2z 1.50 and power 0.12 (NO); amplitude 0.75 yields mean_dV2z 5.49 and power 1.00 (YES); detection_threshold = 0.75, FPR_at_z_3 = 0.00, FPR_at_z_2 = 0.125 [source doc].

## Why pre-register

Guideline 4: pre-register the sweep. Fix amplitudes, trials, reps, and the threshold before running [source doc]. Guideline 5 pairs with it: report power, not just significance. "We did not detect a curve" is only meaningful next to "at this N we would have detected amplitude >= 0.75 with probability 1.0" [source doc]. And the anti-pattern: do not tune amplitude until detection succeeds and then report the detection. The sweep is the deliverable; the point estimate is not [source doc].

## The measurement-science framing

Calibration against known references is the core of measurement science: instruments are validated against standards whose value is known independently of the instrument [weak backing: https://plato.stanford.edu/entries/measurement-science, jev weight 0.43]. The standard-candle role follows the same logic; astronomy calibrates distance ladders against objects of known brightness [weak backing: https://en.wikipedia.org/wiki/Cosmic_distance_ladder, jev weight 0.11]. These are weak-weight citations used for framing only; the operational rules above come from the source doc.

## Do not reuse a calibration pack

A calibration pack is valid only for the N, d, base rate, and mode count it was computed at [source doc, anti-patterns]. Changing any of them changes the null distribution and the design, so the pack must be regenerated.

## The command shape

The source doc's example 3 shows the sweep command [source doc]:

```bash
python3 scripts/create_corpus.py calibrate -N 200 -d 9 --modes 2 \
    --amplitudes 0,0.25,0.5,0.75,1.0,1.5,2.0 --trials 8 --reps 60 --seed 0 \
    --out calibration-lens.json
```

Seven amplitudes, 8 trials each, 60 curveball reps per trial: 56 planted corpora and their nulls per run. Every knob in that command line is a pre-registered parameter, which is why guideline 4 insists they be fixed before running [source doc].

## Reading the example pack

The example output makes the verdict mechanics concrete [source doc]:

- L_cal_0.00: amplitude 0.00, mean_dV2z 0.18, power_at_z_3 0.00, verdict "YES (null as expected)", score 50. The zero-amplitude lens passing is itself a check: the pipeline must NOT detect a signal where none was planted.
- L_cal_0.50: amplitude 0.50, mean_dV2z 1.50, power_at_z_3 0.12, verdict NO, score 16. The signal is there but the design at this N cannot see it reliably; that is an honest NO.
- L_cal_0.75: amplitude 0.75, mean_dV2z 5.49, power_at_z_3 1.00, verdict YES, score 50.
- detection_threshold = 0.75, FPR_at_z_3 = 0.00, FPR_at_z_2 = 0.125.

Note FPR_at_z_2 = 0.125: at the looser |z| > 2 threshold the null ensemble produces false positives at 12.5 percent, which is why the verdict rule keys on FPR_at_z_3 < 0.05 and not on the looser cut [source doc].

## What the threshold buys downstream

The detection threshold is the calibration prior that rsi-phi-skill's gate decisions should be conditioned on [source doc, Composition]. "We use amplitude 1.0 corpora in the loop" is unfalsifiable without knowing that the pipeline's detection threshold at that N and d is 0.75; the pack is what converts the loop's gate from a ritual into a measurement.
