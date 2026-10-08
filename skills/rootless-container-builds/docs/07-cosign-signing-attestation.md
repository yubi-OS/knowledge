# 07. Cosign: signing, attestation, and verification

Scope: the cosign toolchain around the yubiOS images: key generation, key-based and keyless signing, SBOM attestation attachment, and verification.

## Key generation

The source doc starts with `cosign generate-key-pair` (source doc, yubi-OS/yubiOS skills/rootless-container-builds/SKILL.md). The upstream command documentation matches: the command generates a key pair and writes cosign.key and cosign.pub by default, supports a custom prefix with `--output-key-prefix`, and can target KMS backends such as Azure Key Vault with `--kms` (https://github.com/sigstore/cosign/blob/main/doc/cosign_generate-key-pair.md, jev weight 0.86). Sigstore's documentation positions the tool generally: cosign signs software artifacts and records signatures in a tamper-resistant public log (https://docs.sigstore.dev/cosign/, jev weight 0.85).

For self-managed keys, the sigstore docs add operational detail: generation prompts interactively for a password, or accepts `COSIGN_PASSWORD` from the environment, and cosign supports RSA, ECDSA, and ED25519 keys, with RSA limited to PKCS#1.5 padding (https://docs.sigstore.dev/cosign/key_management/signing_with_self-managed_keys/, jev weight 0.86). This matters for the yubiOS policy.json in doc 06: the public half (cosign.pub) is what gets installed at /etc/containers/cosign-yubiOS.pub.

## Signing: key-based and keyless

The source doc gives both signing modes:

```
cosign sign --key cosign.key dhi.io/yubi-OS/yubiOS@sha256:...
```

and, keylessly in GitHub Actions using the OIDC token:

```
cosign sign \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  dhi.io/yubi-OS/yubiOS@sha256:...
```

(source doc). The keyless mode is the default sigstore model: the cosign repository describes keyless signing with the Sigstore public good Fulcio certificate authority and Rekor transparency log, alongside hardware and KMS signing and cosign-generated encrypted key pairs (https://github.com/sigstore/cosign, jev weight 0.84). In CI, the workflow's `id-token: write` permission (doc 09) is what produces the OIDC token the keyless flow consumes.

## SBOM attestation

The source doc pairs SBOM generation with attestation attachment:

```
syft dhi.io/yubi-OS/yubiOS@sha256:... -o spdx-json > sbom.spdx.json
cosign attest --type spdxjson --predicate sbom.spdx.json \
  dhi.io/yubi-OS/yubiOS@sha256:...
```

(source doc). The upstream cosign attest documentation confirms the invocation shape: `cosign attest --predicate --type --key cosign.key` attaches an attestation to a container image, with the key sourced from a local file or a KMS URI (https://github.com/sigstore/cosign/blob/main/doc/cosign_attest.md, jev weight 0.85). Anchore's guide covers the same flow from the SBOM side, including keyless SBOM attestation via OIDC, `cosign verify-attestation` for verification, and the note that attestations attach to images in OCI registries and that the flow requires cosign 1.12 or later (https://oss.anchore.com/docs/guides/sbom/attestation/, jev weight 0.78).

## Verification

The source doc's verify command is `cosign verify --key cosign.pub dhi.io/yubi-OS/yubiOS@sha256:...` (source doc). Verification against the pinned digest closes the loop that doc 08 opened: the digest is the identity being verified, the signature is the claim, and cosign.pub is the trust anchor. For attestation verification, `cosign verify-attestation` checks the attached SBOM attestation (https://oss.anchore.com/docs/guides/sbom/attestation/, jev weight 0.78).

Weak-backing notes: golinuxcloud.com's cosign sign and verify guide scored 0.17 under jev weighting, and oneuptime.com's docker image signature verification post 0.11; neither is used as a claim source. All signing, attestation, and verification mechanics here rest on the sigstore documentation, the cosign command documentation, and the source doc.

## Key custody and CI

The two signing modes differ in custody, and that difference drives where each is used. Key-based signing puts the private key (cosign.key) wherever the signer runs, protected by the interactive password or the COSIGN_PASSWORD environment variable (https://docs.sigstore.dev/cosign/key_management/signing_with_self-managed_keys/, jev weight 0.86); it suits local signing by the release owner. Keyless signing puts custody in the OIDC identity of the CI job: the workflow proves its identity with the GitHub-issued token, Fulcio issues a short-lived certificate, and the signature lands in the Rekor transparency log (https://github.com/sigstore/cosign, jev weight 0.84). For yubiOS images built in CI, keyless is the checklist default; the long-lived cosign.pub remains on hosts as the verification anchor in policy.json (doc 06).

## Where each piece lands in yubiOS

The hardening checklist in the source doc requires images signed with cosign, keyless OIDC in CI, and the SBOM attached as a cosign attestation (source doc). Locally, key-based signing uses cosign.key; in CI, keyless signing uses the workflow identity. Both produce sigstore signatures that the podman policy.json from doc 06 verifies at pull time, making the signing step the producer side of the pull-time gate rather than a standalone ritual.
