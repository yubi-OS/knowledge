# Three-tier LLM routing on Workers AI

Scope: `jev-llm.js` routes model calls across three tiers: `classify` routes to `@cf/meta/llama-3.1-8b-instruct-fp8`, `draft` routes to `@cf/meta/llama-3.3-70b-instruct-fp8-fast`, `guard` routes to `@cf/meta/llama-guard-3-8b`; a `raw:` pin allows any stage to bypass routing; neuron usage is accounted onto each task.

## The routing decision

The system splits model work by job type instead of picking one model for everything. Classification jobs are small, frequent, and cost-sensitive; drafting jobs need capacity; safety checks need a specialist classifier. This matches the general routing argument that an application talks to a menu of models and the router picks one per request, balancing cost, quality, and latency (https://www.truefoundry.com/blog/llm-routing-cost-quality-aware-model-selection, weight 0.55, weak backing for the general framing; the tier assignment below is a stated property of the system). The architecture locks a hybrid split: DefAPI jev-1.13 stays the structured decision layer for calibrated yes/no and score decisions, while Llama models handle generation and safety.

## The three model routes

The model ids map to real Workers AI models in the catalog (https://developers.cloudflare.com/workers-ai/models/, weight 0.95):

- `classify` to `llama-3.1-8b-instruct-fp8`: Llama 3.1 8B quantized to FP8 precision, with a 32,000 token context window and listed pricing of $0.152 per M input tokens and $0.287 per M output tokens (https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct-fp8/, weight 0.68). The 8B tier is the cheap workhorse for extraction and classification stages.
- `draft` to `llama-3.3-70b-instruct-fp8-fast`: Llama 3.3 70B quantized to fp8 precision and optimized to be faster (https://developers.cloudflare.com/workers-ai/models/, weight 0.95). The 70B tier carries generation-heavy stages such as prompt intake, where one call proposes actions.
- `guard` to `llama-guard-3-8b`: a Llama-3.1-8B model fine-tuned for content safety classification of both inputs and responses (https://developers.cloudflare.com/workers-ai/models/, weight 0.95). Meta shipped Llama Guard 2 on the platform and signaled the Llama Guard line would follow (https://blog.cloudflare.com/meta-llama-3-available-on-cloudflare-workers-ai/, weight 0.85).

## Why fp8 quantization matters at the routing layer

All three routes sit on quantized checkpoints. FP8 quantization is what makes the 8B tier cheap enough to use as a per-row classifier and the 70B tier fast enough to use inside a synchronous automation stage. The pricing on the 8B route (hundredths of a dollar per million tokens) is the concrete evidence that the classify tier can run thousands of small decisions without dominating cost.

## Raw pins

Any stage can declare `raw:` followed by a model id to bypass the named routes entirely. This is the escape hatch for stages that need a model the three named routes do not cover, and it keeps routing an optimization rather than a cage: the default path is the three-tier ladder, the exception is explicit and visible in the definition.

## Neuron accounting

Model usage is accounted onto the task: `jev_tasks.llm_neurons` records how many Neurons a task consumed. This makes cost a per-task observable rather than a platform aggregate, so an automation that runs hot is visible at the task level. Workers AI bills usage in Neurons, and the platform pricing page frames model consumption in that unit; accounting at the task level is the system's own convention layered on top.

## Binding vs REST shapes, one operational lesson

The 70B model speaks full chat.completion over the Workers binding (`choices[0].message.content`), while the REST API additionally offers a `response` convenience string the binding may not carry. An extractor that only understood the REST shape collapsed the binding's response object into the literal text `[object Object]`. The fix: the text extractor handles chat.completion plus nested shapes and never stringifies an object; empty extractions attach `raw_shape` (the JSON of the binding response, truncated to 400 chars) so failures are diagnosable from the API alone. The lesson is binding-first: code written against the binding's shape must not assume REST conveniences exist.
