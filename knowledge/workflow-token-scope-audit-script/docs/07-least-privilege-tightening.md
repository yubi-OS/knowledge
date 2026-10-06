# 07 - From audit to enforcement: the least-privilege tightening path

Scope: the phased migration from audit to enforcement: detecting over-permissioned workflows, tightening WARN findings, and promoting the gate from fail-on-ERROR to fail-on-WARN.

## The doctrine

GitHub's secure-use reference states the target state plainly: it is good security practice to set the default permission for the GITHUB_TOKEN to read access only for repository contents, and the permissions can then be increased as required for individual jobs within the workflow file (https://docs.github.com/en/actions/reference/security/secure-use, weight 0.89). The same guidance appears across the docs tree: the GITHUB_TOKEN should be granted the minimum required permissions, accessed via the github.token context (https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions, weight 0.77), and the enterprise onboarding docs repeat the read-only-default-plus-per-job-increases pattern verbatim (https://www.github.com/github/docs/blob/main/content/enterprise-onboarding/github-actions-for-your-enterprise/securing-your-artifacts-and-workflows, weight 0.57). The learn.github.com product guide positions this inside a broader security-and-permissions configuration flow (https://learn.github.com/product-guides/github-actions/get-started/configure-basic-security-and-permissions, weight 0.95).

The audit script's WARN findings are precisely the deltas between a workflow's current state and that target state: a workflow-level `contents: write` where only a job needs `contents: read` is over-grant; the fix is to move the write scope down to the job or drop it.

## Why tighten incrementally

The reason the migration is phased rather than big-bang is that least privilege applied bluntly breaks workflows. GitHub Security Lab's actions-permissions project exists exactly because of this: applying least-privilege permissions to a GitHub Actions workflow is a best security practice, but it can be challenging because it may break existing workflows, so the project ships Monitor and Advisor actions that observe what permissions a workflow actually exercises before the developer sets the declaration (https://github.com/GitHubSecurityLab/actions-permissions, weight 0.77). Academic work pushes the same idea further: Granite is a runtime proxy-based system that enforces fine-grained permissions for GitHub Actions at step-level granularity within a job, transparently monitoring requests (https://arxiv.org/html/2512.11602, weight 0.85). Both confirm the sequencing principle: observe actual usage first, then narrow the declaration, then enforce.

The yubiOS script's three-phase plan encodes this as threshold promotion rather than tooling change:

1. Phase 1 ships the script and the gate at `fail-on ERROR`. The audit runs, WARNs accumulate as the gap table fills with verified data, and nothing breaks.
2. Phase 2 clears the WARN backlog: every JOB_LESS_PERMISSIVE_THAN_WORKFLOW and UNKNOWN_SECRET finding gets a tightening PR, with the target of a zero-WARN baseline.
3. Phase 3 promotes the gate: the PR trigger's threshold moves from ERROR to WARN, which is only safe to do after phase 2 confirms the zero-WARN baseline, otherwise every workflow-touching PR would red-bar immediately.

This is the same gradual-adoption loop Specmatic documents for linters generally: introduce a rule as warn, resolve existing findings, then change it to error (https://docs.specmatic.io/features/linter/specification-formats/openapi/reports-and-exit-codes, weight 0.60).

## What tightening looks like per finding

- Over-granted workflow permissions: move the write scope into the specific job that pushes or releases, leaving the workflow-level block read-only. Real-world example of the request pattern: an issue asking to reduce workflow token permissions to job-level least privilege, where packages: write was granted at workflow scope although only the Docker publishing path needed it (https://github.com/open-proofline/server/issues/21, weight 0.06, weak backing, but it documents the exact refactor shape).
- No permissions block at all: add an explicit read-only top-level block. GitHub's docs treat the read-only default as the good-practice baseline (https://docs.github.com/en/actions/reference/security/secure-use, weight 0.89).
- Widely-granted but uniformly-used permissions: keep them, but document why; the audit records the INFO observation so a future reviewer sees the decision was made, not missed.

A concrete enforcement example at scale: the openclaw project's PR enforces explicit workflow token permissions as a security hardening measure, with all workflows declaring top-level permissions blocks, either `contents: read` for read-only workflows or `permissions: {}` for release workflows (https://github.com/openclaw/openclaw/pull/22578, weight 0.54). That is the end state phase 3 guards: no workflow without an explicit declaration.

## What the audit alone cannot enforce

The static audit checks declarations, not runtime behavior. A workflow can declare `contents: read` and still push via a PAT in a step; a workflow can declare `contents: write` and never use it. Runtime monitoring tools (the actions-permissions advisor, Granite's step-level proxy) close that loop by measuring actual API usage (https://github.com/GitHubSecurityLab/actions-permissions, weight 0.77; https://arxiv.org/html/2512.11602, weight 0.85). The yubiOS design compensates statically: the retired-secret check catches the PAT-in-a-secret vector by name, and the secrets existence check catches references that were never allowlisted. The combination, static declaration audit plus allowlist, is the pragmatic middle: it does not observe runtime, but it makes every declared grant and every referenced secret either justified or flagged, and the weekly drift scan keeps the baseline honest after cleanup day.
