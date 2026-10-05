# envharness wrapper algebra

Scope: what the envharness wrapper algebra is (stacked plug-in layers over a frozen environment), how the composition is built in code, and why the audit ranks it the core of the replaceable contract layer.

## The product idea

EnvHarness applies the agent-harness idea to the other side of the interaction loop: just as an agent harness makes a frozen LLM capable through plug-in components such as skills, memory, and tools without changing the model, EnvHarness wraps a frozen environment in stackable plug-in layers (Stage, Contract, Chain) so a static world can generate targeted learning signals [1][2]. The paper's abstract describes a programmable layer of plug-in components wrapped around a static environment to alleviate the engineering burden of rebuilding environments from scratch [3]. An independent survey write-up characterizes the same mechanism as dynamic customization of existing static environments to produce learning signals for both skill-based and reinforcement learning of LLM agents [4].

## The composition as audited

The audit (2026-09-01, from source at HEAD pushed 2026-08-21) identifies three load-bearing pieces inside the wrapper layer, all in `core/envharness.py` and `core/actionable_env.py`:

1. `EnvHarness` IS-A `ActionableEnv` wrapping an inner `ActionableEnv`.
2. Default methods delegate inward, so harnesses stack arbitrarily, written as `Setup(Rules(Toy24Env()))`.
3. Checkpointing walks the stack and saves each layer's own state, so a checkpoint is a per-layer state list rather than one opaque blob.

The stacking pattern has deep precedent outside this project. Gymnasium documents exactly this shape: you initialize a base environment, then pass it into a wrapper's constructor, and the wrapped environment stays reachable through the wrapper's `env` attribute [5]. EnvHarness generalizes the same nesting idea from observation/action transforms to whole harness layers with their own state.

## The trust claims the stack silently carries

The audit's key observation is that the wrapper algebra's advertised properties are stated in docstrings or true by construction of one code path, and none of them are machine checked:

- "harnesses stack arbitrarily" (composition is associative and identity is neutral),
- "a Blocked action leaves the env unchanged" (Block short-circuits the transition),
- checkpoint round-trip fidelity per layer.

These are algebraic claims. If they hold, a user can compose layers in any grouping and get the same behavior; if one of them fails, the failure is silent and order-dependent. The audit's verdict is that this is exactly the part of envharness a kernel-checked formalization can take over: the section 15 theorems `hcomp_id_left/right_A/O` and `hcomp_assoc_A/O` prove identity neutrality and associativity of the harness composition, and `blocked_is_noop` proves the Blocked no-op as a theorem over every transition function, not just the one hand-written code path in `harnesses/rules.py`.

## Why the generalization matters

The distinction the audit draws is between "our code does this" and "any stack built from these pieces does this". A code-level guarantee (the Blocked branch in rules.py returns the unchanged env) covers one implementation. A theorem covers every transition function that can be plugged in, which is the actual promise the docstring makes. The same gap is visible in the wrapper ecosystem generally: Gymnasium's wrapper system relies on correct delegation being re-implemented by every wrapper author [5], which is why wrapper-stacking bugs are a recurring class of environment-bug reports.

## Verdict

Tier 1 of the audit's three-tier summary: the wrapper algebra is replaceable and, per the audit, already replaced. The proof artifact covers the composition laws and the Blocked invariant; what remains on the execution side is the checkpoint walk itself and the real environments the stack wraps.

## Sources

1. https://envharness.com/ (weight 0.857)
2. https://github.com/google-research/envharness (weight 0.848)
3. https://arxiv.org/abs/2608.19880 (weight 0.825)
4. https://www.alphaxiv.org/abs/2608.19880 (weight 0.645)
5. https://gymnasium.farama.org/api/wrappers/ (weight 0.878)

Claims about the audited code structure derive from the source audit of google-research/envharness at HEAD (2026-08-21) [2]; claims about the wrapping pattern's precedent are backed by the Gymnasium wrapper documentation [5]. Aggregator and off-topic results collected during the dig (kad8.com at weight 0.110, analyticsinsight.net at 0.167, zalt.me at 0.141/0.035) were not used.
