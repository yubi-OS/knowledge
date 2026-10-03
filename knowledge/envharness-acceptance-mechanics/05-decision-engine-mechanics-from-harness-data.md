# 05. Decision-Engine Mechanics from Harness Data

**Scope:** What a gated decision engine (the yubiOS jev orchestrator) can consume from an evaluation harness: the episode x failure-axis binary incidence matrix as the standard trace shape, the deterministic statistics that read it, the harness contracts the Lean layer proves, and the three-tier separation that keeps those roles apart.

---

## 1. The incidence matrix is the standard data shape harnesses emit

A harness run produces, per episode, pass/fail or triggered/not-triggered outcomes along named axes (skills, failure modes, behaviors). That is a binary incidence matrix: rows are episodes, columns are axes, an entry is 1 when the axis fired. The yubi-OS envharness audit names this shape as the corpus type the acceptance auditor ingests: "traces -> binary incidence (episode x skill/failure-axis)" [8]. External work converges on the same substrate: TraceDance turns real deployment traces into behavior benchmarks organized by decision point, evaluated without replaying the full environment [1, 2], and agent-eval flywheel material treats per-trace, per-behavior outcomes as what benchmarks are built from [3].

The consequence for a decision engine is an interface contract: any harness adapter must emit (episode, axis, hit) triples reducible to this matrix, because everything downstream reads matrices, not logs. External sources scored mid (0.32 to 0.34) on this run's quality weighting, so they carry corroboration only; load-bearing claims cite the program's audited refs doc [8].

## 2. What deterministic decision layers can read from it

The matrix supports 3 classes of deterministic statistics:

- **Structure measures.** Row and column margins (per-episode failure load, per-axis failure frequency), co-occurrence densities, coverage sparsity. Pure arithmetic; what an orchestrator can gate on without any model call.
- **Null-standardized statistics.** A raw statistic has no meaning without a matched null. The corpus engine's curveball deflections (dV2z, dBc) standardize against margin-preserving permuted nulls; permuting a binary incidence matrix while keeping row and column sums intact is exactly what the R `permute` package implements generically [4]. A statistic becomes a decision signal only after standardization; the fixed-margin null design and the dBc level laws make the comparison canonical rather than ad hoc [8].
- **Drift.** Comparing window k of the matrix against earlier windows gives a per-axis drift signal, the episode x axis analogue of the trailing-window lag problem (doc 04). The companion viscoelasticity analysis reads creep and recovery from pre-registration ledgers over exactly this kind of series [9].

## 3. What the Lean formalization layer proves about harness contracts

The audit established that the harness's algebraic claims are kernel-checked theorems in yubi-OS `CurvedCorpus.lean` section 15, separate from everything empirical [8]:

- **Wrapper composition laws.** `hcomp_id_left/right_A/O` and `hcomp_assoc_A/O`: the identity wrapper is neutral and composition associative, so `Setup(Rules(Env()))` is well-defined regardless of grouping. "Harnesses stack arbitrarily" is a theorem now, not a docstring.
- **Blocked-is-noop.** `blocked_is_noop` and `passthrough_step`: a blocked action leaves the environment unchanged, reward 0, no termination, for every env transition function, not just the one hand-written code path.
- **Budget halting.** `fixed_halts`, `capped_halts`, `capped_accept_halts`, `obj_halts`: the mutation loop terminates at its cap and ACCEPT halts.

2 proven findings bind a decision engine directly. First, the rounding-normalization gap (`weights_round_gap`): fixed-precision axis weights need not sum to 1 (a kernel-checked instance sums to 999 per-mille), so the engine must never treat emitted weights as a distribution without a remainder rule; exact-arithmetic weights are proved exactly normalized (`weights_exact_sum`). Second, the audit confirmed the acceptance statistics were raw trailing-window means with no matched null, which is why Tier 2 (below) standardizes every statistic before it gates anything. Proving contracts over harness traces, not only over the code under test, has precedent: formal-quant builds a machine-checked reference model for finite harness traces under an explicit authority boundary [5], and code-agent verification work treats harness and verified artifact as separate trust layers [6].

## 4. The three-tier separation

The audit's summary division is the consumption contract for any decision engine [8]:

- **Tier 1, contracts (provable).** Every algebraic law a harness asserts about itself is a theorem the engine can rely on unconditionally: composition, blocked-is-noop, halting.
- **Tier 2, statistics (replaceable with nulls).** Acceptance statistics are empirical summaries over traces, only as good as their null. The engine should consume null-standardized quantities (dV2z, dBc), never raw means, and treat any statistic without a matched null as unverified input.
- **Tier 3, execution (empirical, not provable).** Real environments, subprocesses, model calls. Lean does not run webarena; proofs on one side, seeded executable measurements on the other, the same boundary the program enforces between `CurvedCorpus.lean` and `verify_claims.py` [8].

For the viscoelastic instrument proposal (creep-recovery tests, hysteresis from pre-registration ledgers), this is what makes automation safe: the gate math is deterministic and null-checked, the harness contracts are proved, and only the execution is trusted-but-sandboxed.

## Sources considered

| # | Source | URL | jev noul | Used |
|---|---|---|---|---|
| 1 | TraceDance: agent behavior benchmarks from deployment traces (arXiv 2609.33295) | https://arxiv.org/abs/2609.33295 | 0.33 | yes |
| 2 | TraceDance project page | https://zhishanq.github.io/TraceDance/ | 0.33 | yes |
| 3 | Agent evaluation and testing: benchmarks, traces, and the eval flywheel | https://www.kunwar.page/chapter/135-agent-evaluation-and-testing-benchmarks-traces-and-the-eval-flywheel | 0.32 | yes |
| 4 | permute::utils: permuting a binary incidence matrix keeping margins (R permute source) | https://statlab.github.io/permute/_modules/permute/utils.html | unweighted* | yes |
| 5 | formal_bench_demo: runnable Lean 4 formal verification of contract behavior | https://github.com/lfglabs-dev/formal_bench_demo | 0.33 | yes |
| 6 | Harnessing Code Agents for Automatic Software Verification (arXiv 2607.06341) | https://arxiv.org/html/2607.06341v1 | 0.33 | yes |
| 7 | Formal Verification With Lean: an introduction | https://www.daniellowengrub.com/blog/2026/04/30/lean | 0.34 | no |
| 8 | yubi-OS envharness Lean replacement audit (program ground truth) | https://github.com/yubi-OS/yubiOS/blob/main/refs/envharness-lean-replacement-audit-2026-09-01.md | n/a (internal) | yes |
| 9 | Companion analysis: ideate and missing links (linear-viscoelasticity corpus, merged as PR #6) | https://github.com/yubi-OS/knowledge/blob/main/knowledge/linear-viscoelasticity/00-ideate-and-missing-links.md | n/a (internal) | yes |

\* Source 4 fell outside its dig's top-6 cut and was not in the weighted jev batch; it supports only the margin-preservation definition, verifiable from the linked source itself. Weighting came back flat (0.32 to 0.34) across all 12 weighted items, including off-topic results, so no external source separated; recorded in digs/05.json, hence external claims are corroboration-only.

**jev weighting record:** 3 calls total (1 malformed-shape 422, 1 executed and discarded for a targeted selection, 1 recorded). Recorded task_id ta427de4-dfe5-441b-a709-223b0831f8b9, cost 0.000205716; total spend 0.000409248. No 429 or 5xx retries needed.
