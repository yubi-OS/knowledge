# 01 - The Decision Matrix: github.token or a Named Secret

Scope: the playbook's core decision rule that maps a credential need to `github.token` versus a named secret, and the yubiOS secret inventory that motivated it.

## The rule

The source doc (yubi-OS/yubiOS playbooks/github-token-vs-secrets.md, 2026-08-01) states the decision rule in one line: same-repo, single-run, ephemeral means `${{ github.token }}` with an explicit `permissions:` block. Cross-repo access, an external service, or a capability `GITHUB_TOKEN` structurally cannot have means a named secret.

The playbook applies the rule at every credential line in a workflow: a `token:` on `actions/checkout`, a `GH_TOKEN:` in a step env, a `git push` URL, a registry login. The decision table from the source doc:

| Need | Use |
|---|---|
| checkout, REST call, or `git push` on this repo | `github.token` plus a matching `permissions:` block |
| dispatch a workflow in another repo | `secrets.WORKFLOW` |
| container registry login | `secrets.DOCKER` |
| must outlive the run, or trigger another workflow's `on:` events | named secret (PAT) |

## Why the bounded credential wins

The load-bearing asymmetry, per the source doc: `github.token` is bounded by the workflow's `permissions:` block, and pushes made with it do not trigger other workflows' event triggers. A PAT is unbounded. The playbook's instruction is to prefer the bounded credential and declare the bound.

GitHub's own docs back the same preference. When you use a personal access token in a GitHub Actions workflow, "consider whether you can use the built-in GITHUB_TOKEN instead" (weight 0.97, https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens). The GITHUB_TOKEN tutorial walks through using the built-in token for authentication, passing it to actions, making API requests, and configuring permissions for secure automation (weight 0.96, https://docs.github.com/en/actions/tutorials/authenticate-with-github_token).

One structural limit GitHub documents: the GITHUB_TOKEN is an installation access token, so it can only be refreshed for up to 24 hours. If a job runs longer than 24 hours, a personal access token or other authentication method is the documented alternative (weight 0.97, https://docs.github.com/en/actions/concepts/security/github_token). That is exactly the "must outlive the run" row in the playbook table.

## The fleet secret inventory

Per the source doc, the yubiOS fleet runs on 3 secrets: `DOCKER`, `GITHUB_TOKEN`, `WORKFLOW`, plus the automatic `github.token`. A 4th, `GH_TK`, was a same-repo PAT used where `github.token` would do. PR #148 removed all 6 of its references (source doc). Doc 06 covers that removal in detail; the point here is that the inventory itself is the audit trail of the decision matrix: every named secret in the list maps to a row the playbook says `github.token` cannot serve. `WORKFLOW` exists because cross-repo dispatch needs a PAT. `DOCKER` exists because registry login is an external service. `GITHUB_TOKEN` (the secret, declared on `ci_test-vgpu-vm.yml` per the source doc) exists as a distinct declaration from the automatic token.

The default permission posture is also part of the matrix. GitHub changed the default GITHUB_TOKEN permissions from read/write to read-only because the old default was, in their words, too permissive (weight 0.94, https://github.blog/changelog/2023-02-02-github-actions-updating-the-default-github_token-permissions-to-read-only/). Earlier, GitHub had already restricted the default to read repo contents, stating that `contents: read` is sufficient for any workflows that simply need to clone and build and that additional permissions must be specified in the workflow YAML (weight 0.90, https://github.blog/changelog/2021-04-20-github-actions-control-permissions-for-github_token/). So the playbook's "declare the bound" instruction rides on a platform default that is itself read-only: anything a workflow needs beyond read must be written into a `permissions:` block or delegated to a named secret.

## Weak-backing notes

A third-party survey of GITHUB_TOKEN, PAT, and GitHub App authentication trade-offs exists at https://michaelheap.com/ultimate-guide-github-actions-authentication/ (weight 0.20, weak backing). It is consistent with the source doc's matrix but adds nothing the primary sources above do not already carry, so it is recorded as weak context only.

## Takeaway

Every credential line has exactly one right answer under this playbook. Bounded and same-repo means `github.token` plus an explicit scope. Anything unbounded by design, cross-repo, or external means a named secret, and the named secret should be as narrow as the job demands.
