# 01 - When to Use Durable Objects (and When Not)

Scope: what the durable-objects skill is for, the use cases it names, the cases it rules out, and the retrieval-first discipline it imposes before writing any Durable Object code.

## The skill's scope

The source doc (yubi-OS/yubiOS skills/durable-objects/SKILL.md) defines the skill as: create and review Cloudflare Durable Objects for stateful coordination (chat rooms, multiplayer games, booking systems), implement RPC methods, SQLite storage, alarms, and WebSocket handlers, review existing DO code for best practices, configure wrangler.jsonc/toml for DO bindings and migrations, write tests with @cloudflare/vitest-pool-workers, and design sharding strategies and parent-child relationships. Every use stays inside that frontmatter description's scope; anything beyond it is a different skill's job (source doc).

The skill names 6 trigger situations in its When to Use section (source doc):

1. Creating new Durable Object classes for stateful coordination
2. Implementing RPC methods, alarms, or WebSocket handlers
3. Reviewing existing DO code for best practices
4. Configuring wrangler.jsonc/toml for DO bindings and migrations
5. Writing tests with @cloudflare/vitest-pool-workers
6. Designing sharding strategies and parent-child relationships

## What Durable Objects are

Cloudflare's own overview says to use Durable Objects to build applications that need coordination among multiple clients, like collaborative editing tools, interactive chat, multiplayer games, live notifications, and deep distributed systems, without requiring you to build serialization and coordination primitives on your own (https://developers.cloudflare.com/durable-objects/, jev weight 0.97). Cloudflare's product page describes them as stateful serverless functions that run for as long as you need them, can compute in the background, and handle multiple requests concurrently; it also notes that every Durable Object is a WebSocket server and client (https://www.cloudflare.com/products/durable-objects/, jev weight 0.67).

The original launch framing still holds: Durable Objects provide a serverless approach to storage and state that is consistent, low-latency, distributed, and effortless to maintain and scale, and they enable coordination and real-time collaboration between clients (https://blog.cloudflare.com/introducing-workers-durable-objects/, jev weight 0.84).

## The five use-for categories

The source doc maps needs to examples (source doc):

| Need | Example |
|------|---------|
| Coordination | Chat rooms, multiplayer games, collaborative docs |
| Strong consistency | Inventory, booking systems, turn-based games |
| Per-entity storage | Multi-tenant SaaS, per-user data |
| Persistent connections | WebSockets, real-time notifications |
| Scheduled work per entity | Subscription renewals, game timeouts |

This table is the fastest way to decide whether a DO is the right primitive: if the need is one of these 5 shapes, a DO class is in scope.

## What not to use Durable Objects for

The source doc rules out 3 cases (source doc): stateless request handling (use plain Workers), maximum global distribution needs, and high fan-out independent requests. The reasoning is structural. A Durable Object is a single instance that serializes access for one entity, so it is the wrong tool when there is no entity to serialize around, and it is a bottleneck when traffic is inherently parallel and stateless. Cloudflare's design-guideline page, Rules of Durable Objects, covers when and how to use them and is the deeper reference behind this judgment (https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/, jev weight 0.97).

## The retrieval-first rule

The skill opens with a directive that overrides pre-trained knowledge: knowledge of Durable Objects APIs and configuration may be outdated, so prefer retrieval over pre-training for any Durable Objects task, and fetch the relevant doc page when implementing features (source doc). The 4 canonical retrieval targets it names are (source doc):

| Resource | URL |
|----------|-----|
| Docs | https://developers.cloudflare.com/durable-objects/ |
| API Reference | https://developers.cloudflare.com/durable-objects/api/ |
| Best Practices | https://developers.cloudflare.com/durable-objects/best-practices/ |
| Examples | https://developers.cloudflare.com/durable-objects/examples/ |

It also lists the symbol names worth searching when diving into a reference: blockConcurrencyWhile, idFromName, getByName, setAlarm, sql.exec (source doc). Those 5 symbols cover the 5 subsystems the rest of this corpus documents: concurrency control, deterministic routing, alarms, and SQLite storage.

## Boundary case

The source doc closes its worked-example section with a routing rule: when the request only names a trigger without the artifact it acts on, route to the owning surface instead of improvising (source doc). In practice that means a request like "add an alarm" without a named DO class should be resolved against the owning Worker or DO surface before code is written.

## Summary

Use a Durable Object when one of the 5 need shapes applies (coordination, strong consistency, per-entity storage, persistent connections, scheduled work per entity). Use a plain Worker for stateless handling, maximum global distribution, or high fan-out. Before writing any code, fetch the current Cloudflare doc page for the feature; the skill treats retrieval as mandatory, not optional.
