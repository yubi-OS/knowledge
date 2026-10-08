# Bottleneck Triage

Scope: Symptom-driven bottleneck identification: the where-to-start decision tree for slow pages, sluggish interaction, and backend slowness, plus the frontend and backend symptom tables.

## Triage by symptom

The source doc's central triage artifact is a decision tree that starts from the question "What is slow?" and routes each symptom to a first measurement:

- First page load: if the bundle is large, measure bundle size and check code splitting; if the server response is slow, measure TTFB in the DevTools Network waterfall and split DNS (add dns-prefetch or preconnect for known origins), TCP/TLS (enable HTTP/2, check edge deployment, keep-alive), and server wait (profile backend, check queries and caching); if render-blocking resources are suspected, check the network waterfall for CSS and JS blocking.
- Interaction feels sluggish: UI freezes on click point to main-thread work, so profile the main thread and look for long tasks over 50ms; form input lag points to re-renders or controlled component overhead; animation jank points to layout thrashing and forced reflows.
- Page after navigation: data loading slowness means measure API response times and check for waterfalls; client rendering slowness means profile component render time and check for N+1 fetches.
- Backend or API: a single slow endpoint means profile database queries and check indexes; all endpoints slow means check connection pool, memory, and CPU; intermittent slowness means check for lock contention, GC pauses, and external dependencies.

The tree encodes the source doc's core claim: the symptom decides what to measure first, and the first measurement is cheap and specific rather than a full profiling sweep.

## Frontend symptom table

The source doc maps frontend symptoms to likely causes and investigations:

| Symptom | Likely Cause | Investigation |
|---------|-------------|---------------|
| Slow LCP | Large images, render-blocking resources, slow server | Check network waterfall, image sizes |
| High CLS | Images without dimensions, late-loading content, font shifts | Check layout shift attribution |
| Poor INP | Heavy JavaScript on main thread, large DOM updates | Check long tasks in Performance trace |
| Slow initial load | Large bundle, many network requests | Check bundle size, code splitting |

The fixes for each row live in doc 06 (images, bundles, re-renders). The triage rule is that the investigation column is where you start, not where you stop: layout shift attribution, for example, names the exact element that moved.

## Backend symptom table

| Symptom | Likely Cause | Investigation |
|---------|-------------|---------------|
| Slow API responses | N+1 queries, missing indexes, unoptimized queries | Check database query log |
| Memory growth | Leaked references, unbounded caches, large payloads | Heap snapshot analysis |
| CPU spikes | Synchronous heavy computation, regex backtracking | CPU profiling |
| High latency | Missing caching, redundant computation, network hops | Trace requests through the stack |

Backend digs were thin (all results below the 0.5 authority line, including a database-tuning overview at w 0.45, weak, [databasesystemsauthority.com](https://databasesystemsauthority.com/database-performance-tuning/) and a bottleneck-identification survey at w 0.28, weak, [site24x7.com](https://www.site24x7.com/blog/identifying-performance-bottlenecks-in-complex-applications)). The triage table itself is carried by the source doc; the dig record exists but contributes no additional strong claims.

## Why triage precedes fixing

Every anti-pattern doc in this corpus (docs 05, 06, 07) assumes you already know which symptom you are treating. The source doc is explicit that "identify the actual bottleneck (not assumed)" is its own workflow step, between measure and fix. Skipping it is how neutral or harmful optimizations get shipped: the fix addresses a plausible cause instead of the measured one, and Step 4 then reverts it (doc 08).

## What to remember

1. Route by symptom first: load vs interaction vs navigation vs backend.
2. Long tasks over 50ms on the main thread are the INP-side signature (source doc).
3. Every-endpoint-slow with mostly idle database sessions is the connection-pool signature (source doc, detailed in doc 05).
4. Intermittent slowness points to contention, GC, or external dependencies, not to code you can cache.
5. The investigation column of each table is the starting measurement, not the fix.
