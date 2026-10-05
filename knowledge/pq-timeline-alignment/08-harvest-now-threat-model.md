# 08 - Harvest-now threat model

Scope: the harvest-now-decrypt-later threat model versus later signature forgery: why the two PQ timelines carry different urgency for long-lived OS artifacts.

## HNDL: the confidentiality clock is already running

Harvest now, decrypt later (HNDL), also called store now, decrypt later, "is an attack model in which an adversary records encrypted traffic or stolen ciphertext today and archives it until a quantum computer capable of breaking the encryption exists. It makes the quantum threat a present" concern rather than a future one (https://postquantum.wiki/harvest-now-decrypt-later, weight 0.65). A peer-reviewed cross-sector analysis states the same point formally: a cryptographically relevant quantum computer would break the public-key algorithms protecting most digital communication, "but the risk does not begin when such a machine is switched on. Under the harvest-now-decrypt-later (HNDL) threat model, an adversary records encryp"ted traffic now and decrypts it later (https://link.springer.com/article/10.1007/s44196-026-01526-2, weight 0.83).

The consequences for timing are quantified in the secondary literature. A tutorial on the model argues that HNDL "is the structural reason post-quantum cryptography migration must precede the actual quantum threat by 5-15 years" (https://quantumoutpost.com/tutorials/52-harvest-now-decrypt-later/, weight 0.60). Practitioner guidance from a network-security vendor frames the defensive program as identifying exposed data, reducing cryptographic risk, and planning post-quantum migration now (https://www.paloaltonetworks.com/cyberpedia/harvest-now-decrypt-later-hndl, weight 0.59), and an explainer for a general audience asks why today's encrypted data may be vulnerable to future quantum attacks (https://thequantuminsider.com/2026/05/01/harvest-now-decrypt-later-why-should-you-care/, weight 0.64).

## The signature asymmetry: forgery needs the machine, defense needs the lead time

The threat model for signatures is different in kind, and one explainer states the asymmetry precisely: "Harvest now, decrypt later makes confidentiality a present concern. Signature forgery becomes possible once a sufficiently capable quantum computer exists, but authentication may take longer to migrate because certificates, hardware roots of trust, software-signing systems, and t"he surrounding trust infrastructure move slowly (https://www.sdxcentral.com/sdx-explainers/what-is-post-quantum-cryptography-a-practical-guide-to-surviving-q-day/, weight 0.80).

This yields the two-clock structure that drives timeline sequencing:

1. Confidentiality (transport timeline): exposure starts now, for every session recorded today. The clock is the adversary's, so urgency is immediate and independent of when quantum hardware arrives. This is why hybrid key exchange shipped first across the ecosystem (doc 04).
2. Integrity (signature and verification timelines): exposure starts when a fault-tolerant quantum computer can run Shor's algorithm against classical signatures. The adversary cannot forge anything yet. But the defense has a much longer lead time: the signing stack is mid-migration (doc 05) and the verifiers lag further (doc 06), so the fix-side schedule, not the threat-side schedule, is the binding constraint.

The related concept of "trust now, forge later" (TNFL) gives the integrity side its own name: an adversary trusts artifacts produced today and forges later once forgery becomes possible; guidance covers what TNFL is and how to reduce the risk (https://www.encryptionconsulting.com/trust-now-forge-later-attack/, weight 0.33, weak backing; a reference entry is at https://postquantum.com/quantum-security-reference/what-is-trust-now-forge-later/, weight 0.27, weak backing). The weak weights mark these as secondary, but the concept is consistent with the strongly weighted SDxCentral asymmetry above.

## Which artifacts are exposed under each clock

For an OS project the split is concrete. Under HNDL, what is at risk is recorded confidentiality: TLS sessions, encrypted data stores, VPN and SSH traffic whose classical key exchange is logged today. Under TNFL, what is at risk is artifact trust: provenance attestations, image signatures, secure-boot chains, and any long-lived credential anchored in a classical signature. A sector-specific roadmap document shows how far the integrity concern reaches when a project enumerates its own surface (https://docs.arc.io/arc/concepts/post-quantum-security, weight 0.51, weak backing).

## Implication for timeline sequencing

The two clocks resolve the ordering question. Confidentiality migration (timeline 1) is urgent now because exposure accumulates today and the tooling is ready. Integrity migration (timelines 2 and 3) is less urgent in threat terms but more expensive in engineering terms: it waits on signing tools and hardware credential drafts, and rushing it is impossible because the verifier ecosystem must exist on the far side. The sequencing error to avoid is reading the integrity clock as permission to defer work: because authentication infrastructure takes longer to migrate (weight 0.80), the work must start now to be ready before the forgery clock starts, even though the forgery clock itself has not started.
