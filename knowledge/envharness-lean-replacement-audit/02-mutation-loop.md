# envharness mutation loop internals

Scope: the LLM-driven mutation loop that makes EnvHarness a self-mutating evaluation harness: the agent, the three hooks, the compile step, the budget policy, and the objective.

## The loop as audited

The audit (from source at HEAD, pushed 2026-08-21) describes the mutation loop as the second load-bearing piece of envharness's inner workings. Its components:

1. `HarnessAgent`, an LLM, emits Python source for a `_Rules(Rules)` subclass that overrides up to three pure hooks: `filter_action` (A), `modify_transition` (T), `filter_observation` (O).
2. `Setup` replays an action list as the S0 mechanism, seeding the environment before the loop starts.
3. `core/code_loader.py` compiles the emitted source and installs it as a live Rules layer.
4. A `BudgetPolicy` decides when the search stops (FixedBudget, CappedAdaptive, ObjectiveDriven).
5. A `MutationObjective` (DifficultyZone or RedTeam) scores recent traces and steers the next mutation.

This is a generate-and-execute loop: model output becomes executable Python inside the evaluation environment on every iteration. The generated-code-executed-by-agents pattern is now standard infrastructure. Modal documents a coding agent that generates and executes Python code in a sandboxed runtime, using documentation from the web to inform its approach [1]. Cloudflare's Sandbox SDK ships the same shape as a first-class tutorial: turn natural language questions into Python code, execute it securely, and return results [2]. The CodeAct agent family integrates model-generated code directly as the action space, in contrast to tool-call agents [3].

## Hooks as a runtime safety surface

The hook override design (filter the action, modify the transition, filter the observation) concentrates all model-authored behavior into three narrow interfaces. A related production system, SafeAgent Core, is built explicitly around evaluating agent hook events, encoding multi-dimensional risk signals, and reasoning about candidate actions at runtime [4]. The contrast is instructive: SafeAgent Core treats hooks as things to police at runtime, while envharness treats them as the entire mutation surface.

## Why the audit keeps this layer out of scope for Lean

The audit's verdict on the loop's execution machinery is NO by design: real environments, subprocesses, and model calls are execution-side, and a kernel-checked proof cannot run webarena or call an LLM. Two of the loop's five components do fall inside the formalizable region and are treated separately:

- `orchestration/budget.py` termination is provable and proved (fixed_halts, capped_halts, capped_accept_halts, obj_halts in section 15). See the budget-termination doc.
- The `MutationObjective` score is acceptance statistics, and the audit's highest-value replacement swaps it wholesale for the curveball deflection gate. See the acceptance-stats doc.

What remains unprovable in principle is the behavior of model-emitted hook code. An LLM critic literature exists for assessing generated code, for example the amazon-science code-agent-eval system, which uses LLM-based critics with access to a gold test patch to assess both semantic quality and executability of generated patches [5]. But critics are measurements, not proofs: the audit's position is that model-written code is a supply-chain surface to gate (policy and sandbox), never a theorem to trust. The same reasoning underlies the Environment-in-the-Loop line of work, which argues that code and its environment are so intertwined that static analysis of the environment alone gives an inadequate picture [6] (weight 0.598, near the backing threshold; used here only for the directional claim).

## The steering signal question

The loop's quality is bounded by its steering signal. Both built-in objectives score recent traces as raw success-rate window means (`sum(recent) / len(recent)`), a fact the audit confirmed in source. That means the loop steers toward mutations that move a raw mean, with no matched null and no margin preservation, which is the single highest-value finding of the audit and is covered in the acceptance-statistics doc.

## Sources

1. https://modal.com/docs/examples/agent (weight 0.824)
2. https://developers.cloudflare.com/sandbox/sdk/tutorials/ai-code-executor/ (weight 0.921)
3. https://deepwiki.com/langchain-ai/langchain-sandbox/3.5-codeact-agent-integration (weight 0.539, weak backing, labeled)
4. https://github.com/SafeAgent-Development/safeagent_core (weight 0.806)
5. https://github.com/amazon-science/code-agent-eval (weight 0.731)
6. https://arxiv.org/html/2602.09944v1 (weight 0.598)

Claims about the loop's structure (hooks, Setup replay, code_loader, BudgetPolicy, MutationObjective, the raw-mean score) derive from the source audit of google-research/envharness at HEAD (2026-08-21), cross-checked against the repository listing [7] (weight 0.848) and the paper page [8] (weight 0.825). Off-topic results from the dig (a general Wikipedia language page at 0.866 caught by a query miss, an AnythingLLM setup guide at 0.263) were not used.
