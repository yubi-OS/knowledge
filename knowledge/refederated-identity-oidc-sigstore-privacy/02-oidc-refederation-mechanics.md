# Refederation Mechanics in OIDC

Scope: the concrete relying-party-side changes that constitute OIDC refederation (new issuer URL and JWKS, new client registration, changed claims, changed sub values, updated aud and iss allowlists) and the common triggers: issuer migration, org merge, IdP deprecation, trust revocation.

## What the relying party actually holds

An OIDC relying party's view of its identity provider is bootstrapped from discovery. The OpenID Connect Discovery 1.0 specification defines "a mechanism for an OpenID Connect Relying Party to discover the End-User's OpenID Provider and obtain information needed to interact with it, including its OAuth 2.0 endpoint locations" [1]. The provider publishes an OpenID Provider Configuration Document at a publicly accessible endpoint containing "the provider's OIDC endpoints, supported claims, and other metadata", and clients use that metadata to find the authentication URLs and "the authentication service's public signing keys" [2]. OpenID Connect itself is "an interoperable authentication protocol based on the OAuth 2.0 framework of specifications" [3].

Every one of those artifacts is a refederation surface: the discovery document's issuer, the JWKS it points at, the registered client, the claims, and the allowlists the RP enforces.

## The five RP-side changes

**New issuer URL.** A new issuer means a new discovery document. Practical guidance treats the discovery endpoint and the JWKS endpoint as "two URLs [that] quietly determine whether sign-in succeeds, tokens validate, and key rotation happens safely" [4] (weak backing, 0.17). Libraries that accept an issuer or Authority URL fetch the discovery document automatically, which "ensures your application handles key rotation gracefully and stays up-to-date with endpoint changes without a redeployment" [5] (weak backing, 0.50).

**New client registration.** Claims mapping is part of the IdP-side client configuration: in Microsoft Entra External ID, "the IdP configuration includes the Claims mapping section, where you can map standard OpenID Connect (OIDC) claims to the claims your identity provider provides in the ID token" [6]. A migration to a different IdP therefore re-defines which claims exist and what they are called; the RP's mapping configuration moves with it.

**Changed claims.** Claims are name-value pairs "that represent what the subject is, not what the subject can do", and applications can map, customize, and transform them as they arrive from the trusted identity provider [7]. When an IdP drops, adds, or renames claims during refederation, the RP's transformation rules are part of the migration surface.

**Changed subject identifiers.** The sub claim is the identity anchor at the RP. See the pairwise-subjects doc in this corpus for how sub values are derived and how per-RP scoping changes the linkability picture.

**Updated trust configuration.** JWKS rotation, issuer pinning, and aud allowlists are enforced RP-side. Key discovery and rotation practice for JWKS URIs is documented against RFC 8414-style metadata [8] (weak backing, 0.41); the rotation itself is what turns a "new issuer" from a config note into a security event.

## The four triggers

1. **Issuer URL migration.** An organization moves from a hosted provider to an IdP under its own domain. The discovery and JWKS endpoints change; everything downstream re-federates.
2. **Org merge.** Two organizations consolidate around one IdP. Every RP that trusted either organization's issuer now faces two issuers where policy expects one.
3. **IdP deprecation.** A vendor end-of-life forces users to re-federate to a replacement. Migration guidance for the AD FS-to-Entra case sequences the work and decommissions the old IdP "only [when] all relying party trusts have been migrated or retired" [9] (weak backing, 0.29).
4. **Trust revocation.** A security incident at the old IdP makes the new trust a precaution or a transition-window overlay.

## Why refederation is server-side and silent for users

Refederation is an event at the IdP and a configuration event at the RP. End users and workloads do not generate a new credential; they receive a token from the new issuer. Discovery-based clients pick up the new endpoints and keys without a redeployment [5] (weak backing, 0.50), which is exactly why a refederation can be silent at the UI layer while being loud at the verification layer: trust lists, issuer allowlists, and sub-continuity assumptions all have to be updated by hand somewhere.

## Sources

All weights from the jev noul weighting of this corpus's dig.

1. OpenID Connect Discovery 1.0 (final, errata set 2), https://openid.net/specs/openid-connect-discovery-1_0.html (0.81)
2. OpenID Connect (OIDC) on the Microsoft identity platform, https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc (0.91)
3. How OpenID Connect Works, OpenID Foundation, https://openid.net/developers/how-connect-works/ (0.91)
4. OIDC Discovery and JWKS Endpoints Explained, theidentity.cloud, https://theidentity.cloud/oidc-discovery-and-jwks-endpoints-explained (0.17, weak)
5. OpenID Connect Discovery, About Auth, https://aboutauth.com/docs/learn/oidc/openid-connect-discovery/ (0.50, weak)
6. Set up claims mapping for OIDC, Microsoft Entra External ID, https://learn.microsoft.com/en-us/entra/external-id/customers/reference-oidc-claims-mapping-customers (0.78)
7. Map, customize, and transform claims in ASP.NET Core, https://learn.microsoft.com/en-us/aspnet/core/security/authentication/claims?view=aspnetcore-10.0 (0.56)
8. jwks_uri: Key Discovery, Rotation, and Caching, https://ashishsrivastav.com/blog/rfc-8414-jwks-uri-key-discovery-rotation-caching (0.41, weak)
9. Migrating from AD FS to Azure AD SSO, https://www.windows-active-directory.com/migrating-from-ad-fs-to-azure-ad-sso.html (0.29, weak)
