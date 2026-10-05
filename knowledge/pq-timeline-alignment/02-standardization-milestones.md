# 02 - Standardization milestones

Scope: the NIST FIPS 203/204/205 and IETF milestone map: what became final when, and which RFCs and drafts define PQ TLS and PQ signatures.

## The NIST milestone: August 13, 2024

The anchoring milestone for the whole post-quantum field is the approval and publication of the first three FIPS. The Secretary of Commerce approved three Federal Information Processing Standards for post-quantum cryptography: FIPS 203, FIPS 204, and FIPS 205 (https://csrc.nist.gov/News/2024/postquantum-cryptography-fips-approved, weight 0.97). NIST's own announcement lists them as the Module-Lattice-Based Key-Encapsulation Mechanism Standard (FIPS 203), the Module-Lattice-Based Digital Signature Standard (FIPS 204), and the Stateless Hash-Based Digital Signature Standard (FIPS 205) (https://www.nist.gov/news-events/news/2024/08/announcing-approval-three-federal-information-processing-standards-fips, weight 0.93).

The CSRC standardization project page fixes the date and the lineage: FIPS 203, FIPS 204, and FIPS 205, specifying algorithms derived from CRYSTALS-KYBER, CRYSTALS-Dilithium, and SPHINCS+ respectively, were published August 13, 2024. It also records the next milestone in the queue: FALCON was also selected and will be published as FIPS 206, which is in development (https://csrc.nist.gov/projects/post-quantum-cryptography/post-quantum-cryptography-standardization, weight 0.97).

For sequencing purposes the key split is algorithm class. FIPS 203 (ML-KEM) governs key establishment, which is the transport timeline. FIPS 204 (ML-DSA) governs digital signatures, which is the signing and verification timelines. A single standardization date therefore feeds the timelines at different rates, because each timeline needs its own implementation, tooling, and certification work before the milestone becomes deployable.

## The IETF transport milestone chain

The IETF side of the transport timeline has a clean, dated progression:

1. draft-kwiatkowski-tls-ecdhe-mlkem-02, published 10 September 2024 as an individual submission, introduced two new supported groups for hybrid post-quantum key agreement in TLS 1.3: X25519MLKEM768 and SecP256r1MLKEM768 (https://www.ietf.org/archive/id/draft-kwiatkowski-tls-ecdhe-mlkem-02.html, weight 0.91).
2. draft-ietf-tls-ecdhe-mlkem-00, dated 23 March 2025, shows the work adopted by the TLS working group and now defining three hybrid key agreements: X25519MLKEM768, SecP256r1MLKEM768, and SecP384r1MLKEM1024, each combining a post-quantum KEM with elliptic curve Diffie-Hellman (https://www.ietf.org/archive/id/draft-ietf-tls-ecdhe-mlkem-00.html, weight 0.97).
3. RFC 10024 defines three hybrid key agreement mechanisms for TLS 1.3, X25519MLKEM768, SecP256r1MLKEM768, and SecP384r1MLKEM1024, that combine the post-quantum ML-KEM with an ECDHE key exchange (https://www.rfc-editor.org/info/rfc10024/, weight 0.69).

The move from an individual submission to a working-group draft to an RFC is exactly the milestone progression an OS project should be watching, and the dates show a roughly 2 year span from first draft to RFC. A secondary writeup characterizes the same arc as the standardization of "the hybrid ML-KEM + ECDHE key exchange that Chrome, Firefox, and Cloudflare already deploy at scale" (https://postquantum.com/security-pqc/rfc-10024-hybrid-mlkem-tls/, weight 0.21, weak backing). A TLS-focused reference site keeps the full citation chain in one place, from RFC 8446 (TLS 1.3, August 2018) through the ecdhe-mlkem draft to the OpenSSL 3.5 release notes as the first upstream release with built-in ML-KEM (https://goodtls.com/post-quantum-tls, weight 0.23, weak backing).

A companion analysis tracks the same group name, X25519MLKEM768, from its origin through the IETF TLS ML-KEM standardization work, noting that the named group is what makes the hybrid negotiable in TLS 1.3 (https://www.postquantumsecurity.org/publications/X25519+MLKEM768.html, weight 0.71).

## What has no milestone yet

The milestone map is deliberately asymmetric. The transport timeline has a finalized RFC and three named groups. The signature timeline has a final algorithm standard (FIPS 204) but its protocol-level integration, in signing frameworks and hardware credential standards, is still in working drafts. The verification timeline has neither a dedicated RFC nor a mature tool-level milestone. An OS project reading only the NIST announcement would conclude the migration is ready; reading the IETF chain shows that only one of the three timelines has a completed standards milestone.

## Using the map

Each milestone answers one sequencing question: what can be standardized-technology now, what is still moving, and what is missing entirely. FIPS 203/204/205 (August 13, 2024) settle the algorithms. RFC 10024 settles the transport protocol shape. The open drafts and the pending FIPS 206 are the live signals that a sequencer should poll rather than assume.
