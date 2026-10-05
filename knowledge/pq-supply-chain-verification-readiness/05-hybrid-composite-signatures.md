# 05 - Hybrid and composite signatures as the migration bridge

Scope: Composite and hybrid signature schemes (draft-ietf-lamps, composite ML-DSA) as the migration bridge for attestation chains.

## The IETF composite draft is the concrete standardization vehicle

The IETF LAMPS working group draft draft-ietf-lamps-pq-composite-sigs defines combinations of ML-DSA in hybrid with traditional algorithms: RSASSA-PKCS1-v1.5, RSASSA-PSS, ECDSA, Ed25519, and Ed448, with combinations tailored to meet regulatory guidelines in certain regions (source: https://datatracker.ietf.org/doc/draft-ietf-lamps-pq-composite-sigs/, weight 0.75; draft -19 text: https://datatracker.ietf.org/doc/html/draft-ietf-lamps-pq-composite-sigs-19, weight 0.92). Composite ML-DSA applies to X.509, PKIX, and CMS data structures that accept ML-DSA (source: https://www.ietf.org/archive/id/draft-ietf-lamps-pq-composite-sigs-04.html, weight 0.84).

The draft's motivation is explicit about the window: traditional signature algorithms such as RSA, DSA, and their elliptic curve variants will become vulnerable to quantum attacks, and this migration, unlike previous algorithm migrations, gives us the foresight to prepare (source: https://github.com/lamps-wg/draft-composite-sigs/blob/main/draft-ietf-lamps-pq-composite-sigs.md, weight 0.80). The working-group repo tracks the X.509 composite keys and signatures work (source: https://github.com/lamps-wg/draft-composite-sigs, weight 0.54).

## Semantics: AND verification as the security posture

The design principle is that both component signatures must verify: a browser-based PQ/T composite demo implements Ed25519 plus ML-DSA-65 per LAMPS draft-16 with the rule that both algorithms must verify, defending against either a lattice break or a quantum computer (source: https://systemslibrarian.github.io/crypto-lab-hybrid-sign/, weight 0.22, weak backing; a demo page, useful for semantics only).

The PQ Consortium's artifact-signing document discusses how new quantum-resistant signatures can be introduced in common artifact and firmware signing technologies, including introducing two signatures verified with AND logic for conservative security, and covers downgrade considerations when using multiple signatures for backwards compatibility (source: https://pqcc.org/artifact-signing-dual-post-quantum-traditional-hybrid-signatures-and-downgrades/, weight 0.46, weak backing; primary reference material, cross-check against the IETF draft before relying on specifics).

## Where hybrid fits in an attestation chain

Composite signatures standardize a single credential carrying both algorithms, aimed at X.509 and CMS. Dual signatures (two separate signature objects over one artifact) are the looser pattern that CI/CD systems can adopt without new certificate formats; hybrid certificates that combine classical and post-quantum algorithms in a single credential enable PKI migration without breaking existing systems (source: https://www.encryptionconsulting.com/hybrid-certificates-post-quantum-pki/, weight 0.37, weak backing).

For supply-chain verification the practical read: the composite draft gives a standards track for signing identities (Fulcio-style certificates) to carry both a classical and an ML-DSA signature in one structure, while attestation payloads such as DSSE can simply carry two signatures in parallel. Either way, verifiers must enforce the AND semantics; accepting either component alone restores the pre-quantum weakness.
