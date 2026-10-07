# 06 - The four-POV synthesis template and worked example

Scope: the "how would each source react?" template, the rule that the four POVs stay independent, and the worked example that applies the template to a real yubiOS decision (the opt-in remote attestation endpoint).

Ground source: yubi-OS/yubiOS skills/internal-big-picture/SKILL.md (source doc).

## The template

When a yubiOS design decision arrives, answer four times in sequence, in the source's own vocabulary, with a cited source for each POV. Do not skip any of the four (source doc):

1. **QUESTION**: state the design decision in one sentence.
2. **CHRONICLE POV**: would this be a YARA-L rule, UDM event, or RBAC policy? What detection or continuous-evaluation primitive applies? Source: cite URL.
3. **HITRUST POV**: which control family and PRISMA level applies? What maturity level does the design claim? Source: cite URL.
4. **CISA ZT POV**: which of the 5 pillars does this touch? What maturity stage? Governance cross-cutting impact? Source: cite URL.
5. **0POINTER POV**: which of the 17 design goals does this satisfy or violate? Which trust-chain stage (firmware, bootloader, UKI, dm-verity, TPM/PCR, LUKS)? Immutability, hermetic, or modular impact? yubiOS delta (YubiKey instead of TPM2 where applicable)? Source: cite URL.
6. **SYNTHESIS**: which primitives are load-bearing? Which sources disagree, and on what? What evidence does yubiOS already cite? What evidence is missing?

The four POVs are independent; do not blend them. If two sources say the same thing in different vocabularies, name the convergence. If two sources disagree, the disagreement is the most valuable finding (source doc).

## The worked example: remote attestation endpoint

The source doc runs the template on a real decision: whether yubiOS should ship an opt-in remote attestation endpoint that signs a TPM2 PCR quote plus a YubiKey FIDO2 assertion, so an external auditor can verify that the running OS came from a known-signed UKI and that the owner holds their YubiKey (source doc).

**Chronicle POV.** The design is a YARA-L detection candidate: a rule named for attestation completeness with events on UDM asset and user types, a match on the PCR quote and the FIDO2 assertion, an outcome extracting attestation validity, and a condition firing on validity. Every attestation attempt becomes a UDM event; detection-as-code is the right Chronicle vocabulary, not a compliance library or an architecture pattern (source doc; YARA-L rule structure per https://docs.cloud.google.com/chronicle/docs/yara-l/getting-started, weight 0.92). Google documents YARA-L match-section syntax as a distinct rule component (https://docs.cloud.google.com/chronicle/docs/yara-l/match-syntax, weight 0.90), which supports treating match clauses as a first-class rule part in the POV answer.

**HITRUST POV.** Touches control family 01 (Access Control) and 04 (Information Protection): the attestation is an access-control gate and the FIDO2 assertion is an authentication assertion. PRISMA maturity starts at Policy (define who can attest what) and moves through Process, Implemented, Measured (how often it runs), to Managed (continuous monitoring of attestation coverage). Control 17.i (Business Continuity and Disaster Recovery) may apply if attestation failure must trigger recovery, depending on the threat model (source doc, citing https://hitrustalliance.net/hitrust-framework).

**CISA ZT POV.** This is device attestation in the Devices pillar of ZTMM v2.0, mapping to the Advanced maturity stage because runtime attestation is not a static perimeter defense. Cross-cutting capability "Visibility and Analytics" applies: attestation events should feed the SOC's continuous-monitoring pipeline. The YubiKey FIDO2 assertion aligns with CISA's phishing-resistant MFA guidance (NIST SP 800-63B AAL3) in the Identity pillar (source doc, citing https://www.cisa.gov/topics/cybersecurity-best-practices/zero-trust; ZTMM v2.0 document corroborated at https://www.cisa.gov/sites/default/files/2023-04/zero_trust_maturity_model_v2_508.pdf, weight 0.93).

**0POINTER POV.** Design Goal #4 (cryptographic measurement everywhere) applies: the attestation endpoint is the remote leg of the measurement chain. The trust-chain stage to bind is PCR 11 (UKI measurements); that is what the attestation should sign, not just any PCR. Immutability constraint: the attestation service should run as a portable service (RootImage=) or a sysext overlay, never installed into /usr, which is dm-verity-protected; otherwise the verification endpoint itself breaks dm-verity. The yubiOS delta: the YubiKey FIDO2 assertion (the owner-in-possession leg) substitutes for the TPM2-only attestation mainstream specs assume (source doc). TPM fundamentals, including the PCR model, are documented by Microsoft as the platform's integrity measurement mechanism (https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/tpm-fundamentals, weight 0.93).

**SYNTHESIS.** Load-bearing primitives: Attestation (the design is attestation-as-a-service), Cryptographic identity (YubiKey FIDO2 as the user-identity root), Trust chain (the attestation must extend to a known UKI root hash), Continuous/Adaptive (Chronicle's continuous-monitoring framing, CISA's ZTMM stage requirement), Immutability (the endpoint cannot break dm-verity on /usr). Disagreements: 0pointer's "service lives in portable/sysext, not /usr" is a hard constraint; Chronicle's "feed everything into UDM" is operationally desirable but optional; HITRUST's PRISMA maturity model is an assessment lens, not a design lens. Evidence yubiOS already cites: docs/MISSION.md, docs/THREAT_MODEL.md security invariants 2 and 3, refs/0pointer-poettering-systemd-vision-2026-07-23.md (DG#4), refs/adr-032-misbehavior-cutoff-policy-2026-07-28.md (severity ladder: log, throttle, snapshot+sever, kill-VM; the attestation endpoint could trigger the snapshot+sever tier). Missing evidence: nothing in yubiOS mapped the four-source POV vocabulary to a single design decision before this template existed (source doc).

## The trap the example closes with

HITRUST's IA control family is organizational identity management; CISA's Identity pillar is authentication primitives. The YubiKey FIDO2 assertion lives in the CISA sense. HITRUST maps it to control 01.b (authentication) (source doc).

## Dig note

Two supporting external mechanisms were dug and weighted: TPM2/PCR fundamentals (Microsoft Learn, weight 0.93, high) and YARA-L rule structure (Google Security Operations docs, weights 0.92 and 0.90, high). The remaining 10 dug results for this subtopic weighted below 0.5 (aggregators, vendor blogs, off-topic results) and are recorded in the archive but not load-bearing here; where this doc cites a low-weight source it labels it, and none of its load-bearing claims rest on them.
