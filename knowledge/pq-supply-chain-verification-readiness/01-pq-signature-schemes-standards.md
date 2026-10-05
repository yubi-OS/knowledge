# 01 - PQ signature schemes and their standards status

Scope: Standardized post-quantum signature algorithms (ML-DSA FIPS 204, SLH-DSA FIPS 205, FN-DSA, XMSS/LMS) and their properties relevant to signing software artifacts.

## ML-DSA is the load-bearing algorithm for artifact signing

FIPS 204, Module-Lattice-Based Digital Signature Standard, specifies ML-DSA, a set of algorithms used to generate and verify digital signatures, and NIST states ML-DSA is believed to be secure even against adversaries in possession of a large-scale quantum computer (source: https://csrc.nist.gov/pubs/fips/204/final, weight 0.96; full standard: https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.204.pdf, weight 0.94). The standard was finalized on August 13, 2024 (source: https://csrc.nist.gov/pubs/fips/204/final, weight 0.96).

ML-DSA is the algorithm the Sigstore project chose as its post-quantum target, explicitly over SLH-DSA, because of its smaller signature size (source: https://blog.sigstore.dev/post-quantum-2025/, weight 0.91). For supply-chain verification, that makes ML-DSA the algorithm most likely to appear in attestation chains first.

## SLH-DSA is the conservative fallback

FIPS 205, finalized August 13, 2024, specifies the stateless hash-based digital signature algorithm SLH-DSA, derived from SPHINCS+ (source: https://csrc.nist.gov/pubs/fips/205/final, weight 0.97; https://nvlpubs.nist.gov/nistpubs/fips/nist.fips.205.pdf, weight 0.90). SLH-DSA rests on hash-function security rather than lattice problems, which makes it the lower-assumption alternative if the lattice assumption underlying ML-DSA weakens.

An SLH-DSA signature is created by computing a randomized hash of the message, using part of the resulting digest to pseudorandomly select a FORS key, and signing the remaining digest part with that key (source: https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.205.ipd.pdf, weight 0.93). Its performance profile differs fundamentally from the lattice schemes: large signatures and deterministic but slow signing (source: https://arxiv.org/pdf/2603.19340, weight 0.67).

## FN-DSA is still pending

NIST is developing a FIPS for a signature algorithm derived from FALCON as an additional alternative to ML-DSA and SLH-DSA (source: https://csrc.nist.gov/Projects/Digital-Signatures, weight 0.95). Until that FIPS is final, supply-chain designs should not build FN-DSA dependencies; the deployed-ready pair is ML-DSA plus SLH-DSA.

## What this means for verification chains

The relevant readiness question for a supply-chain pipeline is not whether PQ signatures exist, but whether the artifact-signing stack has picked one and can verify it end to end. The standards themselves are settled for two families: ML-DSA (lattice, small signatures, fast) and SLH-DSA (hash-based, conservative). Everything downstream, Sigstore support, SLSA provenance signing, cosign verification, needs to name one of these two, and the remainder of this corpus tracks exactly that.

Claims in this doc rest on NIST primary sources at weight 0.90 or higher throughout.
