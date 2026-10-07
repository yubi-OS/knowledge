# 08 - Primitive coverage recorded in the skill

Scope: the primitive-coverage and changelog entries the skill itself carries, what they claim, and which corpus processes produced them. This is an internal-record subtopic with no external dig: every claim here cites the source doc.

Ground source: `yubi-OS/yubiOS skills/fedora-bootc-base-images/SKILL.md`. This doc explicates the source doc's RSI primitive-coverage sections and changelog.

## Why the skill carries these notes

yubiOS's corpus audit places every skill on a 10-primitive coverage map (attestation, trust chain, least privilege, declarative policy, continuous/adaptive, immutability, audit/evidence, cryptographic identity, segmentation, self-describing). The fedora-bootc-base-images skill accumulated explicit coverage entries over several curve-guided-rsi cycles, and those entries are part of the skill's record even though they describe process rather than base-image mechanics.

## The immutability entry (cycle 5)

The cycle-5 edit states that the skill sits in a domain benefiting from explicit immutability coverage and records the skill's corpus-fit coordinates: (u=0.315, v=0.504), PC1+PC2 = 0.4615, holdout R² = +0.2244 (source doc). Its substantive claim: "this skill is the upstream base-image source; digest pinning is the immutability anchor for the derived yubiOS image", and yubiOS's immutability stack composes dm-verity on /usr (per `dm-verity-and-integrity`), the composefs signed catalog (per `composefs-kernel-floors`), sysext overlays (per `0pointer-mastery`), and IMA appraisal, with this skill one contributor in the load-bearing invariant "/usr is immutable at every boot" (source doc).

## The least privilege entry (cycle 4)

The cycle-4 entry declares that the skill's outputs feed into the least privilege layer of the yubiOS pipeline, and that consumers reasoning about least privilege coverage (the sparse-cell detector, the security-and-hardening review, the audit-evidence rollup) can credit the skill's contribution (source doc). Its concrete implication: any change to the skill should be reviewed for impact on least privilege coverage, and gaps attributable to the skill are tracked in the corpus audit cycle log at `refs/` on `yubi-OS/yubiOS` (source doc).

## The segmentation entry (cycle 5 RSI closure, 2026-08-06)

A dated entry records that the hyperspherical-harmonic-curve corpus audit identified a `segmentation` coverage gap in the 10-primitive framework, with segmentation missing across 22 of 70 skills before cycle 5, and that closing one corpus-wide gap here moved the count to 23 of 70 (source doc). The entry claims the skill enforces segmentation via namespace, nspawn, cgroup, microsegmentation, and private-users patterns, specifically covering segmentation, namespace, and nspawn, and introduces the keywords `segmentation`, `namespace`, `nspawn`, `cgroup` (source doc). The matching changelog entry reads: "2026-08-06 cycle 5 RSI: closed `segmentation` primitive gap (corpus-wide count 22 to 23/70)" and points at `refs/cycle5-results-2026-08-06.md` for the corpus-fit delta measurement (source doc).

## The declarative policy entry (cycle 6)

The cycle-6 entry closes the skill's `declarative policy` primitive, noting that the skill's declarative policy (.rego / OPA / Build Policy) integration is referenced, with the audit-trail line "2026-08-06 cycle 6 RSI, closed `declarative policy` primitive gap" (source doc).

## The cycle 7 audit and the removal

Cycle 7's audit-trail entry verifies that the skill already covers all 5 remaining movable corpus-priority primitives (attestation, trust chain, declarative policy, immutability, least privilege) post-cycle-6, so no primitive closure was needed (source doc).

Separately, a coverage note dated 2026-09-17 records that "the yubiOS primitive-coverage template paragraph formerly here asserted capabilities this skill does not itself implement; removed as unsupported. Skill-specific content in this section is unchanged" (source doc). That removal is itself informative: it shows the corpus audit retracting unsupported template claims rather than letting them stand, which is the same never-invent discipline this corpus follows.

## How to treat these entries

These entries are records of the skill's position in the primitive map, not claims about Fedora images. For downstream consumers, the practical takeaways are 3. Digest pinning (doc 03) is the skill's load-bearing immutability contribution. The skill's artifacts feed the least privilege layer of the pipeline and are credited accordingly. The segmentation entry is a corpus-wide bookkeeping note; whether the skill genuinely "enforces segmentation via nspawn" is not demonstrated by any base-image content in the skill, and a 2026-09-17 template retraction in the same file shows the maintainers pruning exactly that kind of unsupported assertion.
