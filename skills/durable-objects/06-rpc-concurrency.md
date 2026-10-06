# 06 - RPC Methods, Constructor Init, and Concurrency Control

Scope: the RPC-over-fetch rule with its compatibility date, the blockConcurrencyWhile constructor rule, and the concurrency properties that make a Durable Object a coordination point.

## RPC is the default interface

Critical rule 5 in the source doc: use RPC methods, not the fetch() handler, and it pins the compatibility date: 2024-04-03 or later (source doc: yubi-OS/yubiOS skills/durable-objects/SKILL.md). The source doc's basic pattern shows the shape: a typed namespace (DurableObjectNamespace<MyDurableObject>), a class extending DurableObject<Env>, and the Worker calling stub.addItem("hello") as a plain async method call (source doc).

The Cloudflare docs agree and date it precisely: Durable Objects support RPC calls as of compatibility date 2024-04-03, and RPC methods are preferred over fetch() when the application does not follow an HTTP request/response flow (https://developers.cloudflare.com/durable-objects/api/base/, jev weight 0.97). The invoke-methods best-practices page puts the migration guidance plainly: all new projects and existing projects with a compatibility date greater than or equal to 2024-04-03 should prefer to invoke Remote Procedure Call (RPC) methods defined on the Durable Object class, while projects requiring HTTP request/response flows or legacy projects can continue to invoke the fetch() handler (https://developers.cloudflare.com/durable-objects/best-practices/create-durable-object-stubs-and-send-requests/, jev weight 0.96, dated April 3, 2024).

The RPC system itself is the built-in, JavaScript-native RPC system built into Workers and Durable Objects (https://developers.cloudflare.com/workers/runtime-apis/rpc/, jev weight 0.76).

## The DurableObject base class

The source doc's pattern imports DurableObject from "cloudflare:workers" and extends it with the Env type parameter, holding the constructor to (ctx: DurableObjectState, env: Env) and calling super(ctx, env) (source doc). The base-class reference documents this class as the supported way to write DOs with RPC support (https://developers.cloudflare.com/durable-objects/api/base/, jev weight 0.97).

## Constructor initialization rule

Critical rule 4: initialize in the constructor, and use blockConcurrencyWhile() for schema setup only (source doc). The source doc's pattern wraps exactly one statement in it:

```typescript
constructor(ctx: DurableObjectState, env: Env) {
  super(ctx, env);
  ctx.blockConcurrencyWhile(async () => {
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS items (...)
    `);
  });
}
```

The DurableObjectState reference explains the purpose: use blockConcurrencyWhile in the constructor to run schema migrations or initialize state before any requests are processed, ensuring the Durable Object is fully ready before handling traffic (https://developers.cloudflare.com/durable-objects/api/state/, jev weight 0.97).

## The concurrency property and its cost

blockConcurrencyWhile blocks all other events on the object until its callback completes (that is what makes constructor init safe: nothing can observe a half-initialized object). That blocking is also why the source doc limits it to schema setup: using blockConcurrencyWhile() on every request kills throughput, which is the second entry in the anti-pattern list (source doc). Holding it across fetch() or external I/O is likewise forbidden (source doc): the constructor is the one sanctioned place.

The general shape of the concurrency model is the reason a DO can be a coordination atom at all: requests against one instance are serialized, so per-entity invariants (inventory counts, turn order, booking race resolution) hold without application-level locking. The storage backing that state is transactional and strongly consistent, private per instance (https://developers.cloudflare.com/durable-objects/api/storage-api/, jev weight 0.96).

## Review checklist

When reviewing DO code against this doc (source doc rules 4 to 6 plus anti-patterns):

1. RPC methods defined on the class for new projects; fetch() only for legacy or genuinely HTTP-shaped flows (compatibility date >= 2024-04-03).
2. blockConcurrencyWhile appears at most in the constructor, for schema setup only.
3. No blockConcurrencyWhile wrapping per-request work or external I/O.
4. In-memory state treated as cache only; storage is the source of truth (persist-first, rule 6).
5. Related storage writes kept atomic (no await between related writes).

## Summary

RPC methods on a DurableObject subclass are the default calling convention since compatibility date 2024-04-03; fetch() remains for HTTP-shaped or legacy flows. blockConcurrencyWhile belongs in the constructor for schema initialization so the object is fully ready before traffic, and nowhere else: per-request or I/O-spanning use is the documented throughput killer.
