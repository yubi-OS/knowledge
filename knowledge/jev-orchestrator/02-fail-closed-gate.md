# 02 - The deterministic fail-closed policy gate

Scope: the deterministic fail-closed policy gate: versioned policy, stamped enforcement version, deny-by-default semantics, and re-gating each action immediately before dispatch.

## What fail-closed means operationally

Fail-closed means the gate answers the question "is this specific action allowed right now?" with deny unless the policy proves otherwise. An unknown action type, an unknown host, a missing policy file, or an evaluation error must all resolve to deny, never to allow-by-exception. The agent-gate project describes itself as an execution authority layer for AI agents for exactly this reason: model output proposes, a separate deterministic authority disposes (source: https://github.com/SeanFDZ/agent-gate, weight 0.69). NVIDIA's definition of autonomous AI agents highlights why a separate authority is needed at all: autonomous agents act toward goals without step-by-step human instruction, which means their safety has to come from structural constraints rather than supervision (source: https://www.nvidia.com/en-us/glossary/ai-agents/, weight 0.65).

The Jev gate is deterministic by construction: it is plain code evaluating a versioned policy document, not a model call. Policy lives in KV as `jev-policy.json`, it is versioned, and every gate decision stamps the policy version it enforced (source: system of record). That stamp is what makes an audit trail meaningful months later: you can reconstruct exactly which rules were in force when an action was allowed, even after the policy has been edited several times. A governance audit pattern documents the same discipline under the name default-deny parity: the enforcement layer's actual decisions must be checkable against the written default-deny policy, version by version (source: https://microsoft.github.io/agent-governance-toolkit/security/audits/2026-06-10-policy-default-deny-parity, weight 0.44, weak backing).

## Why the gate must not be a model

The design principle is that a probability never authorizes dispatch. In the Jev pipeline the model layer (Understand and Decide) runs before the gate and its outputs are advisory only: it proposes an intent category, a yes/no actionability judgment, and a proposed action, and the gate then evaluates that proposal against policy as if it came from an untrusted source (source: system of record). A policy gate built as a separate, language-model-free layer is a recurring pattern in agent tooling because LLM outputs are variable by nature while authorization must be reproducible (source: https://github.com/SeanFDZ/agent-gate, weight 0.69).

## Gate rules in the deployed starter

The v1 starter policy on the live worker shows the granularity the gate supports: `http.fetch` to hosts `api.github.com` and `api.defapi.org` is allowed with no approval required and a 0.5 risk score; `http.post` requires human approval and carries a 1.0 score; plus task-level limits of 10 actions, 2 retries, and a 5 USD cost cap (source: system of record). This is the deny-by-default vocabulary: verb plus host plus approval requirement plus spend cap, evaluated mechanically.

## Re-gating at dispatch

One action being approved once is not the same as one action being allowed once. The deployed controller re-gates each action against current policy immediately before dispatch, not just at task admission (source: system of record). The distinction matters in three concrete scenarios: policy was tightened between approval and dispatch, the global pause switch was engaged meanwhile, or the approval row's binding no longer matches the payload about to be sent. All three must fail the dispatch, and in the first live run the pause check demonstrably skipped both dispatches with a `pause_active` verdict even though the actions had passed the gate earlier (source: system of record).

This is the same insight that drives default-deny parity audits: an allow decision is only trustworthy at the moment it is made, so the system of record has to show the decision was re-made at the moment of effect (source: https://microsoft.github.io/agent-governance-toolkit/security/audits/2026-06-10-policy-default-deny-parity, weight 0.44, weak backing).

## Design notes for adopters

Three properties to preserve when adopting this pattern. First, keep the policy in a versioned store the gate reads at evaluation time, never baked into the binary, so enforcement can change without redeploy and every decision records what it enforced. Second, keep the gate synchronous and cheap: it runs on every action, so it must be the most boring code in the system. Third, never let the gate's inputs include the model's confidence. The gate evaluates the action shape, not how sure the model was about it; confidence belongs to the advisory layer's reporting, not to authorization.
