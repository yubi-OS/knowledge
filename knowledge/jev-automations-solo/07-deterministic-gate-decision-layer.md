# 07 - The deterministic gate and the decision layer

Scope: why the Jev Automations framing log keeps the deterministic gate and jev-1.13 as the decision layer while Llama handles generation and safety, and the evidence for that invariant.

## The decision

The framing log names replacing the deterministic gate with LLM judgment as the first Not-Doing item, calling it a violation of the core invariant (framing log, 2026-09-30). It keeps jev-1.13 as the structured decision layer (calibrated, priced near 0.00003 dollars per request) unless overruled, and routes Llama to generation and safety classification only (framing log, 2026-09-30).

## The evidence for deterministic gates

A 2026 paper on the failure class is direct: in policy-permissive tool environments with state-decidable policy rules, silent policy-violating writes form a recurring failure class, and deterministic pre-execution gates recover a measurable fraction of those failures while providing a deterministic guarantee over the blocked actions (https://arxiv.org/pdf/2607.07405, jev weight 0.5799). That is the invariant the framing log refuses to trade away: the gate's rejections are guaranteed by construction, not by the quality of a model's judgment.

Engineering practice states the same thing in operational terms. Deterministic agent quality gates answer narrow questions such as: did the run validate before writing data, did retries stay within policy, was token usage recorded and within budget (https://dev.to/raju_dandigam/fast-agent-quality-gates-deterministic-rules-over-llm-judges-4b1o, jev weight 0.1637, weak backing). A 2026 guide to LLM safety kernels describes the same architecture as deterministic policy outcomes plus approval binding, constraints, and output safety controls, with the safety kernel sitting between the agent and the actions (https://cordum.io/blog/llm-safety-kernel, jev weight 0.4274, weak backing). Kernel-level enforcement has an earlier analog in the data-self-protection patent family, where a sentry (a file system filter installed on the kernel) intercepts and enforces policy on operations regardless of the requesting process (https://patents.google.com/patent/WO2021046637A1/en, jev weight 0.7191): enforcement lives in a component the requesting code cannot talk out of.

## Calibrated decision APIs as the thin layer

The framing log's decision layer is a decision API, not prose generation. The pattern has a named market: LLM Gateway's /v1/systemone decision API returns typed yes/no, choice, and score answers with calibrated probabilities, billed on input tokens only, explicitly framed as an alternative to parsing prose and hoping the JSON holds (https://llmgateway.io/blog/llm-decision-api, jev weight 0.244, weak backing). Decisions API describes the same shape: pick one answer from defined options and return calibrated probabilities (https://decisionsapi.pro/, jev weight 0.2119, weak backing). The Laya project implements a non-autoregressive System 1 decision engine returning typed choice, score, and yes/no decisions over text in a single forward pass (https://github.com/NandhaKishorM/laya, jev weight 0.4224, weak backing). The Jev model itself describes its role as a calibrated probability for a yes/no question before software takes an action, placed between intent and action (https://jevmodel.org/, jev weight 0.4407, weak backing).

All of these are weak-weighted sources, so they establish that the category exists and is converging, not the specific performance of jev-1.13. The calibrated pricing and behavior of the orchestrator's own decision layer is an internal fact of the steady-orbit worker, not a web-verifiable claim.

## The division of labor

The resulting split is: Llama proposes and drafts, jev-1.13 decides branch points, the deterministic gate authorizes, llama-guard flags outbound content. Each component does the work its evidence base supports. The gate invariant survives because no probabilistic component sits in the authorization path, and every probabilistic component's output is either advisory or validated against a schema the model does not control.

## Verdict

The strongest-weighted evidence in this corpus (0.58 for the deterministic-gate paper, 0.72 for kernel-level sentry enforcement) supports keeping authorization out of model hands. The decision-API category is real but young, and the framing log's hedge (keep jev-1.13 unless overruled) is the defensible posture until its calibration is independently re-validated on the automations workload.
