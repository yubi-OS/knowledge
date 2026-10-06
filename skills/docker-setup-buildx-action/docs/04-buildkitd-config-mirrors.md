# 04. Custom BuildKit Config and Registry Mirrors

Scope: buildkitd-config-inline and buildkitd-config inputs, the registry mirror use case from the source doc, and how custom BuildKit configuration reaches the builder.

## The source doc pattern

The source doc (yubi-OS/yubiOS skills/docker-setup-buildx-action/SKILL.md) shows the registry mirror use case inline:

```yaml
- uses: docker/setup-buildx-action@v3
  with:
    buildkitd-config-inline: |
      [registry."quay.io"]
        mirrors = ["mirror.example.com"]
```

This is listed as 1 of the 4 conditions under which the setup step is required (source doc, When to use): a workflow needing a custom buildkitd config cannot configure the docker driver's embedded BuildKit the same way, so the action installs the config on the builder it creates.

## How the config reaches BuildKit

BuildKit configuration is a builder-level property: "If you create a docker-container or kubernetes builder with Buildx, you can apply a custom BuildKit configuration by passing the --buildkitd-config flag to the docker buildx create command" (https://docs.docker.com/build/buildkit/configure/, jev weight 0.93). The action's buildkitd-config-inline input is the workflow-yaml equivalent of that flag: the action runs the equivalent of buildx create on the runner and passes the inline TOML through (source doc pattern; https://docs.docker.com/build/buildkit/configure/, jev weight 0.93). BuildKit is the engine that consumes this config (https://github.com/moby/buildkit, jev weight 0.92).

## What the config can do

Docker's BuildKit configuration documentation covers registry mirrors among the configurable features (https://docs.docker.com/build/buildkit/configure/, jev weight 0.93). The source doc's example pulls images for quay.io through a mirror (source doc). In CI this matters for 3 reasons:

1. Pull-through speed: a mirror close to the runner reduces image pull time on every cold-cache build.
2. Rate limits: registry-side rate limits are absorbed by the mirror instead of the workflow's identity.
3. Consistency: the same mirror list can be applied to every workflow builder so builds resolve images identically.

## Inline vs file

The action family exposes both buildkitd-config-inline (TOML embedded in the workflow, shown in the source doc) and buildkitd-config (a path to a config file) (source doc pattern). Inline is the form the source doc teaches; it keeps the whole builder definition in one file, which suits the yubiOS convention of workflows as self-contained artifacts. The file form fits when a shared config is maintained once and referenced by many workflows. Both are consumed the same way by BuildKit once the builder is created (https://docs.docker.com/build/buildkit/configure/, jev weight 0.93).

## Scope discipline

The source doc's Guidelines section warns: "Every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job" (source doc). Custom buildkitd config is in scope for setup-buildx-action; what the config contents do (mirror policy, worker tuning) belongs to BuildKit's own configuration surface (https://github.com/moby/buildkit, jev weight 0.92) and to the docker-build-policy skill for OPA/Rego build policies, which are a different mechanism entirely.

## Why mirrors in CI

A registry mirror is a pull-through stand-in: BuildKit resolves images for the mirrored registry through the mirror instead of directly (https://docs.docker.com/build/buildkit/configure/, jev weight 0.93). The buildkitd config file is BuildKit's daemon configuration surface, maintained in the moby/buildkit project (https://github.com/moby/buildkit, jev weight 0.92). Centralizing resolution in 1 mirror gives CI a single place to control where image bytes come from, which is why the source doc reaches for a mirror as the first buildkitd config example (source doc).

The source doc's example targets quay.io, a registry heavily used in the bootc world, and routes it through mirror.example.com (source doc). The same TOML pattern extends to any registry the build pulls from; the config is read by BuildKit at builder creation time, which is why the config must be present when setup-buildx-action runs and cannot be added to the builder later in the same workflow.

## Where the config does not apply

Custom buildkitd config is a docker-container or kubernetes builder property (https://docs.docker.com/build/buildkit/configure/, jev weight 0.93). A workflow using the docker driver has no buildkitd config path, which is why the source doc lists "custom buildkitd config" as 1 of the 4 setup-step triggers (source doc, When to use).

## Decision rule

1. If the workflow needs a registry mirror or any BuildKit daemon setting, the setup step is mandatory (source doc, When to use).
2. Put the config inline for single-file workflows; use a shared file only for org-wide builder configs (source doc).
3. Remember the config belongs to the docker-container or kubernetes builder the action creates, not to the docker driver (https://docs.docker.com/build/buildkit/configure/, jev weight 0.93).

## Sources

- Source doc: yubi-OS/yubiOS skills/docker-setup-buildx-action/SKILL.md (With buildkitd config (registry mirrors), When to use, Guidelines).
- https://docs.docker.com/build/buildkit/configure/ (jev weight 0.93).
- https://github.com/moby/buildkit (jev weight 0.92).
