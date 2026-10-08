# 12: yubiOS Primitive Integration and RSI Audit Trail

## Scope

How the systemd-homed skill maps onto the yubiOS 10-primitive model: trust-chain anchor via YubiKey FIDO2 unlock, segmentation, declarative policy, least privilege, and the cycle 5 to 7 RSI audit trail. This doc is largely an internal-record subtopic: most claims are grounded in the source doc itself, with web digs supplying only weak external corroboration. No strong external sources exist for the yubiOS-internal framework, and the weak weights below are labeled as such.

## The 10-primitive frame

yubiOS organizes its skills on a 10-primitive model. The source doc records which primitives this skill contributes to (source doc: yubi-OS/yubiOS skills/systemd-homed/SKILL.md, RSI sections):

1. **Trust chain** (cycle 5): this skill is the home-directory trust-chain anchor; YubiKey FIDO2 unlock binds the user identity to the home. The source doc describes the wider yubiOS trust chain as YubiKey, then fTPM, then UKI PCR 11, then dm-verity root hash, then bootc image digest, then SLSA L3 attestation, with this skill one contributor in that chain.
2. **Segmentation** (cycle 5 closure): the skill enforces segmentation via namespace, nspawn, cgroup, microsegmentation, private-users; keywords `segmentation`, `namespace`, `nspawn`, `cgroup` were introduced in the cycle 5 edit.
3. **Least privilege** (cycle 3): the skill contributes sandbox, capabilities, ProtectSystem, NoNewPrivileges, dynamic user, or rootless patterns.
4. **Declarative policy** (cycle 6): the skill's declarative policy integration (.rego / OPA / Build Policy) is referenced.
5. **Continuous/adaptive** (cycle 4): the skill's outputs feed the continuous/adaptive layer (upgrade, rollback, atomic switch, bootc upgrade, OSTree, composefs, image mode), and consumers of primitive-coverage maps credit this skill's contribution.

The cycle 7 audit verified full movable coverage post-cycle-6 (attestation, trust chain, declarative policy, immutability, least privilege), with no primitive closure needed (source doc, Cycle 7 RSI audit-trail).

## Cycle 5 measurement record

The source doc carries the cycle 5 fit measurements for this skill: run on the expanded 69-skill corpus (63 existing plus 6 new), with fit coordinate (u=0.651, v=0.002), PC1+PC2 = 0.4615, holdout R-squared +0.2244 (source doc). The audit-trail records that the segmentation closure moved the corpus-wide segmentation count from 22 to 23 of 70 skills, content-additive with no existing content removed (source doc), and points at `refs/cycle5-results-2026-08-06.md` and `refs/curve-guided-rsi-v2-cycle5-deep-research-2026-08-04.md` on yubi-OS/yubiOS for the measured deltas.

## External corroboration (weak, labeled)

Web digs for this subtopic returned almost entirely weak or off-topic results, which is expected: the 10-primitive model is yubiOS-internal vocabulary.

- The yubiOS README HTML site describes the systemd image model with DPS partitions, systemd-repart first boot, A/B sysupdate, and systemd-homed per-user encryption (source: https://yubi-os.github.io/, weight 0.06, weak backing).
- The yubi-OS/yubiOS repository names the "Fitting Everything Together" essay at 0pointer.net as the primary design reference, covering hermetic /usr, DPS partitions, systemd-repart first-boot, A/B sysupdate, systemd-homed per-user encryption, and the UKI plus dm-verity trust chain (source: https://github.com/yubi-OS/yubiOS, weight 0.06, weak backing).
- A skills-directory listing mirrors the skill's own description text (source: https://skillsmp.com/creators/yubi-os/yubios/skills-systemd-homed, weight 0.07, weak backing, mirror).
- The generic systemd project site is a strong source for the substrate the skill builds on (source: https://systemd.io/, weight 0.83), but it does not describe yubiOS primitives.

## Composition with sibling skills

Per the source doc, the trust-chain composition names concrete sibling skills: `yubikey-operations` and `ftpm-optee-tpm` for the YubiKey to fTPM legs, `dm-verity-and-integrity` for the root-hash leg, `bootc-images` for the image digest leg, and `slsa-provenance` plus `sigstore-rekor-v2` for the attestation leg. Any change to this skill should be reviewed for impact on trust-chain integrity and on continuous/adaptive coverage, with gaps tracked in the corpus audit cycle logs at `refs/` on yubi-OS/yubiOS (source doc).

The skill's own Guidelines section bounds its scope: every use stays inside the frontmatter description's scope, and anything beyond it is a different skill's job (source doc). The Examples section adds the routing rule for boundary cases: when a request names a trigger without the artifact it acts on, route to the owning surface instead of improvising (source doc).

## Sources

- yubi-OS/yubiOS skills/systemd-homed/SKILL.md (source doc; primary for all internal-record claims)
- https://systemd.io/ (weight 0.83)
- https://github.com/yubi-OS/yubiOS (weight 0.06, weak)
- https://yubi-os.github.io/ (weight 0.06, weak)
- https://skillsmp.com/creators/yubi-os/yubios/skills-systemd-homed (weight 0.07, weak)
