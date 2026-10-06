# Poll-friendly API design for automation callers

Scope: designing the /api/jev/* surface so n8n workflows and agent sessions are first-class callers: plain JSON, one task per resource, poll-friendly status, webhook-free.

## The constraint that shaped the API

The framing log records the API requirement as a design principle, not an afterthought: "The API is designed so n8n workflows and Sauna sessions are both first-class callers (plain JSON, one task per resource, poll-friendly status endpoint, webhook-free)." This comes from variation V4 (n8n-first orchestration template, Sigma 15), which lost the ranking but was folded in as an API-compatibility constraint on the merged V1+V5 design.

The motivation is caller-side simplicity. n8n is a workflow automation platform combining AI capabilities with business process automation (https://n8n.io/, jev weight 0.68, authoritative backing), and its generic HTTP integration surface is the HTTP Request node, documented for integrating arbitrary APIs into workflows (https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest, jev weight 0.96, authoritative backing). A webhook-free API means an n8n workflow can create a task, poll its status endpoint on a schedule, and branch on the result, all with stock HTTP nodes; no inbound webhook registration, no tunnel, no per-workflow endpoint management.

## Why polling was chosen over webhooks

The integration-pattern literature gives the decision rule the framing log implicitly applied: call the API directly when you need data on demand and control timing yourself; poll when the source has no push capability or the consumer cannot accept inbound connections; use webhooks when you need near-real-time reaction to events; in production, combine patterns (https://cesarayala.dev/blog/webhooks-vs-polling-vs-api/, jev weight 0.24, weak backing). Comparison guidance weighs latency, cost, scalability, reliability, and security between the two (https://asoasis.tech/articles/2026-03-26-0253-webhook-vs-polling-api-comparison/, jev weight 0.53, authoritative backing). Polling with change detection is explicitly described as the reliable alternative when webhooks are not available (https://danstoll.io/patterns/api-polling-change-detection, jev weight 0.62, authoritative backing).

For an approval orchestrator, polling has a second advantage beyond reachability: the caller's poll cadence is naturally coupled to the approval wait. A task that pauses for human review simply stays in its status; the caller's next poll observes it. No push fan-out, no retry semantics for missed notifications, no per-caller subscription state. The cost is latency (updates arrive at poll granularity) and poll load, which for automation callers polling on minute-level schedules is negligible.

## The surface

Per the framing log, the /api/jev/* route family in v1 is: tasks CRUD-lite (create/get/list), a gate decision endpoint, approval endpoints, a pause endpoint, and a status/summary endpoint. The resource model is one task per resource, so a caller creates a task, reads it back by ID, lists pending ones, and polls status. Authentication is a stated open question: a JEV_API_KEY in the Secrets Store used as Bearer, with the dashboard approving via the same key held by Jenny's session; key custody is left open.

Two design properties follow from "first-class callers":

1. Plain JSON in and out. No SDK, no custom content types, no schema negotiation. An n8n HTTP node or a Sauna session fetch works against the same endpoints with the same bodies.
2. Idempotent-ish semantics on the write path. The execution layer uses stable action IDs with idempotency keys (the ledger conventions), so a caller-side retry of a task creation or an approval write does not double-execute.

Integration-pattern references for automation platforms list the same concerns as the checklist for such APIs: authentication strategies, error handling, rate limiting, and data transformation (https://automationatlas.io/guides/api-integration-patterns-automation/, jev weight 0.13, weak backing).

## What the constraint rules out

Webhook-free also rules out push-style UX in v1: no email or Slack approval notifications (explicitly in the not-doing list; the dashboard is the queue), and no callback registration for task completion. Callers learn outcomes by polling. The framing log accepts this deliberately: the v1 audience is a small number of automations and the owner's own sessions, not a fan-out platform. If adoption grows, the additive path is a notification layer on top of the same status endpoint, not a redesign of it.
