# 04 - Portraits of decisions and defenses (ADR.md, MITIGATE.md)

Scope: how the source doc reads ADR.md as decisions (permanent records amended, not rewritten; ADR-001 as the load-bearing choice; trade-offs recorded in public) and MITIGATE.md as defenses (attack-chain response, residual-risk honesty, absence-as-defense). Grounding spine: source doc, yubi-OS/yubiOS docs/SOUL.md, sections 5 and 6. External mechanisms (the ADR practice, PIV slot 9c signing) are backed by searXNG digs.

## Decisions: permanent records with rationale

The source doc opens the ADR.md portrait with the facts: "ADR.md is 32+ records. Each ADR: Context, Decision, Rationale, Trade-offs, Consequence, sometimes Amendment" (source doc, section 5). The first record sets the thesis: "Use the YubiKey 5 series as the sole trust anchor" (source doc, section 5).

The discipline is permanence: "my decisions are permanent records with rationale. I am not allowed to forget why I chose what I chose. ADRs are amended, not rewritten. When ADR-002 was reviewed against today's BLOCKERS.md in 2026-07-28, the amendment note is appended, not substituted. The original decision is preserved" (source doc, section 5).

The structure is load-bearing: "ADR-001 is the load-bearing decision. Every later ADR either presupposes it (ADR-002 PIV signing, ADR-003 LUKS2 FIDO2, ADR-004 ed25519-sk SSH) or amends the surface around it (ADR-022 unified artifact tagging, ADR-031 vGPU/vfio-user trust boundary, ADR-032 kernel+rootfs split). The amendment discipline means the corpus grows by accretion, not by rewriting" (source doc, section 5).

The ADR practice the corpus uses is the standard industry pattern: an architecture decision record captures a significant design decision, its context, and its consequences so that future maintainers can understand not just what was decided but why (Microsoft Azure Well-Architected Framework guidance on ADRs, https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, jev weight 0.83; AWS Prescriptive Guidance ADR best practices, https://aws.amazon.com/blogs/architecture/master-architecture-decision-records-adrs-best-practices-for-architects/, jev weight 0.58).

The mind reading: "my memory is durable. When I change my mind, the change is documented. When someone asks 'why this and not that,' the answer is in the ADR. ADR.md is the proof I have a mind, not just a behavior" (source doc, section 5). And the error-discipline: "ADRs also expose what I am willing to be wrong about: ADR-003 explicitly rejects TPM-PCR-bound disk encryption (ADR-011), a trade-off the project took consciously. The discipline of recording trade-offs is the discipline of being honestly wrong in public" (source doc, section 5).

## Defenses: attack chain plus residual risk

The source doc reads MITIGATE.md as two documents in one. The first half "is a response to a specific attack chain (Faux Phy / Phe Phum v1.05 by Shant Tchatalbachian, the 0mniteck collaborator). The attack chain has three steps: OEM persistence, pre-init hijack, runtime control. Each step has named sub-attacks with mapped controls. The legend distinguishes Block / Detect / Reduce / Contain / Immune" (source doc, section 6). The second half "is the mitigation matrix. Threat + mitigation + residual risk. Each row is auditable: the residual risk column is where I am honest about what I cannot do" (source doc, section 6).

## Absence as defense

The portrait highlights the immunity entries: "'TEE / tz.uefisecapp MitM': 'yubiOS uses YubiKey FIDO2 as trust anchor: no TrustZone/TEE. There is no tz.uefisecapp equivalent to compromise. Compromising the TEE does not unlock the LUKS2 root fs.' 'Passphrase capture via framebuffer': 'LUKS2 disk unlock uses YubiKey FIDO2 hmac-secret: no typed passphrase.' These are not controls. They are absences that produce immunity. The discipline of identifying absence-as-defense is one of the more subtle things in the corpus" (source doc, section 6).

The mechanism behind those absences is concrete. YubiKey PIV slots are hardware-resident asymmetric key slots on the device whose private keys cannot be exported; the Yubico PIV documentation defines slot 9a for authentication and 9c for digital signing, with private keys generated and stored on the device itself (https://developers.yubico.com/PIV/Introduction/Certificate_slots.html, jev weight 0.84; https://docs.yubico.com/yesdk/users-manual/application-piv/slots.html, jev weight 0.88). Because the key material lives in hardware and never leaves it, attacks that would capture a typed passphrase or a copyable secret have nothing to capture.

## Honest defense: admitting the limits

The "What yubiOS Cannot Fully Prevent" table is the soul-portrait of MITIGATE.md: "Five rows: OEM ROM Absolute Persistence, hardware radio ignoring OS power commands, novel kernel CVEs, qcom firmware sideload, UEFI firmware supply chain root. Each row has a Reason and a Path Forward. The honest version of the mitigation matrix" (source doc, section 6).

The reading: "my defense includes admitting the limits of my defense. If I claim to prevent what I cannot, that claim itself becomes an attack surface. Honesty about gaps is a control. The table is the practice of that control" (source doc, section 6).

## What this portrait captures about the project's character

The decisions-defenses pair captures two character traits: memory and honesty. Memory, because 32+ records with Context, Decision, Rationale, Trade-offs, and Consequence mean the project cannot quietly forget why it chose YubiKey-as-sole-anchor, and every later decision must either presuppose that anchor or amend around it in writing (source doc, section 5; ADR practice backed at https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, jev weight 0.83). Honesty, because the mitigation matrix spends its residual-risk column on what cannot be done, and even classifies structural absences (no TEE, no typed passphrase) as defenses worth recording (source doc, section 6).

## Sources

Grounding spine: source doc, yubi-OS/yubiOS docs/SOUL.md sections 5 and 6. Digs: https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record (0.83), https://aws.amazon.com/blogs/architecture/master-architecture-decision-records-adrs-best-practices-for-architects/ (0.58), https://docs.yubico.com/yesdk/users-manual/application-piv/slots.html (0.88), https://developers.yubico.com/PIV/Introduction/Certificate_slots.html (0.84).
