# 02 - The 0-5 coverage rubric

**Scope:** The 0-5 Adjacent-problems coverage levels, from Absent through Exemplary, and what each level requires a file to evidence about its relationship map.

## The level scale

The source doc (`yubi-OS/yubiOS skills/nss-adjacent-problems/SKILL.md`) defines 6 levels. Score by the highest level whose relationship map is *actually evidenced* in the file; do not award a level for intent.

| Level | Label | What the file demonstrates |
|---|---|---|
| 0 | Absent | No mention of related problems, alternatives, or prior art; the file presents its solution as the only solution. |
| 1 | Nominal | Mentions 1 or 2 related names (a sibling tool, an RFC number) without defining the relationship type or trade-off. |
| 2 | Basic | Covers at least 2 adjacent problems or alternative solutions with usable comparison (when each applies, what each replaces). Handles the happy path but not the problem-family boundaries. |
| 3 | Operational | Covers the full problem family the focal problem sits in: at least 3 alternative solutions with trade-offs, prior-art citations, and explicit "why not" reasoning for each rejected alternative. A reader can re-derive the design decision. |
| 4 | Production-grade | Covers the problem family, the alternative solutions, the prior-art citations, the rejection criteria, AND the boundary conditions under which the choice would flip. RFC/Survey cross-references are present and accurate. |
| 5 | Exemplary | Compact reusable problem-family model with explicit relation types (intersection, analogy, abstraction, substitution), decision tree, anti-patterns, and machine-readable alternative-solution matrix. |

## What jumps between levels

The levels are not evenly spaced in effort. Level 1 to 2 requires usable comparison: for each named alternative, when it applies and what it replaces. Level 2 to 3 requires the problem family itself to be named and at least 3 alternatives carried with "why not" reasoning; this is the level at which a reader can *re-derive* the design decision, which the source doc treats as the operational bar. Level 3 to 4 adds reversibility: explicit conditions under which the choice would flip. Level 4 to 5 adds structure: a relation-typed, machine-readable model.

This staircase mirrors rubric-design practice in assessment literature. A rubric is "a scoring guide used to evaluate the quality of students' constructed responses," a set of criteria for grading work (weak backing, weight 0.09) [https://en.wikipedia.org/wiki/Rubric_(academic)]. Assessment guidance emphasizes that each level must be anchored in observable criteria rather than adjectives: the NIU Center for Innovative Teaching and Learning guide describes building rubrics from criteria plus level descriptions, and notes that holistic levels without criteria drift (weak backing, weight 0.38) [https://www.niu.edu/citl/resources/guides/instructional-guide/rubrics-for-assessment.shtml]. A Frontiers in Education article argues that choosing the *right criteria* is the key property of an effective rubric, which the source doc operationalizes as the 10 dimensions in doc 03 (weak backing, weight 0.26) [https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2018.00022/full].

## Breadth AND correctness

The rubric's governing rule is that coverage is measured on 2 axes at once. A file that names 20 related tools but classifies none of them and cites nothing is breadth without correctness: it lands at level 1 (Nominal) because none of the relationships are defined. A file that maps 3 alternatives precisely with citations and rejection criteria is correctness-forward and can reach level 3 even with a small set.

Rubric-design literature makes the same distinction between coverage of criteria and quality of descriptors: the ERIC digest on scoring rubrics (weak backing, weight 0.21) [https://files.eric.ed.gov/fulltext/ED446111.pdf] and the NCSU teaching-resources guide (weak backing, weight 0.21) [https://teaching-resources.delta.ncsu.edu/rubric_best-practices-examples-templates/] both treat well-written level descriptors, not the number of rows, as the quality signal.

## Five-level precedent

The choice of 6 levels (0 through 5) is internally motivated: level 0 exists so that "presents its solution as the only solution" is a scoreable state, not an absence of scoring. Five-point anchored scales are well precedented in measurement instruments; the EQ-5D-5L instrument, for example, validated a five-level version of a 3-level scale and showed the finer levels improve discrimination (weak backing, weight 0.50, and note the topic is health measurement, cited only for the level-scale precedent) [https://pubmed.ncbi.nlm.nih.gov/31146707].

## How the rubric is used in the sweep

In the cycle-13 sweep the level feeds the lens-format patch (doc 07): each per-file lens records the 10 dimension scores and the total in `parameters.dim_scores` and `parameters.total`, and the delta records `adj_gaps_before`, `adj_gaps_after`, `dim_closed`, `family_named`, and `alternatives_count`. The 0-5 level label is the human-readable summary; the 20-point dimension total (doc 03) is the precise measure. The source doc requires binary per-dimension scoring with no fractional scores, so the level is always derivable from the dimension vector.
