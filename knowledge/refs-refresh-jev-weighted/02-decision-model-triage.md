# 02: Decision-Model Triage via /api/decide

Scope: how the sweep scores every enumerated doc with a typesafe decision model (jev-1.13 on the steady-orbit worker), using batched, paced requests instead of one call per doc.

## The seat the model sits in

Triage answers one question per document: does this doc need a deep-research refresh because upstream reality moved? In the 2026-09-29 sweep, all 234 docs were scored with jev via `POST /api/decide` on the steady-orbit worker, using the `noul` metric (a calibrated true/false probability). The request shape is one JSON body with a `state` and a `questions` map, one entry per doc, each carrying the question `type` and the instruction text.

This is the LLM-as-a-judge pattern applied to corpus maintenance: use a language model to automatically score, evaluate, and monitor items at scale, exactly as evaluation-platform documentation describes for production judging (https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge, weight 0.7371). OpenSearch 3.5 shipped the same idea for search relevance, using a large language model to automatically assess result quality instead of human raters (https://opensearch.org/blog/introducing-llm-as-a-judge-scaling-search-relevance-evaluation-with-ai/, weight 0.8361). Academic work goes further and trains the judge itself: a 2025 paper fine-tunes a model on judge data collected across scenarios to improve judge reliability (https://arxiv.org/pdf/2502.02988, weight 0.8261).

## Why typesafe beats free text

A free-text answer ("this doc seems somewhat stale, maybe") cannot be ranked, logged, or gated. The jev-1.13 model returns typed answers: `noul` returns a probability for a true/false question, `score` returns a graded value against named criteria, `choice` returns one labeled option. Public listings of the model family describe exactly this contract: classification, scoring, and yes/no decisions with probability signals, positioned for triage and agent routing (https://decisionapi.org/models, weight 0.0773, weak backing; https://decisions-api.dev/, weight 0.4148, weak backing).

Typed output matters for the sweep's audit story: every verdict becomes a number that can be re-read from the research DB, re-scored later, and compared against the run that produced it. The general LLM-judge pipeline literature says the same thing in pipeline terms: rubric design and regression alerts are what make judge output usable over time, not just a one-off score (https://machinelearningplus.com/gen-ai/llm-evaluation-pipeline/, weight 0.354, weak backing).

## Batching and pacing

The sweep never sends one doc per request. The spec batches 5 docs per `/api/decide` request, which turned 234 docs into 47 requests, and paces the requests under a 15-per-minute-per-IP cap. The mechanics are simple: build one questions map with keys `t01`..`t05`, send it, parse `answers.<key>.noul`, sleep, repeat. Pacing is not optional politeness; hitting the rate cap mid-run would force redos of whole batches.

The same batching discipline applies to the weighting stage (doc 05), which is why the whole 234-doc triage plus 144-result weighting costs about 81 jev calls total in the reference run, at a measured spend of $0.045256.

## What triage found, and did not find

The 2026-09-29 run produced an honest negative result: no doc crossed jev 0.8 (noul distribution: min 0.11, median 0.4, max 0.79, mean 0.417). The model read most of the corpus as durable process, policy, and history content that does not need a refresh. The spec's own conclusion is the load-bearing lesson: when no doc crosses a high-water gate, age becomes the binding triage signal and the decision model is the ranker, not the gate. The model keeps its highest-value seat in collection-quality weighting, where its verdicts visibly differ between upstream primary sources and aggregators.

That failure mode is worth designing for up front: a sweep should never assume the judge will produce a clean separation. It should define, before the run, what happens when the score distribution is flat, and it should already have the age signal in hand so the ranking stage can carry the queue.

## Failure handling

Every `/api/decide` call carries a `User-Agent`, and a failed call (429, 5xx, network error) is a redo, not a degrade: sleep 30 seconds and resend, up to 3 attempts, splitting into smaller batches on retry. Unweighted or unscored items that survive all redos are skipped and recorded as gaps rather than shipped with missing verdicts. The full request log (endpoint, question names, usage tokens) lands in the research DB so every verdict is re-auditable at the provider.
