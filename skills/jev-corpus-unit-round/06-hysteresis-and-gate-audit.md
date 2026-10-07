# Hysteresis re-score and the gate-grade audit

Scope: steps 8 and 9 of the runflow. The mandatory hysteresis band on every edited-row re-score, the two failure modes it prevents, and the nulls-400 gate-grade audit that turns a re-scored row into a realized delta.

## Step 8: hysteresis, always

The re-score is never plain. `POST /api/jev/corpus/scorer/score {doc:{name,text}, hysteresis:{low:0.45, high:0.55, pre_row: <current row>}}` is the only legal re-score form (source doc yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md). For an ADD, the `pre_row` is twelve zeros, because the new doc has no prior row to hysteresis against (source doc).

The band has a name in engineering: hysteresis. A system with hysteresis has different thresholds depending on the direction of travel, which prevents a noisy signal sitting near one threshold from flapping between states (https://en.wikipedia.org/wiki/Hysteresis, weight 0.65). The Schmitt trigger is the canonical electronic example: two thresholds instead of one, so noise between them cannot re-trigger the output (https://en.wikipedia.org/wiki/Schmitt_trigger, weight 0.60; a practitioner introduction at https://www.allaboutcircuits.com/technical-articles/what-is-hysteresis-an-introduction-for-electrical-engineers/, weight 0.48, weak). The scorer applies the identical idea to bit probabilities: bits whose score sits in the 0.45 to 0.55 band keep their previous value from `pre_row` instead of being re-decided on the noise.

## What a plain re-score destroys

The source doc records the failure mode with a number. In refs5 cycle 3, a plain re-score produced +0.60 and refuted the edit; the identical edit, re-scored with hysteresis, was kept at -0.41 (source doc). Two distinct corruptions come from the missing band:

1. Manufactured wrong signs. A marginal bit that flips on threshold jitter flips the row's sign, and the realized delta then reflects coin flips, not content.
2. Silently dropped marginal bits. A plain re-score removes the bits that sit in the band, shrinking the row without recording a decision.

The refs5 F1 lesson is stated in the source doc's failure list as "marginal-bit threshold jitter: hysteresis on every edited-row re-score" (source doc). Always, not only when the score looks marginal: the operator cannot tell which bits are marginal without running the banded score anyway.

## Step 9: the gate-grade audit

With the re-scored row in hand, the matrix is rebuilt and `POST /api/jev/corpus/audit {matrix, labels, nulls: 400}` runs again (source doc). The realized delta is then `level_dbc(after) - level_dbc(before)` (source doc).

The nulls count is the part that catches people. Nulls 100 is NOT gate-grade. The refs7 F2 finding: refs6's +0.29 and +0.71 z-revisions, measured at 100 nulls, collapsed to -0.61 and -0.26 when re-measured at 400 (source doc). The mechanism is sample size: the null distribution is an estimate, and an estimate built from 100 draws is noisy enough that z deltas of a few tenths can flip sign entirely. The permutation-test framing makes this standard statistics: the null distribution must be large enough that the observed statistic is meaningfully ranked against it (https://en.wikipedia.org/wiki/Permutation_test, weight 0.67; https://en.wikipedia.org/wiki/Permutation, weight 0.71). The flow does not ask the operator to estimate whether 100 is enough for a particular delta; it fixes the floor at 400 and forbids acting on anything smaller.

## The realized delta is a difference of level quantities

Because both audits run with the same nulls count and the same level_dbc convention, the realized delta is a like-for-like difference in dB. That is what makes step 10's direction reading (aligned, inverted, zero) well-defined: predicted and realized are both in the level convention, so their relative sign is meaningful. A delta computed across different nulls counts, or against the raw dbc field, is not interpretable as a direction, and the flow treats it as no measurement at all.

## What this record does not claim

This record does not describe how the realized delta is judged (bearing and snapback, doc 07), and it does not claim a closed-form relationship between band width and corpus size; the 0.45 and 0.55 values are protocol constants carried by the source doc and validated across rounds refs2 through refs9.

Sources: yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md (source doc); Wikipedia, Hysteresis (https://en.wikipedia.org/wiki/Hysteresis, weight 0.65); Wikipedia, Schmitt trigger (https://en.wikipedia.org/wiki/Schmitt_trigger, weight 0.60); Wikipedia, Permutation test (https://en.wikipedia.org/wiki/Permutation_test, weight 0.67); Wikipedia, Permutation (https://en.wikipedia.org/wiki/Permutation, weight 0.71); All About Circuits, hysteresis introduction (https://www.allaboutcircuits.com/technical-articles/what-is-hysteresis-an-introduction-for-electrical-engineers/, weight 0.48, weak).
