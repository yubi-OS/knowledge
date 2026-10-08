# 04 - Insight Analysis via performance_analyze_insight

Scope: how Phase 2 extracts Core Web Vitals diagnoses from a recorded trace using `performance_analyze_insight`, the insight names to expect, and how to handle naming drift across Chrome versions.

Grounding spine: yubi-OS/yubiOS skills/web-perf/SKILL.md (source doc).

## What insights are

Performance Insights are "actionable insights on your website's performance and are available in both the DevTools Performance panel and Lighthouse" (https://developer.chrome.com/docs/performance/insights, weight 0.95). The MCP tool wraps this panel feature: after a trace, the agent calls `performance_analyze_insight(insightSetId: "<id-from-trace>", insightName: "...")` to pull one insight's structured findings. The `insightSetId` comes from the trace response; it identifies the recorded trace's insight collection.

## The source doc's insight catalog

The source doc maps metrics to insight names:

| Metric | Insight name | What it reports |
|---|---|---|
| LCP | `LCPBreakdown` | Time to largest contentful paint, split into TTFB, resource load delay, resource load time, and render delay |
| CLS | `CLSCulprits` | Elements causing layout shifts: images without dimensions, injected content, font swaps |
| Render blocking | `RenderBlocking` | CSS and JS blocking first paint |
| Document latency | `DocumentLatency` | Server response time issues |
| Network dependencies | `NetworkRequestsDepGraph` | Request chains delaying critical resources |

The official docs confirm the underlying insights exist and explain what each targets:

- The LCP breakdown insight is documented as reporting "the render time of the largest image, text block, or video visible in the viewport, relative to when the user first navigated to the page" (https://developer.chrome.com/docs/performance/insights/lcp-breakdown, weight 0.95). The doc names its author and publication date (Connor Clark, Oct 8, 2025), so the insight is current Chrome-era documentation, not legacy guidance.
- The render-blocking insight states the diagnostic plainly: "Requests are blocking the page's initial render, which may delay LCP. Deferring or inlining can move these network requests out of the critical path" (https://developer.chrome.com/docs/performance/insights/render-blocking, weight 0.95).
- The document-latency insight surfaces concrete server-side causes with an example phrasing: "The response was uncompressed. DevTools reports that the document latency can be reduced by eliminating redirects" (https://developer.chrome.com/docs/performance/insights/document-latency, weight 0.93). Its remedy list includes infrastructure moves: "Use a CDN to reduce network latency. This is particularly effective if the document can be cached at the edge".
- The network dependency tree insight's guidance is directional: "Avoid chaining critical requests by reducing the length of chains, reducing the download [size]" (https://developer.chrome.com/docs/performance/insights/network-dependency-tree, weight 0.92), and it even carries stack-specific sections such as Magento.

## Naming drift is the main operational hazard

The source doc's own warning: "Insight names may vary across Chrome DevTools versions. If an insight name doesn't work, check the insightSetId from the trace response to discover available insights." Do not hardcode a private catalog. The recovery procedure is always the same three steps: re-read the trace response, list the insights it exposes for this Chrome build, then call analyze with the exact name from that list. A failed insight call is a naming problem until proven otherwise, not a trace problem.

## Field-data complement

Insight analysis is lab-only. To contextualize lab findings against real users, the same documentation family covers reading CrUX data through PageSpeed Insights: "PageSpeed Insights (PSI) is a tool for web developers to understand what a page's performance is and how to improve it. In this guide, learn how to use PSI to extract insights from CrUX and better understand the user experience" (https://developer.chrome.com/docs/crux/guides/pagespeed-insights, weight 0.87). Use it in the report's context section, not as a substitute for the trace.

## Scope boundaries

1. Microsoft Edge exposes a parallel performance features reference, and its coverage overlaps but is not identical (https://learn.microsoft.com/en-us/microsoft-edge/devtools/performance/reference, weak backing, weight 0.38). Since chrome-devtools-mcp officially supports Chrome and Chrome for Testing only (doc 01), Edge documentation is useful background, never the contract.
2. An insight that reports nothing is a finding, not a failure: an absent CLS culprit list means the trace shows no significant shifts. Report it as clean rather than omitting the metric.
3. Quantify from the insight's own numbers (the source doc's "use estimated savings from insights" rule); an insight with 0ms estimated impact is noted but not recommended for action.

Sources: https://developer.chrome.com/docs/performance/insights (weight 0.95), https://developer.chrome.com/docs/performance/insights/lcp-breakdown (weight 0.95), https://developer.chrome.com/docs/performance/insights/render-blocking (weight 0.95), https://developer.chrome.com/docs/performance/insights/document-latency (weight 0.93), https://developer.chrome.com/docs/performance/insights/network-dependency-tree (weight 0.92), https://developer.chrome.com/docs/crux/guides/pagespeed-insights (weight 0.87), https://learn.microsoft.com/en-us/microsoft-edge/devtools/performance/reference (weak backing, weight 0.38), plus yubi-OS/yubiOS skills/web-perf/SKILL.md (source doc).
