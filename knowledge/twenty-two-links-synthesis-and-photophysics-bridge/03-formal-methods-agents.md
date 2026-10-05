# 03 Formal-methods and verification agents: LEAP, IDS Rocq, VeriGuard

Scope: the three links of the 22 that touch machine-checked proof (links 6, 8, 21), what their evaluations share with the other 19, and where the program's machine-checked theory layer sits relative to them.

## VeriGuard: verified guardrails as a real artifact

VeriGuard (arXiv:2510.05156) is the strongest dig-corroborated member of this family. It provides formal safety guarantees for LLM-based agents through a dual-stage architecture designed for robust and verifiable correctness [arxiv.org/html/2510.05156v1, weight 0.92]. The published description describes an interactive verification loop that keeps agent behavior within safe operational bounds, preventing harmful or unintended operations [research.google/pubs, weight 0.87]. The abstract frames the stakes: autonomous agents in sensitive domains such as healthcare may deviate from user objectives or violate constraints [arxiv.org/abs/2510.05156, weight 0.54].

The synthesis document reports an attack success rate of 0.1 percent for VeriGuard's CRP+TEH pipeline and maps its evaluation to a ΔV2 deflection on an RBAC (role-based access control) matrix. The 0.1 percent figure is a source-document claim; the dig corroborated the framework and architecture but not that specific number, so this corpus records the number as reported, not independently verified. The structural point survives regardless: a success-rate headline on an agent × attack incidence matrix is a raw proportion, and the program's position is that it should be deflected against a margin-preserving null before it is treated as evidence.

## Rocq agents: proof state as feedback

The synthesis document's link 8 is an IDS (instrumentation and design spec) agent co-synthesizing implementation and proof in Rocq, reported at 7 of 7 KV-store specifications. The dig surfaced adjacent corroboration of the mechanism rather than the paper: a case study on trustworthy software project generation observes that Rocq exposes a concrete proof state when an attempt fails, giving the agent actionable feedback for repair, and reads this as empirical evidence for ITP-based verification loops [arxiv.org/html/2605.26017, weight 0.31, weak backing]. Automated guardrail policy generation and enforcement across HR and SecOps systems shows the policy-as-code pattern the synthesis maps onto [arxiv.org/html/2509.23994v1, weight 0.54]. The 7 of 7 figure is a source-document claim and is recorded as such.

## LEAP and the Lean-4 ecosystem

The synthesis document describes LEAP (arXiv:2606.03303) as a NeurIPS Lean prover agent structured as an AND-OR DAG with Lean-4 verified proofs, reported at 12 of 12 on Putnam problems. The dig did not surface the LEAP paper itself. What it surfaced is the surrounding ecosystem that makes such a claim checkable: LeanDojo extracts 122,517 theorems and 259,580 tactics from mathlib4 as training and evaluation data [leandojo.org, weight 0.76]; Lean-Prover is an autonomous Lean 4 theorem-proving agent that iteratively repairs LLM-drafted proofs against compiler diagnostics until they type-check, scoring 68 of 100 on a graded benchmark [github.com/Lean-Prover/lean-prover, weight 0.61]; CircuitProver distills proving traces into reusable verified lemma libraries [arxiv.org/abs/2607.27259, weight 0.54]; and the canonical Lean 4 text documents the proof language itself [leanprover.github.io, weight 0.83].

The synthesis document marks LEAP as a new-tool gap for the program: the program's curveball null swaps rows and columns of a matrix, but LEAP's solve matrix sits on a proof DAG where arbitrary swaps break acyclicity, so the program needs a cyclic-restricted, degree-preserving swap kernel. That is the only new null model the synthesis says the 22-link landscape requires.

## The shared architecture point

The synthesis document's cross-paper argument is that every external system's validate stage runs on a learned judge (LLM reviewer, reward model, rubric scorer) whose noise is unbounded, while the program's validate stage runs on a machine-checked artifact: Lean-4 proofs, Rocq proofs, Nagini-verified guardrails. The VeriGuard dig result is the strongest external confirmation that the machine-checked validate stage is implementable in practice, not just in principle. The program's claim is the conjunction: deterministic falsifier-bearing acceptance (the curveball null plus the dBc sonometer) plus machine-checked theory is the combination the 22 external works individually lack.

## Standing caveat

Machine-checked proof of an implementation is not the same as a matched null over an evaluation matrix. VeriGuard's verified guardrail bounds what the agent may do; it says nothing about whether the benchmark comparing it to a baseline was deflected against margin structure. The synthesis document treats these as two separate layers, and this corpus preserves that separation.
