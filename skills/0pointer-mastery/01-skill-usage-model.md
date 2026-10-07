# 01 - Skill Usage Model

Scope: how the 0pointer-mastery skill is meant to be used, what triggers it, the 4-step usage method it prescribes, its reference sub-files, and the audit-trail sections that pin its position in the yubiOS corpus.

Grounding spine: yubi-OS/yubiOS skills/0pointer-mastery/SKILL.md (source doc). This is an internal-record subtopic, no dig; every claim below comes from the source doc.

## What the skill is

The 0pointer-mastery skill is the mastery and big-picture skill for the Lennart Poettering / systemd ecosystem. Its one-line definition: deep knowledge of Lennart Poettering's image-based OS vision and how yubiOS implements it with YubiKey as hardware root of trust instead of TPM2 (source doc). The skill covers the full 0pointer blog canon: the "Fitting Everything Together" OS architecture vision, the UKI/PCR/TPM trusted boot chain, the Discoverable Partitions Specification, LUKS2 hardware unlock with FIDO2, TPM2, and PKCS#11, factory reset and stateless systems, dynamic users, portable services, the developer workflow (sysext plus nspawn off host /usr), the systemd v256 to v260 feature landscape, mkosi, casync, and Amutable, the 2026 company.

## When to use it

The source doc lists the use cases explicitly (source doc):

- Designing or reviewing yubiOS architecture decisions
- Deciding which modularity mechanism to use (sysext vs portable service vs nspawn)
- Understanding PCR assignments, UKI sections, boot phases, or rollback protection
- Explaining why a specific systemd component was chosen over an alternative
- Auditing whether a yubiOS design goal is met
- Questions about LUKS2 hardware unlock mechanics (FIDO2, TPM2, PKCS#11)
- Understanding DPS partition types, systemd-dissect, systemd-repart
- Developer workflow: testing builds with sysext, running nspawn off host /usr
- Dynamic users, StateDirectory, portable services, portablectl
- Researching systemd v256 to v260 features relevant to yubiOS
- Any "big picture", "why does this work this way", or "what would Lennart do" question

Trigger phrases include: "0pointer vision", "fitting everything together", "hermetic /usr", "trust chain", "PCR", "UKI", "boot phases", "FIDO2 unlock", "DPS", "discoverable partitions", "portable service", "sysext", "dynamic user", "factory reset", "stateless system", "Amutable", "architecture decision", "image-based OS", "big picture", "what would Lennart do", "why use X instead of Y" (source doc).

## The 4-step usage method

The source doc prescribes exactly 4 steps (source doc):

1. Locate the question in the layers (the design goals, the modularity ladder, the boot chain, the partition layout). Every yubiOS design fits one layer.
2. Apply the trust chain rule: every layer must be cryptographically validated; TPM2 becomes YubiKey for secrets.
3. Check the recent systemd version table for new mechanisms that supersede old patterns.
4. Remember that the yubiOS delta is almost always just one thing: `--fido2-device=auto` instead of `--tpm2-device=auto`.

Step 4 is the skill's central compression: the standard Poettering design and the yubiOS design differ by one flag at the secrets layer, so almost any mechanism question resolves by taking the upstream answer and swapping TPM2 for YubiKey FIDO2 (source doc).

## Reference sub-files

The skill keeps detail in 4 reference sub-files and instructs loading them when detail is needed (source doc):

- `references/trusted-boot-uki.md`: UKI PE sections, PCR assignments, boot phases, rollback protection, generation process
- `references/luks2-hardware-unlock.md`: FIDO2/TPM2/PKCS#11 enrollment, cryptenroll workflow, homed integration
- `references/dps-and-image-formats.md`: DPS partition types, systemd-dissect/nspawn/repart tools, A/B versioning, portable services deep dive
- `references/developer-workflow.md`: sysext dev testing, nspawn off host /usr, credentials, DynamicUser=, /usr merge rationale

Two external anchors are named directly: the 0pointer blog at https://0pointer.net/blog/ and Amutable at https://amutable.com/ (source doc). A deep-knowledge document is also referenced at `documents/github-yubios-KS9n5GAT/knowledge/deep-research/0pointer-knowledge.md` (source doc).

## Audit-trail sections

The skill carries explicit corpus-audit sections. The audit/evidence coverage section (cycle 4 of curve-guided-rsi) declares that the skill's outputs feed the audit/evidence layer of the yubiOS pipeline and that consumers reasoning about audit/evidence coverage (the curve-guided-rsi sparse-cell detector, the security-and-hardening review, the audit-evidence rollup) can credit its contribution (source doc). The attestation coverage section (cycle 5, run on the expanded 69-skill corpus) records the skill's fit coordinate (u=0.244, v=0.268), PC1+PC2 of 0.4615, and holdout R2 of +0.2244, and states that this skill is the meta-skill for the systemd/0pointer ecosystem, referencing every attestation primitive in the load-bearing chain (source doc).

Cycle 5 closed a corpus-wide `declarative policy` primitive gap in this skill, moving the corpus-wide count from 27 to 28 of 70 skills (source doc; refs/cycle5-results-2026-08-06.md on yubi-OS/yubiOS). Cycles 6 and 7 verified full movable primitive coverage (attestation, trust chain, declarative policy, immutability, least privilege) and required no further closure (source doc).

## Guidelines and boundary

The skill's guideline section states that every use stays inside the frontmatter description's scope and that anything beyond it is a different skill's job (source doc). Its examples section adds a boundary rule: when a request only names a trigger phrase without the artifact it acts on, route to the owning surface instead of improvising inside this skill (source doc).

The skill also records its own maintenance history: the extended description was moved out of the frontmatter on 2026-09-17 so the `description` field fits the 1,024-character skill-format limit, with wording unchanged (source doc).

## How this corpus extends the skill

This knowledge corpus explicates the skill doc by doc: the usage model here, the 17 design goals in doc 02, the modularity ladder in doc 03, the boot chain in doc 04, and the five design-rationale answers in doc 05. The source doc remains the primary source of record; the corpus deepens it with searXNG-digged external sources for the mechanisms it references, each weighted by the jev decision model.
