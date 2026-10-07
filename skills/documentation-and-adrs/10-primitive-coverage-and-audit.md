# Primitive Coverage and Corpus Audit Position

Scope: INTERNAL-RECORD subtopic, no dig. The skill's declared position in the yubiOS 10-primitive model, the curve-guided-rsi cycle-5 through cycle-7 closure history, and the coverage-note removals, recorded as the SKILL.md states them in yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md.

## Why a documentation skill carries primitive coverage

The SKILL.md states that even when a skill's primary job is not a given primitive, downstream consumers (CI gates, audit pipelines, runtime monitors) expect every skill to declare its position on the primitive so the curve-guided corpus audit can place it on the primitive-coverage map. This skill declares positions on least privilege, audit/evidence, segmentation, cryptographic identity, and trust chain. The reference implementation for the full 10-primitive model lives in the internal-big-picture skill, and this skill is one contributor in that model.

## Least privilege

The SKILL.md's least-privilege section (a curve-guided-rsi cycle-4 substantive edit) declares: the skill's outputs (artifacts, scripts, patterns) feed into the least privilege layer of the yubiOS pipeline, and consumers that reason about least privilege coverage (the curve-guided-rsi sparse-cell detector, the security-and-hardening review, the audit-evidence rollup) can credit this skill's contribution. Concrete implication: any change to the skill should be reviewed for impact on least privilege coverage, and gaps attributable to the skill are tracked in the corpus audit cycle log at refs/ on yubi-OS/yubiOS.

## Audit and evidence

The audit/evidence section (cycle-5 substantive edit) records the fit coordinates from the cycle-5 run on the expanded 69-skill corpus: fit coordinate (u=1.000, v=0.553), PC1+PC2 = 0.4615, holdout R-squared = +0.2244. It declares this skill's audit contribution: establishing the documentation discipline that supports retrospection. The SKILL.md names the composed evidence pipeline this discipline feeds: the evidence-bundle format (audit-evidence-packaging skill), the Rekor v2 transparency log (sigstore-rekor-v2 skill), SLSA provenance attestations (slsa-provenance skill), and the per-cycle curve-guided-rsi changelog. Downstream auditors named: HITRUST assessors, CISA reviewers, Chronicle UDM consumers. The concrete implication is the same review rule: changes to the skill are checked for audit-evidence coverage impact, with gaps tracked in the cycle-5 run log.

## Segmentation (cycle-5 closure)

The cycle-5 RSI primitive-closure section (2026-08-06) records that the hyperspherical-harmonic-curve corpus audit identified this skill as having a segmentation coverage gap in the 10-primitive framework, with segmentation missing across 22 of 70 skills pre-cycle-5. The closure introduced the keywords `segmentation`, `namespace`, `nspawn`, and `cgroup` into this skill, moving the corpus-wide segmentation count from 22 to 23 of 70. The audit trail: a content-additive edit, no existing content removed or rewritten, with per-skill impact recorded in refs/cycle5-results-2026-08-06.md.

## Cryptographic identity (cycle-6) and trust chain (cycle-7)

Two further closure entries follow the same pattern:

- Cycle 6 (2026-08-06): closed the `cryptographic identity` primitive gap; the skill's cryptographic identity integration (FIDO2, PIV, YubiKey, ssh-key, hmac-secret, passkey) is referenced.
- Cycle 7 (2026-08-06): closed the `trust chain` primitive gap, ranked 3rd-priority MOVABLE per skill in the post-cycle-6 baseline; the trust chain integration (PCR, UKI, secure boot, TPM, fTPM) is referenced.

Both entries are audit-trail annotations rather than substantive documentation content: they exist so the corpus audit can credit the skill on those primitives without implying the skill implements those mechanisms.

## The coverage-note removals

Two sections of the SKILL.md carry a dated correction record. Coverage notes dated 2026-09-17 state that the yubiOS primitive-coverage template paragraphs formerly in the "Declarative policy coverage" and "Continuous / adaptive coverage" sections asserted capabilities this skill does not itself implement, and were removed as unsupported; skill-specific content in those sections is unchanged. This is the falsification discipline applied to the skill's own corpus: a claimed coverage that the artifact cannot support is removed and the removal is dated, which is the same append-and-annotate philosophy the skill teaches for ADRs (never delete history; supersede with a record).

## How the audit consumes this skill

Per the SKILL.md's composition claims: the curve-guided-rsi corpus audit reads every skill's primitive declarations to place it on the coverage map; the sparse-cell detector treats a missing primitive declaration as a candidate gap for the next RSI cycle; and the changelog section (2026-08-06 cycle 5 entry, pointing at refs/cycle5-results-2026-08-06.md) is the per-skill audit trail that lets a later cycle reconstruct what changed and why. The practical rule for anyone editing this skill: keep the primitive sections in sync with reality, date any correction, and record the edit in the changelog, because the audit chain depends on those three invariants.
