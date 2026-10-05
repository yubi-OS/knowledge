# 02 - Multi-Agent Ideation Systems

Scope: multi-agent collaborative ideation systems with persona or role separation, from hackathon-built product studios to research platforms for studying agent dialogue design.

## Research-grade: MultiAgent Research Ideator

The strongest source in this class is a research artifact. MultiAgent Research Ideator is the platform behind a SIGDIAL 2025 paper on the design question "how can we design multi-agent LLM systems to generate better research ideas?" It systematically explores multi-agent dialogue design for research ideation rather than shipping a product (source: https://github.com/kskueda/MultiAgent-Research-Ideator, weight 0.65). The corresponding paper studies ideation-critique-revision loops and finds that larger agent cohorts and more diverse critic agents yield more novel and more feasible ideas, with three iterations as the sweet spot before diminishing returns (source: https://arxiv.org/html/2507.08350, weight not independently established by this dig; the platform repository above is the citable artifact at weight 0.65).

## Persona-separated studios

At the product end, hackathon-built systems assign human-like roles to agents. Autonomous Product Studio, built for an AMD developer hackathon, is described as "an AI-powered multi-agent platform that transforms a single startup idea into a complete, evidence-backed execution package" that "behaves like a virtual team" rather than a chatbot or coding assistant (source: https://lablab.ai/ai-hackathons/amd-developer-hackathon-act-ii/weheatamd/autonomous-product-studio, weight 0.33, weak backing). A similar shape is marketed by Autonomous Startup Builder, which claims 6 autonomous agents that research the market, design the product, architect the backend, plan marketing, and build an investor pitch, powered by Claude, OpenAI, or local Ollama (source: https://autonomous-startup-builder.vercel.app/, weight 0.35, weak backing).

Community implementations of the same pattern exist as open repositories: agent-brainstorm implements a 5-stage brainstorming methodology with real-time web search integration running locally (source: https://github.com/Lum1104/agent-brainstorm, weight 0.39, weak backing), and a multi-agent-brainstorming-system orchestrates specialized agents that "generate, critique, and refine ideas in real-time" with continuous debate (source: https://github.com/vedant713/multi-agent-brainstorming-system, weight 0.22, weak backing).

## Solo-operator multi-agent studios

A different cut is one human operating an entire multi-agent company. A practitioner report describes building an autonomous AI studio that has "independently produced and published 6 mobile applications" with a target cadence of one mobile game per week (source: https://medium.com/@enes.kaya95ek/building-an-autonomous-ai-studio-how-i-created-a-multi-agent-company-that-sh, weight 0.19, weak backing). This is evidence the pattern is being run continuously in production, not only demoed, though the source is a personal blog and should be read as anecdote.

## Workflow-product wrappers

Lighter-weight products frame multi-agent ideation as prompt-and-answer chaining rather than a standing agent team. One example markets "four tools that actually work together", carrying a prompt and kept answers from one tool into the next (source: https://getmulti.ai/, weight 0.21, weak backing). These sit between single-agent loops and full persona studios.

## Terminology baseline

"Autonomous" in this context means not subject to the rule or control of another; the dictionary senses stress independence from external control (source: https://www.merriam-webster.com/dictionary/autonomous, weight 0.71). That definition is a useful calibration point: most systems in this document are autonomous in execution but not in goal-setting.

## Implications

The multi-agent lineage converges on two design commitments: persona separation (critic, researcher, executive roles) and evidence grounding during ideation (web search inside the loop). The research platform grounding this class confirms cohort size and critic diversity matter, and that iteration counts plateau quickly (source: https://github.com/kskueda/MultiAgent-Research-Ideator, weight 0.65). What remains thin across the class, product and research alike, is a published scoring or verdict vocabulary; the marketing pages describe agents and pipelines but not the decision rule by which an idea is killed (sources: https://autonomous-startup-builder.vercel.app/, weight 0.35, weak backing; https://lablab.ai/ai-hackathons/amd-developer-hackathon-act-ii/weheatamd/autonomous-product-studio, weight 0.33, weak backing).
