# budget and termination proofs

Scope: the halting theorems for envharness's three budget policies, and why termination is provable here when it is undecidable in general.

## The policies

`orchestration/budget.py` ships three policies deciding when the mutation loop stops (audit, from source at HEAD pushed 2026-08-21):

1. **FixedBudget** stops at a declared cap on iterations.
2. **CappedAdaptive** is cap-bounded but may stop earlier.
3. **ObjectiveDriven** stops when the objective accepts.

The audit's section 15 proves four theorems: `fixed_halts`, `capped_halts`, `capped_accept_halts`, and `obj_halts`. The first three are the easy cases: a counter that strictly decreases below a declared bound halts. The fourth, `obj_halts`, is the interesting one: it proves that the ACCEPT decision halts the loop, which requires the objective's accept condition to be a total predicate evaluated on a finite trace window. The docstring-level claim "the loop terminates" becomes, per policy, a theorem with an explicit precondition list.

## Why termination is provable here but not in general

Program termination is a fundamental liveness property in software verification, and proving it for an arbitrary program is a formidable challenge because the general problem is undecidable [1] (weight 0.876; same paper's ICML 2026 presentation [2], weight 0.802, and open PDF [3], weight 0.864). Recent work automates the hard part by using LLMs to generate loop bounds that a verifier then checks [1][2], which is structurally the same division of labor the audit uses: a heuristic proposes, a checker disposes.

The budget policies sit on the decidable side of the line. Each one is a total function over a bounded counter or a finite window, so the halting proofs are short and need no invariant discovery. This matches the bounded-loop pattern formalized in recent agent-infrastructure work: a worker, an independent gate the worker cannot write to, and a declared budget, composed so a downstream failure can re-run an earlier stage under a fresh budget [4] (weight 0.695 for the PDF, 0.600 for the HTML version; both describe the same paper). EnvHarness's BudgetPolicy is exactly the declared-budget half of that pattern, and the mutation loop's ACCEPT condition plays the independent-gate role.

## The contrast with the shipped code

The docstring says the loop terminates. The code makes it true by construction for each policy. The theorem makes it true for every future policy change that preserves the theorem's hypotheses, and states those hypotheses explicitly: the audit's framing is that `capped_accept_halts` and `obj_halts` would catch the most likely regression, a policy or objective edit that quietly makes ACCEPT unreachable or the counter non-decreasing. A regression test would catch one such edit per test written; the theorem catches the class.

Loop-level formal verification in practice often falls back to bounded unrolling because full loop verification is expensive; the smart-contract verification ecosystem documents this explicitly (path explosion, bounded loop unrolling, tools like Certora Prover and Halmos) [5] (weight 0.819). The budget theorems avoid unrolling entirely by proving over the counter algebra instead of the loop body, which is why they are cheap.

## Verdict

YES, proved, per the audit's component table. Termination of the mutation loop is the Tier 1 row that needed no new mathematics, only the observation that a decreasing bounded counter plus a total accept predicate is a complete termination argument.

## Sources

1. https://openreview.net/forum?id=ym8FNvY5z4 (weight 0.876)
2. https://icml.cc/virtual/2026/poster/60583 (weight 0.802)
3. https://openreview.net/pdf?id=ym8FNvY5z4 (weight 0.864)
4. https://arxiv.org/pdf/2609.27871 (weight 0.695; HTML variant at 0.600, same paper)
5. https://runtimeverification.com/blog/formally-verifying-loops-part-1 (weight 0.819)

The policy names, theorem names, and verdicts derive from the source audit of google-research/envharness at HEAD (2026-08-21). Off-topic dig results (a dictionary page at 0.408, a Stack Overflow answer at 0.034, a YouTube video at 0.086, a handwiki page at 0.088) were not used.
