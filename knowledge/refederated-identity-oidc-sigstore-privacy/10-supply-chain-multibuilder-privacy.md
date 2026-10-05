# Multi-Builder Supply Chains: Unlinkable Attestation Identities

Scope: applying pairwise workload identities and per-event short-lived certs to artifact-attestation ecosystems: multiple independent CI sources without a single trust-anchor point of compromise, and unlinkable builders contributing to the same artifact.

## The keyless signing substrate

Sigstore's keyless model is the substrate for multi-builder attestation. The Cosign overview states the mechanism: "Keyless signing associates identities, rather than keys, with an artifact signature. Fulcio issues short-lived certificates binding an ephemeral key to an OpenID Connect identity. Signing events are logged in Rekor, a signature transparency log" [1]. The identity-based shift is the security-relevant move: "Keyless signing shifts the root of trust from a protected file (a private key) to a protected process (the CI/CD pipeline)", where "the CI system (e.g., GitHub Actions) proves its identity via an OpenID Connect token" [2] (weak backing, 0.47).

This removes long-lived private keys from the supply chain entirely: the keyless model "uses short-lived certificates bound to OIDC identity, recorded in Rekor's transparency log, eliminating long-lived private keys" [3] (weak backing, 0.29), and keyless signing "eliminates long-lived signing keys by issuing short-lived certificates from Fulcio and recording signatures in the Rekor transparency log", with Cosign wiring it into CI/CD [4] (weak backing, 0.23).

## Multiple independent CI sources

A multi-federation supply chain lets an ecosystem accept builds from several independent CI sources (GitHub-hosted Actions, self-hosted runners, a different cloud's federation service) without any single trust anchor being a single point of compromise. The verification-side mechanics that make this workable are established:

- Verification policy pins acceptable OIDC issuers per signature [5] (weak backing, 0.33), so each builder's chain is checked against its own issuer.
- The in-toto attestation envelope is "DSSE, and the signing identity is whatever cosign was configured to use, typically a Fulcio short-lived certificate tied to OIDC" [6] (weak backing, 0.29), so attestation identity is per-signing-event by construction.
- Transparency-log verification gives each signature a timestamped, tamper-evident log record [7] (weak backing, 0.24).

Rekor v2's tile-based log model keeps entries from multiple issuers in one log without log-level cross-issuer correlation; the witness quorum and trust configuration decide which issuers' entries are trusted (see the Rekor v2 doc in this corpus).

## Unlinkable builders on one artifact

The privacy angle matters when an artifact collects contributions from builders who should not be correlatable across builds: independent maintainers, per-fork CI, or partitioned release infrastructure. Pairwise workload identities make this concrete:

1. Each builder presents its OIDC identity to Fulcio per signing event, yielding a short-lived cert [1]. There is no long-lived workload identity reused across operations to correlate.
2. Claims in the cert are whatever the OIDC token asserted for that event. If the builder's IdP issues per-audience subjects, the same logical builder produces different identity strings per consuming context.
3. Rekor entries record that a signature happened at a time; they do not assert cross-build identity continuity, so unlinkability across builders is the default state unless verification policy adds a correlation.

Established PKI practice for signing services follows the same short-lived, profile-scoped pattern: Azure Artifact Signing certificate profiles include "Short-lived certificates" and "Certificate profile Extended Key Usage (EKU) for durable profile identification" [8], and Red Hat's Trusted Artifact Signer describes "a free root certification authority that issues short-lived, temporary certificates to an authorized identity and publishes them in a transparency log", with the option of self-managed keys in a third-party key management system [9].

## Adoption signal and lifecycle

Real ecosystems are moving to mandatory attestation: PyPI implemented mandatory build attestations for its top 5,000 packages, with Sigstore integration and GitHub Actions security involved [10] (weak backing, 0.12). The identity-management layer underneath is non-human identity lifecycle management: machines, services, containers, and CI agents each carry managed identities with their own lifecycle [11] (weak backing, 0.38). A multi-builder attestation design has to treat builder identities as first-class lifecycle objects: enroll, rotate (including refederate), revoke, and audit.

## Sources

All weights from the jev noul weighting of this corpus's dig.

1. Overview - Sigstore Cosign docs, https://docs.sigstore.dev/cosign/signing/overview/ (0.91)
2. Keyless Container Signing With Sigstore and OIDC, CleanStart, https://www.cleanstart.com/knowledge-hub/keyless-container (0.47, weak)
3. Sigstore and Cosign: Keyless Container Image Signing and Verification, systemshardening.com, https://www.systemshardening.com/articles/kubernetes/sigstore-cosign-container-signing/ (0.29, weak)
4. Sigstore Keyless Signing and Cosign Verification, systemshardening.com, https://www.systemshardening.com/articles/cicd/sigstore-keyless-signing/ (0.23, weak)
5. Your Signed Container Image Means Nothing If You Signed the Tag, LinkedIn Pulse, https://www.linkedin.com/pulse/your-signed-container-image-means-nothing-you-tag-heres-ifeanyi-lkwbe (0.33, weak)
6. in-toto Attestation Framework Walkthrough 2026, safeguard.sh, https://safeguard.sh/resources/blog/in-toto-attestation-framework-walkthrough-2026 (0.29, weak)
7. Transparency Log Verification, deepwiki (jdx/sigstore-verification), https://deepwiki.com/jdx/sigstore-verification/6.3-transparency-log-verification (0.24, weak)
8. Artifact Signing certificate management, Microsoft Learn, https://learn.microsoft.com/en-us/azure/artifact-signing/concept-certificate-management (0.79)
9. Red Hat Trusted Artifact Signer, https://developers.redhat.com/products/trusted-artifact-signer (0.67)
10. PyPI Implements Mandatory Build Attestations for Top 5,000 Packages, tech-champion.com, https://tech-champion.com/programming/python-programming/pypi-implements-mandatory-build-attestations-for-top-5000-packages/ (0.12, weak)
11. Non-Human Identity Lifecycle (NHI Lifecycle), Token Security, https://www.token.security/glossary/non-human-identity-lifecycle-nhi-lifecycle (0.38, weak)
