# 05 - Academic LLM Ideation Benchmarks

Scope: published academic systems and benchmarks for autonomous LLM ideation: Deep Ideation, IdeaBench, SCI-IDEA, AutoResearcher, the Llull thinking machine, and the empirical AI-scientist line.

## Deep Ideation: the most rigorous published workflow

Deep Ideation (arXiv 2511.02238, November 2025) is the most complete published autonomous ideation system. The framework "introduces an explore-expand-evolve workflow to iteratively refine research ideas, using an Idea Stack to track progress. A critic engine, trained on real-world reviewer feedback, guides the process by providing controlled feedback" (source: https://arxiv.org/abs/2511.02238, weight 0.88). The HTML version confirms the iterative refinement structure and Idea Stack tracking (source: https://arxiv.org/html/2511.02238, weight 0.78). Its substrate is a Scientific Concept Network built from 100,000 AI conference papers, capturing contextual relationships between keywords rather than just co-occurrence (source: https://www.alphaxiv.org/overview/2511.02238, weight 0.13, weak backing; corroborated by the primary abstract at https://arxiv.org/abs/2511.02238, weight 0.88). The source doc reports the system reaches acceptance-level quality at 8 of 10 AI conferences with a +10.67% improvement over baselines; the arXiv abstract page is the citable primary record (source: https://arxiv.org/abs/2511.02238, weight 0.88).

## Evaluation infrastructure: IdeaBench and the Stanford grant

IdeaBench provides "a comprehensive dataset and an evaluation framework for standardizing the assessment of research idea generation using LLMs", with a dataset of titles across domains (source: https://arxiv.org/abs/2411.02429, weight 0.73). The ACM published version proposes "a reference-based metric that aligns with human judgment to quantify idea quality with the assistance of LLMs" (source: https://dl.acm.org/doi/10.1145/3711896.3737419, weight 0.82). Funding follows: Open Philanthropy recommended an $880,000 grant over two years to Stanford for an LLM-generated research ideation benchmark (source: https://www.openphilanthropy.org/grants/stanford-university-llm-generated-research-ideation-benchmark/, weight 0.83). Evaluation is therefore an actively funded subfield, not a side note.

## The empirical AI-scientist line

Adjacent to ideation proper, an AI system "to help scientists write expert-level empirical research" was benchmarked on 16 playground competitions from the 2023 season covering regression and classification tasks (source: https://arxiv.org/html/2509.06503v3, weight 0.75). This grounds the feasibility end of the ideate-then-execute pipeline: autonomous execution of research plans is separately measurable.

A related benchmark entry, AnthroDial, benchmarks LLM anthropomorphism in autonomous social interaction (source: https://arxiv.org/abs/2609.37853, weight 0.47, weak backing); it is adjacent rather than core.

## Sibling approaches in the literature

The Llull machine paper (arXiv 2508.19200v2) treats symbolic recombination of themes, domains, and methods as the historical ancestor of automated ideation, per the source doc; the arXiv HTML is the citable primary (source: https://arxiv.org/html/2508.19200v2, weight not established by this dig; listed here for completeness of the lineage, treat as unweighted). AutoResearcher (arXiv 2510.20844v3) covers knowledge-grounded transparent ideation with multi-agent collaboration (same caveat, source: https://arxiv.org/html/2510.20844v3). SCI-IDEA (Springer, Machine Learning 2026) adds context-aware scientific ideation with an Aha-Moment Detection module (source: https://link.springer.com/article/10.1007/s10994-026-07036-8, weight not established by this dig).

Chain of Ideas (EMNLP 2025 findings) develops novel ideas via LLM agents (source: https://aclanthology.org/anthology-files/pdf/findings/2025.findings-emnlp.477.pdf, weight not established by this dig). A field review of LLM-assisted ideation examined 61 studies and identified unaddressed research gaps (source: https://arxiv.org/pdf/2503.00946, weight 0.80), also published as a review page (source: https://arxiv.org/html/2503.00946v2, weight 0.80 per the dig record for the PDF).

Third-party mirrors of the papers exist but are weak: a mirror of Deep Ideation on arxiv.gg repeats the abstract (source: https://arxiv.gg/abs/2511.02238, weight 0.09, weak backing) and an alphaxiv overview adds the 100,000-paper network detail (source: https://www.alphaxiv.org/overview/2511.02238, weight 0.13, weak backing). Cite the arXiv primaries.

## What the benchmark line implies

1. Autonomous ideation quality is now measurable and benchmarked, with a reference-based human-aligned metric available (source: https://dl.acm.org/doi/10.1145/3711896.3737419, weight 0.82).
2. The dominant published axes are novelty and feasibility; the 61-study review catalogs evaluation metrics and their gaps (source: https://arxiv.org/pdf/2503.00946, weight 0.80).
3. Gap-awareness, measuring what an idea set fails to cover, is absent from the published benchmark axes documented here; the nearest published work is focus-level blind-spot evaluation of reviews, not of ideas (source: https://aclanthology.org/2025.emnlp-main.1805/, weight 0.86; developed in doc 09).
