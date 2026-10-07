# 06 - the yubiOS-ci.yml canonical CI template

Scope: the canonical CI workflow for `yubi-OS/yubiOS` as the SKILL.md specifies it: triggers, permissions, the dhi.io container, the shellcheck gate, the policy-gated multi-platform buildx build, and the artifact upload.

This is an internal-record subtopic: the entire content is dictated by the source doc (`yubi-OS/yubiOS skills/github-actions/SKILL.md`), so no searXNG dig was run. No dig results are cited; every claim below is sourced to the source doc.

## Template

The SKILL.md gives the full template:

```yaml
name: yubiOS CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    container:
      image: docker://dhi.io/debian-base@sha256:9415967aa0ed8adea8b5c048994259d1982026dca143d0303c7bbe0e11ed67d3 # v2026.03.14 trixie-debian13-dev dhi/debian-base
      credentials:
        username: 0mniteck42
        password: ${{ secrets.DOCKER }}

    steps:
      - name: Checkout
        uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2

      - name: Shellcheck
        run: |
          find . -name '*.sh' -print0 | xargs -0 shellcheck --severity=error

      - name: Build OCI image
        run: |
          docker buildx build \
            --policy reset=true,strict=true,filename=yubiOS.rego \
            --platform linux/amd64,linux/arm64 \
            -t dhi.io/yubi-OS/yubiOS:${{ github.sha }} \
            .

      - name: Upload build log
        if: always()
        uses: actions/upload-artifact@bbbca2ddaa5d8feaa63e36b76fdaad77386f024f # v4
        with:
          name: build-log-${{ github.run_id }}
          path: /tmp/build.log
          retention-days: 7
```

## Design points, section by section

**Triggers.** Push and pull_request scoped to `main`, plus `workflow_dispatch` so the REST API can fire the workflow on demand (doc 02, doc 05). The SKILL.md template keeps the dispatch input-less, unlike the generic skeleton in doc 02 which carries a `reason` input.

**Permissions.** Workflow-level `contents: read` only. The build needs no token scopes: checkout reads the repo, and the build pushes to a registry using a secret, not the GITHUB_TOKEN (source doc; the permission vocabulary is doc 03).

**Container.** The job runs inside the approved dhi.io debian-base image, digest-pinned, with registry credentials pulled from the `DOCKER` secret. This satisfies hard rule 2 from doc 01. The image tag comment identifies the build as `v2026.03.14 trixie-debian13-dev` (source doc).

**Checkout.** `actions/checkout` pinned to the approved SHA `de0fac2e4500dabe0009e67214ff5f5447ce83dd` (v6.0.2), satisfying hard rule 1 (source doc; the full allowlist is doc 01).

**Shellcheck gate.** A null-delimited find over all `.sh` files piped to `shellcheck --severity=error`, so a shell warning does not fail the build but an error does (source doc).

**Policy-gated build.** The build step runs `docker buildx build` with `--policy reset=true,strict=true,filename=yubiOS.rego`, the Docker Build Policy gate that vetoes disallowed base images before any layer executes. It builds both `linux/amd64` and `linux/arm64` and tags the image `dhi.io/yubi-OS/yubiOS:${{ github.sha }}` (source doc). The Rego policy itself is the domain of the `docker-build-policy` skill; the buildx invocation is shared with the `docker-buildx-rootless` and `docker-build-push-action` skills (source doc, Related skills).

**Artifact upload.** `if: always()` uploads `/tmp/build.log` as `build-log-${{ github.run_id }}` with a 7 day retention, so a failed build still yields its log (source doc). The upload action is the pinned `actions/upload-artifact@bbbca2ddaa5d8feaa63e36b76fdaad77386f024f` (v4) from the allowlist (source doc).

## Historical staging note

The SKILL.md section that introduces this template still says to stage the file at `refs/yubiOS-ci.yml` for manual copy to `.github/workflows/yubiOS-ci.yml`. That instruction predates the BLOCKER-001 closure (doc 04): the staging convention was retired 2026-07-09 by hard rule 4, and the live path is a direct Contents API write with the MASTER GIT SU PAT. The template content itself is unchanged by that history; only the delivery mechanism moved.

## Failure triage

When this workflow fails, the reading order from doc 05 applies: list runs filtered to `main`, get the run, list its jobs, then pull the logs zip for the failing job. Because the build log is also uploaded as an artifact with `if: always()`, the artifact named `build-log-<run_id>` is an additional copy of `/tmp/build.log` retrievable even after the runner is gone (source doc).
