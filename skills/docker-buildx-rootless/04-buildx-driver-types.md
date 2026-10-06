# 04 - Buildx builder drivers

Scope: the four builder drivers (docker, docker-container, kubernetes, remote), where BuildKit runs in each, and which capabilities each one unlocks.

## The model

BuildKit is the build backend and docker buildx is the CLI frontend. Builders are named BuildKit instances, and you can have several with different drivers (source doc). The driver decides where that BuildKit instance runs, and with it which build features are available.

## The four drivers

The source doc's driver table, reproduced with its capability split (source doc):

| Driver | Where BuildKit runs | Use for |
|---|---|---|
| docker | Inside the running Docker daemon | Default. Simple local builds. Limited: no cache export, no multi-platform without QEMU. |
| docker-container | A BuildKit container started by Docker | Full BuildKit feature set: cache export/import, multi-platform, SBOM and provenance attestations, Build Policies. Recommended for yubiOS. |
| kubernetes | BuildKit pods in a Kubernetes cluster | CI at scale. |
| remote | An already-running BuildKit daemon | Custom infrastructure. |

The official driver documentation matches this split. The docker-container driver page describes it as a managed, customizable BuildKit environment in a dedicated Docker container (https://docs.docker.com/build/builders/drivers/docker-container, weight 0.89). The Kubernetes driver page covers BuildKit pods in a cluster (https://docs.docker.com/build/builders/drivers/kubernetes/, weight 0.85), and the remote driver page covers pointing at an already-running BuildKit daemon (https://docs.docker.com/build/builders/drivers/remote/, weight 0.79).

## Why yubiOS pins docker-container

The docker driver cannot export cache and cannot do multi-platform builds without QEMU (source doc). Since yubiOS needs registry caching, multi-arch output (ADR-017), SBOM and provenance attestations, and Build Policy evaluation (the --policy gate runs only with a full-featured driver), the source doc recommends docker-container as the standard builder for yubiOS builds (source doc). The attestations doc makes the driver requirement explicit for metadata creation (https://docs.docker.com/build/metadata/attestations/, weight 0.85).

## What changes per driver

Picking a driver changes three practical things. First, feature ceiling: cache export, multi-platform, attestations, and Build Policies are docker-container-and-up features. Second, lifecycle: the docker driver is built into the daemon and needs no setup, while the other three must be created and bootstrapped (doc 05). Third, blast radius: with the docker driver the build executes inside the daemon process; with docker-container the BuildKit engine is isolated in its own container, which composes with the rootless daemon for a defense-in-depth build path (source doc, rootless context section).

References: source doc at https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/docker-buildx-rootless/SKILL.md; https://docs.docker.com/build/builders/drivers/docker-container (weight 0.89); https://docs.docker.com/build/builders/drivers/kubernetes/ (weight 0.85); https://docs.docker.com/build/builders/drivers/remote/ (weight 0.79); https://docs.docker.com/build/metadata/attestations/ (weight 0.85).
