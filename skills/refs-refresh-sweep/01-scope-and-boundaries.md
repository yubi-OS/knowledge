# 01 - Scope and Boundaries

Scope: when refs-refresh-sweep is the right tool, when it is the wrong tool, and the hard constraint on what its dig layer can reach. This subtopic is internal-record material derived from the source doc; no searXNG dig was run for it.

Grounding spine: `yubi-OS/yubiOS skills/refs-refresh-sweep/SKILL.md` (source doc). Every claim in this document is a restatement or direct consequence of that file.

## What the skill is for

The skill is a full-corpus deep-research refresh sweep for a repository documentation corpus. It was built for the `refs/` directory of yubi-OS/yubiOS, which held 234 or more date-stamped docs at the time of the validating run. Its job is to answer one question across every doc in a corpus: has upstream reality moved far enough since this doc was written that the doc needs a targeted refresh? The source doc records the validating run of 2026-09-29: 234 docs triaged, 14 docs dug, 144 results weighted, 15 PRs opened and merged.

## When to use it

The source doc names 4 entry conditions:

1. A docs corpus with date-stamped files has aged past a median of 30 days, and the upstream topics it tracks are fast-moving (releases, versions, hardware, CI).
2. The user asks for full-corpus sweep language: "go over every ref and find what needs a refresh", "refresh every ref doc", "stale docs sweep".
3. A periodic cadence fires. Quarterly is the stated sane default; the 2026-09-29 run found 14 of 234 docs materially stale after roughly 9 weeks.
4. The run needs to produce an auditable, persisted research artifact rather than ad-hoc lookups. The research DB that Phases 1 to 5 produce is a first-class deliverable, not a side effect.

## When NOT to use it

The source doc is explicit about 4 wrong-tool cases, and each has a named alternative:

1. Single-doc refresh. Reading one doc and verifying it against primary sources directly is cheaper than a sweep. No sweep machinery needed.
2. Corpus structure audit, meaning "which topics are missing from the corpus". That is `repo-refs-skill` (sparse-cell detection), not this skill. The division of labor: this skill refreshes docs that exist; that one finds docs that do not.
3. Git and Linear event history. That is `repo-history-skill`.
4. Anything whose dig sources require credentials the searXNG layer cannot reach, such as paywalled vendor portals. The searXNG layer is anonymous HTTP only; if a topic cannot be verified anonymously, this skill cannot refresh it honestly.

## The boundary in practice

Three boundaries follow from the source doc's own framing:

- The sweep refreshes an existing corpus, it does not grow one. Its intake is the enumeration of Phases 1 to 2, and its output is one refresh PR per top-ranked doc (Phase 6), never new corpus structure.
- The dig scope is bounded by rank, never all docs (source doc guideline 4). A sweep touches the top-N stalest, fastest-moving docs, not the whole corpus. 14 of 234 in the validating run.
- Honesty is a deliverable. The source doc states that an honest "no material change found" verdict is a success worth exactly as much as a change PR; invention is grounds for PR rejection. 4 of the 14 validation PRs were no-change verdicts.

## Adjacent skills and how they divide the space

The source doc's "Interaction with Other Skills" section fixes the interfaces:

- `repo-refs-skill` is upstream: the corpus it archives is the corpus this skill refreshes, and this skill's triage output is that skill's Mode C intake selector.
- `defapi-jev` is the decision-model layer defining question shapes, batching, and thresholds. Read it before writing jev questions.
- `parallel-deep-research` is the fan-out protocol this skill specializes: one PR per doc instead of one synthesized doc.
- `github-api` supplies the Git Data API chain the writes use.
- `doubt-driven-development` is applied per refresh finding before an in-place edit lands.
- `github-actions` is deliberately irrelevant: refresh PRs do not dispatch CI (source doc).

## Reading order

Newcomers should read this doc first, then 02 (endpoints and preflight), then the phase docs 03 to 08 in order, then 09 (failure modes and verification) before operating. The phase numbering 0 to 6 in the source doc maps to corpus docs as follows: Phase 0 to doc 02, Phase 1 to doc 03, Phase 2 to doc 04, Phase 3 to doc 05, Phase 4 to doc 06, Phase 5 to doc 07, Phase 6 and merge orchestration to doc 08.
