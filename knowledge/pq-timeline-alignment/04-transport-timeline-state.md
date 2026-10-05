# 04 - Transport timeline state

Scope: current state of the PQ transport timeline: OpenSSL 3.5 native ML-KEM, Go X25519MLKEM768 defaults, large-scale deployments like Cloudflare.

## The transport timeline is the furthest along

Of the three PQ timelines an OS project tracks, transport is the one with shipped, upstreamed, default-on support. The evidence clusters around three products: OpenSSL, Go, and large CDN operators.

## OpenSSL 3.5

OpenSSL 3.5 is a long term stable release, published April 8, 2025, with LTS support until April 8, 2030 (https://openssl-library.org/post/2025-04-08-openssl-35-final-release/, weight 0.23, weak backing per the weighting model despite being the official release note). The feature set is corroborated by a distribution vendor: the Red Hat Enterprise Linux 10.1 release notes state that "OpenSSL 3.5 introduces support for the ML-KEM, ML-DSA, and SLH-DSA post-quantum algorithms and adds the hybrid ML-KEM algorithms to the default" TLS configuration (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/10.1_release_notes/overview, weight 0.95). That single sentence covers both the key-exchange and signature primitives at the library level.

Deployment-level writeups agree on the version semantics: OpenSSL 3.5 (April 2025) ships ML-KEM as a built-in provider, the first production-ready release for PQC TLS without patching, with a deployment guide covering NGINX and HAProxy rollout (https://www.systemshardening.com/articles/network/tls-post-quantum-hybrid-deployment/, weight 0.38, weak backing). A wiki reference states that OpenSSL added native ML-KEM, ML-DSA, and SLH-DSA support in 3.5 and enabled hybrid post-quantum TLS key exchange (https://postquantum.wiki/openssl-pqc, weight 0.29, weak backing).

The default-behavior change is the detail that matters for sequencing. A release analysis reports that OpenSSL 3.5 changed default TLS behavior: the default supported groups list now includes and prefers hybrid PQC key encapsulation, with X25519MLKEM768 and X25519 as default keyshares (https://postquantum.com/security-pqc/openssl-3-5-pqc-default/, weight 0.18, weak backing). If the defaults prefer the hybrid group, a distribution that simply links against OpenSSL 3.5 and does not override groups gets PQ-hybrid key exchange without explicit work, which is exactly the kind of silent upstream signal a sequencer must watch.

## Go

The Go runtime carried the same group into a programming language standard library. A technical writeup states that since Go 1.24, a default tls.Config negotiates X25519MLKEM768, the hybrid of classical X25519 and the ML-KEM algorithm from FIPS 203, and frames the motivation as protecting today's traffic against harvest now, decrypt later (https://sslboard.com/blog/go-post-quantum-tls-mlkem.md/, weight 0.43, weak backing). A second practitioner post confirms the shape: Go 1.24+ ships built-in hybrid post-quantum key exchange, so upgrading a server requires minimal code changes (https://blog.vitalvas.com/post/2026/02/25/post-quantum-https-server-on-golang/, weight 0.18, weak backing).

The honest weighting note: the dig for this subtopic did not surface the Go project's own release notes as a scored source. Both Go claims rest on secondary sources at weights below 0.5, so they should be verified against the Go 1.24 release notes before being used as a planning commitment.

## Cross-ecosystem deployment

A reference page for the hybrid group summarizes its deployment footprint: RFC 10024 standardizes the hybrid groups X25519MLKEM768, SecP256r1MLKEM768, and SecP384r1MLKEM1024, and X25519MLKEM768 is the default post-quantum key exchange in Chrome, Firefox, Safari, Cloudflare, OpenSSL 3.5+, and Go (https://pqaudit.org/algorithms/hybrid-tls-x25519mlkem768/, weight 0.47, weak backing). A general TLS reference page frames post-quantum key exchange as closing the recording window: it does not depend on quantum computers existing yet, it protects today's traffic against tomorrow's decryption (https://goodtls.com/post-quantum-tls, weight 0.37, weak backing).

## What the state implies for sequencing

Three consequences follow. First, the transport timeline needs no standards waiting: the RFC exists, the libraries exist, and defaults are already flipped in at least one LTS library and one language runtime. Second, the gating question for an OS project is not availability but integration: when does the distro's OpenSSL and the language runtimes it ships all default to the hybrid group, and what happens to clients pinned to classical-only negotiation. Third, because transport is ahead while signing and verification are behind, shipping the transport timeline first creates a partial PQ state whose risks are covered in doc 09. A deployment guide's rollback-strategy emphasis (https://www.systemshardening.com/articles/network/tls-post-quantum-hybrid-deployment/, weight 0.38, weak backing) is a reminder that even the mature timeline needs an exit path during the hybrid period.
