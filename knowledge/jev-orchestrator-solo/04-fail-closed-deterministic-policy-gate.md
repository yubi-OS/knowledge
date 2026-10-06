# The fail-closed deterministic policy gate

Scope: why the jev orchestrator's execution gate must be deterministic and fail closed, and why LLM probabilities are advisory and never authorize actions.

## The invariant that killed V6

The framing log drops variation V6 (LLM-scored policy gate, Sigma 9) with the stated reason that it "violates the diagram's own deterministic-gate invariant: LLMs hold no authorization." The same principle appears in the recommended direction: jev-1.13 (via the /api/decide relay) powers Understand (intent classification) and Decide (action proposal plus risk scoring), but it is advisory only, and its probabilities never authorize anything.

This is a deliberate architectural split between judgment and authorization. Large language models are probabilistic systems trained on vast amounts of text; their outputs are predictions, not policy decisions (https://en.m.wikipedia.org/wiki/Large_language_model, jev weight 0.82, authoritative backing). A probability is a number about a model's belief. Authorization is a decision about whether an action may run. The design keeps the first as input and the second as code.

The 2026 agent-security literature makes the same distinction sharply. A survey of pinned public-source agent frameworks found that all three examined provide capability gating by default, but none provides a deterministic fail-closed per-call value authorization gate by default; the paper introduces ScopeGate, a five-stage PDP/PEP for agent tool calls, precisely because capability gating alone is not authorization (https://arxiv.org/abs/2606.28679, jev weight 0.70, authoritative backing). AWS's agent-security guidance is likewise explicit that input filtering alone is not sufficient and that the policy engine must block disallowed actions deterministically, with model-scored signals kept outside the enforcement path (https://repost.aws/articles/ARRfjH_lA4TZeKnM0OU0iYkg, jev weight 0.76, authoritative backing). Purpose-built tooling takes the same shape: Toolwarden is described as "a deterministic gate between an LLM agent and its tools" (https://github.com/amirfandev/toolwarden, jev weight 0.53, authoritative backing).

## Fail closed, concretely

The framing log names the gate "fail-closed" without defining it. The definition matters: in a fail-open design, a system that fails defaults to allowing access; in a fail-close design it defaults to denying (https://community.cisco.com/t5/security-knowledge-base/fail-open-amp-fail-close-explanation/ta-p/5012930, jev weight 0.11, weak backing). For authorization specifically, the reasoning is that the gate is the last check before a sensitive action, so a failure in that gate must be treated as a denial condition rather than a green light; if a policy engine times out, a claim is missing, or state is stale, the safe outcome is refusal (https://nhimg.org/faq/how-should-teams-design-authorization-checks-so-they-fail-closed-instead-of-open/, jev weight 0.23, weak backing). A fail-closed design evaluates whether the caller, token, context, and scope are all acceptable before execution continues, and any missing required signal means refusal (https://nhimg.org/glossary/fail-closed-authorisation/, jev weight 0.16, weak backing).

Design guidance for authorization boundaries states the failure-mode taxonomy directly: errors and dependency failures must not silently turn into unintended access (https://nalar.dev/fail-closed-at-authorization-boundaries/, jev weight 0.64, authoritative backing).

## How the gate is specified in the finalist design

Per the framing log, the merged design implements the gate as: each task declares its tool calls; the gate checks them against a policy doc in KV (versioned, and the gate records the policy version it enforced); dispatch uses stable action IDs with idempotency keys. The stress-test exchange in the log sharpens the boundary: the critique was that "a thin controller that still trusts the caller to define its own tools is just an audit log with ambitions," and the counter was that the gate validates the task's declared tools against the versioned policy doc before any dispatch, so callers cannot invent scopes at call time.

Two properties of this design follow from the invariant:

1. The gate's input vocabulary is closed. A task can declare tool calls, but only ones the versioned policy doc admits. The gate compares, it does not interpret.
2. The gate's output vocabulary is closed. Approve, reject, or escalate to human review; no probability enters the decision. Agent-guardrail architectures that separate model-based checks from deterministic validation, authentication, authorization, tool allowlists, and approval gates describe exactly this division of labor (https://promptessor.com/blog/llm-guardrails-guide, jev weight 0.21, weak backing).

The result is that jev-1.13's probabilities influence routing (review versus auto-act) but never outcome. The gate is the component where the design refuses to be clever.
