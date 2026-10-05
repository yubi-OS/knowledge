# 04 - The RSI loop structure: gap-map, hypothesis, edit, re-map, fixpoint

Scope: the loop skeleton rsi-phi-skill inherits from recursive-self-improvement, the boundedness discipline, and the gap-mapping methodology it borrowed from evidence-synthesis practice.

## The loop as persistent self-change

The plain-language definition the family works from: recursive self-improvement is a loop in which a system makes a persistent change that improves its future performance and its ability to produce subsequent improvements [1], weight 0.6156. The word persistent does the load-bearing work: the loop must edit an artifact on disk, not merely reason better in the current window.

The recursion itself is the ordinary kind: a recursive step, a set of rules that reduces all successive cases toward the base case [2], weight 0.7931. In the RSI family the base case is the fixpoint: a cycle after which no new gaps appear, all old gaps are closed, and no new anti-patterns are introduced.

## Boundedness is the point, not a limitation

The academic framing separates bounded self-refinement, which is convergent, evaluable, and already industrial practice, from open-ended recursive self-improvement, which remains bounded by grounding requirements, collapse dynamics, and compute constraints on every side [3], weight 0.7831, with the abstract version of the same taxonomy at weight 0.7185 [4]. The rsi-phi-skill sits firmly in the bounded column: its default cycle cap is 3, and its fixpoint rule terminates the loop when the corpus stops changing. A practitioner implementation of skill-level RSI describes the same discipline as a research lab loop: every loop is an experiment whose results are kept and built on, including a record of dead ends, so the loop never re-tests what does not work [5], weight 0.3307 (weak backing).

Wikipedia's article on recursive self-improvement covers the stronger AGI-adjacent sense of the term, hypothetical self-rewriting causing capability explosion [6], weight 0.1950 (weak backing). That is not the sense used by the yubiOS skills, which improve documents, not weights; the distinction is worth recording so the corpus is not misread.

## Gap-mapping as a named methodology

The gap-map step that opens each cycle is borrowed from evidence-synthesis methodology. Evidence and gap maps are built as a matrix, in the Campbell guidance: cells show how studies cover combinations of interventions and outcomes, so full cells reveal evidence concentrations and empty cells reveal gaps [7], weight 0.8604. Methodology work on mapping reviews and evidence maps frames them as synthesis approaches addressing broad research questions, describing a bigger picture rather than answering a narrow one [8], weight 0.8491, with the ResearchGate mirror at weight 0.6802 [9]. Evidence gap maps help decision-makers identify leverage points and unintended consequences by visualizing connections between factors [8].

The yubiOS adaptation replaces studies with skill-file coverage cells: negative-skill-space scores each corpus item across 12 axes (audience, inputs, outputs, mode, assumption set, adjacent problems, failure modes, lifecycle, composition, knowledge sources, calibration, recursion), and sparse cells become the edit targets for the next cycle [10], weight 0.1290 (weak backing; the sweep is documented in the curve-guided-rsi skill).

## The per-cycle pipeline

Concretely, each cycle of rsi-phi-skill runs 5 steps [11], weight 0.4717 (weak backing):

1. Gap-map via the negative-skill-space 12-axis sweep.
2. Hypothesis proposal by a parallel-deep-research subagent, dispatched with the gap-map and t = i / N.
3. Edit: the human-approved hypothesis applied to the corpus.
4. Re-map: recompute coverage vectors, project to S^2, fit the curve, compute per-item residuals.
5. Fixpoint rule: terminate if no new gaps, old gaps closed, no new anti-patterns; otherwise cycle + 1 with a cap of 3.

Step 3 is where boundedness is enforced in practice: the hypothesis is human-approved before it touches the corpus, which keeps the loop evaluable in the sense of the bounded self-refinement taxonomy [3].

## Sources

1. Recursive Self-Improvement, philschmid.de. https://www.philschmid.de/recursive-self-improvement (weight 0.6156)
2. Recursion, Wikipedia. https://en.wikipedia.org/wiki/Recursion (weight 0.7931)
3. Recursive Self-Improvement in AI: From Bounded Self-Refinement to Open-Ended RSI, arXiv HTML. https://arxiv.org/html/2607.07663 (weight 0.7831)
4. Same paper, abstract page. https://arxiv.org/abs/2607.07663 (weight 0.7185)
5. Skill-RSI, GitHub. https://github.com/justinwetch/Skill-RSI (weight 0.3307, weak)
6. Recursive self-improvement, Wikipedia. https://en.wikipedia.org/wiki/Recursive_self-improvement (weight 0.1950, weak)
7. Guidance for producing a Campbell evidence and gap map. https://onlinelibrary.wiley.com/pb-assets/Campbell%20EGM%20guidance%20-%20Consultation-1593530394570.pdf (weight 0.8604)
8. Methodology for mapping reviews, evidence maps, and gap maps, Cambridge. https://www.cambridge.org/core/services/aop-cambridge-core/content/view/9C0C51FF65DC0D8D52CB616B08B0F986/S1759287925000250a.pdf/methodology-for-mapping-reviews-evidence-maps-and-gap-maps.pdf (weight 0.8491)
9. Same methodology, ResearchGate. https://www.researchgate.net/publication/392730786_Methodology_for_mapping_reviews_evidence_maps_and_gap_maps (weight 0.6802)
10. curve-guided-rsi skill listing, SkillsMP. https://skillsmp.com/creators/yubi-os/yubios/skills-curve-guided-rsi (weight 0.1290, weak)
11. rsi-phi-skill SKILL.md, yubi-OS/yubiOS. https://github.com/yubi-OS/yubiOS/blob/main/skills/rsi-phi-skill/SKILL.md (weight 0.4717, weak)
