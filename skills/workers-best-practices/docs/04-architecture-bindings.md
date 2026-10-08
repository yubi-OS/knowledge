# 04 Architecture: bindings over REST

Scope: in-process bindings instead of the Cloudflare REST API, service bindings for Worker-to-Worker calls, moving async work off the critical path with Queues and Workflows, and Hyperdrive for external PostgreSQL and MySQL.

Grounding spine: source doc `yubi-OS/yubiOS skills/workers-best-practices/SKILL.md`.

## Bindings over REST

The source doc rule: use in-process bindings (KV, R2, D1, Queues), not the Cloudflare REST API, from inside a Worker (source doc). The docs state the why with unusual directness: bindings allow a Worker to interact with resources on the Cloudflare Developer Platform and provide better performance and fewer restrictions than the REST APIs, which are intended for non-Workers applications (https://developers.cloudflare.com/workers/runtime-apis/bindings/, jev weight 0.86). The source doc's anti-pattern table lists the REST-API-from-inside-a-Worker pattern with its costs: unnecessary network hop, auth overhead, added latency (source doc). The REST API is not wrong in general; it is wrong for the caller a Worker is. A reviewer finding `api.cloudflare.com` called from Worker code with an API token is looking at a binding that should be declared in `wrangler.jsonc` instead.

The config-side pairing comes from the wrangler configuration page: treat the Wrangler configuration file as the source of truth for configuring a Worker (https://developers.cloudflare.com/workers/wrangler/configuration/, jev weight 0.87). Bindings are declared there, generated into `Env` by `wrangler types` (doc 01), and consumed as `env.<BINDING>` at runtime.

## Service bindings for Worker-to-Worker calls

The source doc rule: use service bindings for Worker-to-Worker calls, not public HTTP (source doc). The docs describe the mechanism: service bindings allow one Worker to call into another without going through a publicly accessible URL, including typed RPC via `WorkerEntrypoint` (https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/rpc, jev weight 0.89). Calling another Worker over its public route costs an extra network hop, requires the route to be exposed, and bypasses typed interfaces. A reviewer sees the anti-pattern as `fetch()` to a `workers.dev` or custom-route URL from inside another Worker.

## Queues and Workflows off the critical path

The source doc rule: move async and background work off the critical path using Queues and Workflows (source doc). The execution-context rules in doc 03 bound what post-response work can be: `ctx.waitUntil()` work must finish within its time limit (https://developers.cloudflare.com/workers/runtime-apis/context/, jev weight 0.83). Anything that must outlive that limit, or that would delay the response, belongs on a queue or a workflow rather than in the request handler. This doc records the rule and its boundary condition; the durable-objects and workflows domains have their own skills per the source doc's scope section (source doc).

## Hyperdrive for external databases

The source doc rule: always use Hyperdrive for external PostgreSQL and MySQL connections (source doc). The docs give the concrete integration: use Hyperdrive to connect to PostgreSQL and PostgreSQL-compatible databases from Workers, with a minimum postgres-js version of 3.4.5, the required Node.js compatibility flags, and the Hyperdrive binding declared in `wrangler.jsonc` (https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/, jev weight 0.87). Note the coupling: the Hyperdrive pattern itself depends on `nodejs_compat` (doc 02), which is why the config review and the architecture review overlap.

The Hyperdrive overview describes the value: global connection pooling and query caching that accelerate access to existing databases from Workers (https://developers.cloudflare.com/hyperdrive/, jev weight 0.59). That weight is marginal; the stronger citation for the rule is the connect-to-PostgreSQL guide above.

## The architectural review pass

Putting the source doc's Architecture table together with the dig sources, a review checks:

1. Cloudflare platform resources reached through bindings, never through `api.cloudflare.com` with an API token (https://developers.cloudflare.com/workers/runtime-apis/bindings/, jev weight 0.86).
2. Worker-to-Worker calls through service bindings, never through public URLs (https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/rpc, jev weight 0.89).
3. Async work that outlives the response or the `waitUntil()` window pushed to Queues or Workflows (source doc).
4. PostgreSQL and MySQL through Hyperdrive bindings with `nodejs_compat` enabled (https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/, jev weight 0.87).

## Source line

- Source doc: `yubi-OS/yubiOS skills/workers-best-practices/SKILL.md` (Architecture table, anti-patterns table, Scope section).
- Digs: 2 queries, 12 results weighted, 5 kept at weight 0.4 or higher.
