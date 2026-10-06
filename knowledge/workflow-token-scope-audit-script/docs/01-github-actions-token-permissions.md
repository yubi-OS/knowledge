# 01 - The GitHub Actions token permission model

Scope: how GITHUB_TOKEN permissions are declared at workflow and job level, what the defaults are, and the semantics that define whether a token is over-scoped.

## The token itself

At the start of each workflow job, GitHub automatically creates a unique GITHUB_TOKEN secret for the job to use (https://docs.github.com/en/actions/concepts/security/github_token, weight 0.92). The token is an installation access token: it can only be refreshed for up to 24 hours, and if a job runs longer than 24 hours a personal access token or another authentication method is required instead (https://docs.github.com/en/actions/concepts/security/github_token, weight 0.92). This is the property that makes github.token a safe default for in-repo automation: the credential is short-lived, per-job, and scoped to the repository, unlike a PAT stored as a repo secret.

## Declaring permissions

Permissions are set with the `permissions` key, which can appear at the top level of a workflow (applying to all jobs) or inside an individual job (overriding the workflow level for that job). The tutorial on assigning permissions to jobs walks through using GITHUB_TOKEN for authentication, including passing the token to actions, making API requests, and configuring permissions for secure automation (https://docs.github.com/actions/using-jobs/assigning-permissions-to-jobs, weight 0.96).

The available scopes follow the GitHub App permission model; `contents: write` is one such scope, and the token permissions are based on that model (https://stackoverflow.com/questions/72110199/what-is-contents-write-permission-in-github-workflow, weight 0.03, weak backing; corroborated by the official scopes documentation pattern in the same docs tree).

## Defaults were tightened on GitHub's side

Historically the default GITHUB_TOKEN had read/write access to all scopes. In April 2021 GitHub introduced a setting to control permissions for GITHUB_TOKEN, moving toward a read-for-repo-contents default, with the announcement noting that `contents: read` is sufficient for workflows that simply need to clone and build and that additional permissions must be requested explicitly (https://github.blog/changelog/2021-04-20-github-actions-control-permissions-for-github_token/, weight 0.91). For any audit script this matters: a workflow that declares no `permissions` block at all is not necessarily harmless, because what it gets depends on the repository or organization default token permission setting, which the learn.github.com product guide treats as a distinct layer alongside repository and environment-level controls (https://learn.github.com/product-guides/github-actions/get-started/configure-basic-security-and-permissions, weight 0.93).

## What "over-scoped" means in practice

A workflow is over-scoped when it grants write scopes it does not use. Practitioners converge on the same rule: declare permissions explicitly at the workflow top level, then grant write scopes only to the jobs that need them (https://dsotn.com/articles/github-token-permissions/, weight 0.14, weak backing, practitioner blog). The rationale is blast radius: if the token has `contents: write` because nothing declares otherwise, a compromised step can push commits, delete branches, or create releases; declaring `permissions: { contents: read }` at the root closes that (https://github.com/checkstyle/checkstyle/issues/21644, weight 0.33, weak backing, issue tracker discussion). Practitioner guides repeatedly note that workflows run with write access to almost every repo scope by default and that the permissions block is the mechanism that closes that radius, yet most workflows do not use it (https://steve-kaschimer.github.io/posts/2026-03-25-github-actions-permissions-block/, weight 0.12, weak backing).

## Implications for a scope audit script

Three semantic facts anchor the audit:

1. Job-level permissions override workflow-level permissions per job. An audit must compute effective permissions per job, not just read the top-level block (https://docs.github.com/actions/using-jobs/assigning-permissions-to-jobs, weight 0.96).
2. A workflow whose top-level permissions are stricter than a job's own effective permissions is a red flag for a YAML authoring error, because the job override only ever broadens (or narrows deliberately); GitHub's semantics give the job what it declares, so a stricter-top-level plus looser-job pattern means the top-level declaration is misleading documentation (derived from the override semantics above, weight 0.96 source).
3. The default (no-block) case is environment-dependent, so the audit cannot assume read-only for a workflow that omits `permissions`; it should report the omission itself as a finding (https://learn.github.com/product-guides/github-actions/get-started/configure-basic-security-and-permissions, weight 0.93).

These three facts are exactly the checks the yubiOS audit script encodes: per-job effective permission computation, the stricter-top-level warning, and the missing-block warning.
