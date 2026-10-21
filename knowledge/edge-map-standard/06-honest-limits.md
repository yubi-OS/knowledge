# 06. Honest Limits

**Scope:** Honest limits: detailed analysis grounded in yubi-OS/yubiOS refs/edge-map-standard-2026-10-05.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/edge-map-standard-2026-10-05.md, no external web dig

## Why this section exists

The ground source closes with an explicit list of what edge-standard-v1 does **not** establish. These are not footnotes; they bound every downstream use of the instrument, in particular the taste engine's `fractal_band` axis.

## Limit 1: comparable is not admitted

The pipeline makes measurements COMPARABLE. It does not by itself admit the taste axis.

The distinction is between a ruler and a claim made with the ruler. edge-standard-v1 guarantees that two images, two runs, or two implementations measure D the same way. Whether a given D range corresponds to human preference is a separate, empirical question about people, not about pipelines.

The doc gives a concrete reason the band cannot simply be imported: band location on our contour-class scale is a human-preference question, and contour-class peaks may sit below 1.3 according to Isherwood 2016. The paintings cross-validation (doc 05) already showed our scale runs lower and tighter than cluster-regime values. If the preference peak on contour-class images sits below 1.3, then using the 1.3 to 1.5 band unchanged would systematically misjudge images.

**Consequence**: any "in band" count, such as 8 of 18 in trial-2 or 48 of 123 in the paintings pass, is descriptive. It is not a preference result.

## Limit 2: under-inked saturation

Images where even t = 255 leaves coverage far from the 6% target get flagged `under_inked`. Their D should not be read against the band.

Mechanically: threshold selection sweeps t from 0 to 255 and picks the t whose coverage is closest to 0.06. For a very bright or near-uniform image, coverage at t = 255 may still be well above 6%, so the chosen threshold is pinned at the ceiling and the mask is denser than the contract intends. Dense masks push D up (doc 03's ink-density argument). The instrument still emits a D, but the guard tells the caller the normalization failed.

Trial-2 hit this on 2 urban images out of 18. The guard is a real, observed failure mode.

**Consequence**: consumers must check `under_inked` before using D. A consumer that ignores the flag reintroduces exactly the extraction bias the pipeline was built to remove.

## Limit 3: the per-image test is blocked on data

The full painting rating data is not published. The OSF umbrella the doc found carries a different study. Without per-image band assignments, the paintings cross-validation is limited to distribution-level comparison (range, mean, counts in region). The free path to a per-image rank test is the data request to the authors, recorded as sent on 2026-10-05.

**Consequence**: the claim "our D orders paintings like theirs" is untested, not refuted.

## Limits implied by the contract itself

Two further limits follow from the contract (doc 02), even though the honest-limits section does not list them separately:

- **Version lock**: changing TARGET_COVERAGE, MIN_COMPONENT, or the scale window is a major version bump that invalidates prior measurements. Any future retune buys better behavior at the cost of the historical record.
- **Fixture coverage**: parity is proven on 4 synthetic fixtures (doc 04). It is strong evidence the JS port matches Python, but it is coverage of those cases, not a proof over all inputs.

## The limits as a decision table

| Situation | Can I read D against the band? |
|---|---|
| `under_inked` = true | No |
| r2 < 0.98 | No |
| Comparing two edge-standard-v1 readings | Yes, for comparison |
| Claiming human preference from contour-class D | Not yet: band location unvalidated on this scale |
| Claiming per-image agreement with Viengkham and Spehar | Not yet: data requested |

## How these limits shape the rest of the wave

The later hierarchy-oracle work builds on edge-standard-v1 as a validated hierarchy and fill detector, and the hierarchy-router uses its deterministic D for routing bands. Both inherit these limits. They use D as a structural measurement (is the artifact hierarchically ordered?), which is exactly the use that comparability supports, rather than as a taste verdict, which remains gated on the open preference question.
