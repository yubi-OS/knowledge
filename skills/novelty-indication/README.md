# Knowledge Corpus: novelty-indication

Minted 2026-10-06 from the yubiOS skill `novelty-indication` (ground source: `yubi-OS/yubiOS skills/novelty-indication/SKILL.md`). The corpus explicates the skill: the Graham v. John Deere obviousness framework (35 U.S.C. 103, MPEP 2141) adapted for engineering judgment, the KSR rejection rationale catalog, the mechanism/trigger/policy layer split, internal-first and external prior-art scanning, PHOSITA, secondary considerations, and the verdict/output discipline.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-graham-framework.md](01-graham-framework.md) | The Graham four inquiries, 35 U.S.C. 103, MPEP 2141, and the engineering-judgment mapping |
| 02 | [02-ksr-rationales.md](02-ksr-rationales.md) | The six KSR rejection rationales (MPEP 2141 III) and how to anticipate a 103 rejection |
| 03 | [03-layer-decomposition.md](03-layer-decomposition.md) | Mechanism / trigger / policy split; the mechanism-versus-policy lineage |
| 04 | [04-internal-prior-art.md](04-internal-prior-art.md) | Internal-first prior-art checks over ADRs, PRs, Linear issues, and refs/ |
| 05 | [05-external-prior-art.md](05-external-prior-art.md) | External scan categories and the USPTO search-methodology overlap |
| 06 | [06-phosita-obviousness.md](06-phosita-obviousness.md) | Level of ordinary skill and the obvious-to-try standard |
| 07 | [07-secondary-considerations.md](07-secondary-considerations.md) | Objective indicia, the evidence requirement, and the BORDERLINE escape valve |
| 08 | [08-verdict-output.md](08-verdict-output.md) | Verdict taxonomy, output template, anti-patterns, red flags, verification checklist (internal-record, no dig) |

## Research summary

- Results collected: 120 (weighted 120/120; high (>= 0.5) 59 / low (< 0.5) 61)
- Docs kept / skipped: 8 / 0
- Jev requests: 10 (usage 12740 input / 2320 output tokens), metric score for outline validation, noul for result weighting, via DefAPI direct (model typesafe/jev-1.13)
- Redos: 3 (docs 03 and 05 re-dug with different queries after thin first passes)
- Skipped docs: none

## Per-doc sources

| doc | results kept | primary (>= 0.5) | redos |
|---|---|---|---|
| 01-graham-framework | 12 | 5 | 0 |
| 02-ksr-rationales | 12 | 5 | 0 |
| 03-layer-decomposition | 24 | 15 | 1 |
| 04-internal-prior-art | 12 | 3 | 0 |
| 05-external-prior-art | 36 | 15 | 2 |
| 06-phosita-obviousness | 12 | 7 | 0 |
| 07-secondary-considerations | 12 | 9 | 0 |
| 08-verdict-output | 0 | 0 | 0 |

## Preflight

Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator-side); decide (typesafe/jev-1.13) healthy (campaign preflight, orchestrator-side). Agent-side probe skipped for speed per the 2026-10-06 speed optimizations; the first jev request of the mint (outline validation, 200 OK) serves as the live confirmation.

## Research-db

Full schema-v2 records under [research-db/](research-db/): preflight.json, outline.json, archive.json, digs/ (8 per-doc records), jev-log.json, db.ts (type definitions). Every archive entry carries a non-null noul weight.
