# 05. Cache Export and Import with the docker-container Driver

Scope: the cache-from/cache-to discipline the setup step unlocks, the cache backends available in CI, and why the docker driver cannot participate.

## The setup step is the cache enabler

The source doc (yubi-OS/yubiOS skills/docker-setup-buildx-action/SKILL.md) lists cache export/import as the 1st feature requiring setup-buildx-action, and the driver table marks cache export Yes for docker-container and kubernetes, No for docker. The action README states the mechanism on its front page: the default docker-container driver exists "to be able to build multi-platform images and export cache using a BuildKit container" (https://github.com/docker/setup-buildx-action, jev weight 0.96).

## Cache backends in CI

Cache backends let you manage build cache externally, and an external cache speeds up both inner-loop and CI builds by sharing cache between builds (https://docs.docker.com/build/cache/backends/, jev weight 0.96). The backend surface matters for driver selection: "The default docker driver supports the inline, local, registry, and gha cache backends, but only if you have enabled the containerd image store. Other cache backends require you to select a different driver" (https://docs.docker.com/build/cache/backends/, jev weight 0.96).

The backend designed for GitHub Actions is gha: "The GitHub Actions cache utilizes the GitHub-provided Action's cache or other cache services supporting the GitHub Actions cache protocol. This is the recommended cache to use inside your GitHub Actions workflows, as long as your use case falls within the size and usage limits set by GitHub" (https://docs.docker.com/build/cache/backends/gha/, jev weight 0.94). GitHub's cache has size and usage limits, so workflows that exceed them fall back to registry or s3 backends.

## What a CI cache step looks like

The combination the source doc implies is: setup-buildx-action (which provisions a builder that can export cache), then build-push-action with cache-from and cache-to wired to a backend. The gha backend maps directly onto GitHub's own cache service (https://docs.docker.com/build/cache/backends/gha/, jev weight 0.94), which requires no extra credentials beyond the workflow's existing token; registry and s3 backends require their own credentials but survive across repositories and runners.

## Scope keys and sharing

The gha backend scopes cache under the GitHub Actions cache service, where scope keys partition cache between branches and workflows (https://docs.docker.com/build/cache/backends/gha/, jev weight 0.94). Docker's cache backend documentation frames the choice as manageability: external cache creates a shared cache that accelerates both inner-loop and CI builds (https://docs.docker.com/build/cache/backends, jev weight 0.95).

## Why the docker driver is excluded

The source doc's table gives the verdict (docker: No for cache export) and the backends documentation gives the nuance: the docker driver does support inline, local, registry, and gha backends, but only with the containerd image store enabled, and other backends need a different driver (https://docs.docker.com/build/cache/backends/, jev weight 0.96). In a stock GitHub Actions runner the containerd image store is not the default posture, so the dependable path is the docker-container driver the action creates. The source doc's rule stays the safe default: expect cache export only from docker-container (or kubernetes) builders.

## yubiOS guidance

For yubiOS CI the cache layer stacks on top of the attestation requirement: the source doc requires the setup step before bootc image builds with attestations (source doc, Notes), and those same builds are exactly the ones that benefit most from a warm cache, because bootc image builds recompile the same large base layers on every run. Cache discipline and attestation discipline therefore share 1 setup step, which is why the source doc makes the step unconditional for yubiOS CI.

## Decision rule

1. Use setup-buildx-action with its default docker-container driver before any cached build (source doc; https://github.com/docker/setup-buildx-action, jev weight 0.96).
2. Prefer the gha backend for normal workflows within GitHub cache limits (https://docs.docker.com/build/cache/backends/gha/, jev weight 0.94).
3. Move to registry or s3 backends when the cache must outlive 1 repository or exceed GitHub limits (https://docs.docker.com/build/cache/backends/, jev weight 0.96).
4. Do not assume the docker driver can export cache on a stock runner (https://docs.docker.com/build/cache/backends/, jev weight 0.96).

## Sources

- Source doc: yubi-OS/yubiOS skills/docker-setup-buildx-action/SKILL.md (When to use, Driver comparison, Notes).
- https://github.com/docker/setup-buildx-action (jev weight 0.96).
- https://docs.docker.com/build/cache/backends/ (jev weight 0.96).
- https://docs.docker.com/build/cache/backends (jev weight 0.95).
- https://docs.docker.com/build/cache/backends/gha/ (jev weight 0.94).
