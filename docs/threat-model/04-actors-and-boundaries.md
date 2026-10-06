# 04 Actors and Trust Boundaries

Scope: who the model says can attack, and where authority crosses between systems: the actor table with control and trust levels, and the 11 trust boundaries with the data crossing each one, the expected control, and the residual risk. This is an internal-record subtopic: the actors and boundaries are the source doc's own tables, and no searXNG dig was run for it.

Grounding spine: yubi-OS/yubiOS docs/THREAT_MODEL.md (source doc), https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/THREAT_MODEL.md

## Actors and attacker capabilities

The source doc defines 9 actors. The distinguishing column is control and trust level, and several actors are explicitly privileged but not trusted (source doc).

1. Owner/operator. Controls the YubiKey, recovery key, Secure Boot enrollment, installation target, and upgrade decisions. Trusted to intend the selected action, but mistakes, coercion, token theft, and unsafe recovery handling remain realistic (source doc).

2. Repository maintainer/release engineer. Controls source, pinned inputs, CI policy, and release configuration. Privileged but fallible; account or workflow compromise is in scope (source doc).

3. CI runner and publication infrastructure. Processes source and secrets and emits images, firmware, attestations, and tags. It is a high-value trust boundary rather than an inherently trusted oracle (source doc).

4. Upstream project or image publisher. Supplies base images, actions, compilers, firmware components, and packages. Content may be vulnerable or malicious even when digest-pinned (source doc).

5. Network or registry attacker. Can intercept, delay, replay, mirror, or substitute downloads and registry responses, but is not assumed to break modern cryptography (source doc).

6. Local unprivileged attacker. Controls user files, application inputs, removable media, IPC, and possibly a logged-in process; seeks privilege escalation or cross-user access (source doc).

7. Physical attacker. May steal a powered-off device or obtain temporary access to the platform, ports, storage, firmware setup, or peripherals. A strong physical attacker may also steal the YubiKey, but may not know its PIN (source doc).

8. Supply-chain or firmware attacker. May compromise an upstream input, CI workflow, signer-adjacent host, OEM firmware, board provisioning process, or pre-owner hardware stage (source doc).

9. Post-unlock attacker. Has code execution after the owner has unlocked the system. Mounted plaintext and the active session are exposed; immutable boot content still matters for persistence and recovery (source doc).

Two actor-model choices stand out. The CI runner is demoted from oracle to boundary, so its output is verified like any other input (source doc). The physical attacker is granted token theft but explicitly denied the PIN, which is why the model requires PIN plus possession rather than possession alone (source doc).

## Trust boundaries

The source doc defines 11 boundaries. For each one: the data or authority crossing it, the expected control, and the important residual risk (source doc).

1. Owner and YubiKey. Crossing: PIN entry, touch, PIV signing, FIDO2 assertions and `hmac-secret`. Control: separate CCID/PIV and hidraw/FIDO2 interfaces; PIN and physical presence for sensitive actions. Residual risk: a compromised but correctly signed host can request a valid FIDO2 secret; possession does not attest to the requesting OS (source doc).

2. YubiKey and host USB stack. Crossing: authentication and secret-release protocol messages. Control: hardware-backed non-exportable credentials and verification-required policies. Residual risk: malicious USB stack, counterfeit token, confused interface selection, or unsafe enrollment ceremony (source doc).

3. Hardware/firmware and first owner-controlled boot stage. Crossing: ROTPK, firmware images, Secure Boot variables, TPM measurements. Control: ARM64 Path A TBB and owner provisioning; owner-enrolled UEFI keys above OEM firmware on x86-64. Residual risk: closed ROM/SoC and x86 OEM firmware remain below the enforceable boundary; Path B is measured rather than equivalent to fused verification (source doc).

4. Boot chain and runtime. Crossing: UKI, command line, PCRs, dm-verity root, initrd policy. Control: signed UKI, PCR 11 measurements, `usrhash=`, dm-verity, kernel lockdown. Residual risk: a compromised verifier or firmware can lie about every higher layer; writable early-boot inputs must not redirect trust (source doc).

5. Immutable `/usr` and writable root and user state. Crossing: configuration, service state, caches, logs, secrets, and user content. Control: read-only verified `/usr`, encrypted writable partitions, systemd sandboxing. Residual risk: runtime root can alter writable state, steal plaintext, or create persistence outside `/usr` unless every boot-relevant writable input is constrained (source doc).

6. Build source and CI runner. Crossing: pull-request content, workflow definitions, build scripts, pins, secrets. Control: pinned Actions/images, policy gates, review controls, isolated CI contexts. Residual risk: workflow injection, compromised maintainer accounts, overly broad tokens, and malicious-but-pinned upstream content (source doc).

7. CI/release system and registry. Crossing: OCI indexes, per-commit tags, firmware tags, SBOMs, provenance. Control: digest-addressable artifacts, authenticated publication, attestations. Residual risk: provenance records origin but does not by itself make malicious output safe; mutable convenience tags can be replayed or retargeted (source doc).

8. Registry/update source and installed system. Crossing: candidate OS image, UKI, `/usr` partitions, update metadata. Control: TLS, signed boot artifacts, dm-verity, immutable commit tags, A/B boot counting. Residual risk: selection, downgrade, and rollback policy can fail even when each selected artifact is internally valid (source doc).

9. New update and boot-good state. Crossing: health signal and boot-attempt counter. Control: systemd-boot counters, fallback slot, `bootctl set-boot-good` after health checks. Residual risk: a malicious signed userspace may forge health; availability rollback is not authenticity validation (source doc).

10. First-boot tools and raw platform state. Crossing: disk partitioning, key enrollment, firmware inspection, UEFI variables. Control: `ConditionFirstBoot=yes`, measured-boot gate, narrow service privileges. Residual risk: this is a one-time concentration of authority; target confusion or a weak measured-boot predicate can permanently enroll attacker choices (source doc).

11. (Same table, security-relevant pairing.) The firmware-inspection service sits inside boundary 10: CHIPSEC's raw hardware access during first boot is the strongest single privileged exception in the model, and the residual risk is that a parser or command-injection flaw there has unusually high impact (source doc).

## How actors map to boundaries

Each boundary is written so a specific actor pair can be tested against it. Boundary 4 is the post-unlock attacker's persistence target, boundaries 6 and 7 are the supply-chain attacker's targets, boundary 3 is the firmware attacker's target, and boundary 10 is where operator error and a supply-chain attacker meet in a single enrollment window (source doc).
