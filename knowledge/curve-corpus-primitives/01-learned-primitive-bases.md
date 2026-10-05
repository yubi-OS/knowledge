# Learned primitive bases

Scope: how a corpus mines its own basis of up to 10 primitives from term clusters, why the LLM pruning pass is non-deterministic, and why basis reuse per FIT id is the mitigation that keeps two runs comparable.

## The learned basis

The corpus geometry method does not ship a hand-written vocabulary. It mines term clusters from the corpus itself, then prunes them to a learned basis of up to 10 primitives with an LLM pass. Each primitive is a nameable coverage axis: a file either touches it or it does not. The learned basis is what separates this method from a fixed regex basis, because the axes come from what the corpus actually talks about rather than from what the auditor anticipated (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

Mining clusters before pruning follows a common two-stage shape in the LLM literature: generate candidate structure from text, then reduce it under constraints. LLM-Pruner frames structural pruning of large language models under task-agnostic and language-agnostic constraints (https://arxiv.org/abs/2305.11627, jev high 0.9661), and a 2026 systematic literature review of LLM pruning describes pruning as the standard response to computational, memory, and energy costs (https://link.springer.com/article/10.1007/s10115-026-02721-5, jev high 0.7716). A 2024 study revisiting layer pruning distils practical best practices for pruning metrics, fine-tuning methods, and pruning strategies (https://arxiv.org/html/2411.15558v1, jev high 0.9174). Those works prune model weights; the corpus method prunes a candidate vocabulary, but the discipline is the same: generate more than you need, cut under a stated constraint, keep the survivors nameable.

## Non-determinism is the enemy of comparability

The LLM pruning pass is non-deterministic, and this is not a corner case. A study of hosted LLM providers found that outputs vary for the same inputs even under settings expected to be deterministic, and quantified instability of up to 15% on retrieval-style metrics even in relatively consistent regimes (https://arxiv.org/html/2408.04667v5, jev high 0.8320). The same team published the work at the Eval4NLP workshop, noting that users of hosted providers commonly notice output variance under deterministic settings and that exact statistics are hard to obtain (https://openreview.net/forum?id=dclZiFqiqb, jev high 0.7142; https://aclanthology.org/2025.eval4nlp-1.12/, jev high 0.9348).

The cause is partly infrastructure. The vLLM documentation states that enabling batch invariance may impact performance compared to the default non-deterministic mode, and that this trade-off exists to guarantee reproducibility (https://docs.vllm.ai/en/latest/features/batch_invariance/, jev high 0.8651). In other words, by default serving stacks do not promise bit-identical outputs, so a pipeline that asks an LLM the same question twice has no guarantee of the same answer.

Caching does not fix it either. AI21 engineers describe researchers expecting reproducibility from cache and finding the cache "broken", when the real problem was that the LLM outputs being cached were themselves non-deterministic across runs (https://www.ai21.com/blog/caching-in-agentic-llm-pipelines/, jev high 0.6968). A cache makes a pipeline cheaper and faster; it does not make two independent mining runs agree.

## Basis reuse per FIT id

Because the mining pass is non-deterministic, the method pins the learned basis to the FIT id: every analysis downstream of one fit reuses the same 10 primitives, so curve fits, null runs, and cell counts are comparable within that fit. Two fits of the same corpus may pick different primitive sets, and that is expected.

The flip condition makes the tolerance explicit. If two runs on the same commit disagree on more than 3 of the 10 concepts, the learned basis is dropped in favour of a fixed basis, because a basis that unstable cannot carry an audit verdict. The non-determinism literature above is the reason that threshold exists rather than a demand for perfect reproducibility: the honest position is that LLM mining is repeatable up to a measured disagreement rate, not repeatable exactly (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

## What the learned basis buys

The payoff is nameability. Every axis in the final basis has a human-readable name mined from the corpus, so when a region of the fitted curve turns out sparse, the sparse files can be described in terms of which of the 10 primitives they lack. A basis of unnameable dense dimensions cannot support that step, which is the subject of the rejected-alternatives doc in this corpus.
