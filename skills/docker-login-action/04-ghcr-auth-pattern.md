# 04 - The GHCR pattern: GITHUB_TOKEN and packages: write

Scope: authenticating to GitHub Container Registry with the automatic GITHUB_TOKEN, the packages: write permission it needs, and the cross-org limits of that token.

Grounding spine: source doc `yubi-OS/yubiOS skills/docker-login-action/SKILL.md` (Action reference, Permissions required, Notes sections).

## The minimal GHCR login

The source doc's GHCR step is deliberately short:

```yaml
- uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

Two of the three inputs come from the workflow runtime itself: `github.actor` is the identity that triggered the workflow, and `secrets.GITHUB_TOKEN` is the token GitHub mints for each run. The source doc's Notes section states the point directly: for GHCR, GITHUB_TOKEN is automatically available and no extra secret is needed (source doc). GitHub's own Container registry documentation confirms the registry supports GITHUB_TOKEN for authentication (https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry, weight 0.96). The upstream README's "Login to GitHub Container Registry" example uses the same pair of inputs (https://github.com/docker/login-action, weight 0.96; note that the collected upstream example now pins docker/login-action@v4, a version drift from the source doc's v3, documented in doc 02).

## The permission block

The source doc requires an explicit permissions block in the workflow:

```yaml
permissions:
  packages: write   # for GHCR
  contents: read
```

(Source doc, Permissions required.) This is the load-bearing half of the GHCR pattern. The GITHUB_TOKEN arrives least-privileged; without `packages: write` the token cannot publish to the Container registry, and the push step fails even though the login step succeeded. `contents: read` is the companion read permission the source doc pairs with it, keeping the token scoped to exactly what the job needs. GitHub's guidance on publishing packages with Actions describes the same model of scoped GITHUB_TOKEN permissions per workflow (https://docs.github.com/en/packages/managing-github-packages-using-github-actions-workflows/publishing-and-installing-a-package-with-github-actions, weight 0.93).

## What the token cannot do

The GITHUB_TOKEN's scoping has one consequence worth writing down: it is bound to the repository that spawned it. A weak third-party marketplace entry documents the failure mode: the GITHUB_TOKEN cannot push to a package owned by a different organization; the fixes are to move the package to the same organization as the repository, or to pass a personal access token with write permissions instead (https://github.com/marketplace/actions/build-and-push-docker-image-to-ghcr, weight 0.36, weak source). GitHub's Container registry docs note that when a workflow uses a personal access token to authenticate to ghcr.io in place of GITHUB_TOKEN, different rules apply (https://gist.github.com/yokawasa/841b6db379aa68b2859846da84a9643c, weight 0.15, weak source; the gist quotes the official docs). The source doc does not cover cross-org pushes; treat this as an observed boundary of the pattern rather than part of the skill's canon.

## Why this pattern is the yubiOS default

The source doc's yubiOS pattern pairs quay.io and ghcr.io logins in one job (source doc). GHCR is the zero-secret half of that pair: because GITHUB_TOKEN is minted per run and scoped by the permissions block, the pattern needs no repository secret for GHCR at all. That is the least-privilege posture the skill teaches: a token that exists only for the length of the run, scoped to publish packages, paired with read-only contents access.

Community walkthroughs of the same flow (all weak sources) corroborate the steps without adding anything the source doc lacks: pushing container images to GHCR with Actions (https://dev.to/willvelida/pushing-container-images-to-github-container-registry-with-github-actions-1m6b, weight 0.15), a Stack Overflow thread on pushing a Docker image to ghcr.io where the working answer is exactly the login-action plus GITHUB_TOKEN shape (https://stackoverflow.com/questions/75926611/github-workflow-to-push-docker-image-to-ghcr-io, weight 0.13), and an earlier SO thread on the same login problem (https://stackoverflow.com/questions/74101254/how-to-log-into-github-container-registy-using-github-actions, weight 0.11).

## Failure modes of the pattern

Three ways the minimal pattern breaks, in rough frequency order:

1. Missing `packages: write`. The permissions block was skipped. Login succeeds, push fails with a denied response. Fix is the source doc's permission block (source doc).
2. Cross-org package. The push target is a package owned by another organization, which the repo-scoped GITHUB_TOKEN cannot write to (weak source, weight 0.36, https://github.com/marketplace/actions/build-and-push-docker-image-to-ghcr). Fix is same-org packages or a PAT.
3. Wrong actor scoping. The username must match the token's identity; the source doc's `${{ github.actor }}` pairing is the safe default (source doc).

## Summary

The GHCR pattern is the skill's cheapest credential path: registry `ghcr.io`, username `${{ github.actor }}`, password `${{ secrets.GITHUB_TOKEN }}`, plus a permissions block granting `packages: write` and `contents: read`. No extra secret is required (source doc). The token's repository scope is the pattern's boundary: cross-org pushes need a different credential, which is outside the source doc's scope.
