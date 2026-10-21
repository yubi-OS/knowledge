# Org-wide upstream bump (2026-10-17)

Knowledge corpus `org-upstream-bump`, minted in wave 22 of the `refs/` mint (Lane 5).

**Ground source:** `yubi-OS/yubiOS refs/org-upstream-bump-2026-10-17.md`

This corpus explicates the 2026-10-17 org-wide upstream bump plan for yubi-OS. The source of truth is PINNED.md on main at 3e76363d. The goal: every upstream the org consumes sits at its latest stable release, carried fork commits are rebased on top of that release, and every consumer reads the pin from PINNED.md. The plan inventories 28 rows (forks, release binaries, container images, GitHub Actions, base images), decides BUMP, HOLD, or no change for each, sets five rules every lane follows (backup tags, advisor-only merge, no Docker push, cited pins, recorded holds), and defines acceptance as a grep-clean PINNED.md, four green static checks, a green ci_firmware-rk build with Docker push OFF, and passing fork compare checks for optee_os and optee_ftpm. This corpus has the strongest dig of Lane 5: 8 of 20 results scored at or above 0.5.

## Documents

| NN | File | Scope | Clef outline score |
|---|---|---|---|
| 01 | `01-inventory-and-decisions.md` | Inventory and decisions (dig-backed) | 1.2761 |
| 02 | `02-rules-every-lane-follows.md` | Rules every lane follows (dig-backed) | 1.7814 |
| 03 | `03-acceptance.md` | Acceptance (internal record) | 1.0064 |
| 04 | `04-falsification-gates-and-empirical-results.md` | Pre-registered gates, measured empirical numbers, and verification verdicts. Internal-record subtopic, no dig. (internal record) | 1.6146 |
| 05 | `05-failure-modes-and-scope-boundaries.md` | Documented failure modes, negative results, and explicit non-claims. Internal-record subtopic, no dig. (internal record) | 1.2966 |
| 06 | `06-integration-and-operational-governance.md` | Integration with yubiOS and Steady Orbit /jev/ endpoints, policy versioning, and audit trail. Internal-record subtopic, no dig. (internal record) | 1.5666 |

Outline scores come from `research-db/outline.json` (`validation.answers.t01..t06.score`), a clef `score` decision over three lowest-first levels (padding, marginal, load-bearing). No subtopic was dropped.

## Research summary

- Results collected: **20** (2 searXNG queries for doc 01, 2 for doc 02, 10 kept per doc)
- Clef quality weights: **8 high (>= 0.5)**, **12 low (< 0.5)**
- jev requests: **5**
- Redos: **0**
- Skips: **0**
- Docs 03 to 06 are internal-record subtopics: they explicate the ground source directly and carry no external web dig.
- Every dig citation in docs 01 and 02 carries its exact clef weight; any source under 0.5 is labelled weak backing. Load-bearing technical claims rest on the ground source, not on the dig.

## Conventions

- Docs are numbered in outline order (`01` to `06`); filenames match `meta.json` subtopic slugs exactly.
- Docs 01 and 02 end with a `## Sources Considered` table listing all 10 dig results and their clef weights.
- House style: no em dashes, numbers as digits, headings for wayfinding.

## Preflight

Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200
