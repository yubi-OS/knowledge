# 06. Bounded Improvement Cycles, One Action at a Time

**Scope:** Bounded recursive self-improvement discipline: one hypothesis per cycle, explicit loop bounds, and why a single atomic action per cycle keeps the improvement loop auditable.

**Source quality note:** no source in this dig crossed the 0.5 authority threshold. Every claim below carries weak backing and is labeled as such.

## The loop shape

A practitioner writeup on self-improving agents describes the canonical loop: "production self-improvement is a loop, not a single feature: observe behavior, discover failures, evaluate them, propose a change, test the candidate against representative cases, and promote it only when the evidence supports the update" (https://arize.com/resources/self-improving-agents/, weak backing, weight 0.29). The final clause is the load-bearing one for auditability: promotion is gated on evidence, not on the agent's confidence. A loop without that gate can change itself in ways nobody can later attribute to a cause.

The same source distinguishes two objects of improvement, the scaffold versus the model, and notes that "many systems change the scaffold around a fixed model instead" (weak backing). For an agent-run improvement process, the scaffold, meaning prompts, skills, checklists, and procedure, is exactly what a single-action cycle edits, and it is the safer target because edits there are observable artifacts rather than opaque weight updates.

## Why one action per cycle

Measurement discipline gives the first reason. "Pick one primary metric per improvement cycle. Good options: median task completion time, percent of tasks finished without human rescue, failed tool-call rate, or messages per completed task. If you track five metrics at once, you usually track none of them well" (https://www.ericrhea.com/agents/self-improvement-loop.html, weak backing, weight 0.20). The attribution argument mirrors the one in doc 01: with one action and one primary metric per cycle, the measured delta belongs to the action. With several actions per cycle, the delta is a mixture and no single hypothesis is ever confirmed or refuted.

Lean manufacturing gives the same answer from a different tradition. One-piece flow is "the practice of moving one workpiece at a time between operations within a production process, rather than batching work" (https://www.learnleansigma.com/guides/one-piece-flow/, weak backing, weight 0.17). The kaizen literature frames it as philosophy: "the kaizen philosophy is not a one-time fix but a long-term approach. By making small, incremental changes, organizations can gradually improve their processes and systems" (https://www.lean.org/lexicon-terms/kaizen/, weak backing, weight 0.17). Project-management guidance adds an honest caveat about the adoption curve: "when you first adopt a continuous improvement strategy your team effectiveness drops at first because you're learning how to follow the continuous improvement process" (https://www.pmi.org/disciplined-agile/gci/kaizen-improvement-through-small-changes, weak backing, weight 0.18). The early regression is expected and is itself diagnostic: it means the loop's overhead is real and should be counted in the cycle's cost.

## Why bounded

Unbounded self-improvement loops fail by burning resources without convergence. Practitioner guidance for agent systems is blunt: "bound generate-validate-repair loops near three to four rounds. The first iterations capture most of the achievable gains and later rounds mostly burn tokens. Treat the iteration count in a generate-validate-repair loop as an explicit budget, not an arbitrary constant" (https://www.agentpatterns.ai/verification/bounded-repair-loop-iterations/, weak backing, weight 0.20). A protocol RFC for agent delegation makes bounding a first-class requirement, specifying "bounded agent delegation, decision gates, transport boundaries, and audit evidence" (https://github.com/joefeser/hacp/blob/main/rfcs/0006-loop-ceiling-and-bounded-iteration.md, weak backing, weight 0.17).

Academic work on recursive self-improvement reaches a compatible conclusion, surveying "bounded self-refinement" as the tractable regime rather than open-ended self-modification (https://arxiv.org/html/2607.07663v1, weak backing, weight 0.15). The bounded loop with a fixpoint rule, stop when a cycle produces no new gaps and closes no old ones, is the practical implementation of that bound.

## The auditable cycle

Assembled, the auditable improvement cycle has these parts, each of which maps onto the Merkle-structured artifact of docs 05 and 08:

1. Observe and name one gap. The cycle's input is one hypothesis, not a list.
2. Take one atomic action addressing it, with defined before and after states.
3. Verify against the primary metric, and revert or accept on evidence.
4. Record the cycle as a bundle: the hypothesis, the action, the measurement, the verdict.
5. Bound the loop: a cycle cap or a fixpoint rule decides when to stop.

The worked example that generated this corpus ran exactly this shape: one insight (the single-action atom and the S^2 closure), one documentation action (record it in refs, a Linear issue, and a changelog), one Merkle root over the session's 6 artifacts as the cycle's commitment. The audit trail exists because the cycle never did more than one thing.

## Limits of the evidence

All of the above comes from practitioner blogs, vendor resources, and one survey paper, none authoritative by the 0.5 weighting threshold. The claims most at risk of being folklore are the 3-to-4-round loop bound and the one-metric rule; both are stated as heuristics by their sources and neither has a cited measurement. They are presented here as engineering defaults to be calibrated per project, in line with the framework's own discipline of measuring each change rather than inheriting one.
