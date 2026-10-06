# 06. SLSA Provenance and SBOM Attestations

Scope: how BuildKit attestations work in GitHub Actions, the driver requirement behind the source doc's attestations row, and the yubiOS rule that bootc image builds always carry them.

## What attestations add

Provenance and SBOM attestations record how an image was built and what it contains: "Software Bill of Material (SBOM) and provenance attestations add metadata about the contents of your image, and how it was built" (https://docs.docker.com/build/ci/github-actions/attestations/, jev weight 0.95). This is the supply-chain surface yubiOS builds on: SLSA-style provenance is what downstream verifiers consume.

## Defaults in build-push-action

The attestation flow in CI is largely automatic: "The docker/build-push-action GitHub Action automatically adds provenance attestations to your image" (https://docs.docker.com/build/ci/github-actions/attestations/, jev weight 0.95), and "Attestations are supported with version 4 and later of the docker/build-push-action" (https://docs.docker.com/build/ci/github-actions/attestations/, jev weight 0.95). Workflows on build-push-action v3 or older do not get the attestation behavior; the version of the build action is part of the attestation posture.

## The driver requirement

The mechanism is driver-level, not build-command-level: "The docker-container, kubernetes, and remote drivers run BuildKit outside the Docker daemon, so they build attestations regardless of which image store the daemon uses. Pushing the result to a registry with --push keeps the attestations" (https://docs.docker.com/build/metadata/attestations/, jev weight 0.94). This is exactly why the source doc (yubi-OS/yubiOS skills/docker-setup-buildx-action/SKILL.md) marks attestations Yes for docker-container and kubernetes and No for the docker driver, and why SLSA attestations appear in the source doc's "required before build-push-action" list. Setup-buildx-action creates the docker-container builder by default (https://github.com/docker/setup-buildx-action, jev weight 0.96), so the standard setup step is the entire prerequisite.

## Where attestations live

Attestations are attached to the image index alongside the image manifest (https://docs.docker.com/build/metadata/attestations/, jev weight 0.94). Pushing the built result to a registry is what preserves them; an image that is built but never pushed leaves its attestations stranded on the runner (https://docs.docker.com/build/metadata/attestations/, jev weight 0.94). yubiOS pipelines therefore pair build-push-action with push: true when attestations matter, which in yubiOS is always for published images.

## The yubiOS rule

The source doc is explicit: "For yubiOS CI: always include before building bootc images with attestations" (source doc, Notes). In the yubiOS pipeline the attestation expectation is unconditional for bootc images, so the setup step is a fixed part of the workflow skeleton rather than a per-feature decision. The skill also sits inside the org's declarative-policy stack: it is the setup step for declarative-policy builds, and buildx is the executor for the docker buildx build --policy supply-chain gate (source doc, Declarative policy coverage section).

## Audit-trail context

The source doc carries 3 RSI cycle audit entries (cycle 5 closing a segmentation primitive gap on 2026-08-06, cycle 6 closing cryptographic identity, cycle 7 closing trust chain), which mark this skill as an attested, policy-gated build executor inside the 10-primitive yubiOS framework (source doc, cycle 5-7 sections). For corpus consumers the takeaway is placement: setup-buildx-action feeds the trust chain and cryptographic identity layers downstream of the build, so its output (attested images) is what those primitives verify.

## Decision rule

1. Keep build-push-action at v4 or later wherever attestations are expected (https://docs.docker.com/build/ci/github-actions/attestations/, jev weight 0.95).
2. Provide a docker-container builder via setup-buildx-action before the build step (source doc; https://github.com/docker/setup-buildx-action, jev weight 0.96).
3. Push to a registry so attestations survive the build (https://docs.docker.com/build/metadata/attestations/, jev weight 0.94).
4. For yubiOS bootc images, treat the setup step as mandatory and unconditional (source doc, Notes).

## Sources

- Source doc: yubi-OS/yubiOS skills/docker-setup-buildx-action/SKILL.md (When to use, Driver comparison, Notes, Declarative policy coverage, cycle 5-7 sections).
- https://docs.docker.com/build/ci/github-actions/attestations/ (jev weight 0.95).
- https://docs.docker.com/build/ci/github-actions (jev weight 0.96).
- https://docs.docker.com/build/metadata/attestations/ (jev weight 0.94).
- https://github.com/docker/setup-buildx-action (jev weight 0.96).
