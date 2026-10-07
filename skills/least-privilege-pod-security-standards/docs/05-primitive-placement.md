# 05 - Placement on the 10-primitive spine

Scope: how the skill maps onto the yubiOS 10-primitive model, which primitives it anchors, and which downstream consumers credit its contribution. Internal-record subtopic: grounded in the source doc only, no external dig.

Per the source doc (`yubi-OS/yubiOS skills/least-privilege-pod-security-standards/SKILL.md`), this skill is mapped onto 3 of the 10 primitive axes. This doc records that mapping and the downstream obligations that follow from it.

## The three primitive placements

The skill's primary placement is P2, least privilege. That is the primitive the skill exists to serve: it is the corpus-additive anchor for the least-privilege primitive in the 10-primitive spine, added as one of the 3 corpus-enrichment skills of cycle-9 (PR #179), closing the 17 residual cells left after cycle-8 (source doc).

The second placement is P3, declarative policy. PSS profiles and OPA Rego policies are both declarative artifacts, so the skill contributes to the declarative-policy primitive through both of its legs at once. A restricted profile is a policy declaration evaluated by the admission controller; a Rego deny rule is a policy declaration evaluated by OPA. Neither requires imperative enforcement code, which is the property that earns the P3 placement (source doc).

The third placement is P6, audit/evidence. The skill's description names the evidence surfaces explicitly: PSS admission logs and OPA decision logs are audit artifacts (source doc). Doc 04 covers what those surfaces produce; the placement claim here is that the skill counts them as first-class outputs, not side effects.

## The bridge to internal-big-picture

The source doc positions the skill relative to `internal-big-picture`, the 10-primitive map that bridges security telemetry, compliance assurance, federal security doctrine, and OS architecture. This skill is the corpus-additive anchor for the least-privilege primitive in that spine (source doc). In the primitive vocabulary, least privilege is the axis under which every other yubiOS skill's least-privilege facet is recorded, and this skill supplies the pod-policy-layer definition of that axis.

## Downstream consumers

The source doc names the downstream consumers that credit this skill's contribution: the yubiOS CI admission gate, the `internal-big-picture` 10-primitive map, and the `systemd-hardening` complementary skill (source doc). Each consumes the skill differently:

- The CI admission gate consumes the enforcement half: it applies the PSS and Rego expressions of the keyword set as gates on what enters the platform.
- The 10-primitive map consumes the coverage claim: the least-privilege axis is served by this skill's 16-cell mapping.
- The `systemd-hardening` skill consumes the boundary: host-level least privilege and pod-level least privilege are complementary layers, not competitors (source doc; see doc 06).

## Coverage accounting and change discipline

The source doc sets a change-discipline rule: any change should be reviewed for impact on LP coverage, and gaps in LP attributable to this skill are tracked in the cycle-9 run log at `refs/curve-guided-rsi-v2-cycle9-corpus-enrichment-2026-08-06.md` on `yubi-OS/yubiOS` (source doc). The coverage arithmetic behind the skill's creation: post-cycle-8 the least-privilege primitive stood at 63 of 70 cells, so 7 residual cells remained, and this skill is the addition that ensures all 7 are well-served (source doc).

The cycle-9 fit context is also recorded in the source doc: cycle-9 ran on the enriched 75-skill corpus (70 existing plus 5 corpus-enrichment additions), and the 7.1 percent corpus growth stayed below the 25 percent re-fit trigger defined by `hyperspherical-harmonic-curve` section Lifecycle, so no curve re-fit fired (source doc). The cycle-8 audit was audit-only and ran on the pre-enrichment 70-skill corpus, so this skill's fit contribution was not in scope for it (source doc).

## What the placement implies for edits

Because the skill anchors P2 and reaches P3 and P6, an edit that touches only the PSS content changes the P2 and P3 placements but leaves P6 untouched only if the audit-artifact references are preserved; an edit that drops the audit-artifact language silently breaks the P6 claim. The source doc's changelog discipline (every cycle entry records what the edit did to the primitive mappings) is the mechanism that keeps this honest, and corpus consumers should treat that changelog as part of the skill's contract.
