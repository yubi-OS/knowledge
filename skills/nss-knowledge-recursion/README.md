# nss-knowledge-recursion knowledge corpus

Minted 2026-10-06 from the yubiOS ground source `yubi-OS/yubiOS skills/nss-knowledge-recursion/SKILL.md` (41,303 B fetched). The corpus explicates the cycle-17 NSS synthesis skill covering the knowledge_sources axis (10/12) and the recursion axis (12/12): citation patterns, BibTeX/JATS, docs-as-code xrefs, RFC/BCP/STD citation, reference managers, prior art, provenance and durability, link-rot CI, closed-loop self-improvement, blameless postmortems, and learning loops.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | evidence-graph-and-gates | The evidence graph unit of evaluation, the 12-axis 0-3 rubric shape, and the four gating rules plus the no-compensation rule |
| 02 | citation-patterns-bibtex-jats | Citation conventions: IETF RFCXML reference style, BibTeX quality, JATS4R structured citations, persistent identifiers |
| 03 | docs-as-code-xrefs-integrity | Docs-as-code cross-references, xrefcheck, the DOCER study on outdated code references, link-rot and staleness CI |
| 04 | rfc-standards-citation | RFC/BCP/STD citation practice: normative vs informative roles, section citations, status and maturity gates |
| 05 | reference-manager-interoperability | BibTeX/RIS/CSL interchange, Zotero export fidelity, Citavi/KBibTeX mappings, identifier preservation |
| 06 | prior-art-landscape | Prior art vs see-also, taxonomy-pattern related work, rejection criteria, prior-art search discipline |
| 07 | provenance-authority-durability | Primary vs secondary sources, version and access dates, DOI/permalink/archive durability, link-rot data |
| 08 | closed-loop-recursion | Strange loops (Hofstadter), double-loop learning (Argyris), self-archaeology trajectory notes, loop-closure gates |
| 09 | blameless-postmortems-learning-loops | Google SRE blameless postmortems, postmortem-to-runbook closure, learning-loop triggers/owners/verification, anti-self-deception metrics |

## Research summary

- Results collected: 120 (108 from 18 attempt-1 queries across 9 subtopics, 12 from the subtopic 06 redo)
- Weight split: 52 high (>= 0.5) / 68 low (< 0.5) via the noul metric
- Jev requests: 11 (1 outline score validation + 10 noul weighting batches), usage 13,387 input / 2,594 output tokens
- Redo counts: 1 (subtopic 06 prior-art-landscape, attempt-1 dig too thin for the corpus angle)
- Skipped docs: none. The outline candidate 10 (yubios-surface-patterns) was an internal-record subtopic scored 0.06 by the outline validation and dropped as padding before digging.

## Validation

Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator); decide via DefAPI direct (typesafe/jev-1.13), campaign preflight run orchestrator-side, agent-side probe skipped for speed.

Outline validation scores (0 = drop, 2 = load-bearing): 01: 1.23, 02: 1.51, 03: 1.54, 04: 1.59, 05: 1.40, 06: 1.42, 07: 1.66, 08: 1.56, 09: 1.54, 10: 0.06 (dropped).

## Research-db

The `research-db/` directory holds the schema-v2 record: `preflight.json`, `outline.json`, `archive.json` (120 entries, one decision record each), `digs/*.json` (9 dig records), `jev-log.json` (11 requests), and `db.ts` (TypeScript interfaces).
