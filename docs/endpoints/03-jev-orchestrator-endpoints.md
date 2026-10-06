# Jev Orchestrator Endpoints

Scope: the /api/jev task lifecycle endpoints - task create and stage transitions, approvals with approve/reject/guide, pause, summary, learnings and human promote - with their terminal states and gate invariants.

Source of record: yubi-OS/yubiOS docs/ENDPOINTS.md (source doc, weight 0.62). All claims below are from that document unless a dig source is named.

## The domain

The Jev v2 gated-approval orchestration core ingests a task (caller-supplied actions or a freeform prompt), understands and decides via the jev-1.13 model, passes every proposed action through a deterministic fail-closed gate (allowed / needs_approval / blocked), executes approved actions, verifies outcomes independently, and drives the task to one of six terminal states: succeeded, blocked, rejected, expired, failed, cancelled (source doc, weight 0.62). Approvals bind actor, target, payload, limits, expiry and policy version; every stage appends an append-only audit event (source doc, weight 0.62).

The external decision model behind understand/decide is the jev-1.13 typesafe decision model served through DefAPI (source doc, weight 0.62). The DefAPI API reference documents the same typesafe/jev-1.13 model surface the orchestrator calls (https://docs.typesafe.ai/api, weight 0.62); the model's own vendor page scores lower as a source (https://defapi.org/model/typesafe/jev-1.13, weight 0.14, weak).

## Endpoint contract

18 endpoints (source doc, weight 0.62). Health is unauthenticated; everything else is bearer JEV_API_KEY and rate-limited:

- GET /api/jev/health - policy version + paused flag, no auth.
- POST /api/jev/tasks - task create: caller-supplied payload.actions or freeform prompt; runs the ingest, understand, decide, gate pipeline. GET /api/jev/tasks lists tasks (expireStale first). GET /api/jev/tasks/:id returns task detail with actions, approvals, audit events and cost.
- POST /api/jev/tasks/:id/execute - dispatch task actions, re-checks pause, skips rather than firing.
- POST /api/jev/tasks/:id/verify - verify an action outcome.
- POST /api/jev/tasks/:id/continue - more_work (re-decide + re-gate) or terminal.
- POST /api/jev/tasks/:id/retry - retry an action within limits.
- POST /api/jev/tasks/:id/reconcile - reconcile an unknown outcome with evidence; never re-dispatches.
- POST /api/jev/tasks/:id/close - close with a terminal outcome. POST /api/jev/tasks/:id/cancel - closes cancelled.
- GET /api/jev/approvals - pending approvals queue with expiry countdowns (expireStale first).
- POST /api/jev/approvals/:id/approve - approves, then auto-dispatches the bound action after a CURRENT-policy gate re-check, and verifies + continues or closes the task in-request.
- POST /api/jev/approvals/:id/reject - reject an approval.
- POST /api/jev/approvals/:id/guide - attach human guidance to the approval's task (documented by the R1 refresh).
- GET /api/jev/pause and POST /api/jev/pause - read and set pause {paused, scope}. The read is fail-closed: an unreadable policy reports paused:true scope all.
- GET /api/jev/summary - tasks by state and outcome, pending approvals, cost rollup + policy version.
- GET /api/jev/learnings and POST /api/jev/learnings - learning proposal ledger list and propose.
- POST /api/jev/learnings/:id/promote - human promotion: bumps the policy version (new_policy optional, falls back to a current doc version bump), expires affected approvals, appends a policy changelog row.

## Key invariants

Seven invariants define the domain (source doc, weight 0.62):

1. Fail-closed deterministic gate: allowed, needs_approval, or blocked - never open by default.
2. Approvals are invalidated on a policy version change; a policy bump invalidates affected approvals.
3. Six terminal states; unknown outcomes reconcile-before-repeat; never re-dispatch on unknown.
4. Every stage appends an audit event, append-only.
5. No automated policy promotion - promoteLearning() is human-only via POST /api/jev/learnings/:id/promote.
6. Idempotency: task create dedupes per (tenant, idempotency_key).
7. Pause blocks new and queued dispatch but never undoes completed effects.

Plus one error-shape contract: invalid resend.send bodies are rejected at propose-time (422 / task closed rejected), never a 500 that orphans the task (source doc, weight 0.62).

## Module parts and bindings

Module parts: jev-main.js, routes-jev.js, jev-ingest.js, jev-state.js, jev-decide.js, jev-gate.js, jev-execute.js, jev-verify.js, jev-review.js, jev-loop.js, jev-improve.js, dbx.js (source doc, weight 0.62). Bindings: DB, JEV_API_KEY, AI, DEFAPI_API_KEY, RESEND_API_KEY (source doc, weight 0.62).

## Composition and design context

The orchestrator composes with Automations (propose_actions stage feeds proposals into the same gate), Evolution (directive execution goes through this gate), and the Taste Engine / Corpus Math (the jev-1.13 decision model is shared with the scorer and quality gates) (source doc, weight 0.62).

Design context (weak backing): the action-bound fail-closed approval protocol pattern has a published analogue in agent-governance literature (https://microsoft.github.io/agent-governance-toolkit/adr/0030-action-bound-appro, weight 0.29, weak), and an MCP-native approval-gate reference implementation exists (https://github.com/itcustomsolution/approval-gate-mcp, weight 0.29, weak). These corroborate the design pattern; the endpoint contracts above come only from the source doc.
