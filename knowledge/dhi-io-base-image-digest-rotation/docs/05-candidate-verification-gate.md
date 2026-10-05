# Candidate verification gate

Scope: Smoke-gating a candidate digest before landing the pin: cosign signature and attestation verification, SBOM and provenance checks, and a container boot smoke test.

## Why verification sits before the pin

A rotation changes the base of every downstream build. The verification gate exists so that the only thing that changes in the change set is a reviewed digest pair, never an unreviewed set of bytes. The gate has three layers: signature verification, attestation and SBOM checks, and a boot smoke test.

## Layer 1: signature verification with cosign

Cosign's verification is digest-aware by construction. Its documentation states that signature payloads created by cosign include the digest of the container image they are attached to, and that by default cosign validates that this digest matches the container during `cosign verify`; if you use other payload formats, you can loosen this with `--check-claims=false` [S1]. For rotation this is the exact property you need: verifying against the CANDIDATE digest proves the signature covers precisely those bytes, not merely the same tag.

Cosign supports multiple verification modes documented on the same reference: keyless verification using OpenID Connect, verification with a user-provided trusted chain, and verification of attestations [S1]. For enforcement downstream, the Kyverno project documents verifying images with cosign signatures using KMS keys and workload identity [S2].

## Layer 2: attestations and SBOM

Signatures answer "who produced this image"; attestations answer the deeper questions "how was it built" and "what is inside it" [S3]. A candidate base image should carry provenance and SBOM attestations, and the gate should verify them before the pin lands.

Docker's build attestation documentation makes SBOM validation an explicit step: always validate the generated SBOM for your image before you push it to a registry [S4]. The same page documents `BUILDKIT_SBOM_SCAN_STAGE`, which enables scanning for named stages (base, bin) during the build itself [S4], useful for catching a bad base image at build time rather than at deploy time.

Provenance-first pipeline guidance makes the same argument at the gate level: add provenance attestations, signing, and SBOM policy gates to CI so you only ship verified artifacts [S5] (weight 0.56, authoritative).

## Layer 3: the smoke gate

The final check is behavioral: run the new digest once and confirm the image starts and reports its expected runtime. This is the yubiOS checklist step, and it is deliberately last: a candidate that passes signature and attestation verification can still fail on boot behavior (missing libc variant, wrong entrypoint, broken init). The smoke gate is cheap, runs on the same runner that will build downstream images, and needs no registry writes.

A sensible smoke procedure, consistent with the evidence above:

1. Pull by the candidate digest (never by tag; the pin is the digest).
2. Verify the signature and attestations against that digest [S1] [S4].
3. Start the container and check the reported runtime matches expectation.
4. Only then land the pin commit.

## Weak-backing notes

General cosign tutorials covering key-based and keyless verification exist [S6] (weight 0.27, WEAK backing), and community write-ups on SBOM and provenance evidence appear in the dig [S7] (weight 0.20, WEAK backing). They are consistent with the primary sources above but are not load-bearing for this doc.

## Sources

- [S1] https://docs.sigstore.dev/cosign/verifying/verify/ (weight 0.60, authoritative)
- [S2] https://blog.sigstore.dev/how-to-verify-container-images-with-kyverno-using-kms-cosign-and-workload-identity-1e07d2b85061/ (weight 0.87, authoritative)
- [S3] https://blog.glen-thomas.com/software%20engineering/security/2026/01/20/signing-container-images-with-cosign.html (weight 0.69, authoritative)
- [S4] https://docs.docker.com/build/metadata/attestations/sbom/ (weight 0.93, authoritative)
- [S5] https://appropri8.com/blog/2026/01/20/provenance-first-cicd-slsa-sbom/ (weight 0.56, authoritative)
- [S6] https://www.golinuxcloud.com/cosign-sign-verify-container-images/ (weight 0.27, WEAK backing)
- [S7] https://docs.jasonachkardiab.com/devsecops/supply-chain-sbom-signing/ (weight 0.20, WEAK backing)
