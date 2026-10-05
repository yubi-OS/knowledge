# 09 - Deploying the controller and the first live gated run

Scope: deploying the controller onto a live worker without shadowing existing routes, a versioned policy starter, the first gated end-to-end run, and the open items it surfaced (scoped executor credentials).

## Adding routes without breaking an existing service

The controller shipped onto a worker that already serves a production site and APIs, so the deploy had one hard constraint: zero regression on existing routes. The pattern used was additive routing: the jev branch matches only `/api/jev*` and sits before every legacy route, so neither can shadow the other, and legacy route code stayed byte-identical (source: system of record). Cloudflare's routing model makes this possible because Workers route by pattern; a new handler that only claims a distinct path prefix cannot intercept other paths (source: https://developers.cloudflare.com/workers/configuration/routing/, weight 0.60). One real shadowing bug still occurred in the deploy: the entry module's built-in 404 page was shadowing the new `/jev` console route until the route was added to the entry's exclusion list, which is why the "entry stays byte-identical" plan was wrong by exactly one exclusion (source: system of record). Lesson: when adding routes to an existing worker, audit the entry module's fallback paths, not just the explicit route table.

## Config, state, and credentials as bindings

The deploy carried its configuration as KV (`jev-policy.json`, versioned, plus the console page), its state as D1 with schema auto-applied on first request, and its model access through a binding aliasing an existing Secrets Store secret rather than minting a new credential (source: system of record). Reusing an existing secret through an alias avoided a new credential lifecycle while keeping the operator key separate from caller keys. Quota and limit design matters here too: production agent platforms publish explicit per-tenant action and spend limits, and the controller encodes the same limits directly in policy (10 actions, 2 retries, 5 USD task cap in the starter) so the gate, not the operator's memory, enforces them (source: https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-quotas, weight 0.97).

## The first live run as a shakedown

The first end-to-end task (a digest job with two actions, one fetch and one post) exercised every stage in order and surfaced two real bugs within the hour. The pipeline behaved correctly: understand classified the task, the gate split the two actions by policy, the approval bound actor, target, payload hash, limits, expiry, and policy version, the pause check skipped both dispatches when engaged, dispatch used stable action ids, verify judged each action independently, and the task closed terminal with an honest per-action report (source: system of record). The bugs it caught were both environmental rather than logic: a persistence layer that forwarded unknown keys into SQL and failed closed on unknown columns (fixed by filtering patches to real columns while carrying the full payload into the audit event), and outbound fetches missing a User-Agent header, which GitHub rejects with a 403 (source: system of record).

The rate-limit finding is the durable lesson: the worker shares Cloudflare's egress pool, so anonymous per-IP rate limits apply to the whole platform, and a read-only GitHub action failed intermittently for that reason. Production agent deployments report the same class of problem: shared egress makes per-provider rate limits a fleet-level property, and unauthenticated calls fail in ways that look like logic bugs (source: https://harness-engineering.ai/blog/lessons-learned-from-deploying-ai-agents-in-production, weight 0.35, weak backing).

## Open items the first run produced

The run generated a short, concrete backlog. Highest value: scoped executor credentials for authenticated provider calls, which converts flaky anonymous reads into reliable authorized ones and is deliberately deferred from the v1 spec. Next: provider adapters beyond host-scoped fetch, so reconciliation can query per-provider cancel and status APIs instead of inferring outcomes. A tenant column exists in the schema but multi-tenancy is unexercised by design in a single-owner deployment (source: system of record).

## Verification discipline for the deploy itself

The deploy was verified before being trusted: a health route reporting policy version and pause state, a negative auth test (bogus and missing bearer tokens rejected), and regression checks that every pre-existing route still returned its expected responses (source: system of record). For any controller deployed alongside existing production routes, that triple, positive health, negative auth, and legacy regression, is the minimum acceptance bar, because a gate that cannot reject a bad credential or a deploy that silently shadowed a legacy route are both worse than not shipping.
