# 01 - EnvHarness architecture

**Scope:** the runtime architecture of google-research/envharness (paper arXiv:2608.19880, released 2026-08-21), read directly from the source tree at commit `fab7d57441` (latest commit, 2026-08-21T06:27:16Z).

## The wrapper algebra

`ActionableEnv` (core/actionable_env.py:72) is the universal interface every benchmark implements directly: `reset / step / observe / evaluate`, `get_env_state` (a Bridge-safe, runtime-handle-free state view for harness hooks), and env-owned `save_state()` / `from_state(dict)`. Its docstring: an EnvHarness "composes WITH an ActionableEnv to produce a NEW ActionableEnv", so agents cannot tell a raw bench from one wrapped in N layers.

`EnvHarness(ActionableEnv)` (core/envharness.py:85) is the middleware ABC: it IS-A ActionableEnv wrapping another in `self._inner`, which may be a raw bench or another EnvHarness, so layers stack arbitrarily:

```
env = Toy24Env()                  # ActionableEnv
env = Setup(env, actions=[...])   # ActionableEnv (replay-from-reset)
env = Rules(env)                  # ActionableEnv (hooks)
# subclass _Rules(Rules) at load-time, overriding hooks
```

All default methods delegate to `inner` (envharness.py:152-208), so a harness overriding one axis touches only that method. `attach()` (envharness.py:139) binds an inner env after construction, for LLM-written `_Rules()` constructors taking no args. Identity is tag-based: `@register_env(tag)` / `@register_harness(tag)` inject `env_type()` / `harness_type()` after class construction, not as `@abstractmethod`, so ABC never blocks instantiation before the decorator lands (envharness.py:104-127).

## The three LLM-overridable hooks

`Rules` (harnesses/rules.py:76, registered `"rules"`) is the A/T/O code-as-mutation harness. Three per-step pure-function hooks, all pass-through by default (rules.py:93-104): `filter_action(action, env_state) -> Action | Blocked` (A), `modify_transition(action, raw_response, env_state) -> EnvResponse` (T), `filter_observation(obs, env_state) -> Observation` (O).

Rules does NOT touch S0 (owned by Setup) or R (eval success is the env's terminal `info["won"]`) (rules.py:38-47). In `step` (rules.py:124-161), `filter_action` sees the PRE-action state; a `Blocked` action short-circuits into an `EnvResponse` carrying `"[blocked] <reason>"` plus a fresh, O-hooked observation with `blocked: True` in `data`. Otherwise `inner.step(filtered)` runs, the state is RE-FETCHED (webarena replaces its state object per step), then T and O run on the post-transition snapshot.

## Setup replay: the S0 mechanism

`Setup` (harnesses/setup.py:40, registered `"setup"`): `reset()` calls `inner.reset(seed, options)` then replays each action in `self.actions` via `inner.step(a)` in order (setup.py:77-92), returning the post-replay observation. There is no separate `setup_initial_state` hook: "Setup IS the S0 mechanism in this design" (rules.py:40-44). After replay it calls `inner.notify_replay_complete()` so per-episode counters (alfworld's `step_count`, its repetition guard) rewind without undoing the replayed world state (actionable_env.py:223-236).

## The mutation loop and code loading

`HarnessAgent` (agents/harness_agent.py:93) is the LLM designer: `propose(ctx) -> Candidate`, `decide(candidate, traces)`, `refine(...)`. It "does NOT pick from a fixed schema - it WRITES the layer", emitting Python source for a `_Rules(Rules)` subclass plus optional in-env actions. Its context carries recent traces, tool schemas, `env_state_schema`, the objective, and a per-task baseline snapshot for calibrating perturbation magnitude (harness_agent.py:53-91). `load_rules_subclass` (core/code_loader.py:68) compiles with `compile(code, "<mutator>", "exec")` in a controlled namespace exposing only `Rules, Action, Blocked, Observation, EnvResponse`, and requires a top-level `_Rules` subclassing `Rules`; failures raise `RulesCodeError`, shaped as LLM self-repair feedback. Empty code returns the pass-through base Rules. `Rules.save_state()` persists `{"rules_code": ...}` and `from_state` recompiles it (rules.py:173-188); the README notes code runs "in an isolated subprocess, so a bad mutation becomes a recorded trace instead of a dead run."

## BudgetPolicy termination

`BudgetPolicy.should_stop(attempts, last_decision, objective_signal)` (orchestration/budget.py:43). Built-ins: `FixedBudget(k)` always runs K episodes per iteration (budget.py:49); `CappedAdaptive(max_k=8)` stops on `Decision.ACCEPT`, cap as safety net (budget.py:59); `ObjectiveDriven(score_threshold=0.8, max_k=20)` stops on accept, score threshold, or cap (budget.py:72).

## MutationObjective scoring

`MutationObjective.evaluate(recent_traces) -> ObjectiveSignal(score, diagnostic, suggestion_prompt, weights)` (orchestration/objectives.py:47); it "only specifies DIRECTION, not concrete numerical mutations" - the LLM decides the values from `suggestion_prompt` (objectives.py:20-22). `DifficultyZone(target_band=(0.3, 0.7), window=10)` (objectives.py:58) scores `max(0, 1 - |sr - center| / half_width)` over the last 10 accepted traces' success rate, emits TOO EASY / TOO HARD verdicts, and weights the S0/A/O/T/R axes inversely to recent failure counts. `RedTeam(window=10)` (objectives.py:127) scores the fraction of recent failing traces and builds on proven failure axes; weights `None`.

## Checkpointing

`persistence/checkpoint.py` saves an env plus stack as `{"schema_version": 1, "env": {"type", "state"}, "harnesses": [{"type", "state"}...]}`, `harnesses[0]` innermost, `harnesses[-1]` what the agent sees (envharness.py:26-34). Each harness saves only its own state; the loader walks inner-to-outer (checkpoint.py:64-72; goals: JSON round-trip fidelity, self-describing tags, no import paths, versioned schema).

## arXiv abstract claims (arXiv:2608.19880)

Paraphrased from the abstract page (jev noul 0.77): EnvHarness is "a programmable layer of plug-in components that wraps a static environment to reshape its behavior without modifying the underlying logic", applies "across diverse domains while ensuring every reshaped environment retains its original verifier", and EnvRigger "treats the target policy as a black box, observing its execution trajectories to synthesize EnvHarness components targeting diagnosed flaws, and validating them via fresh rollouts". "Across five benchmarks in four domains, EnvHarness outperforms both original environments and domain-specific environment generation pipelines, achieving up to a 9.0-point improvement on held-out instances with 9.8% fewer execution steps", enabling "continuous, targeted co-evolution of the policy and its environment".

## Component table

| Component | Relies on | Evidence (file:line) |
|---|---|---|
| `ActionableEnv` ABC | step loop; env-owned save/load | core/actionable_env.py:72-160 |
| `EnvHarness` wrapper | delegation to `self._inner`; `attach()`; tag registry | core/envharness.py:85-208, 139 |
| `Rules` A/T/O hooks | 3 hooks; pre/post snapshots; `Blocked` short-circuit | harnesses/rules.py:93-161 |
| `Setup` S0 replay | ordered `inner.step` replay; `notify_replay_complete` | harnesses/setup.py:77-92 |
| `HarnessAgent` designer | propose/decide/refine; baseline snapshot | agents/harness_agent.py:93-105, 53-91 |
| `code_loader` | compile+exec in constrained namespace; `RulesCodeError` | core/code_loader.py:48-112 |
| `BudgetPolicy` | `should_stop` over attempts, ACCEPT, objective score | orchestration/budget.py:43-84 |
| `MutationObjective` | `ObjectiveSignal`; failure-axis weights | orchestration/objectives.py:47-151 |
| Checkpointing | tag-based `Checkpoint`, schema_version 1, layered save | persistence/checkpoint.py:64-120 |

## Sources considered

| # | Source | Type | jev noul |
|---|---|---|---|
| 1 | https://arxiv.org/abs/2608.19880 | primary paper abstract | 0.77 |
| 2 | https://github.com/google-research/envharness | primary code (ground truth) | 0.92 |
| 3 | https://arxiv.org/pdf/2608.19880 | primary paper PDF | 0.89 |
| 4 | https://envharness.com/ | primary project page | 0.79 |
| 5 | https://arxiv.org/html/2608.19880 | primary paper HTML full text | 0.88 |
| 6 | https://huggingface.co/papers/2608.19880 | aggregator mirror | 0.09 |

Repo files inspected directly at commit fab7d57441: core/actionable_env.py, core/envharness.py, core/hooks.py, core/code_loader.py, harnesses/rules.py, harnesses/setup.py, orchestration/objectives.py, orchestration/budget.py, persistence/checkpoint.py, agents/harness_agent.py, README.md.
