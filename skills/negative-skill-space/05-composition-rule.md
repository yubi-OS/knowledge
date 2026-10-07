# Composition rule: NSS as option, atom as default

Scope: the cross-skill Composition Rule reference in the ground source: when the negative-skill-space sweep is dispatched at all, when it is the default, and what its fallback output is allowed to be.

Primary source of record: yubi-OS/yubiOS skills/negative-skill-space/SKILL.md (cited below as "source doc"). This is an internal-record subtopic, no dig: every claim here is a reading of the source doc's own sections.

## The rule as stated

The source doc's Composition Rule reference section states that this skill remains an option for the parent's Stage 3 dispatch when a deeper qualitative gap map is wanted (axis-12 sweep per gap candidate). The default Stage 3 dispatch is now single-action-curve-rsi's atom, per Composition Rule, Lemma 1 to Theorem 1 (source doc).

Two consequences follow directly from the same section:

1. When NSS is used as a fallback, the gap-map output is NOT an atomic action. It produces a set of recommended edits.
2. Each of those recommended edits must then be individually passed through the atom to get the only-positive-Δ guarantee (source doc).

So the fallback path is two-phase: NSS widens the candidate set, then the atom filters and selects from it one edit at a time. The only-positive-Δ guarantee never lives in NSS; it lives in the atom's geodesic-only criterion on the S^2 parameter manifold.

## What the dispatch chain looks like

The pipeline section of the source doc fixes the chain:

```
NSS gap-map (this skill)         → 5-10 Extend gaps per target file
  ↓ (gap candidates enter atom as constraint set)
atom (single-action-curve-rsi)   → 1 atomic action per file, geodesic-only selection
```

NSS contributes three things to that chain (source doc): the 12-axis qualitative sweep, the action taxonomy (Extend / Pair / Accept) that filters out performative gaps and intentional narrow scope, and cross-context reasoning in which gap candidates enter the atom's constraint set as qualitative hints rather than actions.

## What NSS no longer does

The atom-bound pipeline removed three responsibilities from NSS, and the source doc states each as a negative (source doc, 2026-08-06):

1. NSS does not execute edits. All edit actions go through the atom.
2. NSS does not compute Δ. The atom's geodesic-only criterion on S^2 is the only Δ source.
3. NSS does not verify closure. The parent's Stage 5 verification metric, the sparse-cell-count delta, is computed from atom Δs.

These are not stylistic warnings. Each one relocates a decision that used to be NSS's into an instrument that can prove something about it: selection proof (geodesic criterion), measurement (Δ), and verification (Stage 5 metric). A qualitative sweep can enumerate; it cannot prove improvement, so it keeps only the enumeration.

## Pair and Accept gaps in the fallback path

Pair and Accept gaps are not Extend. The atom's primitive-flip action space cannot close them, so they are forwarded to the parent for non-atomic resolution: a different skill composition, an architectural decision, or an intentional narrow scope accepted as-is. NSS keeps the Pair/Accept verdict as the audit trail for these gaps (source doc).

This forwarding rule is what keeps the fallback path honest about its own limits. If the only available action type (a primitive flip in the atom) cannot express the fix, the correct output is a forwarded verdict with a recorded reason, not a forced edit.

## Practical reading

The composition rule gives a dispatcher a concrete choice. Default: dispatch the atom directly when the target file needs exactly one well-chosen edit. Fallback: dispatch NSS first when the dispatcher wants a broader qualitative map, for example when it is unclear which of several axes is the real weakness of a file. In the fallback case the dispatcher must budget for the second phase, because NSS's output has no effect until each recommended edit passes through the atom.

The rule also defines failure handling. An edit that bypasses the atom is not a shortcut, it is a defect; the source doc's anti-pattern section covers that case (see the anti-patterns doc in this corpus). The sweep's output never carries Δ numbers, so any RSI record whose Hypothesis / Edit / Result does not cite an atom Δ is evidence that the composition rule was violated.

## Source

- Ground spine: yubi-OS/yubiOS skills/negative-skill-space/SKILL.md, sections "Role in the Atom-Bound Pipeline" and "Composition Rule reference" (4662 B, fetched 2026-10-07 with User-Agent omni-agent/1.0).
- Internal-record subtopic, no dig.
