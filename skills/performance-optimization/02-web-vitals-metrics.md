# Web Vitals Metrics

Scope: Core Web Vitals definitions and thresholds: LCP, INP, CLS, the good / needs-improvement / poor bands, and how INP replaced FID.

## The 3 metrics

The source doc defines the Core Web Vitals targets used throughout the corpus:

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | <= 2.5s | <= 4.0s | > 4.0s |
| INP (Interaction to Next Paint) | <= 200ms | <= 500ms | > 500ms |
| CLS (Cumulative Layout Shift) | <= 0.1 | <= 0.25 | > 0.25 |

These bands are the official thresholds. The strongest dig source in this subtopic, web.dev's article on how the thresholds were defined, explains that each metric measures a different aspect of user experience: LCP measures perceived load speed and marks the point in the page load timeline when the page's main content has likely loaded; INP measures responsiveness and quantifies the experience users feel when trying to interact with the page; and CLS measures visual stability (w 0.91, [web.dev](https://web.dev/articles/defining-core-web-vitals-thresholds)). The same article describes the threshold design work behind the "good" / "needs improvement" / "poor" categorization.

## INP replaced FID

The source doc's table already uses INP, which is the post-2024 state. The dig record confirms the transition with strong primary sources:

- Google's Search Central blog announced that INP would replace FID as part of Core Web Vitals in March 2024, with an update on March 12, 2024 confirming the replacement took effect (w 0.95, [developers.google.com](https://developers.google.com/search/blog/2023/05/introducing-inp)).
- The Chrome team's web.dev announcement recorded that INP was no longer experimental and would become a Core Web Vital in 2024, after being introduced as an experimental metric in May 2022 (w 0.91, [web.dev](https://web.dev/blog/inp-cwv)).
- The follow-up web.dev post states INP is now a stable Core Web Vital metric and has officially replaced First Input Delay (w 0.87, [web.dev](https://web.dev/blog/inp-cwv-march-12)).

What changed, mechanically: FID measured only the input delay of the first interaction, while INP captures the full latency from user input through JavaScript processing to the final visual update, and it considers all interactions rather than just the first one (w 0.73, weak, [corewebvitals.io](https://www.corewebvitals.io/core-web-vitals/interaction-to-next-paint)). A good INP score is 200 milliseconds or less at the 75th percentile (same source, weak backing but consistent with the official threshold set above).

Drift note: any pre-2024 guidance that references FID as a Core Web Vital is outdated as of March 12, 2024. The source doc is already on INP; older checklists elsewhere are not.

## Why the 75th percentile matters

The thresholds are defined on field data distributions, not single measurements. The official thresholds article grounds the "good" bands in how real users experience pages at scale (w 0.91, [web.dev](https://web.dev/articles/defining-core-web-vitals-thresholds)). In practice this means a synthetic lab run can report a "good" LCP while the p75 field value sits in "needs improvement"; the field number is the one that maps to the threshold table. Doc 09 uses the same p75 framing for field monitoring alerts.

## Using the table in practice

The source doc's verification checklist makes the thresholds operational: after any performance-related change, "Core Web Vitals are within Good thresholds" is an explicit checkbox. Combined with the regression guards in doc 09, the threshold table becomes the pass/fail line for both CI gates and field monitoring.

## What to remember

1. LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 are the "good" thresholds (source doc, confirmed by web.dev).
2. INP replaced FID on March 12, 2024; treat any FID-era guidance as outdated.
3. Thresholds apply at the 75th percentile of field data, not to a single lab run.
4. LCP is about perceived load speed, INP about interaction responsiveness, CLS about visual stability (w 0.91).
