# 05 - The evidence envelope: certification, architecture documents, and what they bound

Scope: The verified envelope itself: architecture docs, certification schemes and attestations that bound what a public claim can say.

## Certification as the outer bound

The Common Criteria scheme is the clearest formal envelope in the dig. The CC Portal describes certificates with claims of compliance against Common Criteria assurance components under the Common Criteria Recognition Arrangement [1] (jev weight 0.95), and states that certification of the security properties of an evaluated product can be issued by a number of Certificate Authorizing Schemes, with certificates recognized by all CCRA signatories [2] (jev weight 0.85). A certificate is therefore a bounded object: it certifies claims about a defined evaluation target, through a named scheme, with defined recognition scope.

Weakly weighted vendor and reference material fills in the mechanics. A vendor guide describes Common Criteria (ISO/IEC 15408) as a structured way to demonstrate that a defined product configuration, the Target of Evaluation, meets the specific security claims made about it, verified by an accredited third party rather than the vendor [3] (jev weight 0.17, weak backing). A Wikipedia reference defines the Target of Evaluation as the product or system subject to evaluation and notes that the evaluation serves to validate claims made about the target [4] (jev weight 0.13, weak backing). The bounding consequence for marketing: a certificate covers the evaluated configuration, and a campaign that stretches the certificate over an unconfigured product line is claiming beyond the envelope.

## How a claim enters evaluation

The US scheme's own FAQ material states that the vendor of a product is typically the sponsor of a CC evaluation and initiates it by contacting an accredited Common Criteria Testing Laboratory [5] (jev weight 0.87). The NIAP homepage adds a structural constraint: any product accepted into evaluation under the US CC Scheme must claim compliance to an NIAP-approved Protection Profile, and Protection Profiles define the requirements used for evaluation of products under the NIAP scheme and the CCRA [6] (jev weight 0.73). A claim therefore does not float into certification; it must be phrased against an approved profile. That is the same discipline as the claims-boundary rule, applied by a third party.

## Architecture documents as the evidence surface

Between "no certification at all" and "full CC certificate" sits the architecture document, and the dig shows it operating as an evidence envelope in several forms. Microsoft's Cybersecurity Reference Architectures are published to accelerate security modernization planning using open standards and Microsoft and third-party security technology [7] (jev weight 0.94). The C2PA Generator Product Security Architecture Document Template requires that sections marked Required be present and filled in order for a generator product to be evaluated at its target Assurance Level [8] (jev weight 0.65): the document structure itself defines what must be evidenced before a given assurance claim is allowed. A weakly weighted Gartner note frames product security architecture as the way leaders plan and design product security consistently and coherently [9] (jev weight 0.53).

A weakly weighted public-ISMS example shows the pattern in an open-source setting: a public security development policy referencing a living security architecture with classification impact analysis and public security badges for continuous validation of an evidence-based security posture [10] (jev weight 0.40, weak backing).

## Supply chain evidence

NIST guidance under Executive Order 14028 (May 12, 2021) directs publication of practices for software supply chain security and provides ten numbered guidance items [11] (jev weight 0.67). For claims purposes this matters because supply-chain attestations and build provenance are among the few security properties a vendor can evidence mechanically; a claim tied to build provenance has an artifact behind it, while a claim tied to adjectives does not.

## The envelope hierarchy

Reading the sources together, the envelope has layers, and a claim's strength must match its layer:

1. Design-level: architecture documents and reference architectures [7] (jev weight 0.94), [8] (jev weight 0.65). Claims may name mechanisms and designs.
2. Evaluation-level: CC certificates against an approved Protection Profile [2] (jev weight 0.85), [6] (jev weight 0.73). Claims may state compliance for the evaluated configuration.
3. Operational-level: supported versions and disclosure process (doc 06). Claims may state support status.

A campaign surface that quotes a layer 2 claim about a layer 1 implementation, or a layer 3 status as if it were layer 2, is outside the envelope.

## Sources considered

| # | Source | Weight |
|---|---|---|
| 1 | CC Portal, certified products: https://www.commoncriteriaportal.org/products/index.cfm | 0.95 |
| 2 | CC Portal, overview: https://www.commoncriteriaportal.org/index.cfm | 0.85 |
| 3 | Keyfactor, CC vendor guide: https://www.keyfactor.com/blog/common-criteria-iso-iec-15408-what-cryptographic-evaluation-means-for-it-product-vendors/ | 0.17 (weak) |
| 4 | Wikipedia, Common Criteria: https://en.wikipedia.org/wiki/Common_Criteria | 0.13 (weak) |
| 5 | NIAP FAQs: https://www.niap-ccevs.org/faqs/ | 0.87 |
| 6 | NIAP homepage: https://www.niap-ccevs.org/ | 0.73 |
| 7 | Microsoft Cybersecurity Reference Architectures: https://learn.microsoft.com/en-us/security/adoption/mcra | 0.94 |
| 8 | C2PA Generator Product Security Architecture Document Template: https://github.com/c2pa-org/conformance-public/blob/main/docs/v0.2/C2PA%20Generator%20Product%20Security%20Architecture%20Document%20Template.md | 0.65 |
| 9 | Gartner, product security architecture: https://www.gartner.com/en/documents/5647523 | 0.53 |
| 10 | Hack23 ISMS-PUBLIC, Secure Development Policy: https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md | 0.40 (weak) |
| 11 | NIST EO 14028 supply chain guidance: https://www.nist.gov/system/files/documents/2022/02/04/software-supply-chain-security-guidance-under-EO-14028-section-4e.pdf | 0.67 |
