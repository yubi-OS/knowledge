# 08 - Press kit, draft outreach, and interview FAQ

Scope: the press-kit checklist that must exist before briefings, the 2 draft outreach templates with their personalization rules, and the 9-question FAQ that pre-answers the hostile and honest questions.

Grounding spine: yubi-OS/yubiOS docs/PR.md, sections "Press-kit checklist", "Draft outreach", and "Interview and FAQ preparation".

## Press-kit checklist

12 items the kit must contain before outreach begins (source doc: yubi-OS/yubiOS docs/PR.md):

1. Project fact sheet with status, license, governance, tested platforms, and contact.
2. The 12-word, 30-word, and boilerplate descriptions from the campaign document itself.
3. High-resolution project logo plus documented license and source.
4. Yubico independence and trademark notice.
5. Architecture diagram showing owner identity root versus platform integrity root.
6. Current claim ledger and evidence dashboard.
7. 3 screenshots: enrollment, verification output, and update/recovery status.
8. A 5-minute uncut demo and a 30-second silent clip for embedding.
9. Maintainer bios that omit unnecessary personal contact details.
10. FAQ, tested-hardware matrix, recovery guide, security policy, and contribution guide.
11. Release manifest with commit, artifact digests, provenance, SBOM, test run, and known gaps.
12. Captioned media and alt text for every visual.

## Draft outreach

### Technical media pitch

Subject line: "Evidence, not a launch claim: using one owner-held key across Linux signing and unlock" (source doc). The body template (source doc) states that yubiOS is an independent, pre-launch Linux project exploring a specific trust model, a YubiKey as the owner-facing gate for UKI signing, LUKS2 and home unlock, SSH, and PAM while platform measurement remains a separate root with explicitly bounded guarantees, then inserts a milestone and named hardware and links an evidence URL with commands, logs, signatures, artifact digests, recovery result, threat model, and gaps. It closes by offering a live demo and on-record technical questions.

The personalization rules attached to it: personalize the first 2 sentences for the recipient's recent work, never attach an unsolicited binary, and never write "just following up" more than once (source doc).

### Community post

Suggested title: "Show HN: yubiOS, an experimental Linux trust chain built around an owner-held YubiKey" (source doc). The body template states the narrow idea (the credential that authorizes owner actions should live with the owner while platform integrity is measured and described separately), maps the mechanism (PIV signs the UKI; FIDO2 hmac-secret gates disk and home unlock; resident FIDO2 credentials cover SSH; pam-u2f covers local privilege; the OS side is image-based and intended to verify /usr), and states 3 negatives outright: not production-ready, not affiliated with Yubico, and not a claim that firmware or runtime compromise disappears. It links the current proof, failed assumptions, and blocker list, and asks for review from 2 specific expertise areas (source doc).

## Yubico brand corroboration from the dig

The source doc requires using Yubico's official brand assets and usage guidance only after a name and trademark review (source doc). The dig confirms the assets live at the official Brandfolder collection (https://brandfolder.yubico.com/yubico/public, jev weight 0.7) with a separate marketing-assets collection (https://brandfolder.yubico.com/yubico/channel, jev weight 0.39, weak) and Yubico's own media-assets page (https://www.yubico.com/press/media-assets/, jev weight 0.61). Yubico's toolset software license agreement grants a right to use the Yubico trademarks under defined terms (https://www.yubico.com/support/terms-conditions/yubico-toolset-software-license-agreement/, jev weight 0.89), and Yubico's copyright guidance page covers the trademark notice expectations (https://docs.yubico.com/hardware/yubikey-guidance/best-practices/copyright.html, jev weight 0.7). Third-party aggregator listings exist but are weak-weighted and are not used for claims (https://brandfetch.com/yubico.com, jev weight 0.12).

## FIDO2 hmac-secret corroboration from the dig

The FAQ's technical claims about FIDO2 unlock map to primary documentation: Yubico's own documentation covers the FIDO2 hmac-secret and hmac-secret-mc extensions and their firmware-version dependence (https://docs.yubico.com/yesdk/users-manual/application-fido2/hmac-secret.html, jev weight 0.91), and Yubico's CTAP2 HMAC Secret Deep Dive describes the same extension as the substrate for system-level secret release beyond web authentication (https://developers.yubico.com/WebAuthn/Concepts/PRF_Extension/CTAP2_HMAC_Secret_Deep_Dive.html, jev weight 0.83). A Microsoft explainer on what FIDO2 protects against (phishing and credential theft by keeping keys on the device, https://www.microsoft.com/en-us/security/business/security-101/what-is-fido2, jev weight 0.6) is background only. The dig also surfaced community tooling for hmac-secret workflows (https://github.com/dido/fido2-hmac-secret, jev weight 0.31, weak), cited only to show the mechanism is used in practice.

## Interview and FAQ preparation

The 9 prepared answers, all source-doc claims (source doc):

1. Why not use a TPM? The project does use TPM/fTPM measurement where it is useful. It avoids making a board-bound TPM the sole owner-facing disk-unlock or identity gate. The YubiKey answers whether the owner is present; platform measurement answers what booted.
2. Is yubiOS affiliated with Yubico? No. It is an independent open-source project. YubiKey and Yubico are Yubico trademarks. Do not suggest endorsement or certification.
3. Is it production-ready? No. Use the current gate label and link the blocker register. State exactly which hardware and flows have been reproduced.
4. What happens when the key is lost? Recovery material and backup-token enrollment are mandatory parts of the design. A campaign demo must show recovery, not merely describe it.
5. Does a YubiKey prove that a safe OS requested the unlock secret? No. FIDO2 possession and interaction do not attest the requesting OS. That is why the enforced boot chain and honest firmware boundary matter.
6. Does immutability stop all malware? No. It protects covered operating-system bytes and can make durable replacement harder. It does not protect mounted plaintext from sufficiently privileged malware in an active session or automatically secure writable state.
7. Does provenance prove the artifact is safe? No. Provenance explains where, when, and how an artifact was produced. It supports verification and investigation; it does not make malicious source benign.
8. Why ARM64 first? Selected ARM64 boards offer a plausible owner-provisioned firmware and secure-world path below the UKI. Ordinary x86-64 machines still depend on OEM firmware beneath the owner-controlled boundary.
9. Why build an AI-resilient system using AI? Because authorship is not a sufficient trust primitive. The project is testing whether signed artifacts, verified content, explicit policy, public threat models, and owner-held keys can constrain authority even when contributors or tools are fallible. That is a design goal, not a claim of immunity.

Answers 5, 6, and 7 are the load-bearing ones: each converts a likely audience assumption into an explicit boundary, which is the campaign's proof-first posture applied to interviews (source doc).
