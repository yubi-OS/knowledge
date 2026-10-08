# 03. Parallel Stream Design

Scope: step 2 of the workflow, designing the 3 to 5 parallel streams and the three canonical angles the source doc names.

## The count and the sweet spot

The source doc fixes the shape: design parallel streams, "3-5 is the sweet spot" (source doc, workflow step 2). The dispatch is not unbounded: fewer than 3 streams loses the independence that makes cross-checking possible, and more than 5 multiplies token spend and synthesis load without adding a new angle. The trigger description allows 3-N (source doc, frontmatter), but the workflow's own guidance caps practical runs at 5.

## The three canonical angles

Each named stream answers a different question about the topic (source doc, workflow step 2):

1. Stream 1, subject deep-dive: what it is, architecture, recent activity, adoption signals. This is the descriptive layer: the thing on its own terms.
2. Stream 2, prior art and alternatives: run the prior-art-search skill workflow, which the source doc specifies as 4 angles: competitors, failed attempts, academic, adjacent. This is the historical and comparative layer: who tried this before, what worked, what died.
3. Stream 3, relevance to yubiOS / comparative analysis: use the domain skill plus repo inspection. This is the applied layer: what the findings mean for this repository, grounded in actual code rather than web claims.

The three angles are deliberately non-overlapping information sources: the web, the historical record, and the local repo. That is what lets the synthesis step arbitrate conflicts by checking ground truth (doc 05): a claim that only the web stream asserts is weaker than a claim the repo inspection confirms.

## Prior art as a named sub-workflow

Stream 2 is the only stream the source doc binds to another skill by name (source doc: "using prior-art-search skill workflow"). External sources back the framing. The USPTO's prior art search initiative documents sharing search strategies and improving tools and resources to identify prior art (https://www.uspto.gov/patents/initiatives/prior-art-search, weight 0.85). A CASRAI guide walks through what a prior art search includes, which databases to use, and how to structure the search itself (https://casrai.org/guides/prior-art-search, weight 0.55). Both treat prior art as a structured discipline with defined angles, which matches the source doc's 4-angle decomposition (competitors, failed attempts, academic, adjacent).

Patents.google.com appears as a canonical prior-art database (https://patents.google.com/?scholar, weight 0.68), though the dig snippet was degraded; treat it as a pointer, not a claim.

## Fan-out as the general pattern

The fan-out mechanics behind step 2 are weakly backed in the dig but consistent across sources. AgentPatterns documents fan-out as dispatching N sub-agents in parallel, each with its own isolated context window, returning distilled summaries to the main thread for synthesis (https://www.agentpatterns.ai/patterns/multi-agent/sub-agents-fan-out/, weight 0.22, weak). A practitioner writeup reports a 3-subagent fan-out doing cross-codebase research in 90 seconds versus 7 to 10 minutes linearly (https://claudeguide.io/claude-code-subagents-parallel-research, weight 0.13, weak). A Substack essay on subagent orchestration argues that parallel fan-out needs structured outputs because ad-hoc prose collapses at scale (https://arihantdeva.substack.com/p/subagent-orchestration-fanout-pipeline, weight 0.23, weak). These carry low weights, so treat them as corroboration of the source doc's design, not independent authority.

## Why angles, not topics

A subtle point in the source doc's design (source doc, step 2): streams partition by angle, not by subtopic. Three agents each covering a different subtopic of the same question would produce three partial views of one layer. The canonical angles instead stack layers over the same question: what it is, what came before, what it means here. Conflicts then carry information: if the deep-dive says a feature is mature while the prior-art stream finds the dominant implementation failed in production, the synthesis has a real question to resolve against ground truth.

Sources: source doc (yubi-OS/yubiOS skills/parallel-deep-research/SKILL.md, workflow step 2); https://www.uspto.gov/patents/initiatives/prior-art-search (0.85); https://patents.google.com/?scholar (0.68); https://casrai.org/guides/prior-art-search (0.55); https://www.agentpatterns.ai/patterns/multi-agent/sub-agents-fan-out/ (0.22, weak); https://arihantdeva.substack.com/p/subagent-orchestration-fanout-pipeline (0.23, weak); https://claudeguide.io/claude-code-subagents-parallel-research (0.13, weak).
