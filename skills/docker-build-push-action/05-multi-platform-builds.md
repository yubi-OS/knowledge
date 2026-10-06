# 05 - Multi-platform builds: emulation, native runners, and the load limitation

Scope: building for multiple platforms with build-push-action, the QEMU versus native distribution trade, and the multi-platform plus load restriction.

## The platforms input (source doc)

The ground source (`yubi-OS/yubiOS skills/docker-build-push-action/SKILL.md`) records the `platforms` input as a comma-separated platform list defaulting to the native platform. The action reference example sets `platforms: linux/amd64,linux/arm64`. Multi-platform output changes the export semantics: the source doc's Key inputs table notes that `load` is "mutually exclusive with push for multi-platform", and the Notes section states it flatly: "Multi-platform + `load: true` is not supported; use `push` or export to tarball". A multi-platform manifest cannot be loaded into the local Docker image store; the build must either push to a registry or export to an OCI tarball via a outputs type.

## Emulation versus native

Two paths exist for producing arm64 images from amd64 runners:

1. QEMU emulation: `docker/setup-qemu-action` registers the binfmt handlers so a single amd64 runner emulates arm64 during the build. This is the path the sibling yubiOS skill `docker-setup-qemu-action` owns.
2. Native runners: one real runner per platform, building its own architecture natively. The source doc's github-builder section documents this as the `distribute: true` pattern, "one runner per platform, no QEMU needed", with the runner mapping `linux/arm64=ubuntu-24.04-arm` (source doc, Runner mapping section).

Docker's CI documentation carries a dedicated page, "Multi-platform image with GitHub Actions" (weight 0.82, https://docs.docker.com/build/ci/github-actions/multi-platform/), which is the authoritative walkthrough of both patterns at the CI level. The general "Multi-platform builds" concepts page scored 0.55 (https://docs.docker.com/build/building/multi-platform/), just above the threshold.

## The underlying engine

The action delegates everything to `docker buildx build`, whose CLI reference documents the platforms, cache, and outputs flags the action exposes (weight 0.64, https://docs.docker.com/reference/cli/docker/buildx/build/). That layering matters for debugging: an error surfaced by the action is usually a buildx error, and the buildx reference is where the platform and export semantics are specified precisely.

Community troubleshooting material on multi-platform failures scored below threshold and is not cited for claims: a Stack Overflow thread on multi-platform buildx failures (0.09, https://stackoverflow.com/questions/60080264/docker-cannot-build-multi-platform-images-with-docker-buildx), an error-atlas page on the multi-platform load limitation (0.09, https://www.erroratlas.net/errors/docker-buildx-multi-platform-load-not-supported), and several blog posts in the 0.1 range. Their density confirms the load limitation is a common trip point in practice, but the source doc already records it, so no external backing is needed.

## yubiOS posture

The source doc's yubiOS bootc pattern builds `linux/amd64,linux/arm64` (the action reference example) and pushes rather than loads, consistent with the multi-platform restriction. For the yubiOS image pipeline, the platform matrix and the QEMU-versus-native decision interact with the `docker-setup-qemu-action` and `docker-bake-action` sibling skills; bake owns multi-target matrices, qemu owns the emulation setup, and this skill owns the per-build invocation (source doc, Guidelines: every use stays inside the frontmatter description's scope).

## Sources

- Source doc: `yubi-OS/yubiOS skills/docker-build-push-action/SKILL.md` (sections: Action reference, Key inputs, Notes, Runner mapping).
- https://docs.docker.com/build/ci/github-actions/multi-platform/ (weight 0.82)
- https://docs.docker.com/build/building/multi-platform/ (weight 0.55)
- https://docs.docker.com/reference/cli/docker/buildx/build/ (weight 0.64)
