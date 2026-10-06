# 07. Multi-Platform Builds with setup-buildx-action

Scope: building multi-arch images in GitHub Actions: the docker-container driver requirement, QEMU emulation via setup-qemu-action, and the current multi-platform patterns Docker documents.

## Why setup-buildx-action is required

The source doc (yubi-OS/yubiOS skills/docker-setup-buildx-action/SKILL.md) lists multi-platform builds among the features requiring the setup step, and its driver table marks multi-platform Yes for docker-container and kubernetes, No for docker. The action's README gives the mechanism: the default docker-container driver exists "to be able to build multi-platform images and export cache using a BuildKit container" (https://github.com/docker/setup-buildx-action, jev weight 0.96). A multi-platform build produces image manifests spanning architectures, which requires a builder capable of cross-arch output; the docker driver's daemon-embedded BuildKit is not.

## The QEMU path

The classic pairing is setup-qemu-action + setup-buildx-action: setup-qemu-action is "GitHub Action to install QEMU static binaries" (https://github.com/docker/setup-qemu-action, jev weight 0.88), which gives the builder emulation support for foreign architectures. Docker's multi-platform CI guide frames the 2 options: "Build for multiple architectures with GitHub Actions using QEMU emulation or multiple native builders" (https://docs.docker.com/build/ci/github-actions/multi-platform/, jev weight 0.96). QEMU emulation is the 1-runner path; multiple native builders is the faster path for architectures where emulation is too slow.

## Platform syntax and output

A multi-platform build targets a platform list (for example linux/amd64,linux/arm64) in the build step (source doc trigger context; https://docs.docker.com/build/ci/github-actions/multi-platform/, jev weight 0.96). The build-push-action README's example flow includes the setup-buildx action to boot a docker-container builder and the setup-qemu action for emulation support (https://github.com/docker/build-push-action, jev weight 0.95), matching the source doc's expectation that the setup step precedes the build.

## Drift note: the current docs surface

Where the web has moved past the source doc: Docker's current multi-platform CI guide shows a workflow whose setup step is docker/setup-docker-action@v5 (https://docs.docker.com/build/ci/github-actions/multi-platform/, jev weight 0.96, captured 2026-10-06), an action family naming newer than the source doc's setup-buildx-action@v3 references. This is a dated correction, not a contradiction: the source doc's discipline (setup a capable builder, pin the version, prefer docker-container) is unchanged, while the concrete action names continue to evolve upstream. Verify the current action name against the guide before copying a new workflow.

## The native-builder alternative

For architectures where QEMU emulation is too slow, the multi-platform path is multiple native builders: buildx advertises "multi-node builds for cross-platform images" (https://github.com/docker/buildx, jev weight 0.95), where several builders each handle their native platform and buildx merges the manifests into 1 multi-platform image index. Docker's guide presents the same 2 options side by side: QEMU emulation or multiple native builders (https://docs.docker.com/build/ci/github-actions/multi-platform/, jev weight 0.96). Either path still starts with setup-buildx-action, because the docker driver supports neither path (source doc, Driver comparison).

## Cache and attestations interact with multi-platform

All 3 features share the same driver requirement, so a workflow doing multi-platform builds in yubiOS gets cache export and attestations from the same docker-container builder with no additional setup steps (source doc, Driver comparison). This is the reason the source doc keeps 1 setup step in the skeleton rather than one per feature.

## yubiOS placement

The source doc's Notes rule ("For yubiOS CI: always include before building bootc images with attestations", source doc) applies with extra force to multi-platform: yubiOS images targeting ARM64 hardware and x86_64 CI hosts need both platforms, and the attestation requirement means the multi-platform builder must also be an attestation-capable one. The single docker-container builder satisfies both (source doc, Driver comparison).

## Decision rule

1. For multi-arch output, run setup-buildx-action before the build step; it is required, not recommended (source doc, When to use).
2. Add setup-qemu-action for emulated architectures (https://github.com/docker/setup-qemu-action, jev weight 0.88).
3. Use multiple native builders instead of QEMU when emulation is too slow (https://docs.docker.com/build/ci/github-actions/multi-platform/, jev weight 0.96).
4. Check the current action names in the upstream guide before copying workflows; the source doc's @v3 references remain valid for the discipline they teach but may not be the newest action generation (https://docs.docker.com/build/ci/github-actions/multi-platform/, jev weight 0.96).

## Sources

- Source doc: yubi-OS/yubiOS skills/docker-setup-buildx-action/SKILL.md (When to use, Driver comparison, Notes).
- https://docs.docker.com/build/ci/github-actions/multi-platform/ (jev weight 0.96).
- https://github.com/docker/setup-qemu-action (jev weight 0.88).
- https://github.com/docker/build-push-action (jev weight 0.95).
- https://github.com/docker/setup-buildx-action (jev weight 0.96).
