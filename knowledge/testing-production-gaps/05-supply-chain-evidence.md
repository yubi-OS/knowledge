# 05 - Supply chain evidence: SBOM, SLSA, cosign, channel binding

## Scope

SBOM, SLSA provenance, cosign signing, and OCI channel binding for production images: the 0/25 SBOM and 2/25 provenance gaps and their fixes.

## The evidence gap in one sentence

A consumer who pulls a yubiOS image today cannot verify what is inside it (no SBOM), cannot verify who built it and how (no provenance on the canonical build workflow), and cannot verify it was signed (no cosign in the workflow YAML) (yubiOS source: refs/testing-production-gaps-2026-08-01). The audit counts 0 of 25 workflows producing an SBOM and 2 of 25 with explicit SLSA provenance, and the canonical production build (yubiOS-ci.yml) is not among the two.

## What the reference implementations provide

GitHub's artifact attestation feature provides SLSA v1.0 Build Level 2 out of the box: it creates a link between the artifact and the workflow that produced it (source: https://docs.github.com/en/actions/concepts/security/artifact-attestations, jev weight 0.94). To reach Build Level 3, GitHub's documented path is to build with hardened reusable workflows, which raise the build's isolation guarantees and are covered by the artifact attestations integration (source: https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/increase-security-rating, jev weight 0.93). The slsa-github-generator project publishes free tooling to generate and verify SLSA Build Level 3 provenance for native GitHub projects, specifically protecting against builds inheriting the workflow's broad token permissions (source: https://github.com/slsa-framework/slsa-github-generator, jev weight 0.96). The SLSA project's own guidance shows how to bring your own provenance builder on GitHub Actions when the off-the-shelf generator does not fit the build shape (source: https://slsa.dev/blog/2023/08/bring-your-own-builder-github, jev weight 0.91).

Practitioner writeups converge on a four-layer pattern for container images: generate an SBOM (CycloneDX or SPDX), attach SLSA provenance as a cosign attestation, sign the image with cosign (keyless signing in GitHub Actions is the common mode), and enforce signature plus provenance verification at deployment time with an admission controller or a verify step in the consumer pipeline (source: https://www.matterai.so/guides/supply-chain-security-slsa-sboms-sigstore-and-dependency-pinning-in-cicd, jev weight 0.54; source: https://o3.security/academy/container-image-supply-chain-security, jev weight 0.51). Attestations are signed metadata attached to a container image as a co-located OCI artifact, which is the mechanism build-push-action's sbom and provenance flags use (source: https://www.systemshardening.com/articles/cicd/container-image-attestations/, jev weight 0.31, weak backing).

## The yubiOS fix, concretely

The yubiOS audit's fix for Gap 6 is mechanical and small (priced at 1 week, yubiOS source: refs/testing-production-gaps-2026-08-01):

1. Set provenance: true and sbom: true on docker/build-push-action in yubiOS-ci.yml and ci_mkosi-installer.yml. This attaches signed SLSA provenance and an SPDX SBOM to every pushed image in one flag change, using the same co-located attestation mechanism the reference guides describe.
2. Add a cosign sign --yes step after each push, so the image digest carries a signature a consumer can verify before boot.
3. Add tests/vm/test-oci-provenance.sh: pull the image, read its attestation with cosign, assert the provenance's build definition matches the workflow, and assert the SBOM lists the kernel package. This is the CI assertion that keeps the evidence from regressing.

The existing yubiOS.rego build policy (reset=true,strict=true) already gates build inputs (approved registries, digest pinning, provenance flags), so the rego gate and the attestation push are complementary halves: the policy governs what a build may consume, the attestations prove what it produced.

## Channel binding: the mutable-tag hole

The second half of the gap is channel binding. yubiOS publishes immutable :<sha> tags alongside mutable :latest and :dev channels, but nothing asserts that a channel cannot silently move: the invariant "latest can never bind to the dev channel" and per-arch digest binding on pull are both unasserted (yubiOS source: refs/testing-production-gaps-2026-08-01). The test design is simple: resolve the digest of the latest tag and the digest of the dev tag, assert they never coincide, and assert that each arch-specific manifest in a multi-arch index resolves to the digest recorded at publish time. A consumer pinning a digest gets the attestation chain for free (attestations live under the digest), which is another reason the immutable-tag discipline matters.

## Sequencing with the blockers

SBOM and provenance are pure CI work: no hardware, no sign-off ceremony, and they land on the same workflow files the negative-tamper lane touches (yubiOS-ci.yml). That makes Gap 6 the highest evidence-per-week item in the audit. The ordering note from the audit still applies: evidence without enforcement decays, so the OCI provenance test script should land in the same PR as the workflow flags, not after.

## Sources

- https://github.com/slsa-framework/slsa-github-generator (weight 0.96)
- https://docs.github.com/en/actions/concepts/security/artifact-attestations (weight 0.94)
- https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/increase-security-rating (weight 0.93)
- https://slsa.dev/blog/2023/08/bring-your-own-builder-github (weight 0.91)
- https://www.matterai.so/guides/supply-chain-security-slsa-sboms-sigstore-and-dependency-pinning-in-cicd (weight 0.54)
- https://o3.security/academy/container-image-supply-chain-security (weight 0.51)
- https://www.systemshardening.com/articles/cicd/container-image-attestations/ (weight 0.31, weak backing)
- yubiOS refs/testing-production-gaps-2026-08-01 (internal source doc for all repo-internal claims)
