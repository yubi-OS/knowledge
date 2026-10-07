# 05 - RPC Methods Over the Fetch Handler

Scope: the skill's rule 5 (use RPC methods, not the fetch handler), the DurableObject base class, the compatibility-date floor, and how stubs invoke DO code.

## The rule and its floor

Critical rule 5 of the source doc: "Use RPC methods - Not fetch() handler (compatibility date >= 2024-04-03)" (yubi-OS/yubiOS skills/durable-objects/SKILL.md, source doc). The date is not arbitrary: Cloudflare's RPC reference dates the built-in "JavaScript-native RPC system built into Workers and Durable Objects" to Apr 3, 2024 (https://developers.cloudflare.com/workers/runtime-apis/rpc/, jev weight 0.77).

The basic pattern in the source doc shows the shape this rule produces: the class extends `DurableObject` imported from `cloudflare:workers`, public methods like `addItem(data: string): Promise<number>` are called directly on a stub, and the exported `fetch` handler stays in the Worker, where it does routing only:

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const stub = env.MY_DO.getByName("my-instance");
    const id = await stub.addItem("hello");
    return Response.json({ id });
  },
};
```

## The base class

The API reference documents "the DurableObject abstract base class and its handler methods" (https://developers.cloudflare.com/durable-objects/api/base/, weight 0.97). The get-started page shows the required constructor choreography: "constructor (ctx, env) { // Required, as we're extending the base class. super (ctx, env); }" followed by an ordinary async method used as RPC (https://developers.cloudflare.com/durable-objects/get-started/, weight 0.97). Forgetting `super(ctx, env)` is a first-boot failure; the source doc's basic pattern makes the call the first line of the constructor for exactly that reason.

A related typing trap from the dig: Durable Object RPC type errors were resolved "by ensuring @cloudflare/workers-types/2024-04-05 is used in tsconfig and removing explicit type imports" (https://github.com/cloudflare/workerd/issues/1996, weight 0.73). Review heuristic: when RPC method types fail to resolve, check the workers-types date first.

## Why not the fetch handler

The stubs best-practices page states the before/after directly: "Without RPC, customers frequently construct requests which corresponded to private methods on the Durable Object and dispatch requests from the fetch handler" (https://developers.cloudflare.com/durable-objects/best-practices/create-durable-object-stubs-and-send-requests/index.md, weight 0.96). The same page's summary: "Call RPC methods or send fetch requests to Durable Objects using stubs from a Worker... Invoke RPC methods" (weight 0.96).

The old pattern's costs are what the skill's rule encodes: every internal operation becomes a URL to invent and document, dispatch logic accumulates in one fetch handler, and request/response encoding is hand-rolled per endpoint. RPC replaces all of it with typed method calls that the TypeScript compiler checks.

One boundary note from a low-weight source (https://hono.dev/examples/cloudflare-durable-objects, weight 0.35, weak backing, labeled weak): Durable Objects "cannot handle HTTP requests directly"; a Worker receives client HTTP requests and calls the DO. Treat that as directional; the first-party stubs page (0.96) is the authority. The nuance for reviewers: a DO can still implement a fetch handler for cases where an HTTP surface is genuinely needed (for example Service Bindings-style calls), but it is not the default interface the skill wants.

## Review checklist for RPC usage

1. Public operations on the DO are typed async methods, not URL-dispatched cases inside fetch (stubs reference, weight 0.96; source doc rule 5).
2. The class extends DurableObject and calls super(ctx, env) first (base class reference, weight 0.97; get-started, weight 0.97).
3. wrangler compatibility_date is 2024-04-03 or later (source doc rule 5; RPC reference weight 0.77).
4. tsconfig uses a 2024-04-05-or-later workers-types entry so RPC signatures typecheck (workerd issue, weight 0.73).
5. The Worker's fetch handler does routing and response shaping; it does not reimplement DO logic by encoding it into request bodies.

## Interaction with the other corpus docs

RPC is the transport layer for everything the DO owns: storage writes go through typed methods that can batch them atomically (doc 04), alarm state transitions are methods the object schedules itself (doc 06), and WebSocket accept/close events surface as handler methods alongside RPC (doc 07). A DO that re-opens an HTTP side door for what should be an RPC method usually also breaks the persist-first ordering of doc 04, because the HTTP path bypasses the typed method that owns the write.
