# 05 Research-assistant agents: ScientistOne, PaperOrchestra, PaperBanana, ScholarPeer

Scope: the four research-workflow links of the 22 (links 7, 15, 18, 19), covering citation-integrity auditing, automated paper writing, diagram generation judged by VLMs, and context-aware peer review.

## Citation and provenance auditing

The synthesis document's link 7 is ScientistOne, a Chain-of-Evidence provenance standard applied as a 75-paper audit. The dig did not surface ScientistOne itself but surfaced the citation-integrity problem it targets. CiteAudit is a benchmark for fabricated references that appear plausible but correspond to no real publications [arxiv.org/abs/2602.23452, weight 0.41, weak backing], with the paper's PDF stating that the work provides systematic infrastructure to audit citations at scale in the LLM era [arxiv.org/pdf/2602.23452, weight 0.63]. This is the exact incidence shape the program maps: a paper × integrity-check binary matrix. The program's proposed statistic is a ΔV2 deflection on that matrix; the mapping is direct and requires no adapter.

## Automated paper writing

PaperOrchestra (arXiv:2604.05018) is a multi-agent framework that transforms unconstrained pre-writing materials into submission-ready LaTeX manuscripts [arxiv.org/abs/2604.05018, weight 0.14, weak backing], with a community implementation driven through coding agents and a benchmark-plus-autorater structure [github.com/Ar9av/PaperOrchestra, weight 0.20, weak backing]. The adjacent literature confirms the multi-agent benchmark-creation pattern: BenchAgents is a multi-agent framework for structured benchmark creation [arxiv.org/abs/2410.22584, weight 0.62], with an OpenReview record describing agent interaction and human-in-the-loop feedback for data diversity and quality [openreview.net/forum?id=Xh6S3X3enu, weight 0.49, weak backing]. A springer-published PaperOrchestrator describes an LLM-orchestrated multi-agent pipeline for academic writing [link.springer.com, weight 0.45, weak backing].

The synthesis document maps PaperOrchestra's evaluation onto a paper × reference bipartite incidence matrix scored by P1 Recall, and maps its 200 × 24 rubric union onto the program's injective-mapping ladder. Both mappings are program-side readings of the evaluation shape; the dig corroborates the framework's existence and multi-agent structure but not its internal matrix dimensions.

## Peer review agents and halo collapse

ScholarPeer (arXiv:2601.22638) is the synthesis document's link 19: a context-aware peer-review agent with a reported 90.5 percent win rate. The dig did not surface the paper, but it strongly surfaced the failure mode the document audits for. AgentReview explores peer-review dynamics with LLM agents and names reviewer biases and inconsistent assessments as the field's core challenges [agentreview.github.io, weight 0.63]. A science-direct brief examines detecting LLM-shaped reviews and recommends safeguards for review integrity in the LLM era [sciencedirect.com, weight 0.83]. A 2026 scoping review covers LLM use across literature review, evidence synthesis, peer-review support, citation validation, and research evaluation [link.springer.com, weight 0.66]. The synthesis document's halo-collapse audit reads ScholarPeer's submission × aspect incidence matrix for a collapse signature (all aspects rated uniformly), using the program's caustic and rank-collapse detector. The 90.5 percent win rate is a source-document claim pending deflection.

## PaperBanana: the VLM-as-judge win matrix

The synthesis document's link 18 is PaperBanana, a diagram-generation agent evaluated by a VLM-as-judge win matrix. The document notes that PaperBanana's own random-retriever ablation is the closest thing to a null among all 22 links, while still not being margin-preserving. The dig did not surface the paper; the general pattern of judge-based win matrices is documented across the benchmarks surfaced above. The program's statistic is a ΔV2 plus heat-kernel deflection on the diagram × dimension matrix, testing whether the judged win structure persists under defocus or dissolves like a transient.

## Standing caveat

This family has the thinnest dig coverage of the agentic groups: ScientistOne, ScholarPeer, and PaperBanana did not surface directly, so their specific claims rest on the source document and are labeled as such. The incidence-matrix shape claim itself is robust, because the surfaced adjacent literature (CiteAudit, AgentReview, BenchAgents) independently establishes that these systems are evaluated on paper-level, review-level, and judge-level binary comparisons, which is the program's native corpus type.
