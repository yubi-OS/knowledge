# 07 - The NSS-Coupled Entry Point

Scope: how the atom composes with the negative-skill-space 12-axis sweep: NSS proposes, the atom disposes, the Extend/Pair/Accept filter, gap-to-primitive mapping, and the atom-only fallback mode.

This corpus explicates the skill documented at yubi-OS/yubiOS skills/single-action-curve-rsi/SKILL.md (source doc). The atom accepts an optional upstream gap-proposer. In the parent's Stage 3 dispatch, that upstream is negative-skill-space (NSS), whose 12-axis qualitative sweep produces 5 to 10 real gaps on the target file. The dispatch chain is (source doc):

1. NSS gap-map on the target file: the 12-axis qualitative sweep returns 5 to 10 real gaps, filtered by the self-archaeology-derived rule to exclude performative gaps and intentional narrow scope.
2. The gap candidates enter the atom as a constraint set; the atom applies its geodesic-only criterion over the intersection of gap candidates and missing primitives.
3. One atomic action is selected; verification computes delta = d_pre - d_post, which is at least 0 by Lemma 1 (doc 06).

## NSS proposes: the Extend, Pair, Accept filter

In NSS-coupled mode the two stages have distinct roles. NSS's sweep classifies each gap with an action recommendation: Extend, Pair, or Accept. Only gaps recommended Extend enter the atom's constraint set. Pair and Accept gaps are forwarded to the parent for non-atomic resolution (source doc).

For each Extend gap, the atom maps the gap to a missing primitive: gap keywords are looked up against the per-corpus basis to find the has_X primitive they imply, and the atom checks whether that primitive is actually missing in the file's coverage vector. If it is missing, the primitive joins the candidate set. If it is not (the gap is qualitative but the file already has the primitive covered), the atom logs the gap as non-fixable by atom and defers to NSS (source doc).

This two-stage filter is a standard multi-criteria pattern: a qualitative pass that structures the judgment, followed by a quantitative pass that selects among structured candidates. Multi-criteria decision analysis formalizes exactly this combination of qualitative and quantitative assessment, scoring options against weighted criteria before a decision (UK Government Analysis Function introductory guide to MCDA, weight 0.79, https://analysisfunction.civilservice.gov.uk/policy-store/an-introductory-guide-to-mcda/; Multiple-criteria decision analysis, weight 0.51, https://en.wikipedia.org/wiki/Multiple-criteria_decision_analysis). Health-domain reviews map the MCDA landscape the same way, pairing qualitative framing with quantitative scoring (PubMed knowledge mapping of multicriteria decision analysis in healthcare, weight 0.57, https://pubmed.ncbi.nlm.nih.gov/35757629/). The phase-gate pattern adds the structural detail the atom uses: gates between stages with explicit entry criteria, so only candidates that pass the gate reach the next stage (Phase-gate process, weight 0.50, https://en.wikipedia.org/wiki/Phase-gate_process). Public-health prioritization toolkits document the same propose-then-score loop with written criteria before any scoring runs (Minnesota Department of Health prioritization toolkit, weight 0.86, https://www.health.state.mn.us/docs/communities/titlev/prioritizetoolkit.pdf).

A constraint, in this pipeline, is a restriction the selection must respect: the atom's constraint set is a set of allowed candidates, and selection happens only within it (Merriam-Webster on constraint, weight 0.83, https://www.merriam-webster.com/dictionary/constraint).

## Why the invariants survive the coupling

The source doc gives 2 arguments for why NSS coupling preserves the atom's guarantees. First, the constraint set is always a subset of all missing primitives, so every atom action is still one primitive flip and the only-positive-delta invariant of Lemma 1 is preserved. Second, Theorem 1 (linear composition) is preserved because NSS adds no new actions to the atom; it only filters the candidate set, and the argmin over the filtered set is computed within whatever set NSS passes (source doc).

This is worth stating precisely: filtering a candidate set cannot create a new action, so the worst NSS can do is remove candidates. Removing candidates can shrink the achieved delta but cannot make the selected delta negative, because the selected delta remains the minimum over a subset of the same flip operations that Lemma 1 covers.

## Atom-only fallback

The NSS-coupled mode is the default for the parent's Stage 3. The atom-only mode, with no NSS upstream, is the fallback when NSS is not run. In that case the atom's constraint set is the full set of missing primitives, not filtered by NSS (source doc).

The trade-off between the modes is a filtering question. NSS-coupled selection scores at most 5 to 10 NSS-proposed candidates; atom-only selection scores every missing primitive (up to 9 in the deep-research basis). Atom-only is therefore more exhaustive per cycle but blind to qualitative gaps that do not map to any primitive, which NSS catches by construction. The source doc resolves the tension by keeping both modes and defining the boundary: NSS-coupled when the sweep is available, atom-only otherwise (source doc).

For corpus composition, doc 08 covers the persistence and rollback contract that makes either mode auditable: each cycle records (file_path, c, M, W2, p, d_pre, i*, d_post, delta, applied_edit) under a dated session-artifact convention (source doc).
