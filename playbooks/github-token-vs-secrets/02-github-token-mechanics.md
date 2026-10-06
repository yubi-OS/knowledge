# 02 - How github.token Actually Works

Scope: the runtime mechanics of `github.token`: what it is, how long it lives, how it is bounded by the `permissions:` block, and why pushes made with it do not trigger other workflows.

## What the token is and how long it lives

GitHub documents the GITHUB_TOKEN as an installation access token. Because it is one, it can only be refreshed for up to 24 hours; if a job runs longer than 24 hours, the documented alternative is a personal access token or another authentication method (weight 0.97, https://docs.github.com/en/actions/concepts/security/github_token). The token is available in the `github.token` context (same source, weight 0.97).

The practical lifetime is shorter than the 24 hour ceiling. The token is a just-in-time credential designed for short-lived ephemeral runners, roughly a 60 minute design horizon, which GitHub's runner maintainers discuss as an architectural limitation for long-running sequential workflows (weight 0.67, https://github.com/actions/runner/issues/4248). Both bounds matter for the playbook's "same-repo, single-run, ephemeral" test: the token is built for exactly that shape and is the wrong tool once a run must outlive its job.

## The permissions bound

The `permissions:` block is what makes the token bounded rather than merely short-lived. The permissions for the GITHUB_TOKEN in a workflow job are initially set to the default setting for the enterprise, organization, or repository (weight 0.94, https://docs.github.com/en/enterprise-cloud@latest/actions/reference/workflows-and-actions/workflow-syntax). The defaults themselves moved in a security-hardening direction: GitHub changed the default GITHUB_TOKEN permissions from read/write to read-only, calling the previous default too permissive (weight 0.94, https://github.blog/changelog/2023-02-02-github-actions-updating-the-default-github_token-permissions-to-read-only/). Before that, GitHub had already offered per-scope control and stated that a default of `contents: read` is sufficient for any workflows that simply need to clone and build, with additional permissions specified in workflow YAML (weight 0.90, https://github.blog/changelog/2021-04-20-github-actions-control-permissions-for-github_token/).

The source doc (yubi-OS/yubiOS playbooks/github-token-vs-secrets.md) turns this into a posture: `contents: read` as the default block, `actions: write` only for the ci-callback pattern, and `contents: write` only for the fetch-*.yml family that commits to main. Declaring the bound explicitly is the discipline that makes the bounded credential safe: the workflow's reach is written in the file, not inherited from an org default that can move under it.

## The cascade suppression

The second asymmetry the playbook relies on: events triggered by the GITHUB_TOKEN do not create new workflow runs, with documented exceptions for `workflow_dispatch` and `repository_dispatch` events, which always create workflow runs (weight 0.94, https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow). The same rule is restated in the GitHub community discussions: a push made with the repository's GITHUB_TOKEN will not run a workflow configured on `on: push`, even though the push itself lands (weight 0.19, weak backing, https://github.com/orgs/community/discussions/25702; weight 0.17, weak backing, https://github.com/orgs/community/discussions/65321). The stated purpose in the discussion is recursion prevention: GitHub does not want a workflow's own commit to re-trigger itself in a loop.

This is why the source doc treats "push lands, downstream workflow never fires" as expected behavior, not a bug, and why the legitimate cascade case belongs to a named secret: a PAT-made push does create `on: push` events. The playbook's alternative is to dispatch explicitly instead of relying on the cascade.

## Why this maps to the playbook rows

The mechanics line up row by row with the decision matrix in doc 01. Ephemeral lifetime plus a permissions bound plus cascade suppression is precisely the profile of "same-repo, single-run, ephemeral". The 24 hour refresh ceiling is the "must outlive the run" exception. And the cascade suppression is why the "trigger another workflow's `on:` events" need routes to a named secret rather than the automatic token.

## Weak-backing notes

Third-party explainers on token expiration and troubleshooting, such as https://devactivity.com/insights/solving-github-actions-token-expiration-a-key-to-robust-software-pr/ (weight 0.11) and https://en.ittrip.xyz/windows/troubleshooting/github-token-push-workflow (weight 0.11), repeat the primary-source rules above but carry no independent authority, so they are recorded as weak context only.
