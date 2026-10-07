# 06 The advisory LLM layer: jev-1.13, model routes, and no-credential design

Scope: how language models fit into Jev without ever authorizing anything or holding credentials.

## Advisory by construction

jev-1.13 (a DefAPI decision model) classifies intent and proposes actions, but it is advisory only: a probability never authorizes anything (source doc). The deterministic gate owns the decision. The source doc makes this the headline invariant and repeats it in the automations layer: every LLM proposal passes the same deterministic gate as hand-written ones; the LLM never authorizes anything (source doc).

A subtle point from the production rounds: an intent classification of actionable: 0 (below_floor) does not block a proposed action. The deterministic gate still decides (source doc, Gated repo commits). The email regression that produced the resend.send validator was a schema defect, not a gate defect, and the gate behaved correctly on a below-floor intent. Advisory classification and deterministic gating are independent checks, and a weak classification never short-circuits the strong one.

## LLMs hold no credentials

The invariant: LLMs hold no credentials; tool headers are stripped to a policy allowlist (source doc, Invariants). The model proposes an action; the gate validates it against the policy (known tool, allowlisted host, declared method); the executor holds whatever credentials the policy grants. This is least privilege applied to agent tool execution, and dig literature on the topic argues the same shape: agents should receive scoped, minimal tool permissions rather than ambient credentials (https://unimon.co.th/en/blog/ai-agent-least-privilege-tool-permissions, weight 0.07, weak). Background on what an LLM is and is not keeps the framing honest: the model generates proposals, the surrounding system enforces policy (https://hai.stanford.edu/ai-definitions/what-is-a-llm, weight 0.11, weak; https://en.wikipedia.org/wiki/Large_language_model, weight 0.05, weak).

## Model routes

The automations layer defines 3 named routes plus a pinning escape (source doc):

1. classify: llama-3.1-8b-instruct-fp8, cheap extraction and classification.
2. draft: llama-3.3-70b-instruct-fp8-fast, generation including prompt-intake action proposals.
3. guard: llama-guard-3-8b, an outbound-content safety verdict; unsafe goes to human review.
4. raw:<model> pins anything else.

Neuron usage lands on the task's llm_neurons, so LLM spend is attributed per task (source doc). GET /api/jev/models lists the routes. The guard route is a safety classifier in front of outbound content, which matches the purpose llama-guard was built for as a safety-focused model for classifying content risk (https://theapplied.co/models/meta-llama-llama-guard-3-8b, weight 0.04, weak; https://deepinfra.com/meta-llama/Llama-Guard-4-12B, weight 0.04, weak). The Llama family models themselves are open-weight instruction models from Meta (https://dev.meta.ai/llama/models/llama-3, weight 0.04, weak).

## Prompt intake is a first-class task input

A freeform prompt is a first-class task input: the 70b Llama model proposes actions, and every proposal passes the same deterministic gate as hand-written ones (source doc, Automations). This closes the classic agent escape hatch where natural-language instructions bypass structured intent. In Jev the prompt is parsed into the same action shape, so the gate sees identical data whether the actions came from a script or a sentence.

## Degrade behavior: decide failures never block the pipeline

Upstream decide failures never block the pipeline: understand returns {unavailable: true} and the gate still runs on caller-declared actions (source doc, Errors). The advisory layer is therefore also optional at runtime. A caller with deterministic actions loses nothing when the model is down; a prompt-intake task simply cannot be understood until the model returns.

## The 409 path for approvals

Approval re-checking (doc 02) interacts with the advisory layer only indirectly: the 409 on approval binding mismatch or supersession by a policy change carries the new gate outcome in the body (source doc, Errors). The caller sees the deterministic verdict, not a model opinion.

## Sources

- Source doc: skills/jev-orchestrator/SKILL.md in yubi-OS/yubiOS (sections: Invariants; Automations; Errors; Gated repo commits).
- https://hai.stanford.edu/ai-definitions/what-is-a-llm (weight 0.11, weak)
- https://unimon.co.th/en/blog/ai-agent-least-privilege-tool-permissions (weight 0.07, weak)
- https://theapplied.co/models/meta-llama-llama-guard-3-8b (weight 0.04, weak)
- https://deepinfra.com/meta-llama/Llama-Guard-4-12B (weight 0.04, weak)
- https://dev.meta.ai/llama/models/llama-3 (weight 0.04, weak)
- https://en.wikipedia.org/wiki/Large_language_model (weight 0.05, weak)
