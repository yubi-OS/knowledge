# 06 - Multi-platform builds

Scope: building linux/amd64 and linux/arm64 from one command, the QEMU emulator registration step, and the yubiOS multi-arch invocation.

## QEMU registration

Non-native platforms need emulation. The source doc registers QEMU user-mode emulators with:

    docker run --rm --privileged multiarch/qemu-user-static --reset -p yes

and notes the CI alternative, docker/setup-qemu-action (source doc). The multiarch/qemu-user-static image executes a registration script that writes /proc/sys/fs/binfmt_misc/qemu-<arch> entries for all supported processors except the current one (https://github.com/multiarch/qemu-user-static, weight 0.63). The --reset -p yes flags reset existing handlers and register the new ones (source doc flags, project README).

The binfmt project is the modern alternative emulator source: tonistiigi/binfmt ships prebuilt QEMU images for registering foreign-architecture handlers (https://github.com/tonistiigi/binfmt, weight 0.59).

## The build command

Basic form from the source doc:

    docker buildx build --platform linux/amd64,linux/arm64 --push -t quay.io/fedora/fedora-bootc:45 .

The official multi-platform guide describes the mechanics: one buildx invocation produces a manifest list with one image per platform, and the --push form pushes the whole list to the registry as a single tag (https://docs.docker.com/build/building/multi-platform/, weight 0.84).

## The yubiOS multi-arch invocation

The yubiOS variant (ADR-017) layers the Build Policy gate on top (source doc):

    docker buildx build --platform linux/amd64,linux/arm64 --policy reset=true,strict=true,filename=yubiOS.rego -t dhi.io/yubi-OS/yubiOS:latest --push .

Two things are yubiOS-specific here. The multi-arch build is ADR-017 policy, and the --policy gate evaluates before any layer executes, so a bad FROM fails the build for both platforms before any work is done (source doc). Multi-platform requires the docker-container driver; the docker driver cannot produce multi-platform output without QEMU and cannot export cache (source doc, doc 04).

## Practical notes

Emulated arm64 builds on amd64 runners are slower than native cross-compilation; the emulator route trades speed for simplicity (multiarch README, weight 0.63, and the official guide's driver/runner discussion, weight 0.84). For yubiOS the source doc standardizes on the QEMU registration command plus the two-platform set amd64 and arm64, matching the bootc image targets (source doc).

References: source doc at https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/docker-buildx-rootless/SKILL.md; https://docs.docker.com/build/building/multi-platform/ (weight 0.84); https://github.com/multiarch/qemu-user-static (weight 0.63); https://github.com/tonistiigi/binfmt (weight 0.59).
