# cosign keyless signing in GitHub Actions

Scope: how cosign keyless signing works from a GitHub Actions workflow (OIDC token, Fulcio certificate, Rekor logging), the permissions required, the identity-pinning options at verify time, and the trust caveats specific to the keyless model.

## What cosign provides

Cosign supports container signing, verification, and storage in an OCI registry. Source: https://github.com/sigstore/cosign (weight 0.97, primary). The Go package documents the signing modes: keyless signing with the Sigstore public good Fulcio certificate authority and Rekor transparency log is the default, alongside hardware and KMS signing and signing with a cosign-generated encrypted keypair. Source: https://pkg.go.dev/github.com/sigstore/cosign/v3 (weight 0.70).

## The keyless flow from a workflow

The mechanics from collected secondary sources, all weakly backed but consistent with each other:

1. The workflow needs the id-token: write permission, which enables the OIDC token request. Sources: https://www.qcecuring.com/blog/sigstore-cosign-keyless-github-actions (weight 0.13, weak); https://github.com/chrisns/cosign-keyless-demo (weight 0.47, weak).
2. cosign sign --yes runs the Fulcio plus Rekor flow automatically. Source: https://www.qcecuring.com/blog/sigstore-cosign-keyless-github-actions (weight 0.13, weak).
3. Fulcio issues a short-lived certificate against the workflow's OIDC token, and the signing event is recorded in Rekor; bundle verification pins the certificate identity and OIDC issuer, and a tamper test confirms verification fails on a modified artifact. Source: https://codenote.net/en/posts/sigstore-cosign-keyless-signing-cli-artifacts-oidc-verification/ (weight 0.13, weak).

## What keyless signing publishes

With keyless signing, the signer's username, organization name, repository name, and workflow name are published to the Rekor public transparency log. Source: https://dev.to/n3wt0n/sign-your-container-images-with-cosign-github-actions-and-github-container-registry-3mni (weight 0.11, weak backing). Treat this as a disclosure consideration before enabling keyless on private repositories.

## Verification is an authorization decision

A valid keyless signature is not automatically an authorized signature. Fulcio can issue certificates to many identities from several identity providers, so cosign's --certificate-identity and --certificate-oidc-issuer options are what turn cryptographic verification into an authorization decision: this artifact must have been signed by this identity, authenticated by this issuer. Source: https://oneuptime.com/blog/post/2026-08-11-choose-cosign-certificate-identity-oidc-issuer/view (weight 0.33, weak backing). The verification policy should be derived narrowly from the producer's controlled OIDC workflow. Source: https://github.com/oneuptime/blog/tree/master/posts/2026-08-11-choose-cosign-certificate-identity-oidc-issuer (weight 0.31, weak backing).

## Keyless trust caveats

Keyless signing removes the stored private key, but the signing job still holds powerful credentials: permission to request a GitHub OIDC token and usually permission to push signatures to a registry. If untrusted pull-request code reaches that job, an attacker may obtain a valid certificate for the workflow identity and sign an artifact the organization never intended to release. Source: https://oneuptime.com/blog/post/2026-08-11-secure-keyless-cosign-github-actions-pull-requests/view (weight 0.09, weak backing).

Permission placement follows from that threat model: treat the OIDC token as a signing capability and set permissions at the job level. A top-level id-token: write makes the token available to more jobs than necessary, including jobs that parse or execute untrusted content. Source: https://github.com/oneuptime/blog/tree/master/posts/2026-08-11-secure-keyless-cosign-github-actions-pull-requests (weight 0.05, weak backing).

## Consolidated picture

A hands-on lab covering keyless signing, OIDC identity, signature verification, and Kyverno admission policies ties the flow together and is the only collected source on this subtopic rated at or above 0.5. Source: https://secure-pipelines.com/ci-cd-security/lab-signing-verifying-container-images-cosign-github-actions/ (weight 0.55).

Practical summary: id-token: write at job scope, cosign sign --yes at build time, cosign verify with --certificate-identity and --certificate-oidc-issuer pinned to the exact workflow path and issuer at consume time. All of the caveats above (public-log disclosure, PR-triggered signing risk, identity pinning necessity) come from weakly backed secondary sources, so treat them as review questions rather than settled claims, and check them against the primary cosign documentation before enforcement.
