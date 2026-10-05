# 06 - Human-AI Ideation Tradeoffs

Scope: empirical findings on AI versus human ideation: the novelty versus feasibility gap, cognitive load of evaluating AI output, metric divergence, and transparency and ownership design concerns.

## The core comparison: novelty up, feasibility flat or worse

The clearest experimental comparison comes from a marketing conference study comparing professional human ideators with generative AI. Its blind expert evaluation found "AI-generated ideas score significantly higher in novelty and customer benefit, while their feasibility scores are similar to those of human ideas" (source: https://www.researchgate.net/publication/377379153_Comparing_the_Ideation_Quality_of_Humans_With_Generative_Ar, weight 0.12, weak backing; the primary proceedings PDF carries the full theoretical contribution at weight 0.91: source: https://proceedings.emac-online.org/pdfs/A2024-119705.pdf, weight 0.91). The paper's stated theoretical contribution is "comparing professional and AI-generated ideas in terms of novelty, customer benefit, and feasibility" and "analyz[ing] the strengths and weaknesses of both" (source: https://proceedings.emac-online.org/pdfs/A2024-119705.pdf, weight 0.91).

The canonical research-ideas experiment reaches the same shape. "Can LLMs Generate Novel Research Ideas?" gave human and LLM participants the same instructions, topic description, idea template, and demonstration example for a fair comparison (source: https://arxiv.org/pdf/2409.04109, weight 0.81). Its qualitative analysis section is titled "LLMs Cannot Evaluate Ideas Reliably", and states that evaluations had not shown LLM systems producing "novel, expert-level ideas" unaided (source: https://arxiv.org/pdf/2409.04109, weight 0.81). The source doc summarizes the cross-paper finding this way: AI ideas are rated more novel; human ideas retain a feasibility advantage; AI-human dyads improve fluency and flexibility but do not reduce cognitive load because users spend effort evaluating AI suggestions. The two primary experiments above are the citable basis for the novelty and evaluation halves of that summary (sources: https://proceedings.emac-online.org/pdfs/A2024-119705.pdf, weight 0.91; https://arxiv.org/pdf/2409.04109, weight 0.81).

## Automated metrics diverge from human judgment

The field review of LLM-assisted ideation examined 61 studies, surveyed evaluation metrics, and found that automated metrics diverge from human expert ratings (source: https://arxiv.org/pdf/2503.00946, weight 0.80). For anyone building an autonomous ideation loop that scores its own output, this is the central constraint: the loop's internal score is not evidence of external quality.

## Transparency as a design requirement

Transparency in LLM-infused applications is developed as a human-centered research roadmap: "In this new era of LLMs, we must develop and design approaches to transparency by considering the needs of stakeholders in the emerging LLM ecosystem, the novel types of LLM-infused applications being built, and the new usage patterns" (source: https://hdsr.mitpress.mit.edu/pub/aelql9qy, weight 0.87). The Harvard Data Science Review version is the strongest-weighted source in this doc. A ResearchGate mirror repeats the argument (source: https://www.researchgate.net/publication/371310958_AI_Transparency_in_the_Age_of_LLMs_A_Human-Centered_Researc, weight 0.06, weak backing; cite the MIT Press original).

The source doc's survey of trade-offs (arXiv 2601.12152v1, transparency, ownership, human-in-the-loop as central design concerns) aligns with this finding but was not independently returned by this dig; treat it as unweighted context.

## Adjacent governance grounding

Privacy and evaluation governance provide adjacent grounding for autonomous ideation systems that process data: the EDPB's LLM privacy report ties evaluation approach to the LLM lifecycle stage, from training through post-processing, pre-deployment, and production (source: https://www.edpb.europa.eu/system/files/documents/2025-04/ai-privacy-risks-and-mitigations-in-llms.pdf, weight 0.84). Philosophy-of-science background on big data and knowledge production is available but marginal here (source: https://plato.stanford.edu/entries/science-big-data, weight 0.46, weak backing).

## What this implies for an autonomous ideation skill

1. Expect the output to be strong on novelty and weaker on feasibility; an autonomous skill must score feasibility explicitly rather than trust generation quality to imply it (source: https://proceedings.emac-online.org/pdfs/A2024-119705.pdf, weight 0.91).
2. Self-evaluation is unreliable. The "LLMs Cannot Evaluate Ideas Reliably" finding means an autonomous loop needs external grounding, not just a critic model (source: https://arxiv.org/pdf/2409.04109, weight 0.81).
3. Human-in-the-loop effort does not disappear; it moves to evaluation. Design the handoff for evaluation, not generation (source: https://arxiv.org/pdf/2409.04109, weight 0.81; https://hdsr.mitpress.mit.edu/pub/aelql9qy, weight 0.87).
