# 07 - The Performance Profiling Workflow

Scope: the skill's baseline, identify, fix, measure loop for performance work, the metrics it names, and how the dig world corroborates or extends them.

Grounding spine: source doc yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md (the "For Performance Issues" workflow).

## The 4 steps

The performance workflow is the only one of the skill's three workflows that is explicitly comparative: it requires two traces, before and after (source doc):

1. **BASELINE.** Record a performance trace of the current behavior. Without the baseline, the later "did it get better" question is unanswerable except by vibes.
2. **IDENTIFY.** Check the named metrics: Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), Interaction to Next Paint (INP), long tasks over 50 ms, and unnecessary re-renders.
3. **FIX.** Address the specific bottleneck.
4. **MEASURE.** Record another trace and compare with the baseline.

The skill's rationalizations table pre-emptively rejects the most common dodge: "Performance profiling is overkill" is answered with "A 1-second performance trace catches issues that hours of code review miss" (source doc).

## The metrics the skill names

The skill names the three Core Web Vitals plus two lower-level signals (source doc). The three vitals are the industry-standard user-experience metrics set, and the dig corroborates their definition across multiple sources, all weakly weighted in this run: LCP, INP, and CLS as the three core metrics (https://www.corewebvitals.io/core-web-vitals, jev weight 0.17, weak backing; https://loadtime.dev/core-web-vitals, jev weight 0.11, weak backing). The skill deliberately does not quote numeric thresholds for the vitals; it uses them as identify-where-to-look signals rather than as pass/fail gates.

The two lower-level signals are more actionable inside a trace:

- **Long tasks over 50 ms.** The 50 ms threshold is the standard long-task boundary from the Long Tasks API: any task that occupies the main thread longer than 50 ms risks blocking user input. Performance-observer writeups describe the same threshold and the PerformanceObserver pattern for catching such tasks (https://www.browser-rendering.com/rendering-performance-metrics-and-tooling/performanceobserver-api-patterns/, jev weight 0.16, weak backing; https://renderlog.in/blog/long-tasks-main-thread-blocking/, jev weight 0.15, weak backing).
- **Unnecessary re-renders.** A framework-level signal: the page recomputes and repaints UI that did not change. It is the skill's only metric that is not directly a browser timing; it usually shows up in a trace as clusters of style and layout work triggered by state changes.

## Why the loop is closed with a second trace

The MEASURE step is what separates performance work from performance folklore. Comparing traces isolates the effect of the fix from everything else that changed (data, network conditions, cache state). The skill's red flags list includes "Performance never measured, only assumed" as a failure state, which is the MEASURE step's absence phrased as a red flag (source doc).

Chrome's DevTools performance panel workflow, which the trace tool wraps, supports exactly this: record, inspect the flame chart and the vitals timeline, fix, record again (https://how2.sh/posts/how-to-debug-javascript-performance-with-chrome-devtools-performance-panel/, jev weight 0.15, weak backing).

## Where the weighting is honest about thinness

This subtopic's dig came back entirely below the 0.5 authoritative threshold: the strongest results were aggregator-grade explainers of Core Web Vitals. That is a dig-strength gap, not a content gap: the metric definitions are stable and well-known, and the source doc's workflow is self-contained. The doc is authored from the source doc with weak dig corroboration, labeled as such, rather than skipped, because the dig returned 5 usable results per query and none contradicted the source doc. A future refresh of this corpus should weight official sources for the vitals (web.dev and Chrome for Developers pages on LCP, INP, CLS, and the Long Tasks API) to raise the backing quality here; that is recorded as a gap in the corpus README.

## Relationship to the other workflows

Performance debugging shares the skeleton of the UI and network workflows (capture, analyze, fix, re-capture) but differs in its comparison target: where screenshots compare against the previous screenshot and network captures against the expected contract, performance traces compare against the previous trace of the same interaction (source doc). The verification checklist in doc 10 includes "Performance metrics are within acceptable ranges" as a post-change gate (source doc).

## Sources for this doc

- Source doc: yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md (primary source of record).
- https://www.corewebvitals.io/core-web-vitals (jev 0.17, weak backing)
- https://www.browser-rendering.com/rendering-performance-metrics-and-tooling/performanceobserver-api-patterns/ (jev 0.16, weak backing)
- https://renderlog.in/blog/long-tasks-main-thread-blocking/ (jev 0.15, weak backing)
- https://how2.sh/posts/how-to-debug-javascript-performance-with-chrome-devtools-performance-panel/ (jev 0.15, weak backing)
- https://loadtime.dev/core-web-vitals (jev 0.11, weak backing)
