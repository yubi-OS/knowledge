# Outline decomposition and jev validation: Phase 1

Scope: deriving the ref slug, decomposing a request into subtopic docs along the domain's own joints, and the single score-metric jev request that kills padding before any research spend.

## Deriving the ref

The ref is the corpus's directory name under the knowledge repo: a lowercase-hyphenated topic slug (source doc, yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md). The skills variant of the mint uses the same convention for its landing path: one corpus directory per ground-source SKILL.md, named after the skill in lowercase-hyphenated form (skills-variant brief, 2026-10-06).

## Decompose by the domain's joints

The source doc specifies an outline of 6 to 14 subtopic docs. Each doc gets a one-line scope statement and 2 seed dig queries. The instruction that matters most is negative: decompose by the domain's own joints, meaning subsystems, lifecycle stages, or comparison axes, not by round count (source doc). The doc's anti-pattern list names the failure this prevents: inventing the outline. If you cannot state each doc's scope in one line, the decomposition is wrong (source doc). The red-flag list gives the exit condition: if the outline collapses below 4 load-bearing docs, the request is probably a single research question rather than a corpus, and the route is parallel-deep-research instead (source doc).

For a skills-variant mint the decomposition rule is sharpened: decompose by the SKILL.md's own sections, because the corpus explicates that document (skills-variant brief, 2026-10-06). This corpus's own 8 docs follow the ground source's section joints: routing, the preflight gate, outline validation, dig and weighting mechanics, the author fan-out contract, the research DB, the push and verification chain, and merge and anti-patterns.

## The jev validation gate

The outline is validated with ONE score request before any dig runs. One question per subtopic, all subtopics in one request, with the criteria list ordered lowest-first: "padding: drop", "marginal: keep only if the dig comes back strong", "load-bearing: core subtopic" (source doc). Score 0 subtopics are dropped; score 1 subtopics stay only if their dig comes back strong (source doc). The full answers, including score, probabilities, legend, and usage tokens, are recorded in outline.json (source doc).

Guideline 1 in the source doc explains why this gate is never skipped: it is the cheapest place to kill a bloated corpus. The worked example in the source doc shows the gate operating: an anticipated 9-doc outline for an RK3588 secure boot corpus had 2 padding docs dropped, leaving 7 (source doc).

This mint's own outline validation ran through the typesafe/jev-1.13 decision model on 2026-10-07: all 8 subtopics scored between 0.61 and 1.65, no subtopic scored 0, so all 8 were kept (outline.json, validation answers). The lowest score, 0.61 for the preflight-gate doc, sat above the drop threshold but below the 0.78 confidence spread of the strongest doc, which is exactly the "marginal: keep only if the dig comes back strong" band; its dig returned 12 results and the doc shipped.

## Why a decision model, not a vibe

The metric mapping table in the source doc ties each decision type to one metric: score for outline load-bearing-ness, noul for source quality weighting, choice for rare either-or judgments (source doc). External documentation on the jev family describes the same design: a typed decision endpoint that returns calibrated, structured answers rather than free text, so the caller can store the raw answer object and audit it later (https://defapi.org/model/typesafe/jev-1.13, weight 0.20, weak backing; https://docs.typesafe.ai/models, weight 0.24, weak backing). Research on LLM-as-judge evaluation supports the same principle from the academic side: decomposing a judgment into explicit criteria makes the evaluation more reliable than a single holistic score (https://arxiv.org/html/2509.16093v2, weight 0.22, weak backing). These dig sources back the design rationale but not the specific pipeline mechanics, which remain grounded in the source doc.

## Sources

- yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc, fetched 2026-10-07)
- https://defapi.org/model/typesafe/jev-1.13 (weight 0.20, weak backing)
- https://docs.typesafe.ai/models (weight 0.24, weak backing)
- https://arxiv.org/html/2509.16093v2 (weight 0.22, weak backing)
