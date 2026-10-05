# Trust Model and Design Constraints for Privacy-Preserving Multi-Federation

Scope: the privacy-preserving multi-federation trust model as an auditable constraint set: N independent IdPs, one-IdP-per-RP binding, per-RP sub issuance, RP storage of pseudonymous IDs only, plus the MUST, MUST NOT, and NEVER bans on shared identifiers and composite identities.

## The component model

The trust model has four components:

1. The user or workload holds N identity credentials from N independent IdPs with independent trust roots.
2. Each RP is bound to one specific IdP or a small allowlist, never "any IdP that says yes".
3. The IdP issues tokens with per-RP sub (pairwise subject) and per-transaction claim scoping.
4. The RP stores only the pairwise pseudonymous ID, never an email and never a long-lived subject.

Every component maps to a shipped mechanism documented elsewhere in this corpus: pairwise subject registration via the subject_type client metadata parameter [1], salt-driven per-client identifier derivation [2], sector identifiers for grouped clients [3], and SD-JWT selective disclosure now published as RFC 9901 [4].

## The properties the model buys

- **No global stable identifier.** Even if one IdP is compromised, the attacker learns one (user, RP) pair, not the user's full activity graph. This is the property the UnlimitID line of work demonstrates is achievable with "multiple persistent and unlinkable pseudo-identities" [5].
- **No correlation across RPs**, because sub is per-RP and IdPs do not share logs. The OPRF-based federated-authentication protocol shows the same design goal formalized: duplicate detection "without revealing users' personal data or enabling cross-domain correlation" [6].
- **Refederation is cheap.** If IdP A is compromised, the deployment rotates to IdP B without breaking continuity at the RP, because the RP's sub was already per-RP and can be re-issued.
- **Composability with short-lived signing identities.** Signing certs derived from per-RP OIDC tokens are themselves per-RP identities, and they are short-lived anyway, so the model composes with keyless signing.

## The constraint contract

These rules promote the model from design intent to an auditable contract. They are research-level guidance derived from the mechanisms cited above; deployment-specific questions (lost-IdP recovery, key escrow, compelled disclosure) depend on jurisdiction and threat model and are out of scope here.

**MUST, required for any deployment claiming privacy preservation:**

- Each RP MUST be bound to exactly one IdP (or a small allowlist), never "any IdP that says yes". This is the isolation mitigation for the federation blast-radius problem: "Don't chain high-value services to a single IdP without compensating controls" [7] (weak backing, 0.15).
- The IdP MUST issue per-RP sub, pairwise-style [1] [2].
- The IdP MUST scope claims per transaction; no persistent cross-transaction claim reuse. SD-JWT is the claims-disclosure mechanism [4]; ephemeral subject identifiers are the identifier-side equivalent.
- The RP MUST store only the pairwise pseudonymous ID, never the IdP's persistent user identifier.

**MUST NOT, explicit bans derived from the failure modes:**

- An identity MUST NOT be reused across IdPs: no shared email, no shared national identifier. Email claims are not stable proof of identity and create impersonation risk across tenants [8] (weak backing, 0.08).
- The RP MUST NOT log timing, IP, or user-agent metadata that would let IdPs correlate logins. Attribute mapping and cross-domain channels are documented federation risk surfaces [9] (weak backing, 0.44).
- Composite attestations MUST NOT be treated as a primary identifier.

**NEVER, hard bans:**

- NEVER share RP-IdP binding metadata with other RPs.
- NEVER derive a global user identity by composing multiple IdP attestations.
- NEVER use a long-lived workload cert where a per-event short-lived cert is feasible. Short-lived certificate issuance (10-minute Fulcio certs, for example) is the established pattern [10].

## Zero Trust framing

The model is consistent with zero-trust identity practice, which treats identity as the first pillar and recognizes that identity estates fragment across "various identity providers, a lack of single sign-on (SSO) between cloud and on-premises apps, and limited visibility into identity risk" [11]. A deliberately plural IdP estate with per-RP binding is the managed version of that fragmentation, with the correlation channels closed by contract rather than by accident.

## Sources

All weights from the jev noul weighting of this corpus's dig.

1. Pairwise subject IDs, Connect2id docs, https://connect2id.com/products/server/docs/guides/pairwise-subject-identifiers (0.81)
2. Subject anonymization, Ory Hydra docs, https://www.ory.com/docs/hydra/guides/openid (0.82)
3. Sector Identifiers, Janssen Documentation, https://docs.jans.io/v2.4.0/janssen-server/auth-server/client-management/sector-identifiers/ (0.69)
4. RFC 9901 - Selective Disclosure for JSON Web Tokens, https://datatracker.ietf.org/doc/draft-ietf-oauth-selective-disclosure-jwt/ (0.93)
5. UnlimitID: Privacy-Preserving Federated Identity Management using Algebraic MACs, https://discovery.ucl.ac.uk/id/eprint/1532685/1/p139-isaakidis.pdf (0.80)
6. A Privacy-Preserving Information-Sharing Protocol for Federated Authentication, https://arxiv.org/pdf/2512.01832 (0.77)
7. Sign In With Google: The Hidden Risks of Identity Federation, exchangepedia.com, https://exchangepedia.com/2026/05/sign-in-with-google-identity-federation-risks.html (0.15, weak)
8. Why do email claims create identity risk in federated SaaS environments?, nhimg.org, https://nhimg.org/faq/why-do-email-claims-create-identity-risk-in-federated-saas-environments/ (0.08, weak)
9. Identity Federation Security: Trust, Attribute Mapping, and Cross-Domain Risks, https://www.systemshardening.com/articles/cross-cutting/identity-federation-security/ (0.44, weak)
10. sigstore/fulcio repository README, https://github.com/sigstore/fulcio (0.92)
11. Identity, the first pillar of a Zero Trust security architecture, https://learn.microsoft.com/en-us/security/zero-trust/deploy/identity (0.84)
