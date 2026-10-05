# Verifier gates: slsa-verifier, cosign verify-attestation, attest-build-provenance

Scope: how verification actually works for SLSA provenance and SBOM attestations, the three verifier tools in the ecosystem, GitHub's native attest-build-provenance action, and what a downstream verifier gate should and should not claim to check.

## Verification is inspection, and provenance does nothing without it

The SLSA spec is explicit: SLSA uses provenance to indicate whether an artifact is authentic or not, but provenance does not do anything unless somebody inspects it. SLSA calls that inspection verification, and the page is aimed at platform implementers, security engineers, and software consumers. Source: https://slsa.dev/spec/v1.0/verifying-artifacts (weight 0.93, primary; the v1.2 edition carries the same framing at https://slsa.dev/spec/v1.2/verifying-artifacts, weight 0.94, primary).

The practical reading for CI: a build that emits attestations but has no verification step has not closed its loop. The verifier gate is the artifact downstream auditors consume.

## The verifier tooling

The slsa-framework/slsa-verifier repository is the canonical verifier CLI; its documentation includes per-ecosystem verification walkthroughs, for example verifying npm packages built with an SLSA Build L3 builder by downloading the package tarball and attestations first. Source: https://github.com/slsa-framework/slsa-verifier (weight 0.96, primary).

cosign provides container-side verification: cosign verify-attestation --type=slsaprovenance image:tag verifies the provenance attestation attached to an image, and verification with cosign keyless does not require access to the corresponding public keys. Source: https://github.com/marketplace/actions/nais-slsa-provenance-action (weight 0.70).

A hands-on lab ties three verifiers together: verify provenance with slsa-verifier, cosign, and gh attestation verify, and enforce at deployment time with a Kubernetes admission policy. Source: https://secure-pipelines.com/ci-cd-security/lab-generating-verifying-slsa-provenance-container-images/ (weight 0.55).

## GitHub's native path: actions/attest-build-provenance

The actions/attest-build-provenance action generates a verifiable signature for the attestation using a short-lived Sigstore-issued signing certificate. If the repository initiating the GitHub Actions workflow is public, the public-good instance of Sigstore will be used to generate the attestation signature. Source: https://github.com/actions/attest-build-provenance (weight 0.91, primary).

This is the low-integration verifier-compatible path: one action step produces a Sigstore-signed build provenance attestation that the standard verifiers can then check, which is why it is the path the generator project itself now recommends for new integrations (see the corpus doc on slsa-github-generator).

## Stale language in secondary sources

Several collected secondary sources still describe the SLSA framework with v0.2-era vocabulary. One article covering "SLSA levels 1-4" describes in-toto attestations and deployment-time policy verification. Source: https://www.systemshardening.com/articles/cicd/slsa-build-provenance/ (weight 0.22, weak backing). Another guide presents generating provenance in CI and verifying before deployment with exact commands. Source: https://clearpathsecurity.co.uk/generating-and-verifying-slsa-build-provenance-for-artifacts/ (weight 0.28, weak backing). A third walks gh attestation verify, cosign, and slsa-verifier in CI and Kubernetes. Source: https://blog.stephane-robert.info/en/docs/pipeline-cicd/github/securite/verifier-attestations/ (weight 0.12, weak backing). A how-to on adding SLSA build provenance in GitHub Actions dates to February 2026. Source: https://how2.sh/posts/how-to-add-slsa-build-provenance-in-github-actions/ (weight 0.22, weak backing).

The pitfall to flag: weakly backed secondary content that mentions "levels 1-4" is evidence of stale spec language persisting in the ecosystem. Verifier implementations should anchor on the primary spec pages (0.93, 0.94) and the primary tool repos (0.96, 0.91), not on secondary explainers.

## What a verifier gate does not check

Sourced from the primary spec framing plus the collected secondary descriptions, a verifier gate that checks signature validity, identity pinning, and attestation-subject binding still does not check:

1. That the build was reproducible byte-for-byte.
2. That the source history satisfies source-track controls (versioned history, retention, two-person review).
3. That an attached SBOM's package list is vulnerability-free (that is a scanner's job, not a verifier's).

The first and second follow from the SLSA track structure (Build track covers build assurance; Source controls are a separate track). Source: https://slsa.dev/spec/v1.2/verifying-artifacts (weight 0.94, primary) as the verification boundary. The third is implied by the separation of SBOM generation from vulnerability scanning in the SBOM tooling docs (see the corpus doc on Syft and attestations, weight 0.72).

Noise filtering note: the dig for this subtopic surfaced rentwithcosign.com (weight 0.03), a rental-housing service unrelated to cosign the signing tool. It is recorded in the archive and excluded from all claims here.
