# 01. When to Use docker/setup-buildx-action

Scope: when docker/setup-buildx-action is required before docker/build-push-action, what it actually does, and what stays possible without it.

## What the action does

The action creates and boots a BuildKit builder that later workflow steps (buildx CLI or docker/build-push-action) use. Its own README states this directly: it "will create and boot a builder that can be used in the following steps of your workflow if you're using Buildx or the build-push action", and by default it selects the docker-container driver "to be able to build multi-platform images and export cache using a BuildKit container" (https://github.com/docker/setup-buildx-action, jev weight 0.96).

The source doc for this skill (yubi-OS/yubiOS skills/docker-setup-buildx-action/SKILL.md) states the same contract: the step creates and boots the builder before build-push-action runs.

## When it is required

Per the source doc, setup-buildx-action is required before docker/build-push-action when you use any of these:

1. Cache export/import (cache-from and cache-to).
2. SLSA provenance or SBOM attestations.
3. Multi-platform builds.
4. A custom buildkitd config.

The reason is the driver: the default docker driver bundled with the Docker daemon cannot do those things, and the action exists to replace it with a capable builder. Docker's build-push-action README confirms the mechanics: the setup-buildx action creates and boots a builder with the docker-container driver, which "is not required but recommended" to "build multi-platform images, export cache, etc." (https://github.com/docker/build-push-action, jev weight 0.95). Read together, the two statements are consistent rather than contradictory: a plain single-platform build works without setup-buildx-action, but the moment a workflow needs cache export, attestations, or multi-platform output, the builder the action provides is what makes those features work.

## Minimal usage

For most workflows the source doc's minimal form is one step with no inputs:

```yaml
- name: Set up Buildx
  uses: docker/setup-buildx-action@v3
```

This is the pattern Docker's own documentation builds on: the configure-builder guide is framed entirely around "configuring your BuildKit instances when using our Setup Buildx Action" (https://docs.docker.com/build/ci/github-actions/configure-builder/, jev weight 0.96). Docker maintains a set of official GitHub Actions for building images, and setup-buildx-action is the setup step among them (https://docs.docker.com/build/ci/github-actions, jev weight 0.96).

## What is possible without it

A workflow that calls docker/build-push-action without setup-buildx-action still builds and pushes a single-platform image: build-push-action works against whatever builder is present, and its README explicitly frames setup-buildx as "not required but recommended" for the general case (https://github.com/docker/build-push-action, jev weight 0.95). What is lost without the action is the feature set the source doc lists: no cache export/import, no attestations, no multi-platform, no custom buildkitd config, because those are properties of the builder, not of the build command.

## The yubiOS rule

The source doc narrows all of this to a hard rule for this org: "For yubiOS CI: always include before building bootc images with attestations" (source doc, Notes section). In yubiOS pipelines the attestations case is the norm, not the exception: bootc image builds are expected to carry provenance and SBOM attestations, so the setup step is unconditionally present in yubiOS CI rather than conditionally included.

## Prerequisites summary

For a yubiOS workflow the checklist is short:

1. Place setup-buildx-action before any build-push-action step (source doc).
2. Expect the docker-container driver by default (https://github.com/docker/setup-buildx-action, jev weight 0.96).
3. If the workflow uses cache, attestations, multi-platform, or buildkitd config, the step is mandatory, not optional (source doc).
4. For simple builds without those features, the step is still harmless and keeps the door open for adding them later (https://github.com/docker/build-push-action, jev weight 0.95).

## Sources

- Source doc: yubi-OS/yubiOS skills/docker-setup-buildx-action/SKILL.md (When to use, Minimal usage, Notes).
- https://github.com/docker/setup-buildx-action (jev weight 0.96).
- https://github.com/docker/build-push-action (jev weight 0.95).
- https://docs.docker.com/build/ci/github-actions/configure-builder/ (jev weight 0.96).
- https://docs.docker.com/build/ci/github-actions (jev weight 0.96).
