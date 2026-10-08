# 05. Synthesis and Conflict Resolution

Scope: step 4 of the workflow, consolidating returned streams into one report and arbitrating conflicts by ground truth.

## The rule: ground truth over streams

The source doc's synthesis rule is short and absolute (source doc, workflow step 4): "Resolve conflicts by inspecting ground truth (don't trust any single stream blindly)." When two streams disagree, the orchestrator does not average them, vote on them, or pick the more confident voice. It checks the underlying fact: the repo, the source, the spec. This is the same epistemic stance as the borrow-intent verification in step 6 (doc 07), applied mid-pipeline instead of at the end.

The research literature backs the mechanism, if not the exact phrasing. A Springer review of LLM-based multi-agent systems catalogs frameworks, evaluation methods, and open challenges for language-driven multi-agent collaboration (https://link.springer.com/chapter/10.1007/978-3-032-15632-7_9, weight 0.69). An arXiv paper on aggregation shows theoretically that first-order and second-order information structures improve over zero-order majority voting for one-round multi-agent reasoning (https://arxiv.org/pdf/2510.01499v2, weight 0.59): naive voting is not the aggregation optimum, which supports the source doc's choice to route conflicts through ground-truth inspection rather than stream-count voting. Practitioner guides make the same point qualitatively: good synthesis of conflicting results explains the conflict with a higher-level perspective rather than ignoring it or taking sides (https://researchcollab.ai/synthesize-conflicting-results/, weight 0.16, weak), and thematic synthesis combines findings through triangulation, structured aggregation, and gap analysis (https://www.koji.so/docs/research-synthesis-guide, weight 0.20, weak). One misinformation-focused study warns the reverse case: multi-agent communication can amplify local errors into collective risks (https://arxiv.org/abs/2608.03421, weight 0.42, weak), a reason not to let any single stream's framing propagate unchallenged.

## The report shape

The consolidated report has a fixed skeleton (source doc, step 4): TL;DR, then one section per stream, then "what this means", then sources. The TL;DR carries the synthesis verdict. Stream sections preserve each angle's findings and citations so a reader can trace any claim back to the stream that produced it. "What this means" is the interpretive layer, where relevance to yubiOS is stated explicitly. Sources closes the loop.

## Session first, canonical second

The synthesized report is saved to `session/<topic-slug>-YYYY-MM-DD.md` before anything is pushed (source doc, step 4). This ordering is a safety property: the session file is the working copy that can be edited, trimmed, and re-derived; the refs/ push in step 5 should only ever publish a finished artifact. The two-step landing also gives the borrow-intent check (step 6) a place to happen before the canonical record exists.

## Length discipline at synthesis

The synthesis carries its own budget: 2000 to 3000 words consolidated, longer allowed when multi-stream (source doc, Length budgets; see doc 08). The budget exists because synthesis is where parallel runs tend to bloat: N streams of 1500 to 2500 words each arrive at once, and the temptation is to concatenate. The source doc's shape forces compression instead: each stream section summarizes its report, and the TL;DR plus "what this means" carry the judgment.

## What good arbitration looks like

Concretely, the orchestrator's job at synthesis is to produce a claim table: for each contested claim, which streams assert it, with what citations, and what the ground-truth check found. Claims confirmed by repo inspection or a primary source graduate to the report body. Claims that survive only in one stream with weak sourcing get labeled as such or dropped. This mirrors the citation discipline the corpus itself applies: every claim carries its backing, and unbacked claims are deleted rather than softened.

Sources: source doc (yubi-OS/yubiOS skills/parallel-deep-research/SKILL.md, workflow step 4 and Length budgets); https://link.springer.com/chapter/10.1007/978-3-032-15632-7_9 (0.69); https://arxiv.org/pdf/2510.01499v2 (0.59); https://arxiv.org/abs/2608.03421 (0.42, weak); https://www.koji.so/docs/research-synthesis-guide (0.20, weak); https://researchcollab.ai/synthesize-conflicting-results/ (0.16, weak).
