# 09 Severity Calibration

Scope: how the model assigns Critical, High, Medium, and Low severity, including the raise and lower factors and the boundary examples for each tier. This is an internal-record subtopic: no searXNG dig was run for it.

Grounding spine: yubi-OS/yubiOS docs/THREAT_MODEL.md (source doc), https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/THREAT_MODEL.md

## The base rule

Severity is based on the strongest realistic deployment described by the repository while accounting for maturity (source doc). Two factor lists modify the base judgment.

Raise severity when an issue (source doc):

- Is remotely triggerable.
- Affects default production images.
- Crosses from untrusted input into release or pre-boot authority.
- Persists below or around the signed UKI.
- Affects both architectures or an entire release channel.
- Defeats independent controls such as both artifact authenticity and YubiKey presence.

Lower severity when the path (source doc):

- Is TEST-only.
- Is Path B-only and accurately labeled.
- Requires prior root or malicious firmware already outside the boundary.
- Depends on deliberate owner misconfiguration.
- Only weakens non-authoritative telemetry.

## Critical

Critical stories (source doc):

1. A repository/CI/release flaw lets an untrusted contributor publish an attacker-controlled production image or firmware bundle that passes the normal trust and signing path for many installations, without a second trusted approval.
2. A verification or key-management flaw remotely or persistently defeats the owner-controlled boot chain and enables pre-unlock code to capture owner data or authorize arbitrary future boots across affected devices.
3. A production/dev separation failure ships a known TEST authenticator or universal bypass in the production channel and permits disk unlock or administrative authentication without the owner's credential.

The model adds a calibration note: critical generally requires broad, durable compromise of the platform or release root of trust. A bug confined to an explicitly non-production VM or unprovisioned Path B board is not critical merely because similar code may later be used in Path A (source doc).

## High

High stories (source doc):

1. A local physical attacker can bypass enforced Secure Boot or FIDO2-gated LUKS and recover protected data from a powered-off production device without the token, PIN, or recovery key.
2. A malicious registry response can select a vulnerable or attacker-controlled but otherwise well-formed update because production lacks effective authenticity, channel, architecture, or anti-rollback enforcement.
3. An unprivileged process in a normal active session can reach root, cross into another encrypted home, use PIV signing authority, or persist into a trusted boot path.
4. A first-boot, firmware-inspection, or provisioning flaw with realistic inputs grants code execution at its broad raw-hardware privilege or irreversibly installs attacker-controlled keys.

The model's note: high impact is often limited to one device or requires physical access, but it defeats a primary security promise or produces durable privileged compromise (source doc).

## Medium

Medium stories (source doc):

1. A sandbox or writable-state flaw requires an already authenticated local account but enables meaningful persistence, access beyond that account, or weakening of a later authentication step without immediately defeating Secure Boot or disk encryption.
2. A boot-health or recovery bug causes reliable device lockout or corrupts one update slot but leaves a documented offline recovery path and does not expose plaintext or keys.
3. Attestation or CHIPSEC output can be misinterpreted as stronger evidence than it is, leading an operator to trust a Path B or OEM-firmware system, while no direct verification bypass is demonstrated.
4. Sensitive but non-key metadata, PCR/event-log information, or operational details leak across a local boundary and materially aid a follow-on attack.

## Low

Low stories (source doc):

1. A hardening directive is absent from a service that already requires root-equivalent control to exploit, with no additional secret exposure, persistence, or boundary crossing.
2. A documentation, CI-message, or warning bug inaccurately describes a non-production control but does not alter artifacts, enrollment, or operator security decisions in a realistic path.
3. A denial of service is temporary, local, and resolved by an ordinary reboot or re-run without weakening authentication or risking data loss.
4. A cryptographic-agility or hybrid-PQ assertion regresses in a way that does not downgrade classical authentication or confidentiality under the current threat model.

## Applying the calibration

The calibration is boundary-driven, consistent with the invariant evaluation rule. The raise factors reward crossing a boundary (into release authority, pre-boot authority, or another user's data), and the lower factors reward staying inside an honestly labeled weaker environment. The maturity rule from the attack-surface doc connects here: proposed or detection-only controls and unvalidated hardware paths cannot lower severity by claiming protection they have not proven (source doc).
