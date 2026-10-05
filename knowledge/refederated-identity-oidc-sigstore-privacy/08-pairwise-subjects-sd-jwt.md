# Pairwise Subject Identifiers and SD-JWT

Scope: the primitives of the strongest anonymity scheme: pairwise per-audience subject identifiers salted with a user secret, SD-JWT selective disclosure of only the claims an RP needs, and per-transaction claim scoping that defeats replay.

## Public versus pairwise subject identifiers

OpenID Connect defines two subject identifier types. The Connect2id server documentation states the registration mechanic: "A relying party will receive pairwise subject IDs when it's registered with the subject_type client metadata parameter set to pairwise. This parameter is optional and when it's omitted the default action is to register the relying party for plain (public) IDs" [1]. The aboutauth explainer adds the stability property: "the sub (subject) claim in the ID Token acts as the unique identifier for the End-User. Unlike the email claim, which can change, the sub is intended to be stable and locally unique" [2].

The standard itself acknowledges the tracking implication: the OpenID Connect Ephemeral Subject Identifier 1.0 draft notes that public and pairwise subject identifier types "allow relying parties to keep track of the End-User across multiple visits to the relying party application by correlating the subject identifier" [3]. Pairwise identifiers exist precisely to bound that correlation to one RP.

## The salt is the mechanism

Ory's Hydra documentation makes the salt dependency explicit: "When you change the salt, all client applications receive new user IDs from Ory. This can cause serious complications with authentication in your system. Each OAuth 2.0 client has a subject_type configuration field that can take a public or pairwise value" [4]. The pairwise sub is a function of the user and a salt, so rotating the salt rotates every pairwise identifier at once. Sector identifiers generalize the same derivation across groups of clients under one control: how "the sector identifier value is used to derive value for the pairwise subject identifier is detailed in the OIDC core specification" [5].

## Ephemeral subjects for per-transaction scoping

Beyond pairwise, the OpenID Connect Ephemeral Subject Identifier 1.0 draft (Draft 03) defines subject identifiers that are not stable at all, targeting the case where even per-RP persistence is more linkage than the deployment wants [3]. Combined with per-transaction claim expiry, this is the primitive behind "verifiable claims tied only to the specific transaction": a replayed identifier from an earlier transaction fails because the identifier is no longer derivable.

## SD-JWT: selective disclosure of claims

The selective disclosure mechanism is now an RFC. RFC 9901, "Selective Disclosure for JSON Web Tokens", was published as an Internet Standards Track document on 2026-05-20 [6]. The specification "defines a mechanism for the selective disclosure of individual elements of a JSON data structure used as the payload of a JSON Web Signature (JWS). The primary use case is the selective disclosure of JSON Web Token (JWT) claims" [7]. The working-group repository for the draft is the oauth-wg/oauth-selective-disclosure-jwt repo [8], and the draft's development history runs from the individual draft (draft-fett-oauth-selective-disclosure-jwt) through the working-group drafts [9] (weak backing, 0.21).

## How the pieces compose

The strongest scheme composes these primitives:

1. **Pairwise sub per audience**, derived with a salt the IdP holds [1] [4], so two RPs receive two different sub values for the same person and neither can derive the other's.
2. **Selective disclosure** via SD-JWT [6] [7], so the RP receives only the claims it needs (for example an over-18 boolean rather than a birthdate).
3. **Per-transaction scoping** via ephemeral subject identifiers [3], so claims cannot be replayed across transactions.
4. **No shared persistent identifier**, because the persistent identifier lives only at the IdP.

The same composition applies to workload identities: a per-RP workload identity with claims scoped to the specific signing event leaks less than a long-lived workload identity reused across many operations.

## Sources

All weights from the jev noul weighting of this corpus's dig.

1. Pairwise subject IDs, Connect2id docs, https://connect2id.com/products/server/docs/guides/pairwise-subject-identifiers (0.81)
2. OpenID Connect Public and Pairwise Subject Identifier Types, aboutauth.com, https://aboutauth.com/docs/learn/oidc/public-and-pairwise-sub-identifiers/ (0.72)
3. OpenID Connect Ephemeral Subject Identifier 1.0 - Draft 03, https://openid.net/specs/openid-connect-ephemeral-subject-identifier-1_0.html (0.90)
4. Subject anonymization, Ory Hydra docs, https://www.ory.com/docs/hydra/guides/openid (0.82)
5. Sector Identifiers, Janssen Documentation, https://docs.jans.io/v2.4.0/janssen-server/auth-server/client-management/sector-identifiers/ (0.69)
6. RFC 9901 - Selective Disclosure for JSON Web Tokens, IETF Datatracker, https://datatracker.ietf.org/doc/draft-ietf-oauth-selective-disclosure-jwt/ (0.93)
7. Selective Disclosure for JWTs (SD-JWT), draft 21, https://www.ietf.org/archive/id/draft-ietf-oauth-selective-disclosure-jwt-21.html (0.84)
8. oauth-wg/oauth-selective-disclosure-jwt, GitHub, https://github.com/oauth-wg/oauth-selective-disclosure-jwt (0.50, weak)
9. draft-fett-oauth-selective-disclosure-jwt-02, IETF Datatracker, https://datatracker.ietf.org/doc/html/draft-fett-oauth-selective-disclosure-jwt (0.21, weak)
