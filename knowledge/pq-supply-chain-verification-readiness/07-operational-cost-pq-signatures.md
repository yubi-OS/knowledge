# 07 - Operational cost of PQ signatures in verification pipelines

Scope: Operational impact of PQ signatures on verification pipelines: signature and key sizes, verification latency, registry and CI costs.

## Signature and key sizes are the first-order cost

Concrete ML-DSA-44 parameters from a practitioner guide: the private key is a compact 32-byte seed, the public key is 1,312 bytes, and signatures are 2,420 bytes (source: https://oxlib.sh/guides/crypto/ml-dsa, weight 0.27, weak backing; cross-check against FIPS 204 parameter tables before relying on exact byte counts). A 2026 comparison puts ML-DSA at 2.4 KB signatures versus 7.8 KB for SLH-DSA, a roughly 69 percent size difference, which is why Sigstore chose ML-DSA over SLH-DSA for smaller signature size (source: https://shattered.io/ml-dsa-vs-slh-dsa-2026/, weight 0.35, weak backing; corroborated by the Sigstore rationale itself: https://blog.sigstore.dev/post-quantum-2025/, weight 0.91).

Either way, a PQ signature is roughly 10 to 30 times the size of a 64 to 96 byte ECDSA signature, and attestation bundles that carry one signature per artifact per builder will see that multiplier directly in OCI registry objects and Rekor entries.

## Signing time is variable, not fixed

ML-DSA signing uses rejection sampling, which makes signing time a random variable rather than a constant. Measurements of the signing loop show a median of 3 iterations for ML-DSA-44 and ML-DSA-87 and 4 for ML-DSA-65, but a significant minority of signatures take 10 or more iterations, so a few slow outliers contribute disproportionately to the average (source: https://semiiphub.com/pulse/expert-perspectives/efficiently-measuring-ml-dsa-signing-performance, weight 0.25, weak backing). A dedicated benchmarking project exists precisely because accurate ML-DSA sign benchmarking is hard without huge test counts; it selects specific signing inputs (message, randomness input, secret key) that produce performance profiles close to average or a target percentile (source: https://github.com/zerorisc/mldsa-sign-bench, weight 0.73). A benchmarking guide covers the same rejection-sampling pitfall and best practices for measuring signing speed on constrained cryptographic modules (source: https://blog.amongbytes.com/posts/20260223-mldsa-benchmarking/20260223-mldsa-benchmarking.html, weight 0.44, weak backing).

Practical consequence for CI: budget signing latency with a tail (p99), not a mean, and do not place ML-DSA signing inside a timeout sized from a small sample of runs.

## Verification and platform differences

A peer-reviewed benchmark study on ARM hardware covers the two lattice standards (ML-KEM and ML-DSA) and explicitly separates SLH-DSA, noting the hash-based scheme has fundamentally different performance characteristics, large signatures and deterministic but slow signing, warranting a separate study (source: https://arxiv.org/pdf/2603.19340, weight 0.67). A third-party comparison reports verification performance is consistent across ML-DSA security levels, though slightly slower at higher levels, while signature generation is fastest at the lowest level (source: https://cryptodecoded.net/comparing-ml-dsa-87-vs-ml-dsa-65-vs-ml-dsa-44/, weight 0.39, weak backing).

## CI/CD integration cost

Research on integrating PQC into CI/CD pipelines covers code signing, artifact validation, and dependency management as the affected workflow stages, aligned with NIST standardization (source: https://computerfraudsecurity.com/index.php/journal/article/download/662/445/1266, weight 0.65). The DevSecOps case-study line of work (doc 06) likewise treats hybrid signing integration as a pipeline-level engineering task, not a library swap (source: https://ieeexplore.ieee.org/document/11500303, weight 0.86).

## Readiness verdict

The costs that will bite a supply-chain verification pipeline are: larger attestation objects everywhere signatures are stored, variable signing latency requiring tail-aware CI budgets, and a benchmarking methodology gap (rejection sampling) that makes naive performance tests misleading. Verification itself is comparatively cheap, which favors pushing PQ enforcement into verifiers early.
