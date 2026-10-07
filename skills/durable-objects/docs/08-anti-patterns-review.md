# 08 - Anti-Patterns and the DO Code Review Discipline

Scope: the skill's NEVER list, the concurrency hazards behind each item, and how to run a review pass against them.

## The NEVER list

The source doc's Anti-Patterns section names 5 items (yubi-OS/yubiOS skills/durable-objects/SKILL.md, source doc):

1. Single global DO handling all requests (bottleneck)
2. Using `blockConcurrencyWhile()` on every request (kills throughput)
3. Storing critical state only in memory (lost on eviction/crash)
4. Using `await` between related storage writes (breaks atomicity)
5. Holding `blockConcurrencyWhile()` across `fetch()` or external I/O

Items 1 and 3 trace back to the design tables of doc 01 and the routing rules of doc 02. This doc covers the concurrency mechanics that make items 2, 4, and 5 review-critical, because they are the ones that pass unit tests and fail under production concurrency.

## blockConcurrencyWhile: the precise contract

The State API reference defines the primitive: `blockConcurrencyWhile` is for "executing async operations based on the current state of the Durable Object and using blockConcurrencyWhile to prevent that state from changing while yielding the event loop. If the callback throws an exception, the object will" be reset (https://developers.cloudflare.com/durable-objects/api/state/, jev weight 0.97). Three review-relevant consequences:

- While the callback runs, all other incoming events to the object are gated. That is the throughput cost the source doc's anti-pattern 2 names.
- A throw inside the callback resets the object, so an over-broad block (external I/O inside it, anti-pattern 5) couples the object's availability to the flakiness of that I/O.
- The correct scope is narrow and one-time: schema setup in the constructor (source doc critical rule 4; doc 04).

A Cloudflare docs GitHub issue records the same consensus from the docs maintainers' side: "In practice, this is quite rare, and most use cases do not need blockConcurrencyWhile" outside initialization (https://github.com/cloudflare/cloudflare-docs/issues/27441, weight 0.34, weak backing, labeled weak).

## The atomicity hazard (item 4)

"Using await between related storage writes (breaks atomicity)" (source doc) is subtle because each individual await looks harmless. The hazard is interleaving: between two awaited writes, the object can process other events, so the related writes can interleave with reads or writes from another request, breaking the invariant they were supposed to establish together. The fix the skill encodes elsewhere: use the synchronous `sql.exec` API so consecutive statements run without yielding (doc 04), and only then update in-memory state (source doc critical rule 6).

The best-practices hub collects the first-party guidance: "Recommended patterns for building reliable and performant Durable Objects applications" (https://developers.cloudflare.com/durable-objects/best-practices/, weight 0.97), and the Rules page is the deeper treatment of "when and how to use them" (https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/, weight 0.97). Both are the canonical review references the skill's Retrieval Sources table points at.

## The review pass, in order

Running the skill as a review (its When to Use item 3: "Reviewing existing DO code for best practices", source doc), the order that catches the most expensive defects first:

1. Shape check: is there exactly one global-ish object that everything hits? If yes, that is anti-pattern 1; redesign around coordination atoms (doc 02) before touching anything else. The single-object-per-entity pattern is what a third-party architecture text calls the pattern "that makes everything work" (https://architectingoncloudflare.com/chapter-06/, weight 0.21, weak backing).
2. Concurrency check: every `blockConcurrencyWhile` call site must be constructor-scoped schema setup. Any request-path use or any external I/O inside the block fails anti-patterns 2 and 5 (State API reference weight 0.97).
3. State durability check: any critical invariant held in a class field must have a storage write path. Memory-only state fails anti-pattern 3, and under hibernation (doc 07) eviction is routine, not exceptional.
4. Atomicity check: related writes must not have awaits between them; prefer batched synchronous SQL, then cache updates (anti-pattern 4; source doc rule 6).
5. Config and tests: bindings, migrations, and the vitest suite per docs 03 and 09.

A community announcement of the Rules guide confirms the checklist framing: the guide "covers design patterns, storage strategies, concurrency, and common anti-patterns to avoid" (https://community.cloudflare.com/t/durable-objects-workers-new-best-practices-guide-for-durable-objects/868986, weight 0.10, weak backing, labeled weak).

## Boundary

The source doc's boundary case applies in review too: when a flagged issue belongs to another surface (Workers handler design, wrangler CLI behavior), route it to the owning surface instead of expanding the DO review (source doc, Examples section).
