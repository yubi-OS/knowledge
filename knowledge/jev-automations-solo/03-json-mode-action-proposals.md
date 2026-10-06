# 03 - JSON-mode action proposals: the reliability question

Scope: the framing log's bet that Llama proposes actions as machine-readable JSON which the deterministic gate then validates, and what the structured-output reliability literature says about that bet.

## The design bet

The framing log makes a specific assumption to validate: Llama-3.1-8b JSON-mode action proposals are reliable enough to gate, tested over 20 prompts with the malformed-output rate recorded (framing log, 2026-09-30). The gate treats LLM-proposed actions exactly as caller-supplied ones today, so a malformed proposal fails closed.

## Measured failure rates

Unenforced JSON output fails at a measurable rate. One production survey reports naive JSON prompting failing 15 to 20 percent of the time, and frames constrained decoding, schema design, and the validate-retry loop as the fixes (https://tianpan.co/blog/2026/04/10/structured-output-reliability-llm-production, jev weight 0.149, weak backing). Another production guide reports an expected 8 to 15 percent parse or schema failure rate without structure enforcement, depending on schema complexity and model (https://www.belsoftsolutions.com/blog/llm-structured-output-enterprise-production-2026, jev weight 0.3445, weak backing). With native structured output (response_format with strict json_schema, tool forcing, or response schemas), success rates rise to the 95 to 99 percent range (https://baeseokjae.github.io/posts/llm-structured-output-guide-2026/, jev weight 0.1276, weak backing), and one guide cites 99.8 percent reliability for OpenAI JSON mode specifically (https://tokenmix.ai/blog/structured-output-json-guide, jev weight 0.1943, weak backing).

All these numbers come from weak-weighted blog sources, so the honest reading is a range: unenforced output fails at high single-digit to double-digit percentages; enforced structured output gets close to but not exactly 100 percent. Either way, the framing log's 20-prompt malformed-rate test is the right instrument, and the gate's fail-closed posture covers the residual rate.

## Validation before execution

The academic anchor is RefineAct, which describes runtime verification of LLM agent actions: a third stage validates each proposed action against a refined specification before execution, intercepting actions at runtime and querying a Prolog knowledge base to verify compliance (https://lab-design.github.io/papers/ASE-26/ase26.pdf, jev weight 0.7162). That is the same propose-then-validate shape the framing log chose, with the validation step independent of the proposing model.

A worked example repo shows the same shape in code: structured JSON response handling, runtime schema validation with Zod, an explicit action allow-list, and a clear separation between generation and execution, where unauthorized output is rejected before execution (https://github.com/rodbridges-dev/controlled-llm-workflow, jev weight 0.3798, weak backing).

Practitioner write-ups converge on the same checklist. Output validation patterns combine constrained decoding, schema enforcement, content scanning, and context-aware encoding to prevent injection, data leakage, and downstream exploitation (https://www.aisecurityinpractice.com/defend-and-harden/llm-output-validation-patterns/, jev weight 0.4728, weak backing). An n8n-centric guide recommends a canonical request object and a validation node that checks status, schema, required fields, and confidence or evidence rules before any email send, database update, or ticket change (https://qveris.com/guides/n8n-llm-gateway, jev weight 0.3426, weak backing). That last point is directly on topic for the n8n retarget: the validation node belongs to the orchestrator, not to the LLM.

## Verdict

The bet is reasonable but conditional. The literature says structured output is much better than raw prompting but never perfect, and the high-weight RefineAct result confirms that the industry-recognized pattern is to validate proposed actions at runtime against a specification the model does not control. The framing log's gate already provides that specification. The residual risk is concentrated in schema complexity for the 8b tier, which is exactly what the 20-prompt test should measure.
