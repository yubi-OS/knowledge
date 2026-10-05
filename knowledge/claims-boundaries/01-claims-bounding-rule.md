# 01 - The claims bounding rule

Scope: The core discipline: a product may publicly claim only what its threat model can bound and its architecture can evidence, and nothing stronger.

## The bounding relationship

A public claim is only as strong as the document that bounds it. The MDN threat modeling material states the point directly: the purpose of a threat model is to improve shared understanding and guide security decisions, not to guarantee the absence of vulnerabilities [1] (jev weight 0.84). If the bounding document itself disclaims the absence of vulnerabilities, then a campaign surface that claims "unhackable" is claiming something no document in the repo supports. That is the whole rule: for each sentence a marketing surface wants to say, there must exist a threat model statement that bounds it and an architecture artifact that points at the mechanism behind it.

A weaker source in the dig states the failure mode from the buyer side: high-level trust claims without supporting evidence make it difficult to validate security posture, and teams may approve tools based on marketing language rather than documented controls, which increases operational and governance risk [2] (jev weight 0.56). The risk is not reputational only; it is an assessment failure for everyone downstream who relied on the sentence instead of the evidence.

A marketing-side source, weakly weighted, reaches the same conclusion: vague security language trains buyers to accept confidence instead of evidence [3] (jev weight 0.15, weak backing).

## Why abstraction gaps break absolute claims

Even rigorous claims have a ceiling. The arXiv paper on guarantees in security observes that when we reason about an abstraction of a software system to make claims about the actual deployed system, an attacker might violate the security property at a lower level of abstraction while the guarantees at the higher level remain intact [4] (jev weight 0.65). In practical terms: a proof or an architecture argument holds inside the modeled layer, and unmodeled layers are exactly where the claim stops being true. A weakly weighted survey makes the same observation about the persistent gap between theoretical guarantees and practical vulnerabilities through unmodeled side channels and implementation flaws [5] (jev weight 0.10, weak backing).

This is why the honest form of a strong claim includes its boundary. A weakly weighted commentary notes that seL4, a microkernel with a machine-checked proof down to the binary, publishes in its own documentation the list of things the proof does not cover, and that this list is the whole story [6] (jev weight 0.39, weak backing). The strongest assurance claim in the industry is bounded by an explicit exclusions list; the marketing claim should be no stronger than that list permits.

## Contract-style bounding

One formalization of the rule is the security contract. An open-source security-contract effort describes evidence-backed threat models that state what a project assumes, guarantees, disclaims, and leaves to downstream users [7] (jev weight 0.47, weak backing), with the contract form stating which parties and data are trusted, what the software promises under those assumptions, what it does not promise, and what downstream users must enforce [8] (jev weight 0.44, weak backing). Under this model a campaign sentence maps onto a promise entry, and anything the contract disclaims may not be claimed.

## The pre-publication gate

The rule needs an enforcement point before publication, not after. The United States Department of Defense runs a mandatory pre-release review: the Defense Office of Prepublication and Security Review reviews written materials for public and controlled release, including materials submitted by cleared or formerly cleared individuals [9] (jev weight 0.88). The institutional pattern transfers: a claim about a security product is reviewed against the bounding documents before it ships, by someone other than the author of the claim. Doc 08 develops this checklist in detail.

## What the rule does not do

The rule does not forbid confident language; it forbids unsupported language. "FIDO2-first immutable OS" is a claim about a design and a trust chain that the architecture can point at; "secure by default" said without defining which defaults are enforced is a slogan that the threat model cannot bound. The discipline is per-sentence: every sentence either names its bounding document or gets deleted.

## Sources considered

| # | Source | Weight |
|---|---|---|
| 1 | MDN, Example threat model: https://developer.mozilla.org/en-US/docs/Web/Security/Threat_modeling/Example_threat_model | 0.84 |
| 2 | nhimg, trust claims without evidence: https://nhimg.org/faq/what-breaks-when-a-vendor-exposes-only-high-level-trust-claims-without-supportin/ | 0.56 |
| 3 | Attomus, wrong way to market a security product: https://attomus.com/blog/2026-the-wrong-way-to-market-a-security-product/ | 0.15 (weak) |
| 4 | arXiv, Guarantees in Security: https://arxiv.org/html/2402.01944v4 | 0.65 |
| 5 | Security Assumptions and Guarantees PDF: https://encyclopedia.ambient.tech/articles/security_assumptions_and_guarantees.pdf | 0.10 (weak) |
| 6 | Sudo Security, what verification proves: https://sudosecurity.org/unhackable-and-bug-free-coding-is-a-marketing-lie/ | 0.39 (weak) |
| 7 | Alpha-Omega security contracts: https://alpha-omega-security.github.io/threat-model/ | 0.47 (weak) |
| 8 | Alpha-Omega, concepts: https://alpha-omega-security.github.io/threat-model/concepts/ | 0.44 (weak) |
| 9 | DoD Publication Security Review: https://www.war.gov/Contact/Help-Center/Article/Article/2762947/publication-security-review/ | 0.88 |
