# 01. The jev decision surface: what typed decisions add over implicit use

Scope: What the jev-1.13 decision model's full typed surface (noul, score, choice, confidence routing, session grouping, consumed cost tracking) adds over evolution v1, which touched jev only implicitly through sweep prose.

## What a decision model actually is

A decision model does not generate text. You hand it a piece of content (the state) and a set of typed questions, and it returns typed answers instead of prose (source: https://docs.aimlapi.com/api-references/decision-models, jev weight 0.87). The shape is consistent across vendors: a decision model evaluates a situation and returns calibrated probabilities across a fixed set of outcomes in a single call with zero generated tokens (source: https://docs.liquid.ai/lfm/models/decision-models, jev weight 0.71). The category itself is young: market coverage describes these systems as returning "typed choices with calibrated probabilities, not text" (source: https://www.marktechpost.com/2026/10/02/decision-ai-models-explained-typesafe-jev-vs-fastino-glide-gliner2-5-decide-and-open-source-competitors/, jev weight 0.66).

Jev sits in this category as a System One model: it returns a choice, a score, or a yes/no probability instead of chat. Weak backing note: the jevmodel.org marketing page (weight 0.48, below the 0.5 authority floor) adds that its hosted API opened on 21 September 2026 at $0.042 per 1M input tokens with free output, and none of those pricing or date claims should be relied on without a primary source (source: https://jevmodel.org/, jev weight 0.48, weak).

## The failure mode the surface removes

The pre-decision-model baseline is an LLM that "grades" something by emitting a label plus, at best, a verbal confidence qualifier ("probably high"). It has no calibrated probability output at all, so downstream code has nothing numeric to gate on (source: https://arxiv.org/html/2609.28940v1, jev weight 0.71). That is the gap a typed surface closes: every answer is a number with a stated scale, not an adjective.

## The capability map, row by row

The evolution v2 capability map assigns each piece of the surface a loop role:

1. noul (yes/no probability) as an approval forecast: pre-screen proposals before they reach the operator queue, so a low forecast simply means the proposal is never made. The point is to reduce approval spam, not to replace the approval.
2. score (0 to 9) for priority ranking: rank proposed directives per cycle, propose only the top N, and note the rest.
3. choice for kind routing: classify which whitelist kind a finding belongs to, which doubles as validation of the sweep's own classifications.
4. The confidence field for routing: answers that come back with low confidence force the needs_approval path regardless of kind. This matches published practice on escalation design: force the score with structured outputs, then set the threshold from your own observed error rate per score band (source: https://openrouter.ai/blog/insights/confidence-thresholds-for-model-escalation-routing/, jev weight 0.38, weak), and map score ranges plus hard preconditions to explicit outcomes such as answer, clarify, escalate, or abstain, released behind evaluation gates (source: https://sincllm.com/blog/llm-confidence-scoring-abstention, jev weight 0.38, weak).
5. session_id for grouping: one session id per loop fire gives a full per-fire decision audit lineage, so every jev call a cycle made can be replayed as one unit.
6. consumed for cost tracking: already present in the ledger, extended in v2 to every jev call inside the loop.

Two weakly-backed practitioner sources round out the routing picture: pre-call routing uses predicted suitability, which is inherently uncertain, so threshold tuning and cost-aware optimization are treated as first-class (source: https://yubol-bobo.github.io/awesome-llm-confidence/pages/routing.html, jev weight 0.22, weak), and pipeline quality is argued to depend less on how often the model is right than on where low-confidence answers land (source: https://www.shipwithjev.com/blog/escalation-design-patterns, jev weight 0.16, weak).

## What changes versus v1

Evolution v1 used jev only implicitly: sweep prose described findings, and the decision model was never called as a gate. The v2 map makes every capability explicit and machine-readable. A proposal is forecast before it is proposed (noul), ranked when proposed (score), routed when classified (choice), escalated when the model says it is unsure (confidence), attributed when audited (session_id), and priced when run (consumed). The surface turns the loop's judgment calls into ledger rows, which is the precondition for the calibration primitives in the later docs: you cannot null-standardize or standard-candle a judgment that was never recorded as a number.
