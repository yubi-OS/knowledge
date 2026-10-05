# 09 - Migration timelines and governance pressure

Scope: Government and industry migration timelines (CNSA 2.0, NIST IR 8547, EU guidance) that gate supply-chain PQ signature moves.

## NIST IR 8547: the deprecation schedule

NIST IR 8547, Transition to Post-Quantum Cryptography Standards (initial public draft), describes NIST's expected approach to transitioning from quantum-vulnerable cryptographic algorithms to post-quantum digital signature algorithms and key-establishment schemes, and identifies the quantum-resistant standards that products and services will need to transition to (source: https://csrc.nist.gov/pubs/ir/8547/ipd, weight 0.88; full draft PDF: https://nvlpubs.nist.gov/nistpubs/ir/2024/NIST.IR.8547.ipd.pdf, weight 0.98).

The draft anchors the vulnerable inventory precisely: the current revision of FIPS 186 specifies ECDSA, and NIST adopts the RSA algorithm specified in RFC 8017 and PKCS 1 (version 1.5 and higher) and EdDSA specified in RFC 8032 (source: https://nvlpubs.nist.gov/nistpubs/ir/2024/NIST.IR.8547.ipd.pdf, weight 0.98). Every algorithm named there is the signing basis of today's supply-chain tooling.

Secondary coverage of the draft's schedule: it converts what had been a general migration aspiration into hard calendar deadlines for RSA, ECDSA, ECDH, and finite-field Diffie-Hellman (source: https://qsentinel.com/knowledge-base/post-quantum/nist-ir-8547-algorithm-deprecation-timeline-what-sovereign-operators-must-do-now/, weight 0.14, weak backing), and one analysis reports a proposed 2030 deprecation date with a June 2026 executive-order update treating that date as a compliance deadline for federal high-value assets and high-impact systems (source: https://postquantum.com/security-pqc/nist-ir-8547-ipd/, weight 0.28, weak backing; the compliance framing needs verification against the executive order text before use).

## CNSA 2.0: the procurement gate

The NSA's CNSA 2.0 suite mandates ML-KEM-1024, ML-DSA-87, LMS/XMSS for firmware signing, AES-256, and SHA-384/512, with a phased timeline ending in exclusive post-quantum use by 2035, and from January 1, 2027 all new National Security System acquisitions must be CNSA 2.0 compliant (source: https://pqaudit.org/timelines/cnsa-2-0/, weight 0.26, weak backing; aggregator, but the 2027 acquisition gate recurs across sources). A separate analysis states the earliest deadlines apply to software signing and firmware signing, with CNSA 2.0 algorithms required to be supported and preferred for software and firmware delivered to NSS by 2025 and full transition by 2030 (source: https://quantumsequrity.com/blog/cnsa-2-0-timeline-detailed, weight 0.10, weak backing). A compliance guide puts category-specific transition deadlines from January 1, 2027 for software and firmware signing to January 1, 2035 for full enterprise rollover (source: https://www.cyphrs.ai/guides/cnsa-2-compliance-guide/, weight 0.30, weak backing).

Read together, the weakly-weighted sources converge on the same shape: software and firmware signing is the earliest CNSA 2.0 deadline category, which is exactly the supply-chain verification layer. Treat the specific dates as needing confirmation against NSA's own CNSA 2.0 FAQ, but the ordering (signing first) is consistent.

## The migration machinery exists

NIST's National Cybersecurity Center of Excellence runs a Migration to Post-Quantum Cryptography project working with industry, academia, and federal partners to accelerate the shift by demonstrating tools to find and prioritize vulnerable systems, supporting interoperable solutions, and developing migration guidance (source: https://csrc.nist.gov/projects/post-quantum-cryptography, weight 0.96). That is the official discovery-and-prioritization machinery a supply-chain owner plugs into.

## Readiness verdict

The governance timeline does not wait for tooling availability: the federal deprecation schedule (IR 8547) targets the exact algorithms supply-chain signatures use today, and the CNSA 2.0 procurement gate lands on software and firmware signing first. For an attestation chain this produces the concrete sequencing question already raised in the source record: when the Go toolchain and transport layer reach PQ, the signing keys, attestation formats, and verification tooling must be assessed in parallel, because the trust chain fails at its weakest link, and the weakest link is whichever component still verifies with ECDSA in 2030.
