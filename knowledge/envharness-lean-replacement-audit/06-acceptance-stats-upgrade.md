# the acceptance-statistics upgrade

Scope: the audit's highest-value replacement: swapping envharness's raw success-rate window means for the curveball null and dBc deflection gate, and why the literature backs the diagnosis.

## The code-confirmed finding

The 2026-08-25 synthesis finding (a between-arm comparison with no matched null) is confirmed in envharness's source, per the audit at HEAD pushed 2026-08-21. Both built-in objectives score recent traces as raw means over a trailing window: literally `sum(recent) / len(recent)` for DifficultyZone and RedTeam. There is no randomization, no margin preservation, and no deflection floor anywhere in the repo. The loop's ACCEPT decisions ride directly on these raw window means, so the mutation loop can accept a mutation whose apparent improvement is noise, and can never falsify the claim that an improvement happened.

This is a general weakness of single-run agent evaluation, not an envharness quirk. The 2026 ICLR blogposts track surveys the problem: AI evaluations often rely on single-run scores even though models, agents, and judges are inherently stochastic, making many reported differences unstable, and it catalogs the statistical tools (error bars, multiple comparison corrections) that evaluations omit [1] (weight 0.876). Two large surveys of LLM agent evaluation describe the field's evaluation objectives and methods and make no matched-null requirement of their own [2][3], which is consistent with the audit's read that raw means are the default practice. Practitioner protocols push slightly further: score traces, reliability, and cost, and combine trajectory scoring with bootstrap confidence intervals [4] (weight 0.571), while end-to-end agent evaluation is framed as measuring system behavior rather than final answers [5] (weight 0.871).

## What the matched null adds

The methodological name for what envharness lacks is a matched null: a comparison whose null distribution is controlled, so a difference between arms is measured against what noise alone would produce. Empirical work shows the cost of getting this wrong: an analysis of 134 papers found a misalignment between the matched and mismatched null hypothesis significance testing assumptions researchers use and what their designs support [6] (weight 0.771). The curveball construction fixes the problem at the design level: a fixed-margin null (section 8), reversibility and uniform stationarity (section 9), uniqueness of the construction (section 10), the MP/Narayana target (section 11), and dBc level laws (section 12), each proved, with the whole chain executed per-push by verify_claims.py CLAIMs 1 through 8.

## The proposed swap

The audit's Tier 2 recommendation is concrete: replace `ObjectiveSignal.score` with a curveball deflection (dV2z or dBc), giving the loop a falsifier-bearing gate whose null is itself proved canonical. The data plumbing needs no change to envharness's execution machinery: traces already reduce to a binary incidence matrix, episodes against skills or failure axes, which is exactly the corpus type the auditor ingests. The prototype follow-up (see the follow-ups doc) sizes the adapter at about 50 lines, gated at the +15.6 dBc floor.

Two properties distinguish this from simply adding confidence intervals:

1. The null is matched by construction (fixed margin), so the comparison is between the observed deflection and a proved distribution, not a bootstrap approximation.
2. The gate is falsifier-bearing: an ACCEPT is a claim about the deflection exceeding a floor, and the claim's failure mode (a mutation that is really noise) has a measured probability under the proved null.

## Why this is "strictly upgraded" and not just ported

The audit's component table marks the acceptance-statistics row "YES, superseded outright": the Lean proofs do not merely replicate what envharness computes, they replace the computation with a construction that has properties the original lacks. This is the only row of the audit where the formal side is strictly better than the thing it replaces, which is why the audit calls it the highest-value replacement.

## Sources

1. https://iclr-blogposts.github.io/2026/blog/2026/why-ai-evaluations-need-error-bars/ (weight 0.876)
2. https://arxiv.org/html/2507.21504v1 (weight 0.928)
3. https://arxiv.org/html/2503.16416v2 (weight 0.909)
4. https://mlflow.org/articles/benchmarking-ai-agent-performance/ (weight 0.571)
5. https://developer.nvidia.com/blog/mastering-agentic-techniques-ai-agent-evaluation/ (weight 0.871)
6. https://www.sciencedirect.com/science/article/pii/S0167923626001533 (weight 0.771)

The raw-mean finding, the curveball section numbering, the CLAIMs 1 through 8 execution, and the +15.6 dBc floor derive from the source audit of google-research/envharness at HEAD (2026-08-21) and its companion synthesis; repository identity confirmed at https://github.com/google-research/envharness (weight 0.848, collected in the 01 dig). A query-miss dictionary page (0.521), a Fisher-R1 agent-training paper marginally related to hypothesis testing (0.566), and an off-topic result caught by a filter failure (weight 0.024) were not used.
