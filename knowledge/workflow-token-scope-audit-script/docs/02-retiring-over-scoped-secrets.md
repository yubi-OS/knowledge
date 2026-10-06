# 02 - Retiring over-scoped PAT secrets in favor of github.token

Scope: why long-lived custom PAT secrets like GH_TK get retired in favor of the auto-injected github.token, the risk profile of over-scoped PATs, and the cleanup pattern.

## The official guidance

GitHub's own authentication tutorial makes the ordering explicit: use GITHUB_TOKEN for in-workflow automation; only if you need resources beyond the workflow's repository should you consider creating a personal access token, storing it as a secret in the repository, and using the token in the script (https://docs.github.com/en/actions/tutorials/authenticate-with-github_token, weight 0.93). The GITHUB_TOKEN concept doc reinforces the tradeoff: because the GITHUB_TOKEN is an installation access token, it expires within 24 hours, so long-running jobs are the legitimate exception where a PAT is the right tool (https://docs.github.com/en/actions/concepts/security/github_token, weight 0.92).

Personal access tokens are intended to access GitHub resources on behalf of yourself, and when used in a script they should be stored as a secret and run through GitHub Actions (https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens, weight 0.94). That sentence defines the GH_TK failure mode: a PAT minted for a human's identity, parked in a repo secret, and used by CI becomes an automation credential that outlives its purpose and holds whatever scopes the human granted it.

## The risk profile of a parked PAT

A parked PAT in a repo secret is a static credential: it does not rotate when the job ends, it is not scoped per-job, and it grants the same privileges to every workflow that references it. GitHub's security hardening reference frames the general principle: use secrets for sensitive information, because there are multiple ways a secret can leak, and harden accordingly (https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions, weight 0.85). The least-privilege-for-secrets guidance goes further and is the direct justification for the GH_TK-to-github.token migration: when access to outside resources is required, store encrypted secrets used by GitHub Actions, but apply least privilege so each workflow gets only the secret and scope it needs (https://github.blog/security/application-security/implementing-least-privilege-for-secrets-in-github/, weight 0.91).

Practitioner hardening guides treat over-permissioned GITHUB_TOKEN and third-party action risk as the two headline classes of GitHub Actions supply-chain exposure (https://safeguard.sh/resources/blog/github-actions-security-hardening, weight 0.61, practitioner guide with checklist framing). StepSecurity's checklist similarly ranks secret management and least-privileged access at the top of Actions hardening (https://www.stepsecurity.io/blog/github-actions-security-best-practices, weight 0.71).

## Why github.token wins for in-repo pushes

The yubiOS cleanup (PR #148, 2026-07-29) replaced 6 GH_TK secret references in 3 workflow files with github.token, because every use was an in-repository operation: checkout, git push to the same repo, and reading released tag refs. For those operations the auto-injected token is strictly safer:

1. It is created fresh per job and expires within 24 hours (https://docs.github.com/en/actions/concepts/security/github_token, weight 0.92), so no long-lived credential sits in the secrets store.
2. Its scopes are declared in the workflow's own `permissions` block, so the privilege is visible in the diff that a reviewer reads, not hidden in Settings (https://docs.github.com/actions/using-jobs/assigning-permissions-to-jobs, weight 0.96).
3. Deleting the retired secret removes an entire standing-credential class: after the references are gone, the secret can be deleted from repo settings.

The residual risk GitHub documents for the injected token is fork-based: Dependabot pull requests and fork pull requests run with a read-only token and cannot access secrets at all (https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax, weight 0.97). This is a property of the trigger, not of the token choice, and it does not apply to the push-based manifest-fetch workflows GH_TK was serving.

## The audit angle

The lesson the audit script codifies is a secret-lifecycle rule: a secret that no workflow references is dead and should be deleted; a secret that is referenced must be known to the allowlist. The GH_TK pattern (a retired secret still referenced) is the ERROR-class finding, because a reference to a deleted secret resolves to an empty string at runtime and the job fails or silently degrades, while a reference to a still-existing over-scoped PAT is the standing-risk case. Both are caught by scanning every `secrets.*` reference in every workflow file, which is exactly what the script does.
