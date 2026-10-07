# 06 - Prior-art cross-referencing practice

**Scope:** Prior-art cross-referencing practice behind the rubric: USPTO MPEP 904 analogous-art search, citing prior art with enough context to be findable, and the prior-art-search skill convention the source doc names.

## The USPTO MPEP 904 anchor

The source doc cites "USPTO MPEP section 904 analogous-art search practice" as 1 of the grounding sources for the Adjacent-problems axis. MPEP section 904 is the USPTO's own procedure for how an examiner searches prior art after understanding the invention disclosed and claimed in an application [https://www.uspto.gov/web/offices/pac/mpep/s904.html, weak backing, weight 0.46]. The current MPEP is the 9th Edition, Rev. 01.2024, published November 2024 [https://mpep.uspto.gov/RDMS/MPEP/current, weak backing, weight 0.47].

The operative subsection is MPEP 904.01(c), Analogous Arts: "Not only must the art be searched within which the invention claimed is classifiable, but also all analogous arts must be searched regardless of where the claimed invention is classifiable" [https://www.bitlaw.com/source/mpep/904-01-c.html, weak backing, weight 0.23]. The analogous-arts rule is the patent-law formalization of the adjacent-problems axis's core demand: do not search (or map) only the neighborhood you already occupy; search the neighboring problem families whose structure makes their solutions applicable to yours.

The doctrine has post-KSR contours: the Federal Circuit's treatment of analogous art after KSR v. Teleflex balances breadth against claim-scope distortion, and practitioners treat "evolving analogous art doctrine" as a live design space rather than a settled rule [https://patentlyo.com/patent/2024/03/analogous-doctrine-insights.html, weak backing, weight 0.15]. For the yubiOS axis this is a useful parallel, not an authority: the axis borrows the *search discipline* (look beyond your own classification), not patent-law conclusions.

## Why the axis borrows patent practice

Patent examination solves the same structural problem the rubric does: an inventor (or ADR author) believes a design is new and correct, and an independent process must verify that belief against the full space of known solutions. MPEP 904's answer is a search protocol driven by problem structure, not by keyword proximity. The axis's dimension 4 (prior-art citations) and dimension 5 (rejection criteria) are the documentation analog: the file must show which prior solutions it found and why each lost.

MPEP itself is the USPTO's manual for patent attorneys, agents, and examiners [https://en.wikipedia.org/wiki/Manual_of_Patent_Examining_Procedure, weak backing, weight 0.16]. The generic prior-art concept, "state of the art or background art used to determine patentability," is defined on the novelty axis [https://en.wikipedia.org/wiki/Prior_art, weak backing, weight 0.12]. Note the distinction this reinforces: prior art is about what came before, not about which competing design is better; the axis keeps the 2 separate (doc 05, distinction 2).

## Citing prior art with context

The rubric's score-2 condition for dimension 4 is "every alternative has at least 1 citation" and the guideline is "cite prior art with context: a citation without 'this is the prior art for component X' is a name-drop, not a cross-reference." Concretely, a well-formed prior-art reference in a yubiOS file has 3 parts:

1. The locator: paper, RFC, vendor doc, or project, with a resolvable link (dimension 10).
2. The anchor: which component, alternative, or claim it is prior art FOR.
3. The delta: what the file does differently, or (for rejected alternatives) which constraint the prior art violated.

A reference with only the locator scores 1; with all 3 parts it scores 2. This is the same structure patent search requires: an art reference is useful to an examiner only when tied to the claimed features it anticipates.

## The prior-art-search skill convention

The source doc's composition table names `prior-art-search` as the convention provider: "provides the survey/prior-art cross-reference convention; nss-adjacent-problems scores files against the prior-art channel." The direction is bidirectional. The prior-art-search skill produces the survey (what has been tried before, with sources); the adjacent-problems axis scores whether a given file's own prior-art section meets the findability bar (locator + anchor + delta) and whether the alternatives it implies are actually enumerated and rejected with reasons.

In a cycle-13 patch this shows up as the `delta.prior_art` contribution to the lens: a file whose dig-backed prior-art coverage moves from name-drops to anchored citations closes dim 4 from 0 or 1 to 2, and the lens records the closure.

## Boundary with the patent analogy

The axis is not patent law. It borrows the search discipline and the citation-with-context norm; it does not import legal thresholds (obviousness, anticipation) or legal consequences. A yubiOS file can be fully Operational (level 3) with 3 alternatives, trade-offs, and rejections and no patent-grade claim chart. The rubric's ceiling is design-decision re-derivability, not legal defensibility.
