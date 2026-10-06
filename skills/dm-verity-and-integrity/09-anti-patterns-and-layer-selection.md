# 09 - Anti-patterns and layer selection

**Scope:** the source doc's anti-pattern list for the integrity stack, the layer-selection rule each anti-pattern encodes, and the out-of-scope boundaries that route work to neighboring skills.

**Ground source:** yubi-OS/yubiOS `skills/dm-verity-and-integrity/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/dm-verity-and-integrity/SKILL.md). Claims marked "source doc" come from this file.

**Dig status:** this is an internal-record subtopic. The anti-patterns and layer-selection rules are the skill's own guidance, recorded in the source doc, so no searXNG dig was run. Where a rule connects to a mechanism with dig evidence in this corpus, the supporting doc is referenced.

## The six anti-patterns

### 1. dm-verity on /etc

Per the source doc: /etc is mutable; dm-verity would refuse to mount after the first legitimate config change. Use fs-verity for tamper-evidence on individual config files. The layer-selection rule: block-level verification belongs to immutable block devices only. This is consistent with the kernel's own boundary statement that dm-verity should still be used on read-only filesystems while fs-verity is for files on read-write filesystems (weight 0.95, https://www.kernel.org/doc/html/latest/filesystems/fsverity.html, discussed in doc 01 and doc 04).

### 2. IMA appraisal on /home

Per the source doc: /home is user-mutable; IMA appraisal would deny every legitimate user file. Use IMA audit mode for /home, and fs-verity on specific configuration files. The rule: deny-on-mismatch is reserved for paths the build pipeline controls; user-controlled paths get measurement and logging, not enforcement.

### 3. composefs without a signed catalog

Per the source doc: an unsigned composefs catalog can be swapped by an attacker; the entire layering model breaks down. The rule: any digest list that steers the composed /usr must be signed with the yubiOS key, because the composition metadata is as much an attack surface as the content it points to (mechanics in doc 05).

### 4. Hard-coding a root hash in the kernel command line

Per the source doc: kernel command lines are mutable; BLS entries are signed. The rule: the root hash travels only inside the signed BLS entry, so the update flow (doc 03) can replace it atomically and the boot can verify its signature. A root hash on the command line bypasses that signature chain.

### 5. Computing the root hash in CI and trusting the build host

Per the source doc: the build host can be compromised. Use mkosi-sandbox for offline signing (per mkosi version 25+), or sign in a hardened CI runner with measured boot. The rule: hash computation and key access are separated; the CI machine computes, the offline sandbox signs (flow in doc 02). The kernel-side pkcs7 root-hash signature check is the enforcement point that makes this matter (weight 0.96, https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html, discussed in doc 02).

### 6. Mixing dm-verity and IMA appraisal without a signed IMA policy

Per the source doc: the IMA policy itself can be tampered with; the chain is only as strong as its weakest signed link. The rule: every enforcement gate in the chain must itself be signed, otherwise an attacker substitutes the gate rather than the content (policy signing in doc 06).

## The layer-selection rule in one table

| Question | Answer | Anti-pattern it prevents |
| --- | --- | --- |
| Is the path a read-only block device (like /usr)? | dm-verity | dm-verity on /etc |
| Is the path a mutable device that must be authenticated? | dm-integrity | (nothing else fits writable block auth) |
| Is the path a single mutable file needing tamper-evidence? | fs-verity | dm-verity on /etc, appraisal on /home |
| Is the path user-owned (/home)? | IMA audit mode only | appraisal on /home |
| Is the path an executable under /usr? | IMA appraisal, deny on mismatch | unsigned IMA policy |
| Is the composition a digest list over layers? | signed composefs catalog | unsigned catalog |
| Where does the root hash live? | signed BLS entry | kernel command line |
| Who signs the root hash? | mkosi-sandbox offline, not the CI host | trusting the build host |

Every row is stated in the source doc.

## Out-of-scope boundaries

The source doc's "Do NOT use when" list routes three neighboring domains elsewhere, and this corpus respects those boundaries:

- Full-disk encryption (LUKS2) belongs to the LUKS2 skill (forthcoming `luk2-system-disk`), not this one (source doc).
- TPM2 PCR sealing and attestation belong to `ftpm-optee-tpm` (source doc). The one touchpoint kept here is the PCR 10 measurement list, because IMA produces it (doc 06).
- UKI / `ukify` section signing belongs to `mkosi-image-builder` (source doc); what overlaps with this skill is only the verity root hash inside the boot flow.

The source doc's reference list also ties this skill to `mkosi-image-builder` (dm-verity integration), `bootc-images` (composefs/fs-verity in image mode), yubiOS ADR-007 (composefs over dm-verity-checked EROFS), and the composefs-kernel-floors skill for kernel support floors. When a request touches two of these surfaces, route by the boundary above instead of stretching this skill's scope; the source doc's guidelines section states that every use stays inside the frontmatter description's scope.
