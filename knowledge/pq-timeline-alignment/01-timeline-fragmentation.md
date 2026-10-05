# 01 - Timeline fragmentation

Scope: why post-quantum migration splits into independent transport, signature, and verification timelines and why their convergence is the real ship gate.

## Migration is not one migration

A post-quantum migration is often described as replacing one classical algorithm with one quantum-resistant algorithm. The research literature rejects that framing. A systematization of hybrid TLS handshakes argues that "TLS distributes security across key establishment, authentication, resumption and pre-shared key" modes, so migrating TLS means touching several independent mechanisms, not one (https://eprint.iacr.org/2026/1703, weight 0.83). Enterprise migration research reaches the same structural conclusion at the organizational level: post-quantum cryptography migration "is a complex, multi-year undertaking" that cannot be treated as a single cutover event (https://www.mdpi.com/2073-431X/15/1/9, weight 0.89).

This produces the fragmentation that any OS project must plan around. At minimum the work separates into:

1. Transport: the key-exchange path. Hybrid TLS 1.3 groups, cipher configuration, and proxy or CDN compatibility. A dedicated TLS migration guide treats certificate algorithm migration from RSA toward ML-DSA as its own workstream with its own performance, client-compatibility, and rollback concerns, separate from key-exchange changes (https://www.qcecuring.com/blog/pqc-migration-for-tls-infrastructure, weight 0.59).
2. Signatures: the signing path. Code signing, provenance attestations, and hardware roots of trust all move to ML-DSA class algorithms on their own schedule, gated by different toolchains than TLS libraries.
3. Verification: the verifying path. Verifier tooling must learn each new signature algorithm before signed artifacts using it can be trusted downstream.

## Why the timelines do not move together

The three timelines are driven by different upstream communities. Transport moves with TLS library and runtime releases; signatures move with signing tool and hardware-firmware vendors; verification moves with verifier and provenance-framework projects. A crypto-agility survey organized around how "current security protocols can be adapted" treats protocol adaptation as a distinct research and engineering concern from algorithm selection itself (https://pqc-cma.gitlab.io/cma/docs/agility/agility/, weight 0.66). Because the communities, release cadences, and risk tolerances differ, the timelines drift apart even when every participant intends to converge.

Practitioner commentary makes the same point in operational terms. Commentary aimed at 2026 planning states plainly that "key agreement and signatures are separate problems with separate timelines" (https://maxine.boppers.net/2026/08/02/the-post-quantum-migration-in-2026-tls-crosses-the-threshold/, weight 0.13, weak backing). An enterprise roadmap document built for managed-service deployment similarly organizes the work into discovery, prioritization, and crypto-agility phases rather than one program (https://layerlogix.com/blog/post-quantum-cryptography-migration-roadmap-2026, weight 0.21, weak backing). These are secondary sources and the weight reflects that, but they are consistent with the primary literature above.

## The convergence gap as a ship gate

The fragmentation has a sharp operational consequence. An OS image can ship PQ-hybrid TLS (timeline 1 complete) while its artifact chain is still entirely classical (timelines 2 and 3 incomplete). In that state the transport is quantum-resistant but the provenance chain is not: an adversary who can forge classical signatures can substitute malicious artifacts even though the TLS connection used ML-KEM. Legacy systems are specifically noted as the class of system that struggles to absorb cryptographic change, which is why the gap persists rather than closing on its own (https://thequantuminsider.com/2026/07/31/why-crypto-agility-matters-for-post-quantum-cryptography-migration/, weight 0.61).

Checklist-oriented migration guidance reaches the same conclusion by enumeration: a migration checklist that covers TLS certificates, code signing keys, and application-layer encryption as separate line items is by construction tracking separate completion dates (https://www.decryptiondigest.com/blog/post-quantum-cryptography-migration-guide, weight 0.06, weak backing).

## What this means for planning

The planning implication is that "are we post-quantum yet" is the wrong question. The right question is per-timeline: for each of transport, signing, and verification, which upstream signal is pending, what does it gate, and what is the earliest date all three can be complete for a given artifact class. A program that ships timeline 1 alone has not reduced the relevant risk for supply-chain integrity; it has only moved the transport half. The convergence point, not the first PQ deployment, is the gate that matters for claiming a PQ-secure product.
