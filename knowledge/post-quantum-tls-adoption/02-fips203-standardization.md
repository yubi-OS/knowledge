# 02. ML-KEM standardization: FIPS 203 and what it settles

Scope: NIST standardization status of ML-KEM (FIPS 203), its parameter sets, why standardization risk is closed, and how FIPS 203 connects to the TLS hybrid groups.

## The standard

FIPS 203 is the Module-Lattice-Based Key-Encapsulation Mechanism Standard. It specifies a key encapsulation mechanism called ML-KEM: two parties run encapsulation and decapsulation to securely establish a shared secret, which is then used with symmetric-key algorithms for encryption and authentication (source: https://csrc.nist.gov/pubs/fips/203/final, weight 0.96; https://www.nist.gov/publications/module-lattice-based-key-encapsulation-mechanism-standard, weight 0.92). The scope of the standard is deliberately narrow: only the ML-KEM algorithms for key generation, encapsulation, and decapsulation, plus the associated parameter sets; general KEM properties were split out into SP 800-227 (source: https://csrc.nist.gov/pubs/fips/203/ipd, weight 0.95).

NIST announced approval of the first three post-quantum standards, FIPS 203, 204, and 205, in August 2024; FIPS 203 is derived from the CRYSTALS-KYBER submission to the NIST Post-Quantum Cryptography Standardization Project (source: https://www.nist.gov/news-events/news/2024/08/announcing-approval-three-federal-information-processing-standards-fips, weight 0.94). In other words, the KEM deployed in TLS as ML-KEM-768 is not a draft algorithm: it is a finalized federal standard with a published parameter family.

## Parameter sets and security basis

FIPS 203 specifies three parameter sets in order of increasing security strength and decreasing performance: ML-KEM-512, ML-KEM-768, and ML-KEM-1024 (source: https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.203.pdf, weight 0.92). The security of ML-KEM relates to the computational difficulty of the Module Learning With Errors problem, and at present ML-KEM is believed to be secure even against adversaries who possess a quantum computer (source: https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.203.ipd.pdf, weight 0.95).

## Why standardization risk is closed

For TLS migration planning the significance is procedural, not mathematical. Before August 2024, deploying Kyber meant betting on a candidate algorithm that could change. After the final FIPS 203 publication, the algorithm, its parameter sets, and its naming are fixed, and the TLS hybrid groups reference it directly: RFC 10024 normatively builds on ML-KEM as defined in FIPS 203 (source: https://datatracker.ietf.org/doc/draft-ietf-tls-ecdhe-mlkem/, weight 0.82). This is why every major deployment converged on the same construction rather than waiting for further revisions (source: https://pqaudit.org/algorithms/hybrid-tls-x25519mlkem768/, weight 0.53, weak-marginal backing).

FIPS publications carry statutory weight for US federal procurement: NIST develops FIPS publications when required by statute, which is what drives FIPS-provider support in OpenSSL and FIPS-mode allowances in Go crypto/tls (source: https://www.nist.gov/itl/fips-general-information, weight 0.85). The practical consequence for TLS-terminating infrastructure is that choosing X25519MLKEM768 is no longer a research position, it is the standards-track default with a settled algorithm underneath.
## From candidate to standard: what changed procedurally

Before the 2024 finals, a Kyber deployment carried two risks at once: an algorithm risk that the specification would change under it, and a governance risk that the selection outcome could shift. The August 2024 announcement closed both at once: NIST announced approval of the three standards derived from different submissions to its Post-Quantum Cryptography Standardization Project, with FIPS 203 specifying the Module-Lattice-Based Key-Encapsulation Mechanism Standard derived from CRYSTALS-KYBER (source: https://www.nist.gov/news-events/news/2024/08/announcing-approval-three-federal-information-processing-standards-fips, weight 0.94). The selection process that produced it ran for years and is the reason a single KEM family now anchors the TLS ecosystem.

## The parameter sets map directly onto TLS usage

FIPS 203 defines ML-KEM-512, ML-KEM-768, and ML-KEM-1024 (source: https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.203.pdf, weight 0.92), and the TLS hybrid groups consume exactly these levels: ML-KEM-768 paired with X25519 and the P-256 curve, ML-KEM-1024 paired with P-384 (source: https://www.rfc-editor.org/rfc/rfc10024.html, weight 0.91, group definitions). The middle parameter set is the internet's chosen default, a balance of security margin and handshake size that every major deployment converged on (source: https://pqaudit.org/algorithms/hybrid-tls-x25519mlkem768/, weight 0.53, marginal backing).

## Security basis

The security of ML-KEM relates to the computational difficulty of the Module Learning With Errors problem, and the standard states that at present ML-KEM is believed to be secure even against adversaries who possess a quantum computer (source: https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.203.ipd.pdf, weight 0.95). Note the careful phrasing: belief, not proof, which is precisely why the TLS hybrids keep a classical component alongside the lattice one. The KEM abstraction itself is standard-shaped: encapsulation and decapsulation establish a shared secret that symmetric algorithms then use for encryption and authentication (source: https://csrc.nist.gov/pubs/fips/203/final, weight 0.96).

## What this means for compliance-driven migration

Because ML-KEM is a FIPS, it sits inside the US federal cryptographic framework: FIPS publications are developed when required by statute (source: https://www.nist.gov/itl/fips-general-information, weight 0.85), which is what made FIPS-provider support in OpenSSL 3.5 and FIPS-mode allowance in Go's crypto/tls possible at all. An infrastructure team that could not adopt a draft KEM in FIPS-bound environments can adopt ML-KEM-768 today. The open items that remain in the broader PQC program are signatures and hardware-token integration, not the TLS key exchange this corpus covers.
