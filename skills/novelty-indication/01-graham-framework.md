# 01. The Graham v. John Deere Framework

**Scope.** The obviousness framework behind this skill: 35 U.S.C. 103, the four Graham inquiries codified in MPEP 2141, and how they translate into engineering judgment about whether an idea is worth expanding.

**Ground spine.** yubi-OS/yubiOS skills/novelty-indication/SKILL.md (source doc). The source doc adapts the framework's Step 5 directly from this material; this doc explicates what the framework actually says so the adaptation is grounded, not vibes.

## What 35 U.S.C. 103 says

Section 103 conditions patentability on non-obviousness: a claimed invention is unpatentable if the differences between the claimed subject matter and the prior art would have been obvious to a person having ordinary skill in the art at the time the invention was made. The USPTO's Examination Guidelines for this determination are codified in MPEP 2141, "Examination Guidelines for Determining Obviousness Under 35 U.S.C. 103" (https://www.uspto.gov/web/offices/pac/mpep/s2141.html, jev weight 0.95). The full Manual of Patent Examining Procedure is served by the USPTO itself at https://www.uspto.gov/web/offices/pac/mpep/index.html (jev weight 0.95) and at https://mpep.uspto.gov/RDMS/MPEP/current (jev weight 0.94), so the primary text of every section referenced here is directly checkable.

## The four Graham inquiries

Graham v. John Deere Co., 383 U.S. 1 (1966), established the inquiry framework that 103 examinations still follow. The decision text is available through the Justia U.S. Supreme Court center (https://supreme.justia.com/cases/federal/us/383/1/, jev weight 0.49, weak backing below the 0.5 line; the framework itself is restated in the high-weight MPEP 2141, so the MPEP citation carries the claim). The four inquiries are:

1. **Scope and content of the prior art.** What has been done in the exact area, and in analogous areas? In engineering terms: what products, projects, papers, and internal decisions already exist?
2. **Differences between the claimed invention and the prior art.** What is actually new, element by element? This is where the source doc's layer split (mechanism / trigger / policy) does its work: the "claim" is the combination, and the differences are computed per layer.
3. **Level of ordinary skill in the pertinent art.** Could a skilled practitioner combine the known elements? See doc 06 for the PHOSITA construct.
4. **Secondary considerations.** Long-felt need, failure of others, unexpected results. The source doc restricts this to cases where you have evidence; doc 07 covers why.

MPEP 2141 groups inquiries 1 through 3 as the factual basis (the "A, B, C" Graham factors) and keeps secondary considerations as "D" (https://www.uspto.gov/web/offices/pac/mpep/s2141.html, jev weight 0.95).

## Why an engineering skill borrows patent law

The value of the framework for engineering judgment is not the law. It is the discipline:

- The prior-art scope inquiry forces a real search before a verdict, and the source doc orders internal prior art first (doc 04).
- The differences inquiry forces per-layer analysis instead of a single gestalt "is this new?" (doc 03).
- The ordinary-skill inquiry forces the "could a competent teammate combine this?" question, which is the honest rejection of most premature novelty claims.
- The secondary-considerations inquiry gives BORDERLINE verdicts a real escape valve that requires evidence, not enthusiasm.

The source doc's bias statement follows from the framework's structure: the default is "probably not novel" because the burden in 103 analysis is on the party asserting the difference. A verdict of NOVEL must point at the layer, the prior art that does not cover it, and the reason a skilled practitioner could not trivially combine.

## What the framework does not do

This skill is engineering judgment, not legal opinion. A verdict under this skill is not patentability counsel, and the source doc says so explicitly: real patent filing requires a patent attorney and a real prior-art search. The Graham factors are used here as a checklist for honest novelty thinking, not as a substitute for prosecution. The USPTO's own guidance for actual patent applicants is the patent process overview (https://www.uspto.gov/patents/basics/patent-process-overview, jev weight 0.97), which is outside this skill's scope.

## Checklist tie-in

The source doc's verification checklist requires "Graham factors A, B, C addressed (D = secondary considerations only if evidence)". That checklist maps 1:1 onto the four inquiries above, which is the point: the output document's Graham factor section is the framework, restated in the verdict template.

## Weak sources in this area

Aggregator treatments of the Graham factors exist (for example https://patentlawyer.io/obviousness-analysis-framework-graham-factors/, jev weight 0.14, and https://www.bitlaw.com/source/mpep/2141.html, jev weight 0.28). Both are labeled weak; neither is cited for any claim above. When the dig returns only such sources for a claim, the claim gets deleted or grounded on the MPEP text instead.
