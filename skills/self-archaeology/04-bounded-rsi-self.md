# 04 The bounded RSI loop applied to the self

Scope: how the recursive-self-improvement loop is retargeted at SELF.md, the 3-cycle bound, and the fresh-context rule that answers same-author bias.

## The mechanics, as the source doc defines them

The source doc (yubi-OS/yubiOS skills/self-archaeology/SKILL.md) borrows the recursive-self-improvement loop's mechanics unchanged: gap-map, edit, re-map, stop when fixpoint. Applied to the agent-being, the gap-map is the filtered 12-axis gap list (doc 03), the edit is a change to SELF.md or an accepted Pair or Accept action, and the re-map asks whether the edit closed the gap or introduced a new one.

The bounds are explicit. 3 cycles is the soft cap. After one recursive pass the loop stops; a second pass runs only if substantive new gaps emerge. Past 3 cycles without fixpoint, the skill escalates to the user rather than continuing. The red-flags list treats running the loop past 3 cycles without escalating as a bound violation.

## Same-author bias and the fresh-context rule

The source doc carries one rule that only matters for self-mode: use a fresh-context subagent for the gap-map step from cycle 2 onward. Same-author bias still applies, mirroring the RSI skill's own rule; the author of the self-model is a poor judge of the self-model's gaps.

The external literature supports the concern, with weak jev weights. A study covered by AZoAI (https://www.azoai.com/news/20251110/Study-Finds-Hidden-Bias-in-AI-Text-Evaluation-When-Author-Identity-is-Revealed.aspx, jev weight 0.06, weak) reports that LLMs judge the same text differently depending on the author's identity or stated source. The self-preference bias paper (https://arxiv.org/abs/2410.21819, jev weight 0.11, weak) documents that LLM evaluators systematically favor outputs they produced themselves, which poses risks including promoting specific styles. Both are evaluation-bias findings about models judging text; the skill's rule is the procedural response: change the author of the judgment, not just the judgment.

## What bounded self-improvement means in the wider literature

The dig returns frame the landscape this skill deliberately diverges from. Wikipedia's recursive self-improvement article (https://en.wikipedia.org/wiki/Recursive_self-improvement, jev weight 0.28, weak) describes recursive self-prompting configurations where an LLM drives itself through an execution loop toward a long-term goal. A practitioner writeup (https://saulius.io/blog/recursive-self-improvement-llm-trading, jev weight 0.08, weak) lists concrete RSI forms in the LLM context, including prompt and scaffolding optimization. A survey-style paper (https://arxiv.org/pdf/2607.07663, jev weight 0.39, weak) catalogs self-refine, self-correct, self-reward, self-play, self-distill, self-train, self-evolve, and self-verify mechanisms and notes they cut across fundamentally different ambitions, and mentions the Godel agent, a self-referential agent framework for recursive self-improvement.

Against that backdrop, self-archaeology is a bounded, audited variant: the loop runs on a curated file (SELF.md), every edit is appended to an evidence-carrying changelog, the cycle count is capped, and escalation to the user is the terminal state. There is no open-ended self-modification here; the fixpoint verdict (doc 05) is the designed stopping point.

## Where the cycle hypotheses get tested

The source doc's interaction rules assign doubt-driven-development to each cycle hypothesis before the edit, not after. Combined with the fresh-context gap-map, the intended shape is: a fresh context finds the gaps, the hypothesis about each gap survives adversarial review, then the edit lands, and the re-map confirms or refuses the fixpoint.

## Provenance

- Source doc: yubi-OS/yubiOS skills/self-archaeology/SKILL.md, steps 6 and 8 of "The process", the "Same-author bias still applies" guideline, and the bound-violation entries in "Anti-patterns" and "Red flags".
- Web-shaped dig for RSI mechanics and evaluation bias; all external claims weak-backed as labeled above.
