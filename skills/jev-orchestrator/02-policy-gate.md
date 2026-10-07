# 02 The fail-closed gate and approval bindings

Scope: the deterministic gate with 3 outcomes, the block reasons, the approval binding shape, and the policy-version rule that expires stale approvals.

## 3 outcomes, no more

The source doc states the gate is deterministic and fails closed. Its only outputs are allowed, needs_approval, and blocked (source doc). There is no fourth output, no partial allow, and no model-generated judgment in the path. A probability from the advisory decide layer never authorizes anything; the gate disposes.

Fail-closed as a design principle means that when the checker itself cannot form an answer, the answer defaults to deny. The dig literature on the principle aligns: authorization boundaries should fail closed so that an unavailable or unreadable policy never widens access (https://nalar.dev/fail-closed-at-authorization-boundaries/, weight 0.10, weak), and a glossary entry defines fail-closed authorisation as denying by default when the decision point cannot be reached (https://nhimg.org/glossary/fail-closed-authorisation/, weight 0.09, weak). An arxiv paper argues capability gates are not authorization and should not be confused with it (https://arxiv.org/abs/2606.28679, weight 0.07, weak), which matches Jev's separation: capability (being able to reach a tool) is granted by the policy tool list, authorization (being allowed to act now) is the gate's decision.

## The block reasons

The source doc names the conditions that produce blocked: unreadable policy, unknown tool, host not allowlisted, pause active, limits exceeded (source doc). Two properties matter for callers:

1. The reasons array names the failing check, so a block is diagnosable without guessing (source doc).
2. A block for policy reasons is final unless the policy changes, while a block for spend or limits is a signal to promote a learning rather than raise limits silently (source doc, Guidelines item 4).

A block is not an error. It is a terminal-quality outcome, and the source doc repeats later that blocked is not success (doc 05).

## Approval bindings: 6 bound fields plus policy version

When the gate says needs_approval, an approval record binds: actor, target, payload, limits, expiry, and policy version (source doc). The binding is strict. The approval is for the exact action, not for a class of actions.

Two rules give the binding teeth:

1. Re-check at count time: the approval is re-checked against the CURRENT policy version before it counts (source doc). An approval granted under policy v5 does not authorize an action under policy v6.
2. Expiry: approvals expire, and the console shows expiry countdowns in the pending queue (source doc).

The policy-version rule is the sharpest invariant: a policy change expires every approval bound to an older version (source doc). Operationally, an operator who edits jev-policy.json or uses the dashboard Promote flow invalidates all in-flight approvals in one move. An API caller who tries to approve after such a bump gets a 409, and the body carries the new gate outcome (source doc, Errors). A dig result on keeping authorization approvals current places accountability for re-validation on the system rather than on reviewers' memory (https://nhimg.org/faq/who-is-accountable-for-keeping-authorization-approvals-current, weight 0.13, weak), which is the same design stance.

## Why the approval re-check matters in practice

The production-patterns doc (09) records the consequence in the live system: the approve endpoint re-gates against the current policy version, then executes the bound action, verifies it, and continues, all in one request (source doc, Gated repo commits section). This means an approval is not a stored yes that someone else's code might act on later under different rules. The moment of approval is the moment of the gate's final judgment.

## The gate in the router (doc 08 preview)

The hierarchy router's route.dispatch action passes the same fail-closed gate as every other action, and the invariant is stated in one line: the detector proposes the route, the gate disposes. Measurements are data, never authorization (source doc, Hierarchy Router section). This is the policy-version binding applied to measurement-driven routing: a band lookup reads routing.bands from the live policy at call time (source doc), so a policy edit changes routing behavior on the next call with no code deploy.

## Sources

- Source doc: skills/jev-orchestrator/SKILL.md in yubi-OS/yubiOS (sections: Invariants; Setup; Errors; Guidelines; Gated repo commits; Hierarchy Router).
- https://nalar.dev/fail-closed-at-authorization-boundaries/ (weight 0.10, weak)
- https://nhimg.org/glossary/fail-closed-authorisation/ (weight 0.09, weak)
- https://arxiv.org/abs/2606.28679 (weight 0.07, weak)
- https://nhimg.org/faq/who-is-accountable-for-keeping-authorization-approvals-current (weight 0.13, weak)
