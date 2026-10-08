# 04. Rootless Docker BuildKit and Buildx, and ADR-014

Scope: kernel prerequisites for rootless BuildKit, the containerized rootless buildkitd option, the full rootless daemon setup, and the ADR-014 decision that makes Docker Buildx the canonical yubiOS build tool.

## Kernel prerequisite

The source doc requires kernel user-namespace support before anything else: `sysctl kernel.unprivileged_userns_clone` must return 1 (source doc, yubi-OS/yubiOS skills/rootless-container-builds/SKILL.md). Without unprivileged user namespaces the rootless model of doc 01 cannot exist on the host, regardless of which build tool runs.

## Option 1: containerized rootless buildkitd

The source doc's low-level option runs buildkitd itself in a container:

```
docker run -d \
  --name buildkitd \
  --security-opt seccomp=unconfined \
  --security-opt apparmor=unconfined \
  --security-opt systempaths=unconfined \
  moby/buildkit:rootless
```

then builds against it with `docker buildx build --builder rootless-builder --no-cache -t ...` (source doc). The upstream BuildKit rootless documentation is the reference for this mode: running BuildKit in rootless mode with the containerd worker needs RootlessKit installed, and containerd runs in rootless mode under rootlesskit (https://github.com/moby/buildkit/blob/master/docs/rootless.md, jev weight 0.91). The moby/buildkit image is the standard entry point for this pattern (https://hub.docker.com/r/moby/buildkit, jev weight 0.71).

Note the tradeoff visible in the source doc itself: the containerized rootless buildkitd runs with seccomp, apparmor, and systempaths all unconfined. Rootless removes the root daemon, but the unconfined profile set is a real relaxation, which is part of why the higher-level option below is preferred.

GitLab's CI documentation describes the same standalone-BuildKit pattern from the CI side: BuildKit in standalone mode provides rootless image builds without a Docker daemon dependency, eliminating privileged containers entirely, as a direct replacement for Kaniko-style builds (https://docs.gitlab.com/ci/docker/using_buildkit/, jev weight 0.87).

## Option 2: the full rootless daemon (preferred)

The source doc prefers `dockerd-rootless-setuptool.sh install` for the full rootless daemon setup, deferring detail to the `docker-buildx-rootless` skill (source doc). Docker's rootless mode documentation is the upstream reference: the install script automatically shows help when prerequisites are not satisfied, and if it is not present the `docker-ce-rootless-extras` package may need manual installation (https://docs.docker.com/engine/security/rootless/, jev weight 0.95). The same page shows the install creating a systemd user unit at `~/.config/systemd/user/docker.service`, controlled with `systemctl --user` (https://docs.docker.com/engine/security/rootless, jev weight 0.95).

BuildKit is not an optional extra in this path: docker build uses Buildx and BuildKit by default since Docker Engine 23.0 (https://github.com/moby/buildkit, jev weight 0.85). A rootless dockerd therefore gives rootless BuildKit without the containerized-buildkitd dance.

## Pointing buildx at a rootless builder

The buildx side needs a builder instance that targets the rootless buildkitd. The moby/buildkit image documentation shows the wiring pattern: `docker buildx create --driver-opt image=moby/buildkit:master --use` creates and selects a builder that runs the chosen buildkit image (https://hub.docker.com/r/moby/buildkit, jev weight 0.71). The source doc's `--builder rootless-builder` flag then selects that named builder on every build command (source doc). Forgetting `--use` or `--builder` is the common integration mistake: buildx silently falls back to the default builder, which is not the rootless one, and the build proceeds without the containment this doc documents.

## ADR-014: why Buildx is canonical

The source doc states the decision directly: yubiOS uses Docker Buildx as the primary build tool, not rootless podman, because Build Policies (`--policy reset=true,strict=true,filename=<file>`) are Buildx-only (source doc). This is an ecosystem-capability decision, not a preference: the supply-chain gate in doc 05 exists only on the Buildx path, so making Buildx canonical is what lets Build Policies run before any build layer executes on every yubiOS build.

The two paths compose rather than compete. Rootless podman/buildah (doc 03) remains the hardened alternate build path and powers the CI build-and-sign job in doc 09; rootless Buildx is the local and primary path carrying the policy gate. Both rest on the same user-namespace foundation of doc 01.
