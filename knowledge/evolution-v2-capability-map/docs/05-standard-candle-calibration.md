# 05. Standard candles: round-trip validation and detection power

Scope: Round-trip validation and the standard candle: periodically planting a directive with a known outcome that the loop must detect, measuring detection power, catching approve-nothing and approve-everything loops, plus the selection-null discipline that applies when the loop tunes its own thresholds.

## The borrowing, made explicit

The name comes from astronomy. A standard candle is an astronomical object with a known luminosity, and several distance-measurement methods rely on it; the ladder analogy arises because no single technique can measure distances at all ranges encountered in astronomy (source: https://en.wikipedia.org/wiki/Cosmic_distance_ladder, jev weight 0.78). The key to the method is finding objects with the same, or at least known, luminosities, so that identifying the object's type lets you look up its true brightness and compare (source: https://phys.libretexts.org/Bookshelves/Astronomy__Cosmology/Big_Ideas_in_Cosmology_%28Coble_et_al.%29/06%3A_Measuring_Cosmic_Distances/6.03%3A_Standard_Candle, jev weight 0.88). An object of known luminosity is called a standard candle, and most stars are not standard candles because their luminosities are unknown, which is exactly why their distances cannot be easily calculated (source: https://users.physics.unc.edu/~reichart/ASTR101L-5.pdf, jev weight 0.66). The method's cost is identification: measuring cosmic distances with standard candles requires identifying astronomical objects or phenomena whose intrinsic properties are already established (source: https://link.springer.com/content/pdf/10.1007/978-94-007-1658-2_2.pdf, jev weight 0.91). A weakly-weighted survey adds that a standard candle is a whole class of objects whose luminosity is known because of a characteristic quality the class shares (source: https://universe-review.ca/R02-07-candle.htm, jev weight 0.44, weak).

## The loop's candle

The loop transplants the method directly. A standard candle here is a directive with a known-outcome planted into the pipeline on purpose: the loop's gate must detect it, and the detection (or missed detection) is recorded. This is round-trip validation, Procedure 1 from the is-this-x paper: the measurement instrument measures itself by checking that a signal of known strength comes out the other end.

Two degenerate failure modes are the target. A loop that approves nothing (the gate rejects everything, including real improvements and planted candles) and a loop that approves everything (the gate passes everything, including planted negatives) both fail the candle. Detection power is the measured quantity: over a series of plants, what fraction did the gate catch? A gate whose detection rate is 0 percent or 100 percent over many plants is not measuring; it is a rubber stamp or a wall.

## The practitioner analogue

Security engineering uses the same idea under a different name. Canary tokens exist precisely to plant assets whose only purpose is to be found, so that detection capability itself is being tested; practitioners note that the concept of canary tokens changes how credentials gained during an engagement are treated, because the defender's goal is increasing the time taken by an attacker (source: https://canary.tools/, jev weight 0.39, weak). Canary deployment analysis makes the same move with metrics: a canary analysis pipeline expects structured metric inputs, error rates, latency percentiles, and business KPIs, for both the canary and control groups, so health is a comparison against a known baseline rather than an impression (source: https://inferensys.com/prompts/code-review-and-bug-triage-prompts/release-readiness-and-rollback-decision-prompts/canary-deployment-health-evaluation-prompt, jev weight 0.22, weak). Both are weakly backed in this dig, so they are cited as analogues, not authority.

The astronomy analogy also sets the cadence requirement: because no single technique covers all ranges, candles are periodic, not one-time. A loop that planted one candle at launch and never again has no measurement of whether its detection power drifted as thresholds and prompts changed.

## Selection-null discipline

The companion rule covers self-tuning. If the loop tunes its own prompts or thresholds on real outcomes, the same tuning procedure must also run on nulls, and the ratio of the two improvements is what gets reported. This is the curved-corpus v2 addendum's answer to a subtle bias: a tuning procedure that always finds improvement on real data looks fine until the same procedure, run on data where no improvement exists, also finds improvement, which means it found noise. The selection-null ratio is the guard. It composes with the null-standardization rule from doc 04: real improvements get z scores against matched nulls, and the tuning procedure itself is scored the same way.

## Placement

The candle belongs to the calibration instruments module of the worker map (doc 08, module B): the atom ledger stores each plant and its detected-or-missed outcome, the dBc scale from doc 06 reports the separation, and the anti-caustic guard flags a run where every planted candle is caught with a perfect score, which is as suspicious as catching none.
