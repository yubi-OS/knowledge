# The unit protocol: one atomic change per round

Scope: why a unit round commits exactly one change through the whole runflow, how cycle count 1 replaced multi-cycle rounds, and what the evidence base for that discipline looks like.

## The rule

A unit round carries exactly one atomic change through the full runflow: pin, frozen baseline check, pre-registered change, gated re-score, and a round record. Cycle count is 1. The whole runflow is the atomic change; there is no second edit in the same round (source doc, refs9). The unit protocol ran clean end-to-end on refs9 with a measured delta of +1.0092 (source doc, internal lineage record, not web-weighted).

The motivation is negative. Multi-cycle rounds generated bookkeeping warts and padding pressure: when several edits ride one round, the record can no longer say which edit moved the metric, and the temptation to pad weak findings grows (source doc, design decision 1). One change per round with a fully-run flow yields one honest measurement and a clean record.

## Why single-change designs measure better

The pattern mirrors single-case experimental design practice, where the effect of one intervention is measured against a stable baseline with a small number of units. Design standards for single-case intervention research exist precisely because many small repeated measurements are easy to contaminate; the standards serve "the dual role" of guiding design and judging evidence quality (https://www.sciencedirect.com/science/article/pii/S0022440522000966, w0.790). Randomized single-case procedures are valued for their advantages over small-sample nonparametric alternatives, including transparent repeated measurement of one intervention (https://link.springer.com/content/pdf/10.1007/s43441-021-00274-z.pdf, w0.924). Single-case designs are explicitly defined as methods to test the efficacy of an intervention using a small number of patients or units (https://www.sciencedirect.com/science/article/pii/S1877065717304542, w0.870).

The word "atomic" also has a precise causal meaning that transfers: an atomic intervention is an intervention on a single variable, and estimating its effect from observations is a well-studied problem in causal inference (https://arxiv.org/abs/2002.04232, w0.821). Bundling two interventions into one round is exactly what causal methodology forbids: the effect of neither is identified.

## Why cycle count 1 for a self-improving loop

The broader RSI literature separates bounded self-refinement, which is convergent, evaluable, and already industrial practice, from open-ended recursive self-improvement, which remains bounded by evaluation (https://arxiv.org/html/2607.07663, w0.564). The unit protocol is a bounded-self-refinement design: it caps recursion depth per round at 1 and makes each cycle evaluable by keeping the change set at size 1. A survey of 1250 papers from 2024 to 2026 organizes systems along what they improve (behavior, policy, evaluator, or the recursive process itself); the unit protocol improves the corpus, one step at a time, with the evaluator (the gates) held fixed within the round (https://arxiv.org/abs/2607.07663, w0.422, weak backing).

## The cost and the trade

Cycle count 1 is slower in round count: work that a multi-cycle round could have done in one sweep now takes several rounds. The protocol accepts that price deliberately. Bookkeeping warts and padding pressure are not annoyances, they are measurement corruption; a record that cannot attribute a delta to a change is not evidence. The trade is one honest measurement per round instead of several confounded ones.

## What rides in the atomic unit

The atomic unit is the whole runflow, not just the edit. Pin, frozen baseline re-check, change, re-score, gates, and the round record all move together (source doc, refs9). If any gate fails, the round ends with a revert or a no-keep, and the next round starts from a re-derived baseline. This is the discipline the rest of this corpus unpacks: the frozen baseline (doc 02), the gate statistic (doc 03), pre-registration (doc 04), and the keep gate (doc 07).
