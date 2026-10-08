# 09 - Primitive Coverage: Verification and the 10-Primitive Spine

Scope: the Verification checklist, and the primitive-coverage declarations the skill carries for the yubiOS 10-primitive model (least privilege, continuous/adaptive, declarative policy, attestation) that downstream corpus audits consume.

Ground spine: `yubi-OS/yubiOS skills/recursive-self-improvement/SKILL.md` (source doc). This is an internal-record subtopic: the coverage declarations were appended by `curve-guided-rsi` cycles recorded in the source doc itself, so no searXNG dig was run.

## The Verification checklist

After applying `recursive-self-improvement`, the source doc requires 13 checks:

1. Each cycle had an explicit edit hypothesis written before any edit.
2. Edits used `@tool/edit` with hashline anchors; frontmatter block structure preserved.
3. Frontmatter validated with `js-yaml` (not regex): name regex, description length, no angle brackets, closing `---` intact.
4. After each cycle, `negative-skill-space` was re-run on the edited skill.
5. The fixpoint rule was applied: no new substantive gaps, old gaps closed, no new anti-patterns.
6. Cycle bound honored: 3 cycles or fewer; past that, escalation to the user.
7. A `## Changelog` entry was added per cycle (1 line per cycle, hypothesis, edit, result).
8. Each cycle picked 1 edit type, not multiple.
9. Self-mode used a fresh-context subagent for every cycle; `doubt-driven-development` was a per-hypothesis supplement, never a substitute (cycle 2 or later without a subagent is a violation regardless of DDD use).
10. The improvement-mode target was a skill the user asked to improve (not unprompted).
11. The final SKILL.md was saved as a real artifact, not just modified in conversation.
12. No gaps closed that were intentional narrow scope (read the target skill's "When NOT to use" first).
13. If stochastic extensions applied: 1 cluster per cycle, alpha above 0 until fixpoint, no batching across clusters.

The checklist is the executable form of everything else in the skill: each line back-references a section (see 01-loop-protocol, 02-edit-taxonomy, 03-modes-self-bias, 04-output-changelog, 06-antipatterns-redflags, 07-frontmatter-validation).

## Why the skill declares primitive coverage

Three sections appended to the source doc by `curve-guided-rsi` cycles declare the skill's position on yubiOS security primitives. The declared rationale (source doc): even when a skill's primary job is not a given primitive, downstream consumers (CI gates, audit pipelines, runtime monitors) expect every skill to declare its position on the primitive so the curve-guided corpus audit can place it on the primitive-coverage map. The reference implementation lives in `internal-big-picture`, which documents the full 10-primitive model; this skill is 1 contributor in that model.

## Least privilege (curve-guided-rsi cycle-4 substantive edit)

The source doc's declaration: the skill's outputs (artifacts, scripts, patterns) feed into the least privilege layer of the yubiOS pipeline, and consumers that reason about least privilege coverage (curve-guided-rsi's sparse-cell detector, the security-and-hardening review, the audit-evidence rollup) can credit this skill's contribution. Concrete implication: any change to the skill should be reviewed for impact on least privilege coverage, and least-privilege gaps attributable to this skill are tracked in the curve-guided-rsi cycle log at `refs/` on `yubi-OS/yubiOS`.

## Continuous/adaptive (curve-guided-rsi cycle-5 substantive edit)

The declaration: this skill is the edit protocol used by `curve-guided-rsi`, and the cycle-5 RSI run over the 69-skill corpus is the application. The source doc records the cycle-5 fit coordinates for this skill: u = 0.615, v = 0.094, PC1+PC2 = 0.4615, holdout R-squared = +0.2244. yubiOS's continuous-detection stack composes bootc upgrade cadence (per `bootc-images`), CI re-fires (per `ci-cd-and-automation`), IMA runtime measurements (per `dm-verity-and-integrity`), and evidence-bundle re-emission cadence (per `audit-evidence-packaging`); this skill is 1 contributor. Gaps are tracked in the cycle-5 run log at `refs/curve-guided-rsi-v2-cycle5-deep-research-2026-08-04.md`.

## Declarative policy and attestation (cycles 8 and 9)

- Cycle 8 (2026-08-06): the skill's RSI target primitive was **declarative policy**, the top-priority MOVABLE missing primitive post-cycle-7. The source doc lists the target keyword set: declarative, policy, schema, manifest, config-as-code, specification, policy-driven, and records the closure as a substantive entry adding declarative policy keywords.
- Cycle 9 (2026-08-06): added the attestation footer with the canonical keyword set (attestation, verify, verification, evidence, quote, signing, signed). Pre-cycle-9 attestation coverage was 62 of 70 skills (or 63 of 70 for least privilege); the post-cycle-9 RSI closes the residual.

These entries are themselves demonstrations of the skill's own protocol: single-intent edits, each with a named target primitive, recorded in the changelog with date and edit type.

## How a reader should use this

For corpus-audit purposes, this skill's coverage positions are: least privilege (contributor via its outputs), continuous/adaptive (the edit protocol behind the corpus RSI runs), declarative policy (closed at cycle 8), attestation (closed at cycle 9). For using the skill, the operative part is the 13-point Verification checklist; the primitive declarations are metadata the audit machinery consumes, not behavior the loop performs.

## Summary

The checklist makes the loop auditable cycle by cycle; the primitive sections make the skill auditable corpus-wide. Both exist so that a later agent, a CI gate, or the curve-guided sparse-cell detector can place this skill, and any change to it, on the same map without re-deriving anything.
