# MVP Verification Gates for the Land-Grab Application

**Scope:** The MVP application to the top-5 skill-only cells: structural-uniqueness entries, the verification checklist, and the 30 percent gap-list shrinkage bet.

## MVP scope

The MVP applied the land-grab use case to only the top-5 skill-only cells at lowest v (most structurally unique): `internal-big-picture`, `curve-guided-rsi-self`, `dm-verity-and-integrity`, `audit-evidence-packaging`, and `novelty-indication`. Scope was 5 SELF-CHANGELOG entries in 1 cycle [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, MVP section].

Limiting scope is the standard MVP move: a minimum viable product is the first version that solves the core problem with the minimum feature set required for feedback and learning [weight 0.77, https://www.nngroup.com/articles/mvp-definition/]. Here the core problem is "does dispatching self-archaeology at isolated cells measurably shrink the gap list," and the minimum feature set is 5 entries plus one re-fit.

## The verification checklist

The source doc states 6 verification items verbatim [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`]:

- Top-5 skill-only cells identified from the differential baseline.
- Each cell has a structural-uniqueness SELF-CHANGELOG entry.
- Each entry references the differential baseline at `refs/curve-guided-rsi-and-self-differential-2026-08-04.md`.
- Each entry's primitive coverage is computed and recorded.
- Re-fit (v4 differential) shows gap-list shrinkage of at least 30 percent, or migration to lower-frequency regions.
- The full improvement run (RSI Cycle 3 across all memory files) closes the remaining sparse cells.

Three of these are completion checks (entries exist, cite the baseline, record coverage) and two are outcome checks (shrinkage, closure). The split matters: completion checks can be verified the day the entries land; outcome checks require the next differential fit.

## The 30 percent shrinkage bet

The bet: gap-list shrinks by at least 30 percent in one RSI cycle [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, key assumptions]. With 25 skill-only cells, 30 percent means at least 8 cells must close or migrate.

Setting a numeric aim before the work is the IHI Model for Improvement pattern: answer "what are we trying to accomplish" with a specific, measurable target [weight 0.71, https://www.ihi.org/library/model-for-improvement/setting-aims]. The alternative, "improve alignment," would be unfalsifiable against the baseline fit.

The checklist includes an escape hatch: shrinkage OR migration to lower-frequency regions counts. A cell can stop being skill-only without gaining an anchor if its new documentation shifts its coverage into a different region; the checklist accepts that as progress because the goal is reduced structural isolation, not literally joint occupancy everywhere.

## What the MVP deliberately did not attempt

- It did not touch the 50 selfdoc-only cells; those belong to the reverse direction (doc 09).
- It did not relax the radius to manufacture anchors (doc 03).
- It did not assume all 25 skill-only cells are real gaps. The MVP's first test addresses the artifact question before the remaining 20 cells are dispatched (doc 07).

## Sequencing

The changelog entry in the source doc records the actual sequence of cycle 1 [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, changelog]: hypothesis ("the differential's 25 skill-only cells are a prioritized action list for self-archaeology dispatch"), edit (draft the refs doc plus the 5 structural-uniqueness entries), validation state (pre-RSI differential sparse = 0, with the post-MVP re-fit deferred to v0.24). This is checklist-as-process: the gates are written down before the re-fit can pass or fail them, which prevents post-hoc target adjustment.

## Reading the gates after a re-fit

When the v4 differential lands, each gate has a crisp pass condition:

- Entries exist and cite the baseline: textual check against the 5 skills.
- Coverage recorded: each entry states which of the basis primitives are 0 and 1.
- Shrinkage: count skill-only cells in the v4 fit; compare to 25.
- Migration: for cells that did not close, check whether the (u, v) region they occupy changed frequency band.
- Full closure: RSI Cycle 3 across all memory files is the follow-on work item, not part of the MVP's own pass-fail.

If the shrinkage gate fails while completion gates pass, the diagnosis is that the entries were written but did not overlap the skills' primitive coverage; the fix is in how entries are written, not in the detection pipeline [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`].
