# 03 The 9-D Primitive Basis and Detection Patterns

Scope: the 9 binary primitives the skill computes per refs/ doc, the detection regexes that produce them, the empirical cycle-0 validation, the near-constant filter, and what external practice says about the components. Source doc: yubi-OS/yubiOS skills/repo-refs-skill/SKILL.md.

## The basis

Per-corpus and replaceable, per the cycle-1 NSS re-map. The initial derivation covers the standard refs/ doc pattern observed in the corpus. Each file gets a coverage vector c in {0,1}^9 (source doc, "The 9-D Primitive Basis"):

| # | Primitive | Detection pattern |
|---|---|---|
| p0 | has_topic_anchor | First-line `# Title` plus frontmatter block (Date: / Source: / Scope: / Author:) |
| p1 | has_problem_statement | `## Problem Statement`, `## Question`, `## Scope`, `## 0. Background` |
| p2 | has_recommendation | `## Recommended Direction`, `## Decision`, `## Verdict`, `## Conclusion`, `## TL;DR`, `## Ship / Kill / Pause / Revise` |
| p3 | has_evidence | Run ID `\d{9,}`, commit `[0-9a-f]{7}`, PASS / FAIL / verified / measured, 3+ digit number with unit, `run #\d+` |
| p4 | has_cross_reference | `OMN-\d+`, `PR #\d+`, `ADR-\d+`, `refs/[\w-]+\.md`, `linear.app/...` |
| p5 | has_temporal_anchor | ISO-8601 timestamp, `-YYYY-MM-DD.md` filename suffix, date in frontmatter |
| p6 | has_verification_plan | `## Verification`, `## Test:`, `## Reproduction`, `## How to verify`, `Verified:`, falsifiable exit criteria |
| p7 | has_source_citation | `https?://`, `github.com/`, `arxiv.org/abs/`, `DOI:`, commit SHA, paper title in italics |
| p8 | has_priority_signal | `P0` through `P3`, high / medium / low, critical / blocker, likelihood x severity, ADR number |

The source doc ships the regexes as a Python PATTERNS dict; they are heuristic, and the cycle-1 NSS re-map flags which patterns produce false positives or negatives on the live corpus.

## Cycle-0 empirical validation

Measured on 5 representative yubiOS refs/ docs (bootc-upgrade-rollback, hyperspherical-harmonic-curve-2026-08-05, repo-history-skill-cycle-4-2026-08-07, arm64-path-a-b-board-status-2026-07-23, customer-roi-model-2026-07-25), the source doc reports: p0 5/5, p1 4/5, p2 4/5, p3 5/5, p4 5/5, p5 5/5, p6 2/5, p7 5/5, p8 2/5. Primitives at 100% coverage are near-constant: they dominate PCA without discriminating. The predicted survivors after the cycle-1 NSS re-map are 4 of 9: has_problem_statement, has_recommendation, has_verification_plan, has_priority_signal.

The changelog records that this prediction played out: cycle 2 re-derived the basis from 9-D to 7-D by dropping has_topic_anchor and has_temporal_anchor (both at 100% coverage in cycle 1, causing a 50.8% sparse-cell red flag), and primitive survival then stayed 7/7 stable across cycles 2 and 3, with the PC1+PC2 gate rising 0.4447 to 0.4604 to 0.4686 and sparse cells falling 66 to 57 to 49 (source doc, Changelog).

## External grounding for the components (weak, per jev noul)

The dig for this subtopic targeted regex-based binary feature extraction and PCA on binary data. Results were uniformly weak under the noul weighting, and they are reported as weak backing:

- PCA on a binary table is an established technique; a textbook chapter on "Analysis of a Binary Table" treats PCA as a method for describing and reducing binary indicator data (weight 0.02, weak, pca4ds.github.io/analysis-of-a-binary-table.html).
- PCA is computable via SVD of the data matrix rather than covariance eigendecomposition, the standard reduction the skill's Stage 1 uses when it computes top-2 right singular vectors (weight 0.02, weak, stats.stackexchange.com/questions/134282).
- Regex-based feature extraction over text chunks is a recognized pattern in text-classification pipelines: "regex represents a specific kind of text patterns that could be applied into information chunks to extract specific features" (weight 0.03, weak, ajol.info/index.php/jfas/article/download/165332/154792).
- Regex authoring and debugging tooling exists (weight 0.04, weak, regex101.com); treat tool references as weak.

No dig result rose above 0.5, so the external layer here is context only. The load-bearing content is the source doc's own pattern table and cycle-0 measurements, attributed to the source doc.

## Why regexes at all

The skill's design choice is that archival docs advertise their structure in markdown headings and citation strings, so 9 binary detectors per file give a cheap, reproducible coverage vector that feeds the Stage 1 weighted aggregation (weight = file byte length, normalized) and the S2 lift. The vector is valid when 0 <= c.sum() <= 9, one of the Stage 5 assertions (source doc, Verification).

## Near-constant filter

The rule: a primitive with over 10% and under 90% coverage survives; outside that band it is near-constant and drops from the basis. The source doc's verification checklist requires at least 3 of 9 primitives surviving the filter, and its red-flag list says a sparse-cell count above 50% of the corpus means the basis is wrong (too many near-constant primitives) and should be re-derived via NSS. Both the 9-D to 7-D re-derivation and the surviving-primitive audit are the cycle's first output, recorded in the fit file and the coverage map.
