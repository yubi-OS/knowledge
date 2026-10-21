# 05-failure-modes-and-scope-boundaries

**Scope.** Documented failure modes, negative results, and explicit non-claims. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-walk-leg-verdict-2026-10-17.md, no external web dig

## Failure modes the record documents

The ground source is unusually explicit about what went wrong and what it does not claim. This doc groups those findings.

## Failure mode 1: a band defined outside its positives

The hierarchy-spectral band required D in [1, 1.45). The depth-6 gasket positives it was meant to flag have D from 1.559 to 1.601. The band could never catch its intended class at this depth and canvas. Frozen rule D3 failed for this reason.

## Failure mode 2: a direction rule with negative margin

Rule D1 assumed positives and negatives separate on d_w in a fixed direction. The smallest positive d_w was 2.044 and the largest negative 4.645, a margin of -2.60. More damaging, under policy v23 all ten uniform-random seeds selected hierarchy-spectral, as did the hexagonal variant. The band fired on exactly the arrangements it should reject.

## Failure mode 3: removing a clause can widen a rule

The obvious minimal fix was to drop the `spectral.d_w` clause and keep the band. The record rejects it: without its walk clause the band would cover every arrangement with 300 or more droplets and D in [1, 1.45). Removing a constraint from a conjunctive rule broadens it. The record therefore deletes the band entirely and removes the clause only from hierarchy-confirmed, where the change affects the label but not the target (lane-draft in both versions).

## Failure mode 4: an unsaturated estimator

The hexagonal control should read 2.0 plus or minus 0.15. It read 2.995 at N = 366 and 2.373 at N = 1095, and only 2.143 at N = 3282. The saturation check failed at every size. The gasket-versus-random sign flipped from negative to positive between N = 1095 and N = 3282. The record treats this as UNINTERPRETABLE rather than reading the N = 3282 sign pass (10 of 10 seeds) as a result.

## Failure mode 5: testing the wrong estimator

The router reads the 64-walker walk on the mask grid. Both sign studies used the 4096-walker walk on the points path. The record says plainly: the quantity the router clause reads has never been tested. This is a scope boundary on every walk claim in the record.

## Failure mode 6: a floor that blocks a negative control

The jittered gasket was blocked by the 300-droplet floor, at 267 to 284 traced components. A negative control that never reaches the rule cannot test it. The record reports the block rather than lowering the floor.

## Failure mode 7: documentation drift and stale claims

The KV copy of AGENT.md carried a stale policy line (v21 live, while health reports v24), possibly a stale approver allowlist claim, a dead map_url (410 at /map/), table rows split by unescaped pipes at lines 108, 232, 234 and 241, an unclear status for the close route and stale-dispatch sweep at lines 175 to 195, and 25 em dashes on 21 lines. These are reported, not fixed.

## Negative results, stated as such

| Result | Statement in the record |
|---|---|
| D3 | Failed |
| D1 | Failed, margin -2.60 |
| Sign study at 366, 1095 | UNINTERPRETABLE |
| Sign study at 3282 | UNINTERPRETABLE under the frozen rule, despite sign readings passing |
| Walk leg overall | Cannot carry hierarchy evidence in the tested range |

## Explicit non-claims

1. The record does not claim the gasket has a higher or lower walk exponent than random arrangements.
2. It does not claim the router's 64-walker mask-grid d_w was validated or invalidated; it was never tested.
3. It does not claim walk d_w is useless; it is retained as diagnostic.
4. It does not schedule a revisit; it only names what one would need (larger N, a saturation-insensitive estimator or return-probability dimension, a new pre-registration).
5. It does not fix the six KV content errors; it hands them to Jenny with an ordering (fix KV first, then re-sync the mirror).
6. It does not lower the 300-droplet floor or retune any threshold after seeing data.

## Scope boundaries

- Canvas sizes L 320, 352, 384 for item 1.
- N = 366, 1095, 3282 for item 2.
- Ten random seeds per configuration.
- One hexagonal variant in item 1; a hexagonal control at each N in item 2.
- Changes to production: one policy promotion (v24), three asserted KV replacements, one mirror sync. Nothing else.

## Why naming failures is the deliverable

The record's value lies in converting an attractive but unsupported feature (walk-based hierarchy routing) into a documented non-feature with explicit conditions for revisiting. Each failure mode above has a specific number behind it, which is what makes the demotion defensible to a later reviewer.
