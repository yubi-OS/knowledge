# 02 - The 10-primitive spine

Scope: the 10 primitives that recur across the four source domains, each primitive's one-paragraph definition, what each of the four sources contributes to it, and where they diverge.

Ground source: yubi-OS/yubiOS skills/internal-big-picture/SKILL.md (source doc). This subtopic is an internal-record subtopic, no dig: the spine is the source doc's own synthesis and every attribution below is to it.

## The honesty note first

The 10 primitives are observed co-occurrence patterns: each appears in 2 or more of the four sources. They are not a normative taxonomy. The source doc flags this explicitly, and one of its red flags is treating the 10 as canonical so a new 11th primitive becomes "off-model" (source doc). Naming an 11th primitive is fine; updating the spine and the mapping table together is the requirement.

## The primitives

1. **Attestation / measurement.** Producing cryptographically verifiable evidence about the state of a system, artifact, or action. Chronicle contributes UDM-normalized events with derived provenance but no native attestation. HITRUST does not use the concept; it attests controls, not systems. CISA treats device attestation as an architecture-level capability in the Devices pillar (NIST 800-207 reference architectures name it). 0pointer is explicit: Design Goal #4, TPM2 PCR measurements bind the LUKS2 key to the running OS, IMA and dm-verity extend the chain. Divergence: runtime machine-generated cryptographic evidence (Chronicle, 0pointer) versus architecture capability (CISA) versus third-party human assessment (HITRUST).

2. **Trust chain / root of trust.** The ordered list of who attests to what, terminating in a root the system does not question. Chronicle terminates in Google Cloud (CMEK extends it). HITRUST terminates in the assessor plus MyCSF plus HITRUST Alliance. CISA terminates in IdP plus device plus resource per request. 0pointer terminates in UEFI firmware, bootloader, UKI, dm-verity /usr, TPM2 PCR, LUKS2-bound root. yubiOS delta: YubiKey PIV slot 9c replaces TPM2 at the user identity layer; fTPM via OP-TEE retains the platform measurement layer. Divergence: Poettering's chain is the only fully cryptographic hardware-rooted one; HITRUST's is the only human-in-the-loop one.

3. **Least privilege / per-request / granular.** Restricting authority to the smallest scope at the smallest granularity. Granularity differs by what is being privileged: data rows (Chronicle Data RBAC), control implementations (HITRUST), access requests (CISA), I/O operations (0pointer, dm-verity on every I/O, portable services in their own RootImage namespace, RestrictFileSystemAccess= limiting services to dm-verity-protected filesystems in v261).

4. **Declarative policy / configuration.** Desired state expressed as data, not procedural code. All four converge: YARA-L rules (Chronicle), the control library of "shall" statements plus assessment rubric (HITRUST), the ZTMM v2.0 maturity matrix plus cross-cutting capabilities (CISA), mkosi.conf INI, systemd-repart partition definitions, UKI sections, yubiOS.bb and yubiOS.rego (0pointer). Divergence: Poettering is most concrete (INI becomes a disk image); HITRUST is most abstract.

5. **Continuous / adaptive / threat-adaptive.** Re-evaluation as conditions change rather than one-time certification. "Adaptive" means runtime detection for Chronicle, control-library evolution under PRISMA for HITRUST, controls that change over time for CISA, and the deployment lifecycle (continuous measurement, auto-updating images, factory reset) for 0pointer. Note the source doc's correction: HITRUST v11.x frames this as the PRISMA 5-level maturity framework (Policy, Process, Implemented, Measured, Managed), not the retired v0-era "Cyber Threat Adaptive engine" term.

6. **Immutability / hermetic.** The unit of integrity is verified at rest and stays that way. 0pointer is the only source that treats immutability as load-bearing: /usr immutable, reproducible images, A/B partitions, sysext overlayfs on a read-only base. Chronicle, HITRUST, and CISA do not address it directly (microsegmentation is not immutability). yubiOS inherits this: dm-verity on /usr, signed UKI, A/B slots, factory reset.

7. **Audit / evidence.** The record by which the system can be re-examined later. The structural divergence is the sharpest in the spine: 0pointer's audit is mathematical (a dm-verity Merkle root reflects every byte), while the other three are event-based (HITRUST assessor report and RDS API, CISA continuous monitoring and its cross-cutting capabilities, Chronicle audit logging of every case and alert action).

8. **Cryptographic identity.** Authority rooted in a key, not a claim. 0pointer/yubiOS identity is hardware-rooted and locally generated (TPM2, then YubiKey PIV slot 9c for boot signing, FIDO2 hmac-secret for disk and home unlock, pam-u2f for SSH and sudo); Chronicle and CISA delegate identity to IdPs (with CISA blessing phishing-resistant MFA); HITRUST encodes it as the IA control family mapped to NIST 800-53 r5.

9. **Segmentation.** Boundaries that constrain what can interact with what. Artifact-level (0pointer: DPS partitions, portable services, sysext), network-level (CISA microsegmentation), control-level (HITRUST network segmentation control), data-level (Chronicle Data RBAC). yubiOS stacks all four layers, and adds process-level segmentation via IMA and BPF-LSM.

10. **Self-describing / discoverable.** The unit of integrity carries enough metadata that external tools can validate it without out-of-band knowledge. The unit differs per source: events (Chronicle UDM), controls (HITRUST authoritative-source mappings), models (CISA ZTMM structure), images and partitions (0pointer Design Goal #5: DPS type UUIDs, PCR signatures, Verity root hashes).

## How to use the spine

The spine is a lookup, not a claim generator. When a decision is analyzed (doc 06), the synthesis step names which primitives are load-bearing for that decision. Every primitive invocation must still be backed by a citation to the source that uses the primitive; the spine tells you where to look, it does not replace the look (source doc, anti-pattern "10-primitive cargo cult").
