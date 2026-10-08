# 02 - Performance Trace Capture Workflow

Scope: the Phase 1 workflow of the web-perf audit, navigate plus trace with autoStop and reload, how cold-load capture works, and how to troubleshoot empty or failed traces.

Grounding spine: yubi-OS/yubiOS skills/web-perf/SKILL.md (source doc).

## The three-step capture

The source doc's Phase 1 is deliberately small:

1. `navigate_page(url: "<target-url>")` to load the target.
2. `performance_start_trace(autoStop: true, reload: true)` to record a trace.
3. Wait for trace completion, then retrieve results.

Each parameter is load-bearing. `reload: true` makes the tool reload the page after the trace starts, so the captured trace covers a cold load of the document rather than a warm page that already sits in cache. `autoStop: true` ends the trace automatically when the page load settles, so the agent does not have to guess a stop time. The Chrome for Developers launch post for the MCP server describes exactly this flow: "the Chrome DevTools MCP server provides a tool called performance_start_trace. When tasked to investigate the performance of your website, an LLM can use this tool to start Chrome, open your [page and record]" (https://developer.chrome.com/blog/chrome-devtools-mcp, weight 0.81).

A third-party walkthrough of the same pattern records the call as `performance_start_trace(reload=true, autoStop=true)` and frames the whole loop as replacing guesswork with data-driven measurement (https://jangwook.net/en/blog/en/chrome-devtools-mcp-performance/, weak backing, weight 0.2). That secondary framing is useful rhetorically but carries no unique facts; the tool contract in the source doc is the authority.

## Why the trace must be a page-load trace

Performance audit metrics are defined over the loading lifecycle: TTFB, FCP, LCP, and CLS are meaningless without a navigation event in the trace. This is the same discipline Puppeteer-era recipes encode, "get a DevTools performance trace for a page load", where the recording brackets the navigation itself (http://addyosmani.com/blog/puppeteer-recipes/, weight 0.52). The MCP tool's `reload: true` parameter automates what those recipes did manually. Skipping the reload produces a trace of a warm, already-rendered page and LCP of roughly 0, which looks like a false win.

## What the tool surface includes

A third-party documentation mirror of the server's source files lists the full performance and memory tool set: performance_start_trace, performance_stop_trace, performance_analyze_insight, take_memory_snapshot, and lighthouse_audit (https://deepwiki.com/ChromeDevTools/chrome-devtools-mcp/4.5-performance-analysis-tools, weak backing, weight 0.22). Two workflow implications:

1. `autoStop: true` is a convenience, not the only exit; `performance_stop_trace` exists for traces that must cover a specific interaction window (for example, capturing INP on a button press).
2. `lighthouse_audit` gives a second, opinionated lens on the same page. If trace-derived numbers and a Lighthouse run disagree, the trace wins for this skill's purposes because it is the artifact every later phase analyzes.

## Troubleshooting rules from the source doc

The source doc gives two recovery rules:

- "If trace returns empty or fails, verify the page loaded correctly with navigate_page first." An empty trace is usually a navigation failure (DNS error, blocked URL, crashed tab), not a tracer failure. Re-navigate, confirm content rendered, then retrace.
- "If insight names don't match, inspect the trace response to list available insights." The trace response carries the `insightSetId` and the catalog of insights for that specific Chrome build; insight naming is versioned and drifts (see doc 04).

Treat both rules as ordered: navigation proof precedes any claim about the tracer, and the trace response itself is the source of truth for insight names, not memory.

## Cold-load discipline

Because the trace is the evidence base for every metric rating in the report, keep it honest:

1. Capture on a fresh profile or cleared cache when judging first-visit performance; the `reload: true` reload only guarantees a re-navigation, not a cold HTTP cache.
2. Do not run other automation against the same tab during capture; competing activity pollutes the main-thread timeline that TBT and INP read from.
3. If the page requires auth or a cookie wall, complete that state before starting the trace and then reload, so the measured load is the one users see.

Sources: https://developer.chrome.com/blog/chrome-devtools-mcp (weight 0.81), http://addyosmani.com/blog/puppeteer-recipes/ (weight 0.52), https://jangwook.net/en/blog/en/chrome-devtools-mcp-performance/ (weak backing, weight 0.2), https://deepwiki.com/ChromeDevTools/chrome-devtools-mcp/4.5-performance-analysis-tools (weak backing, weight 0.22), plus yubi-OS/yubiOS skills/web-perf/SKILL.md (source doc).
