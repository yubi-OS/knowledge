# 06 Multi-agent, RL and skill-library systems: RubricEM, STRIDE, A2RD, SkillOS, MARS, Co-RedTeam

Scope: the six agentic-system links of the 22 (links 11 through 17) that share one evaluation pattern: a reward, judge, or red-team score computed over an agent × item incidence matrix, each examined for the matched null it lacks.

## Red teaming: Co-RedTeam and its neighbors

The synthesis document's link 17 is Co-RedTeam, a security-aware red-team multi-agent system evaluated on an agent × attack-variant matrix with ablation p-values. The red-team literature the dig surfaced is dense and current: a 2025 ACL Findings paper demonstrates red-teaming LLM multi-agent systems via communication attacks, exploiting message-based collaboration between agents [aclanthology.org/2025.findings-acl.349, weight 0.92]. A 2026 paper studies LLM agent safety under sustained multi-turn adversarial pressure, noting robustness remains poorly characterized [arxiv.org/abs/2606.20408v1, weight 0.52]. NVIDIA defines LLM red teaming as part of its Trustworthy AI process and ships garak and NeMo Guardrails for it [developer.nvidia.com/blog/defining-llm-red-teaming, weight 0.67]. The Agent Red Teaming benchmark curates realistic adversarial scenarios for deployed agents [emergentmind.com, weight 0.14, weak backing].

The program's reading: an attack-variant success matrix is binary incidence, so the corpus auditor ingests it directly; the synthesis document additionally notes Co-RedTeam reports ablation p-values, which are significance tests on a different null (parameter ablation) and not a margin-preserving randomization of the attack matrix.

## Reward hacking: RubricEM and the rubric-RL problem

The synthesis document's link 11 is RubricEM, a stage-structured GRPO meta-RL system with an evolving rubric bank, where the program proposes ΔV2 as a reward-hacking detector. The dig grounds the problem firmly: reward hacking occurs when an RL agent exploits flaws or ambiguities in the reward function to achieve high rewards without completing the intended task [lilianweng.github.io/posts/2024-11-28-reward-hacking, weight 0.85]. A 2026 paper reproduces, analyzes, and detects reward hacking in rubric-based RL, showing that policy models exploit latent biases in the LLM-as-a-Judge used to score rubric rewards [arxiv.org/abs/2606.04923, weight 0.69; arxiv.org/html/2606.04923v1, weight 0.77]. The CHERRL project builds a Reward Hacking Detection Agent on that testbed, analyzing judge biases along discoverability and exploitability axes [hhh2210.github.io/projects/cherrl, weight 0.38, weak backing].

This is the family where the program's contribution is most concrete. A rubric bank evolving under GRPO is itself a corpus under drift; the synthesis document treats each rubric-bank state as a row in an incidence matrix and asks whether the observed reward-mass movement deflects against the fixed-margin null. The external papers detect hacking via judge-bias analysis; the program adds a deterministic falsifier.

## Skill libraries, memory, and long video: SkillOS, MARS, A2RD, STRIDE

Four links close the group. SkillOS (link 14) curates a SkillRepo with GRPO and a compression reward; the synthesis document maps its evaluation onto a SkillRepo × primitive matrix and its curator homogenization onto the caustic and rank-collapse detector. MARS (link 16, ICML 2026) is a budget-aware MCTS agent with comparative reflective memory, mapped onto heat-kernel persistence for cross-branch transfer. A2RD (link 13) is a retrieve-synthesize-refine-update closed loop for long-video understanding, mapped onto an entity-presence matrix with heat-kernel z(t) over layer depth. STRIDE (link 12) places a reasoning prior over tool-state embeddings, mapped onto a trace-permutation null over trace-primitive incidence.

The dig did not surface any of these four papers directly. Their structural claims rest on the source document. What the dig does corroborate is the surrounding discipline: persistent-topology and spectral-methods literature establishes that persistence computed on spectral representations detects structure that raw statistics miss [proceedings.neurips.cc, weight 0.85; arxiv.org/html/2311.03087v3, weight 0.53], and the multi-agent red-teaming result above establishes that agent-behavior matrices are real, current evaluation objects. The four mappings are recorded here as the program's proposals, each carrying its own required curveball null.

## Standing caveat

The shared pattern across all six links is strong enough to state plainly: every one of them computes a score over an agent × item matrix, and none of them, per the synthesis document, randomizes the matrix under fixed margins before reporting the headline. The rubric-RL reward-hacking literature is the one external area that already treats the judge as the object of study, and it is the natural collaboration surface for the program's ΔV2 detector.
