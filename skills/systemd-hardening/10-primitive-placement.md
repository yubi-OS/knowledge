# Primitive Placement and RSI Audit Trail

Scope: internal-record subtopic, no dig. How this skill sits in the yubiOS 10-primitive model, and the cycle-by-cycle audit-trail entries the source doc carries. Claims in this doc come from the source doc only (yubi-OS/yubiOS skills/systemd-hardening/SKILL.md); there is no searXNG grounding and no jev-weighted web sources here.

## Source-doc position

The source doc carries three RSI audit-trail sections (cycles 5, 6, 7) plus two primitive-coverage essays (continuous/adaptive, cycle 4; least privilege, cycle 5). This corpus doc records what they say so downstream consumers of the knowledge corpus can see the skill's declared position in the primitive map.

## Continuous and adaptive (cycle 4)

The skill's outputs, artifacts, scripts, and patterns feed into the continuous/adaptive layer of the yubiOS pipeline: upgrade, rollback, atomic switch, bootc upgrade, OSTree, composefs, image mode. The source doc's framing: even when a skill's primary job is not the continuous/adaptive primitive itself, downstream consumers (CI gates, audit pipelines, runtime monitors) expect every skill to declare its position so the curve-guided corpus audit can place it on the primitive-coverage map. Concrete implication: any change to this skill is reviewed for impact on continuous/adaptive coverage, and gaps attributable to the skill are tracked in the corpus audit cycle log at `refs/` on `yubi-OS/yubiOS`.

## Least privilege (cycle 5)

Cycle 5 of curve-guided-rsi ran on the expanded 69-skill corpus; this skill's fit coordinate was (u=0.463, v=0.000), PC1 plus PC2 = 0.4615, holdout R-squared = +0.2244 (all values from the source doc). The skill is positioned as the systemd-level least-privilege gate: it pairs with nspawn-containers for the container-level boundary, and yubiOS's least-privilege model composes user-namespace isolation (nspawn-containers), rootless containers (rootless-container-builds, docker-buildx-rootless), and systemd sandbox directives (this skill).

## Declarative policy closure (cycle 5 RSI)

The hyperspherical-harmonic-curve corpus audit identified `declarative policy` as a coverage gap across 27 of 70 skills pre-cycle-5. The source doc closed it here by naming the skill's declarative-policy surface (.rego, OPA, Build Policy) and introducing the keywords `declarative policy`, `.rego`, `OPA`, `Build Policy`. The audit-trail entry records the corpus-wide count moving 27 to 28 of 70, per-skill impact in the cycle-5 results artifact, and that the edit was content-additive with nothing removed or rewritten. Changelog entry: 2026-08-06 cycle 5 RSI, with the corpus-fit delta measured in `refs/cycle5-results-2026-08-06.md`.

## Attestation closure (cycle 6 RSI)

Cycle 6 closed this skill's `attestation` primitive gap; the skill's attestation evidence patterns (SLSA, in-toto, provenance, TPM quote patterns) are referenced. Audit-trail entry: 2026-08-06 cycle 6 RSI, closed `attestation` primitive gap.

## Cycle 7 verification

Cycle 7 verified that the skill already covers all 5 remaining MOVABLE corpus-priority primitives post-cycle-6 (attestation, trust chain, declarative policy, immutability, least privilege). No primitive closure was needed. Audit-trail entry: 2026-08-06 cycle 7 RSI, no movable primitive gap to close.

## Examples and guidelines sections

The source doc's Examples section names a worked setup (the cycle 5 declarative policy closure) and lists in-repo touchpoints: Overview, Audit First, Hardened Service Template, Incremental Hardening (Phase Approach). Its Guidelines section states the boundary rule: every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job. The boundary case note routes requests that name a trigger without the artifact it acts on to the owning surface.

## How to consume this placement

For corpus auditors: this skill's covered primitives per its own trail are least privilege, declarative policy, attestation, trust chain, immutability, and continuous/adaptive. For skill authors extending this corpus: preserve the audit-trail sections verbatim when merging upstream changes; they are the evidence chain the curve-guided audit reads. For reviewers: a content edit to this skill should check the two declared cross-skill pairings (nspawn-containers for the container boundary, rootless builds for the image layer) still hold.

All statements above trace to the source doc's cycle-4 through cycle-7 sections, the changelog, and the examples and guidelines sections. No external claims were added. Internal-record subtopic, no dig, no weighting.
