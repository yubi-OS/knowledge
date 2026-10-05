# 02 - Sigstore and cosign post-quantum readiness

Scope: Sigstack stack readiness: cosign, Fulcio, Rekor, and Sigstore policy posture toward post-quantum signatures and ML-DSA support status.

## Sigstore has picked ML-DSA and started landing it

The Sigstore project published its post-quantum position in June 2025: systems will transition to post-quantum cryptographic algorithms in the coming years, and the project wants to enable people to sign content with PQCA keys as soon as possible while adopting PQCA in its own infrastructure on a longer arc (source: https://blog.sigstore.dev/post-quantum-2025/, weight 0.91 and 0.95).

Concretely, a pull request adding ML-DSA had already landed in Sigstore's protocol buffer specification at the time of that post, with ML-DSA chosen over SLH-DSA for its smaller signature size (source: https://blog.sigstore.dev/post-quantum-2025/, weight 0.91). The stated purpose is hands-on experience: get the algorithm into the spec so people can uncover issues and understand tradeoffs before a wider cutover (source: https://blog.sigstore.dev/post-quantum-2025/, weight 0.95).

Third-party write-ups describe the roadmap behind that choice: Sigstore's Technical Advisory Committee approved ML-DSA (NIST FIPS 204, formerly CRYSTALS-Dilithium) as the target algorithm for post-quantum signing, with a planned 2025 to 2026 window for Fulcio to issue ML-DSA certificates and Rekor updates to accept ML-DSA signed entries shortly after (source: https://www.systemshardening.com/articles/cicd/post-quantum-artifact-signing/, weight 0.34, weak backing; vendor blog, verify against Sigstore channels before relying on the specific dates).

## What is live today versus planned

The deployed Fulcio public instance is a free code signing CA issuing X.509 certificates valid for 10 minutes based on OIDC identity, auditable via certificate transparency (source: https://docs.sigstore.dev/certificate_authority/overview/, weight 0.94). Rekor provides an immutable, tamper-resistant ledger of signatures and software supply-chain metadata (source: https://docs.sigstore.dev/logging/overview/, weight 0.94). Both components' documented surfaces are classical-signature oriented as of this dig; the PQ support lives in the spec-layer protobuf work described above, not yet in generally available tooling.

cosign itself signs OCI containers and other artifacts (source: https://github.com/sigstore/cosign, weight 0.84), and community discussion points at the same sequencing: upstream Go adding post-quantum signing (crypto/mldsa) sets the stage for cosign's post-quantum signing algorithms (source: https://github.com/sigstore/cosign/discussions/4771, weight 0.61). One guide claims cosign already supports custom post-quantum signing keys via external providers (source: https://www.systemshardening.com/articles/cicd/post-quantum-artifact-signing/, weight 0.32, weak backing).

## Readiness verdict for attestation chains

The chain components are real and live (Fulcio CA, Rekor log, cosign CLI), the target algorithm is chosen and in the protocol spec, but end-to-end PQ attestation issuance and verification is not generally available. A supply-chain readiness assessment should treat Sigstore PQ as spec-ready, tooling-pending: design verification tooling so the algorithm identifier is pluggable, and expect ML-DSA certificates and Rekor entries to arrive before cosign's default flow turns them on.
