# 03 - Core Web Vitals Metrics and Thresholds

Scope: the metric set the web-perf skill rates (TTFB, FCP, LCP, INP, TBT, CLS, Speed Index), the good/needs-improvement/poor bands it applies, and where those bands come from.

Grounding spine: yubi-OS/yubiOS skills/web-perf/SKILL.md (source doc).

## The threshold table

The source doc pins these bands, reproduced exactly:

| Metric | Good | Needs improvement | Poor |
|---|---|---|---|
| TTFB | < 800ms | < 1.8s | > 1.8s |
| FCP | < 1.8s | < 3s | > 3s |
| LCP | < 2.5s | < 4s | > 4s |
| INP | < 200ms | < 500ms | > 500ms |
| TBT | < 200ms | < 600ms | > 600ms |
| CLS | < 0.1 | < 0.25 | > 0.25 |
| Speed Index | < 3.4s | < 5.8s | > 5.8s |

These are the numbers the report's ratings column must use. Do not re-derive them.

## Where the Core Web Vitals thresholds come from

Three of these metrics are Google's Core Web Vitals: LCP, INP, and CLS. The web.dev article that defines them states the design criteria for choosing the bands: "High-quality user experience. Achievable by existing web content" (https://web.dev/articles/defining-core-web-vitals-thresholds, weight 0.92). That second criterion is why thresholds move rarely and deliberately: a band that no site can meet is not a standard.

Independent 2026 secondary sources confirm the bands have not drifted: "Google's own web.dev Core Web Vitals documentation still lists the same three 'Good' thresholds this guide uses: LCP under 2.5 s, INP under 200 ms, CLS under 0.1, all measured at the 75th percentile of CrUX field data" (https://yusmpgroup.com/blog/web-app-performance-core-web-vitals-2026, weak backing, weight 0.15); "2026 Core Web Vitals: LCP Good under 2.5s, INP Good under 200ms, CLS Good under 0.1. INP replaced FID in 2024" (https://prooflytics.io/blog/core-web-vitals-thresholds-2026-lcp-inp-cls, weak backing, weight 0.12). The weak weights are honest: these are blog aggregators, cited only as corroboration that the source doc matches current public numbers, never as the origin of the bands.

## Field versus lab metrics

The source doc's table mixes two families, and the report must not blur them:

- Core Web Vitals (LCP, INP, CLS) are field metrics, aggregated at the 75th percentile of CrUX data (https://yusmpgroup.com/blog/web-app-performance-core-web-vitals-2026, weak backing, weight 0.15).
- TTFB, FCP, TBT, and Speed Index are lab-instrumented metrics in this workflow; one practitioner guide frames the same split as "LCP, INP, and CLS in the field, plus TTFB, FCP, TBT, and Speed Index in the lab" (https://llmranks.io/learn/core-web-vitals, weak backing, weight 0.12).

The audit's trace numbers are lab numbers. When the client compares your LCP against their Search Console data, they are comparing different percentiles of different populations; state that explicitly rather than reconciling them silently. Google's own Search Console documentation groups URLs by Poor, Need improvement, and Good across CLS, INP, and LCP from field data (https://support.google.com/webmasters/answer/9205520?hl=en, weight 0.81, see doc 08).

## INP replaced FID

The 200ms/500ms INP bands apply to Interaction to Next Paint, which replaced First Input Delay as a Core Web Vital in 2024 (https://prooflytics.io/blog/core-web-vitals-thresholds-2026-lcp-inp-cls, weak backing, weight 0.12). Practical consequence: any pre-2024 checklist recommending "keep FID under 100ms" is stale. INP is stricter because it covers the whole interaction-to-paint window, not just input delay, so long tasks on the main thread now count against interaction quality.

## The supplementary lab metrics

TTFB (800ms/1.8s), FCP (1.8s/3s), TBT (200ms/600ms), and Speed Index (3.4s/5.8s) complete the table. They exist in the table because they diagnose what the Core Web Vitals only report: TTFB isolates server latency, FCP isolates first paint, TBT isolates main-thread blocking during load, Speed Index isolates visual completeness pacing. One metrics reference lists exactly this set as "every Lighthouse metric: LCP, TBT, CLS, INP, FCP, Speed Index, and TTFB. Exact thresholds, exact scoring weights, and what actually moves your score" (https://www.lighthouse-aimetrics.com/blog/lighthouse-metrics, weak backing, weight 0.13). Lighthouse itself runs "audits for performance, accessibility, progressive web apps, SEO, and more" against any web page (https://developer.chrome.com/docs/lighthouse/, weight 0.94), and its scoring treatment of these metrics is covered in doc 08.

## Rating discipline

1. Rate each metric with the table, and say "already excellent" when everything is green; the source doc's guideline is explicit that a 200ms LCP and 0 CLS site needs no rescue.
2. Never average across metrics. A 1.9s LCP and a 0.3 CLS is one green, one red.
3. Quote the band edge the value crossed ("LCP 4.3s crosses the 4s poor boundary"), not just "poor".

Sources: https://web.dev/articles/defining-core-web-vitals-thresholds (weight 0.92), https://developer.chrome.com/docs/lighthouse/ (weight 0.94), https://support.google.com/webmasters/answer/9205520?hl=en (weight 0.81), https://yusmpgroup.com/blog/web-app-performance-core-web-vitals-2026 (weak backing, weight 0.15), https://prooflytics.io/blog/core-web-vitals-thresholds-2026-lcp-inp-cls (weak backing, weight 0.12), https://llmranks.io/learn/core-web-vitals (weak backing, weight 0.12), https://www.lighthouse-aimetrics.com/blog/lighthouse-metrics (weak backing, weight 0.13), plus yubi-OS/yubiOS skills/web-perf/SKILL.md (source doc).
