Scope: how this skill composes with the neighboring yubiOS skills and where it sits in the 10-primitive coverage model. This is an internal-record subtopic: no dig was run, and every claim here is attributed to the source doc.

## Status of the source

All claims in this document come from the source doc, "source doc, yubi-OS/yubiOS skills/drm-gpu-quota-secure-time/SKILL.md". No external research was collected for it, by design: the content is the skill's own record of its integration and audit history, and there is nothing for a web dig to verify beyond what the doc states.

## Pairing with the firmware-stack skills

The secure-time feature is a config bit inside the same OP-TEE build that the neighboring skills already cover, not a standalone feature ("source doc"). The doc names the pair explicitly: ftpm-optee-tpm and arm-trusted-firmware-optee. Check those before assuming this skill's secure-time content stands alone. The use cases it serves are fTPM-shaped: bounding replay windows for fTPM NV counters, and timestamping the ADR-018/019 ARM64 fTPM measured-boot event log with a time value normal-world userspace cannot roll back ("source doc").

On the GPU side, the v0 scope (doc 06) deliberately ships without firmware changes; the SMC escalation tier is the only part that would touch the TF-A layer, and it is gated behind its own ADR ("source doc").

## Primitive-coverage entries

The skill carries four primitive-coverage records from the curve-guided-rsi corpus audits ("source doc"):

1. Least privilege (cycle-4 substantive edit). The skill's outputs feed the least-privilege layer of the yubiOS pipeline, and consumers that reason about least-privilege coverage (the curve-guided-rsi sparse-cell detector, the security-and-hardening review, the audit-evidence rollup) credit the skill's contribution. The reference implementation of the primitive lives in internal-big-picture's 10-primitive model. Any change to the skill should be reviewed for impact on least-privilege coverage; gaps attributable to the skill are tracked in the corpus audit cycle log at refs/ on yubi-OS/yubiOS.

2. Immutability (cycle-5 substantive edit). The skill contributes to immutability and trust chain at the GPU boundary; the SMC-mediated quota is enforced from secure world. yubiOS's immutability stack composes dm-verity on /usr (per dm-verity-and-integrity), the composefs signed catalog (per composefs-kernel-floors), sysext overlays (per 0pointer-mastery), and IMA appraisal (per dm-verity-and-integrity); this skill is one contributor in the load-bearing invariant that /usr is immutable at every boot. The recorded corpus-fit coordinate is (u=0.697, v=0.417), PC1+PC2 = 0.4615, holdout R2 = +0.2244.

3. Cryptographic identity (cycle-5 closure, 2026-08-06). The skill relies on cryptographic identity (FIDO2, PIV, YubiKey, ssh-key, hmac-secret, passkey); the closure moved the corpus-wide cryptographic identity count from 23 to 24 of 70 skills, recorded in refs/cycle5-results-2026-08-06.md. Keywords introduced: cryptographic identity, FIDO2, PIV, YubiKey. The edit was content-additive; nothing was removed or rewritten.

4. Declarative policy (cycle-6 closure, 2026-08-06). The skill's declarative-policy (.rego / OPA / Build Policy) integration is referenced and the gap is closed.

Cycle 7 (2026-08-06) audited the skill post-cycle-6 and verified full movable-primitive coverage (attestation, trust chain, declarative policy, immutability, least privilege); no primitive closure was needed ("source doc").

## Housekeeping records

Two dated records in the doc are worth carrying forward. On 2026-09-17 the extended description was moved out of the frontmatter so the description field fits the 1,024-character skill-format limit, wording unchanged ("source doc"). On the same date, the yubiOS primitive-coverage template paragraph in the continuous/adaptive section was removed as unsupported, because it asserted capabilities this skill does not itself implement ("source doc"). Both are maintenance corrections, not content changes, and both are the kind of drift a future refresh sweep should not re-introduce.

## Why a GPU and clock skill carries primitive coverage at all

The corpus audit treats every skill as a contributor to the 10-primitive model rather than auditing skills in isolation ("source doc"). For this skill the mapping is concrete rather than ceremonial: per-cgroup VRAM quotas are least privilege applied to a hardware resource (each cgroup gets exactly the GPU memory it is allowed, and nothing more); the SMC tier enforced from secure world is a trust-chain decision about which world enforces against which; and the CNTPCT-sourced time is cryptographic-identity-adjacent in its effect, because timestamps a compromised REE cannot forge are what make NV counter replay windows and measured-boot log ordering verifiable ("source doc"). The declarative-policy reference connects the quota limits to the policy layer that expresses them ("source doc").

## The immutability connection, made precise

The cycle-5 record ties this skill to the "/usr is immutable at every boot" invariant through the enforcement tier: the SMC-mediated quota is enforced from secure world, which means the enforcement path lives below the mutable OS image, in firmware the immutability stack verifies rather than in kernel code an image update could rewrite ("source doc"). The stack it composes with is named in the record: dm-verity on /usr and IMA appraisal per dm-verity-and-integrity, the composefs signed catalog per composefs-kernel-floors, sysext overlays per 0pointer-mastery ("source doc"). A reader coming from any of those skills lands here at the GPU boundary of the same chain.

Conversely, tier 1 of the GPU design (doc 06) is a kernel-side change, so it is image content: it rides the bootc upgrade path, is verified by the same dm-verity root hash as the rest of /usr, and rolls back with the image. That placement, kernel policy in the image and firmware cutoffs in the boot chain, is the skill's practical answer to where each enforcement decision lives.

## What the audit history implies for maintenance

The changelog trail (cycles 4 through 7, dated 2026-08-06, with the cycle-5 fit measurements recorded) means this skill's coverage claims are auditable, not asserted: each closure names the cycle, the date, and the artifact recording the corpus-fit delta ("source doc"). Two maintenance rules follow for future edits, both established by the 2026-09-17 housekeeping: keep the description field within the 1,024-character skill-format limit by keeping the extended description outside the frontmatter ("source doc"), and do not re-add template paragraphs asserting capabilities the skill does not implement ("source doc"), because the continuous/adaptive template paragraph was removed on that date for exactly that reason. The audit trail is additive by policy ("source doc"), so corrections in this skill's corpus should extend, not rewrite, the coverage records.
