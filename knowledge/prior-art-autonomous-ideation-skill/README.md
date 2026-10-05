# prior-art-autonomous-ideation-skill

Prior art for autonomous ideation skills: existing ideation frameworks, agent-driven idea generation without a human in the loop, and structured divergence/convergence methods.

Minted 2026-10-05 from yubi-OS/yubiOS refs/prior-art-autonomous-ideation-skill-2026-07-28.md. Every factual claim in the docs carries its source URL and the jev weight (noul metric, model clef) that backs it. Claims with weight >= 0.5 are primary/official backing; weight < 0.5 is labeled as weak backing in text.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-single-agent-autonomous-loops.md](01-single-agent-autonomous-loops.md) | Single-agent long-running ideation loops (Ralph Ideate, the Ralph loop ecosystem, local-first Ollama agents) |
| 02 | [02-multi-agent-ideation-systems.md](02-multi-agent-ideation-systems.md) | Multi-agent collaborative ideation with persona separation (research platforms, persona studios, solo-operator studios) |
| 03 | [03-product-pipeline-ideation-tools.md](03-product-pipeline-ideation-tools.md) | Idea-to-product pipeline tools and the shipped-artifact endpoint (agents that open pull requests) |
| 04 | [04-structured-divergence-convergence-methods.md](04-structured-divergence-convergence-methods.md) | Structured divergence-then-convergence methods (SCAMPER, Six Thinking Hats, CREATIVEDC two-phase scaffolds) |
| 05 | [05-academic-llm-ideation-benchmarks.md](05-academic-llm-ideation-benchmarks.md) | Academic benchmarks and systems (Deep Ideation, IdeaBench, the 61-study field review) |
| 06 | [06-human-ai-ideation-tradeoffs.md](06-human-ai-ideation-tradeoffs.md) | Novelty versus feasibility, unreliable self-evaluation, transparency and lifecycle governance |
| 07 | [07-computer-creativity-history.md](07-computer-creativity-history.md) | The pre-LLM creativity arc (AARON, Pygmalion, the 2005 NSF creativity support tools agenda) |
| 08 | [08-startup-failure-postmortems.md](08-startup-failure-postmortems.md) | Failure modes of autonomous AI ventures: bundling, unit economics, demoware, fake autonomy |
| 09 | [09-gap-aware-ideation-opportunities.md](09-gap-aware-ideation-opportunities.md) | Open opportunities: gap-aware evaluation, skill-format portability, structured kill verdicts |

## Research summary

- Results collected: 108 (18 searxng queries, 2 per subtopic, top 6 kept per query)
- Weight split: 43 high (>= 0.5) / 65 low (< 0.5) of 108; 0 unweighted
- Jev requests: 24 (1 noul probe, 1 outline score request with 9 questions, 22 noul weighting requests at 5 results per request)
- Jev usage: 19309 input tokens / 0 output tokens
- Dig redos: 0 (all 9 subtopics reached 12 kept results on seed queries)
- Decide retries: 2 initial 429 responses on weighting batches, resolved by the standard 30-second retry
- Skipped docs: none

## Gaps

- Several entities named in the source doc were not returned by the searxng dig and therefore carry no jev weight; per the mint rules they were omitted from the docs rather than cited weightless. The omitted set: OctoBot, BrainPath, Claude-Ideation-Planning-Plugin, RAD-Brainstormer, Synapse, CrewAI-Brainstormer, brainstorming-only, Autensa, Agentfounder, aut-o, KickUp, LaunchMind, FoundrAI, VentureSmith, and the Phind/Yupp/Vibe AI/Olive AI/Humane/Sieve/Coordinal/Super AI shutdown postmortem URLs (doc 08 covers those failure modes via the dig-backed graveyard and TensorZero sources, with the item-specific postmortems marked as unweighted context).
- Where the docs cite facts from the source doc's deep reads of a URL that the dig also returned, the doc carries that URL's dig weight; deep-read-only details (for example the Llull machine, AutoResearcher, SCI-IDEA, Chain of Ideas, Pygmalion thesis) are explicitly marked as unweighted in the doc text.

## Preflight

2026-10-05: searxng 55 results healthy (probe query "autonomous ideation agents"); /api/decide (clef) 200
