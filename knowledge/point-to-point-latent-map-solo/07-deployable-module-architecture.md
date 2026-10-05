# 07 Deployable module architecture: one TS module, browser first, Worker behind /api/map

Scope: the deployable shape: one dependency-free TypeScript module running client-side in the browser first, then mounted behind /api/map on a Cloudflare Worker with D1 persistence, with the static single-file sphere as the MVP cut.

## The deployable shape

The source record's converged direction is V4 built as V5-first: ship the identity layer, binarization rule, S2 placement, atom edges, curveball null, and slerp bridge as one module, client-side first so it verifies in a browser with zero infrastructure, then mount the same module behind /api/map in the Worker with D1 persistence (internal record). V5, the static single-file sphere (paste vectors, binarize, k-shell, place on S2, show geodesic gap, pick next atom, no null, no LLM, no database), is the MVP cut of the same code path rather than a separate product (internal record).

## Why browser-first

The browser-first ordering is a testability decision: the identity checks and certificate checks run where the user can see them fail, with no server to distrust. The browser-only pattern is recognized as a deliberate category: tools that never upload files work for a huge set of "give me a file, give me a different file back" problems, though accounts, sync, and sharing reintroduce a backend by definition (https://dev.to/tonytoolbox/building-browser-only-tools-that-never-upload-your-files-the-local-first-web-stack-4hc8, weight 0.25, weakly backed). Similar purely-frontend analysis tools that run heuristics locally on a dropped CSV exist as working examples of the pattern (https://github.com/khushigoyal771/VizAgent, weight 0.35, weakly backed). A directory of single-file web apps defines the format as one .html file containing UI, logic, and often data, running from disk or a static host with no build step (https://iamsingle.app/, weight 0.08, weakly backed). These are weak sources; the load-bearing argument for browser-first is the internal testability claim, and the weak sources only corroborate that the pattern is established.

## The Worker mount

TypeScript is a first-class language on Cloudflare Workers, with fully typed APIs and types generated from the runtime (https://developers.cloudflare.com/workers/languages/typescript/, weight 0.65). A maintained template bootstraps Workers in TypeScript with Wrangler (https://github.com/cloudflare/worker-typescript-template, weight 0.62), and the platform's RPC layer generates runtime types for typed Service and Durable Object bindings (https://developers.cloudflare.com/workers/runtime-apis/rpc/typescript/, weight 0.70). For the HTTP surface, Hono is documented as a small framework that runs on Workers, developed locally and published with Wrangler (https://hono.dev/docs/getting-started/cloudflare-workers, weight 0.85). D1 is the persistence layer, with a documented ecosystem of community ORMs and query builders around it (https://developers.cloudflare.com/d1/reference/community-projects/, weight 0.74). The record's own requirement is dependency-free for the mapping module itself; the Worker wrapper around /api/map may use such frameworks, but the certified module has none, so the same bytes run in browser and Worker (internal record).

## The two halves of the state

Client-side state: the pasted vectors, the map key (hash of {d, axis-selection, threshold}), the placements, and the edge certificates. Worker-side state: persisted maps and their certificates in D1, addressed by map key, so a shared link resolves to the same artifact (internal record). The /api/map endpoint is the only boundary: the browser computes, the Worker stores, and neither re-derives the other's numbers.

## What the MVP cut removes and keeps

V5 removes the null, the LLM, and the database; it keeps the identity layer, binarization, placement, and geodesic gap. The record's scoring reflects the trade: V5 got the easiest switching cost (S=5) and the best testability (T=5) but the worst defensibility (D=1), since anyone can rebuild a static visualization in an afternoon (internal record). The converged direction keeps V5 as the first slice rather than a rival: the static sphere is V4 minus the certified edges, so the upgrade path adds certificates and persistence without reworking the core.

## Why one module matters

The single-module constraint has 3 consequences. First, parity: the browser build and the Worker build run identical certificate checks, so a certificate verified locally is the same certificate the server would verify. Second, auditability: the module's bytes can be hashed alongside the map key, giving the artifact a complete self-description. Third, deploy simplicity: the MVP is a static file, the full tool is that file plus one Worker mount plus one D1 table, which keeps the whole surface reviewable (internal record). The record flags the browser as the verification environment of record precisely because zero-infrastructure verification is the cheapest honest check available (internal record).
