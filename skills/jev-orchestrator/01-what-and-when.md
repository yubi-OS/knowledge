# 01 What Jev is and when to use it

Scope: what the Jev orchestration API is, the four situations that call for it, and the two situations where it is the wrong tool.

## An operations controller, not a chat model

The source doc (yubi-OS/yubiOS skills/jev-orchestrator/SKILL.md) opens with a sharp distinction: Jev is an operations controller, not a chat model. The caller creates a task describing what it wants done and which tool calls would do it. From there the system runs a fixed pipeline: a deterministic fail-closed policy gate decides whether the actions may run, need a human approval, or are blocked; execution happens with stable idempotency IDs; results are independently verified; and every task closes in exactly one of 6 terminal states. jev-1.13 (a DefAPI decision model) classifies intent and proposes actions, but it is advisory only: a probability never authorizes anything (source doc).

That division of labor is the core mental model. Determinism owns the authorization decision. The language model owns classification and proposal. A human owns approval of risky actions and the promotion of learnings. The corpus treats this division as the lens for every later doc: the gate (02), the task lifecycle (03), verification (04), terminal states and audit (05), and the LLM layers (06, 08).

## The 4 situations that call for Jev

The source doc lists 4 triggers. Use Jev when:

1. An automation must perform an external action (an HTTP call to a provider) and someone should be able to review or stop it (source doc).
2. Spend, rate, or limit budgets need to be enforced in code, not in prose (source doc). The gate checks limits mechanically on every pass, so a budget is a policy fact rather than a documentation promise.
3. The action can fail ambiguously, for example a network timeout after a possible side effect, and needs reconcile-before-repeat semantics (source doc). Doc 04 covers the verify, retry, and reconcile paths.
4. You want an audit trail where every stage appends an event and nothing is ever silently rewritten (source doc). Doc 05 covers the terminal states and the events log.

These 4 triggers are the general shape of what practitioners call human-in-the-loop automation: an agent proposes, a gate disposes, a human approves the risky residue. Dig results on the pattern are consistent in shape even though the weighting pass scored all of them below the 0.5 authoritative threshold, so this corpus labels them weak backing. A guide on human approval gates for autonomous AI agents frames the same proposal, gate, approve loop (https://www.arcjet.com/blog/human-approval-gates, weight 0.08, weak), and a longer piece on designing human approval gates for autonomous agents describes approval as a first-class system state rather than a chat interruption (https://arlyon.dev/articles/approval-gates, weight 0.12, weak). Spend-limit enforcement as a platform feature, rather than a caller convention, is documented for LLM APIs by OpenAI (https://developers.openai.com/api/docs/guides/spend-limits, weight 0.12, weak) and by Cloudflare AI Gateway (https://ai-gateway.cloudflare.com, weight 0.05, weak).

## The 2 situations where Jev is the wrong tool

The source doc is explicit about the negative space. Jev is not for:

1. Pure read-only research. If nothing has side effects, just call the API directly (source doc). The gate, approvals, and audit add overhead with nothing to protect.
2. Workflows that already have explicit human sign-off per call and no budget concerns. Jev adds structure you do not need in that case (source doc).

The corollary: if a caller finds itself routing read-only GETs through tasks purely for uniformity, it is paying the structure tax for no protection. The source doc's guidance is to reserve the machinery for actions whose effects matter.

## What every task gets, in one map

Every task that enters the system gets the same treatment regardless of how it was created (source doc):

1. Gate: a deterministic check with exactly 3 outputs (allowed, needs_approval, blocked).
2. Approval: when needed, a human approves a binding of actor, target, payload, limits, expiry, and policy version.
3. Dispatch: execution with re-check of pause state at dispatch time.
4. Verify: an independent check of the result against the declared expectations.
5. Terminal: exactly one of 6 closing states.
6. Audit: every stage appends an event to an append-only log.

## Reading order for the rest of the corpus

Doc 02 covers the gate and approval bindings. Doc 03 walks the caller flow end to end. Doc 04 covers verification, retry, and reconcile. Doc 05 covers the terminal states, audit log, and cost accounting. Doc 06 covers the advisory LLM layer and model routes. Doc 07 covers the automations layer. Doc 08 covers the measurement-gated hierarchy router. Doc 09 collects production contracts proven in live rounds.

## Sources

- Source doc: skills/jev-orchestrator/SKILL.md in yubi-OS/yubiOS (sections: When to use; Invariants; The flow).
- https://www.arcjet.com/blog/human-approval-gates (weight 0.08, weak)
- https://arlyon.dev/articles/approval-gates (weight 0.12, weak)
- https://developers.openai.com/api/docs/guides/spend-limits (weight 0.12, weak)
