# 05 - Cosign: Signing, Attesting, and Keyless Verification

Scope: how yubiOS signs artifacts and attaches attestations with cosign under keyless OIDC identity, including SBOM (SPDX) attestations, and how verification pins identity.

Ground spine: yubi-OS/yubiOS skills/slsa-provenance/SKILL.md (source doc).

## Keyless signing in CI

Cosign is the Sigstore command-line client "for signing, verifying, and storing container images, OCI artifacts, blobs, and in-toto attestations," with container signing, verification, and storage in an OCI registry [https://github.com/sigstore/cosign, jev 0.74]. In GitHub Actions the source doc uses keyless signing: `cosign sign ghcr.io/yubi-OS/yubiOS@sha256:...` with no key material at all, because the OIDC identity of the workflow supplies it (source doc).

Keyless signing works through an ephemeral private key and a short-lived certificate tied to an OIDC identity; one secondary writeup explains that its security comes from checking the artifact digest, certificate chain, trusted time, transparency evidence, exact identity, and issuer together [https://oneuptime.com/blog/post/2026-08-11-cosign-keyless-signing-explained/view, jev 0.13, weak]. The mechanism is corroborated by the official verification docs below, so the weak source adds no load-bearing claim here.

## Verification: pin the identity, not a key

The official Sigstore docs give the general verification shape as `cosign verify [--key <key path>|<key url>|<kms uri>] <image uri>`, with keyless verification as a supported mode [https://docs.sigstore.dev/cosign/verifying/verify/, jev 0.89]. The source doc pins two identity flags on every yubiOS verification:

- `--certificate-oidc-issuer https://token.actions.githubusercontent.com`
- `--certificate-identity https://github.com/yubi-OS/yubiOS/.github/workflows/release.yml@refs/heads/main`

or, for the generator-produced SLSA provenance, `--certificate-identity-regexp 'https://github.com/slsa-framework/slsa-github-generator'` (source doc). This is the practical meaning of L2 authentication in the level ladder (doc 01): the signature is checked against an issuer and identity, not a long-lived key.

## Attestations and SBOMs

The source doc attaches an SBOM as a cosign attestation:

```bash
cosign attest \
  --type spdxjson \
  --predicate sbom.spdx.json \
  ghcr.io/yubi-OS/yubiOS@sha256:...
```

(source doc). This is checklist item "SBOM (SPDX via Syft) attached as cosign attestation" (source doc).

The official command reference for `cosign verify-attestation` describes it as verifying "an attestation on the supplied container image... by checking the claims against the transparency log" [https://github.com/sigstore/cosign/blob/main/doc/cosign_verify-attestation.md, jev 0.71]. A worked Chainguard walkthrough shows the full flow of generating an SBOM and associating it with a container image via a cosign-generated attestation [https://edu.chainguard.dev/open-source/sigstore/cosign/how-to-sign-an-sbom-with-cosign/, jev 0.63]. The Anchore docs show the same shape from the producer side: `syft attest --output spdx-json` emits "a DSSE envelope containing an in-toto statement with your SBOM as the predicate," verified with `cosign verify-attestation` [https://oss.anchore.com/docs/guides/sbom/attestation/, jev 0.32, weak]. That DSSE in-toto shape is exactly the layering described in doc 03.

## Policy consumers of attestations

Sigstore's policy-controller sample policies include one asserting "all images must have a signed SPDX SBOM (spdxjson)" attestation [https://docs.sigstore.dev/policy-controller/sample-policies/, jev 0.76]. For yubiOS this is the cluster-side counterpart of the build-side checklist: once the SBOM attestation exists, admission policy can require it. The source doc does not wire policy-controller today; the sample policy is cited as the mechanism that would consume the attestation if admission-time enforcement is added.

## Where this sits in the pipeline

Cosign carries two jobs in the yubiOS checklist (source doc): container image attestation verification with `--type slsaprovenance` against the generator identity (the image-side counterpart of doc 04's binary verification), and the SBOM attestation attach step. Signing and transparency-log anchoring happen in the same operations, which is why doc 07 (Rekor) matters for every cosign call: the verify-attestation path checks claims against the transparency log per the official reference above.
