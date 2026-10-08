# 05 Observability

Scope: enabling `observability` in the wrangler config with `head_sampling_rate`, structured JSON logging, and the Workers Logs, Tail Workers, and Tail Handler surfaces that consume the output.

Grounding spine: source doc `yubi-OS/yubiOS skills/workers-best-practices/SKILL.md`.

## The config switch

The source doc rule: enable `observability` in config with `head_sampling_rate`, and use structured JSON logging (source doc). The config side lives in `wrangler.jsonc`, which the wrangler configuration docs treat as the source of truth for configuring a Worker and recommend in JSONC form for new projects (https://developers.cloudflare.com/workers/wrangler/configuration/, jev weight 0.83). Because the observability block is a config field, a review that finds a Worker with no observability block is looking at the source doc's single Observability-row rule as a hard finding, not a suggestion.

The observability docs describe the product surface the switch feeds: understand how Worker projects are performing via logs, traces, metrics, and other data sources (https://developers.cloudflare.com/workers/observability/, jev weight 0.94). Dynamic Workers document the same capture, retrieve, and forward flow for their variant of the runtime (https://developers.cloudflare.com/dynamic-workers/usage/observability/, jev weight 0.91).

## Structured JSON logging

The source doc names structured JSON logging as the practice to pair with the config switch (source doc). The reason is downstream usability: once logs are captured centrally, they are only useful if they can be filtered and queried, which is what the Workers Logs surface does. Workers Logs lets you automatically collect, store, filter, and analyze logging data emitted from Workers, written to your Cloudflare account and queryable in the dashboard per Worker (https://developers.cloudflare.com/workers/observability/logs/workers-logs/, jev weight 0.91). Unstructured free-text lines defeat that filter path; JSON fields are the shape the tooling can act on.

One platform limit motivates care with log volume: the per-request log coverage limit applies to all data emitted via `console.log()` statements, exceptions, request metadata, and headers for a single request, and after exceeding it the system does not record additional context for that request in logs, tail logs, or Tail Workers (https://developers.cloudflare.com/workers/platform/limits/, jev weight 0.91). A reviewer should treat both a missing observability block and an unbounded console-logging habit as findings.

## Consumers: Workers Logs, Tail Workers, Tail Handler

Three surfaces consume or extend the log stream:

1. Workers Logs: the automatic collection, storage, filtering, and analysis layer described above (https://developers.cloudflare.com/workers/observability/logs/workers-logs/, jev weight 0.91).
2. Tail Workers: track and log Workers on invocation by assigning a Tail Worker to your project (https://developers.cloudflare.com/workers/observability/logs/tail-workers/, jev weight 0.83). This is the forwarding hook for external sinks.
3. Tail Handler: the `tail()` handler receives invocation events; for Workers for Platforms customers with a Tail Worker installed on the dynamic dispatch Worker, events contain two elements, one for the dynamic dispatch Worker and one for the user Worker (https://developers.cloudflare.com/workers/runtime-apis/handlers/tail/, jev weight 0.81).

## What a reviewer checks

From the source doc's Observability row and Review Workflow (source doc), plus the dig-backed details:

1. `observability` enabled in `wrangler.jsonc` with a deliberate `head_sampling_rate` (source doc). Sampling exists precisely because of the log-volume economics above.
2. Log calls structured as JSON objects with stable field names, so Workers Logs can filter and analyze them (https://developers.cloudflare.com/workers/observability/logs/workers-logs/, jev weight 0.91).
3. No reliance on logs after the per-request log coverage limit is hit; critical context emitted early or surfaced via exceptions (https://developers.cloudflare.com/workers/platform/limits/, jev weight 0.91).
4. External forwarding through a Tail Worker where third-party observability is required (https://developers.cloudflare.com/workers/observability/logs/tail-workers/, jev weight 0.83).

The observability check is also the evidence source for the source doc's own principle: provide evidence, referencing line numbers, tool output, or docs links (source doc). A Worker without observability enabled cannot produce the evidence its own reviews will later need.

## Source line

- Source doc: `yubi-OS/yubiOS skills/workers-best-practices/SKILL.md` (Observability row, Principles, Review Workflow).
- Digs: 2 queries, 12 results weighted, 6 kept at weight 0.4 or higher.
