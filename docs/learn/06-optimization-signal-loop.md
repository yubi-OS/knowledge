# 06 - The optimization signal and the closed parameter loop

Scope: how the 2 evaluations fuse into 1 update, and where that update lands.

## What the source doc says

Nodes F, "Task evaluation", and G, "Self-state / model-state evaluation", both feed H, "Optimization signal", which drives I, "Parameter update" (source doc). The update feeds back into both B, "Learner: Fourier features", and C, "Small MLP" (source doc). The loop is therefore closed over the entire learner: representation and network are re-shaped every cycle by a signal that contains both task and self terms (source doc, structural reading).

## External anchors for the fusion step

Fusing multiple objectives into a single update signal is an established problem area. A survey covers multi objective based parameter optimization for deep learning ([arXiv 2305.10014](https://arxiv.org/pdf/2305.10014), weight 0.09, weak; [ResearchGate mirror](https://www.researchgate.net/publication/374376546_A_Survey_on_Multi-Objective_Based_Parameter_Optimization_for_Deep_Learning), weight 0.10, weak), and a 2026 review maps the deep learning for multi objective optimization landscape ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2210650226000246), weight 0.13, weak). Multi objective hyperparameter optimization remains an active blind spot in the algorithmic landscape ([arXiv 2511.08371, PriMO](https://arxiv.org/html/2511.08371v1), weight 0.11, weak). These works treat the combination step as a design decision in its own right; the source doc leaves the fusion rule unnamed (source doc).

## External anchors for the loop shape

The loop shape matches the self learning loop pattern: a recurrent, autonomous process in which a model or system iteratively generates, evaluates, and exploits new knowledge by leveraging its own outputs as training signal ([emergentmind](https://www.emergentmind.com/topics/self-learning-loop), weight 0.17, weak). The source doc is a strict instance of that pattern: the "own outputs" are the 2 curves, the "training signal" is their fused evaluation (source doc, structural reading). In the learning analytics literature, closed loop designs are analyzed step by step, with data collection and interpretation each introducing biases that compound around the loop ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0747563224001730), weight 0.18, weak).

## Known hazards of the closed loop

The literature flags 2 hazards that apply directly to this design. First, gradient propagation over long closed loop horizons can become difficult due to vanishing or exploding gradients ([arXiv 2610.01822](https://arxiv.org/html/2610.01822), weight 0.10, weak). Second, closed loop systems that consume their own outputs risk feedback amplification, which is why the analytics literature treats each loop step as an audit point ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0747563224001730), weight 0.18, weak). Because the source doc's loop contains a self evaluation term, both hazards are live: the model is partially trained on its own state reading (source doc, structural reading under weak external backing).

## What this doc contributes

A reader should take away 3 things. First, the doc's optimization signal is a fusion point: 2 evaluation tracks enter, 1 update exits (source doc). Second, the update is total: it reaches both the Fourier feature stage and the MLP, so nothing in the learner is frozen (source doc). Third, the closed loop is the doc's riskiest structure as well as its central one, and the external literature, all weakly weighted (0.09 to 0.18), names the failure modes without solving them for this design.

## Gaps

- The fusion rule for the optimization signal is unnamed in the source doc: no weighting, no schedule, no loss form.
- Update rule, learning rate, and optimizer are unspecified.
- Whether the self evaluation term is trusted or discounted inside the fused signal is unstated.
