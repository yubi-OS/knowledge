# 07: GitHub Actions inputs: workflow_call, workflow_dispatch, and secrets gating

Scope: how GitHub Actions workflow and action inputs map to the seven-channel taxonomy, the declaration fields, the INPUT_<NAME> env mapping, and the secrets permission gate.

Grounded in the source doc `yubi-OS/yubiOS skills/nss-inputs/SKILL.md` plus the searXNG dig (digs/07-github-actions-workflow-inputs.json). Dig sources: official GitHub Docs.

## Declaration fields

For reusable workflows, the source doc requires each input to declare its `description`, `required` (true/false), `default`, and `type`. The workflow syntax reference (weight 0.96) is the authoritative page for both `workflow_call` and `workflow_dispatch` input blocks, and the contexts reference (weight 0.95) documents how those inputs surface in expressions. The type field is narrower than a script's type field: the source doc notes `boolean`, `number`, `string` are types only supported on `workflow_call`; `workflow_dispatch` accepts `boolean`, `number`, `string`, `environment`, and `choice` variants per the workflow syntax docs.

## How inputs reach the consuming code

GitHub maps action inputs to `INPUT_<NAME>` environment variables inside the action container, per the source doc. Inside a workflow, inputs flow through `inputs.<id>` and `${{ inputs.<id> }}` in expressions (expressions reference, weight 0.95). The two paths are different channels in doc 01's taxonomy: the `inputs` context is the request-surface-like channel into a reusable workflow; `INPUT_*` env vars are the environment channel into a composite action's steps.

## Secrets are a separate channel

The source doc: never read `secrets.*` from a job whose `permissions:` block does not explicitly grant them, and never pass secrets through workflow_call inputs; use `secrets:` explicitly. GitHub's "Using secrets in GitHub Actions" how-to (weight 0.96) documents the secrets context and its default masking behavior. The dig collected community threads about passing environment variables as inputs (Stack Overflow, weight 0.13, weak backing; a GitHub community discussion, weight 0.14, weak backing) which describe the pattern the source doc rejects; they are recorded low-weight precisely because they document the anti-pattern.

## Precedence for workflows

The source doc records the GitHub Actions precedence as a deviation from the canonical CLI > env > config > default order: workflow_dispatch input > workflow_call default > workflow default (branch-level default). Guideline 4 requires stating which one wins when a value can arrive through multiple channels, and Example 4 of the source doc spells the chain out for a concrete workflow.

## The yubiOS example, decoded

The source doc's Example 4 declares a reusable workflow's inputs: `allow_real_u2f` (boolean, default false; when true the workflow sets ALLOW_REAL_U2F=1 in the test step env, because sudo's env forwarding is explicit-only), `digest` (string, default empty; a sha256 quay.io digest to pin the base image, empty meaning the workflow resolves the latest fedora-bootc:45 digest), and `group` (string, default "build"; one of build/fetches/smoke/dispatch-reachability). Validation: GitHub rejects unknown input ids; the workflow re-validates `group` against an enum and exits 1 with a clear message on mismatch. Prerequisite: a physical YubiKey on the runner for destructive tests. Secrets: never passed through workflow_call inputs; use `secrets:` explicitly.

## Why unknown inputs are rejected at the platform boundary

GitHub's rejection of unknown input ids is validation at the boundary in doc 03's sense: the platform collects inputs and rejects them before the workflow runs, then the workflow re-validates enum membership itself. The two-stage pattern (platform-level schema, workflow-level cross-field rules) is exactly the pipeline order from the source doc, and it is what makes the `constraints` field of doc 02 enforceable twice, once by the runner and once by the job step.
