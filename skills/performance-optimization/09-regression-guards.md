# Regression Guards

Scope: Step 5 regression prevention: performance budgets (bundle, image, API p95), synthetic CI gates with bundlesize and Lighthouse CI, and p75 RUM field monitoring with CrUX lag.

## Guard the metric the user feels

The source doc's Step 5 (GUARD) rule: guard the metric the user actually feels, not every available number. Use the same LCP, INP, p95 latency, or other primary metric that justified the fix. When either guard fires, return to Step 1 and establish a fresh baseline before proposing another fix.

## Budgets

The source doc's budget list:

```
JavaScript bundle: < 200KB gzipped (initial load)
CSS: < 50KB gzipped
Images: < 200KB per image (above the fold)
Fonts: < 100KB total
API response time: < 200ms (p95)
Time to Interactive: < 3.5s on 4G
Lighthouse Performance score: >= 90
```

Enforcement in CI, per the source doc:

```bash
npx bundlesize --config bundlesize.config.json
npx lhci autorun
```

The synthetic CI gate catches reproducible regressions before merge. The source doc adds 2 anti-flake rules for the gate: repeat noisy measurements or compare a median or trend, so normal run-to-run variance does not turn the gate into a flaky check. The Lighthouse CI dig results cluster around budget.json configuration and assertions, the strongest at w 0.47 (weak, [unlighthouse.dev](https://unlighthouse.dev/learn-lighthouse/lighthouse-ci/budgets)), which confirms that Lighthouse CI supports budget files and assertion presets to block regressions in CI/CD; the rest are 0.15 to 0.23. The budget mechanism itself is carried by the source doc.

## Field monitoring

For user-facing surfaces, the source doc pairs the CI gate with field monitoring: alert on a meaningful p75 movement in RUM data. Use attributed web-vitals data to locate the cause, and treat CrUX's rolling window as confirmation rather than an immediate alert, because CrUX updates on a delay.

The web-vitals library (doc 03) is the collection mechanism: onLCP, onINP, and onCLS callbacks send metrics to an analytics endpoint via sendBeacon or fetch keepalive (w 0.94, [developers.google.com](https://developers.google.com/codelabs/chrome-web-vitals-js); w 0.91, [web.dev/articles/vitals](https://web.dev/articles/vitals)). The attribution build of the library provides the "locate the cause" half. RUM-setup dig results are weak-backed (0.18 to 0.32) and add no claims beyond the source doc's alerting rule.

## The strongest dig in this subtopic

A web.dev article on correlating Core Web Vitals with ad revenue using Google tools (w 0.79, [web.dev](https://web.dev/articles/cwv-impact-ad-revenue)) provides the business grounding for why guards matter: it documents tooling for correlating CWV improvements with revenue outcomes. It supports the doc-01 claim that users notice latency, with the strong end of this subtopic's weight range.

## Two layers, one metric

| Layer | Catches | Latency to detect | Anti-flake rule |
|---|---|---|---|
| Synthetic CI gate | Reproducible regressions before merge | At PR time | Repeat noisy measurements, compare median or trend |
| Field monitoring | Real-world regressions the lab cannot see | Days, gated on p75 movement | Alert on meaningful p75 movement, not per-user noise |

The pairing matters because the 2 layers fail differently: a CI gate passes while a CDN change or third-party script degrades the field, and field monitoring alone would let an obvious bundle-size regression merge. The source doc's verification checklist closes the loop: "the measured user-facing metric has a synthetic budget or field monitor that can detect regression" is an explicit checkbox after any performance change.

## What to remember

1. Budgets are explicit numbers: 200KB JS gzipped, 200ms p95 API, Lighthouse score at least 90 (source doc).
2. Enforce synthetic budgets in CI with bundlesize and lhci autorun (source doc; w 0.47).
3. Repeat noisy CI measurements or gate on a median or trend to avoid a flaky check (source doc).
4. Alert on p75 RUM movement; use attribution to locate the cause; CrUX is confirmation, not alerting (source doc).
5. When a guard fires, return to Step 1 with a fresh baseline (source doc).
