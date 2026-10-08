# performance-optimization knowledge corpus

Ground source: yubi-OS/yubiOS skills/performance-optimization/SKILL.md. Topic: optimizing application performance - when performance requirements exist, profiling bottlenecks, regression detection, and Core Web Vitals improvement. The corpus explicates the skill: each doc deepens one section of the source doc, with claims attributed to the source doc or to dug web sources carrying jev (typesafe/jev-1.13) weights.

## Docs

- 01-measure-first-discipline.md - Measure first discipline: trigger conditions, the 5-step workflow, and the cost of premature optimization.
- 02-web-vitals-metrics.md - Web Vitals metrics: LCP/INP/CLS thresholds and the March 2024 INP-for-FID replacement.
- 03-measurement-tooling.md - Measurement tooling: synthetic (Lighthouse, DevTools) vs RUM (web-vitals library, CrUX) and lab-vs-field divergence.
- 04-bottleneck-triage.md - Bottleneck triage: the symptom-driven decision tree and frontend/backend symptom tables.
- 05-data-access-anti-patterns.md - Data-access anti-patterns: N+1, unbounded fetching, EXPLAIN ANALYZE index design, connection pools.
- 06-frontend-anti-patterns.md - Frontend anti-patterns: responsive images, React re-render control, bundle size and code splitting.
- 07-caching-strategy.md - Caching strategy: layer choice, key correctness, invalidation strategies, stampede prevention.
- 08-verify-or-revert.md - Verify or revert: same-conditions re-measurement, noise vs gain, neutral-is-a-revert, the performance ledger.
- 09-regression-guards.md - Regression guards: performance budgets, bundlesize and Lighthouse CI gates, p75 RUM field monitoring.
- 10-verification-checklist.md - Verification checklist, rationalizations table, and red flags, grounded in the source SKILL.md.

## Research summary

- Results collected: 108 (18 searXNG queries across 9 web-shaped subtopics; subtopic 10 is an internal-record subtopic with no dig)
- Weight split: 15 high (>= 0.5) / 93 low (< 0.5) of 108 weighted
- jev requests: 10 (1 outline score validation + 9 noul weighting batches), usage 12763 input / 2242 output tokens
- Redos: 0 (all batches succeeded on the first attempt)
- Skipped docs: none (all 10 subtopics authored)

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); DefAPI /api/v1/decisions (typesafe/jev-1.13) 200.

## Research DB

See research-db/ for preflight.json, outline.json, archive.json, digs/, jev-log.json, and db.ts (schema v2).
