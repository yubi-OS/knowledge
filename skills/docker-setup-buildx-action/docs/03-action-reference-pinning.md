# 03. Action Reference and Version Discipline

Scope: the action's inputs (version, driver), version pinning, and the SHA-pinning policy the source doc points at for AGENTS.md-compliant workflows.

## The action reference

The source doc (yubi-OS/yubiOS skills/docker-setup-buildx-action/SKILL.md) shows the annotated form:

```yaml
- uses: docker/setup-buildx-action@v3
  with:
    version: latest          # pin for reproducibility
    driver: docker-container # default; needed for cache/attestations
```

2 inputs carry the decision weight. version selects which Buildx CLI release the action installs on the runner; driver selects the builder driver, with docker-container as the default needed for cache and attestations (source doc; https://github.com/docker/setup-buildx-action, jev weight 0.96).

## What version: latest actually means

Docker's configure-builder guide describes the default behavior precisely: "By default, the action will attempt to use the latest version of Buildx available on the GitHub Runner (the build client) and the latest release of BuildKit (the build server)" (https://docs.docker.com/build/ci/github-actions/configure-builder/, jev weight 0.96). Two different components are involved: the buildx client on the runner and the BuildKit server inside the builder container. The version input pins the client side; the source doc's comment "pin for reproducibility" (source doc) is about making the build environment stable across workflow runs.

## Pinning discipline: 3 levels

1. Action ref: the source doc says "Pin action SHA for AGENTS.md-compliant workflows; @v3 acceptable for dev" (source doc). A mutable tag like @v3 can move; a commit SHA cannot.
2. Buildx client: the version input (source doc; https://docs.docker.com/build/ci/github-actions/configure-builder/, jev weight 0.96).
3. BuildKit server: tracked by the action; reproducibility at the server level is bounded by what the pinned buildx release ships.

## The SHA-pinning policy landscape

The org-level motivation is now enforceable policy: GitHub shipped an Actions policy feature on 2025-08-15 that supports blocking actions that are not SHA-pinned, where "the policy will check for a full commit SHA, and any workflow that attempts to use an action that isn't pinned will fail" (https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions/, jev weight 0.83). This validates the source doc's distinction: SHA pinning is the compliance-grade posture for governed workflows, while @v3 remains acceptable in development contexts (source doc).

## Practical workflow pattern

For a yubiOS production workflow the source doc implies this shape:

1. Reference the action by full commit SHA rather than a mutable tag (source doc, Notes).
2. Set version to a pinned Buildx release instead of latest when the build must be reproducible (source doc, Action reference).
3. Leave driver unset unless a non-default driver is needed, since docker-container is the default and is the one needed for cache and attestations (source doc, Action reference; https://github.com/docker/setup-buildx-action, jev weight 0.96).

## Inputs beyond version and driver

The source doc shows 2 more inputs in its example sections, both of which flow into the builder creation. driver-opts passes raw driver options, shown with network=host for reaching local services during the build (source doc, "With network host"). buildkitd-config-inline installs TOML BuildKit configuration on the created builder, shown with a registry mirror for quay.io (source doc, "With buildkitd config"). Both only make sense on a non-docker driver, because both configure a separate builder that the action creates; this reinforces why the action reference lists docker-container as the driver "needed for cache/attestations" (source doc).

## What the created builder is

The action README describes the created artifact: the action "will create and boot a builder that can be used in the following steps of your workflow" (https://github.com/docker/setup-buildx-action, jev weight 0.96). In buildx terms this is 1 of potentially several builder instances: the buildx CLI advertises "multiple builder instance support" and "full BuildKit capabilities with container driver" (https://github.com/docker/buildx, jev weight 0.95). Workflows that need an isolated or differently configured builder can name it, and the setup step is the moment that instance comes into existence.

## Why this matters for the rest of the skill

Every later feature doc in this corpus assumes the setup step ran with a capable driver. Version discipline is what keeps that capability stable over time: an unpinned setup step can drift between runners and produce builds that differ between runs of the same commit (source doc, "pin for reproducibility"; https://docs.docker.com/build/ci/github-actions/configure-builder/, jev weight 0.96).

## Sources

- Source doc: yubi-OS/yubiOS skills/docker-setup-buildx-action/SKILL.md (Action reference, Notes).
- https://github.com/docker/setup-buildx-action (jev weight 0.96).
- https://docs.docker.com/build/ci/github-actions/configure-builder/ (jev weight 0.96).
- https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions/ (jev weight 0.83).
