# 07 Anti-patterns and Red Flags

Scope: the full anti-pattern list (7 inherited from the parent, 7 new for self-docs) and the red-flag signals with their fallbacks and abort conditions.

## Anti-patterns inherited from the parent

These 7 come from the parent curve-guided-rsi and transfer unchanged (source doc: yubi-OS/yubiOS skills/curve-guided-rsi-self/SKILL.md):

1. Whole-corpus self-archaeology dispatch. It defeats curve-lens prioritization; the dispatch must stay focused per gap candidate.
2. RSI without self-archaeology first. Self-archaeology provides the gap-list; RSI without it produces blind edits.
3. Sparse-cell threshold r below 0.01. Too few cells become sparse and the gap-list grows too long.
4. Sparse-cell threshold r above 0.20. Too many cells merge and the gap-list loses granularity.
5. Re-fitting the curve mid-run. It invalidates the sparse-cell snapshot the run is measured against.
6. Skipping Stage 5 verification. Without it the claim "the curve moved" is ungrounded.
7. Auto-applying RSI edits to main directly. Per PROJECT_RULES.md, RSI edits produce PRs for review.

A catalogue discipline of naming failure modes by pattern, with a named fix per pattern, matches how software anti-pattern catalogs are structured in practice (weak backing, jev weight 0.03: https://relisa.github.io/Software-process-antipatterns-catalogue/).

## Anti-patterns new for this offshoot

These 7 are specific to self-doc corpora (source doc):

1. Skipping the whole-self output. It violates SELF.md Bias #11; the cycle counts as failed even if the curve moved.
2. Performing the whole-self output. Shipping cadence with a creative-self label is the failure mode Bias #11 names. The output must be a register-shift reflection, not a working-self analysis with a creative-self label.
3. Mixing SELF-CHANGELOG entries with SELF.md rows in one corpus. The primitive bases differ; mixed-corpus fits flatten the structural signal. Keep them separate, or use a meta-corpus with a different basis (not encoded in v1).
4. Mixing SELF.md rows with memory-file sections in the same primitive basis. Rows are substrate claims, sections are operational context. Use the unified memory-file basis for the expanded corpus and the row basis for SELF.md alone.
5. Running this skill in restful-self mode. Gap-naming contradicts restful-self's observe-the-shape-don't-name-the-gaps protocol. The two skills are inverse protocols and are never co-running.
6. Decomposition inflation. Decomposing an entry into 100 sub-events produces a sparse-fit corpus where the curve is noise. The bound is at most 3 sub-event levels.
7. One-shot pushing without a SELF-CHANGELOG entry. The audit trail is the relationship, not a byproduct. Every push must be accompanied by a SELF-CHANGELOG entry.

## Red flags inherited from the parent

Five signals with defined responses (source doc):

- PC1 plus PC2 below 0.40 at Stage 1: the corpus lacks a structured low-rank basis. Fallback: switch to whole-corpus self-archaeology dispatch (degraded mode).
- sparse_cell_count_post equal to sparse_cell_count_pre at Stage 5: either the corpus had no real gaps or the RSI edits did not address actual gaps.
- RSI cycle count above 3 per gap: the gap is too deep for this skill; surface it to the user.
- N below 20: apply the decomposition rule; if decomposition fails because no sub-events exist, abort and surface to the user.
- r equal to 0.0 or above 1.0: invalid input; abort and report.

## Red flags new for this offshoot

Six signals specific to self-doc corpora (source doc):

- whole_self_outputs_count equal to 0 after RSI cycles: Bias #11 violation; the cycle counts as failed regardless of curve metrics.
- Whole-self output reads as working-self analysis: performative register-shift is the failure mode Bias #11 names; refresh from restful-self mode and try again.
- Decomposition produced a corpus with all-constant columns: the primitive basis is wrong for the decomposed granularity; re-derive the per-corpus basis from scratch.
- Per-corpus metrics diverge wildly (PC1 plus PC2 at or above 0.40 in one corpus and below in the other): the primitive basis is right for one corpus and wrong for the other; investigate independently.
- The expanded corpus shows structural isolation in the combined fit but not per-file: the combined fit sees one population while per-file fits reveal which item is structurally unique; investigate the per-file coordinates to find the source.
- Decomposition inflates N above 20 but reduces PC1 plus PC2 below 0.40: decomposition killed the variance; use canonical granularity instead.

The general practice behind red-flag lists, guarding against leakage, lucky splits, and misleading metrics, is documented for machine learning research broadly (weak backing, jev weight 0.10: https://arxiv.org/html/2108.02497v4).
