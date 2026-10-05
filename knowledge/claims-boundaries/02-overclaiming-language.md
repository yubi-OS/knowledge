# 02 - Overclaiming language: what breaks and what holds

Scope: Absolute and inflated security language (unhackable, secure by default, impenetrable) and why it collapses under scrutiny.

## "Secure by default" is a defined term, not a slogan

The clearest finding in this dig is that the phrase "secure by default" has an owner-supplied definition, and the definition is hedged. Microsoft, defining the term for Defender for Office 365, states that "secure by default" means the default settings that are most secure as possible, and then immediately notes that security needs to be balanced with productivity: usability, risk of blocking important activities, and legacy settings all constrain it [1] (jev weight 0.88). If the term's own stewards define it with tradeoffs, then an unqualified slogan use of the same phrase overclaims. A campaign surface that says "secure by default" without naming which defaults are enforced, and which tradeoffs were accepted, is saying something the defining documents do not say.

A weakly weighted secondary source gives the canonical positive example: AWS S3, after high-profile incidents with publicly exposed buckets, moved toward default-secure posture [2] (jev weight 0.25, weak backing). A weakly weighted blog summary of a joint CISA, NSA, FBI and international-agency guide notes that the default-secure posture is the subject of coordinated government guidance [3] (jev weight 0.27, weak backing). Both support the term being real and bounded; neither supports using it as an unbounded adjective.

## Machine-checkable claim structure exists

The European Union Agency for Cybersecurity (ENISA) secure-by-design and default playbook illustrates how machine-processable attestations can express security claims, supporting evidence, and verification results in a structured format that enables automated processing and validation [4] (jev weight 0.84). This is the constructive alternative to vibes: a claim, its evidence, and its verification result as three addressable fields. A claim that cannot be turned into that triple is not ready to publish.

## The "unhackable" family

The dig returned a cluster of commentary on absolute claims; almost all of it weighs below the 0.5 primary threshold and is labeled as weak backing.

- A content-strategy source argues cybersecurity is about resilience and risk management, not being unhackable, and that overpromising sets companies up for failure [5] (jev weight 0.40, weak backing).
- A security commentary observes that the strongest software assurance claim in the industry belongs to seL4, a microkernel with a machine-checked proof down to the binary, and that its own documentation publishes the list of what the proof does not cover [6] (jev weight 0.39, weak backing). The instructive part is that even this gold-standard claim is scoped, not absolute.
- Practitioner rule-of-thumb sources state that security professionals build systems that are difficult to breach, resistant to escalation, and designed to fail in controlled ways rather than chase the unhackable illusion [7] (jev weight 0.12, weak backing), and that "unhackable" or "military-grade" labels play on fear and foster complacency [8] (jev weight 0.11, weak backing).
- A security-leadership post states a blunt internal rule: never let marketing make promises that products are "secure", "unbreakable" or "unhackable" [9] (jev weight 0.06, weak backing).

The consistent pattern across all weights: absolute claims are treated as a defect everywhere they appear, including in commentary that is itself only weakly weighted. The direction of expert opinion is uniform even where citation strength is not.

## What survives scrutiny

The language that survives is scoped and evidence-linked. Concretely:

1. Name the mechanism instead of the outcome: "signed UKI chain" instead of "unhackable boot".
2. Name the boundary: what the threat model excludes stays out of the campaign.
3. Name the status: preview, groundwork, or supported, matching the SECURITY.md table (see doc 06).
4. Keep the claim convertible to the ENISA attestation triple: claim, evidence, verification result [4] (jev weight 0.84).

## Sources considered

| # | Source | Weight |
|---|---|---|
| 1 | Microsoft Learn, secure by default: https://learn.microsoft.com/en-us/defender-office-365/secure-by-default | 0.88 |
| 2 | Resilient Cyber, secure by design vs default: https://www.resilientcyber.io/p/secure-by-design-vs-secure-by-default | 0.25 (weak) |
| 3 | Cloudflare blog on CISA guide: https://blog.cloudflare.com/secure-by-default-understanding-new-cisa-guide/ | 0.27 (weak) |
| 4 | ENISA Secure by Design and Default Playbook: https://www.enisa.europa.eu/sites/default/files/2026-07/ENISA_Secure_By_Design_and_Default_Playbook_v1.pdf | 0.84 |
| 5 | Prose, why unhackable claims fail: https://www.prosemedia.com/blog/why-unhackable-claims-are-setting-you-up-for-failure | 0.40 (weak) |
| 6 | Sudo Security, what verification proves: https://sudosecurity.org/unhackable-and-bug-free-coding-is-a-marketing-lie/ | 0.39 (weak) |
| 7 | The Dark Artist, unhackable websites: https://thedarkartist.in/blogs/why-unhackable-websites-dont-exist-and-what-real-security-looks-like | 0.12 (weak) |
| 8 | Phish-Def, myth of unhackable: https://phish-def.com/blog/cybersecurity/the-myth-of-unhackable-why-nothing-is-truly-secure/ | 0.11 (weak) |
| 9 | M. Rosenquist, unhackable product claims: https://www.linkedin.com/pulse/unhackable-product-claims-fiasco-waiting-happen-matthew-rosenquist/ | 0.06 (weak) |
