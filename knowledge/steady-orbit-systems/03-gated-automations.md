# 03 - Gated Automations

Scope: the jev orchestrator on the steady-orbit worker: the fail-closed policy gate, approval bindings, six terminal states, the stage-based automations engine, and the lead machine with its refuse-to-claim doctrine. Grounded in the org's public skill and refs docs plus the worker's own AGENT.md.

Source-class note: the jev-orchestrator skill and refs docs are org public-repo records (weights 0.59-0.70); AGENT.md carries weak noul backing (0.28) because the model scores vendor surfaces low.

## What the orchestrator is

Jev is described as "an operations controller, not a chat model": you create a task describing what you want done and which tool calls would do it; a deterministic fail-closed policy gate decides whether the actions may run, need a human approval, or are blocked; execution happens with stable idempotency IDs; results are independently verified; and every task closes in exactly one of six terminal states. The DefAPI jev-1.13 model classifies intent and proposes actions, but it is advisory only: "a probability never authorizes anything" (source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/jev-orchestrator/SKILL.md, w 0.70; internal-record claim).

The design derives from the Jev_Architecture_v2 diagram: ingest, understand, decide, deterministic fail-closed policy gate, execute, independent verify, continue or terminal, with a human review queue, a pause/kill switch that cannot undo completed effects, central append-only state, and an improve loop whose learnings cannot activate themselves (source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/jev-orchestrator-2026-10-01.md, w 0.70; internal-record claim).

## The fail-closed gate

The gate is deterministic and fails closed. Its invariants are stated as enforced in code, not by convention (source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/jev-orchestrator/SKILL.md, w 0.70):

- Unreadable policy, unknown tool, host not allowlisted, pause active, or limits exceeded, and the output is blocked. The only outputs are allowed, needs_approval, and blocked.
- An approval binds actor, target, payload, limits, expiry, and policy version. A policy change expires every approval bound to an older version.
- Terminal states are distinct: succeeded, blocked, rejected, expired, failed, cancelled. "Blocked is not success."
- Unknown outcomes (a timeout after a possible side effect) are never retried blindly; reconcile first.
- Learnings are proposals; only a human promotes them, and promotion invalidates affected approvals.
- LLMs hold no credentials; tool headers are stripped to a policy allowlist.

The pause endpoint blocks new and queued dispatch but never undoes completed effects, and reading pause state is itself fail-closed: an unreadable policy reports paused:true with scope "all" (source: https://steady-orbit.systems-a.workers.dev/AGENT.md, weak backing, w 0.28).

## Stage-based automations

Jev Automations deploy on the worker as versioned definitions in D1 (the jev_automations table) with stage pipelines and a single-active-per-name activation rule; older active versions auto-pause, and activation re-validates the stored definition so "a corrupted def can never go active" (source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/jev-automations-2026-10-01.md, w 0.59; internal-record claim). The stage engine (jev-engine.js) runs five stage types:

- tool: pipeline I/O, GET-only enforced at definition validation and at runtime; writes must go through propose_actions and the gate.
- llm: an interpolated prompt run in JSON mode with repair and one strict retry, failing soft on unparseable output.
- builtin: pure deterministic functions, v1 including lead_research (the ported lead machine), corpus_audit, corpus_lens, corpus_drift, and tautology_gate.
- guard: a llama-guard-3-8b safety verdict; unsafe skips propose_actions and parks the task awaiting_approval with reason guard_flagged.
- propose_actions: proposals enter the same deterministic gate as hand-written actions; the LLM never authorizes.

The scheduler fires on the worker cron (every 5 minutes) with compare-and-set on last_fired_at, so "a lost tick is fine; a double-fire is not," and per-interval idempotency keys on created tasks (source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/jev-automations-2026-10-01.md, w 0.59). Model routing is three-tier: classify to llama-3.1-8b, draft to llama-3.3-70b, guard to llama-guard-3-8b, all via Cloudflare Workers AI, with a raw: pin for anything else; neuron usage is accounted onto each task (same source; AGENT.md, w 0.28).

Prompt intake is treated as untrusted input: a freeform prompt (up to 8000 chars) is stored verbatim, delimited, and never interpolated into URLs; one 70b call proposes actions over the policy tool list, and every proposal passes the same validation as caller-supplied actions before the same gate (source: refs/jev-automations-2026-10-01.md, w 0.59).

## The lead machine and refuse-to-claim

The lead machine's built-in (lead_research) is "a verbatim port of the audit/extract/normalize/template lib," and the port preserved every refuse-to-claim guard: javascript_rendered, form-vendor fingerprints, roughly 60-vendor booking detection, and facebook-only/no-website lanes. Validation included 40 ported behavioral tests covering both known false-positive traps. Lead state lives in D1 (jev_leads), and outbound sends are resend.send gated actions rather than free sends (source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/jev-automations-2026-10-01.md, w 0.59; internal-record claim).

The doctrine generalizes across the system: an unprovable claim is never shipped as a success. The same refs doc records the live demonstration: when the model proposed a non-standard expected predicate, the task verified honestly as unknown (never success) and returned more_work rather than a fabricated pass. Policy v4 added web.fetch_public (GET-only, any host, credential-less, response-capped) and places.search, with the governance note that "an any-host read-only tool is the same risk class as a browser; it carries no credentials and its responses are capped and logged." Where a credential is missing, lead-research fails CLOSED with credential_unavailable and zero fetches, a behavior covered by an explicit test (same source).

## Audit trail and verification

Every stage appends an audit event to the append-only jev_events table; nothing is silently rewritten (source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/jev-orchestrator/SKILL.md, w 0.70). Verification is a separate stage with three verdicts: verified_success, confirmed_failure, or unknown, and unknown outcomes are reconciled with evidence before any repeat (source: https://steady-orbit.systems-a.workers.dev/AGENT.md, w 0.28). The build record reports 232 of 232 tests passing at ship time (lane suites plus engine plus e2e, all run against the merged tree) after the parallel-lane build caught five cross-lane bugs, including a sync/async dedupe bug that would have made every idempotent create a false duplicate (source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/jev-automations-2026-10-01.md, w 0.59).
