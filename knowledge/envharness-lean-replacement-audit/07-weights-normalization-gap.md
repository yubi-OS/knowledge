# the rounding-normalization gap

Scope: the one false claim the audit found: envharness's fixed-precision failure-axis weights need not sum to 1, the kernel-checked counterexample, and the repair.

## The finding

`orchestration/objectives.py`'s `_weights_from_failure_axes` emits failure-axis weights at 3-decimal precision: each weight is `round(v/s, 3)` where v is an axis count and s the total (audit, from source at HEAD pushed 2026-08-21). The docstring-level assumption, inherited by any downstream consumer that treats the weights as a distribution, is that they sum to 1. They need not.

The section 15 formalization captures this as `weights_round_gap` (the negation) and `weights_exact_sum` (the exact-arithmetic repair), and the audit ships a kernel-checked instance: failure-axis counts (0, 0, 0, 0, 1) produce per-mille floors that sum to 999, not 1000. The error per weight is at most 0.0005 from rounding, so a vector of n axes can miss unity by up to n times 0.0005, silently. The audit's summary: downstream consumers treating them as a distribution inherit a silent leak of at most n times 0.0005.

## Why fixed-precision emission loses mass

The mechanism is standard floating-point behavior: arithmetic operations approximate real arithmetic by rounding any result that is not itself representable [1] (weight 0.862), and IEEE-754 defines the rounding options (round to nearest, toward zero, toward plus or minus infinity) that decide where the mass goes [2] (weight 0.783). Rounding each share independently and then consuming the vector as if the shares still tile the unit interval is the error. There is no bug in any single rounding; the bug is in the contract between the rounding step and the consumer.

## The repair: exact arithmetic plus a remainder-distribution rule

The audit states the fix in two parts:

1. **Exact-arithmetic weights** (numerators over the common denominator) are exactly normalized, because the sum of numerators equals the denominator by construction. This is the `weights_exact_sum` half.
2. **Any fixed-precision emission** (if fixed-precision output is required for interchange) needs a remainder-distribution rule that allocates the leftover mass deliberately instead of letting each round trip discard it independently.

The canonical remainder-distribution rule is the largest remainder method: compute each share's ideal value, floor it, then hand the remaining units to the entries with the largest fractional remainders until the total is exact. It is the standard method of apportionment, and the literature documents both its naturalness and its pathologies (paradoxes under vote shifts) [3] (weight 0.915). A worked treatment of proportional seat rounding describes the same floor-plus-largest-remainder allocation [4] (weight 0.782). The Wikipedia article gives the method's definition and its use in electoral systems [5] (weight 0.243, weak backing, labeled; the definition itself is uncontroversial and corroborated by the two sources above). A community wiki page adds implementation notes [6] (weight 0.389, weak, labeled).

For envharness the proposal (audit follow-up 3) is to fix the emission upstream with largest-remainder allocation and to attach the section 15 instance as the reproduction case: counts (0, 0, 0, 0, 1) in, a vector summing to 1 out.

## Why this row matters beyond its size

The weight leak is small in magnitude and large in lesson. It is the audit's only case where formalization did not merely strengthen a true claim but falsified one, and the failure mode (silently non-unit mass) is invisible in any single run and only detectable against the contract itself. It also has a practical consequence: the Tier 2 swap (the curveball objective) consumes failure-axis weights, so feeding it a non-unit distribution would corrupt the incidence construction downstream.

## Sources

1. https://en.wikipedia.org/wiki/Floating-point_arithmetic (weight 0.862)
2. https://cs357.cs.illinois.edu/textbook/notes/rounding.html (weight 0.783)
3. https://dominik-peters.de/lectures/2023_comsoc_apportionment.pdf (weight 0.915)
4. http://jdawiseman.com/papers/electsys/apportionment.html (weight 0.782)
5. https://en.wikipedia.org/wiki/Largest_remainder_method (weight 0.243, weak backing, labeled)
6. https://electowiki.org/wiki/Largest_remainder_method (weight 0.389, weak backing, labeled)

The function name, the rounding formula, the kernel-checked counterexample, and the fix proposal derive from the source audit of google-research/envharness at HEAD (2026-08-21). Stack Overflow pages on float-sum minimization (0.048) and round-before-normalize (0.034), an apportionment mathematics overview (0.379), a highest-averages page (0.264), a GitLab merge request (0.103), and an off-topic Minecraft page (0.091) from the dig were not used.
