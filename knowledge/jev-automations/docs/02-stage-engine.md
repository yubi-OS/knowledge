# Stage engine: five stage types with enforcement at two layers

Scope: `jev-engine.js` executes automations as ordered stages of five types: `tool` (pipeline I/O, GET-only enforced at definition validation AND at runtime), `llm` (prompt interpolation from run context, JSON-mode with repair plus one strict retry, fail-soft on unparseable), `builtin` (v1: the ported lead machine), `guard` (llama-guard verdict), and `propose_actions` (outputs enter the existing deterministic gate unchanged).

## Tool stages: GET-only, twice

Tool stages are the pipeline's I/O. The constraint that matters is that tool stages can only GET. The rule is enforced twice: once at definition validation (a stage definition that declares a write against a tool is refused) and once at runtime. Defense in depth matters here because the two enforcement points catch different threats: validation catches operator mistakes and corrupted definitions at activate time, runtime enforcement is the backstop if anything slipped through. Writing anything must go through `propose_actions`, which routes the action into the deterministic gate. OWASP's SSRF guidance makes the same two-layer argument for server-side fetching: application-layer restrictions plus network-layer limits, because no single layer is sufficient (https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html, weight 0.95).

## LLM stages: structured output with bounded repair

LLM stages interpolate the stage's prompt from run context and request JSON mode. The pipeline around the model call is: parse, and on unparseable output, one strict retry, then fail soft (the stage does not crash the run; the task records the failure). This is the bounded-repair pattern: validate the output, repair only what is repairable, and fail closed rather than passing malformed content downstream. A dedicated library documents the same design, with guarded generation helpers that call the model, validate the response, optionally repair it, and retry (https://github.com/ndcorder/outputguard, weight 0.81). A practitioner writeup makes the same argument, that validation should guard parsing through business rules and repair only bounded defects, before content reaches tools (https://sincllm.com/blog/llm-output-validation-repair, weight 0.54, weak backing; cited as the pattern's motivation). The choice of one strict retry rather than open-ended repair attempts is the load-bearing detail: it caps the failure mode at two model calls per LLM stage.

## Guard stages: a classifier in the pipeline

Guard stages run the llama-guard verdict before content proceeds. If the verdict is unsafe, the task parks in `awaiting_approval` with reason `guard_flagged` and the propose step is skipped. Llama Guard 3 8B is a Llama 3.1 8B model fine-tuned for content safety classification of both LLM inputs (prompt classification) and LLM outputs (response classification), aligned to the MLCommons standardized hazards taxonomy, and it outputs a safe/unsafe verdict plus violated categories (https://huggingface.co/meta-llama/Llama-Guard-3-8B, weight 0.79; https://ai.azure.com/catalog/models/Llama-Guard-3-8B, weight 0.66). Parking rather than deleting is the deliberate choice: a human sees the flagged task and decides, which is the approval-gate pattern for agent actions.

## Builtin stages: the lead machine as a callable

The `builtin` stage type lets the engine invoke internal subsystems as pipeline stages. In v1 the only builtin is `lead_research`, the ported lead machine. This keeps the engine small: anything that is a real program rather than a prompt lives behind the builtin interface, and new builtins can be added without new stage-type machinery.

## Propose_actions: the LLM never authorizes

`propose_actions` stages are where automation outputs become candidate actions. The design invariant: proposals enter the EXISTING deterministic gate unchanged. The gate is the same code path caller-supplied actions go through; there is no fast lane for LLM-proposed actions. This is the tool-boundary enforcement posture that OWASP's prompt injection guidance insists on: enforce permissions at the tool boundary, do not treat prompt wording as an enforcement boundary (https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html, weight 0.95). Microsoft's agent-security guidance states the same structural principle: agents chain tool calls while no single human approves each step, so the identity and access boundary must sit at the tool layer (https://www.microsoft.com/en-us/security/blog/2026/07/16/least-privilege-for-ai-agents-identity-access-and-too, weight 0.76).

## Chaining and run context

Stages chain through run context: each stage reads the context the previous stages produced, LLM prompts interpolate from it, and tool stages feed their responses into it. The five stage types therefore compose into the whole automation grammar: fetch data (tool), think about it (llm), check safety (guard), use a subsystem (builtin), and request actions (propose_actions), with the gate always as the last authority.
