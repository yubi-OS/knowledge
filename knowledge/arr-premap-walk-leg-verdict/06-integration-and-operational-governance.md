# 06-integration-and-operational-governance

**Scope.** Integration with yubiOS and Steady Orbit /jev/ endpoints, policy versioning, and audit trail. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-walk-leg-verdict-2026-10-17.md, no external web dig

## The operational surface

The ground source touches three operational systems: the router policy (versioned, promoted through an audited learnings flow), the health and selftest endpoints that verify the live state, and AGENT.md, the agent-facing document served from KV with a git mirror. This doc explains how the record's changes moved through each.

## Policy versioning

Router policy is versioned by integer. Before item 1, policy v23 was live; item 1 produced v24. The change set is small and precisely described:

- Delete the hierarchy-spectral band.
- Remove the `spectral.d_w` clause from hierarchy-confirmed (label change only; target lane-draft in both versions).

A small, label-only change on one rule plus one band deletion keeps the blast radius auditable: the record can enumerate exactly which artifacts move (11 uniform-random negatives) and which do not (every gasket positive, the six gold calibration artifacts).

## The audited learnings flow

Policy v24 was promoted through the audited learnings flow with three recorded facts: proposal id l_2ae0e5c2bded4b8f, actor jenny, and zero approvals expired. The proposal id makes the change traceable; the actor ties it to the human who holds deploy authority; "zero approvals expired" confirms the approval was still valid at promotion time. This matches the broader jev governance pattern in which approvals expire and invalidate on policy change.

## Live verification

Promotion was not taken on trust. Three live checks followed:

| Check | Expected | Observed |
|---|---|---|
| Health | policy_version 24 | 24 |
| Router selftest | all checks pass | 24 of 24 pass |
| Band table | no hierarchy-spectral | absent |

Note that the selftest count (24 checks) coincides numerically with the policy version (24); they are different quantities.

## Routing after v24

Routing now reads edge-standard D and the traced droplet count only. The walk d_w is diagnostic. In operational terms, the router no longer calls into the walk path for routing decisions, which also removes the router's exposure to the Delaunay implementation question raised by the integration record (the router had called `walkCentroidMode` for the V4 pair-band `spectral.d_w` clause).

## AGENT.md: canonical copy and mirror

Jenny's ruling makes the KV copy canonical. The git mirror at `tools/point-map/AGENT.md` follows. The governance sequence the record uses is:

1. Verify the relation between copies (mirror was a strict subset: 518 of 518 lines present in order, 78 KV-only lines).
2. Apply asserted replacements to the canonical KV copy (three, for the v24 router change).
3. Poll the served bytes until they match the edited copy (matched on the third check, 20 seconds apart).
4. Sync the git mirror to the same bytes.

This order guarantees the mirror never leads the canonical copy and never contains content that KV does not serve.

## Deferred governance work

Six KV content errors were reported and not fixed, with an explicit order: fix in KV first, then re-sync the mirror. The most operationally significant are the stale "policy v21 is live" line (agents reading AGENT.md would hold a wrong policy version), the possibly stale approver allowlist claim tied to v21, and the map_url pointing at /map/, which returns 410. The em dash count (25 on 21 lines) is a style-rule violation recorded against the house rule.

## Integration with prior records

| Prior record | What it handed to this one | What this record resolved |
|---|---|---|
| arr-premap ideate-solo (2026-10-16) | Walk leg flagged implementation-dependent; router pair-band gate at d_w 2.4 | Walk removed from routing entirely |
| arr-premap integration (2026-10-16) | Hierarchy sign opposite to pre-declared (T7); Delaunay defect | Sign study under pre-registration: UNINTERPRETABLE; router no longer depends on the walk graph |

## Audit trail checklist

- Pre-registration before each of the three lines.
- Validation of the measurement path to 4e-7 before using it.
- Proposal id, actor, and approval status recorded for the policy promotion.
- Live health, selftest, and band-table checks after promotion.
- Asserted replacements, propagation polling, then mirror sync for AGENT.md.
- Errors reported with line numbers rather than silently fixed.

## Open items for the operator

1. Fix the six KV content errors, then re-sync the mirror.
2. Decide whether to schedule a walk-leg revisit; the record names the conditions but schedules nothing.
3. If revisited, measure the router's own estimator (64-walker, mask grid), not the points path.
