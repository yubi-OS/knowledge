# Caching Strategy

Scope: Caching decisions: layer selection (in-process, shared, edge), cache key design for correctness, invalidation strategies, stampede prevention, and what not to cache.

## When to cache at all

The source doc's rule: cache what is expensive to produce and read far more often than it changes. Caching a query that was already fast adds a network hop, a staleness bug, and an eviction policy to maintain, in exchange for nothing. The rationalizations table repeats it: "Just cache it" is an excuse; cache what is expensive AND re-read far more than written.

## Pick the layer deliberately

| Layer | Visible to | Use when | Cost |
|---|---|---|---|
| In-process (Map, LRU) | One instance | Small, hot, per-instance staleness is acceptable | Each instance drifts independently; invalidation reaches only one |
| Shared (Redis, Memcached) | All instances | Instances must agree, or the value is expensive to recompute | A network hop, and another service to run and monitor |
| CDN / edge | Everyone, per URL | Responses are public and identical for a given key | Invalidation is the hard part; assume you cannot recall a bad response quickly |

The code patterns in the source doc: an in-process TTL cache for app config read from the database (5-minute TTL, expiry checked before the query), long-lived immutable HTTP caching for static assets (`maxAge: '1y'`, `immutable: true`, content-hashed filenames), and `Cache-Control: public, max-age=300` for cacheable API responses.

## Key design decides correctness

Every input that changes the response belongs in the key: tenant, locale, permissions, feature flags. The source doc's warning is blunt: a key that omits the viewer is how one user's data gets served to another, and that ships as a performance win. The red flags list encodes it as "a cache key that omits an input the response depends on (tenant, locale, viewer)".

## Choose one invalidation strategy, not three

| Strategy | Trade-off |
|---|---|
| TTL | Simplest. You accept staleness up to the TTL, so state the acceptable window explicitly |
| Event or tag based | Fresh on write, but writers now have to know the cache topology |
| Versioned keys (user:42:profile:v7) | Never invalidate, just stop reading old keys. Costs memory until eviction |

The source doc requires a cache to state what it keys on and how it goes stale (verification checklist) and flags "a cache with no stated staleness window and no invalidation strategy" as a red flag. The invalidation dig results are all weak-backed (0.18 to 0.31, including [scopeforged.com](https://scopeforged.com/blog/cache-invalidation-strategies) and [adevguide.com](https://adevguide.com/backend/caching/cache-invalidation/)) and cover the same TTL/event/versioned taxonomy without adding authority.

## Guard against the stampede

The source doc's stampede scenario: a hot key expires, every concurrent request misses together, and the origin takes the full load at once, which is how a cache turns into an outage instead of preventing one. Two named fixes: serve stale while a single request recomputes (stale-while-revalidate), or coalesce concurrent misses behind 1 in-flight promise so N waiters cause 1 recompute.

The dig record has a worked implementation of the second fix: a request-coalescing pattern in Go, where concurrent callers of the same key join a single in-flight computation (w 0.47, weak, [jazco.dev](https://jazco.dev/2023/09/28/request-coalescing/)). It is below the authority line, so treat it as a worked example rather than a citation; the mechanism itself is stated by the source doc. A stampede-prevention overview dig at w 0.26 (vergecloud.com) adds nothing beyond naming.

## Do not cache

Two prohibitions from the source doc: anything whose staleness is a correctness bug (balances, permissions, inventory at checkout), and per-user data under a key that does not identify the user. The source doc points to `references/performance-checklist.md` in the skill itself for request coalescing, write strategies, negative caching, and the cache checklist.

## What to remember

1. Cache only what is expensive to produce and read far more often than it changes (source doc).
2. Layer choice follows visibility and staleness tolerance: in-process, shared, or edge (source doc).
3. Cache keys must include every input the response depends on, especially the viewer (source doc).
4. Pick 1 invalidation strategy and state the staleness window (source doc).
5. Stampede protection: stale-while-revalidate or single-flight coalescing (source doc; w 0.47 worked example).
6. Never cache correctness-critical state or mis-keyed per-user data (source doc).
