# Scorer variance and hysteresis

Scope: why the free-prose scorer was replaced, what the structured-evidence scorer v2 and v2.1 changed, and how hysteresis eliminates threshold jitter on edited-row re-scores.

## The problem: scorer variance swamped the effect

Refs3 produced the measurement finding that justified the whole instrument program: the free-prose scorer's variance was 6 to 8 times the true effect it was supposed to detect. When measurement noise is 6x the signal, no gate on that measurement can distinguish improvement from jitter. The round concluded that the flow demanded a better instrument (source doc, refs3).

LLM-judge research independently documents the same pathology. Reviews of LLM-as-a-judge reliability note that the literature leans on accuracy and bias metrics while the deeper problem is reliability beyond inter-rater agreement (https://arxiv.org/html/2412.12509v2, w0.931). Consistency studies of LLM evaluators distinguish self-consistency from inter-scale consistency and show that consistency is not guaranteed even for strong models (https://aclanthology.org/2025.coling-main.710/, w0.931). Evaluating the consistency of LLM evaluators matters because unreliable evaluation silently corrupts downstream decisions (https://arxiv.org/html/2412.00543v1, w0.141, weak backing). A 6-8x variance free-prose scorer is exactly this failure class: same inputs, unstable verdicts.

## The fix: structured evidence

Refs4 replaced free prose with a structured-evidence scorer, versioned v2 and then v2.1. Structuring the scorer's input means the score is computed from typed evidence fields rather than an open-ended text judgment, which shrinks the free variance term (source doc, refs4). The general principle is psychometric: measuring instruments need demonstrated reliability and validity before their readings can support decisions, and instruments with poor properties produce untrustworthy data (https://pmc.ncbi.nlm.nih.gov/articles/PMC10543275/, w0.901). A scorer is a measuring instrument; the v2 rewrite is an instrument redesign, not a prompt tweak.

## The hysteresis layer

The second refs4 change is hysteresis, and the source doc lists it as mandatory in the flow (design decisions). Its job is specific: threshold jitter eliminated on edited-row re-scores. Without hysteresis, a row edited slightly and re-scored can flip its verdict when its score lands near the threshold, so the same corpus state produces different gate outcomes depending on scoring order. With hysteresis, moving from a pass to a fail requires crossing a wider band than moving from fail to pass, so small re-score fluctuations cannot flip the verdict.

The electronics analogy is exact and old. A Schmitt trigger is a comparator with hysteresis: two different threshold voltages for rising and falling inputs, which prevents false switching when the input is noisy (https://analogcircuitdesign.com/introduction-to-schmitt-trigger/, w0.687). Schmitt triggers reject noise by using the hysteresis curve to provide accurate switching (https://www.geeksforgeeks.org/electronics-engineering/schmitt-trigger/, w0.655). The circuit converts slow or noisy inputs into clean digital signals using two switching thresholds (https://www.wevolver.com/article/schmitt-trigger-circuit-hysteresis-design-equations-and-a, w0.593). A gate re-scoring edited rows is the statistical twin: the "noise" is scorer variance on re-score, the "clean signal" is a stable verdict.

## Why hysteresis is mandatory, not optional

The failure hysteresis prevents is worse than an occasional flip: with no hysteresis, gate verdicts depend on evaluation order, so the flow's results depend on internal bookkeeping order rather than corpus content. That breaks reproducibility of the round record itself. The unit protocol (doc 01) needs one honest measurement per round; hysteresis is what makes that measurement stable across the re-scores that any real round performs. The instrument trio for cross-unit comparison (hysteresis, prony, mobility) puts hysteresis first precisely because it is the one that touches every round (source doc, design decision 2).

## Design pattern summary

The pattern generalizes: (1) measure your measurer before trusting its deltas, (2) structure the input to the scorer so variance has nowhere to hide, (3) add hysteresis between the score and the verdict, and (4) version the instrument (v2, v2.1) so a round's scores are comparable only within an instrument generation. The last point is what makes the frozen baseline (doc 02) re-derive per unit: an instrument change is a frame change.
