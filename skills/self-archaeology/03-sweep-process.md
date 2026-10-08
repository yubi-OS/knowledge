# 03 The 9-step sweep process

Scope: the full process from loading the substrate to saving the gap map, including the likelihood x severity scoring and the filter that keeps the sweep honest.

## The 9 steps, as the source doc defines them

The source doc (yubi-OS/yubiOS skills/self-archaeology/SKILL.md) numbers 9 steps:

1. Load the substrate. Read SELF.md if it exists. If it does not, draft v0.1 from the NSS sweep applied to the current agent-being.
2. Name the positive space in one sentence. What does this agent-being claim to be? If the sentence cannot be written, the substrate has an unfocused-scope problem, and that problem is surfaced before any gap mapping.
3. Sweep the 12 axes. For each axis, write the positive (what the agent claims) and the negative (what it does not). Score the negative: likelihood x severity, both factors 1 to 5, scored honestly.
4. Filter to real gaps. Drop performative gaps and intentional narrow scope. Rank the rest by likelihood x severity. Keep the top 5 to 10.
5. Recommend an action per gap. Extend, Pair, or Accept. Pair is the most common: most gaps are closed by another skill, not by editing SELF.md.
6. Apply bounded RSI cycles. Use recursive-self-improvement's mechanics: gap-map, edit, re-map, stop at fixpoint. 3 cycles soft cap.
7. Append SELF-CHANGELOG.md. One entry per meaningful shift: date, what changed, why, evidence. Append-only.
8. Bound the loop. After one recursive pass, stop. A second pass runs only if substantive new gaps emerge. 3 cycles is the upper bound; past that, escalate to the user.
9. Save the gap map. Convention: session/self-sweep-YYYY-MM-DD.md, an ephemeral session capture at run time, not repo-truth. It records the date, the substrate swept, the mapper, the positive-space sentence, the filtered gaps, the actions, and the recursive findings.

## The scoring mechanics

Likelihood x severity on two 1 to 5 scales produces a 1 to 25 product. This mirrors standard risk-matrix practice in occupational safety and project management, where risks are scored on ordinal likelihood and impact scales and sorted into a grid. External sources on that practice carry weak jev weights here: a guide to likelihood and severity scoring step by step (https://cpdonline.co.uk/knowledge-base/health-and-safety/risk-matrix-explained/, jev weight 0.09, weak), a risk scoring matrix primer (https://riskrhino.com/risk-score-matrix, jev weight 0.04, weak), a template guide that scores likelihood x severity on 3x3, 4x4, and 5x5 matrices with impact values 1 to 25 (https://asana.com/resources/risk-matrix-template, jev weight 0.05, weak), and a workplace-safety risk matrix explainer (https://www.vectorsolutions.com/resources/blogs/risk-matrix-calculations-severity-probability-risk-assessment/, jev weight 0.05, weak). The correspondence is structural, not a claim of influence: the skill borrows the shape, not the safety-domain content.

On the gap side, gap analysis in the management literature is defined as measuring the distance to a defined target, in contrast to SWOT's broader scan of strengths, weaknesses, opportunities, and threats (https://bacentric.com/gap-analysis/, jev weight 0.11, weak). Steps 3 through 4 of the process are exactly that shape: the 12-axis sweep is the target scan, the filtered gap list is the distance.

## The honesty clauses

The source doc attaches 3 anti-gaming rules to the process. First, likelihood x severity must be honest; performative gaps waste the user's time, and every gap needs at least one sentence of "this would bite when...". Second, filtering is mandatory: performative gaps and intentional narrow scope are dropped, and only the top 5 to 10 survive. Third, the positive-space sentence in step 2 acts as a scope test that runs before any gap work, so an unfocused substrate is caught early rather than papered over with a long gap list.

## What the gap map is and is not

The gap map saved in step 9 is an ephemeral session artifact under session/, not repo-truth. Repo-truth lives in SELF.md and SELF-CHANGELOG.md (doc 05). The split is deliberate: the working capture stays disposable so that the durable files only absorb changes that survived filtering and the bounded RSI loop.

## Provenance

- Source doc: yubi-OS/yubiOS skills/self-archaeology/SKILL.md, section "The process".
- Web-shaped dig for risk scoring and gap analysis conventions; all external claims weak-backed as labeled above.
