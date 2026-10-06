# Attesting reproducible outputs: the open adoption opportunity

Scope: cosign attestation, in-toto, SLSA provenance, and GitHub Actions artifact attestations as the layer that sits on top of reproducible builds, and what adopting it on an existing image build looks like.

## Why attestation complements reproducibility

Reproducible builds make an artifact independently re-derivable: anyone with the same inputs gets the same bytes. Attestation makes an artifact's origin claims verifiable without rebuilding. They compose: reproducibility guarantees what a rebuild yields, attestation records who built what from which source with which parameters. The SLSA provenance document is, concretely, a signed in-toto attestation containing builder identity, source commit, build parameters, and the output artifact digest. [1] (weight 0.08, weak)

## The concrete mechanisms

1. cosign in-toto attestations. Sigstore's cosign has built-in support for in-toto attestations: create and sign one from a local predicate file with cosign attest --predicate <file> --key cosign.key <image>. [2] (weight 0.90) Attestations are signed metadata documents co-located with the image in an OCI registry, each an in-toto envelope wrapping a typed predicate: a SLSA provenance document, a CycloneDX SBOM, a vulnerability scan report, or a custom predicate. [3] (weight 0.59, weak)

2. SLSA provenance generation. The slsa-framework/slsa-github-generator repository provides free tools to generate and verify SLSA Build Level 3 provenance for native GitHub projects using GitHub Actions, so builders using the workflow get a tamper-resistant provenance chain. [4] (weight 0.85)

3. GitHub Actions artifact attestations. GitHub's native feature uses Sigstore to generate SLSA provenance for builds, and the gh CLI can validate artifact attestations for binaries and container images, including SBOM attestations. [5] (weight 0.94) A known limitation worth tracking: nothing in the resulting attestation records which runner produced the build, and gh attestation verify --deny-self-hosted-runners keys on the runner_environment field; provenance checks for npm packages and similar consumers should be aware of what is and is not recorded. [6] (weight 0.35, weak)

4. Keyless signing. Practitioner pipelines combine native provenance generation with a CycloneDX SBOM attestation and cosign signing in keyless mode, so no long-lived key material needs custody. [7] (weight 0.36, weak)

## What adoption looks like on an existing image build

yubiOS has not adopted this layer yet; it is the one clearly open opportunity from the reproducible-mkosi comparison. The natural shape (per the yubiOS refs note, 2026-07-30): add cosign attach attestation plus in-toto plus Sigstore Rekor on top of the existing scripts/build-local-images.sh flow, via docker-metadata-action to generate stable OCI metadata and the actions/attest pattern for GitHub-native attestations. Worth an ADR if pursued.

Two design points determine whether the attestation is meaningful:

1. The predicate should carry the reproducibility evidence. A reproducible build can attest more than provenance: the two-build verification result itself (digest equality across builders A and B) is a claim worth recording in the attestation, because it converts a CI run into portable evidence.

2. Verification must be wired into consumers. An attestation nobody verifies is decoration. gh attestation verify covers binaries and container images. [5] (weight 0.94)

## Ordering

Attestation depends on reproducibility machinery that already exists: SOURCE_DATE_EPOCH derivation, seeded UUIDs, and the two-build verifier produce the stable digests the attestation references. Adopting attestation before the build is stable would sign artifacts that change on every rebuild. Adopting it after locks in the wins: the digest is meaningful, the commit is pinned, and the only missing piece is the signed record.

## Sources

1. https://www.decryptiondigest.com/blog/slsa-software-supply-chain-framework-guide (weight 0.08, weak)
2. https://docs.sigstore.dev/cosign/verifying/attestation/ (weight 0.90)
3. https://www.systemshardening.com/articles/cicd/container-image-attestations/ (weight 0.59, weak)
4. https://github.com/slsa-framework/slsa-github-generator (weight 0.85)
5. https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations (weight 0.94)
6. https://github.com/orgs/community/discussions/205663#discussion-10672238 (weight 0.35, weak)
7. https://blog.stephane-robert.info/en/docs/pipeline-cicd/github/securite/lab/build-verifiable/ (weight 0.36, weak)
