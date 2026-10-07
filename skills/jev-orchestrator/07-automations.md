# 07 The automations layer: templates, stage pipelines, and the scheduler

Scope: versioned automation templates in D1, the stage pipeline model, the compare-and-set scheduler, and the first production suite. This is an internal-record subtopic: its mechanisms are worker-internal (D1 templates, worker cron, the console), so this doc ran no web dig and grounds every claim in the source doc.

## What automations are

On top of the task loop, the worker hosts automations: versioned templates in D1 that run stage pipelines and can fire on a schedule (source doc, Automations section). A freeform prompt is also a first-class task input: the 70b Llama model proposes actions, and every proposal passes the same deterministic gate as hand-written ones. The LLM never authorizes anything (source doc).

The stage pipeline types are: tool (deterministic tool fetches), llm (model stages), builtin, guard (the safety verdict stage), and propose_actions (gated action proposals) (source doc). Prompts inside stages interpolate run context with the {{ $.stage_id.path }} syntax (source doc).

## The definition shape

An automation definition carries: name, description, trigger (either {type: manual} or {type: interval, every_minutes, batch}), input, tool_refs (the hosts and methods the definition's tool stages may use), stages, and limits (source doc). Two hard rules bind the shape:

1. Non-GET stages MUST be covered by a policy tool, or validation refuses the definition (source doc). tool_refs is not decoration; it is the surface the policy check runs against.
2. Deploy edits create a new draft version, and activation is single-active-per-name (source doc). An automation has exactly one live version at a time.

Endpoints: GET/POST /api/jev/automations, POST /api/jev/automations/:id/activate|pause|run, GET /api/jev/models, and POST /api/jev/webhooks/reply (reply records, with an optional ?k= shared secret) (source doc). The console's Automations tab supports deploy, activate, pause, and run-now with input, plus a models pill (source doc).

## The scheduler

A worker cron fires every 5 minutes and triggers interval automations. Fires are compare-and-set on last_fired_at, so double-fire is impossible, and each fire carries per-interval idempotency keys (source doc). This is the same dedupe discipline as task-level idempotency keys (doc 03), applied to the trigger surface.

## Stage budgets

Automations needing more than 30 seconds of CPU must be chunked. The v1 lead-research automation batches per business for exactly this reason. A run that exhausts its stage budget closes terminal:failed with stage_budget_exhausted, honestly (source doc). The honest-close principle ties back to the terminal-state discipline of doc 05: a timeout is reported as a failure with a reason, not as silence.

## The first suite: the Steady Orbit lead machine

The first automations suite is the Steady Orbit lead machine: the research audit library ported verbatim with all refuse-to-claim guards; drafts pass the guard stage and then a gated resend.send action; a reply webhook records responses. D1 table jev_leads is the v1 system of record, and HubSpot integration is a future policy learning (source doc).

The lead machine exercises the full stack in one pipeline: LLM drafting, the guard safety verdict, an approval-gated send, and a reply-record endpoint. It also demonstrates the honest-close path: long research is chunked per business to stay inside the 30-second CPU budget.

## Why templates are versioned

Versioning plus single-active-per-name gives automations the same lifecycle discipline as tasks: a deployed edit does not silently change what runs. The new draft runs only after activation, and activation is the moment the version takes over. This mirrors the policy-version rule for approvals (doc 02): state changes are explicit and old bindings do not survive them.

## Sources

- Source doc: skills/jev-orchestrator/SKILL.md in yubi-OS/yubiOS (section: Automations; also The flow, for gate interaction).
- Internal-record subtopic: no web dig run. All claims above are grounded in the source doc.
