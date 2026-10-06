# Automations and Evolution Endpoints

Scope: the automations stage-pipeline endpoints (activate, pause, run, models, reply webhook) and the evolution sweep, directive, cycle, atom, candle and memory endpoints, with their cron dispatch and compare-and-set firing contracts.

Source of record: yubi-OS/yubiOS docs/ENDPOINTS.md (source doc, weight 0.62). All claims below are from that document unless a dig source is named.

## Automations endpoints

6 endpoints plus a models route, all bearer and rate-limited except the webhook (source doc, weight 0.62):

- GET|POST /api/jev/automations - list and create versioned automation defs (stage pipeline validation on create).
- POST /api/jev/automations/:id/activate - activate (single-active per name enforced).
- POST /api/jev/automations/:id/pause - pause an automation.
- POST /api/jev/automations/:id/run - run inline (up to 25s CPU): the request body IS the automation input, or {prompt} for prompt-input automations; creates and runs the task and returns the full result.
- GET /api/jev/models - model routes for the console: classify=llama-3.1-8b, draft=llama-3.3-70b, guard=llama-guard-3-8b; the raw route pins anything else.
- POST /api/jev/webhooks/reply - the reply webhook (provider to worker): records a reply and routes it to task and lead handling; no auth, rate-limited.

The domain runs a stage pipeline per fire: tool (GET-only unless a policy tool covers the host; capped, every call audited), llm (interpolated prompt, JSON repair), builtin (pure deterministic function), guard (advisory safety verdict - unsafe skips propose_actions and routes to human review), and propose_actions (proposals enter the same gate as hand-written ones) (source doc, weight 0.62). The builtin registry holds: lead_research, corpus_audit, corpus_lens, corpus_drift, tautology_gate, visco_hysteresis, visco_snapback (source doc, weight 0.62).

Invariants (source doc, weight 0.62): single-active automation per name with versioned defs in D1; interval fires use compare-and-set on last_fired_at so double-fire is impossible; model routes are pinned as listed; the tool stage is GET-only unless a policy tool covers the host and every call is audited and capped; builtins are pure with no fetch and {ref}/{source_ref} inputs rejected; the reply webhook is the human loop-closer for lead outreach (handleReplyWebhook). Module parts: routes-automations.js, jev-automations.js, jev-engine.js, jev-scheduler.js, jev-llm.js, jev-lead.js, jev-lead-lib.js, jev-corpus-builtins.js.

## Evolution endpoints

11 endpoints in two route files (source doc, weight 0.62):

- POST /api/jev/evolution/sweep - structured report ingest; findings become directives; idempotent per fire (duplicate returns 200).
- GET /api/jev/evolution/directives - directive list, or claim one with ?claim=1 using compare-and-set (claim=1).
- POST /api/jev/evolution/directives/:id/result - record the execution result for a claimed directive.
- POST /api/jev/evolution/directives/:id/approve and /reject - human approval (forced for every kind outside the auto whitelist) and rejection.
- GET /api/jev/evolution/state - sweeps, directives, calibration trend, notify state.
- GET /api/jev/evolution/cycles - cycle history: cycle_completed events newest-first with preflight, measured, proposed, candle, steps, errors.
- GET /api/jev/evolution/atoms - atom ledger plus a server-side asserted cumulative (monotone check).
- POST /api/jev/evolution/memory/search - memory recall on the EVEC vector index with a degrade envelope (index_missing when the index is absent).
- GET /api/jev/evolution/candles - standard-candle ledger with a detection power summary.
- POST /api/jev/evolution/cycle/run - manual trigger of the hourly cycle: one cycle + enqueue + queue drain (the scheduled pass on demand).

The cycle runs preflight, measure, recall, propose at most 1 gated action, candle, notify. Directive kinds are fail-closed: record_learning and note auto-execute; memory_edit, skill_push, schedule_change, repo_push, worker_change, ops_fix and external_comms need approval; unknown kinds are rejected (source doc, weight 0.62). Before 5 completed cycles of history the cycle records an honest corpus error instead of fabricating metrics; the notify digest is silent-cycle aware and never invents atoms or steps (source doc, weight 0.62).

## The cron substrate

Both domains share the worker's scheduled entrypoint: dispatch is by cron expression - the evolution cron runs the evolution cycle, any other cron keeps the automations scheduler tick (source doc, weight 0.62). Cloudflare Workers docs confirm the contract this rides on: a Worker scheduled handler receives its scheduled events from cron triggers configured in wrangler (https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/, weight 0.85), and cron triggers support multiple cron expressions per worker (https://developers.cloudflare.com/workers/configuration/cron-triggers/, weight 0.36, weak). The compare-and-set pattern the doc describes is a standard idempotency guard for scheduled jobs (https://sadiqbd.com/blog/developer/cron-explainer/production-scheduled-jobs-idem, weight 0.09, weak).

## Composition

Automations compose with the Jev Orchestrator (propose_actions and guard human-review feed the gate), Corpus Math and Visco builtins, and the Evolution scheduler tick. Evolution composes with the orchestrator gate (jev-quality wraps the decide call), the corpus cycle metrics, the outcome ledger, and the public relays for email digests (source doc, weight 0.62).
