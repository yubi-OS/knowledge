# 04 - TUF and Notary readiness for post-quantum signatures

Scope: Update-framework readiness: TUF and Notary v2 metadata/signing surfaces and their post-quantum migration state.

## TUF: a studied PQ migration surface

The Update Framework protects software update systems against attackers who compromise the repository or the signing keys (source: https://theupdateframework.io/, weight 0.85). Its design gives every update system multiple signing roles rather than one signature per artifact, which is what makes its PQ migration nontrivial: a peer-reviewed state machine model of TUF was published specifically to account for the cumulative impact of signature algorithm selection across a TUF deployment, introduced because system architects considering post-quantum algorithms need to understand that impact (source: https://arxiv.org/html/2502.18092v1, weight 0.82; PDF: https://arxiv.org/pdf/2502.18092v1, weight 0.74).

The structural fact that drives the migration cost: TUF introduces four distinct roles, each with one or more signing keys, that must participate in the update validation flow (source: https://arxiv.org/pdf/2502.18092v1, weight 0.74). Migrating TUF metadata to PQ signatures therefore means moving key rotation, threshold signing, and role delegation across the algorithm boundary together, not swapping one key type.

## Notary v2: classical signing infrastructure with an open PQ question

Notary Project tooling, the Notation CLI, adds signatures as standard items in the OCI registry ecosystem for signing and verifying container images and other artifacts (source: https://github.com/notaryproject/notation, weight 0.84). Microsoft documents the end-to-end flow: sign and verify container images and OCI artifacts in Azure Container Registry using Notation and Artifact Signing (source: https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tutorial-sign-verify-notation-artifact-signing, weight 0.83). JFrog documents the same Notary v2 framework for signing and validating images in OCI-compliant registries (source: https://jfrog.com/help/r/artifactory-notary-v2-signing-with-artifactory-docker-repository, weight 0.84).

The dig found no primary documentation of Notary Project post-quantum support in its current release surface. This is a recorded gap, not a negative claim: readiness work should treat Notary v2's certificate-chain-based verification as classical until the Notary Project specs state otherwise.

## Readiness verdict

TUF is the update-system component with an explicit, analyzed PQ migration path and published modeling work; treat its role structure as the reference for how key-threshold metadata complicates a signature cutover. Notary v2 is functionally similar to cosign in scope (OCI artifact signatures) but has no surfaced PQ roadmap in the collected evidence; any attestation chain that includes Notation-signed images should list it as an unverified dependency and track the Notary Project specification directly.
