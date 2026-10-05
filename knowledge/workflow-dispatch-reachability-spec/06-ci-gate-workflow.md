# 06 - The CI gate: ci_dispatch-reachability.yml

Scope: the gate workflow that runs the reachability assertion on pull requests touching workflows, on a weekly schedule, and on demand, with least-privilege permissions and pinned actions.

## Trigger surface

The gate (per the yubiOS spec, section 3) declares 3 triggers:

1. `pull_request` with `paths: ['.github/workflows/**', 'scripts/assert-dispatch-reachable.py']`, so the audit runs exactly when the contract could change. GitHub's event reference documents `paths` filtering on `pull_request` events (https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows, weight 0.97), and the workflow syntax reference notes that path filters are not evaluated for pushes of tags (https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax, weight 0.91). Branch filtering composes with path filtering: `pull_request` supports a `branches` filter to limit which target branches run the workflow (https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workf, weight 0.95).
2. `schedule` with a weekly cron, `0 9 * * 1` (Monday 09:00 UTC), so drift that arrives outside a PR (a force-push, a manually deleted file) still surfaces within a week. Third-party cron guides cover the syntax and its UTC/timezone caveats, with weak-to-moderate backing (https://simplecrontab.com/guides/github-actions-cron-setup/, weight 0.52; https://oneuptime.com/blog/post/2025-12-20-scheduled-workflows-cron-github-actions/view, weight 0.13, weak).
3. `workflow_dispatch` with a `fail_on` choice input (`ERROR`, `WARN`, `NEVER`, default `ERROR`), letting an operator re-run the audit with a stricter or looser policy on demand. This is the same typed-input mechanism documented in doc 02.

## Permissions and pinning

The gate sets `permissions: contents: read`, the minimum needed to check out the tree. Least-privilege permissions on workflow jobs are the baseline hardening for any audit gate; the yubiOS org convention is to pin third-party actions to exact SHAs recorded in PINNED.md, and the gate's steps use pinned versions of actions/checkout@v4.2.2, actions/setup-python@v5.3.0, and actions/upload-artifact@v4.6.0 (per the yubiOS spec, section 3).

The job is a single `audit` job on ubuntu-24.04 with 5 steps: checkout with `fetch-depth: 0`, set up Python 3.12, `pip install pyyaml`, run the assertion with `--output-format json` into `reachability.json`, and upload the artifact.

## Conditional execution alternatives

GitHub's native `paths` filter is evaluated at the workflow level. When finer-grained conditional execution is needed (per-job or per-step path logic, or logic that native filters cannot express), the common pattern is a filter action: dorny/paths-filter enables conditional execution of steps and jobs based on files modified by a pull request or pushed commits (https://github.com/dorny/paths-filter, weight 0.89). Marketplace alternatives exist for the same job (https://github.com/marketplace/actions/paths-changes-filter, weight 0.61; https://github.com/marketplace/actions/path-filter, weight 0.71). The yubiOS gate does not need them: its scope is the whole workflow directory, so the native filter is sufficient and keeps the gate dependency-free.

## Artifact upload on failure

The upload step carries `if: always()`, so the report is collected even when the assertion exits nonzero. actions/upload-artifact is the canonical uploader (https://github.com/actions/upload-artifact, weight 0.53), and the docs frame artifacts as the durable store for debugging failed runs (https://docs.github.com/en/actions/tutorials/store-and-share-data, weight 0.88). Without `if: always()`, a red audit run would delete its own evidence, which defeats the purpose of the artifact for triage.

## Why report-only first

The gate ships with the assertion defaulting to `fail-on ERROR` but the workflow itself is not yet a required check in Phase 1 (per the yubiOS spec, section 5). Running it as an advisory PR check plus a weekly sweep surfaces baseline findings (the expected post-fold baseline is 0 ERROR, 0 WARN) before anything is made blocking. The phased tightening is doc 09's subject.

