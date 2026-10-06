# 01 - Fresh-Context Review Posture

Scope: why a confident answer is not a correct one, why the reviewer must be fresh-context and biased to disprove, and why this is an in-flight posture rather than a final verdict. Grounding spine: `yubi-OS/yubiOS skills/doubt-driven-development/SKILL.md` (source doc).

## The core claim

The source doc states the premise directly: "A confident answer is not a correct one. Long sessions accumulate context that quietly turns assumptions into 'facts' without anyone noticing." Doubt-driven development materializes a fresh-context reviewer biased to **disprove**, not approve, before any non-trivial output stands (source doc, Overview).

The posture is in-flight. The source doc explicitly distinguishes it from `/review`: `/review` is a verdict on a finished artifact, while doubt-driven cross-examines non-trivial decisions while course-correction is still cheap (source doc, Overview).

## Why long sessions poison judgment

The measured evidence for the source doc's intuition about long sessions is strong:

- The "Lost in the Middle" study shows language models use long contexts poorly: performance is highest when relevant information sits at the very beginning or end of the context and drops sharply when it sits in the middle (weight 0.63, https://cs.stanford.edu/~nfliu/papers/lost-in-the-middle.arxiv2023.pdf).
- In-context recall is prompt dependent: the same fact placed differently in the context window changes whether the model retrieves it (weight 0.75, https://arxiv.org/pdf/2404.08865v1).
- Later work reports a scaling gap where more context means less focus on the task-relevant part (weight 0.44, weak backing, https://arxiv.org/pdf/2602.15028), and that smaller "needles" in haystack tests are harder to find (weight 0.49, weak backing, https://arxiv.org/html/2505.18148v1). Context-rot explainers (weight 0.30, weak backing, https://redis.io/blog/context-rot/; weight 0.31, weak backing, https://www.datallmlab.com/blog/context-rot.html) describe the same phenomenon operationally.

Together these support the source doc's claim that a session's accumulated context is an active reliability hazard, not passive background.

## Why a fresh reviewer must be biased to disprove

- An experimental study of anchoring bias in large language models found that LLMs are measurably influenced by anchors in their prompts (weight 0.51, https://link.springer.com/article/10.1007/s42001-025-00435-2). Synthetic-data experiments reach the same conclusion (weight 0.49, weak backing, https://arxiv.org/pdf/2505.15392). This is the mechanism behind the source doc's Step 3 rule that the reviewer receives ARTIFACT and CONTRACT only, never the author's CLAIM.
- The critical survey "When Can LLMs Actually Correct Their Own Mistakes?" concludes that intrinsic self-correction (the model fixing itself using only its own context) fails on reasoning tasks; reliable correction needs external feedback (weight 0.68, https://aclanthology.org/2024.tacl-1.78/; preprint weight 0.60, https://arxiv.org/abs/2406.01297). A reviewer loaded with the author's reasoning is doing intrinsic self-correction by another name.
- When two LLMs debate, both tend to believe they will win, which documents persistent overconfidence in adversarial exchanges (weight 0.52, https://arxiv.org/pdf/2505.19184).

## Why this is not just "ask another model to check"

The source doc's framing rule ("Do NOT validate. Do NOT summarize. Find issues") matters because asking a loaded reviewer "is this good?" reproduces the author's bias. Practitioner writeups of adversarial review prompts make the same point: the prompt must demand refutation, not opinion (weight 0.25, weak backing, https://blog.fsck.com/2026/05/01/adversarial-review/). Structured multi-agent refute-or-promote pipelines formalize the same idea at larger scale (weight 0.32, weak backing, https://arxiv.org/html/2604.19049).

The posture, in one line: the reviewer is a measurement instrument for the author's blind spots, and any context you hand it other than the artifact and the contract calibrates it toward agreement.

## What the posture costs and buys

The source doc's rationalization table prices the tradeoff explicitly: "Debugging a wrong commit in production is more expensive. The check is bounded; the bug isn't" (source doc, Common Rationalizations). The boundedness is the Step 5 stop condition (3 cycles maximum), and the scoping is the when-NOT-to-use list (detailed in doc 02): the posture applies to non-trivial decisions only, so the cost is paid only where the blast radius justifies it.

Two operational consequences follow. First, the reviewer's verdicts are never final: the source doc's Step 4 insists reviewer output is data, not verdict, because a fresh reviewer can be wrong from lack of context (source doc). Second, the reviewer is reusable across decision types, which is why the doc frames doubt-driven as a posture rather than a tool: the same CLAIM, EXTRACT, DOUBT, RECONCILE, STOP shape covers a caching-layer thread-safety claim, a schema migration, and a "this scales" assertion.
