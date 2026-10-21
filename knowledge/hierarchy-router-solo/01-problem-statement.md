# 01. Problem Statement

**Scope:** Problem Statement: detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-router-solo-2026-10-06.md.

## The question the source asks

The ground source (yubi-OS/yubiOS refs/hierarchy-router-solo-2026-10-06.md, dated 2026-10-06, produced by ideate-solo with no dialogue, scope class medium, 6 variations generated) frames a single "how might we" problem: how to turn the proven hierarchy/fill detector into a multi-model orchestration regime where measurement decides where work goes, while staying inside the jev-orchestrator policy engine. The detector in question is edge-standard-v1 fractal dimension D, and the source is explicit about its validated claim set: D reads hierarchy and area-filling, and does NOT read order at matched extent.

That last clause is the whole reason the problem is hard. A routing regime that pretended D was an order parameter would route on a signal the program already refuted. The problem statement therefore constrains the solution space before any design starts: whatever routes must route on what the instrument actually measures, and nothing more.

## Three tensions inside the problem

**1. Measurement versus authority.** The program's earned doctrine is that measurements are data, never authorization. A router is, by definition, a component that sends work somewhere. The problem asks for a router that does not award itself the right to dispatch. Industry framing of multi-model routing tends to treat the router as the decision maker: the Openbase guide describes routing and orchestration as the layer that "improves accuracy, cuts costs, and scales" [Multi Model AI: Routing and Orchestration Guide - Openbase](https://openbase.ai/blog/multi-model-ai) (weak backing, clef weight < 0.5; clef weight: 0.2402), and the GitHub HydraFusion preview, announced 4 September 2026, puts runtime multi-model orchestration directly inside Copilot [GitHub Launches HydraFusion: Multi-Model Orchestration, Dynamic Routing ...](https://www.datastudios.org/post/github-launches-hydrafusion-multi-model-orchestration-dynamic-routing-lower-cost-coding-and-the) (weak backing, clef weight < 0.5; clef weight: 0.1971). Neither framing separates the proposer from the disposer. The source does.

**2. Determinism versus calibration.** The detector is deterministic (same artifact, same D), but routing requires turning a continuous number into a discrete band. Tropos describes a "calibration-robust router" that corrects each model's self-reported confidence by an observed factor [Tropos: calibration-robust routing for multi-model AI](https://joperjoker.github.io/biomimetic-ai-orchestration/) (weak backing, clef weight < 0.5; clef weight: 0.2537); that is the probabilistic answer to the same question. The yubiOS answer is different: the band edges are pinned in policy and calibrated once against a falsification corpus, so the only residual instability is hysteresis at band edges, not drift in model confidence.

**3. Auditability versus convenience.** A deterministic gate is auditable precisely because it is repeatable. SovereignClaw states the trade plainly: "A deterministic gate will faithfully and repeatably enforce a badly written policy. Determinism makes a policy auditable" [Deterministic Guardrails for AI Agents | SovereignClaw](https://sovereignclaw.com/research/deterministic-guardrails) (weak backing, clef weight < 0.5; clef weight: 0.2308). The agenticrail piece draws the same line between agents that enforce a fixed, reproducible sequence and those that do not [Deterministic vs Probabilistic AI Agents: Why the Distinction Matters ...](https://agenticrail.nz/blog/deterministic-vs-probabilistic-ai-agents/) (weak backing, clef weight < 0.5; clef weight: 0.2222). The problem statement inherits this: if routing is measurement-gated, then a bad band definition will be enforced faithfully, which is why the band edges must pass calibration before live traffic.

## What makes this problem specific to yubiOS

Generic routing literature solves "which model should answer this prompt." Multi-turn intent routing, for example, selects conversation flows from accumulated context [Multi-turn intent routing for dynamic conversation flow switching...](https://vertextlabs.com/multi-turn-intent-routing-dynamic-flow-switching/) (weak backing, clef weight < 0.5; clef weight: 0.1961), and the getmulti product carries prompts between tools [Multi: one task, the right AI workflow](https://getmulti.ai/) (weak backing, clef weight < 0.5; clef weight: 0.0965). These are intent classifiers. The yubiOS problem is different in kind: the routing signal is a physical-style measurement of an artifact (a box-counting dimension of a standardized edge map, or a scorer reading of a text document), and the routing target is a lane in an existing orchestration stack: the 3-tier Llama runtime (classify 8b, draft 70b, llama-guard), an automation, or a corpus lane.

The probabilistic-versus-deterministic debate [Are LLMs Probabilistic or Deterministic? - AI for the Stack](https://aiforthestack.com/blog/are-llms-probabilistic-or-deterministic/) (weak backing, clef weight < 0.5; clef weight: 0.1155) [The Architect's Dilemma: Bridging the Gap Between Deterministic Code ...](https://medium.com/@ap3617180/the-architects-dilemma-bridging-the-gap-between-deterministic-code-and-probabilistic-llms-2bfe1de1f065) (weak backing, clef weight < 0.5; clef weight: 0.0750) is useful context but does not decide the design. The source sidesteps it: the instrument is deterministic, the gate is deterministic, and only the downstream lanes are probabilistic. The dictionary sense of "deterministic" [DETERMINISTIC Definition & Meaning | Dictionary.com](https://www.dictionary.com/browse/deterministic) (weak backing, clef weight < 0.5; clef weight: 0.0822) (events following from prior causes) is, strictly, what the source wants from the routing step.

## Restating the problem precisely

Read with its constraints, the problem becomes: design a loop in which (a) an artifact is measured by the instrument appropriate to its class, (b) the measurement is mapped to a band declared in policy, (c) the band names a proposed route, (d) the proposal is submitted as a jev task action and passes the same fail-closed gate as every other action, and (e) every step lands as a run row. Success is not "routes well"; success is "routes only on validated claims, and never bypasses the gate."

## Evidence quality note

All 10 dig results for this subtopic scored below 0.5 on the clef noul quality question (highest 0.2537, Tropos). They are cited here as context for how the wider field frames routing, not as authority for any yubiOS claim. Every load-bearing claim above comes from the ground source.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Multi Model AI: Routing and Orchestration Guide - Openbase | https://openbase.ai/blog/multi-model-ai | 0.2402 | weak (< 0.5) |
| 2 | Multi-turn intent routing for dynamic conversation flow switching... | https://vertextlabs.com/multi-turn-intent-routing-dynamic-flow-switching/ | 0.1961 | weak (< 0.5) |
| 3 | GitHub Launches HydraFusion: Multi-Model Orchestration, Dynamic Routing ... | https://www.datastudios.org/post/github-launches-hydrafusion-multi-model-orchestration-dynamic-routing-lower-cost-coding-and-the | 0.1971 | weak (< 0.5) |
| 4 | Tropos: calibration-robust routing for multi-model AI | https://joperjoker.github.io/biomimetic-ai-orchestration/ | 0.2537 | weak (< 0.5) |
| 5 | Multi: one task, the right AI workflow | https://getmulti.ai/ | 0.0965 | weak (< 0.5) |
| 6 | Deterministic vs Probabilistic AI Agents: Why the Distinction Matters ... | https://agenticrail.nz/blog/deterministic-vs-probabilistic-ai-agents/ | 0.2222 | weak (< 0.5) |
| 7 | Are LLMs Probabilistic or Deterministic? - AI for the Stack | https://aiforthestack.com/blog/are-llms-probabilistic-or-deterministic/ | 0.1155 | weak (< 0.5) |
| 8 | The Architect's Dilemma: Bridging the Gap Between Deterministic Code ... | https://medium.com/@ap3617180/the-architects-dilemma-bridging-the-gap-between-deterministic-code-and-probabilistic-llms-2bfe1de1f065 | 0.0750 | weak (< 0.5) |
| 9 | DETERMINISTIC Definition & Meaning / Dictionary.com | https://www.dictionary.com/browse/deterministic | 0.0822 | weak (< 0.5) |
| 10 | Deterministic Guardrails for AI Agents / SovereignClaw | https://sovereignclaw.com/research/deterministic-guardrails | 0.2308 | weak (< 0.5) |
