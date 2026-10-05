# Audit boundaries and flip conditions

Scope: the problem-family boundary that separates corpus geometry from semantic search, topic modelling, and coverage checklists, and the flip conditions that decide when the learned basis or the sphere must be retired.

## The family: corpus geometry for audit

The family is corpus geometry for audit. Its job is prescription: given N files placed on a manifold, say where the corpus is thin and what pattern would thicken it. Two neighbours share vocabulary but not the job.

Semantic search answers find the file that answers X. It is retrieval: an input query, a ranked output. Corpus geometry produces no ranking; it produces a map whose empty regions are the finding.

Topic modelling answers summarise what the corpus is about. It is description: an account of the corpus's content structure. It is treated fully in the rejected-alternatives doc; here the boundary is the one that matters: description can be excellent and still not prescribe, because nothing in a topic summary names what to write next.

Coverage checklists answer does every file mention Y. A checklist is one axis: a single named concern swept across the corpus. The curve is the joint distribution of all axes at once, so it can say something no checklist can: that two individually common primitives are rarely present together in the same files (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

## Document analysis as the wider practice

Corpus audit sits inside a wider practice of document analysis as a research method. The READ approach in health policy research describes document analysis as one of the most commonly used and powerful methods in that field, while noting existing qualitative research limitations (https://pmc.ncbi.nlm.nih.gov/articles/PMC7886435/, jev high 0.9191). The lineage matters: treating a corpus as an analyzable object with structure worth auditing predates the specific machinery in this corpus, and the machinery inherits the methodological discipline of that literature rather than inventing its own.

Coverage measurement as a methodology also exists outside this method. The MIT AI risk governance landscape mapping describes refining its methodology by transitioning from a 5-point to a more reliable 3-point coverage scale and updating LLM prompts to reduce a stated error source (https://airisk.mit.edu/blog/mapping-the-ai-governance-landscape-april-2026-update, jev high 0.7690). That is checklist-shaped coverage measurement: a fixed scale swept over items. The corpus geometry method is the joint-distribution complement to such single-axis sweeps, not a replacement for them.

## Interpretability as the neighbouring field

The learned-basis requirement parallels interpretability work. A 2026 paper on post-training characterization describes a feature-centered audit in prompt feature space, where two SAE features are close if they tend to appear together, giving a complementary audit view (https://arxiv.org/html/2606.12360v2, jev high 0.8623). An Oxford research agenda for automated interpretability-driven model auditing and control states the goal that maps onto this corpus's own: current interpretability methods have made substantial progress in explaining model internals, but they rarely connect understanding to action, and the agenda proposes systems where explanation drives intervention (https://aigi.ox.ac.uk/wp-content/uploads/2026/01/Automated_interp_Research_Agenda.pdf, jev high 0.8586). The lens is the corpus-geometry version of that connection: an explanation (this region is sparse) that names an action (write files covering these primitives).

Tooling in the gap-detection space exists but carried low weight in the dig for this corpus: a skill for analyzing corpus coverage and generating prioritized research tasks (https://skillsmp.com/skills/mikkelkrogsholm-bookstrap-claude-skills-corpus-analysis-skill-md, jev low 0.0450), a coding agent skill for measuring and closing the understanding gap in a codebase, research corpus, or documentation set (https://github.com/ryannadel/cognitive-coverage, jev low 0.0729), and an AI gap-exploration paper (https://www.researchgate.net/publication/389394809_GapFinder_Exploring_Research_Gaps_with_Artificial_Intelligence, jev low 0.4092). These establish that the category is active; none carried enough weight to ground a methodological claim here.

## Flip condition 1: the learned basis

The learned basis is dropped for a fixed basis if two runs on the same commit disagree on more than 3 of the 10 concepts. The threshold exists because the LLM mining pass is non-deterministic, as documented in the learned-bases doc; 3 of 10 is the measured tolerance above which the basis cannot carry a verdict. Basis reuse per FIT id is the mitigation within one fit (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

## Flip condition 2: the sphere

The sphere basis is dropped for flat if the matched-parameter ablation goes negative on the holdout across 3 seeds. The ablation compares the degree-3 spherical-harmonic fit against the flat 2-D Fourier surface of equal capacity, on held-out data, over 3 random seeds. Negative on the holdout means the sphere's lift and curvature are costing more than they buy on that corpus. The recorded ablation history is positive so far (+0.98 and +1.34, then +0.74 and +0.52), with the explicit clause that near-zero deltas happen and must be reported honestly (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

## What the flip conditions are for

Both conditions are anti-sunk-cost devices. The pipeline has 5 stages (mine, vectorize, lift, fit, tile) and each stage adds machinery someone could defend after the fact. The flip conditions make each of the two expensive choices (learned basis, spherical geometry) refutable by a stated measurement with a stated threshold, so the method can degrade gracefully to its simpler ancestors instead of accumulating machinery. A corpus where the flat fit wins is served by the flat fit; a corpus where the LLM mining is too unstable is served by the fixed regex basis. The audit method is the family of methods, selected per corpus by its own flip conditions, not a single pipeline defended regardless of evidence (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).
