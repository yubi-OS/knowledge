# 03 - When NOT to isolate

Scope: the 2 cases the context-isolation skill says must stay in the main thread (a single continuous task with real dependencies between steps, and anything the main thread needs to react to immediately), plus the research evidence that over-fragmentation into multiple agents costs more than it saves.

## The source doc's 2 exclusions

The source doc (yubi-OS/yubiOS skills/context-isolation/SKILL.md) gives a short and pointed when-NOT-to-isolate list:

1. A single continuous task with real dependencies between steps. Splitting a task where step 3 needs the reasoning from step 1 just re-derives that reasoning at extra cost. Isolation only pays off when the boundary is real.
2. Anything the main thread needs to react to immediately. If you will need to make a judgment call based on subtlety in the result, do not hide that subtlety behind a subagent's compressed summary.

The exclusions are the contrapositive of the triggers in doc 02: if the boundary is not real, the boundary is pure overhead.

## Evidence that over-fragmentation loses

The strongest single source is the multi-agent failure study (https://arxiv.org/abs/2503.13657, weight 0.57), "Why Do Multi-Agent LLM Systems Fail?". Its taxonomy attributes a large share of multi-agent failures not to model capability but to inter-agent issues: specification and design problems in how agents are supposed to coordinate, and inter-agent misalignment where agents fail to adhere to their roles or hand off incorrectly. That is exactly the cost class the source doc's first exclusion names: a task with real dependencies pays coordination costs on every boundary it crosses, and the boundaries add failure surface rather than capability.

Anthropic's own guidance on when to use multi-agent systems (https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them, weight 0.56) states the same discipline from the builder side: specialization works best when domains are clearly separable and routing decisions are unambiguous, and maintaining multiple specialized agents increases prompt maintenance overhead. The source doc's rule that isolation only pays off when the boundary is real is the same criterion expressed for a single session rather than a fleet.

The coordination-cost framing has a long pedigree outside LLMs. The Stanford Encyclopedia of Philosophy entry on bounded rationality (https://plato.stanford.edu/entries/bounded-rationality, weight 0.86) surveys the thesis that decision-makers, human or otherwise, operate under cognitive and computational limits, and that rational designs must economize on those limits rather than assume them away. The source doc's exclusion is an economize-on-limits rule: a continuous dependent task already fits inside one working memory (one context window); fragmenting it buys nothing and spends re-derivation tokens on every split.

The multi-agent survey literature (https://arxiv.org/pdf/2402.01680, weight 0.65) documents the space of LLM multi-agent designs and their progress, which is useful context but also the source of the cautionary comparisons: the survey treats single-agent versus multi-agent as an open design axis rather than a default. Two weaker sources push the same direction. An ICLR blogpost evaluation of 5 multi-agent debate frameworks across 9 benchmarks (https://iclr-blogposts.github.io/2025/blog/mad/, weight 0.19, weak) reports that current multi-agent debate methods fail to consistently outperform simpler single-agent strategies even with increased computational resources. A 2026 arXiv paper (https://arxiv.org/html/2604.02460v1, weight 0.34, weak) reports single-agent LLMs outperforming multi-agent systems on its studied tasks. Neither is strong enough to carry a claim alone, but together with the failure taxonomy (https://arxiv.org/abs/2503.13657, weight 0.57) the direction is consistent: extra boundaries are a cost that must be justified.

## The immediacy exclusion

The source doc's second exclusion is about information loss at the boundary. A subagent returns a compressed summary; if the main thread must judge subtlety (tone in a user message, an edge case in a diff, a near-miss in a search result), the compression is exactly what destroys the judgment input. The handoff literature makes the loss measurable even when the handoff is well-intentioned: a peer-reviewed study of LLM-generated emergency-department handoff notes (https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2827327, weight 0.77) found LLM-drafted handoffs carried higher detail but scored slightly lower on usefulness and patient safety than physician-written ones, and a follow-up writeup (https://psnet.ahrq.gov/issue/developing-and-evaluating-large-language-model-generated-emergency-medicine-handoff-notes, weight 0.66) summarizes the same trade. More detail in the artifact does not mean the receiving decision-maker is better served. For the immediacy exclusion, the correct move is to keep the raw subtlety in the main thread, not to trust a summary to preserve it.

## Practical decision rule

Ask the 2 questions in order. First: does step 3 need step 1's reasoning, not just its conclusions? If yes, keep it in one context. Second: will the main thread need to judge fine-grained detail of the output immediately? If yes, keep it in the main thread. Everything else routes to the triggers in doc 02. This rule is the source doc's own text (yubi-OS/yubiOS skills/context-isolation/SKILL.md) backed by the coordination-cost evidence above.
