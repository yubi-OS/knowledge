# 07 Attack Surface, Mitigations, and Attacker Stories

Scope: the control-maturity tiers and the 15 principal attacker stories, each with its existing controls and residual risk, plus the external mechanisms the controls depend on: systemd-cryptenroll FIDO2 enrollment for LUKS2, the FIDO2 hmac-secret mechanism, and CHIPSEC. This subtopic is web-shaped: 2 searXNG queries were run.

Grounding spine: yubi-OS/yubiOS docs/THREAT_MODEL.md (source doc), https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/THREAT_MODEL.md

## Control maturity

The source doc sorts controls into 4 maturity tiers (source doc):

1. Architectural or normative requirement: owner-controlled signing, FIDO2 unlock, signed UKI, verified `/usr`, no TPM-only unlock, digest-pinned build inputs, production/dev separation, narrow privileged services.

2. Environment-dependent control: Secure Boot variable enforcement, TPM/fTPM measurement, `ConditionSecurity=measured-os`, kernel lockdown, BPF-LSM-backed filesystem restrictions, systemd service sandboxing, registry TLS/PQ negotiation.

3. Needs real-hardware or end-to-end validation: ARM64 Path A fuse state, TF-A/OP-TEE/U-Boot chain, RPMB-backed fTPM and UEFI NV, CoreSight/debug lockdown, recovery from interrupted provisioning, physical YubiKey ceremonies.

4. Proposed or detection-only: U-Boot FIDO2 console gate; CHIPSEC warning-mode inspection; automated Absolute/Computrace conclusions that MITIGATE.md says cannot currently be reliable.

The model's rule for tiers 3 and 4: they must not reduce severity as if they were proven preventive controls (source doc).

## External mechanisms behind the controls

Two control families in the attacker stories rest on documented external mechanisms. First, the disk-unlock path: systemd-cryptenroll is the upstream tool for enrolling hardware security tokens and devices into a LUKS2 encrypted volume, which may then be used to unlock the volume during boot, supporting FIDO2 tokens among others (https://www.freedesktop.org/software/systemd/man/latest/systemd-cryptenroll.html, jev weight 0.91). The FIDO2 `hmac-secret` extension is the mechanism underneath: when systemd enrolls a FIDO2 token into a LUKS volume, the token calculates an HMAC using a secret that never leaves the device and a salt provided by the user, and the result is used to unlock the volume (https://github.com/bertogg/fido2luks, jev weight 0.38, weak backing, labeled per the corpus rule). This mechanism is what the evil-maid story is really about: the secret release depends on the requesting OS, which the token cannot verify.

Second, firmware inspection: CHIPSEC is an open-source framework for analyzing the security of PC platforms including hardware, system firmware (BIOS/UEFI), and platform components, with a security test suite, low-level access tools, and forensic capabilities (https://github.com/chipsec/chipsec, jev weight 0.71). Its documentation describes modules for testing hardware protections, firmware vulnerabilities, and platform configuration (https://chipsec.github.io/, jev weight 0.80). The source doc's residual-risk note aligns with this scope: CHIPSEC needs raw hardware access, and its warning-mode output is detection-only.

## The principal attacker stories

The source doc carries 15 attacker stories. Summarized with controls and residual risk (all source doc):

1. Source and dependency supply chain. Story: a compromised maintainer, Action, base image, package source, or firmware fork injects code that is built and published as yubiOS. Controls: approved SHAs and image digests in `PINNED.md`; strict `yubiOS.rego` policy; immutable commit tags; provenance and SBOM generation. Residual: a digest pins identity, not trustworthiness or freshness; review token scope, untrusted-PR execution, pin-update authorization, builder isolation, provenance verification, and whether one identity can both change policy and publish.

2. Signing and release. Story: an attacker controls the host that invokes the YubiKey PIV key, tricks the owner into authorizing a malicious UKI, or substitutes the enrollment certificate. Controls: non-exportable PIV key in slot 9c, owner-enrolled Secure Boot db, `systemd-sbsign`, `sbverify` checks. Residual: non-exportability does not prevent unauthorized signing through a compromised host; verify PIV PIN/touch policy, ceremony confirmation, certificate replacement, revocation, and separation between build approval and signing.

3. Registry and update selection. Story: a network or registry attacker serves an old, wrong-platform, development, or malicious image and attempts to make it boot. Controls: TLS, digest-addressable references, production/test tag separation, signed UKI, dm-verity, provenance/SBOM, A/B fallback. Residual: mutable `latest` is a selection risk; signing may not enforce freshness or channel; verify signed update metadata, anti-rollback state, architecture binding, and that `dev`/swu2f content can never reach production tags.

4. ARM64 platform provisioning. Story: a malicious board, provisioning tool, or operator error burns the wrong ROTPK, leaves debug enabled, uses volatile rather than RPMB-backed NV, or labels Path B as Path A. Controls: explicit Path A/Path B classification, owner-burned ROTPK design, TBB, OP-TEE, fTPM, StandaloneMM, sacrificial-board rehearsal. Residual: fuse changes may be irreversible and real-board proof is incomplete; provisioning must verify before burning, read back state, bind artifacts to the board, lock debug paths, and provide a tested recovery/abort procedure.

5. x86-64 or Path B firmware. Story: compromised OEM firmware or a measured-but-not-enforced stage lies about measurements, tampers with input, or loads a valid but attacker-selected UKI. Controls: owner-enrolled Secure Boot above firmware, PCR measurements where available, signed UKI, explicit documentation of the weaker boundary. Residual: measurement is not prevention; findings below the unowned boundary may be out of remediation scope but remain decisive limitations.

6. Evil-maid boot and FIDO2 secret release. Story: a physical attacker changes firmware, boot UI, or early userspace so the next owner PIN/touch releases a valid FIDO2 `hmac-secret` to attacker-controlled code. Controls: Secure Boot, signed UKI, dm-verity, owner-controlled ARM64 chain where available, FIDO2 PIN and touch. Residual: FIDO2 proves possession and interaction, not the requesting OS identity; the attack is blocked only to the extent the complete pre-unlock chain is enforced.

7. Powered-off storage theft. Story: an attacker steals or images the disk and attacks root, swap, or homes offline. Controls: LUKS2, FIDO2 `hmac-secret`, client PIN, touch, per-user homed encryption, offline recovery key. Residual: recovery-key entropy/storage and LUKS parameters matter equally; theft of both token and PIN or weak recovery handling defeats the protection.

8. Active-session compromise. Story: a malicious app, remote service exploit, or local privilege escalation runs after unlock and reads mounted data or asks the token to perform authorized operations. Controls: per-user homes, SSH verification-required guidance, required pam-u2f flow, systemd sandboxing, immutable `/usr`, kernel lockdown. Residual: review token-presence caching, agent forwarding, socket and device ACLs, hidraw/CCID access, secret logging, and barriers between an unprivileged session and privileged token operations.

9. Writable-state persistence. Story: runtime root or a physical attacker alters `/etc`, `/var`, boot state, generators, credentials, or other writable inputs while `/usr` remains valid. Controls: verified read-only `/usr`, signed UKI command line, encrypted root state, DPS discovery, sandboxed services. Residual: dm-verity protects only covered bytes; inventory every writable input consumed before or during privileged startup.

10. First boot and enrollment. Story: an attacker exploits disk parsing, USB handling, firmware inspection, target selection, or a privileged script during the one-time setup window and enrolls attacker-controlled state. Controls: `ConditionFirstBoot=yes`, measured-OS expectation, one-shot services, scoped raw hardware access, re-runnable enrollment steps. Residual: first boot combines maximum privilege with untrusted hardware and operator input; verify fail-closed preconditions, idempotence, atomic writes, safe target identification, secret-free logs, rollback, and YubiKey-removal behavior.

11. TPM/fTPM and attestation. Story: a compromised secure world, replayed NV state, incorrect PCR policy, or forged event interpretation makes a bad boot look acceptable. Controls: owner-owned ARM64 fTPM design, RPMB-backed production state, PCR 11 boot-phase measurement, measured-OS conditions, YubiKey kept as the unlock gate. Residual: TPM evidence is only as trustworthy as firmware, NV freshness, event replay, and verifier policy; volatile CI NV and OEM TPMs must not be treated as production-equivalent.

12. Authentication and recovery. Story: a PAM ordering error, version regression, emergency shell, SSH option, or recovery flow bypasses PIN/touch or grants privilege after token loss. Controls: pam-u2f 1.3.1+, `required` PAM entries, resident `ed25519-sk` keys, PIN verification guidance, separate recovery material. Residual: test every applicable PAM stack and failure mode, including absent token, wrong PIN, locked token, offline boot, recovery boot, and package upgrade; recovery must restore availability without becoming the easiest authentication path.

13. Update health and rollback. Story: a faulty or malicious update boots far enough to mark itself good, corrupts both slots, or forces a downgrade to a known-vulnerable but valid image. Controls: separate A/B `/usr` slots, three-attempt boot counter, health validation, `bootctl set-boot-good`. Residual: health checks are availability controls, not proof of integrity; protect the boot-good signal, preserve a known-good slot, authenticate all update metadata, and define minimum acceptable versions.

14. Firmware inspection service. Story: an attacker abuses CHIPSEC's raw hardware access or treats warning-only output as a security verdict. Controls: one-shot service, first-boot and measured-OS gates, explicitly scoped raw access, optional fail-closed fleet policy. Residual: a parser or command-injection flaw here has unusually high impact; CHIPSEC cannot reliably prove absence of Absolute/Computrace, and informational evidence must not be presented as a clean bill of health.

15. Availability and denial of service. Story: an attacker or accident locks the YubiKey, exhausts boot attempts, corrupts writable state, fills partitions, interrupts fuse/enrollment operations, or removes access to registry artifacts. Controls: offline recovery key, re-runnable enrollment, A/B fallback, immutable images, explicit Path A rehearsal. Residual: recovery procedures are security-critical code and documentation; irreversible fuse mistakes, both-slot corruption, or fleet-wide update lockout can be high impact.

A 16th row in the source doc covers extensions, portable services, containers, and apps: a less-trusted extension or application escapes isolation or introduces mutable code into a trusted namespace; controls are verity/PKCS#7 for sysext and portable-service images, isolated roots and namespaces, and weaker trust explicitly assigned to Flatpak/OCI apps; residual is signature policy enforcement and keeping end-user apps away from raw YubiKey interfaces and update/signing authority by default (source doc).
