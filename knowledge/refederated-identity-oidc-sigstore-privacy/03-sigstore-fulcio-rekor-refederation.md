# Refederation in Sigstore: Fulcio and Rekor

Scope: how the Sigstore attestation layer behaves when the OIDC provider changes: Fulcio issues short-lived X.509 certs bound to OIDC identity claims, Rekor logs all certs and signatures, and a new issuer forces trust-list updates and a subject-identity break that needs out-of-band bridging.

## The attestation layer

Sigstore's signing identity chain has two load-bearing components. **Fulcio** is "a free-to-use certificate authority for issuing code signing certificates for an OpenID Connect (OIDC) identity, such as email address", and it "only issues short-lived certificates that are valid for 10 minutes" [1]. **Rekor** "provides a restful API-based server for validation, and a transparency log for storage", with a CLI to make and verify entries, "query the log for inclusion proof", check integrity, and retrieve entries by public key or artifact [2].

The identity binding works like this: Fulcio "uses OIDC tokens to authenticate requests", extracts "subject-related claims from the OIDC token" and includes them in the issued certificate [3]. Sigstore's security model states it directly: "The identity and issuer associated with the OIDC token is embedded in the short-lived certificate issued by Sigstore's Certificate Authority, Fulcio" [4]. Fulcio also runs a federated OIDC identity provider, Dex, where "users authenticate to their preferred identity provider and Dex creates an OIDC token with claims from the original OIDC token" [3]; tokens from additional configured OIDC identity providers are also accepted [3].

The operational consequence is documented in the token-flow analysis: Fulcio does not turn an OIDC token into a long-lived signing credential. It uses the token to authenticate a certificate request, "binds the authenticated identity to a client-generated public key, and returns a short-lived X.509 code-signing certificate", currently valid for exactly 10 minutes [5] (weak backing, 0.17).

## What changes when the issuer changes

Because the certificate embeds the identity and the issuer [4], the OIDC provider is part of the verified signing identity. Three consequences follow when that provider is replaced:

1. **Trust list update.** The verifier must accept the new issuer's CA root. In cosign-style verification policy, this shows up as an issuer pin: verification tooling pins "the acceptable OIDC provider" (for example, to GitHub Actions) via a certificate-oidc-issuer check, and confirms the Rekor transparency log entry exists as part of the same check chain [6] (weak backing, 0.33). A refederation means rewriting every such pin.

2. **Subject-identity break.** The subject in the cert is whatever the new OIDC token asserted. If the new IdP issues a different sub for the same logical workload, the signature verifies as a different identity, not a continuation of the old one. There is no protocol-level bridge inside the cert: continuity has to be established out of band, by an attestation about the migration itself.

3. **Rekor entries persist but prove less than continuity.** Rekor's inclusion proof and integrity machinery "prove[s] that the certificate was valid at the time of signing", which is why verification "eliminat[es] the need for checking revocation lists for expired certificates" [7] (weak backing, 0.28). Technically, log verification combines "Merkle tree inclusion proofs (RFC 6962) and Signed Entry Timestamp (SET) validation" to produce "tamper-proof evidence that an artifact's signature was recorded in an immutable audit log at a specific time" [8] (weak backing, 0.24). None of that proves the old identity and the new identity are the same actor; the log proves when, not who-continuity.

## Why short-lived certs make refederation cheaper, not free

The 10-minute cert lifetime [1] means no long-lived signing credential survives a refederation to be re-issued or revoked. After the issuer change, every new signature is simply minted under the new chain. What does not reset is verification policy: the pins, trust lists, and any claim-based continuity assumptions held by verifiers. A refederated Sigstore deployment therefore looks like: rotate the OIDC provider, update Fulcio's accepted OIDC identity providers [3], update verifier issuer pins [6] (weak backing, 0.33), and record an explicit migration attestation if old and new identities must be treated as one actor.

## Sources

All weights from the jev noul weighting of this corpus's dig.

1. sigstore/fulcio repository README, https://github.com/sigstore/fulcio (0.92)
2. Rekor - Sigstore docs, https://docs.sigstore.dev/logging/overview/ (0.90)
3. OIDC Usage in Fulcio - Sigstore docs, https://docs.sigstore.dev/certificate_authority/oidc-in-fulcio/ (0.84)
4. Security Model - Sigstore docs, https://docs.sigstore.dev/about/security/ (0.94)
5. How Fulcio Issues a 10-Minute Certificate from an OIDC Token, oneuptime.com, https://oneuptime.com/blog/post/2026-08-25-fulcio-oidc-token-10-minute-certificate/view (0.17, weak)
6. Your Signed Container Image Means Nothing If You Signed the Tag, LinkedIn Pulse, https://www.linkedin.com/pulse/your-signed-container-image-means-nothing-you-tag-heres-ifeanyi-lkwbe (0.33, weak)
7. Publishing Container Signatures in Rekor Logs, CleanStart, https://www.cleanstart.com/knowledge-hub/rekor-publishing (0.28, weak)
8. Transparency Log Verification, deepwiki (jdx/sigstore-verification), https://deepwiki.com/jdx/sigstore-verification/6.3-transparency-log-verification (0.24, weak)
