# Measurement Tooling

Scope: Synthetic vs RUM measurement: Lighthouse and DevTools performance profiling, the web-vitals JavaScript library, and CrUX field data.

## Two complementary approaches

The source doc mandates both measurement modes:

- Synthetic (Lighthouse, DevTools Performance tab): controlled conditions, reproducible, best for CI regression detection and isolating specific issues.
- RUM (web-vitals library, CrUX): real user data in real conditions, required to validate that a fix actually improved user experience.

The source doc's frontend tooling examples use Lighthouse in Chrome DevTools or in CI, Chrome DevTools Performance tab recording, and the web-vitals library in code:

```js
import { onLCP, onINP, onCLS } from 'web-vitals';
onLCP(console.log);
onINP(console.log);
onCLS(console.log);
```

Backend measurement, per the source doc, uses response time logging, application performance monitoring (APM), database query logging with timing, and simple `console.time` / `console.timeEnd` pairs around slow spans.

## The web-vitals library

The dig sources for the library are strong and official:

- The GoogleChrome/web-vitals repository describes itself as the library of essential metrics for a healthy site, and documents a practical constraint: avoid calling the Web Vitals functions (onCLS, onINP, onLCP) repeatedly per page load without a good reason, because each call creates a PerformanceObserver instance and registers event listeners for the lifetime of the page (w 0.94, [github.com/GoogleChrome/web-vitals](https://github.com/GoogleChrome/web-vitals)).
- The npm package page documents both the standard build and the "attribution" build; measuring real-user scores is a first step, and attribution is the step that locates what to fix (w 0.61, [npmjs.com/package/web-vitals](https://www.npmjs.com/package/web-vitals)).
- Google's codelab shows the canonical reporting pattern: send each metric to an analytics endpoint on change, using `navigator.sendBeacon()` when available with a `fetch()` keepalive fallback (w 0.94, [developers.google.com](https://developers.google.com/codelabs/chrome-web-vitals-js)).
- The web.dev vitals article shows the same sendToAnalytics pattern in production-ready form (w 0.91, [web.dev/articles/vitals](https://web.dev/articles/vitals)).

The attribution build matters for the workflow in doc 04: a raw INP value tells you the user felt a delay; the attribution build tells you which interaction, which long task, and which layout shift caused it.

## Lab vs field

The source doc says RUM is required to validate a fix, and the dig record explains why lab and field numbers diverge. A DebugBear article (w 0.45, weak, [debugbear.com](https://www.debugbear.com/blog/lighthouse-lab-data-not-matching-field-data)) lays out the mechanism: the lab environment is fixed, so results between test runs are relatively consistent and it can capture detailed diagnostic data; field data is collected by measuring the experience of real users, which Google publishes through the Chrome User Experience Report (CrUX). The remaining CrUX-vs-Lighthouse dig results are all weak-backed (0.17 to 0.23) and add no claims beyond that mechanism.

Practical reading for the corpus: lab data answers "can I reproduce and isolate this?" and field data answers "did users actually get faster?". The source doc's Step 4 (verify) requires re-measurement under the same conditions as the baseline, which is a lab-side discipline; its Step 5 (guard) requires p75 field monitoring, which is the RUM side.

## Choosing what to measure first

The source doc's where-to-start tree (covered fully in doc 04) leans on these same tools: TTFB in the DevTools Network waterfall for slow server response, bundle size analysis for slow first load, Performance trace long tasks for sluggish interaction, and database query logs for backend endpoints. The tooling doc's contribution is the pairing rule: every user-facing symptom should get a synthetic measurement (to reproduce) and a field measurement (to confirm impact).

## What to remember

1. Synthetic for reproducibility and CI; RUM for ground truth about user experience (source doc).
2. Use the web-vitals library's onLCP / onINP / onCLS callbacks to ship field data to analytics (w 0.91 to 0.94).
3. Do not register repeated observers per page load; each call costs listeners for the page lifetime (w 0.94).
4. Use the attribution build when a bad score needs a cause (w 0.61).
5. Lab and field will disagree; the field number is the one the thresholds in doc 02 apply to.
