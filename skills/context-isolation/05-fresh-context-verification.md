# 05 - Fresh-context verification

Scope: why verification that can see the original reasoning rubber-stamps it, the anchoring and self-correction research behind that failure, and the concrete practice the context-isolation skill prescribes instead.

## The source doc's claim

The source doc (yubi-OS/yubiOS skills/context-isolation/SKILL.md) names rubber-stamp verification as failure mode 2 of context rot: "verification that rubber-stamps the original reasoning because it can see that reasoning." Its when-to-isolate section makes the prescription concrete: a reviewer that can see the original author's reasoning inherits its blind spots and biases toward agreeing, so verification needs a fresh context where the reviewer receives "the artifact and the acceptance criteria, not the story of how it was built." Its anti-pattern section repeats the rule from the other side: "Asking a verification pass to review work while it can still see the original chain of reasoning that produced it."

## Anchoring: the mechanism, with evidence

The reason visible prior reasoning poisons review is anchoring. Two peer-reviewed experimental studies establish that LLMs exhibit the bias directly. "Anchoring Bias in Large Language Models: An Experimental Study" (https://arxiv.org/abs/2412.06593, weight 0.55; journal version https://link.springer.com/content/pdf/10.1007/s42001-025-00435-2.pdf, weight 0.58) examines how anchoring bias manifests in LLMs and verifies the effectiveness of mitigation strategies, finding that LLM responses are sensitive to biased hints in their input. A companion study on the anchoring effect with synthetic data (https://arxiv.org/pdf/2505.15392, weight 0.52) investigates whether LLMs are affected by anchoring, the underlying mechanisms, and potential mitigations. Both are moderately weighted; together they carry the claim that a model given a prior judgment in its context tends to adjust insufficiently away from it, which is precisely what happens when a reviewer model reads the author's reasoning before forming its own verdict.

A weaker definitional source frames the human-side phenomenon the studies transplant: anchoring bias causes people to favor information received early in decision-making and fail to adjust correctly even after receiving additional information (https://www.scribbr.com/research-bias/anchoring-bias/, weight 0.41, weak).

## Self-correction: why the same context cannot be trusted

The second leg is the self-correction literature. The ICLR paper "Large Language Models Cannot Self-Correct Reasoning Yet" (https://openreview.net/pdf?id=IkmD3fKBPQ, weight 0.29, weak) evaluates intrinsic self-correction, where the same model critiques and refines its own output without external feedback, and reports it does not improve reasoning performance; its analysis of Self-Refine attributes reported gains largely to the refinement loop patching a sub-optimal initial prompt rather than genuine error correction. A weak secondary summary reaches the same reading (https://benjaminhan.net/posts/20260516-cannot-self-correct/, weight 0.13, weak). The claim is weakly weighted here, but its content aligns exactly with the source doc: the model that produced the reasoning is the wrong instrument to verify it, because in-context review sees its own premises and tends to agree with them.

The source doc's structural fix is stronger than prompt-level self-critique: separate the producer and the verifier into contexts that cannot see each other. A weak practitioner writeup of the producer-critic pattern (https://labo-llm.fr/en/techniques/reflection-auto-critique/, weight 0.29, weak) describes separating generation and evaluation into distinct roles, and documents the residual risk the source doc's fresh-context rule exists to remove: self-revision bias when the critic is not actually independent.

## The practice: artifact plus criteria, not the story

Putting the evidence under the source doc's prescription gives the verification contract:

1. The reviewer context receives the artifact under review and the acceptance criteria. Weight 0.55 and 0.58 studies above explain why nothing else should be there: any prior reasoning in the window acts as an anchor the review will insufficiently adjust away from.
2. The reviewer does not receive the author's chain of reasoning. The self-correction evidence (https://openreview.net/pdf?id=IkmD3fKBPQ, weight 0.29, weak) shows in-context critique of one's own reasoning is unreliable; the anchoring studies show why (prior judgments bias later ones).
3. The verdict returns to the main thread as a decision input, per doc 04's bring-back-conclusions mechanic (source doc: yubi-OS/yubiOS skills/context-isolation/SKILL.md).

This is also where the source doc's skill ecosystem bites: the doubt-driven-development skill doubts a specific decision with a fresh-context reviewer, and the source doc notes that context isolation "is the boundary that makes DDD's fresh context possible" (source doc). The negative-skill-space gap mapper is likewise specified to run in a fresh-context subagent so the mapper does not carry the artifact author's blind spots (source doc).

## What the drift note should say

The research world has moved past the source doc in one respect worth dating: the anchoring-in-LLMs studies (https://arxiv.org/abs/2412.06593, weight 0.55; https://arxiv.org/pdf/2505.15392, weight 0.52) now give the skill's verification rule an empirical footing the source doc asserts from practice rather than citation. This does not contradict the source doc; it grounds it. The rule stands as written: fresh context, artifact plus criteria, no author reasoning in the reviewer's window.
