# The frozen baseline: pin, re-derive, no carryover

Scope: how a unit round pins the corpus and re-derives its frozen baseline at every unit interval, why frames never carry over, and what replaces cross-frame comparison.

## The rule

Each unit round pins the target corpus (on the validated rounds, the refs/ directory of yubi-OS/yubiOS) and then re-derives its frozen baseline. The baseline is not inherited from the previous round. There is no carryover: each unit's frame is self-consistent within that unit, and cross-unit comparison happens through the instruments (hysteresis, prony, mobility), never through the raw frames (source doc, design decision 2 and refs9).

## Why no carryover

A carried-over baseline silently imports the previous round's assumptions: its scorer version, its null distribution, its gate thresholds, its lens state. If any of those changed in round N, round N+1 would compare its change against a frame built under different conditions, and the delta would be confounded. Re-deriving at every unit interval makes each frame a clean pre-post comparison for exactly one change. This is the same baseline logic that single-case experimental designs encode: the fundamental unit of the design family is the effect of a treatment on outcomes measured against a stable baseline within the same unit (https://hdsr.mitpress.mit.edu/pub/nqvadq0w/download/pdf, w0.760).

Baseline terminology from applied single-subject design practice is explicit about this role: baseline logic is what lets experimental control be determined, and level, trend, and variability are judged within a design, not across designs (https://www.praxisnotes.com/resources/aba-single-subject-design-terminology, w0.485, weak backing).

## The software-engineering mirror

The same discipline appears in test practice. Regression testing exists to ensure recent changes do not negatively affect existing functionality, and its comparisons are meaningful only against a current, trustworthy state of the system (https://www.geeksforgeeks.org/software-engineering/software-engineering-regression-testing/, w0.391, weak backing). Snapshot testing captures the output of a function, component, or file and compares it against the snapshot; a stale snapshot turns every comparison into noise (https://www.astaqc.com/software-testing-blog/snapshot-testing-2026-catch-regressions-without-assertion-code, w0.169, weak backing). Visual regression testing compares screenshots before and after changes against baselines that must be deliberately refreshed (https://qapractices.com/documentation/visual-regression-testing-guide/, w0.381, weak backing). In each case the lesson is the same: a baseline is a hypothesis about the current system, and hypotheses age with every change.

MLOps practice adds the data side: keeping test sets disjoint from training and validation sets avoids false methodology propagating from one set to the other (https://ml-ops.org/content/mlops-principles, w0.489, weak backing). The unit protocol's no-carryover rule is the corpus-level version: no artifact of round N-1 propagates into round N's measurement.

## What replaces the raw frame comparison

If frames cannot be compared directly, what carries information across units? Three instruments, all named in the source doc:

1. Hysteresis, which keeps gate verdicts stable when a previously scored row is re-scored (doc 05).
2. The prony instrument, named in the source doc as part of the cross-unit comparison path (internal, not web-weighted).
3. The cell-mobility series, produced by the lens as an instrument (doc 08).

The design principle is that instruments are calibrated once and applied to many frames, so their readings are comparable even when the underlying frames are not. Raw frames are coordinates; instruments are the common scale.

## Operational checklist

A unit interval therefore opens with: pin the corpus at a fixed commit or snapshot, re-derive the frozen baseline from that pin, verify the baseline check passes before any change is proposed, and record the re-derivation in the round's steps.log entry (source doc, design decision 7). Skipping the re-derivation to save time is the single most tempting shortcut in the flow, and the one that quietly invalidates the round's delta.
