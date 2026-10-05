# 06 - Harvest now, forge later: why signatures are not the HNDL problem

Scope: Why signed artifacts differ from encrypted traffic under harvest-now-decrypt-later: verification shelf life and the forgery-later threat model.

## The HNDL framing everyone knows

Harvest now, decrypt later describes an attacker recording encrypted traffic today and storing it until a cryptographically relevant quantum computer can break the classical key exchange protecting it (source: https://securityboulevard.com/2026/10/harvest-now-decrypt-later-the-attack-you-defend-against-by-doing-nothing/, weight 0.26, weak backing; the (ISC)2 treatment covers the same dynamic: attackers collecting encrypted data today to decrypt in the future, source: https://www.isc2.org/Insights/2026/05/harvest-now-decrypt-later, weight 0.63). A Federal Reserve research note examines the pattern for distributed ledgers: an adversary can obtain a ledger replica, harvest the data, and reveal previously confidential data once a sufficiently powerful quantum computer exists (source: https://www.federalreserve.gov/econres/feds/harvest-now-decrypt-later-examining-post-quantum-cryptography-and-the-data-privacy-risks-for-distributed-ledger-networks.htm, weight 0.94).

## The signature variant is worse, and it is the supply-chain one

The supply-chain-relevant twist is that signatures do not protect secrecy, so harvesting is unnecessary: the artifacts and their classical signatures are already public. One analysis names this explicitly as Trust Now, Forge Later, the darker twin of HNDL, a risk that could undermine digital trust, break supply chains, and endanger lives (source: https://postquantum.com/post-quantum/trust-now-forge-later/, weight 0.34, weak backing). The mechanism is straightforward and follows from HNDL itself: once a quantum computer can break ECDSA or RSA, any recorded classical signature can be forged, not merely read.

Peer-reviewed work connects this directly to CI/CD: emerging quantum computing capabilities threaten the long-term security of widely deployed public-key signatures such as RSA and ECDSA used to secure software supply chains that already suffer pervasive third-party dependency reuse and attacks on build systems and artifact distribution channels (source: https://ieeexplore.ieee.org/document/11500303, weight 0.86). The same study proposes deterministic artifact manifests combined with hybrid signatures integrating classical and post-quantum schemes based on CRYSTALS (source: https://www.researchgate.net/publication/401123787_Toward_Quantum-Resilient_Software_Supply_Chains_A_DevSecOps_Case_Study_with_Hybrid_Post-Quantum_Artifact_Signing, weight 0.58).

## What makes an artifact's signature long-lived

The exposure window for a signature equals how long verifiers will keep accepting that signature class, which is much longer than a TLS session. Signed artifacts replay forever: a container image pulled in 2026 and its ECDSA cosign signature can be verified for years. Recent research on hybrid post-quantum signatures for LLM model distribution makes the same argument for high-value artifacts at the model distribution stage (source: https://www.computer.org/csdl/proceedings-article/ids/2026/323800a008/2iPXztOIvpm, weight 0.78). One mapping of the problem space calls the signature supply chain the trust infrastructure of the digital world and its migration the most consequential engineering challenge of the PQC transition (source: https://postquantum.com/post-quantum/signature-supply-chain/, weight 0.40, weak backing).

## Readiness verdict

For attestation chains the asymmetry is the planning fact: TLS PQ migration protects future traffic, but artifact-signing PQ migration protects the verifiability of everything already published under classical signatures. Retroactive forgery of historical provenance, not decryption of historical traffic, is the failure mode a supply-chain readiness assessment must gate on, which is why the deprecation deadlines in doc 09 and the hybrid bridge in doc 05 apply with more urgency to signing than the transport timeline suggests.
