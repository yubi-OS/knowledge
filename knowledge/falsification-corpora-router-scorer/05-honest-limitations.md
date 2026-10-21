# 05. Honest limitations

**Scope:** Honest limitations: detailed analysis grounded in yubi-OS/yubiOS refs/falsification-corpora-router-scorer-2026-10-06.md.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/falsification-corpora-router-scorer-2026-10-06.md, no external web dig

## Why a limitations section

The source closes its analysis with "Honest limitations," 5 items that bound what the results support. Each one narrows a claim rather than retracting it.

## Limitation 1: this is a slice, not the corpus

**Stated.** 12 router rows and 12 scorer docs, not the full corpus.

**What the full build would add.** A mis-corrected astig case, an out-of-envelope spherical case, a scorer corpus of about 64 docs, paraphrase-preserved variants, and heading-only docs. These are sized in the preregistrations but not executed.

**What it means for the results.** The router's 11/12 is a rate on 12 hand-chosen cases, not an estimate of the router's error rate on intake traffic. The scorer's recall failure is robust in direction (0/4 on inputs) but its magnitude on a broader corpus is unknown.

## Limitation 2: R11's prediction came from description text

**Stated.** R11's preregistered prediction was derived from band-description text. The miss is recorded as a corpus FAIL per the pinned gate, with the under-determined preregistration input documented, but the operative clause values remain unverified because the policy doc was not read.

**What it means.** R11 could be a router bug (a 9999 detect score should have triggered correction) or a correct router with a wrong prediction (an astig entry threshold the description does not mention). The source does not choose; F1 lays out both readings and the full build resolves it by reading `routing.bands[].all`.

## Limitation 3: tri's component count was not re-confirmed live

**Stated.** tri's n_traced (19) was verified locally against the selftest anchor but not re-confirmed in the live run rows, because it fell beyond the recent-50 runs page window. The other 5 non-gasket rows had component counts live-confirmed via `/route/runs`.

**What it means.** The preregistration required component counts EXACT. For tri, that requirement is met against the local source of record, which the selftest ties to anchors, but not against the live run row.

## Limitation 4: the scorer's counting unit is opaque

**Stated.** The scorer's evidence-counting unit is opaque because the module was not in the tarball. Planted-count ground truth is the preregistered proxy.

**Why the finding survives.** The source argues that recall failures at canonical explicitness make the direction robust even if the exact unit differs. If the extractor finds 1 to 2 items where 3 to 5 were planted in the most explicit phrasing possible, a different counting unit could change the numbers but is unlikely to reverse the conclusion.

**Full-build action.** Extract the actual counting unit from the deployed module to pin ground-truth semantics.

## Limitation 5: most axis mappings are assumed

**Stated.** The axis-index mapping (task order) was confirmed only for inputs (index 1) and composition (index 8) via planted docs. The remaining 10 mappings are assumed.

**What it means.** The headline recall and specificity results concern inputs and composition, which are confirmed. The F3 claim about assumption_set depends on an assumed index. F3 is therefore the least secure finding, which fits its "report-only" status.

## How the limitations interact with the findings

| Claim | Supported by | Bounded by |
|---|---|---|
| Router 11/12 | 12 live run ids | Limitations 1, 2, 3 |
| F1 hides clauses | R11 vs R10/R12 astig values | Limitation 2 (clauses unread) |
| Scorer under-recalls | Inputs 0/4, composition 11/14 | Limitations 1, 4 |
| Scorer is specific | Distractors 4/4 | Limitation 1 |
| F3 cross-axis bleed | 4/8 planted docs | Limitation 5 |

## What the section does not say

The limitations never weaken a gate after the fact. R11 stays a FAIL, the recall gates stay FAIL, and specificity stays PASS. The limitations explain the scope of those verdicts, not their direction.

## Lesson

A limitation is most useful when it names what would remove it. Every item here does: run the full corpus, read the policy clauses, widen the runs page window, extract the counting unit, plant docs for the remaining axes. Most of them reappear as items in "What the full build needs."
