# 04: Policy Promotion, Approvals, and the Outcomes Ledger

**Scope:** approval bindings to `policy_version` (v24), audited learning promotion via `/api/jev/learnings/:id/promote`, the `jev_policy_changelog`, and the append-only `/api/jev/map/outcomes` ledger.

**Ground source:** `yubi-OS/yubiOS playbooks/steady-orbit-api.md` (2026-10-21, policy v24, deploy etag `356cb5c1c2e3e3f8b308ba6e29ab06bf27fd99fc107cc9d7f60b01d0dfb7e6b7`).

> Internal-record subtopic grounded in yubi-OS/yubiOS playbooks/steady-orbit-api.md, no external web dig.

## 1. Why approvals bind to a policy version

An approval is a human saying "yes, do exactly this under exactly these rules". If the rules change after the yes and before the action, the approval no longer means what the approver meant. The steady-orbit design (Decision 6, modules `jev-review.js` and `jev-improve.js`) makes that drift impossible by binding every approval to a fixed tuple:

| Field | Meaning |
|---|---|
| `actor` | who approved |
| `target` | what the action touches |
| `payload_hash` | hash of the exact payload approved |
| `limits` | spend or rate limits in force for this action |
| `expires_at` | hard expiry |
| `policy_version` | the policy version the approval was granted under (currently v24) |

Consequences:

- **Payload drift:** a changed payload changes `payload_hash`, so the old approval does not match.
- **Time drift:** past `expires_at`, the approval is dead.
- **Policy drift:** a new `policy_version` invalidates pending approvals granted under the old one (see section 2).

## 2. Policy changes go through one door

The playbook is explicit: policy changes go **exclusively** through:

```
POST /api/jev/learnings/:id/promote
```

A promotion performs 3 effects together:

1. **Writes KV `jev-policy.json`** (the live policy document read by the gate).
2. **Appends to `jev_policy_changelog`** (the audit trail of every policy change).
3. **Expires older pending approvals**, so nothing approved under the previous version can execute under the new one.

There is no side door: editing `jev-policy.json` in KV by hand would skip the changelog append and the approval expiry, which is exactly the class of silent change this design exists to prevent. Treat a hand-edit as an incident.

The input to a promotion is a "learning" (identified by `:id`), so a policy change always traces back to a recorded observation rather than an ad hoc edit. That gives each policy version a provenance chain: learning -> promote call -> changelog row -> new `jev-policy.json` -> approvals expired.

## 3. The outcomes ledger is append-only

Decision 7: **pre-register every gate-feeding measurement or forecast** on:

```
POST /api/jev/map/outcomes
```

The ledger refuses mutation. `DELETE`, `PUT`, and `PATCH` all return `405`. Only `POST` (append) exists. Like all `/api/jev/map/*` routes it sits behind the bearer gate (doc 03).

Pre-registration means the prediction, threshold, or measurement plan is written to the ledger **before** the result is known. When the result arrives, it is compared to what was registered, not to what someone wishes had been registered. This is what makes a gate decision falsifiable after the fact.

Examples from the ground source of what feeds gates:

- **Corpus RSI rounds:** gate on `level_dbc = 20*log10(|z|)` at `nulls >= 400`, with scorer hysteresis `{low: 0.45, high: 0.55, pre_row}` (detail in doc 05).
- **Forecast cascade Stage 3:** the bounded `clef` decision is followed by a deterministic fail-closed gate and outcomes pre-registration (doc 05).

## 4. How the pieces compose

```
learning --promote--> jev-policy.json (v N+1)
                        |-> jev_policy_changelog (append)
                        '-> pending approvals @ v N expire

measurement plan --POST--> /api/jev/map/outcomes (append-only)
                             '-> later result checked against it

task --approval {actor,target,payload_hash,limits,expires_at,policy_version}-->
     deterministic gate (jev-gate.js) --> execute (jev-execute.js) --> verify (jev-verify.js)
```

The model layer (`askJev` over `@cf/cloudflare/clef`) can suggest promotions or outcomes, but per Decision 5 model probabilities never authorize execution.

## 5. Operating rules

- Every policy change: promote call, never a KV hand-edit. Confirm the changelog row and the expired approvals after.
- Every approval check: compare all 6 bound fields, not just `actor` and `target`.
- Every gate input: pre-registered on `/api/jev/map/outcomes` before the measurement runs.
- Never attempt to "fix" a ledger row; append a correcting row instead (mutation returns `405` by design).
- After a promotion, expect pending approvals to need re-granting under the new version; this is correct behavior, not a bug.

## 6. Failure modes this subtopic prevents

| Failure | Guard |
|---|---|
| Approved payload swapped before execution | `payload_hash` binding |
| Stale approval executes under new rules | `policy_version` binding + expiry on promote |
| Silent policy edit | single promote endpoint + `jev_policy_changelog` |
| Post-hoc moving of goalposts | append-only outcomes ledger, pre-registration |
| Ledger tampering | `405` on `DELETE`/`PUT`/`PATCH` |

## 7. Cross-references

- `docs/ENDPOINTS.md` (136-route inventory + Falsification Harness matrix).
- Skills named by the ground source: `skills/jev-orchestrator/SKILL.md`, `skills/jev-corpus/SKILL.md`, `skills/falsification-corpus/SKILL.md`.
- Playbooks: `dispatch-chain-verification.md`, `rsi-regime.md`.
