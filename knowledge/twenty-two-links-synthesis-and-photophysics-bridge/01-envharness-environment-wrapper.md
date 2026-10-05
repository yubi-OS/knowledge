# 01 EnvHarness and the frozen-environment wrapper

Scope: EnvHarness's wrapper algebra for frozen agent environments (the envharness repo pair, links 1 and 2 of the 22), the evaluation shape it produces, and the matched-null gap the corpus-audit program claims to fill.

## What EnvHarness is

EnvHarness applies the agent-harness idea to the other side of the interaction loop. An agent harness makes a frozen LLM capable through plug-in components (skills, memory, tools) without changing model weights; EnvHarness wraps a frozen environment in stackable plug-in layers so the environment, not the model, becomes adaptable [github.com/google-research/envharness, weight 0.80]. The project site describes the wrapper as stackable layers named Stage, Contract, and Chain, the same trick a harness plays on a frozen LLM applied to environments [envharness.com, weight 0.48, weak backing, official project site but marketing-adjacent].

The paper behind the repo is arXiv:2608.19880, "EnvHarness: Awakening Static Worlds for Agent Learning". Its motivation: LLM agents learn by interacting with environments, yet those environments are hand-built and static, blind to an agent's weaknesses and quickly left behind as the agent improves [arxiv.org/abs/2608.19880, weight 0.80].

## The evaluation shape

The paper's Figure 1 reports overall performance: agents learning from EnvHarness environments consistently outperform agents learning from the original environments across software engineering and office automation settings [arxiv.org/pdf/2608.19880, weight 0.73; arxiv.org/html/2608.19880, weight 0.71]. That headline is a raw between-arm comparison: two training conditions, one delta. The synthesis document that motivates this corpus argues the latent data shape behind such a comparison is a method × task success matrix, a binary incidence table, and that no margin-preserving randomization backs the reported delta. The claim of a missing matched null is the program's own structural critique, not a statement the paper makes about itself.

Under the program's reading, the right deflection statistic for the EnvHarness result is a ΔV2-style deflection on the skill-bank × task incidence matrix, scored in dBc against a curveball null that preserves both row and column margins. A delta that survives a fixed-margin swap is structure; a delta that does not is margin arithmetic.

## Why static environments invite this critique

Independent literature on benchmark contamination supports the premise that static evaluation assets age badly. A systematic review presented at GEM 2026 finds that benchmark test data appearing in training sets inflates reported performance and surveys detection and mitigation across the field [aclanthology.org/2026.gem-main.50.pdf, weight 0.82]. A widely cited survey of benchmark data contamination in LLM evaluation documents the scale of the problem across GPT-4-class models [arxiv.org/abs/2406.04244, weight 0.90]. A dedicated survey of benchmarking under data contamination traces how the field evolved from static test sets toward contamination-aware protocols [arxiv.org/html/2502.17521, weight 0.88]. Watermark-based detection of contamination has been proposed as a concrete mechanism [arxiv.org/abs/2502.17259, weight 0.62].

EnvHarness is itself a response to static environments: it regenerates and adapts the environment instead of freezing it. But an adaptive environment raises a new statistical question the papers in this family do not answer: when the environment is a moving target, the between-arm comparison is measured on different ground at each step, and only a null that preserves the incidence structure can say whether the observed gain is structure or bookkeeping.

## What the program's machinery adds

Two program tools apply to this link directly. The corpus auditor ingests a method × task binary incidence matrix without modification, computes the deflection of the observed matrix against the curveball fixed-margin null, and reports the result in dBc. The spectral defocus lens then asks a persistence question: does the EnvHarness advantage survive defocusing over training rounds, or does it decay like a transient fluctuation? The program's position is that neither question is answerable from the published mean deltas alone, which is the sense in which the matched null is "missing" rather than merely unreported.

## Standing caveat

The wrapper algebra itself is sound engineering and is not the target of the critique. The gap is inferential: every headline number in the EnvHarness pair is a raw delta with no margin-preserving randomization between the arms. Whether a curveball null would deflect the headline is an open measurement, and this corpus treats it as such rather than asserting an outcome.
