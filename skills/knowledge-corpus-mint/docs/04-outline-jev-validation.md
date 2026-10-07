# 04 - Outline decomposition and jev validation

Scope: Phase 1: deriving the ref slug, decomposing a request by the domain's own joints, seed queries per subtopic, and the single score-metric outline validation with drop-0 semantics.

Grounding spine: yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc), plus the dig results below.

## Deriving the ref (source doc)

Phase 1 starts by deriving <ref>: a lowercase-hyphenated topic slug that becomes the corpus's directory name. The source doc's worked example turns "corpus on RK3588 secure boot" into the ref rk3588-secure-boot.

## Decomposition by the domain's own joints (source doc)

The request decomposes into 6 to 14 subtopic docs, each with a one-line scope statement and 2 seed dig queries. The governing rule is explicit: decompose by the domain's own joints (subsystems, lifecycle stages, comparison axes, key decisions), not by round count. The worked example decomposes RK3588 secure boot into 9 docs keyed to real subsystem boundaries: ROTPK and fuse provisioning; TF-A TBB chain; OP-TEE handoff; U-Boot as BL33; fTPM measured boot; DDR/TPL blob licensing; upstream mainline status; vendor SDK versus mainline tradeoffs; and a verification plan template.

The anti-patterns section turns this into a test: if you cannot state each doc's scope in one line, the decomposition is wrong. An invented outline is listed as an anti-pattern in its own right.

## The score-metric validation (source doc)

One score request validates the whole outline: one question per subtopic, all in a single request, with criteria ordered lowest-first: "padding: drop", "marginal: keep only if the dig comes back strong", "load-bearing: core subtopic". Score 0 subtopics are dropped; score 1 subtopics stay only if their dig comes back strong. The full answers (score, probabilities, legend, usage) are recorded in outline.json.

The worked example shows the gate doing real work: the jev outline validation drops 2 padding docs (score < 0.4) out of 9, leaving 7 docs (source doc). The red-flags section draws the systemic line: an outline that collapses below 4 load-bearing docs means the request is probably a single research question, not a corpus, and should route to parallel-deep-research instead.

## Why the cheap gate earns its keep

The source doc's guidelines state: never skip Phase 1's jev outline validation; it is the cheapest place to kill a bloated corpus. The economics follow from the rest of the pipeline: every subtopic that survives the outline drives 2 dig queries, up to roughly 12 weighted results, and one authored doc, so one dropped padding subtopic at Phase 1 removes an entire downstream cost chain.

The judge-model framing matters here: outline validation is a rubric-scored LLM-as-judge call, and the evaluation literature treats rubric-based scoring as a first-class evaluation method (https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge, weight 0.76; https://pydantic.dev/articles/llm-as-a-judge, weight 0.66). The literature also documents the risk side: a paper on rubric artifacts in LLM-based evaluation warns that rubric phrasing itself can bias judge outputs (https://arxiv.org/html/2609.02942v1, weight 0.45, weak backing), which is why the mint pins the criteria strings verbatim in the research DB rather than paraphrasing them per run.

On the decomposition side, knowledge-base planning guidance consistently recommends structuring content around distinct scoped topics before writing (https://docs.document360.com/docs/planning-and-structuring-your-knowledge-base, weight 0.74). A dictionary definition of "topic" is the only other high-weight hit (https://www.merriam-webster.com/dictionary/topic, weight 0.85, definitional only). The remaining outline-planning hits are weakly backed (https://medium.com/@adnanmasood/rubric-based-evals-llm-as-a-judge-methodologies-and-empirical-validation-in-do, weight 0.25; https://capacity.com/learn/knowledge-base/how-to-organize-a-knowledge-base/, weight 0.26; https://handwiki.org/wiki/Knowledge_representation_and_reasoning, weight 0.24; https://prodinit.com/blog/llm-evaluation-rubric, weight 0.21; https://createaknowledgebase.com/blog/knowledge-base-structure-best-practices, weight 0.19; https://www.getoutline.com/, weight 0.13, off-topic product page, all weak backing).

## Sources considered

| url | weight |
| --- | --- |
| https://www.merriam-webster.com/dictionary/topic | 0.85 |
| https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge | 0.76 |
| https://docs.document360.com/docs/planning-and-structuring-your-knowledge-base | 0.74 |
| https://pydantic.dev/articles/llm-as-a-judge | 0.66 |
| https://arxiv.org/html/2609.02942v1 | 0.45 (weak) |
| https://capacity.com/learn/knowledge-base/how-to-organize-a-knowledge-base/ | 0.26 (weak) |
| https://medium.com/@adnanmasood/rubric-based-evals-llm-as-a-judge-methodologies-and-empirical-validation-in-do | 0.25 (weak) |
| https://handwiki.org/wiki/Knowledge_representation_and_reasoning | 0.24 (weak) |
| https://prodinit.com/blog/llm-evaluation-rubric | 0.21 (weak) |
| https://createaknowledgebase.com/blog/knowledge-base-structure-best-practices | 0.19 (weak) |
| https://www.getoutline.com/ | 0.13 (weak, off-topic) |
