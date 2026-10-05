# Deferring decisions: evidence gates and the last responsible moment

Scope: how engineering practice handles decisions that are deliberately not made yet, what evidence unblocks them, and how a register records a deferral so it does not rot into an unexamined pending state.

## Decide as late as possible, but record the deferral

Lean software development names one of its seven principles Decide as Late as Possible: deferring decisions to the last responsible moment maximizes decision quality by letting the most information accumulate before the commitment (https://resources.valueflowsolutions.co.uk/lean-concepts-for-organisations/just-in-time/deferring-decisions, jev weight 0.15, weak backing; https://www.linkedin.com/pulse/lean-software-development-decide-late-possible-eduardo-ferro-aldama-andrf, jev weight 0.07, weak backing). The principle is widely cited, though the sources surfaced here are low-weight secondary content, so the principle itself should be treated as well-known background rather than a claim these sources establish.

The academic grounding is firmer. Research on deferring design pattern decisions frames the first option as deferring the decisions for as long as possible, increasing the chance that sufficient information will be available when the decision is finally made, while noting that not all design decisions can be deferred: some basic decisions must be made before initial coding can start (https://webdocs.cs.ualberta.ca/~jonathan/PREVIOUS/Papers/Papers/toplas.pdf, jev weight 0.77). The companion ACM article on the same work adds that tool support for automating design changes gives more freedom to revisit and change deferred decisions when needed (https://dl.acm.org/doi/abs/10.1145/1498926.1498927?download=true, jev weight 0.91).

A ScienceDirect overview of the delay-design-decision principle puts the boundary condition plainly: delay design decisions until they are absolutely necessary to keep the architecture manageable, as a key principle to ensure the architect does not design superfluous features into the system (https://www.sciencedirect.com/topics/computer-science/delay-design-decision, jev weight 0.67).

## What a deferral row must carry

A useful deferral is not just the word deferred. The deferral pattern that survives contact with reality has three parts:

1. The deferred item, stated specifically enough that completion is checkable. A deferral of a specific dollar figure differs from a deferral of an entire planning activity.
2. The unblocking evidence, stated as a condition the world can satisfy: a real number from a named authority, a completed pilot cycle, a document actually landing as merged rather than drafted. This mirrors the academic point that deferral only helps when the missing information is identified and expected to arrive (https://webdocs.cs.ualberta.ca/~jonathan/PREVIOUS/Papers/Papers/toplas.pdf, jev weight 0.77).
3. The source document and section, so the deferral can be traced back to the reasoning that produced it.

## The failure mode: deferrals as permanent pending states

The value of an evidence gate is that it names what would change the decision. The corresponding failure mode is a register where deferred items are never revisited because nothing tracks whether the unblocking evidence arrived. The lifecycle machinery for this is covered in the supersession doc in this corpus; the deferral-specific point is that a deferral row without an unblock condition is indistinguishable from a dropped decision, and a deferral row with one is a scheduled future decision.

## Deferral versus rejection

Deferral and rejection are different terminal states and a register should not blur them. A rejected model is closed: the reason is recorded and the row is final until a governing constraint changes. A deferred item is open: the reason it cannot be decided yet is recorded, plus what would let it be decided. The lean principle supports keeping items open until the last responsible moment (https://resources.valueflowsolutions.co.uk/lean-concepts-for-organisations/just-in-time/deferring-decisions, jev weight 0.15, weak backing), but the last responsible moment is a property of the decision, not an excuse for an indefinite queue: the academic sources are explicit that some decisions cannot be deferred past initial implementation (https://webdocs.cs.ualberta.ca/~jonathan/PREVIOUS/Papers/Papers/toplas.pdf, jev weight 0.77).

## Source quality note

The strong sources here are the peer-reviewed TOPLAS/ACM articles on deferring design pattern decisions and the ScienceDirect topic overview. Lean-principle pages and practitioner posts are low-weight and used only for framing the widely known principle, with no factual load.
