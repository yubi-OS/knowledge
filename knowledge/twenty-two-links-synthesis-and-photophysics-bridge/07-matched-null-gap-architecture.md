# 07 The matched-null gap and the observe-diagnose-write-validate architecture

Scope: the synthesis document's two cross-paper claims: all 22 external works lack a matched null, and their control flow is the same as the program's curve-guided-rsi-self loop.

## The matched-null gap, stated precisely

The synthesis document's central finding is that across 21 agentic-AI papers plus the EnvHarness wrapper, every headline number is a raw mean with standard deviation, a win rate, or an ablation delta, and none is a deflection against a margin-preserving randomization. Each paper's latent data shape is a method × task success matrix, a binary incidence table, which is exactly the program's native corpus type. Each paper's between-arm comparison is a fixed-margin-null comparison in disguise.

The statistical grounding is available in standard tooling. scikit-learn's permutation_test_score generates a null distribution by scoring a classifier on 1000 permutations of dataset labels [scikit-learn.org/stable, weight 0.85], and the permutation-test tradition for classifier comparison goes back decades [dl.acm.org/doi/10.5555/1756006.1859913, weight 0.84]. But a label permutation preserves neither the row margins nor the column margins of a two-way incidence table: it is a null over relabeled data, not a null over restructured incidence. The program's curveball null is a swap-based randomization that holds both margins fixed, so the only thing that can vary is which row pairs with which column. A deflection against that null measures structure beyond marginal rates, which is what a method × task matrix claims to carry.

The nearest external work in spirit is the robust-certification line: Noisy but Valid formulates LLM reliability assessment as a statistical hypothesis test whose null hypothesis is that the failure rate exceeds a tolerance, and handles judge imperfection explicitly [arxiv.org/abs/2601.20913, weight 0.76; openreview.net/forum?id=hEhxreaLdU, weight 0.87]. That work certifies a scalar against a threshold; it does not deflect an incidence matrix against margin structure. The synthesis document positions the curveball null as the missing layer rather than a replacement for certification.

## The architecture mapping

The synthesis document observes a consistent control flow across the 22 external works: observe, diagnose, write, validate. It maps each stage onto the program's own machinery:

1. observe (rollouts or audit) corresponds to the gap-map stage of recursive-self-improvement.
2. diagnose (an LLM naming a flaw) corresponds to single-action-curve-rsi choosing the next geodesic target.
3. write (a Python rule, a SkillRepo entry, a paper draft) corresponds to the lens-format patch emitted by curve-compass-skill.
4. validate (rollout acceptance) corresponds to the curveball fixed-margin null plus the dBc deflection sonometer.

The document attributes the program's throughput differential to two things the papers lack: a deterministic falsifier-bearing acceptance gate (versus learned judges with unbounded noise), and a machine-checked theory layer (Lean-4, Rocq, Nagini) that none of the 22 carries end to end. The formal-methods dig in this corpus (doc 03) shows the second layer exists externally in fragments: VeriGuard's verified guardrail is real [arxiv.org/html/2510.05156v1, weight 0.92], and the Lean ecosystem supplies verification substrate [leandojo.org, weight 0.76]. The synthesis document's claim is about conjunction, not novelty of either part alone.

## Why the matrix claim is checkable

A reader can verify the incidence-matrix premise without trusting the synthesis document: every benchmark surfaced in this corpus, from InvestorBench to the rubric-RL testbed to the red-team matrices, reports success counts over a method × task grid [aclanthology.org/2025.acl-long.126, weight 0.83; arxiv.org/abs/2606.04923, weight 0.69]. The contested part is not the shape but the consequence: whether a margin-preserving deflection would change any published conclusion. The synthesis document does not claim it would; it claims the deflection has never been run, and lists the specific nulls needed (one column-constrained variant for Synapse, one acyclicity-restricted kernel for LEAP) as the only new machinery required.

## Standing caveat

The claim "every one of the 22 external works has a missing matched-null" is a claim about 22 specific papers read by 22 parallel subagents in the source session, and this corpus inherits it from the synthesis document rather than re-verifying each paper. The ACUTE link is explicitly graded partial (1000 permutation resamples, not margin-preserving), which is the document being careful rather than uniform. Any future revision of this corpus should re-grade that one link first if new evidence arrives.
