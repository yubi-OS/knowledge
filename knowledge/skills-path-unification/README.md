# Skills path-unification fix SPEC (2026-10-07)

This corpus documents the 2026-10-07 skills path-unification fix spec for `yubi-OS/yubiOS/skills/` on main. It covers the canonical path vocabulary (the invariant every skill path must satisfy), the five class rules R1 to R5 that repair dead or wrong paths, the edit boundaries, the five-lane disjoint partition, the per-lane output contract, the advisor checks, and the enforcement lint shipped into `generate_skill_registry.py`. Every dig source for this corpus scored below 0.5 (0 high, 20 low), so all technical claims rest on the ground-source spec and the dig is cited only as weak context.

**Ground source:** `yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md`

## Documents

| NN | File | Scope | Clef outline score |
|---|---|---|---|
| 01 | [01-canonical-path-vocabulary-the-invariant.md](01-canonical-path-vocabulary-the-invariant.md) | Canonical path vocabulary (the invariant): detailed analysis grounded in yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md. | 1.8680 |
| 02 | [02-class-rules.md](02-class-rules.md) | Class rules: detailed analysis grounded in yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md. | 1.4350 |
| 03 | [03-boundaries.md](03-boundaries.md) | Boundaries: detailed analysis grounded in yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md. Internal-record subtopic, no dig. | 0.6827 |
| 04 | [04-lane-partition-disjoint-files.md](04-lane-partition-disjoint-files.md) | Lane partition (disjoint files): detailed analysis grounded in yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md. Internal-record subtopic, no dig. | 1.0048 |
| 05 | [05-output-contract-per-lane.md](05-output-contract-per-lane.md) | Output contract (per lane): detailed analysis grounded in yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md. Internal-record subtopic, no dig. | 1.0692 |
| 06 | [06-advisor-checks.md](06-advisor-checks.md) | Advisor checks: detailed analysis grounded in yubi-OS/yubiOS refs/skills-path-unification-2026-10-07.md. Internal-record subtopic, no dig. | 0.8874 |

Docs 01 and 02 are dig-backed (searXNG + Clef weighting). Docs 03 to 06 are internal-record subtopics grounded only in the ground-source document, with no external web dig.

## Research summary

- Results collected: 20 results collected (10 per dig-backed doc, 2 digs).
- Clef source-quality split: high >= 0.5: 0; low < 0.5: 20.
- Decision-model traffic: 5 jev requests (1 outline score request + 4 noul weighting batches).
- Redos: 0 redos.
- Skips: 0 skips.
- Weak-backing rule: every source under 0.5 is labeled `(weak backing, clef weight < 0.5)` wherever it is cited; load-bearing technical claims rest on the ground-source document.

## Preflight

Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200
