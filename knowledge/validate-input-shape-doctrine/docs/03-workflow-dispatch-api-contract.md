# The GitHub workflow_dispatch API Contract

Scope: what the GitHub REST dispatch endpoint accepts, why malformed payloads return HTTP 422, the four input types and their serialization rules, and the static-analysis gap that lets dispatch bugs through.

## The dispatch endpoint and its validation

The dispatch event is created with `POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches`, part of the Actions workflows REST API (https://docs.github.com/en/rest/actions/workflows, jev weight 0.94, high). The endpoint takes `ref` (the branch to dispatch) and `inputs` (an object of key/value pairs). The contract the doctrine encodes lives in how GitHub validates that `inputs` object: an input key the target workflow does not declare in its `workflow_dispatch.inputs` block is rejected, and a value whose type does not match the declared type is rejected. Both rejections surface as HTTP 422.

The 422-on-undeclared-key behavior is directly observable: triggering a workflow whose boolean default handling diverges fails with `HTTP 422 ... could not create workflow dispatch event` (https://github.com/cli/cli/issues/5246, jev weight 0.73, high). Community reports confirm the same failure class when triggering dispatches from the API with mismatched payloads (weak backing, jev weight 0.07, https://stackoverflow.com/questions/70151645/how-can-i-trigger-a-workflow-dispatch-from-the-github-api).

## The four input types and serialization

GitHub added typed inputs for manually triggered workflows in 2021: `choice`, `boolean`, and `environment` alongside the default `string` (https://github.blog/changelog/2021-11-10-github-actions-input-types-for-manual-workflows/, jev weight 0.91, high). The full syntax for each type, including `options:` for choice and `default:` handling, is specified in the workflow syntax reference (https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax, jev weight 0.97, high).

Serialization rules that follow from the type system:

- `boolean` accepts the JSON literals `true` and `false`. The strings `"true"`/`"false"` do not satisfy the declared type and are rejected with 422 on the dispatch path.
- `choice` accepts exactly one of the declared `options:` values, case-sensitive.
- `string` accepts any JSON string.
- `environment` accepts a repository environment name.

The type system has one documented asymmetry that matters for dispatchers: a boolean input is compared as a string in `workflow_dispatch` context but as a real boolean in `workflow_call` context, so the same comparison can yield different results depending on the trigger path (https://github.com/actions/runner/issues/3571, jev weight 0.71, high; corroborated by https://github.com/orgs/community/discussions/9343, jev weight 0.52, high). A doctrine that lets the same payload cross both boundaries must therefore treat serialization as an explicit contract, not an implementation detail.

## Why the contract is invisible without machine help

The workflow's declared inputs are data, not code: they live in the `workflow_dispatch.inputs` YAML block and are only surfaced by the GitHub UI's dispatch form or by fetching the workflow file. A dispatcher author who writes a script by hand has no machine-checked connection to that block. Three consequences:

1. **Hand-written dispatch payloads drift.** The dispatcher sends what its author believed the workflow accepts. The workflow's actual declaration is authoritative, and the mismatch only appears at dispatch time as 422. This is the exact failure class the yubiOS dispatcher hit in 2026-07-29 (CI #405, `curl: (22) The requested URL returned error: 422`; source doc evidence).

2. **The failure is per-target, not per-dispatcher.** The same payload key can be valid for one target and invalid for the next, because each workflow declares its own inputs. A group dispatch loop hits the invalid pair first and, with `set -euo pipefail`, never reaches the remaining targets.

3. **Static checkers do not cover runtime dispatch contracts.** actionlint performs syntax checks against workflow syntax, type checks for `${{ }}` expressions, and usage checks for `with:` inputs and step `outputs:` (https://github.com/rhysd/actionlint, jev weight 0.41, weak for the specific claim that it misses dispatch contracts: the repo documents what it checks, not what it omits). It validates a workflow file in isolation; it cannot know which inputs another workflow will send to it at runtime.

## The complement the API offers

The REST workflows API can list a repository's workflows, which a dispatcher can use to fetch or enumerate targets before dispatch (https://docs.github.com/en/rest/actions/workflows, jev weight 0.94, high). Reading each target's workflow file yields its declared `workflow_dispatch.inputs` block, which is exactly the set the dispatcher should intersect its payload with. That read-then-intersect pattern is what the validate-input-shape doctrine's Rule 4 mandates, and what the static validator enforces by checking dispatcher source against target declarations at PR time instead of at dispatch time.

## Practical contract summary

For any pair (dispatcher D, target T): D may send only keys declared in T's `workflow_dispatch.inputs`; each value must serialize to T's declared type as a JSON literal of that type; and when T declares `workflow_dispatch: null` or `workflow_dispatch: {}`, D must send no inputs at all. Violations of the first two are rejected by GitHub with HTTP 422; violations of the third are rejected the same way. The cost of violating them is a burned runner-minutes dispatch cycle and a silent skip of every target after the first failure, which is why the doctrine pushes validation left, into CI.
