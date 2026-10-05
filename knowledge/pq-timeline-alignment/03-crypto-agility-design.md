# 03 - Crypto-agility design

Scope: crypto-agility as an architectural principle: designing OS-level systems so algorithms can be swapped without re-architecture, and what NIST guidance says.

## The NIST definition

NIST's CSRC defines crypto agility as "the capabilities needed to replace and adapt cryptographic algorithms for protocols, applications, software, hardware, and infrastructures without interrupting the flow of a running system to achieve resiliency," and stresses that crypto agility must be considered for each layer rather than as one global property (https://csrc.nist.gov/projects/crypto-agility, weight 0.97).

The operative NIST document is CSWP 39upd1, "Considerations for Achieving Crypto Agility: Strategies and Practices." Its abstract carries the same definition one level deeper: crypto agility refers to the capabilities needed to replace and adapt cryptographic algorithms "in protocols, applications, software, hardware, firmware, and infrastructures while preserving security and ongoing operations" (https://csrc.nist.gov/pubs/cswp/39/upd1/considerations-for-achieving-crypto-agility/final, weight 0.97; mirrored at https://www.nist.gov/publications/considerations-achieving-crypto-agility-strategies-and-practices-0, weight 0.87). The per-layer scoping matters for an OS project: agility for the TLS stack, agility for the signing toolchain, and agility for firmware roots of trust are separate capabilities, each with its own swap surface.

## From reactive migration to planned agility

A secondary analysis of the CSWP frames its central move as going from reactive migration to "planned agility," with key pillars of modularity, abstraction, and explicit algorithm inventory (https://postquantum.com/security-pqc/crypto-agility-nist/, weight 0.77). The practical reading for an OS image builder: cryptographic choices should live in configuration and packaging boundaries, not be hardcoded into image composition logic, so that an algorithm swap is a package update rather than an image redesign.

An academic survey of post-quantum and crypto-agility strategies supports the same structure from the literature side, focusing on "the established asymmetric and symmetric cryptographic methods and how current security protocols can be adapted" (https://pqc-cma.gitlab.io/cma/docs/agility/agility/, weight 0.66).

## What agility buys during a staggered migration

The reason crypto-agility is the enabling principle for timeline sequencing is that the migration is staggered across years and across upstream communities. A system that is crypto-agile can adopt timeline 1 (hybrid TLS) the day its TLS library ships it, keep classical signing until timeline 2 tools exist, and flip verification when timeline 3 lands, all without architectural surgery. A system that hardcodes algorithm choices must either migrate everything at once or carry per-timeline forks.

Practitioner sources make the cost of non-agility explicit. A vendor explainer describes crypto-agility as the capability that makes post-quantum migration possible without system replacement, and gives principles for agile design (https://www.paloaltonetworks.com/cyberpedia/what-is-cryptographic-agility, weight 0.27, weak backing). An industry blog argues that "most organisations do not have a cryptography problem. They have a hardcoded cryptography problem," distinguishing algorithm replacement from architectural repair (https://www.quantumsecuritydefence.com/quantum-news/crypto-agility-architecture-principles-2026/, weight 0.21, weak backing). An enterprise guidance piece summarizes the CSWP as defining "the capabilities organizations need to replace cryptographic algorithms without rebuilding entire systems" (https://www.encryptionconsulting.com/nists-report-on-crypto-agility/, weight 0.28, weak backing). These are secondary sources; the weights mark them accordingly, but they converge with the primary NIST text.

A migration-specific framing from an enterprise vendor makes the timeline link directly: "Building crypto-agility might seem like a significant undertaking, but the quantum-safe migration is the perfect time to begin this work," with a framework centered on architecture, automation, and governance (https://www.ibm.com/quantum/blog/crypto-agility, weight 0.37, weak backing).

## Design consequences for an OS project

Reading the primary sources as design requirements yields a short list:

1. Algorithm selection must be externalized: named algorithm suites in configuration, not inlined constants in build logic. This follows from the CSWP scope covering software, firmware, and infrastructure simultaneously (weight 0.97).
2. Each protocol layer needs its own agility plan, because NIST scopes agility per protocol, application, and hardware layer (weight 0.97).
3. Hybrid modes should be first-class citizens: the migration period is long, and the transport timeline is already shipping hybrid-only defaults, so the system must express "classical plus PQ" as a supported state, not a special case.
4. The inventory layer (knowing which algorithms run where) is a precondition for any swap; the survey literature treats protocol adaptation as impossible without asset visibility (https://pqc-cma.gitlab.io/cma/docs/agility/agility/, weight 0.66).

Crypto-agility does not schedule the migration. It prices it. An agile system can follow each upstream timeline as it matures; a non-agile system must guess one date and bet the architecture on it.
