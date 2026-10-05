# 08 Program machinery placement and the two new tools

Scope: where each piece of the corpus-audit program's machinery lands across the 22-link landscape, and the two tools shipped alongside the synthesis: tautology-discerner and spectral-decomposer.

## The placement map

The synthesis document assigns program machinery to external evaluation structures as follows.

The curveball fixed-margin null (Lean section 8) applies to every between-arm comparison in the landscape: baselines, ablations, leaderboards. Its justification rests on two proofs cited by the document: reversibility with uniform stationarity (section 9), which answers why this null and no other, and uniqueness of the canonical null (section 10), which answers whether a different null could do the same job. The MP / Narayana moments (section 11) serve three specific external structures: date-stratified fibre for LEAF, column-constrained fibre for Synapse, and point-1-Wishart moments for a moment-based comparison. The dBc level laws (section 12) define the report unit: every published percentage becomes a deflection in dBc above the vacuum.

The heat-kernel defocus E_l(t) = E_l(0) exp(-2l(l+1)t) supplies persistence curves over training step, round, layer depth, or forecast horizon, replacing what the document calls the "8 to 10 iterations saturates" hand-wave with a measurable decay. The caustic and rank-collapse detector targets homogenization failures: MARS reflective memory, SkillOS curator output, and ScholarPeer review scores. The Moebius lens powering with selection-null control maps to PI-Hunter mutation operators, Nexus macro/micro resolution, and Synapse arbitration. The injective-mapping ladder maps to PaperOrchestra's rubric union and ScholarPeer's submission set.

The spectral-methods literature independently validates the persistence-style statistics the program uses: diffusion distances and effective resistance computed on spectral representations detect topology that raw distances miss, even in noisy high-dimensional data [proceedings.neurips.cc/paper_files/paper/2024, weight 0.85; arxiv.org/html/2311.03087v3, weight 0.53], and the algebraic machinery of persistence modules has a formal distributed-computation treatment [link.springer.com/article/10.1007/s00454-023-00549-2, weight 0.90].

## tautology-discerner

The first tool classifies natural-language statements into four verdicts: Tautology, Falsifiable, Paradox, Undecidable, and emits the refuter rule the classifier would use. The Undecidable bucket restates the program's admission rule for sentences: a sentence carrying no explicit commitment is refused, not guessed at. The selftest's fixed-refuter-bag invariance check is the language-side analogue of the Lean section 8 proof that margin-preserving trades preserve row and column sums. The document's framing: no statistic without a matched null, extended to no belief without a refuter.

## spectral-decomposer

The second tool generates ranked lens-format experiment candidates, each a measurable experiment with hypothesis, method, parameters, delta, verdict, score, and caveat. The delta is computed against the curveball vacuum, and every candidate carries a curveball-control arm so a yes verdict is only as good as the control's silence. Output drops directly into a curve-guided-rsi cycle as a cycle-NN-lens artifact.

The adjacent literature independently converges on this design discipline. HypoGeniC generates hypotheses data-driven from observations [github.com/ChicagoHAI/hypothesis-generation, weight 0.82]. A 2025 framework for automated hypothesis validation requires each sub-hypothesis to be falsifiable with clear null and alternative definitions before an experiment agent executes it [arxiv.org/pdf/2502.09858, weight 0.88]. A survey of LLM-based scientific hypothesis generation and validation maps the field [arxiv.org/abs/2505.04651, weight 0.73]. The synthesis document's distinctive move is that falsifiability is enforced by construction: the candidate pool's deltas are computed against the matched null before any experiment runs, rather than nulls being bolted on at analysis time.

## Standing caveat

The placement map is a proposal about where statistics should be computed, not a claim that any of the 22 links has been re-analyzed. The two tools are demonstrated by their selftests per the synthesis document; their first real cycle-34 target (the 2286 x 9 is-this-x corpus) is listed in the document's open follow-ups, and this corpus carries it as open work.
