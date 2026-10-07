# nss-audience knowledge corpus

Ground source: yubi-OS/yubiOS `skills/nss-audience/SKILL.md` (the Audience axis of the 12-axis negative-skill-space sweep: classifying every file by WHO it is for, audience-gap detection, the audience x job x artifact matrix, Diataxis-style modes). The corpus explicates the skill; the SKILL.md remains the primary source of record.

## Docs

- `01-audience-model.md` - The four-dimension audience model (role, proximity, interaction, mode) and the controlled vocabulary that enforces it
- `02-audience-inventory.md` - Audience signal inventory: one evidence-backed row per file with explicit_audience, inferred_roles, primary_role, experience, interaction, mode, jobs, confidence
- `03-audience-matrix.md` - The audience x job x artifact coverage matrix: served, partial, gap, n/a cells scored by importance x task-risk x evidence-of-demand x (1 - coverage)
- `04-audience-patch.md` - Audience gap patches: targeted Audience blocks and machine-readable front matter that declare role, job, prerequisites, and out-of-scope boundaries
- `05-negative-space.md` - Negative-space findings: missing arrival paths, missing prerequisites, missing exit codes, missing rollback sections flagged as partial or gap cells
- `06-doc-as-code-enforcement.md` - Doc-as-code enforcement: CI checks that validate audience vocabulary, primary audience per page, executable examples, and owner and review_after for high-risk cells
- `07-anti-patterns.md` - Anti-patterns and misclassification traps: folder-name classification, role collapse, header-only analysis, CI-as-developer, partial-as-served, author-bias inference
- `08-verification-composition.md` - Verification checklist and composition: vocabulary enforcement, js-yaml parseability, mixed-audience per-section notes, and how the Audience axis pairs with negative-skill-space

## Research summary

- Results collected: 139 (deduplicated by URL across 26 searXNG queries: 16 first-pass + 10 redo)
- Weight split: 26 results >= 0.5 (authoritative) / 113 results < 0.5 (weak, labeled in text)
- Jev requests: 14 (usage 18250 input / 3096 output tokens), model typesafe/jev-1.13 via DefAPI direct (https://api.defapi.org/api/v1/decisions)
- Redo digs: 5 subtopics redone with different queries after thin first passes (audience-inventory, audience-matrix, negative-space, doc-as-code-enforcement, anti-patterns)
- Skipped docs: none (all 8 subtopics authored)
- Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide endpoint healthy (orchestrator), agent-side probe skipped for speed per skills-variant brief

## Research-db

Schema v2: `research-db/preflight.json`, `research-db/outline.json`, `research-db/archive.json` (139 weighted result entries, all weights non-null), `research-db/digs/<NN>-<slug>.json` (8 dig records with redo logs), `research-db/jev-log.json` (per-request record), `research-db/db.ts` (TypeScript interfaces).
