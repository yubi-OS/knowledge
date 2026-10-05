# 04 - The threat model as the bounding contract

Scope: Threat models as the bounding document: scope, assumptions, out-of-scope exclusions, and how an assurance case maps public claims to evidence.

## What a threat model document contains

Threat modeling deliverables take various forms: system models and diagrams, lists of threats, mitigations, and assumptions, and meeting notes [1] (jev weight 0.90, OWASP Developer Guide). Template sources, weakly weighted, enumerate the sections a threat model carries: system name and version, participants, business purpose, key security assumptions, scope boundaries in and out, and sensitivity classification of data handled [2] (jev weight 0.48, weak backing). The Microsoft engineering playbook example shows the shape in practice: an explicit assumptions list (secrets stored in a CI/CD secrets store and deployed to devices) with the CI/CD pipelines marked out of scope [3] (jev weight 0.77).

For the claims-boundary rule, the operative sections are the assumptions and the out-of-scope list. Everything a campaign surface says must be derivable from what the threat model covers; everything in the out-of-scope list is a no-claim zone.

## Scope boundaries are recorded, not implied

The W3C threat modeling guide, published June 23, 2026, is explicit about the mechanics: if an out-of-scope issue remains relevant to implementers, deployers, users, reviewers, or other stakeholders, the threat model should record the boundary being drawn and, where known, identify where the issue is expected to be analyzed or addressed [4] (jev weight 0.84). A drawn boundary is a written sentence in a reviewed document. That is what gives it authority over marketing copy.

The MDN example threat model shows the same discipline on a small system: the model covers the blog website itself including user interaction and backend services, while web browser, web platform, and operating system layers are assumed to provide baseline protections and are considered out of scope unless they directly affect the project [5] (jev weight 0.69). The scope statement is not a footnote; it is the load-bearing wall.

## The purpose limit

The MDN material also states what a threat model is not: its purpose is to improve shared understanding and guide security decisions, not to guarantee the absence of vulnerabilities [6] (jev weight 0.84). A campaign claim that reads as a guarantee of absence therefore exceeds the purpose of the bounding document itself, not merely its content.

## Assurance cases: the claim to evidence map

When a claim needs formal structure, the assurance case is the established instrument. An assurance case includes a top-level claim for a property of a system or product, systematic argumentation regarding this claim, and the evidence and explicit assumptions that underlie the argumentation, citing ISO 15026-2:2011 [7] (jev weight 0.60). The Claims, Arguments and Evidence (CAE) notation renders this graphically: ovals are claims or sub-claims, rounded rectangles are supporting arguments, and rectangles are evidence [8] (jev weight 0.65; pattern overview at 0.71) [9]. Goal Structuring Notation (GSN) is a common alternative but more complex [8].

Research on assurance cases in automotive systems discusses severity-rated evidence being used as evidence in security assurance cases [10] (jev weight 0.73). The CAE framework maintains an aggregated resource set of papers, reports, and standards for learning the notation family [11] (jev weight 0.57).

The mapping to the claims-boundary rule is direct: every campaign sentence is a candidate top-level claim, and it may stand only if the argumentation and evidence nodes beneath it are filled with artifacts the team controls.

## Threat modeling as a producer of commitments

The Secure-by-Design Handbook defines threat modeling as the structured process for understanding how a connected product could be attacked, what risks matter most, which mitigations are needed, and what evidence supports those decisions, and stresses that the output is not just a diagram or workshop notes but security requirements, risk decisions, mitigations, and test priorities [12] (jev weight 0.61). A threat model that produces requirements and evidence is precisely the document that campaign language must be checked against.

## Sources considered

| # | Source | Weight |
|---|---|---|
| 1 | OWASP Developer Guide, threat modeling in practice: https://devguide.owasp.org/en/04-design/01-threat-modeling/07-practical-threat-modeling/ | 0.90 |
| 2 | ArchMan threat model template: https://archman.dev/docs/checklists-and-templates/threat-model-template | 0.48 (weak) |
| 3 | Microsoft engineering playbook, threat modelling example: https://microsoft.github.io/code-with-engineering-playbook/security/threat-modelling-example/ | 0.77 |
| 4 | W3C Threat Modeling Guide: https://www.w3.org/TR/threat-modeling-guide/ | 0.84 |
| 5 | MDN example threat model, scope: https://developer.mozilla.org/en-US/docs/Web/Security/Threat_modeling/Example_threat_model | 0.69 |
| 6 | MDN example threat model, purpose: https://developer.mozilla.org/en-US/docs/Web/Security/Threat_modeling/Example_threat_model | 0.84 |
| 7 | IDA, A Sample Security Assurance Case Pattern: https://www.ida.org/assets/2026/06/18013118/P-9278.pdf | 0.60 |
| 8 | JSTOR, Sample Assurance Case Pattern CAE figures: https://www.jstor.org/stable/resrep22785.5 | 0.65 |
| 9 | JSTOR, assurance case pattern overview: https://www.jstor.org/stable/resrep22785 | 0.71 |
| 10 | Chalmers, security assurance cases in automotive: https://research.chalmers.se/publication/539814/file/539814_Fulltext.pdf | 0.73 |
| 11 | CAE Framework resources: https://claimsargumentsevidence.org/resources/downloadable-resources/ | 0.57 |
| 12 | Secure-by-Design Handbook, threat modeling: https://www.securebydesignhandbook.com/docs/implementation/build-phase/threat-modeling | 0.61 |
