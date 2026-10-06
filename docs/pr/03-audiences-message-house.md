# 03 - Audience priorities and message house

Scope: the 4-tier audience priority table with desired actions per audience, and the message house that turns the thesis into a category, a core promise, 5 supporting pillars, a 5-rung narrative ladder, and fixed-length descriptors.

Grounding spine: yubi-OS/yubiOS docs/PR.md, sections "Audience priorities" and "Positioning and message house". Internal-record subtopic, no dig; all claims are source-doc claims.

## Audience priorities

The document ranks audiences in 4 tiers, each with what they care about and the desired action (source doc: yubi-OS/yubiOS docs/PR.md):

| Priority | Audience | What they care about | Desired action |
|---:|---|---|---|
| 1 | Linux boot, systemd, bootc, storage, and security engineers | Correct composition, reproducibility, failure behavior | Review the architecture, reproduce a proof, file precise issues |
| 1 | ARM64 firmware, TF-A, OP-TEE, U-Boot, and board engineers | Real-board feasibility, fuse/RPMB evidence, recovery | Help select and validate the first Path A board |
| 1 | YubiKey, FIDO2, PIV, and local-auth practitioners | Interface correctness, token policy, recovery, human presence | Review enrollment and hardware-in-the-loop flows |
| 2 | Open-source supply-chain practitioners | Pins, policy, provenance, SBOM verification, release separation | Audit the release path and contribute verification |
| 2 | Security-conscious owner-operators and homelab builders | Control, recoverability, transparent limits | Join a clearly labeled technical preview |
| 3 | Security and Linux press | A timely, evidenced change in how system trust is framed | Cover a milestone, not a promise |
| Later | Enterprise buyers and general consumers | Supportability, hardware matrix, lifecycle, guarantees | Wait until production gates and ownership model are defined |

Three priority-1 audiences are all engineering-adjacent: the campaign's first currency is review and reproduction, not coverage. Press is priority 3 and is asked to cover a milestone, not a promise. Enterprise and consumer audiences are parked entirely until production gates and the ownership model are defined.

## Category and core promise

- Category: FIDO2-first, owner-controlled, image-based Linux (source doc).
- Core promise: Put the owner back in the trust chain (source doc).

## Supporting pillars

Each pillar pairs a message with the evidence that must be shown alongside it (source doc):

| Pillar | Message | Evidence to show |
|---|---|---|
| Owner-held control | The key that authorizes owner actions is held by the owner, not silently embedded in the board | PIV signing demo, FIDO2 unlock demo, SSH resident key, required pam-u2f flow, recovery ceremony |
| Verifiable by structure | Trust is enforced through signed artifacts, verified OS content, pinned inputs, and auditable release metadata | Signed UKI verification, dm-verity failure demo, pin policy, provenance/SBOM verification, production/dev separation test |
| Honest platform boundaries | Owner identity and platform integrity are different roots with different guarantees | Path A/Path B matrix, x86-64 boundary, fTPM role, documented residual risks |
| Built in public | The project publishes decisions, threats, blockers, and failed runs instead of hiding them behind launch language | ADRs, threat model, blocker register, dated CI evidence, corrections and retrospectives |
| AI-resilient systems using AI | The build process may include AI, but deployed authority is meant to come from cryptographic verification and owner-held keys | Reproducible build evidence, review record, policy failures, signed artifacts; avoid implying that cryptography proves semantic safety |

The evidence column is the operative half: a pillar may not be spoken without its artifact.

## Narrative ladder

The ladder gives one idea at 5 levels of altitude; the document instructs using the level appropriate to the audience (source doc):

1. Human: "Your machine should ask for a key you control before it unlocks or accepts privileged identity."
2. Product: "yubiOS uses an owner-held YubiKey across Secure Boot signing, disk and home unlock, SSH, and PAM."
3. Technical: "PIV signs the UKI; FIDO2 hmac-secret gates LUKS2 without PCR-hash update lock-in; verified /usr and signed image delivery protect the operating-system content."
4. Platform: "ARM64 Path A aims to extend owner control below the UKI through TF-A, OP-TEE, RPMB-backed state, fTPM measurement, and U-Boot; that path is not production-proven yet."
5. Social: "Security defaults should not require an enterprise contract or an invisible vendor-controlled trust anchor."

## Short descriptors and boilerplate

- 12 words: "FIDO2-first immutable Linux, built around keys the machine owner controls." (source doc)
- 30 words: "yubiOS is an experimental, image-based Linux system that uses an owner-held YubiKey for signing, unlock, SSH, and local authentication while keeping platform measurement a separate, explicit trust boundary." (source doc)
- Boilerplate: yubiOS is an independent open-source project building a FIDO2-first, image-based Linux operating system around owner-held trust. A YubiKey provides the owner-facing signing, unlock, SSH, and local-authentication boundary; signed boot artifacts, verified operating-system content, pinned build inputs, and auditable release metadata protect the system around it. ARM64 is the primary long-term platform for an owner-provisioned chain below the unified kernel image, while x86-64 remains supported above OEM firmware. yubiOS is pre-launch and publishes its decisions, evidence, blockers, and residual risks in the open. (source doc)
- Independence line: yubiOS is an independent community project. It is not affiliated with, sponsored by, or endorsed by Yubico. YubiKey and Yubico are registered trademarks of Yubico AB. (source doc)

The document adds a guardrail around Yubico's brand: use the official brand assets and usage guidance at https://brandfolder.yubico.com/yubico/public only after a name and trademark review, and never imply partnership, certification, compatibility endorsement, or a review-unit relationship (source doc).
