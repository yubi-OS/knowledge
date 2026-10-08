# 02 - The 9-D Binary Primitive Basis

Scope: the 9-D primitive basis for deep-research reports, its regex pattern definitions, the weighted section aggregation, and the 0.5 binarization threshold that turns coverage into a binary vector.

This corpus explicates the skill documented at yubi-OS/yubiOS skills/single-action-curve-rsi/SKILL.md (source doc). The 9-D basis is the default coordinate system for the atom: it is derived for the v1 experiment on deep-research reports and is explicitly replaceable per corpus, in the same way curve-guided-rsi-self defines per-corpus bases (source doc).

## The 9 primitives

The source doc defines 9 primitives, each with a pattern set where any single match scores 1 (source doc):

| # | Primitive | Patterns (any one match gives 1) |
|---|---|---|
| p0 | has_purpose | TL;DR, Summary, Problem Statement, Goal, Intent |
| p1 | has_evidence | a number with 3 or more digits, verified, PASS, measured, Probability: high |
| p2 | has_correction | V\d+ failure, was wrong, symptom, not the cause, the actual root cause |
| p3 | has_constraint | Must, Never, Cannot, ADR-\d+, Don't, ban |
| p4 | has_pushback | PENDING, no release tag, limitations, not yet, about 3 weeks |
| p5 | has_test | V52-fix-A, Test:, Verified, verify, PASS, Verification: |
| p6 | has_source | github.com/, https?://, PR #\d+, issue #\d+, commit sha |
| p7 | has_recommendation | fix-[A-Z], surgical fix, borrowable, V52 fix, ordered next steps |
| p8 | has_priority | P0/P1/P2, high/medium/low, Probability: (high/medium/low), critical |

The set encodes what a completed analysis artifact should contain: a stated purpose, measured evidence, honest corrections, recorded constraints, acknowledged limits, a verification path, traceable sources, actionable recommendations, and priority labels. Structured document understanding systems classify documents the same way, by extracting elements and assigning them element types before any analysis runs (Azure Content Understanding document elements, weight 0.89, https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/document/elements). The pattern-match approach is the cheap end of that spectrum: no model call, just regex over section text (source doc).

## Why a basis of binary features

The atom needs a vector it can do linear algebra on. Binary feature vectors are the standard input representation for categorical document properties, and PCA over binary data has a dedicated literature: iterated SVD approaches recover the latent structure of binary tables (Columbia CSDA paper on PCA of binary data by iterated SVD, weight 0.55, https://sites.stat.columbia.edu/gelman/stuff_for_blog/csda.pdf). Principal component analysis on the coverage matrix is what turns a 9-bit descriptor into a 2-D plane position (Principal component analysis, weight 0.63, https://en.wikipedia.org/wiki/Principal_component_analysis). The choice of binary over count-based features follows correspondence-analysis practice for indicator tables, where the row profile is what carries the signal (weak backing: Correspondence analysis, weight 0.46, https://en.wikipedia.org/wiki/Correspondence_analysis).

Feature extraction over document structure, rather than over raw tokens, is the established approach when the object of study is the document's organization itself (Springer chapter on feature extraction for document structure analysis, weight 0.61, https://link.springer.com/chapter/10.1007/978-3-032-04197-5_8). The 9 primitives follow that logic: they measure the report's shape (does it have a purpose statement, a correction section, a verification plan) rather than its content.

## Weighted section aggregation

The source doc computes file-level coverage as a weighted aggregate over sections, with weight equal to section byte length normalized, and thresholds at 0.5 to produce the binary vector c in {0,1}^9 (source doc). This preserves section-level signal: a 40-line verification section counts more than a 3-line mention of the word verify inside a code block.

The per-section coverage matrix M in {0,1}^(N x 9), where N is the section count, is the input to the S2 lift in doc 03. Section-level segmentation before feature extraction is the standard pipeline in document analysis systems, which segment into structural elements first and classify second (Azure Content Understanding, weight 0.89, https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/document/elements; markitdown, a Microsoft tool that converts documents to structured markdown preserving section boundaries, weight 0.61, https://github.com/microsoft/markitdown).

Classification vocabularies like the 9 primitives are phenomenon-based: each primitive names a phenomenon (evidence, correction, verification) that can appear in many surface forms (IEKO on phenomenon-based classification, weight 0.62, https://www.isko.org/cyclo/phenomenon.htm). That is why the pattern sets are deliberately redundant: has_test matches 6 distinct surface patterns.

## Replaceability

The source doc is explicit that the basis is per-corpus replaceable, analogous to the per-corpus bases in curve-guided-rsi-self (source doc). The changelog lists auto-derivation of a per-corpus basis for non-deep-research files as a pending v2 item (source doc). Until that lands, applying the atom to a non-deep-research corpus means hand-deriving an analogue basis with the same shape: 9 binary primitives whose patterns any single match can satisfy, aggregated per section, thresholded at 0.5.
