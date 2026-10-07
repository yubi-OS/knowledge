# negative-skill-space knowledge corpus

Knowledge corpus for the yubiOS skill `negative-skill-space`: the 12-axis qualitative sweep (Audience, Inputs, Outputs, Mode, Assumption set, Adjacent problems, Failure modes, Lifecycle, Composition, Knowledge sources, Calibration, Recursion) for gap-mapping any skill before recursive-self-improvement cycles; upstream gap-proposer in the curve-rsi dispatch chain.

Ground source of record: yubi-OS/yubiOS `skills/negative-skill-space/SKILL.md` (4662 B, fetched with User-Agent omni-agent/1.0). The corpus explicates that file; it does not replace it.

## Docs

1. [02-twelve-axis-sweep.md](02-twelve-axis-sweep.md) - the 12 axes themselves, what each captures about a target skill file, and how the sweep gap-maps a file before RSI.
2. [05-composition-rule.md](05-composition-rule.md) - NSS as option, atom as default: the Composition Rule, the dispatch chain, and the fallback output semantics. Internal-record doc, no dig.
3. [06-axis-skill-family.md](06-axis-skill-family.md) - the sweep materialized as the nss-* axis skill family, with the external grounding of the audience axis (Diataxis) and the assumption axis (Design by Contract).
4. [09-anti-patterns-and-boundary.md](09-anti-patterns-and-boundary.md) - the NSS-executes-edits anti-pattern, the trigger-only boundary case, and the frontmatter scope guideline. Internal-record doc, no dig.

## Research summary

- Results collected: 48 (top 6 per query, 8 queries across 3 web-shaped subtopics, including 1 redo pass on subtopic 07).
- Weight split (noul): 17 high (>= 0.5) / 31 low (< 0.5) of 48. Every collected result was weighted; none shipped unweighted.
- Jev requests: 4 (1 outline validation with 9 score questions, 3 weighting batches of 16 noul questions) via DefAPI direct, model typesafe/jev-1.13. Usage: 5461 input / 1015 output tokens, 57 questions total.
- Redos: 1 (subtopic 07, coverage-claims-governance; both the original dig and the redo came back thin).
- Skipped docs: 07-coverage-claims-governance, a marginal subtopic (outline score 0.5, keep only if the dig comes back strong) whose dig and redo both returned results dominated by dictionary entries and off-topic pages. Recorded in research-db/digs/07-coverage-claims-governance.json.
- Dropped subtopics at outline validation: 01, 03, 04 (argmax level 0, internal-record content folded into docs 05 and 09), 07 (marginal, thin dig), 08 (argmax level 0, changelog content folded into doc 06).

Research-db (schema v2): [research-db/outline.json](research-db/outline.json), [research-db/archive.json](research-db/archive.json), [research-db/jev-log.json](research-db/jev-log.json), [research-db/preflight.json](research-db/preflight.json), [research-db/db.ts](research-db/db.ts), and per-subtopic dig records under [research-db/digs/](research-db/digs/).

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); DefAPI direct (typesafe/jev-1.13) 200 on all 4 requests during this mint.
