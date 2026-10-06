# 02. Builder Drivers: Why the Driver Gates Every Feature

Scope: the buildx driver comparison behind the source doc's table: docker-container (default; cache, attestations, multi-platform), docker (none of those), kubernetes (all three), plus where the cloud and remote drivers fit.

## The source doc's table

The source doc (yubi-OS/yubiOS skills/docker-setup-buildx-action/SKILL.md) compresses the decision into 3 rows:

| Driver | Cache export | Attestations | Multi-platform |
|---|---|---|---|
| docker-container (default) | Yes | Yes | Yes |
| docker | No | No | No |
| kubernetes | Yes | Yes | Yes |

Every feature the source doc lists as requiring setup-buildx-action is really a property of the driver the action selects.

## The driver landscape

Docker's driver documentation lists the full set: the docker driver "uses the BuildKit library bundled into the Docker daemon", the docker-container driver "creates a dedicated BuildKit container using Docker", and the cloud driver "connects to a managed builder in Docker Build Cloud" (https://docs.docker.com/build/builders/drivers/, jev weight 0.95). The kubernetes driver runs BuildKit inside a Kubernetes cluster that the CLI connects to (https://docs.docker.com/build/builders/drivers/kubernetes/, jev weight 0.92). The buildx CLI itself advertises "full BuildKit capabilities with container driver" and "multiple builder instance support" among its core features (https://github.com/docker/buildx, jev weight 0.95).

## Why the docker driver cannot do the advanced work

The attestations documentation gives the mechanism: "The docker-container, kubernetes, and remote drivers run BuildKit outside the Docker daemon, so they build attestations regardless of which image store the daemon uses. Pushing the result to a registry with --push keeps the attestations" (https://docs.docker.com/build/metadata/attestations/, jev weight 0.94). The docker driver, by contrast, runs BuildKit inside the daemon, which is why the source doc marks it No for all 3 columns. This is not a CI-only restriction: it follows from where BuildKit executes.

The source doc's guidance for when the docker driver is acceptable follows directly: "Use docker driver only for simple single-platform builds without extra features" (source doc). The driver table in the source doc and the driver architecture in Docker's docs agree on the boundary.

## The default is docker-container

setup-buildx-action selects the docker-container driver by default (https://github.com/docker/setup-buildx-action, jev weight 0.96). That default is why the action's minimal 1-line usage unlocks all 3 features without extra configuration, and why the source doc calls docker-container the default and the requirement for cache and attestations in the same breath (source doc, Action reference).

## Kubernetes driver in CI

The source doc marks the kubernetes driver fully capable (Yes on all 3 columns), matching Docker's documentation that the kubernetes driver runs BuildKit in a cluster and is used with the same buildx interface (https://docs.docker.com/build/builders/drivers/kubernetes/, jev weight 0.92). In GitHub Actions self-hosted-on-k8s scenarios it is the alternative to docker-container; the setup step and the driver choice are orthogonal, with the driver selected via the action's driver input (source doc, Action reference).

## Driver options in practice

The source doc shows one driver-option example: driver-opts: network=host to give the BuildKit container access to local services during the build (source doc, "With network host" section). This works because the docker-container driver is a container whose network the workflow controls through driver options; the docker driver has no equivalent knob because there is no separate builder container.

## Decision rule

1. Default to docker-container by simply using setup-buildx-action with defaults (source doc; https://github.com/docker/setup-buildx-action, jev weight 0.96).
2. Drop to the docker driver only when the build is simple, single-platform, cacheless, and attestation-free (source doc).
3. Choose kubernetes when the BuildKit capacity should live in a cluster (https://docs.docker.com/build/builders/drivers/kubernetes/, jev weight 0.92).
4. Never expect cache, attestations, or multi-platform output from the docker driver (source doc; https://docs.docker.com/build/metadata/attestations/, jev weight 0.94).

## Sources

- Source doc: yubi-OS/yubiOS skills/docker-setup-buildx-action/SKILL.md (Driver comparison, Action reference, With network host, Notes).
- https://docs.docker.com/build/builders/drivers/ (jev weight 0.95).
- https://github.com/docker/buildx (jev weight 0.95).
- https://docs.docker.com/build/builders/drivers/kubernetes/ (jev weight 0.92).
- https://docs.docker.com/build/metadata/attestations/ (jev weight 0.94).
- https://github.com/docker/setup-buildx-action (jev weight 0.96).
