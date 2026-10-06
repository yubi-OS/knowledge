# Thin controller on Cloudflare Workers and D1

Scope: how the merged design hosts the state machine, fail-closed gate, approval queue, and dashboard on a single Cloudflare Worker with D1 tables and a KV policy doc.

## The shape: one worker, one state machine, one store

The framing log's recommended direction is explicit about the hosting model: "the worker hosts the state machine (D1), the deterministic fail-closed gate, the approval queue/dashboard, and verify/reconcile logic." Nothing in the design spreads across services. The D1 schema is five tables: tasks, actions, events (append-only audit), approvals, learnings. The policy doc lives in KV, versioned, with the gate recording which policy version it enforced. The dashboard is served from KV at /jev/.

This is the thin-controller pattern: a small orchestration layer that delegates judgment (to jev-1.13 via /api/decide) and execution (to the scoped outbound-HTTP allowlist) while owning only state, gating, and review. Practitioner writing on the pattern describes it as thin controllers, strong services: keep the controller minimal so domain rules live in services and boundaries (https://community.ibm.com/community/user/blogs/george-van-eaton/2026/08/28/thin-controllers-strong-services-where-orchestrati, jev weight 0.32, weak backing). The framing log's variant is unusual in that the "service" the controller delegates to is partly an advisory model (jev-1.13) and partly plain fetch calls.

## Why D1 for the state

D1 is Cloudflare's managed, serverless SQL database with SQLite's SQL semantics, built-in disaster recovery, and both Worker binding and HTTP API access (https://developers.cloudflare.com/d1/, jev weight 0.95, authoritative backing). From a Worker, the D1Database binding provides prepared statements, batch operations, and query execution (https://developers.cloudflare.com/d1/worker-api/d1-database/, jev weight 0.97, authoritative backing), and the documented getting-started path is exactly create schema, bind, query (https://developers.cloudflare.com/d1/get-started/, jev weight 0.95, authoritative backing). For a five-table ledger-plus-tasks schema with append-mostly writes, this is the smallest store that supports SQL constraints (the idempotency-key uniqueness) and audit queries.

Workers are the right runtime for the rest: Cloudflare's documentation positions Workers as compute for applications with access to Workflows for durable long-running operations with automatic retries, alongside KV, Queues, and D1 as standard bindings (https://developers.cloudflare.com/workers/, jev weight 0.95, authoritative backing). Architecture guidance for Workers applications treats routes, bindings (KV, D1, R2, Queues, Workflows, Durable Objects) as the standard decomposition surface (https://www.nanosek.com/resources/cloudflare-workers-architecture-guide, jev weight 0.34, weak backing). The framing log deliberately picks the two simplest bindings (D1 for state, KV for the policy doc and dashboard) and does not use Workflows or Durable Objects for v1; the state machine is implemented as explicit rows and transitions instead of as a platform primitive.

## State machine as rows

The design's lifecycle (ingest, understand, decide, gate, execute, verify, continue/terminal) is a state machine, and orchestration systems are commonly modeled as exactly that: states, transitions, events, with workflow engines and sagas as implementations (https://sai-tai.com/software-development/system-design/state-machine/, jev weight 0.29, weak backing). Representing it in D1 rows rather than in-memory makes two properties hold: any worker invocation can resume any task, and the events table is the state machine's log, which is what the ledger conventions require.

Infrastructure-controller design reaches the same conclusion for the same reason: state controllers give a controller a consistent place to resume work despite temporary failures and process restarts, with persistence hooks underneath (https://docs.nvidia.com/infra-controller/documentation/architecture/reliable-state-handling, jev weight 0.69, authoritative backing). The framing log's verify/reconcile endpoint is the same idea at task granularity: after a crash or a partial execution, reconcile against observed reality and append the outcome.

## What "thin" buys and what it costs

The framing log's stress-test names the cost: "a thin controller that still trusts the caller to define its own tools is just an audit log with ambitions." The recorded counter is that the gate validates declared tools against the versioned policy doc before dispatch, so callers cannot invent scopes at call time. Thinness is preserved because the policy is data (KV doc), not code paths.

The costs are equally explicit in the MVP scope: no tenant isolation (single-owner infra, with a tenant column kept so the schema stays additive), no learnings auto-activation, no provider-side reconciliation adapters, no email/Slack approval notifications. The controller is thin partly by deferral, and the deferrals are written down rather than implied. One stated validation bet on the storage side: D1 on the steady-orbit account must handle the write pattern, tested as a 100-row append burst under 5 seconds.
