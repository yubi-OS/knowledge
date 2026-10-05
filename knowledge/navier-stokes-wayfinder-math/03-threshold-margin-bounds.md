# Equation A: threshold clearance with conditional stability bounds

Scope: the signed-margin diagnostic for frozen embedding axes, its conditional perturbation bound, the abstention region, what it cannot do, and the rejected unsigned flip-predictor that was excluded from the evidence chain.

## The diagnostic

For a frozen axis `a_j` with mean `mu` and threshold `tau_j`, expose the signed margin `m_j(x) = a_j^T (x - mu) - tau_j` and the bit `b_j(x) = 1[m_j(x) > 0]`. These are quantities the existing `/map/` pipeline already computes or can emit at zero new modeling cost (internal research record, tools/point-map/pointmap.js, https://github.com/yubi-OS/yubiOS/blob/67274066531ae5288bfc640a2030e5a20508b57e/tools/point-map/pointmap.js).

For a perturbation bounded by `||dx||_inf <= eps`, the triangle inequality gives `|a_j^T dx| <= eps ||a_j||_1`. Adding a separately justified numerical error allowance `eta_j` sets the radius `R_j = eps ||a_j||_1 + eta_j`. Then:

1. `m_j > R_j` guarantees the bit stays on, conditional on the supplied bounds.
2. `m_j <= -R_j` guarantees the bit stays off.
3. Anything else returns undetermined, not "will flip".

The equality case is asymmetric because the implemented threshold is strictly greater than zero: a zero-to-one change requires `a_j^T dx > -m_j`, while a one-to-zero change requires `a_j^T dx <= -m_j`.

The Euclidean distance to the hyperplane is `|m_j| / ||a_j||_2` when the axis is nonzero. It must not be reported in standard-deviation units unless the relevant score variance has actually been computed. A fixed frame freezes the boundary, not a document's margin: the margin moves with the document.

## The stability literature this sits in

The pattern (a margin plus a perturbation bound yields a stability statement, otherwise abstain) matches the algorithmic-stability line of work, where generalization claims are conditioned on bounded perturbations (Bousquet and Elisseeff, Stability and Generalization, https://www.jmlr.org/papers/volume2/bousquet02a/bousquet02a.pdf, weight 0.69; a stability analysis of fine-tuning under bounded perturbations, https://arxiv.org/html/2301.09820v2, weight 0.73; margin and consistency supervision for calibrated robustness, https://arxiv.org/pdf/2603.05812, weight 0.56). The abstain branch is the reject-option pattern from the classifier literature: when no confident decision is available, returning "reject" is the correct output rather than a guessed label (Optimal strategies for reject option classifiers, https://jmlr.org/papers/volume24/21-0048/21-0048.pdf, weight 0.96; https://jmlr.org/papers/v24/21-0048.html, weight 0.87; https://arxiv.org/abs/2101.12523, weight 0.87). Weaker sources agree informally (stability margin overview, https://www.sciencedirect.com/topics/computer-science/stability-margin, weak, weight 0.28; margin classifier background, https://en.wikipedia.org/wiki/Margin_classifier, weak, weight 0.18).

## What it cannot do

The system currently cannot derive the embedding displacement of a proposed paragraph before embedding it. These equations provide conditional bounds and post-embedding explanations. They do not create a text-to-bit predictor by themselves. Past maps store frame parameters and bit rows but not the original input scores or vectors needed to reconstruct each historical margin numerically, and the research phase did not fabricate those retrospective values (internal research record).

## Test status

The bound was exercised on 12,000 bounded perturbations: 10,186 classified conditionally stable, zero violations. This checks the implementation of a stated bound on synthetic inputs. It is not semantic forecasting and claims nothing about document meaning.

## The rejected prototype

An initial prototype labeled `|m| < |ds|` as a flip predictor. It ignored direction and compared primarily against an "always flip" strawman. At increment 0.2 it scored 91.35% accuracy, while always no-flip scored 91.475% on the same trials. At increment 0.05 the scores were 97.625% versus 97.775%. The claimed 85 to 98% accuracy therefore demonstrated nothing beyond the no-flip baseline. A point already above threshold moving farther upward is a direct counterexample to the unsigned rule, and the prototype's shuffled control did not approach the claimed always-flip baseline (internal research record, margin-prototype-audit.json).

That prototype is excluded from the evidence supporting deployment. The replacement helper uses signed margins, explicit abstention, and stated error-bound requirements.

## Sources considered

| source | weight |
|---|---|
| https://github.com/yubi-OS/yubiOS/blob/67274066531ae5288bfc640a2030e5a20508b57e/tools/point-map/pointmap.js (internal research record) | record |
| https://jmlr.org/papers/volume24/21-0048/21-0048.pdf | 0.96 |
| https://jmlr.org/papers/v24/21-0048.html | 0.87 |
| https://arxiv.org/abs/2101.12523 | 0.87 |
| https://arxiv.org/html/2301.09820v2 | 0.73 |
| https://www.jmlr.org/papers/volume2/bousquet02a/bousquet02a.pdf | 0.69 |
| https://arxiv.org/pdf/2603.05812 | 0.56 |
| https://www.sciencedirect.com/topics/computer-science/stability-margin | 0.28 (weak) |
| https://dl.acm.org/doi/10.5555/3648699.3648710 | 0.28 (weak) |
| https://mlanthology.org/jmlr/2023/franc2023jmlr-optimal/ | 0.19 (weak) |
| https://en.wikipedia.org/wiki/Margin_classifier | 0.18 (weak) |
| https://www.researchgate.net/publication/348928114_Optimal_strategies_for_reject_option_classifiers | 0.09 (weak) |
| https://zhuoranyang.github.io/sds265-fall26/lectures/09-margin-classification.pdf | 0.07 (weak) |
