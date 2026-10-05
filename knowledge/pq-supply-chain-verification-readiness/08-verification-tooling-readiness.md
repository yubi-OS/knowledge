# 08 - Verification tooling readiness: Go, OpenSSL, liboqs

Scope: Verification tooling readiness: Go crypto, OpenSSL, liboqs, and client verifiers for ML-DSA and SLH-DSA.

## Go: ML-DSA has landed in the standard library

Go 1.26 added an internal implementation of the ML-DSA post-quantum signature algorithm specified in FIPS 204, and the proposal to expose it as a public crypto/mldsa package targets Go 1.27 (source: https://github.com/golang/go/issues/77626, weight 0.74). The Go 1.27 release notes confirm the landing: the new crypto/mldsa package implements the post-quantum ML-DSA signature scheme specified in FIPS 204, and crypto/x509 now supports ML-DSA private keys, public keys, and signatures (source: https://go.dev/doc/go1.27, weight 0.58). The published package documentation states the package implements the FIPS 204 scheme, with a caveat: the package is unavailable when using the FIPS 140-3 Go Cryptographic Module v1.0.0, in which case GenerateKey, NewPrivateKey, NewPublicKey, and Verify return an error (source: https://pkg.go.dev/crypto/mldsa, weight 0.65).

Two follow-on facts matter for supply-chain tooling. First, the X.509 support means certificate-based signing identities can carry ML-DSA without leaving the standard library. Second, the FIPS module exclusion means strict FIPS 140-3 deployments must track module versioning, not just Go versions. Community work extends the standard implementation with multi-architecture SIMD optimizations (source: https://pkg.go.dev/github.com/emmansun/gmsm/mldsa, weight 0.57).

## OpenSSL: ML-DSA in the EVP layer

OpenSSL documentation for the ML-DSA EVP layer states that the ML-DSA-44, ML-DSA-65, and ML-DSA-87 EVP_PKEY implementations support key generation and one-shot sign and verify using the FIPS 204 schemes (source: https://docs.openssl.org/master/man7/EVP_SIGNATURE-ML-DSA/, weight 0.91). That is the full parameter-set coverage, exposed through the same EVP interface classical verifiers already use, which is the compatibility property that lets verification pipelines adopt PQ signatures with minimal rearchitecture.

## liboqs: reference-quality coverage of both families

Open Quantum Safe documents ML-DSA as a supported digital signature scheme in liboqs, based on the hardness of lattice problems over module lattices (source: https://openquantumsafe.org/liboqs/algorithms/sig/ml-dsa.html, weight 0.82). The project provides example signing and verification code for prototyping quantum-resistant cryptography (source: https://openquantumsafe.org/liboqs/examples/sig.html, weight 0.77). liboqs remains the prototyping and integration path for languages and stacks without native support.

## What this means for verification chains

The primitive layer is ready: a verifier in Go 1.27+ can validate ML-DSA signatures and ML-DSA X.509 certificates from the standard library, OpenSSL exposes all three ML-DSA parameter sets, and liboqs covers prototyping needs. The gap sits one layer up: application verifiers (cosign, SLSA verifiers, attestation validators) decide which algorithms to accept, and per doc 02 Sigstore has ML-DSA in its protobuf spec but not yet in generally available verification flows. The readiness move is therefore plumbing, not cryptography: wire the accepted-algorithm list of your verifier into a configurable trust bundle so that ML-DSA verification turns on when the signing side does.
