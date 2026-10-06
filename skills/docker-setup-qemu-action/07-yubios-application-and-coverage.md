# 07. yubiOS application and primitive coverage

**Scope:** how the skill applies inside yubiOS, and its position in the 10-primitive coverage map. Internal-record subtopic, no dig: this doc is grounded entirely in the source doc.

**Internal-record subtopic, no dig.** Every claim below cites the source doc: yubi-OS/yubiOS skills/docker-setup-qemu-action/SKILL.md.

yubiOS application (source doc, yubiOS note): yubiOS targets linux/amd64 primarily. Include QEMU only when building multi-arch yubiOS bootc images. For single-arch CI unit tests, QEMU is not needed. The practical consequence: the default yubiOS CI workflow should not carry the QEMU step at all; the step appears only in workflows that push multi-platform bootc images (per the standard setup in doc 03, the platforms argument linux/amd64,linux/arm64 on build-push-action is the trigger that makes QEMU required).

Declarative policy coverage (source doc, cycle-5 substantive edit section): the skill sits in a domain that benefits from explicit declarative-policy coverage because it enables multi-platform builds, a declarative-policy concern; without QEMU the build matrix cannot span architectures. The recorded cycle-5 fit coordinates are u=1.000, v=0.553, PC1+PC2 = 0.4615, holdout R-squared = +0.2244. The section names its sibling contributors: Rego Build Policies (docker-build-policy, rootless-container-builds), mkosi declarative config (mkosi-image-builder), sysext overlay manifests (composefs-kernel-floors), and systemd unit hardening (systemd-hardening). Concrete implication recorded in the source doc: any change to the skill should be reviewed for impact on declarative-policy coverage; gaps are tracked in the cycle-5 run log.

Least privilege coverage (source doc, curve-guided-rsi cycle-4 section): the skill's outputs feed the least-privilege layer of the yubiOS pipeline, and consumers that reason about least privilege coverage (curve-guided-rsi's sparse-cell detector, the security-and-hardening review, the audit-evidence rollup) credit this skill's contribution. The reference implementation of the full primitive lives in internal-big-picture, which documents the 10-primitive model this skill contributes to.

RSI audit trail (source doc, cycle sections):

- 2026-08-06 cycle 5: closed the segmentation primitive gap, moving the corpus-wide segmentation count from 22 to 23 of 70 skills; keywords introduced were segmentation, namespace, nspawn, cgroup. Content-additive, nothing removed (source doc).
- 2026-08-06 cycle 6: closed the cryptographic identity primitive gap (FIDO2, PIV, YubiKey, ssh-key, hmac-secret, passkey references).
- 2026-08-06 cycle 7: closed the trust chain primitive gap (PCR, UKI, secure boot, TPM, fTPM references), 3rd-priority MOVABLE per skill post-cycle-6 baseline.

Coverage hygiene note (source doc, 2026-09-17): the yubiOS primitive-coverage template paragraph formerly present in the skill asserted capabilities the skill does not itself implement; it was removed as unsupported. The skill-specific content was unchanged. This is the model correction pattern for template-driven coverage text: when a paragraph claims capabilities the skill lacks, delete the paragraph rather than soften it.

Guideline boundary (source doc, Guidelines): every use stays inside the front matter description's scope; anything beyond it is a different skill's job. In practice that means docker-setup-qemu-action owns QEMU registration only; builder creation belongs to docker-setup-buildx-action and build orchestration to docker-build-push-action (see docs 03 and 04).

**Grounding spine:** the source doc's yubiOS note, both primitive-coverage sections, the cycle 5 through 7 closure sections, the 2026-09-17 coverage note, and the Guidelines section. No external digs were run for this subtopic.
