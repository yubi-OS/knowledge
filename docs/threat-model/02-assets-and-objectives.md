# 02 Assets and Security Objectives

Scope: the asset and security-objective inventory the model protects: for each asset, the required property and the consequence if that property is lost. This is an internal-record subtopic: the content is the source doc's own table, and no searXNG dig was run for it.

Grounding spine: yubi-OS/yubiOS docs/THREAT_MODEL.md (source doc), https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/THREAT_MODEL.md

## The inventory

The source doc lists 9 assets or objectives. The consequences column is the part that drives severity calibration later in the model: an attacker story is rated by which consequence it reaches (source doc).

1. YubiKey PIV private key and enrolled Secure Boot certificate. Required properties: non-exportability, authorized use, correct enrollment, and protected signing ceremony. If lost: attacker-controlled boot artifacts may be accepted as owner-authorized (source doc).

2. FIDO2 credentials, PINs, and recovery keys. Required properties: confidentiality, phishing-resistant use, revocability, and recoverability. If lost: disk, home, SSH, or privileged-session compromise, or permanent owner lockout (source doc).

3. Root, swap, and user-home plaintext. Required properties: confidentiality while powered off, least exposure while unlocked. If lost: disclosure of credentials, personal data, build secrets, and administrative material (source doc).

4. Boot chain and immutable `/usr`. Required properties: authenticity, integrity, anti-rollback policy, and fail-closed verification. If lost: persistent pre-login compromise or subversion of every higher-layer control (source doc).

5. ARM64 ROTPK, RPMB state, fTPM NV, and UEFI variables. Required properties: correct provisioning, integrity, freshness, and device binding. If lost: false measurement, key substitution, rollback, or a broken owner-controlled platform root (source doc).

6. OCI, UKI, disk-image, and firmware release artifacts. Required properties: reproducible provenance, approved inputs, platform separation, and authentic publication. If lost: fleet-wide or cross-install supply-chain compromise (source doc).

7. CI credentials, registry credentials, and repository controls. Required properties: least privilege, branch integrity, auditability, and resistance to untrusted contributions. If lost: unauthorized builds, tags, attestations, or releases (source doc).

8. Update and recovery path. Required properties: atomicity, rollback safety, authenticity, and availability. If lost: persistent malicious update, downgrade, boot loop, or unrecoverable device (source doc).

9. Administrative identities and active sessions. Required properties: correct PAM/SSH authorization, physical presence, and session isolation. If lost: local or remote privilege escalation despite possession-based controls (source doc).

## How the model uses this table

The inventory is deliberately not a list of files or devices. It pairs every asset with a required property so that a vulnerability can be judged against a property, not against an artifact name. Two structural observations follow from the table itself (all source doc):

- Identity assets (items 1, 2) and platform-root assets (item 5) are the only assets whose loss enables accepting new attacker-authorized boot artifacts. Every other loss path starts downstream of an accepted boot chain.

- The consequence for item 6 is the only fleet-scale entry: a flaw that corrupts release artifacts or publication compromises every installation that consumes the release, which is why the supply-chain boundary gets its own attacker stories.

## Note on status

The source doc states it models the intended system and explicitly distinguishes documented controls from controls that still need hardware or implementation validation, and that it is not evidence that every control is implemented correctly (source doc). The asset table inherits that status: the required properties are normative targets, and some of them (for example RPMB-backed NV freshness on ARM64 Path A) are tied to hardware validation that has not been demonstrated on real boards yet (source doc).
