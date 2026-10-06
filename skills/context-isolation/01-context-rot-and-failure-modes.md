# 01 - Context rot and the three failure modes

Scope: what context rot is, why unmanaged context degrades reasoning, and the 3 concrete failure modes the context-isolation skill names for a session that lets its context grow without boundaries.

## The source doc's core claim

The ground source for this corpus is the context-isolation skill itself (source doc: yubi-OS/yubiOS skills/context-isolation/SKILL.md). Its Overview states the principle this whole corpus explicates: "Every additional turn, tool result, and dead-end exploration in a context window is signal until it becomes noise." As a session grows, irrelevant history dilutes the model's attention on what actually matters right now. The source doc names this phenomenon context rot and warns that, left unmanaged, it produces 3 concrete failure modes:

1. Decisions anchored on stale or superseded findings.
2. Verification that rubber-stamps the original reasoning because it can see that reasoning.
3. Wasted tokens re-establishing context that a cleanly scoped subagent would never have needed in the first place.

The source doc also draws a sharp boundary: context isolation is not "use fewer tokens" (that is the token-efficiency skill's job). It is "put the right boundary around the right unit of work" so contamination cannot cross it. Cost is a separate axis from contamination.

## What the research says about degradation with length

Two strong sources back the source doc's premise that longer context actively hurts, not just costs more. The "Lost in the Middle" paper (https://arxiv.org/abs/2307.03172, weight 0.78) analyzed language models on multi-document question answering and key-value retrieval and found that performance degrades as more documents are placed in context, with a U-shaped curve: models perform best when relevant information sits at the very beginning or very end of the input and noticeably worse in the middle. This is direct empirical support for "irrelevant history dilutes attention": the position and volume of irrelevant material measurably changes how well a model uses the material that matters.

A vendor explainer from Redis (https://redis.io/blog/context-rot/, weight 0.78) describes context rot as the performance degradation that happens when an LLM has to process increasingly long input contexts: performance degrades when the model has to search through longer contexts to find relevant information, even though that information is technically available inside the window. That "available but not used" property is exactly the trap the source doc warns about: the stale finding is still in context, so the model treats it as live.

One weaker source is worth labeling rather than discarding. The Chroma research page on context rot (https://www.trychroma.com/research/context-rot, weight 0.30, weak) makes the diagnostic point that long-context evaluations often demonstrate consistent performance across input lengths, which can mask the degradation real workloads suffer. A secondary writeup (https://www.morphllm.com/context-rot, weight 0.16, weak) claims Chroma tested 18 frontier models and found every one gets worse as input grows; treat that count as weakly backed. A blog summary (https://www.understandingai.org/p/context-rot-the-emerging-challenge, weight 0.17, weak) relays Anthropic's framing that context must be treated as a finite resource with diminishing marginal returns, which matches the source doc's stance that additional turns are only signal until they become noise.

## Mapping the research to the 3 failure modes

- Stale anchors. The source doc's first failure mode is a decision made on findings that newer turns have already superseded. The lost-in-the-middle result (https://arxiv.org/abs/2307.03172, weight 0.78) explains the mechanism: older material does not disappear from influence just because newer material has arrived; position and salience decide what the model attends to. Failure mode 2 and the anchoring evidence are covered in depth in doc 05.
- Rubber-stamp verification. The source doc's second failure mode is a reviewer that can see the original reasoning and therefore inherits its blind spots. The self-correction literature is mixed but leans the source doc's way: a weakly weighted OpenReview copy of "Large Language Models Cannot Self-Correct Reasoning Yet" (https://openreview.net/pdf?id=IkmD3fKBPQ, weight 0.29, weak) reports that intrinsic self-correction, where the same model critiques its own output without external feedback, does not reliably improve reasoning. Fresh context is the mitigation the source doc prescribes.
- Wasted re-establishment. The source doc's third failure mode is paying to re-derive reasoning in a bloated main thread that a scoped subagent would never have needed. The Redis explainer (https://redis.io/blog/context-rot/, weight 0.78) frames this as a resource-with-diminishing-returns problem: every token spent keeping dead ends live buys attention dilution that must be paid for on every subsequent turn.

## What this doc establishes for the corpus

Context rot is not a metaphor in the source doc; it is the load-bearing premise. The empirical record (https://arxiv.org/abs/2307.03172, weight 0.78; https://redis.io/blog/context-rot/, weight 0.78) supports the two halves of the skill's design: degradation with irrelevant length is real, and the fix is structural (a boundary around the unit of work), not cosmetic prompt editing.
