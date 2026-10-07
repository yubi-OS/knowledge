# 01 - Cost of asking: the economics behind the default

Scope: why every prompt is an interruption, why the polite-yes failure mode makes cheap asks expensive, why inference is the right default, and what makes inferring wrong costly too.

## The two costs

The source doc (yubi-OS/yubiOS skills/human-for-feasibility/SKILL.md, "Philosophy") states the two costs plainly. First, the cost of asking is real: every prompt is an interruption; every clarification request is an opportunity for the polite-yes failure mode; every "are you sure?" is a chance for the user to agree with a weak direction just to be agreeable. Second, the cost of inferring is also real: a wrong assumption baked into the work becomes expensive to undo, and a confidently inferred scope that is actually wrong creates rework.

The skill's conclusion is that the right default is inference: proceed when the choice is documented anywhere, ask only when the choice is undocumented AND the cost of being wrong is high enough to outweigh the cost of interrupting, and otherwise proceed with the inference flagged. The corpus treats this as the skill's load-bearing axiom (source doc).

## Interruption cost is measurable

Human-factors research gives the interruption claim empirical teeth. Gloria Mark's UC Irvine research, summarized in a practitioner writeup, found it takes 23 minutes and 15 seconds to fully refocus after an interruption, and Harvard Business Review found knowledge workers toggle between applications more than 1,200 times per day (https://www.linkedin.com/pulse/context-switching-23-minute-tax-anindya-singh-obi-ccwnc, weight 0.11, weak backing, sub-0.5). A second practitioner source frames context-switching cost as "one of the most underestimated productivity and performance drains in modern organizations" (https://www.cognitiveeconomy.org/context-switching-cost/, weight 0.19, weak backing, sub-0.5). Both are weak by the weighting model, so treat the numbers as corroborating color, not settled fact. The direction, however, matches the source doc: each ask spends a non-trivial slice of the user's attention.

## The polite-yes failure mode

The polite-yes failure mode is the reason a cheap ask can be expensive in a second, less obvious way: it degrades answer quality, not just time. AI sycophancy is the documented tendency of large language models and assistants to tailor responses to what they predict the user wants to hear rather than what is accurate (https://en.wikipedia.org/wiki/Sycophancy_(artificial_intelligence), weight 0.23, weak backing, sub-0.5). IEEE Spectrum's coverage of AI sycophancy treats the phenomenon as an open research problem with stakes beyond linguistic tics (https://spectrum.ieee.org/ai-sycophancy, weight 0.49, weak backing, sub-0.5). One applied-AI writeup reports that large language models agree with users in the vast majority of cases where agreement is possible (https://www.mindstudio.ai/blog/prevent-ai-sycophancy-adversarial-council-prompts, weight 0.14, weak backing, sub-0.5). All three are weak-backed corroboration; the source doc is the authority for the mechanism: an "are you sure?" invites agreement instead of judgment.

The practical reading: a clarification question does not sample the user's true preference. It samples the user's preference for being agreeable, weighted against the cost of engaging. A weak direction plus a friendly confirmation can beat a wrong-but-unflagged inference in the moment and lose to it later, when the rework surfaces.

## Why inference is the right default anyway

The source doc resolves the tension with a decision rule, not a mood: if the choice is documented anywhere (convention, default, prior artifact, prior session, prior answer, this conversation's context), proceed. If it is not documented and the cost of being wrong is high, ask. Otherwise, proceed with the inference flagged (source doc). Two properties make this default sound:

1. Documented choices are free to infer. The evidence already exists; asking again converts a solved problem into an interruption (source doc, Steps 1-2 of the discipline).
2. Flagged inference is reversible. An inference surfaced in the Inference Audit can be corrected by the user scanning one list, which is strictly cheaper than answering N questions up front (source doc, "The Output: The Inference Audit").

## What makes inferring wrong expensive

The skill does not pretend inference is free. The cost of inferring wrong has three parts (source doc): the rework itself, the trust damage when a confidently inferred scope turns out wrong, and the compounding effect when later decisions build on an unchecked early inference. This is why the skill pairs the default with two controls: the cost-of-being-wrong tier check (Step 3) before proceeding silently, and the Inference Audit after the work. The discipline is not "never ask"; it is "spend the user's attention only where it buys something."

## Takeaway

Asking spends attention twice: the interruption itself, and the quality risk of the polite-yes answer. Inferring spends nothing when the choice is documented, and bounded, flagged cost when it is not. The skill's name encodes the budget: reserve the human's attention for choices only a human can make, and treat every other question as a bug.
