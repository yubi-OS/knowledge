# The human-in-the-loop approval queue

Scope: the approval flow in the jev orchestrator design: pending approvals, the dashboard as the queue, the review-then-continue lifecycle, and the pause endpoint.

## Where the approval step sits

The source architecture (Jev v2 control diagram, per the framing log) runs ingest, understand, decide, gate, execute, verify, continue/terminal, with a human review loop alongside the gate. In the merged design, the deterministic gate decides whether an action may run automatically; when the gate cannot or should not auto-approve, the action enters the approvals table and waits for a human. The framing log's key-assumptions section makes the routing explicit: jev-1.13 intent/risk classification routes tasks to review versus auto-act at stated thresholds, with a stated validation test (run 20 sample tasks, check that escalation decisions feel right). The advisory model influences where the human is needed; the human, not the model, completes the authorization.

The human-in-the-loop literature frames this as a runtime control pattern: the agent must request and receive a human decision before executing an action that could cause real-world impact (https://www.stackai.com/insights/human-in-the-loop-ai-agents-how-to-design-approval-workflows-for-safe-and-scalable-automation, jev weight 0.20, weak backing). Pattern catalogs describe the same structure: systematically insert human approval gates for designated high-risk functions while maintaining agent autonomy for safe operations, with approval interfaces and an audit trail (https://www.agentic-patterns.com/patterns/human-in-loop-approval-framework/, jev weight 0.45, weak backing).

## What qualifies for review

The framing log's own stress-test gives the selection rule in negative space. The outbound-automation literature makes the distinction the design relies on: some steps look automatable but should not be, and the distinction is not capability, it is consequence and context (https://dev.to/spuriqai/human-in-the-loop-by-design-where-approval-belongs-in-an-outbound-workflow-5gi5, jev weight 0.21, weak backing). In the jev design, consequence is expressed as the policy doc's per-scope rules plus the risk thresholds; context is what the Understand stage classifies. Practitioner taxonomies distinguish where the person sits relative to the action (before, during, after) as the axis that actually separates human-in-the-loop architectures (https://reachusama.com/learning/human-in-the-loop-ai-design-patterns/, jev weight 0.31, weak backing). The jev design is firmly of the before type for gated actions: nothing dispatches until the gate or the human says so.

Design guidance for HITL systems lists the knobs the design implicitly uses: approval workflows, escalation patterns, feedback loops, and confidence thresholds deciding when to keep humans in or out of the loop (https://myengineeringpath.dev/genai-engineer/human-in-the-loop/, jev weight 0.24, weak backing).

## The dashboard is the queue in v1

The MVP scope is explicit: "Dashboard at /jev/ served from KV: task list, pending approvals with approve/reject, costs, terminal states." And the not-doing section is equally explicit: "Email/Slack approval notifications: dashboard is the queue in v1." That is a deliberate pull-based design; the reviewer polls the dashboard rather than being pushed to. A comparable open-source approval-queue spec describes the same MVP shape: read tools execute immediately, write tools queue per-tool policy (auto, approve, approve_confirm), and the human can approve as-is, approve with edits to the arguments, or reject (https://github.com/Freespirits/social-auto-engine/blob/main/docs/specs/2026-05-02-approval-queue-and-dashboard-mvp-design.md, jev weight 0.23, weak backing).

The trade-off of a dashboard-as-queue is latency versus surface area: no notification integration means no approval channel to secure, and the approval action writes directly to the approvals table with the same key custody model as the API (per the framing log's open question, a JEV_API_KEY in the Secrets Store used as Bearer, with the dashboard approving via the same key held by Jenny's session; key custody is explicitly left open). Because approvals are rows in D1 under the ledger conventions, an approval is auditable by construction: who approved, when, against which policy version.

## Lifecycle around the queue

Three lifecycle pieces surround the queue:

1. Approve/reject writes a verdict row; the task continues or terminates per the state machine.
2. The pause endpoint lets a caller stop a task mid-flight, which is the human's lever for stopping an approved action that looks wrong in progress.
3. The reconcile endpoint covers partial executions after failures, appending what actually happened rather than rewriting history.

The framing log's un-testable bet is relevant here too: whether real automations will actually route through this flow rather than staying ad-hoc, with the mitigation being to ship one real automation (the Inbound Lead Workflow v1) on it as proof. The approval queue is the part of the design most exposed to that bet: a queue nobody visits is a stall, not a safeguard.
