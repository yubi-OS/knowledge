# 04 Preference-imitation prior art: LAION, PickScore, ImageReward

Scope: the existing ML taste engines, what preference-imitation architectures are, their documented failure modes (reward hacking, imperfect proxies, dataset bias), and why the natural-taste engine takes a principle-based path instead.

## The dominant paradigm: learn the crowd

Every deployed taste engine in production is a preference-imitation system. The LAION aesthetic predictor is a linear estimator on top of CLIP trained to predict the aesthetic quality of pictures (https://github.com/LAION-AI/aesthetic-predictor, weight 0.63). Its production use is dataset curation at scale: using LAION-Aesthetics Predictor V2, LAION created subsets of the LAION 5B corpus, including 1.2 billion image-text pairs with predicted aesthetics scores of 4.5 or higher and 939 million pairs at 4.75 or higher, published on Hugging Face (https://laion.ai/blog/laion-aesthetics/, weight 0.79). ImageReward is described as the first general-purpose text-to-image human preference reward model, trained on 137,000 pairs of expert comparisons and reported to outperform existing text-image scoring methods (https://github.com/p1atdev/ImageReward-PickScore, weight 0.40, weak backing: this is a mirror repository, not the official paper page; treat the 137k figure as weakly backed).

These systems learn a mapping from images to a scalar that mimics aggregated human ratings. Nothing in the pipeline encodes a structural principle; the model's taste is whatever the training distribution's taste was.

## The documented failure mode: reward hacking

When such scores are used as optimization targets, the gap between the proxy and true human judgment becomes a exploitable surface. A 2026 CVPR paper systematically analyzes reward hacking behaviors in text-to-image RL post-training, finding that existing reward designs are often imperfect proxies for true human judgment, making models prone to producing unrealistic or low-quality images that nevertheless achieve high reward scores (https://openaccess.thecvf.com/content/CVPR2026F/html/Hong_Understanding_Reward_Hacking_in_Text-to-Image_Reinforcement_Learning_CVPRF_2026_paper.html, weight 0.81; arXiv preprint at https://arxiv.org/abs/2601.03468, weight 0.72, and HTML full text, weight 0.70).

The same work's mitigation result is the sharpest finding for engine design: ensembling multiple rewards only partially mitigates reward hacking (https://arxiv.org/html/2601.03468v1, weight 0.70). Averaging several preference-imitators does not produce a principle; it averages their biases. This is the core argument for the alternative architecture: if the scoring function itself encodes structural, measurable quantities (fractal dimension, branch exponent, symmetry scores), there is no learned proxy to hack in the same way.

## What audits mean for a principle-based engine

The audit literature's findings apply to preference-imitation in three ways. First, imperfect proxies: a reward model's fit to human ratings is bounded by its training set, and the CVPR 2026 result shows models exploit that gap (weight 0.81). Second, dataset bias: a preference model trained on expert comparisons inherits those experts' distribution (ImageReward's 137k expert pairs, weakly backed at weight 0.40). Third, scale without grounding: LAION's predictor labels billions of images with aesthetic scores that are useful for filtering but carry no account of why an image scores as it does (weights 0.63 and 0.79).

The natural-taste engine's design responds to each: it is deliberately not trained on preference data at all, its per-axis outputs carry the measured feature value that produced the verdict (doc 06), and its only learned component, the typed decision model, is calibration-trained and auditable per question rather than trained end-to-end on taste labels.

## Honest limits of the contrast

The principle-based path has its own limits, and this corpus does not pretend otherwise. Human preference data exists for only 2 to 3 of the engine's candidate axes (fractal dimension, symmetry, branch exponent), so the others ship as structural-conformity measures, not validated taste predictors (project record, source doc 2026-10-05). The engine's honest claim is narrower than the imitators': it reports conformity to biological organizational principles, never a beauty number. Whether a narrower but grounded score beats a broader but biased one is the bet the engine exists to test, and the validation discipline in doc 07 is the machinery of that test.

## Replication artifacts worth noting

The dig also surfaced Human Preference Dataset v2, a large-scale cleanly-annotated dataset of human preferences for generated images with annotator rankings per prompt group (https://arxiv.org/html/2306.09341v1, weight 0.83, surfaced in the doc 08 dig). It is preference-imitation infrastructure, not principle, but it is exactly the kind of human-rating resource that the gold-set phase of the natural-taste engine (doc 08) needs, and it shows large-scale human aesthetic annotation is available at no collection cost when the question fits an existing dataset.
