# Federated, Unfederated, Refederated

Scope: the three cloud-identity trust patterns ordered by trust centralization, and the rule that refederation must explicitly revoke or supersede the old trust rather than just add the new one.

## The three patterns

Cloud identity has three trust patterns, ordered by how much trust is centralized in one place.

**Unfederated.** Each application manages its own user accounts and credentials. There is no shared identity provider and no cross-application single sign-on. Isolation is maximal and so is per-application overhead: every app owns account lifecycle, password reset, and audit.

**Federated.** One identity provider signs users into many applications under a shared trust relationship. Microsoft's architecture guidance frames this as separating user authentication from application code and delegating it to a trusted identity provider, which reduces administrative overhead and lets applications accept a wider range of identity providers [1]. A concrete deployment of the pattern is federating an on-premises identity provider with Microsoft Entra ID: federation "establish[es] a trust relationship between the on-premises identity provider and Microsoft Entra ID", and Microsoft Entra Connect manages the settings that make up that trust [2].

**Refederated.** Identity that was previously federated through one trust is re-established under a new or different trust. The actor (a person or a workload) persists; the federation relationship used to prove the actor has changed. The new trust chain must explicitly revoke or supersede the old one; a migration that merely adds the new issuer while leaving the old one accepted is a security regression, not a refederation.

## Why protocol choice follows from the trust model

Federation is "a trust model, not just a way to reduce login prompts"; SAML and OIDC both extend trusted authentication across applications but fit different architectures, with SAML practical for many enterprise web applications and OIDC better suited to modern apps, APIs, and mobile access [3] (weak backing, 0.48). Auth0's guidance puts the decision the other way around: first ask whether you are building a centralized identity system or federating with external authorities, because that choice dictates the protocol (SAML vs OIDC), the security model, and how much "identity debt" you carry later [4]. Microsoft's decision guide for Entra ID SSO covers the same two protocols and when to use each [5].

## The revocation side of refederation

Refederation is not complete when the new trust works. Two operational disciplines show up in the federation-migration literature:

1. **Rotate trust material out to every party that holds it.** During an emergency rotation of AD FS certificates, the new certificate public key must be sent to "all your resource organization or account organization partners (represented in your AD FS by relying party trusts and claims provider trusts)" [6]. In refederation terms, the new trust root is only as good as its distribution to every relying party.

2. **Retire the old trust only after every relying party trust has moved.** A health-first AD FS-to-Entra migration decommissions AD FS "only [when] all relying party trusts have been migrated or retired" [7] (weak backing, 0.29). This is the concrete form of "revoke or supersede": the old federation point stays in the picture until the last consumer has moved, then it is torn down rather than left running.

Federation trust itself is certificate-backed: an AD FS federation trust requires "a certificate that's chained to a mutually trusted internet root certificate authority... present in the trusted root store of both the claims provider (CP) and relying party (RP) federation servers" or an equivalent cross-certification design [8]. So the old-vs-new trust decision is ultimately a decision about which CA roots the relying parties hold.

## The workload-identity corollary

The same revocation discipline applies when the federated identity is a workload rather than a person. The OWASP Workload Identity Federation cheat sheet directs providers to validate "the exact trusted issuer (iss), expected audience (aud), and allowed subject (sub) or equivalent workload attributes" plus the signature and token validity period [9]. An allowlist expressed this way is what makes refederation visible at the verifier: when the issuer changes, the allowlist must be updated and the old issuer removed, or the verifier silently accepts two federations where one was intended.

## Sources

All weights from the jev noul weighting of this corpus's dig.

1. Federated Identity Pattern, Azure Architecture Center, https://learn.microsoft.com/en-us/azure/architecture/patterns/federated-identity (0.89)
2. Manage AD FS trust with Microsoft Entra ID, https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-azure-ad-trust (0.94)
3. Identity Federation Explained: SAML, OIDC, and Beyond, Hexnode, https://www.hexnode.com/blogs/identity-federation-explained-saml-oidc-and-beyond/ (0.48, weak)
4. Federated Identity vs. Single Sign-On: Key Differences, Auth0, https://auth0.com/blog/federated-identity-vs-single-sign-on-key-differences/ (0.70)
5. SAML versus OpenID Connect: Choose the right SSO protocol, Microsoft Learn, https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/saml-vs-oidc-decision-guide (0.88)
6. Emergency rotation of the AD FS certificates, Microsoft Entra ID, https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-emergency-ad-fs-certificate-rotation (0.65)
7. Migrating from AD FS to Azure AD SSO, windows-active-directory.com, https://www.windows-active-directory.com/migrating-from-ad-fs-to-azure-ad-sso.html (0.29, weak)
8. AD FS troubleshooting - certificates, Microsoft Learn, https://learn.microsoft.com/en-us/windows-server/identity/ad-fs/troubleshooting/ad-fs-tshoot-certs (0.75)
9. OWASP Workload Identity Federation Cheat Sheet, https://cheatsheetseries.owasp.org/cheatsheets/Workload_Identity_Federation_Cheat_Sheet.html (0.76)
