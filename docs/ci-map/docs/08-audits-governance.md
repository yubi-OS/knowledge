# 08 Governance and drift guards: the audits group

**Scope:** the 5 workflows that watch the CI surface itself, their cadence, and the PR-time self-edit validation they perform. Grounding spine: source doc (yubi-OS/yubiOS docs/CI_MAP.md, https://github.com/yubi-OS/yubiOS/blob/main/docs/CI_MAP.md).

## The 5 guards

The source doc (source doc) tabulates the group with each guard's cron, PR trigger, and subject:

| Workflow | Cron (UTC) | PR trigger | What it guards |
|---|---|---|---|
| `ci_input-shape.yml` | `0 9 * * 1` (Mon 09:00) | paths (workflows) | workflow_dispatch input shapes (OMN-158) |
| `ci_token-audit.yml` | `0 9 * * 1` (Mon 09:00) | paths (workflows) | workflow token scopes (OMN-161) |
| `ci_dispatch-reachability.yml` | `0 9 * * 1` (Mon 09:00) | paths (workflows) | workflow_dispatch to group reachability (OMN-159) |
| `ci_package-floor.yml` | `0 6 * * *` (daily) | paths (mkosi) | package version floors against the dev image (OMN-62) |
| `ci_fork-drift-detect.yml` | `0 6 * * *` (daily) | none | fork/upstream drift beyond a commit threshold (OMN-160) |

All 5 accept a `fail_on` choice (default ERROR) or an analogous threshold input, and are designed to file issues or exit non-zero on drift (source doc). Each runs a single job (validate/audit/assert/detect/verify-floor, 4 to 6 steps) on `ubuntu-24.04` (source doc).

## The 2026-10-06 promotion

Since 2026-10-06 these are ci.yml's real `audits` group choice (commit `e46a3cb8`), not just an app-taxonomy bucket. On the 2026-10-05 map, all 5 were stragglers: input-shape, token-audit, and dispatch-reachability sat in the app's `tests` bucket, and fork-drift-detect sat in `fetches`; all 4 moved to `audits` when the real group landed (source doc, doc 10).

## PR-time self-edit validation

`ci_input-shape`, `ci_token-audit`, and `ci_dispatch-reachability` are also the PR-time self-edit validators for workflow file changes: they carry path-scoped `pull_request` triggers scoped to workflow files. The source doc (source doc) notes these are the one class of automatic trigger PR #145 deliberately kept.

The GitHub platform facts behind this shape are well documented. `GITHUB_TOKEN` permissions can be scoped per workflow and per job, with least-privilege defaults, which is exactly what token-audit checks for (docs.github.com, "Use GITHUB_TOKEN for authentication in workflows", https://docs.github.com/actions/using-jobs/assigning-permissions-to-jobs, jev weight 0.75). Workflow syntax supports `pull_request` with a `paths` filter so a workflow runs only when matching files change, which is the mechanism behind all three PR-time validators (docs.github.com, "Workflow syntax for GitHub Actions", https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax, jev weight 0.81; "Triggering a workflow", https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow, jev weight 0.61). GitHub's Security Lab documents why workflow-file changes deserve scrutiny: combining untrusted pull-request content with privileged triggers is a known repository-compromise path (securitylab.github.com, "Keeping your GitHub Actions and workflows secure: preventing pwn requests", https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/, jev weight 0.56). Community discussion of input validation for `workflow_dispatch` confirms GitHub validates choice inputs at dispatch time, which is the platform behavior input-shape audits against drift (github.com orgs/community discussion 48373, https://github.com/orgs/community/discussions/48373, jev weight 0.1, weak).

## Why the CI surface needs its own guards

The audits group exists because ci.yml's group taxonomy is data that code depends on. A workflow renamed without updating the group arrays breaks dispatch reachability; a workflow gaining a broad `permissions:` block grows the token blast radius; a workflow gaining an input the launchpad UI does not know about breaks the dispatch surface. Each guard turns one of those failure modes into a scheduled or PR-time check with a `fail_on` threshold (source doc). This is the CI system auditing itself, which is why the group's subject is "the CI surface itself" and not the product (source doc).

The daily cadence split also matters: the 3 workflow-file guards run weekly (Mondays 09:00 UTC) because workflow files change rarely, while the 2 dependency-adjacent guards (package-floor against the dev image, fork-drift-detect against upstreams) run daily at 06:00 UTC because those inputs move every day (source doc).

## Composes with

The group composes with the orchestrator (dispatch-reachability asserts the group arrays the orchestrator dispatches from, source doc, doc 02), with the fetches and forks groups (fork-drift-detect watches the same upstreams the fetchers pin, source doc, doc 07), and with the census discipline (any session touching a workflow file re-runs the census; the guards are the automated complement, source doc, doc 10).
