# prior-art-search — knowledge corpus

Ground source: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md` (fetched 2026-10-08, 21563 B). Topic: actually searching for prior attempts at similar engineering problems (software projects, technical ideas, adoption history); generating queries, running web searches, synthesizing a cited prior-art report.

## Docs

- `docs/01-scope-and-triggers.md` — Engineering vs patent prior-art disambiguation, trigger phrases, apply/do-not-use boundaries.
- `docs/02-search-anchor-and-topic-framing.md` — Restating an idea or question as a one-sentence search anchor; specificity and precision over recall.
- `docs/03-query-generation-four-angles.md` — The 3-to-5 query budget across four angles (competitors, failed attempts, academic, adjacent/historical).
- `docs/04-bounded-search-and-fetch-budget.md` — The bounded execution protocol: 3-5 searches, 2-3 fetches, one pass, no recursion; token-budget rationale.
- `docs/05-synthesis-and-report-format.md` — The prior-art report template: four categories, per-entry fields, Sources section. Internal-record, no dig.
- `docs/06-what-this-means-translation.md` — The What-this-means translation: landscape, why previous attempts failed, why no one tried, open opportunity.
- `docs/07-selection-bias-and-anti-patterns.md` — Selection bias as the defining failure mode; the seven anti-patterns and the red-flag checklist.
- `docs/08-citation-discipline-and-honest-gaps.md` — Every claim carries a URL; honest reporting of empty query angles; no invented prior art.
- `docs/09-skill-ecosystem-interactions.md` — Composition with idea-refine, ideate-solo, idea-kill, negative-skill-space, source-driven-development, novelty-indication, websearch/webfetch. Internal-record, no dig.

Docs live under `docs/` in this directory. Wait: this corpus keeps docs and research-db side by side under `skills/prior-art-search/` — `docs/` subfolder for the 9 docs, `research-db/` for the schema-v2 records.

## Research summary

- Results collected: 84 (14 searXNG queries across 7 web-shaped subtopics, top 6 kept per query; subtopics 05 and 09 are internal-record, no dig)
- Weight split (jev noul): 15 high (>= 0.5) / 69 low (< 0.5) of 84
- jev requests: 8 (1 outline validation via score, 7 weighting batches via noul), usage 9351 input / 1763 output tokens
- Model: typesafe/jev-1.13 via DefAPI direct (https://api.defapi.org/api/v1/decisions)
- Redos: 0 (all 7 web-shaped digs returned 12+ usable results on attempt 1)
- Skipped docs: none; gaps: none
- Marginal subtopics kept conditionally per the score metric: t06 what-this-means-translation (0.78), t08 citation-discipline-and-honest-gaps (1.24), t09 skill-ecosystem-interactions (0.86). t06 and t08 kept because their digs came back strong; t09 kept as an internal-record subtopic grounded entirely in the source doc's Interaction section.

Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator; per-mint probe skipped for speed); DefAPI direct (typesafe/jev-1.13) 200 on first agent-side request.
