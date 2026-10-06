# 10 - Anti-Patterns and the DO Review Discipline

Scope: the 5 forbidden patterns from the skill, the best-practices sources behind them, and the checklist order a Durable Objects code review follows.

## The 5 anti-patterns

The source doc's Anti-Patterns (NEVER) section (source doc: yubi-OS/yubiOS skills/durable-objects/SKILL.md):

1. Single global DO handling all requests (bottleneck)
2. Using blockConcurrencyWhile() on every request (kills throughput)
3. Storing critical state only in memory (lost on eviction or crash)
4. Using await between related storage writes (breaks atomicity)
5. Holding blockConcurrencyWhile() across fetch() or external I/O

Each maps to a positive rule from the same doc: 1 to rule 1 (model around coordination atoms), 2 and 5 to rule 4 (blockConcurrencyWhile for schema setup only), 3 to rule 6 (persist first, cache second), 4 to the storage transaction discipline.

## What the official guidance says

Cloudflare's Best Practices hub collects the recommended patterns for building reliable and performant Durable Objects applications (https://developers.cloudflare.com/durable-objects/best-practices/, jev weight 0.97, last updated April 21, 2026). Its Rules of Durable Objects page is the design-guideline source covering when and how to use them (https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/, jev weight 0.97). The source doc's anti-patterns are the operational inverse of those guidelines, and a review should treat both documents as the standard.

## Anti-pattern 1: the global DO

One DO per coordination atom, never one global DO (source doc rule 1; detail in doc 02 of this corpus). Cloudflare's overview names the coordination shapes DOs are for (collaborative editing, chat, multiplayer games, live notifications, deep distributed systems), all of which are per-entity, not global (https://developers.cloudflare.com/durable-objects/, jev weight 0.97). Review signal: any DO whose name or usage suggests it fronts all traffic, or a getByName argument that is a constant.

## Anti-patterns 2 and 5: blockConcurrencyWhile abuse

blockConcurrencyWhile blocks all other events on the object until the callback finishes. The source doc sanctions exactly one use: constructor schema setup (rule 4), where the DurableObjectState documentation confirms the intent, run schema migrations or initialize state before any requests are processed so the object is fully ready before handling traffic (https://developers.cloudflare.com/durable-objects/api/state/, jev weight 0.97). Per-request use kills throughput (source doc anti-pattern 2), and spanning fetch() or external I/O is worse still (anti-pattern 5): the object's entire concurrency is held hostage to network latency. Review signal: blockConcurrencyWhile appearing outside the constructor, or wrapping await calls to external services.

## Anti-pattern 3: memory-only state

Storing critical state only in memory loses it on eviction or crash (source doc). The storage attached to a DO is transactional and strongly consistent and private to the instance (https://developers.cloudflare.com/durable-objects/api/storage-api/, jev weight 0.96); in-memory fields are a cache. Rule 6 makes the ordering explicit: always write to storage before updating in-memory state (source doc). Review signal: any field on the class that mutates without a corresponding storage write first, or a restart-dependent invariant.

## Anti-pattern 4: broken write atomicity

Using await between related storage writes breaks atomicity (source doc). Related writes must land as one unit so a crash between them cannot leave half a transition. Alarm bookkeeping counts: alarm operations follow the same rules as other storage operations (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/durable-objects/api/alarms.mdx, jev weight 0.88). Review signal: sequences of awaited independent storage calls implementing one logical change.

## The review checklist

Bringing the corpus's rules together in review order (all from the source doc unless a weight is given):

1. Scope check: is a DO the right primitive at all (stateless handling, maximum global distribution, and high fan-out belong to plain Workers)?
2. Atom check: one DO per coordination atom; no global DO.
3. Routing check: getByName for deterministic routing; newUniqueId only with externally stored ID strings (https://developers.cloudflare.com/durable-objects/api/namespace/, jev weight 0.97).
4. Config check: bindings plus SQLite class migration or exports map; no mixing (https://developers.cloudflare.com/workers/wrangler/configuration/, jev weight 0.88; https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/index.md, jev weight 0.97).
5. Interface check: RPC methods preferred over fetch() for compatibility dates >= 2024-04-03 (https://developers.cloudflare.com/durable-objects/api/base/, jev weight 0.97).
6. Init check: blockConcurrencyWhile confined to constructor schema setup.
7. Storage check: persist-first ordering, atomic related writes, SQLite sql.exec as the recommended surface.
8. Alarm check: one alarm per object, idempotent handler under at-least-once retry with backoff from 2 seconds and up to 6 retries (https://developers.cloudflare.com/durable-objects/api/alarms/, jev weight 0.95).
9. WebSocket check: Hibernation API preferred for server-side sockets (https://developers.cloudflare.com/durable-objects/examples/websocket-hibernation-server/, jev weight 0.94).
10. Test check: tests run in the Workers runtime through the real bindings and stubs (https://developers.cloudflare.com/durable-objects/examples/testing-with-durable-objects/, jev weight 0.96).

## Retrieval discipline in review

The skill's opening directive applies during review as much as during writing: DO APIs and configuration knowledge may be outdated, so confirm current behavior against the 4 retrieval targets (docs, API reference, best practices, examples) before flagging or clearing code (source doc; https://developers.cloudflare.com/durable-objects/best-practices/, jev weight 0.97).

## Summary

The 5 anti-patterns are the review's hard fails: global DO, blockConcurrencyWhile on every request, memory-only critical state, awaited-apart related writes, and blockConcurrencyWhile across I/O. Behind each stands a positive rule from the skill and a Cloudflare best-practices or API page. The 10-step checklist above is the order to walk a DO change through, and every step ends at a fetchable source rather than recall.
