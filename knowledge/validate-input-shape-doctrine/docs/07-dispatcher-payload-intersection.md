# Dispatcher Payload Intersection and the Audit Echo

Scope: the dispatcher-side half of the doctrine: intersecting the payload with declared target inputs, the audit-echo pattern for undeclared inputs, the limits of static checking against dynamic dispatchers, and the runtime complement.

## The intersection rule

Rule 4 of the doctrine makes payload intersection mandatory, not optional: a dispatcher must compute `payload = caller_inputs AND target_declared_inputs` and send only the intersection. The target's declared inputs come from reading the target workflow's YAML `workflow_dispatch.inputs` block, or by fetching the workflow metadata from the GitHub REST API (https://docs.github.com/en/rest/actions/workflows, jev weight 0.94, high). Undeclared keys are rejected by the dispatch endpoint with HTTP 422, and in a group-dispatch loop guarded by `set -euo pipefail`, the first rejection kills the loop and every remaining target silently never runs. That cascade shape is what makes the intersection rule a doctrine rule rather than a style preference (source doc Rows 1 and 3 evidence).

The rule generalizes across dispatcher kinds: parent workflows, operator scripts, third-party tools, and MCP servers are all dispatchers. Workflow chaining is a documented mainstream pattern (one workflow triggering another via `workflow_dispatch`), so the population of dispatchers is large (https://github.com/marketplace/actions/workflow-dispatch, jev weight 0.88, high). Reusable workflows have their own typed input contract with `workflow_call`, and inputs are passed at the `uses:` level there, which is a separate but adjacent validation surface (https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows, jev weight 0.94, high).

## The audit echo (Rule 8)

Intersecting creates a problem: an operator supplies a `reason` field for audit purposes, but most inner workflows do not declare `reason`, so forwarding it 422s. The doctrine's answer is Rule 8: the dispatcher's own log is the only place undeclared inputs are allowed. The dispatcher keeps `reason` in its own step log (an echo like `REASON: ${{ inputs.reason }}` sourced from an `env:` block) and must not forward it to any inner workflow that does not declare it. The audit trail survives at the dispatcher layer; the payload stays clean at the target boundary. This is the formalization of the 2026-07-29 fix that dropped `reason` forwarding to inner workflows after the second 422 cascade (source doc evidence, commits `2f643ab7` and `b0a96a11`).

## The static check and its limits

The CI gate's Rule 4 check is structural: it reads the dispatcher's source, finds every dispatch step, extracts the inputs template, and asserts every key is declared by every target the dispatcher reaches. For a dispatcher with a static input map, this check would have caught both historical failures at PR time: the undeclared `Docker_push` sent to fetches workflows, and the `reason` forwarded to non-declarers.

The limit is dynamic input computation. A dispatcher that builds its payload from shell loops, environment variables, or a jq pipeline computed at runtime has no static input template to extract. The validator's response is honest scoping rather than false confidence: emit a warning that the dispatcher check is heuristic and may miss dynamic cases, and offer a per-workflow opt-out for legitimately dynamic dispatchers. Deeper checking (sandbox-executing the dispatcher's payload computation) is explicitly deferred (source doc open question 5).

A second gap: the check asserts declaration, not runtime reachability. Whether a dispatched target actually runs on the requested runner, token, or ref is a separate contract; the adjacent OMN-159 "workflow_dispatch to group reachability assert" issue tracks that surface (source doc evidence).

## The runtime complement

Static checks validate the code path; runtime dispatch surfaces validate the human path. The yubiOS ci-launchpad app already caches each child workflow's parsed input schema (fetched from workflow YAML, cached 1 hour, internal `ci_*` inputs filtered out) and renders dispatch forms from it, so an operator composing a dispatch in the UI is constrained to declared keys and types by construction (source doc app context, apps/personal-WbtUgeUv/ci-launchpad/ and apps/github-yubios-KS9n5GAT/ci-launchpad/). The doctrine names this as the runtime complement to the static validator: if the validator produces a finding, the app can surface it as a hint in the dispatch form. Code-side, marketplace validation actions exist that run a validation script against workflow inputs at dispatch time (https://github.com/marketplace/actions/inputs-validation-action, jev weight 0.65, high), which is the same idea applied to arbitrary input constraints.

Community discussion of the same need (how to validate inputs for manually triggered workflows) shows the gap is real and unmet by GitHub itself (weak backing, jev weight 0.10, https://github.com/orgs/community/discussions/48373).

## Contract summary

For every dispatcher: intersect before sending; keep audit-only fields in the dispatcher's own echo; serialize to the target's declared types (the boolean/string asymmetry across trigger contexts makes this a correctness requirement, not a nicety); and expect static checks to catch the dominant class while dynamic dispatchers require runtime surfaces or explicit opt-out.
