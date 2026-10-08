# 08 - Corpus Audit and Primitive Integration

Scope: the curve-guided-rsi primitive-coverage sections embedded in the source doc: declarative policy, continuous/adaptive, segmentation, cryptographic identity, and trust chain, with their audit trails.

## Grounding spine

Source doc: `yubi-OS/yubiOS skills/using-agent-skills/SKILL.md`, sections "Declarative Policy coverage", "Continuous/adaptive coverage", "Cycle 5/6/7 RSI primitive-closure", and "Changelog". This is an internal-record subtopic: the content is the source doc's own audit sections, so no searXNG dig was run.

## Why the sections exist

The source doc carries audit sections written by the corpus audit loop (`curve-guided-rsi`). The declared mechanism: "downstream consumers (CI gates, audit pipelines, runtime monitors) expect every skill to declare its position on the primitive so the curve-guided corpus audit can place it on the primitive-coverage map" (source doc, Declarative Policy coverage section). The map is the 10-primitive model documented in the `internal-big-picture` reference implementation, and each skill is "one contributor in that 10-primitive model".

The practical contract those sections impose: "any change to the skill should be reviewed for impact on declarative policy coverage; gaps in declarative policy that are attributable to this skill are tracked in the corpus audit" (source doc, Declarative Policy coverage section). In other words, editing the SKILL.md is not only a content change; it is a change to the corpus's primitive-coverage geometry.

## Declarative policy (cycle 4)

The cycle-4 section states the skill's position: "the skill's outputs (artifacts, scripts, patterns) feed into the declarative policy layer of the yubiOS pipeline", and consumers that reason about declarative policy coverage (the sparse-cell detector in curve-guided-rsi, the security-and-hardening review, the audit-evidence rollup) "can credit this skill's contribution" (source doc, cycle-4 section). The reference implementation is `internal-big-picture`.

## Continuous/adaptive (cycle 5)

The cycle-5 section records measured coordinates: "Cycle-5 of curve-guided-rsi was run on the expanded 69-skill corpus; this skill's fit coordinate was (u=0.718, v=0.702), PC1+PC2 = 0.4615, holdout R² = +0.2244" (source doc, cycle-5 section). Its substantive position: "this skill is the meta-skill for skill loading; contributes to continuous/adaptive via the load-order discipline". The doc connects that contribution to the runtime stack: "yubiOS's continuous-detection stack composes bootc upgrade cadence (per bootc-images), CI re-fires (per ci-cd-and-automation), IMA runtime measurements (per dm-verity-and-integrity), and the evidence-bundle re-emission cadence (per audit-evidence-packaging); this skill is one contributor."

The change-impact rule repeats for this primitive: "any change should be reviewed for impact on continuous coverage; gaps are tracked in the cycle-5 run log at refs/curve-guided-rsi-v2-cycle5-deep-research-2026-08-04.md" (source doc, cycle-5 section).

## Segmentation (cycle 5 closure)

The cycle-5 RSI primitive-closure section records that the hyperspherical-harmonic-curve corpus audit identified a `segmentation` coverage gap "missing across 22/70 skills pre-cycle-5", and that closing it here moved the corpus-wide count "22 to 23/70" (source doc, cycle-5 closure section). The declared relevance wording is: "This skill enforces segmentation via namespace / nspawn / cgroup / microsegmentation / private-users. Specifically it covers: segmentation, namespace, nspawn." The keywords introduced are `segmentation`, `namespace`, `nspawn`, `cgroup`. The audit-trail note says the edit was content-additive: "no existing content was removed or rewritten". The changelog entry repeats the delta and points at `refs/cycle5-results-2026-08-06.md` for the corpus-fit measurement.

Reading the closure honestly: the skill's own body (discovery tree, behaviors, rules) does not otherwise involve namespaces or cgroups. The section is a corpus-audit artifact that declares keyword coverage so the audit's primitive map credits the skill, and the audit-trail language ("this addition closes one corpus-wide primitive gap") confirms its purpose is coverage accounting rather than new operational guidance.

## Cryptographic identity (cycle 6)

The cycle-6 section records: "This skill's cryptographic identity (FIDO2 / PIV / YubiKey / ssh-key / hmac-secret / passkey) integration is referenced", with the audit-trail entry "2026-08-06 cycle 6 RSI - closed cryptographic identity primitive gap" (source doc, cycle-6 section).

## Trust chain (cycle 7)

The cycle-7 section records: "This skill's trust chain integration (PCR / UKI / secure boot / TPM / fTPM) is referenced", marked as "3rd-priority MOVABLE per skill, post-cycle-6 baseline", with the audit-trail entry "2026-08-06 cycle 7 RSI - closed trust chain primitive gap" (source doc, cycle-7 section).

## Reading the audit trail as a whole

Across cycles 4 to 7 the pattern is consistent: each audit cycle either adds a substantive section (cycles 4 and 5, which state how the skill's outputs feed a primitive) or adds a keyword-closure note (cycles 5's segmentation, 6, and 7, which declare coverage of a primitive by naming its terms). The changelog (2026-08-06 cycle 5 RSI entry) is the only dated entry, and it points at the results artifact for the measured delta.

For a maintainer, the operational takeaways are:

1. Do not delete the audit sections when editing the skill; they are the corpus audit's input surface.
2. When editing, check both named impact surfaces: declarative policy coverage and continuous/adaptive coverage.
3. New primitive gaps are closed by adding a closure section with keywords and an audit-trail line, following the cycle 5 to 7 pattern.
4. Measurements live in the refs/ artifacts the sections cite, not in the SKILL.md itself.
