# 04 - Per-source vocabulary and cross-source traps

Scope: the canonical vocabulary each of the four sources uses for the same underlying concepts, the explicit NOT-used lists per source, and the 5 semantic traps where the same English word means structurally different things.

Ground source: yubi-OS/yubiOS skills/internal-big-picture/SKILL.md (source doc). This is an internal-record subtopic, no dig: the glossary is the source doc's own synthesis.

## Why a glossary exists at all

The 10 primitives are observed-co-occurrence patterns across four sources, and each source names them differently. The most common failure mode is mixing terms silently: answering a Chronicle question with HITRUST words, or a 0pointer question with CISA words. The rule is to use the canonical term of the source you are speaking for, and never borrow (source doc).

## Chronicle vocabulary (security telemetry / SIEM)

- UDM (Unified Data Model): the normalized event schema for all ingested events; fields carry the entity, the action, and the metadata.
- YARA-L: the detection language. Rule sections: meta, events, match, outcome, condition.
- Data RBAC: data-level access control at row plus column level, not feature-level.
- Applied Threat Intelligence: the continuously-updated detection feed; external IOC rules pushed into the environment.
- case / alert: the investigation unit and the detection unit.
- NOT used: HITRUST-style "controls", CISA-style "pillars/stages", 0pointer-style "design goals/UKI/PCR".

## HITRUST CSF vocabulary (compliance assurance, v11.x)

- control category: top-level grouping, 14 in v11.x.
- control objective: the "what" being controlled, 49 in v11.x.
- control specification: the implementation guidance, 156 in v11.x, expressed as "shall" statements.
- PRISMA: the maturity model, 5 levels (Policy, Process, Implemented, Measured, Managed), evaluated per control.
- compliance level: the assessment strictness, 5 levels in v11.x.
- RDS (Results Distribution System): the API for sharing assessment results with third parties.
- MyCSF: the web-based assessment tool.
- inheritable control: a control satisfied by a parent organization and inherited by the customer.
- NOT used: Chronicle's UDM/YARA-L, CISA's maturity "stages", 0pointer's "design goals".

## CISA ZTMM vocabulary (federal security doctrine, v2.0)

- pillar: the 5 functional areas (Identity, Devices, Networks, Applications+Workloads, Data).
- cross-cutting capability: applies across all pillars; 3 in v2.0 (Governance; Visibility and Analytics; Automation and Orchestration).
- maturity stage: Traditional, Initial, Advanced, Optimal (4 in v2.0).
- ZT architecture (ZTA): NIST SP 800-207's reference architecture.
- policy decision point (PDP) / policy enforcement point (PEP): NIST ZTA components.
- phishing-resistant MFA: the CISA-blessed authentication standard (FIDO2/WebAuthn, PKI smartcard).
- NOT used: HITRUST's "control specifications", Chronicle's "YARA-L", 0pointer's "design goals/UKI/PCR".

## 0pointer / systemd vocabulary (image-based OS architecture, systemd v261)

- design goal (DG): Poettering's enumerated principles, 17 in "Fitting Everything Together"; DG#1 image-based, DG#4 cryptographic measurement, DG#5 self-descriptive.
- UKI (Unified Kernel Image): single PE binary containing kernel plus initrd plus cmdline plus sections.
- PCR: TPM2 measurement slots; PCR 11 for UKI measurements, PCR 12 for cmdline.
- DPS (Discoverable Partitions Specification): GPT partition type UUIDs encoding mount and role.
- dm-verity: kernel block-device integrity checker, on-access Merkle-tree verification.
- UKI sections: .linux, .initrd, .cmdline, .pcrsig, .uname, and others; measured into PCR 11 except .pcrsig.
- boot phase: initrd-enter, initrd-leave, sysinit, complete; measured into PCR 11 to bind secrets to phase.
- portable service: RootImage= runs a unit from a signed GPT image as its own root.
- sysext: systemd-sysext overlays a signed GPT image onto /usr via overlayfs.
- homectl: systemd-homed's CLI; per-user LUKS2 homes with FIDO2 unlock.
- RootMStack= (v260+): overlayfs mount stack layered per service.
- RestrictFileSystemAccess= (v261): BPF-LSM directive limiting a service to dm-verity-protected filesystems.
- NOT used: HITRUST's "control objectives", CISA's "maturity stages", Chronicle's "YARA-L/UDM".

## The 5 cross-source semantic traps

1. **stage** - CISA uses it (4 maturity stages). HITRUST uses it informally (5 compliance levels, sometimes called stages). 0pointer uses it (boot phases). Never mix.
2. **control** - HITRUST: a control specification is implementation guidance. 0pointer: RestrictFileSystemAccess= is a BPF-LSM control but a directive, not an assurance control. CISA uses it informally. A different sense in each.
3. **attestation** - CISA: device attestation, architecture-level. 0pointer: TPM2 PCR measurement, runtime. HITRUST does not use the word for systems (it attests controls). Chronicle has no native attestation.
4. **identity** - all four use the word with different scopes: CISA (Identity pillar, phishing-resistant MFA), 0pointer (YubiKey/TPM2 identity root), HITRUST (IA control family, organizational identity management), Chronicle (UDM identity field).
5. **evidence** - HITRUST (assessor report), CISA (continuous monitoring), 0pointer (dm-verity Merkle root), Chronicle (audit log). Each is structurally different: third-party human versus sensor versus cryptographic versus event-stream.

## Worked illustration of a trap

The source doc's worked example ends on exactly this point: HITRUST's IA control family is about organizational identity management (provisioning, deprovisioning), while CISA's Identity pillar is about authentication primitives. yubiOS's YubiKey FIDO2 lives in the CISA sense, not the HITRUST sense; HITRUST would map FIDO2 to control 01.b (authentication) (source doc). Saying "the FIDO2 assertion is an identity control" in a HITRUST POV blends vocabularies; the correct HITRUST phrasing maps it to a control specification, while the correct CISA phrasing places it in the Identity pillar.
