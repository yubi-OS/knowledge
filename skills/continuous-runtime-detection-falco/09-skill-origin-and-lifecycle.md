# 09. Skill origin, lifecycle and boundary routing

Scope: where the skill came from (the changelog trail), how its lifecycle is recorded, and the routing rules its Examples and Guidelines sections impose. This is an internal-record subtopic, no dig.

Ground source: `yubi-OS/yubiOS skills/continuous-runtime-detection-falco/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/continuous-runtime-detection-falco/SKILL.md). All claims are attributed to the source doc.

## Origin: the cycle 9 corpus-enrichment entry

The changelog records one substantive creation entry, dated 2026-08-06: "cycle 9: Initial v1. New skill created per deep-research Stream 1 §4.3 (corpus enrichment for the 2-cell continuous/adaptive residual post-cycle-8, accepting the structural-gap residual for `composefs-kernel-floors` and `yubikey-operations` per §3.4 recommendation)" (source doc). The same entry records that the body "covers the canonical C/A keyword set mapped onto all 4 frameworks", that the skill is "mapped to 10-primitive axes" (P4 primary, P3 declarative policy, P6 audit/evidence), and that the frontmatter was "validated by `js-yaml`" (source doc).

The entry closes with a positioning statement: "This is the corpus-enrichment addition that closes the C/A residual structurally" (source doc). That is the skill's whole reason to exist: not a new detection capability, but the structural fix for a coverage gap.

## Lifecycle markers in the changelog

The changelog carries three dated entries (source doc):

1. 2026-08-06, cycle 9 initial v1: creation, as above.
2. 2026-08-06, cycle 9 RSI corpus-enrichment substantive entry: the skill was "added as one of the 3 corpus-enrichment skills (PR #179) closing the 17 residual cells post-cycle-8", as "the corpus-additive anchor for the continuous/adaptive primitive in the 10-primitive spine (per `internal-big-picture`)". The entry also records a lifecycle control: "The cycle-9 multi-seed fit on the enriched 73-skill corpus held K_kept=2 (below the 25% re-fit trigger per `hyperspherical-harmonic-curve` §Lifecycle)". In other words, adding this skill did not trip the curve re-fit threshold, so no re-fit followed.
3. 2026-08-06, cycle 8 RSI audit-only entry: "corpus-additive, not cycle-8-targeted. The cycle-8 audit ran on the pre-enrichment 70-skill corpus; this skill's fit contribution was not in scope" (source doc). This entry is bookkeeping: it explains why an earlier cycle's audit does not reflect the skill.

The numbers to keep straight: 70 skills pre-enrichment, 73 after the 3 corpus-enrichment skills, 17 residual cells closed by those 3, 2 of which are this skill's cells (docs 06).

## In-repo touchpoints

The Examples section records what the skill owns or extends: "In-repo touchpoints, sections this skill owns or extends: Changelog, Continuous/adaptive coverage for continuous runtime detection falco (curve-guided-rsi cycle-9 corpus-enrichment edit)" (source doc). So the skill's footprint in its own file is exactly two sections, and changes to either are changes this skill owns.

## Boundary routing

The Examples section carries one routing rule: "Boundary case, when the request only names a trigger without the artifact it acts on, route to the owning surface instead of improvising here" (source doc). This is a scope rule, not an escalation rule: a request that says "detect when X happens" without saying what X acts on cannot be served by this skill, because this skill's detection rules are always written against a named artifact (a mount, an enrollment, a telemetry series). The correct behavior is to find the owning surface and route there.

## Guidelines and scope discipline

The Guidelines section is one sentence: "Every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job" (source doc). Combined with the boundary rule above, the skill's operating discipline is:

- Serve only what the frontmatter description names: runtime security detection via the four frameworks, for yubiOS.
- Route anything that names a trigger without an artifact to the owning surface.
- Treat additions (a fifth framework, a new primitive anchor) as corpus changes requiring the cycle-9-style review, not as routine use.

## What this doc does not do

It does not speculate about future cycles, does not interpret the curve-fit machinery beyond quoting the K_kept=2 record and its trigger reference, and does not guess at the contents of PR #179 or the deep-research streams beyond what the changelog states. The changelog is the record; this doc is its index.
