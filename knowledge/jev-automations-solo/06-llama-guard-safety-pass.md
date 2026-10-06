# 06 - Llama Guard safety pass: advisory verdicts before any send

Scope: the llama-guard-3-8b outbound-content safety pass in the Jev Automations framing log: verdicts recorded as evidence, advisory to the deterministic gate, never authorizing.

## The design

The framing log adds llama-guard-3-8b as an outbound-content safety pass before any send, with the verdict recorded and treated as advisory to the gate, never authorizing (framing log, 2026-09-30). Its validation assumption: llama-guard verdicts must align with the machine's refuse-to-claim guards, tested on the 8 audit fixtures (framing log, 2026-09-30).

## What Llama Guard 3 is

Llama Guard 3 is a Llama-3.1-8B pretrained model fine-tuned for content safety classification. It classifies content in both LLM inputs (prompt classification) and LLM responses (response classification), and acts as an LLM that generates text output indicating whether content is safe or unsafe (https://developers.cloudflare.com/ai/models/%40cf/meta/llama-guard-3-8b/, jev weight 0.724). Meta's model card documents the same model under the Llama 3.1 license family (https://huggingface.co/meta-llama/Llama-Guard-3-8B, jev weight 0.9392). The Llama Guard 3 family later added an 11B multimodal variant for image plus text input and a 1B text-only variant for on-device and cloud safety evaluation, keeping the prompt format consistent with the existing one (https://dev.meta.ai/llama/docs/model-cards-and-prompt-formats/llama-guard-3, jev weight 0.8488). Community quantized builds confirm the 8B model's supported safety-taxonomy languages: English, French, German, Hindi, Italian, Portuguese, Spanish, and Thai (https://huggingface.co/QuantFactory/Llama-Guard-3-8B-GGUF, jev weight 0.8061). Third-party API providers describe the sibling Llama Guard 2 8B as a safeguard model for classifying LLM inputs and outputs and detecting unsafe content and policy violations (https://www.together.ai/models/llama-guard-2-8b, jev weight 0.3232, weak backing).

So the model the framing log picked exists on its target runtime, is purpose-built for exactly the input and output classification roles the design assigns it, and its text-verdict output is parseable as evidence.

## Where the pass sits in the pipeline

Practitioner guidance places moderation at both ends of an LLM pipeline: moderate the user input before sending it to the model, moderate the model response before displaying or sending it, and refuse to proceed if either is flagged (https://circleci.com/blog/preventing-harmful-llm-output-with-automated-moderation/, jev weight 0.6002). Unlike classic social-media moderation, which happens after the fact, an LLM pipeline must moderate both the prompt and the response in real time, before the response is sent (https://neelmishra.github.io/blog/mlops/llm-evaluation/content-filtering.html, jev weight 0.3477, weak backing). Content moderation for LLM apps is generally defined as running text through a safety check that flags or blocks harmful content before it enters the model or leaves it (https://ai-tldr.dev/learn/production-llmops/guardrails-reliability/llm-content-moderation/, jev weight 0.2203, weak backing). Framework descriptions describe input/output moderation as automated detection of harmful or policy-violating content using semantic classifiers and explicit harm taxonomies (https://www.emergentmind.com/topics/input-output-moderation, jev weight 0.2373, weak backing). Annotation tooling treats a moderation pass over a single LLM response as a standard labeling operation (https://labelstud.io/templates/llm_response_moderation, jev weight 0.5092).

## Advisory versus authorizing

The framing log's decision to make the guard verdict advisory rather than authorizing is the structurally important choice. A safety classifier can flag; it cannot decide policy. Recording the verdict turns it into audit evidence attached to the task, while the gate keeps sole authority over whether the send proceeds. This keeps a classifier disagreement (or a guard false negative) from silently widening what the system is allowed to send, and keeps the alignment question (does the guard agree with the refuse-to-claim guards?) answerable from recorded verdicts on fixtures, which is the 8-fixture test the framing log specifies.

## Verdict

The model choice is well grounded: primary sources at 0.72 to 0.94 confirm the model, its classification roles, and its output format. The pipeline placement matches mainstream moderation practice. The advisory-not-authorizing rule is what makes the pass compatible with the deterministic-gate invariant, and the fixture-alignment test is the right check on the one real risk: a classifier whose taxonomy drifts from the machine's own refusal guards.
