# 08 Worked setup, touchpoints, and provenance

Scope: the skill's own worked example, the in-repo sections it owns, and its changelog provenance. Internal-record subtopic: no dig was run; every claim here cites the source doc.

## Worked setup

The source doc (yubi-OS/yubiOS skills/composefs-kernel-floors/SKILL.md) encodes the flow this skill drives as a worked setup, restated here without external sources because the subtopic is an internal record:

- Production yubiOS: kernel 6.12 or newer. Full composefs feature set, EROFS where applicable.
- Long-term-support (LTS) yubiOS: kernel 6.6 or newer. Data-only OverlayFS plus verity=require, no EROFS.
- Experimental or pre-release yubiOS: kernel 6.5 or newer. Data-only OverlayFS only, no signed-catalog enforcement.
- The named boundary case in the worked list: pinning a kernel below 6.5 for stability, which silently disables composefs; the source doc calls the stability gain a fiction because the composefs feature has been stable since 6.5.

Docs 03 and 05 expand the EROFS and kernel-selection parts of this setup with dig-sourced backing; this doc records the setup as the skill states it.

## In-repo touchpoints

Per the source doc, the sections this skill owns or extends are: Overview, When to Use, Why these floors, and Kernel 6.5: Data-only OverlayFS. The doc also states the boundary-case rule: when a request only names a trigger without the artifact it acts on, route to the owning surface instead of improvising (see doc 07 for the routing).

## Guidelines

The source doc's guidelines section is a single sentence: every use stays inside the frontmatter description's scope, and anything beyond it is a different skill's job. That scope is the composefs kernel floors, the mount options at those floors, the systemd-dissect integration points, and the PINNED.md floor-selection convention.

## Changelog provenance

The skill's changelog, all from the source doc:

- 2026-08-04, cycle 5: initial v1, created per deep-research Stream 3 (upstream comparative). Stream 3 ranked composefs-kernel-floors as the second-pick highest-leverage corpus addition, on the grounds that composefs is fully upstreamed but the kernel-floor dependency was uncurated in ADR-007. The skill mapped to the 10-primitive axes with P6 immutability (the kernel floor as the immutability enforcement point) and P10 self-describing (the signed catalog as a self-describing artifact) called out.
- 2026-08-06, cycle 5 RSI: closed the segmentation primitive gap (corpus-wide count 22 to 23 of 70), adding the keywords segmentation, namespace, nspawn, cgroup. The doc notes this is a content-additive edit with no existing content removed.
- 2026-08-06, cycle 4 corpus audit note: the skill was part of the matched-parameter ablation corpus (70 skills); the hyperspherical-harmonic-curve variant scored R2 = +0.222 on the full 70-skill holdout versus the flat Fourier baseline's -1.120, a matched-parameter delta of +1.342 with fewer parameters (6,534 versus 9,984). On the 49-skill alphabetical-first-half split the variant scored R2 = +0.618 versus -0.359. The doc flags that this is a single full-corpus run with no error bars and names a multi-seed re-run as the next step.
- 2026-08-06, cycles 6 and 7 RSI: closed the cryptographic identity primitive (cycle 6, 3rd-priority MOVABLE per skill) and the trust chain primitive (cycle 7), adding references to FIDO2/PIV/YubiKey identity and PCR/UKI/secure-boot/TPM trust-chain integration respectively.
- 2026-09-17: three coverage-note removals. The primitive-coverage template paragraphs for least privilege, declarative policy, and continuous/adaptive coverage were removed as unsupported assertions about capabilities the skill does not itself implement. This is the provenance of the doc's current shape: only immutability, self-describing, segmentation, cryptographic identity, and trust chain references remain from the primitive campaign.
- Immutability coverage note: the skill's fit coordinate in the cycle-5 curve audit was (u=0.661, v=0.672) with PC1+PC2 = 0.4615 and holdout R2 = +0.2244. The skill positions itself as one contributor in the load-bearing invariant that /usr is immutable at every boot, composing with dm-verity on /usr, the composefs signed catalog, sysext overlays, and IMA appraisal.

## How to read this doc

Everything above is a faithful record of what the source doc says about itself. For externally verifiable content (the floors, the mount options, the upstream mechanisms), use docs 01 through 07; this doc exists so the corpus carries the skill's own worked example and audit trail without re-deriving them.

## Source used in this doc

- Source doc only: yubi-OS/yubiOS skills/composefs-kernel-floors/SKILL.md (internal-record subtopic, no dig)
