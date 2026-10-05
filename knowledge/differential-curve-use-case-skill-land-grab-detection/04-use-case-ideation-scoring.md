# Use-Case Ideation and Scoring: How V3 Won

**Scope:** How the land-grab use case was selected: ideate-solo variation generation V1 to V6, the 20-point scoring rubric across defensibility and testability, and why the combination variant won.

## The generative step

The land-grab use case was not designed directly. It emerged from an ideate-solo run on 2026-08-04 that generated 6 candidate use cases for the differential curve's sparse-cell output, each a variation on the parent skill (`curve-guided-rsi` and its self-doc offshoot). The full generation log lives in `session/diff-curves/ideate-differential-use-case-solo-2026-08-04.md` on the authoring side [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, header].

Structured idea generation is not just ceremony: research finds that the structure of an idea-generation framework, as a dimension of routinization, measurably influences outcomes of the ideation process [weight 0.58, https://www.sciencedirect.com/science/article/pii/S235267342300046X]. Separately, metacognitive studies of idea work show that generation ease relates positively to accurate idea selection, which supports generating many variations and then scoring rather than debating one candidate [weight 0.61, https://onlinelibrary.wiley.com/doi/10.1002/jocb.505].

## The scored field

Each variation was scored out of 20. The full field:

| Variation | Name | Type | Score | Outcome |
|---|---|---|---|---|
| V1 | Cross-Corpus Gap Detection | Constraint removal | 16/20 | Dropped |
| V2 | Skill Acquisition Prioritization | Audience shift | 13/20 | Dropped |
| V3 | Skill Land-Grab Detection | Combination | 18/20 | Winner |
| V4 | Joint-Anchor Alignment Audit | Inversion | 12/20 | Dropped |
| V5 | Inverse Protocol Verification | Inversion | 9/20 | Dropped |
| V6 | System Coherence Score | Simplification | 12/20 | Dropped |

[source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, "Why this use case wins"]

The rejection reasons are instructive because they are structural, not taste-based:

- V1 lost because the differential's sparse-cell detector already performs gap detection; V3 makes that raw output actionable.
- V2 lost because it is downstream of V3: once a new skill exists, V2 helps find its closest self-doc item. It survives inside V3's design rather than as a standalone use case.
- V4 and V5 (both inversions) lost because they are verification-only; they check existing items instead of generating new ones.
- V6 lost for lossiness: collapsing structural detail into a single coherence number destroys exactly the cell-level detail the differential produces.

## Why the combination variant won

V3 scored 18/20 by combining the parent skill's sparse-cell detection with the offshoot's per-corpus dispatch into a bidirectional gap-fill. The two properties the source doc calls out as high are defensibility and testability [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`]:

- Defensibility: the gap list shrinks over RSI cycles, and the Jaccard overlap grows from 0.074 toward a target of 0.20. Progress is measured against a persisted baseline, so the claim "this use case improved the corpus" is checkable by anyone who re-runs the fit.
- Testability: re-fitting is cheap, and comparison is direct through the existing differential pipeline. No new instrumentation is needed to verify the hypothesis.

## Rubric lessons for future use-case scoring

Published scoring rubrics for ideas converge on the same axes: score against explicit weighted criteria such as impact, feasibility, and evidence, and record the reasoning behind each score rather than emitting a bare number [weight 0.11, weak backing, https://ideasiq.ai/insights/how-to-score-ideas]. The ideate-solo field follows that shape: every variation carries a named transformation type (constraint removal, audience shift, combination, inversion, simplification) plus an explicit score and drop reason.

The scoring outcome also illustrates a selection principle: the winner is the variant that produces new items (dispatchable work) while the runners-up mostly produce checks or derived views. When a corpus-audit surface generates a structural signal, the highest-leverage use case is usually the one that converts signal into scheduled action, not the one that re-verifies the signal generator.

## What the scoring did not settle

Scoring selected V3 but left open the two assumption questions that drive its risk: whether skill-only cells are real gaps or fit artifacts (doc 07), and how to handle the 0-anchor reading (doc 03). The MVP was scoped to answer the first by direct test before scaling past the top 5 cells [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, key assumptions].
