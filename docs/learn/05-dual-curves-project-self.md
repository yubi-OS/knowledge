# 05 - The 2 curves: z_project(t) and z_self(t)

Scope: the twin outputs of the small MLP and the 2 different evaluations they feed.

## What the source doc says

The small MLP emits 2 projections: node D, "Project curve z_project(t)", which goes to "Task evaluation", and node E, "Self curve z_self(t)", which goes to "Self-state / model-state evaluation" (source doc). The 2 evaluations then converge on a single "Optimization signal" node (source doc). Both curves are functions of the same 1D input t; what differs is the evaluator, the task on one side, the model state on the other (source doc).

## External anchors for the task side

The task evaluation side is the classical instrument: learning curves are a concept adopted into machine learning to assess the performance of a learning algorithm with respect to a resource ([Springer Machine Learning](https://link.springer.com/article/10.1007/s10994-024-06619-7), weight 0.19, weak). The source doc's z_project(t) internalizes that instrument: the curve is produced by the model's own projection rather than measured from external benchmarks (source doc, structural reading). Task evaluation in the LLM era is increasingly infrastructure in its own right: unified evaluation infrastructure for agent capabilities is an active research target ([arXiv 2607.13705, AgentCompass](https://arxiv.org/pdf/2607.13705v1), weight 0.16, weak).

## External anchors for the self side

The self evaluation side matches a newer line of work. Appraisal based self assessment dimensions, elicited alongside confidence, are evaluated for their utility in predicting model failure across 12 LLMs and 38 tasks ([arXiv 2605.07806](https://arxiv.org/pdf/2605.07806v1), weight 0.18, weak). Self evaluation tree search uses a model's own evaluations to drive reasoning search ([ResearchGate, SELT](https://www.researchgate.net/publication/392530122_SELT_Self-Evaluation_Tree_Search_for_LLMs_with_Task_Decomposition), weight 0.11, weak). The source doc's z_self(t), labeled "Self-state / model-state evaluation", is a structural cousin of these: a curve over t that the system reads as its own state (source doc, structural reading).

## Dual loop frameworks

The pairing of a task loop with a self loop is an established design pattern:

- DuSA is a dual loop self learning framework integrating rule based constraints, reinforcement learning, and self learning ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0950705126007288), weight 0.20, weak).
- Dual loop meta-learning addresses limited sample modulation recognition ([IEEE](https://ieeexplore.ieee.org/document/10977994), weight 0.18, weak).
- AERO achieves autonomous self evolution without external verifiers or labels using a dual loop framework ([arXiv 2602.03084](https://arxiv.org/html/2602.03084v2), weight 0.19, weak).

The source doc's diagram is this pattern in miniature: 2 curves, 2 evaluators, 1 shared optimizer (source doc, structural reading).

## Why 2 curves instead of 1

The source doc never argues for the split; it just draws it (source doc). The external literature supplies the motivation under weak backing: self assessments carry information that task performance alone does not, including failure prediction ([arXiv 2605.07806](https://arxiv.org/pdf/2605.07806v1), weight 0.18, weak), and dual loop designs exist precisely because task signals and self signals have different dynamics ([ScienceDirect, DuSA](https://www.sciencedirect.com/science/article/pii/S0950705126007288), weight 0.20, weak). Reading the doc's diagram against that literature, z_project(t) is the signal about the world and z_self(t) is the signal about the learner (source doc, structural reading).

## What this doc contributes

A reader should take away 3 things. First, the doc's learner is a 2 headed architecture: 1 input, 2 curve outputs, 2 evaluation tracks (source doc). Second, each track has a recognizable external lineage, learning curves on the task side and self evaluation on the self side, both weakly anchored here (weights 0.11 to 0.20). Third, the 2 tracks are not independent: they rejoin at the optimization signal, which is the subject of doc 06.

## Gaps

- The source doc does not define the semantics of z_self(t) beyond "Self-state / model-state evaluation"; what state, measured how, is unstated.
- Whether task and self evaluation are scored on a shared scale is unstated.
- The source doc does not say whether the projection heads are distinct parameters or 2 slices of one output layer.
