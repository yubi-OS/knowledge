# 01 When to Use and the Sibling Routing Map

Scope: when repo-refs-skill is the right tool, when it is not, and which sibling skill owns each adjacent substrate. This is an internal-record subtopic, no dig: every claim below is grounded in the source doc, yubi-OS/yubiOS skills/repo-refs-skill/SKILL.md.

## What the skill is

The source doc defines repo-refs-skill as a refreshable deep-archival routine for a repo's refs/ directory. It enumerates every refs/*.md, fits a hyper-sphere RSI curve on the corpus (per hyperspherical-harmonic-curve), runs the bounded recursive-self-improvement loop on the archive itself (per recursive-self-improvement), and accepts a deep-research topic per cycle that dispatches parallel subagents to author a new refs/<topic>-YYYY-MM-DD.md filling the cycle's top sparse cell (per parallel-deep-research). The refs/ corpus is the project's durable knowledge: design notes, prior-art surveys, ADR drafts, deep-research outputs, lifecycle artifacts, cycle reports. The curve is the prioritization lens for which topics need a fresh refs/ doc next; the RSI loop is the edit protocol on the archive; the deep-research hook is the cycle's intake.

## Trigger conditions (source doc, "When to Use")

The source doc lists 6 triggers:

1. A new Sauna session opens on yubi-OS/yubiOS and needs the project's durable knowledge, meaning the refs/ archival layer rather than the git+Linear event stream.
2. After a major theme of work lands. The doc cites the 9-cycle RSI loop of 2026-08-04 through 2026-08-07, which produced the repo-history-skill, hyperspherical-harmonic-curve, and curve-guided-rsi refs/ series, as the example that required a refresh plus a sparse-cell audit pass.
3. A "deep research on topic X" directive lands where the output belongs as a refs/ doc, not a session-only synthesis. The topic becomes the cycle's intake; 3 to N parallel subagents are dispatched.
4. A self-archaeology cadence fires and the agent wants to compare its SELF-doc substrate against the refs/ topic distribution. The source doc calls this cross-substrate drift detection: are there refs/ docs on every primitive the SELF-doc advertises?
5. A "fill the refs/ gap" decision needs an audit. The doc cites the OMN-108 misbehavior-cutoff cluster: the audit revealed no refs/adr-032-* doc existed, so the cycle dispatched the fill.
6. The user says any of: "refresh the refs archive", "what's in refs/", "deep research X with a refs/ doc", "audit the refs/ topic coverage", "what topics are missing from refs/".

## Routing map (source doc, "When NOT to Use")

The source doc routes 7 adjacent cases elsewhere, each on a different substrate:

| Case | Route to | Why |
|---|---|---|
| Git + Linear event history | repo-history-skill | Different substrate: the event stream, not the archival layer |
| Single-doc RSI | single-action-curve-rsi | Atomic, one file, one action; repo-refs-skill is the multi-file parent |
| Memory-file audits (SELF.md, USER_PREFERENCES) | curve-guided-rsi-self | Different substrate: the agent's identity layer |
| Skill audit (SKILL.md corpus) | curve-guided-rsi or curve-guided-rsi-self | Different substrate: skills vs docs |
| Security audit of a refs/ corpus | security-and-hardening | Different lens |
| Reading a single refs/ doc | Read it directly (GET /repos/{r}/contents/refs/{file}) | One doc is one cycle's input, not the skill's primary mode |
| The former agent-skills mirror's refs/ | None; repo retired 2026-09-24 | yubi-OS/yubiOS is the single target |

The substrate distinction is the load-bearing routing rule. repo-history-skill and repo-refs-skill are siblings under curve-guided-rsi: the predecessor audits the event layer (git plus Linear), this skill audits the archival layer (synthesized knowledge in refs/*.md). They compose at the cross-substrate drift detector level, where the has_cross_reference primitive is the join: every Linear OMN issue should have at least 1 refs/ doc cross-referencing it.

## The historical edge case

The source doc records that the agent-skills mirror kept only 3 refs/ files as of 2026-08-07 (cycle5-results-2026-08-06.md, repo-history-skill-cycle-2-2026-08-07.md, repo-history-skill-cycle-3-2026-08-07.md) because it held cross-cutting cycle outputs but not the yubiOS-specific bulk. The mirror was retired 2026-09-24. Fitting on the mirror would degenerate at N < 20, so the skill's single target is yubi-OS/yubiOS refs/.

## Practical reading

Two triggers dominate in practice. The refresh trigger (1, 2, 6) is maintenance: re-enumerate, re-fit, publish the coverage map. The intake trigger (3, 5) is growth: a named topic becomes 3 parallel subagent streams whose synthesized output lands in refs/ and re-fits the curve. If a request is about one file only, the skill itself says route to single-action-curve-rsi; if it is about events rather than knowledge, route to repo-history-skill.

All content in this doc is internal-record from the source doc; no searXNG dig was run for this subtopic.
