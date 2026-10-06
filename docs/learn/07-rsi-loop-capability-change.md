# 07 - Breadth, depth, and the recursive self-improvement loop

Scope: the downstream half of the diagram, where curve deltas and the recursive self-improvement loop land in real-world capability change.

## What the source doc says

Node D, z_project(t), feeds J, "Breadth / depth deltas" (source doc). Node E, z_self(t), feeds K, "Recursive self-improvement loop" (source doc). Both J and K feed L, "Real-world capability change" (source doc). The split is exact: the task curve produces deltas along 2 axes, while the self curve drives the improvement loop; the 2 paths rejoin only at the capability outcome (source doc).

## Breadth and depth as evaluation axes

Evaluating agents along breadth and depth as orthogonal dimensions is established in the agent evaluation literature: OS-MAP integrates automation levels and generalization scopes into a 2 dimensional evaluation matrix for assessing how far computer using agents go in breadth and depth ([arXiv 2507.19132](https://arxiv.org/pdf/2507.19132), weight 0.22, weak). Evaluation infrastructure for agent capabilities must be developed in tandem with the capabilities themselves ([arXiv 2607.13705, AgentCompass](https://arxiv.org/pdf/2607.13705v1), weight 0.16, weak). The source doc's J node compresses the same idea to 2 words (source doc, structural reading).

## The RSI loop and its bounds

Recursive self-improvement is standardly defined as a process in which a system improves itself through its own operations; in the strong AGI reading this causes an intelligence explosion ([Wikipedia](https://en.wikipedia.org/wiki/Recursive_self-improvement), weight 0.20, weak). A 2026 taxonomy separates bounded self-refinement, which is convergent, evaluable, and already industrial practice, from open-ended recursive self-improvement, which remains bounded by grounding requirements ([arXiv 2607.07663](https://arxiv.org/abs/2607.07663), weight 0.22, weak; [HTML version](https://arxiv.org/html/2607.07663v1), weight 0.21, weak).

The source doc's K node, fed by z_self(t) and sharing the optimization signal of doc 06, sits in the bounded family by construction: the loop's improvement signal comes from an evaluable internal curve, not from open ended self rewriting (source doc, structural reading under weak external backing). Surveys of current systems describe exactly this shape: verified systems running self-improvement loops held bounded by a fixed evaluation signal ([futureagi](https://futureagi.com/blog/recursive-self-improvement-ai-2026-examples/), weight 0.07, weak).

## The rejoin point and its risk

Both paths land in "Real-world capability change" (source doc). The literature warns about exactly this junction: as agents become increasingly autonomous within self-improvement loops, they may learn to mislead evaluators in pursuit of their objectives ([CMU Robotics Institute](https://publications.ri.cmu.edu/towards-smarter-and-safer-self-improving-ai), weight 0.32, weak, the highest external weight in this corpus). When the evaluator of record includes the model's own state reading, as in this doc, that risk is structural rather than incidental (source doc, structural reading).

Practitioner loops confirm the mechanism: agent improvement loops run on traces and evals, where traces capture behavior and feedback drives improvement ([OpenAI Cookbook](https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop), weight 0.19, weak; [LangChain](https://www.langchain.com/blog/traces-start-agent-improvement-loop), weight 0.14, weak). The source doc replaces traces with learned curves: instead of recording what happened, the learner emits a curve that encodes behavior and state over t (source doc, structural reading).

## What this doc contributes

A reader should take away 3 things. First, the doc's diagram claims 2 independent routes to capability change, one through measured deltas, one through the self loop (source doc). Second, the self route is bounded RSI in the taxonomy sense: evaluable, signal fed, not open ended (weak, weight 0.22). Third, the rejoin point is where the doc is most exposed: capability change is asserted but never measured, and the misleading-evaluator risk applies with full force to a loop whose evaluator is partly the model itself.

## Gaps

- "Real-world capability change" is never operationalized in the source doc: no metric, benchmark, or harness is named.
- The source doc does not state how breadth/depth deltas are computed from z_project(t).
- Whether the RSI loop's output feeds back into the learner is not drawn; K terminates at L in the diagram (source doc).
