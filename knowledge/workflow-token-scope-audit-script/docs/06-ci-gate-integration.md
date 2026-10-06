# 06 - Wiring the audit as a CI gate

Scope: turning the audit script into a CI gate: pull_request path filters, scheduled drift scans, workflow_dispatch inputs, and artifact upload of the audit report.

## Trigger 1: pull_request with a paths filter

The `pull_request` event supports a `paths` filter so a workflow runs only when the changed files match the given globs (https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow, weight 0.92). The yubiOS gate filters on `.github/workflows/**`, `.github/actions/**`, and the two script files themselves (`scripts/audit-workflow-tokens.py` and the allowlist YAML), so every PR that could change token behavior re-runs the audit, and PRs that only touch docs do not pay for it. The workflow syntax reference confirms the general event-filter machinery these filters build on (https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax, weight 0.97). One subtlety the filter has to cover: the gate must also trigger on changes to the audit script itself, otherwise a broken script can pass its own gate silently.

Community practice shows why the filter needs care: real projects use the paths glob as their only change filter and treat the pull_request trigger as the trust boundary, so an over-broad glob means slow CI and an over-narrow one means missed runs (https://github.com/getlantern/lantern/pull/9062, weight 0.68). For finer-grained conditional execution inside a workflow (for example skipping only the upload step), the dorny/paths-filter action provides file-modification-based conditions for pull requests, feature branches, or recent commits (https://github.com/dorny/paths-filter, weight 0.75).

## Trigger 2: scheduled drift scan

The gate also carries `schedule: cron: '0 9 * * 1'`, a weekly Monday 9 AM UTC scan of main. The purpose is drift detection: permissions and secrets references can change through paths the PR gate does not cover (direct pushes to main, renames of the allowlist, org-level default token permission changes), and a scheduled run catches what a PR-only gate misses. Scheduled workflows run on the default branch's version of the workflow file; the cron examples literature covers the common pitfalls, including UTC scheduling and the workflow_dispatch override for manual runs (https://cronread.com/blog/github-actions-cron-examples, weight 0.53). A known limitation: workflow_dispatch `inputs` are only available to dispatched runs, and a scheduled trigger supplies no inputs, so any input-dependent step needs a default (https://stackoverflow.com/questions/72539900/schedule-trigger-github-action-workflow-with-input-parameters, weight 0.06, weak backing, consistent with the workflow syntax docs at weight 0.97).

## Trigger 3: workflow_dispatch with typed inputs

`workflow_dispatch` lets the gate be run on demand with an input choosing the failure threshold: `inputs: { fail_on: { type: choice, options: [ERROR, WARN, INFO, NEVER], default: ERROR } }`. The workflow syntax reference documents that workflow_dispatch optionally specifies inputs passed to the workflow, and that the trigger only receives events when the workflow file is on the default branch (https://docs.github.com/en/enterprise-cloud@latest/actions/reference/workflows-and-actions/workflow-syntax, weight 0.97). The choice input type is what keeps the threshold machine-checkable instead of free-text. The gate's run step consumes it as `${{ inputs.fail_on || 'ERROR' }}`, so both the scheduled path (no inputs) and the dispatched path (inputs) resolve to a valid threshold.

## Least privilege for the gate itself

A token-scope audit workflow must not itself be an over-scoped workflow; the gate declares `permissions: contents: read` at the top level because reading the repo's workflow files is all it needs. This follows the same doctrine the gate enforces, and GitHub's docs tie fork-based pulls to read-only tokens and no secret access for the same reason (https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax, weight 0.97). The runner is pinned (`ubuntu-24.04`), checkout is pinned by SHA with full fetch depth, and Python is set up at 3.12 with pyyaml installed.

## Artifact upload as the evidence trail

The final step uploads the JSON audit output as an artifact named `token-audit-report` with `if: always()`, so the report exists even when the audit fails the build. This is the evidence artifact that makes the audit reviewable after the fact: the text summary says what failed, the JSON artifact says where and why, and the weekly runs accumulate a drift history. The upload-artifact usage pattern (name plus path) is the standard mechanism for persisting run outputs (https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax, weight 0.97, for the general event/step model). The events reference confirms that limiting trigger behavior with `types` and filters is the general mechanism all these triggers draw on (https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows, weight 0.94).

The full trigger set (PR paths, weekly cron, dispatch) is deliberately redundant: each covers a gap the others leave, and together they make the audit a standing property of the repository rather than a one-time check.
