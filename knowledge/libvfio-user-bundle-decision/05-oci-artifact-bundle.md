# OCI Artifact Bundle: The Medium-Term Step (V1)

Scope: Step 2 (Variation 1) of the adopted decision: publishing libvfio-user as a per-artifact OCI tag on 0mniteck/yubios via a docker-bake target, the scratch-rootfs content model (binary plus samples), publish gating, and digest pulls from CI.

## What Step 2 builds

The decision record specifies three pieces:

1. A libvfio-user target in yubiOS-bake.hcl that produces 0mniteck/yubios:libvfio-user-<sha>, a scratch-rootfs image containing the pre-built binary and the samples/ directory.
2. An extension of the publish workflow leg with a new artifact publish, gated on Docker_push=true.
3. An update to ci_test-vgpu-vm.yml to pull the digest instead of building.

The naming follows ADR-022 (Unified OCI Distribution, Per-Artifact Tags on 0mniteck/yubios): one tag per artifact, not a shared image that accumulates purposes. The version in the tag is the libvfio-user commit SHA, so the tag name alone tells you exactly which upstream revision the binary was built from.

## Why docker bake fits this shape

Bake is Docker's declarative multi-build orchestration layer: it lets you automate Docker builds and testing with declarative configurations (https://docs.docker.com/guides/bake/, jev weight 0.92). A target in a Bake file represents a build invocation, which makes it easier to build multiple targets without listing each one explicitly (https://docs.docker.com/build/bake/targets.md, jev weight 0.87). That is precisely the yubiOS situation: yubiOS-bake.hcl already describes the org's image builds, and libvfio-user becomes one more target alongside the existing ones, inheriting the same base-image pinning and publish plumbing rather than growing a parallel pipeline.

## What goes in the artifact

The content model is deliberately minimal: a scratch rootfs carrying the compiled binaries and the samples/ directory. Samples matter because the vfio-user ecosystem demonstrates device backends through sample servers; the library's own repo is a framework for implementing PCI devices in userspace with clients such as QEMU talking the vfio-user protocol over a UNIX socket (https://github.com/nutanix/libvfio-user, jev weight 0.93). Shipping the samples means CI (or a human) can start a real vfio-user server from the artifact, not just link against the library.

Scratch-rootfs is the honest container for this. There is no OS in the artifact, no package manager, no attack surface beyond the built artifacts themselves. CI mounts or copies from the image and runs the binaries; the image is a delivery envelope, not an environment.

## Gating and integrity

The publish leg is gated on Docker_push=true, so local and PR builds produce the image but only the main-branch path publishes it. Once an artifact is published and consumed by CI, integrity becomes part of the supply chain: signing and verification of container images and other OCI artifacts is the standard mechanism for ensuring integrity and authenticity across the software supply chain (https://learn.microsoft.com/en-us/azure/container-registry/overview-sign-verify-artifacts, jev weight 0.84), and ORAS is the common tooling for storing, managing, and retrieving OCI artifacts in a registry (https://learn.microsoft.com/en-us/azure/container-registry/container-registry-manage-artifact, jev weight 0.75). This is part of why V1 costs more than V4: every published artifact is a surface that wants signing and auditing, which is exactly the cost the two-step ordering defers until the cache hit-rate data justifies it.

## Why a digest pull beats a build in CI

Consuming CI pulls the digest, not the tag. Digests are content-addressed: each image tag carries a digest field showing the SHA-256 value, and images can be pulled by digest (https://docs.docker.com/dhi/explore/security-concepts/digests/, jev weight 0.97). Digest-addressed artifacts are tamper-resistant: the immutability model combines image digests, read-only containers, and signed metadata to prevent tampering (https://docs.docker.com/dhi/explore/security-concepts/immutability/, jev weight 0.87). A tag can be re-pointed with a single push, because the registry simply writes a new entry in its tag index (https://runbook.academy/courses/docker/lessons/docker-immutable-digests/, jev weight 0.56); the digest cannot be re-pointed at all.

The decision record applies this correctly: ci_test-vgpu-vm.yml pins the digest of the published artifact, so a workflow run gets the exact bytes that were built and signed for that commit, regardless of what the tag points to later.

## The boundary this step respects

Two boundaries come straight from the decision record's "what we are NOT doing" section. First, libvfio-user is not bundled into the production yubiOS image: it is a CI-time tool, and putting it in production violates the ADR-022 per-artifact intent. Second, the artifact is a distribution mechanism, not a build-system change: meson/ninja remain upstream's build system, and the bake target simply runs them once and ships the output. The artifact changes who builds libvfio-user and how often, not how it is built.
