# 08: UI presentation constraints for a radius instrument

Scope: how the interface presents profiles, canonical counts, fractions, clipped and normalized areas, correctly bracketed intervals and named witnesses; how missing or legacy profiles are handled; markup escaping; and why no radius slider or best-radius picker exists.

## What uncertainty presentation research demands

A radius diagnostic's UI shows derived quantities: a count of isolated items, a fraction, a clipped area, an interval between two radii. The research literature on uncertainty visualization is blunt about the risk: when a data point is drawn in a specific location, readers tend to interpret it as exact, so uncertainty presentation must fight the reader's default interpretation (source: https://f0nzie.github.io/dataviz-wilke-2020/visualizing-uncertainty.html , jev weight 0.58). Surveys of the field distinguish explicit and implicit representations of distributions and different ways to show summary statistics (source: https://pmc.ncbi.nlm.nih.gov/articles/PMC9580861/ , jev weight 0.85), and note that some research finds interval plots alone insufficient for comprehension, with more expressive forms helping (source: http://space.ucmerced.edu/Downloads/publications/Uncertainty_Visualization_Padilla_Kay_Hullman_2022.pdf , jev weight 0.81).

The radius UI takes the following stance inside that landscape: it presents the exact quantities the instrument computed, in forms that keep their provenance visible, and it refuses to present anything that would imply a statistical claim the instrument does not make.

## The presented quantities

For each radius profile the UI displays:

1. The profile itself: the isolation counts at the five fixed grid radii.
2. Canonical counts: the item-level counts, stated as whole numbers.
3. Fractions: counts as fractions of the corpus, so magnitude is readable without mental division.
4. Clipped and normalized areas: the S_R and S_R/N quantities of doc 02, labeled by their formula shape rather than by an interpretation.
5. Transition intervals with correct bracketing: included and excluded endpoints distinguished, per the bracket semantics of doc 03. Interval notation makes the include/exclude distinction the entire content of bracket choice (source: https://www.mathsisfun.com/sets/intervals.html , jev weight 0.31, weak backing).
6. Named boundary witnesses: the items sitting at each bracket, at most 8 shown with total/shown counts when more exist, and full names preserved.

## Bracket correctness and false precision

Two failure modes dominate threshold-UI design:

1. False precision: showing more digits or more certainty than the computation supports. Commentary on the problem argues that precision should serve the user's decision, not the pipeline's numeric output (source: https://builtin.com/articles/design-problems-precision , jev weight 0.31, weak backing), and reporting guidance warns that false precision creeps into results and reporting at every stage (source: https://www.voxco.com/resources/how-to-avoid-fostering-false-precision , jev weight 0.12, weak backing). The radius UI's countermeasure is structural rather than stylistic: every displayed number is one the instrument defines and computes, and the interval semantics (computed distances, not confidence intervals) are stated in the interface itself.
2. Bracket drift: an interval displayed as (a, b) when the semantics are [a, b) or the reverse. Because cells use right endpoints and brackets are explicit (doc 03), the UI is required to render the exact bracket, not a canonical-looking approximation.

## Missing and legacy profiles

Not every record has a profile. Legacy maps predate the diagnostic, and read-time enrichment can fail (doc 07). The UI handles both explicitly: a missing or legacy profile is a stated state, not a blank cell and not a substituted default. This matches the API contract, where a failed enrichment yields an explicit radius_profile_unavailable reason while the record itself stays readable (doc 07). The general accessibility principle applies: screen readers speak one cell at a time and rely on associated header cells for context, so an empty state must be a real, labeled cell rather than visually implied whitespace (source: https://www.w3.org/WAI/tutorials/tables/ , jev weight 0.45, weak backing; semantic markup guidance at https://accessibility.build/guides/accessible-data-tables , jev weight 0.38, weak backing).

## Markup escaping

Witness names are corpus item names, which are arbitrary text and therefore an injection surface. The UI escapes markup in witness rendering, so an item name containing HTML renders as text. The motivating implementation's radius browser suite includes escaped-markup cases among its checks (doc 09).

## The refusal: no slider, no best radius

The UI deliberately ships no radius slider and no best-radius selection. Three reasons, in order of importance:

1. Selection is a policy act. Choosing an operative radius is a decision about the instrument; embedding it in the UI would let a diagnostic silently become a tuning control, violating the diagnostic-only scope of doc 05.
2. A slider implies the radius is free to move, which it is not. The grid is fixed (doc 03) and attempts to change it are rejected at the API level; a UI control that the API rejects would be dishonest furniture.
3. Best-radius framing implies an optimum exists, which is exactly the forecasting-claim-shaped overreach the instrument refuses (doc 05). The research framing supports caution: uncertainty displays are meant to inform judgment, not to collapse it into a single recommended value (source: https://pmc.ncbi.nlm.nih.gov/articles/PMC9580861/ , jev weight 0.85).

## Summary

1. The UI presents exactly the computed quantities: profile counts, canonical counts, fractions, clipped and normalized areas, bracketed intervals, and named witnesses with caps.
2. Brackets are rendered exactly as defined, with included and excluded endpoints distinguished, fighting both false precision and bracket drift.
3. Missing and legacy profiles are explicit states, consistent with the API's radius_profile_unavailable semantics.
4. Witness markup is escaped; item names are untrusted text.
5. There is no radius slider and no best-radius picker, because selection is policy and the instrument is diagnostic-only.

Project record: the motivating implementation's UI behavior and its radius browser suite receipts are recorded at https://github.com/yubi-OS/yubiOS/pull/233 .
