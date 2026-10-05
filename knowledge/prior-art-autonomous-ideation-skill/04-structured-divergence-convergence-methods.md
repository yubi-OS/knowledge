# 04 - Structured Divergence and Convergence Methods

Scope: methodology-driven ideation tools and prompts that enforce structured divergence then convergence, from classic creativity techniques (SCAMPER, Six Thinking Hats) to LLM-era two-phase scaffolds.

## Classic creativity techniques as prompts

The classic toolset has been repackaged as LLM prompts. SCAMPER, the 7-technique design thinking method for systematically transforming ideas, is documented with real-world examples in a current practitioner guide (source: https://www.imd.org/blog/innovation/scamper-method-design-thinking/, weight 0.64). Course material teaches the same canon as prompt frameworks: "Thinking Tools as Prompts: Six Hats, SCAMPER, SWOT and More" turns classic thinking and management tools into prompts (source: https://completeaitraining.com/course/thinking-tools-prompt-frameworks/, weight 0.13, weak backing). Prompt collections implement Six Thinking Hats as structured brainstorming prompts (source: https://www.godofprompt.ai/gpt-free/brainstorming, weight 0.23, weak backing) and free generators advertise SCAMPER, Six Thinking Hats, and Reverse Brainstorming as structured prompt frameworks (source: https://fifthdraft.ai/tools/brainstorming-prompt-generator, weight 0.16, weak backing). A creativity blog catalogs SCAMPER, Six Thinking Hats, and related techniques for channeling imagination (source: https://verybigbrain.com/creativity/scamper-six-thinking-hats-and-other-weirdly-effective-creative-tools/, weight 0.19, weak backing). LinkedIn lists Six Thinking Hats exercises for structured team discussion and diverse perspectives (source: https://www.linkedin.com/top-content/innovation/creative-innovation-exercises/six-thinking-hats-exercise/, weight 0.07, weak backing).

The consistent finding across these secondary sources is that the techniques survive the LLM transition as prompt scaffolds: the method is the prompt (source: https://fifthdraft.ai/tools/brainstorming-prompt-generator, weight 0.16, weak backing).

## Two-phase divergence-convergence scaffolds for LLMs

The academic formalization of divergent-then-convergent prompting is CREATIVEDC, a two-phase prompting method that "scaffolds divergent and convergent thinking in the LLM's reasoning process for creative problem generation", instantiated for creative programming problem generation (source: https://arxiv.org/pdf/2512.23601, weight 0.78). This is the strongest published evidence that explicit phase separation improves LLM ideation output, and it validates the intuition behind methodology-driven tools.

## Divergent thinking and agentic AI

Deloitte Insights connects divergent thinking with agentic AI: it argues that cultivated divergent thinking and lived neurodivergence together "offer a potent antidote to the potential biases of conventional teams developing and using agentic AI systems" (source: https://www.deloitte.com/us/en/insights/topics/emerging-technologies/divergent-thinking-agentic-ai.html, weight 0.86). The relevance to autonomous ideation is direct: an agent that only converges will reproduce the biases of its training distribution; divergence mechanisms are the countermeasure.

A practitioner-built repository, the Divergent Thinking Tools, names the same failure mode as "the appearance of variety without the reality of it" and says the tools were built for that problem, originally for human-AI interaction, with an architecture that "maps directly to agentic infrastructure" (source: https://github.com/d4vidc4rson/paralogy-divergent-thinking-tools/blob/main/docs/for-agents.md, weight 0.52).

## Survey view: where the paradigm is heading

An overview of conversational AI-enabled ideation tools identifies three extension directions beyond the classic prompt scaffold: co-creation workflows, multimodal fusion, and scaffolding through multi-agent systems where "multiple LLM agents simulate diverse domain expertise" (source: https://www.emergentmind.com/topics/conversational-ai-enabled-active-ideation-tool, weight 0.50). This situates the methodology layer between single-agent prompting (doc 01) and multi-agent studios (doc 02): the same scaffolding idea scales up by adding agents.

## What is missing in the methodology layer

The methods above enforce divergence before convergence and vary the lens (hats, SCAMPER verbs, parallel campaigns). None of the cited sources formalizes a check for what the idea set systematically fails to cover; the closest is the blind-spot evaluation work covered in doc 09 (source: https://aclanthology.org/2025.emnlp-main.1805/, weight 0.86). For an autonomous ideation skill, the actionable takeaway is that two-phase scaffolds are already standardized (CREATIVEDC, source: https://arxiv.org/pdf/2512.23601, weight 0.78), so differentiation cannot come from phase structure alone; it must come from what the phases measure.
