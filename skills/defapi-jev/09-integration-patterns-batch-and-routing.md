# 09. Integration patterns: batching, multi-decision calls, and routing pipelines

Scope: how the skill's request model supports batch labeling, several decisions per call, and triage and routing pipelines, with external corroboration from the dig.

Grounding spine: the source doc, yubi-OS/yubiOS skills/defapi-jev/SKILL.md. External sources come from this subtopic's searXNG dig, including 2 redo passes; weights below 0.5 are labeled weak.

## What the source doc gives the integrator

Three source-doc facts are the foundation for every pattern in this doc:

1. **One request can ask multiple questions about the same state** (source doc). A record's full decision set travels in one HTTPS round trip, and the answers come back keyed by question name.
2. **Batch labeling is a named good fit**: running the same question set over many records produces consistent, comparable outputs (source doc). Because the questions are typed and criteria travel with each question, record 40's answers mean exactly what record 1's answers mean.
3. **The response carries task_id and consumed**, the audit and spend hooks (source doc), so a batch runner can log per-request cost and traceability without extra API calls.

## Batch APIs and high-volume processing

The dig's strongest sources cover the batch side of the pattern:

- Azure's documentation for its OpenAI Batch API describes processing asynchronous groups of requests with separate quota and a 24-hour target turnaround at 50 percent lower cost than global standard, the standard design for large-scale high-volume processing (weight 0.92, high: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/batch). The cost lever is real: asynchronous bulk requests are priced below interactive ones across providers.
- A published arXiv study on LLM chain ensembles for data annotation addresses scalability, accuracy, and cost-efficiency in labeling large-scale datasets, the same workload as jev-1.13 batch labeling (weight 0.60, high: https://arxiv.org/html/2410.13006v1).
- Practitioner guides describe batch labeling of tickets, comments, products, and knowledge-base fragments as the canonical large-scale classification workload, with full-pipeline costs including multi-prompt voting and human review of low-confidence items landing 5 to 10 times lower than manual annotation for well-suited text classification (weight 0.10 and 0.15, weak: https://www.oh-bug.com/posts/llm-batch-api-offline-inference-production-guide/ and https://sourcebae.com/blog/llm-as-annotator-data-labeling/).

Mapped onto defapi-jev: a batch runner iterates records, sends each record's state with the same fixed questions object, and relies on the answers map's stable keys. The jev-1.13 model is interactive-latency (this corpus's own weighting batches returned in seconds), so the async-queue pattern of the big batch APIs is optional rather than required; the pattern that transfers is the invariant question set across records.

## Triage and routing pipelines

The routing half of the pattern is where the choice question type lives:

- Support-routing guides describe automated ticket routing as assigning each incoming ticket to the right person or team automatically, based on rules, instead of a human reading the queue and reassigning by hand (weight 0.14, weak: https://www.stacksync.com/blog/auto-route-support-tickets-region-type-crm), with mature ML-based deployments reported reaching 85 to 95 percent triage accuracy versus a 40 to 50 percent ceiling for rules-based systems (weight 0.11, weak: https://irisagent.com/ai-ticket-automation/).
- Ticket-classification writeups frame triage as turning a reactive cost center into a measurable engineering project: the pipeline removes repetitive reading, surfaces intent and urgency, and produces deterministic inputs for automatic routing (weight 0.13, weak: https://beefed.ai/en/nlp-ticket-classification-routing).
- Content-moderation pipeline guides describe the same shape for safety work: an enrichment stage, a decision stage where the model outputs a verdict against platform-specific rules, and human-in-the-loop validation (weight 0.24 and 0.17, weak: https://ehga.org/building-content-moderation-pipelines-for-llms-a-practical-guide-to-security-and-safety and https://ehga.org/building-content-moderation-pipelines-for-llms-a-2026-security-guide).
- Triage in clinical settings shows the pattern at higher stakes: a 2026-indexed study reports machine-learning triage models outperforming conventional triage for critical outcomes including ICU escalation (weight 0.70, high: https://pmc.ncbi.nlm.nih.gov/articles/PMC11575054/). Consistent with the source doc's high-stakes rule, the human stays in the loop; the model sharpens the decision.

The defapi-jev pipeline shape that follows: enrichment into state, one multi-question request per record (choice for queue, score for urgency, noul for the gate), threshold policy for act versus escalate (the acting-on-results doc in this corpus), task_id logged per request.

## Division of labor with the chat model

The dig returned a cluster of sources making the same architectural claim the source doc implies:

- A comparison piece frames typed decision models against general-purpose LLMs with structured output, compared on output shape, parsing risk, latency, cost, explainability, and calibration (weight 0.24, weak: https://jevaitools.com/compare/decision-models-vs-llms).
- Vendor copy states the complement directly: the LLM handles open-ended generation, the decision model handles structured decisions, and they complement each other (weight 0.15, weak: https://jevai.net/).
- The data-labeling ecosystem treats LLM classification as an annotation engine whose costs are dominated by prompt engineering and human review of low-confidence items (weight 0.29, weak: https://atlan.com/know/data-labeling-best-practices-llms/; weight 0.37, weak: https://scale.com/guides/data-labeling-annotation-guide), which is the acting-on-results escalation band showing up as a cost line.

## A minimal pipeline recipe

Composing the patterns, the smallest honest defapi-jev pipeline is four steps:

1. Build the state per record, structured per the writing-good-questions doc in this corpus.
2. Send one request per record with the fixed questions object; log task_id and consumed per request.
3. Apply the threshold policy: act in the high-probability band, escalate the middle band to a human queue.
4. Aggregate the answers map across records for reporting; because outputs are typed and comparable, the aggregation is arithmetic, not parsing.

Steps 2 and 3 are the two places the dig's sources and the source doc agree loudly: keep the question set invariant so outputs stay comparable, and keep a human queue behind the confidence band so the pipeline degrades gracefully instead of confidently wrong.
