# 01. X25519MLKEM768: the hybrid mechanism and RFC 10024

Scope: what X25519MLKEM768 is, the hybrid construction, the TLS 1.3 group identifiers, the draft to RFC timeline, and the HelloRetryRequest interaction.

## The construction

X25519MLKEM768 is a post-quantum/traditional (PQ/T) hybrid key agreement for TLS 1.3 that combines the classical X25519 ECDH exchange with the lattice-based ML-KEM-768 key encapsulation mechanism. RFC 10024, published August 10 2026, defines three such hybrid groups for TLS 1.3: X25519MLKEM768, SecP256r1MLKEM768, and SecP384r1MLKEM1024, each combining post-quantum ML-KEM with an ECDHE exchange (source: https://www.rfc-editor.org/rfc/rfc10024.html, weight 0.91; https://www.rfc-editor.org/info/rfc10024/, weight 0.76). ML-KEM itself is the key encapsulation mechanism standardized in NIST FIPS 203 (source: https://datatracker.ietf.org/doc/draft-ietf-tls-ecdhe-mlkem/, weight 0.82).

The design intent of the hybrid is that the key exchange remains secure as long as at least one of the two constituents holds, so the classical ECDH component protects against implementation risk in the new lattice primitive and the ML-KEM component protects against a future quantum adversary (source: https://www.rfc-editor.org/rfc/rfc10024.html, weight 0.91). An independent practitioner summary describes X25519MLKEM768 as the default post-quantum key exchange in Chrome, Firefox, Safari, Cloudflare, OpenSSL 3.5+, and Go, and the most widely deployed post-quantum construction on the internet (source: https://pqaudit.org/algorithms/hybrid-tls-x25519mlkem768/, weight 0.53, just above the 0.5 threshold).

## Identifiers and history

During the draft phase the work was carried as draft-kwiatkowski-tls-ecdhe-mlkem, which at version 02 defined two hybrid groups, X25519MLKEM768 and SecP256r1MLKEM768 (source: https://www.ietf.org/archive/id/draft-kwiatkowski-tls-ecdhe-mlkem-02.html, weight 0.88; https://datatracker.ietf.org/doc/draft-kwiatkowski-tls-ecdhe-mlkem/02/, weight 0.95). The working-group track (draft-ietf-tls-ecdhe-mlkem) is what became RFC 10024, adding SecP384r1MLKEM1024 (source: https://datatracker.ietf.org/doc/draft-ietf-tls-ecdhe-mlkem/, weight 0.82). The draft repository lives in the IETF TLS working group GitHub organization (source: https://github.com/tlswg/tls-ecdhe-mlkem, weight 0.71).

The X25519MLKEM768 named group inherited deployment mindshare from the earlier X25519Kyber768Draft00 draft group, which used a different code point (0x6399) and was retired as the ML-KEM code points took over; Go 1.24 explicitly removed X25519Kyber768Draft00 when it added the ML-KEM groups (source: https://github.com/golang/go/issues/69985, weight 0.83). A related general-purpose construction, the X-Wing combined KEM built on X25519 and ML-KEM-768, was specified separately in the CFRG and shares the same algorithm pair (source: https://datatracker.ietf.org/doc/html/draft-connolly-cfrg-xwing-kem-10, weight 0.90).

## Wire behavior and HelloRetryRequest

A client that supports the hybrid announces the named group (X25519MLKEM768 or the legacy X25519Kyber768Draft00) in the supported_groups extension and sends a large hybrid key share alongside its classical X25519 key share. If the server speaks the hybrid group, the classical share is discarded unused; if it does not, the oversized hybrid share was generated for nothing and the handshake continues classically (source: https://www.netmeister.org/blog/tls-hybrid-kex.html, weight 0.77). This is the mechanism behind the double-round-trip HelloRetryRequest penalty described in the adoption and measurement docs of this corpus.

A background explainer of the same group's standardization path is maintained at postquantumsecurity.org (source: https://www.postquantumsecurity.org/publications/X25519+MLKEM768.html, weight 0.78).
## Why the hybrid pairs exactly these algorithms

The choice of X25519 as the classical partner is not incidental. X25519 is the ubiquitous TLS 1.3 default curve, so a hybrid built on it can ride the existing deployment base and preference order rather than asking operators to reprioritize an exotic curve. The same logic produced the NIST-curve variants SecP256r1MLKEM768 and SecP384r1MLKEM1024 for environments whose policy or FIPS posture requires NIST curves (source: https://www.rfc-editor.org/rfc/rfc10024.html, weight 0.91). The X-Wing CFRG document makes the pairing logic explicit for the non-TLS case: X-Wing is a general-purpose PQ/T hybrid KEM built on X25519 and ML-KEM-768 (source: https://datatracker.ietf.org/doc/html/draft-connolly-cfrg-xwing-kem-10, weight 0.90).

The naming itself is informative. RFC 10024 notes the group name X25519MLKEM768 does not adhere to the naming convention for TLS groups, an artifact of the draft era when the group shipped under its eventual name and the convention arrived around it (source: https://www.rfc-editor.org/info/rfc10024/, weight 0.76).

## What the spec guarantees on the wire

Three properties matter for operators. First, the group is negotiated like any other named group: it appears in supported_groups and, when chosen in the first flight, its key share rides in the ClientHello key_share extension with no extra round trip (source: https://www.netmeister.org/blog/tls-hybrid-kex.html, weight 0.77). Second, when the server does not support the group the handshake degrades to the classical path with no protocol failure, which is why PQ-preferred deployment is safe to enable broadly. Third, the security argument is compositional: the combination is intended to remain secure while at least one component remains secure, so a break in ML-KEM does not strip the classical protection and a quantum break of X25519 does not strip the lattice protection (source: https://www.rfc-editor.org/rfc/rfc10024.html, weight 0.91).

## Deployment position

Because OpenSSL 3.5+ and Go 1.24+ enable the group by default and the major browsers ship it, the group is no longer a specialist choice. One independent summary puts it as the default post-quantum key exchange across Chrome, Firefox, Safari, Cloudflare, OpenSSL 3.5+, and Go (source: https://pqaudit.org/algorithms/hybrid-tls-x25519mlkem768/, weight 0.53, just above threshold). For a TLS-terminating service the question is not whether to adopt X25519MLKEM768 but whether any leg of the connection, most often the origin leg, still negotiates only classical groups, which the remaining docs in this corpus address.
