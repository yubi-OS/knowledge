# 03 Docs-as-code cross-references and integrity

Source doc: yubi-OS/yubiOS skills/nss-knowledge-recursion/SKILL.md (the ground source). Scope: docs_as_code_xrefs and integrity_freshness axes, xrefcheck, link-rot CI, and the DOCER research on outdated code references.

## What the rubric scores

Docs_as_code_xrefs (0-3, source doc): 0 is no links to related repo material; 1 is fragile paths, "see above", and copied content; 2 is internal links that resolve and point to relevant sections; 3 is relative or repo-native links, named anchors, source-of-truth references, and build/CI validation. Integrity_freshness (0-3, source doc): 0 is broken links, orphan references, and stale citations; 2 is references that build and links checked periodically; 3 is CI validating unresolved citations, duplicate keys, missing bibliography entries, broken or ambiguous anchors, stale versions, and orphaned references.

The integrity gate requires axis 12 at 2 or higher for production documentation and normative specifications (source doc). The ground source is blunt about the alternative: "Stale references, contradictions, and untested claims can increase apparent coverage while reducing trustworthiness. CI gates (xrefcheck, link-rot checks, stale-reference scans) are required for the integrity axis to score 2+" (source doc, anti-patterns).

## xrefcheck

xrefcheck is a tool for verifying local and external references in a repository's documentation, designed to be quick to set up and to run in a CI pipeline [1] (weight 0.46, weak). Running `xrefcheck` from a repository root finds all broken links; `xrefcheck --verbose` additionally lists all links and anchors found [2] (weight 0.69). The tool is maintained under serokell/xrefcheck and checks cross-references in repository documents [3] (weight 0.37, weak); its README positions it against alternatives like markdown-link-check, which scans one specific file at a time, and url-checker GitHub Actions [3] (weight 0.37, weak).

A GitHub Marketplace action wraps xrefcheck for CI use, with a supported-versions list updated per release [4] (weight 0.21, weak). Real-world adoption is documented: the morley-framework indigo repo tracked adding xrefcheck to CI as a backlog issue because the morley CI convention runs xrefcheck on documentation links and the tool "wasn't ported" to that repo [5] (weight 0.60, weak). The ground source's yubiOS convention follows the same shape: named anchors plus xrefcheck in `.github/workflows/ci.yml` group=docs, planned for the cycle-17 patches (source doc).

## The DOCER study: outdated references are measurable

The DOCER line of work quantifies the staleness problem. The peer-reviewed paper "Detecting Outdated Code Element References in Software Repository Documentation" (Empirical Software Engineering, 2023) released an implementation for developers to scan GitHub projects for outdated code element references [6] (weight 0.67). Its earlier arXiv version reports the motivating scale: among the top 1000 most popular projects, 28.9 percent had outdated documentation of the kind DOCER detects [7] (weight 0.34, weak), and the associated repository publishes per-project scan reports and the detection implementation [8] (weight 0.25, weak).

The DOCER approach transfers directly to referential integrity in docs-as-code repos: if 3 in 10 popular projects carry stale code references, a corpus without CI-level staleness scanning will accumulate them silently. That is the empirical basis for the ground source's integrity gate.

## Design pattern: anchors, not paths

The ground source scores "relative or repo-native links, named anchors, source-of-truth refs, build/CI validation" at 3 (source doc). Fragile absolute paths and "see above" phrasing score 1. The pattern that survives repo reorganization is the named anchor (`#ref-name`), because it stays valid when the file moves and gives the checker a stable target to validate.

## Sources

1. https://hackage.haskell.org/package/xrefcheck (weight 0.46, weak)
2. https://hackage.haskell.org/package/xrefcheck-0.3.0/src/README.md (weight 0.69)
3. https://github.com/serokell/xrefcheck (weight 0.37, weak)
4. https://github.com/marketplace/actions/xrefcheck (weight 0.21, weak)
5. https://gitlab.com/morley-framework/indigo/-/issues/40 (weight 0.60, weak)
6. https://dl.acm.org/doi/10.1007/s10664-023-10397-6 (weight 0.67)
7. https://arxiv.org/html/2307.04291v1 (weight 0.34, weak)
8. https://github.com/wesleytanws/DOCER (weight 0.25, weak)
