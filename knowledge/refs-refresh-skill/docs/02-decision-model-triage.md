# Decision-model triage: jev at the ranking seat

Scope: routing corpus triage through a typesafe decision model, where it belongs in the pipeline, and how to read its honest calibration without tuning it into flattery.

## What the decision model is

The triage seat uses a decision model, not a chat model. The model in the validated pipeline is jev-1.13 in typesafe mode, served by TypeSafe AI. TypeSafe describes System One Models as "a new class of AI model built for decisions inside software", with Jev as its first public System One Model, "optimized for automation" (https://typesafe.ai/, weight 0.60). Every model is served by the same endpoint, with the request's model field selecting the handler (https://docs.typesafe.ai/models, weight 0.85).

The distinction matters operationally. A chat model returns prose that a caller must parse. A decision model returns typed answers: a score on a defined scale, a yes or no, or a single choice among labeled options, with probabilities and a confidence attached. For a sweep that has to make thousands of small judgments, the typed shape is the whole point.

## The triage question

The triage seat asks one question per document: does this document need a refresh because upstream reality moved? The answer is a probability, and the probability is the rank. Batching multiple documents into one request keeps the per-document cost low; the validated run batched 5 documents per request and paid roughly $0.003 for the whole 234-document triage (internal evidence, 2026-09-29).

## Honest calibration is the deliverable

The most valuable output of the validating run was not the ranking, it was the calibration evidence. The model's maximum score across the corpus was 0.79, the median was 0.40, and zero documents scored above 0.8 (internal evidence, 2026-09-29). Read honestly, this says the judge considers most of the corpus durable process and history content. That is largely correct, and the correct response is to accept it, not to re-prompt until the model produces a spread.

This is consistent with the wider evaluation literature. Work on how to correctly report LLM-as-a-judge evaluations characterizes the parameter regimes, defined by the true evaluation score and the judge's sensitivity and specificity, in which an LLM-based evaluation yields more reliable estimates than human-only evaluation, and allocates calibration samples adaptively for tighter intervals (https://arxiv.org/pdf/2511.21140, weight 0.72). The operational translation for a corpus sweep: report the judge's calibration alongside the ranking, because a rank produced by an uncalibrated judge is not interpretable.

Practitioner writing on LLM-as-judge systems makes the same point from the engineering side, covering rubric design and calibration pitfalls in production (https://matthewpalma.dev/blog/llm-as-judge-evaluation-rubrics-calibration-production-pitfalls, weight 0.48, weak backing). The weak weight is itself a signal about the source class: practitioner blogs on this topic are abundant but rarely primary.

## Two seats, not one

A single decision-model call site is a design smell in this kind of pipeline. The validated design uses jev at 2 distinct seats:

1. Triage seat: rank the corpus for refresh priority. The metric is a judgment about upstream reality, the ranking is soft, and errors are recoverable because a wrongly ranked document just gets a wasted dig.
2. Collection-quality seat: score every search result as it lands. The metric is a judgment about source authority, and it gates what enters the research database.

Splitting the seats matters because the 2 questions have different error costs. A triage false positive costs one dig. A collection-quality false positive poisons the evidence base that every downstream document cites. The validated run observed the collection-quality seat separating upstream primary sources at 0.90 to 0.96 from aggregators at 0.01 to 0.16 (internal evidence, 2026-09-29), which is the separation the whole pipeline depends on.

## Cost envelope

The triage seat ran 47 requests for 234 documents at about $0.003 total (internal evidence, 2026-09-29). At 5 documents per request, the marginal cost of triaging a document is roughly $0.00006. This is the economic argument for a decision model at the triage seat: the judgment is small, frequent, and cheap, which is exactly the workload a System One class model is optimized for (https://typesafe.ai/, weight 0.60).

## Summary

1. Use a typed decision model at triage, not a chat model with parsing glue.
2. Batch 5 documents per request to keep cost near zero per document.
3. Publish the calibration: a median of 0.40 and a max of 0.79 is a finding, not a failure.
4. Keep triage and source-weighting as separate seats with separate error economics.
