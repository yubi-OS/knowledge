# 06 - Secrets and credential handling

Scope: where registry credentials live in the skill's patterns, why each source was chosen, and the secret-handling discipline behind those choices.

Grounding spine: source doc `yubi-OS/yubiOS skills/docker-login-action/SKILL.md` (Supported registries, yubiOS pattern, Notes sections).

## The credential inventory the skill uses

Across its registry table and pattern section, the source doc uses exactly four credential sources:

1. `DOCKERHUB_TOKEN` secret, for Docker Hub.
2. `${{ secrets.GITHUB_TOKEN }}`, for GHCR, automatically available with `packages: write` permission.
3. `${{ secrets.QUAY_USERNAME }}` and `${{ secrets.QUAY_TOKEN }}`, for quay.io robot accounts.
4. dhi.io credentials, for dhi.io.

(Source doc.) Every one of them is either a repository secret or a runtime-minted token. No credential is ever written literally in workflow YAML. That is the skill's whole secret-handling stance, and it matches GitHub's own guidance: use secrets for sensitive information when writing workflows (https://docs.github.com/en/actions/reference/security/secure-use, weight 0.94).

## GITHUB_TOKEN: the runtime-minted credential

The GITHUB_TOKEN is a default secret that GitHub generates for each workflow run (https://docs.github.com/en/actions/reference/security/secrets, weight 0.96). The source doc uses it for GHCR with two design consequences worth stating:

1. No secret provisioning. The source doc notes that for GHCR no extra secret is needed (source doc, Notes). The repository stores nothing; the token exists only during the run.
2. Explicit scoping. The permissions block grants `packages: write` and `contents: read` (source doc, Permissions required). This is least privilege at the workflow level: the token can publish packages and read the repo contents, and nothing else.

GitHub's secrets documentation covers configuring secrets at the repository and environment level, which is where the stored credentials below live (https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets, weight 0.96).

## Stored tokens: Docker Hub and quay

For Docker Hub and quay.io, the skill uses long-lived stored tokens, not account passwords: a `DOCKERHUB_TOKEN` access token, and a quay robot account token pair (source doc). The token choice is deliberate. Robot accounts are quay's service identity, designed to be shared by multiple repositories, with generated credentials associated with the account (https://docs.quay.io/glossary/robot-accounts.html, weight 0.93; https://docs.redhat.com/en/documentation/red_hat_quay/3/html/about_quay_io/allow-robot-access-user-repo, weight 0.90). A robot token in a secret is revocable and replaceable in a way a human password is not.

## Masking and log exposure

GitHub Actions masks secret values in logs, but credentials that a step writes to disk can still leak through debug output. The AWS ECR login action's own configuration shows the discipline: it masks the docker password to prevent it being printed to action logs if debug logging is enabled, and notes the tradeoff that this prevents the Docker password output from being shared between separate jobs (https://github.com/aws-actions/amazon-ecr-login/blob/main/action.yml, weight 0.86). The general lesson for login-action users: registry credentials are job-scoped, and trying to pass them across jobs reintroduces exposure surface.

## Build-time secrets are a separate mechanism

The source doc's skill covers registry login credentials only. Secrets needed inside a build itself, for example a private dependency fetch during docker build, use BuildKit secret mounts instead: Docker documents secret mounts that add secrets as files in the build container under /run/secrets by default, and SSH mounts for SSH agent sockets or keys (https://docs.docker.com/build/ci/github-actions/secrets/, weight 0.94). Do not route build-time secrets through the registry login step; they are different channels with different lifetimes.

## Broader hardening context

The OWASP GitHub Actions security cheat sheet provides guidance on securing workflows, primarily for public repositories (https://cheatsheetseries.owasp.org/cheatsheets/GitHub_Actions_Security_Cheat_Sheet.html, weight 0.67). Its scope is wider than this skill: workflow-level hardening, third-party action pinning, and token permissions. The source doc's contribution to that posture is narrow but real: the minimal permissions block (packages: write plus contents: read, nothing more) and zero literal credentials.

Community best-practice writeups on Actions secrets exist but are weak sources in this corpus: one on secrets security best practices (https://dev.to/n3wt0n/security-best-practices-for-github-actions-secrets-jka, weight 0.12) and one aggregator-style guide (https://devtoolhub.com/github-actions-secrets-security-best-practices/, weight 0.12). Their advice reduces to what the strong sources above already state.

## Rotation and lifecycle

The source doc does not cover credential rotation, and this corpus does not invent a policy for it. What the source doc's design implies: robot tokens and access tokens are generated credentials (weight 0.90), stored as repository secrets, so rotation is a secret-update operation, not a workflow change. The GITHUB_TOKEN needs no rotation because it is per-run (weight 0.96). An OIDC-based alternative for quay, exchanging GitHub-issued tokens for short-lived registry credentials, removes the stored token entirely (https://developers.redhat.com/articles/2026/07/22/push-images-to-quay-without-a-password, weight 0.57); it is out of the source doc's scope and noted here as observed drift.

## Summary

Four credential sources, all secrets or runtime-minted tokens: DOCKERHUB_TOKEN, GITHUB_TOKEN with packages: write, QUAY_USERNAME/QUAY_TOKEN robot credentials, dhi.io credentials. Nothing literal in YAML, minimal permissions, job-scoped logins, BuildKit mounts for build-time secrets, and rotation handled by replacing the secret rather than the workflow (source doc plus cited sources).
