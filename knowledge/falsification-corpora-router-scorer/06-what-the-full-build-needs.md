# 06. What the full build needs

**Scope:** What the full build needs: detailed analysis grounded in yubi-OS/yubiOS refs/falsification-corpora-router-scorer-2026-10-06.md.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/falsification-corpora-router-scorer-2026-10-06.md, no external web dig

## Five requirements

The source ends with "What the full build needs," a numbered list of 5 requirements. Each traces to a finding or limitation from the slice.

## Requirement 1: the policy doc's `routing.bands[].all` clauses (F1)

**Need.** Read the `all` clause arrays from the policy doc (KV or git mirror), not the `/bands` surface.

**Why.** "Without them, corrected-hierarchy triggers cannot be pre-registered exactly." R11 failed because its prediction came from description text. The hypothesis on the table, an astig-above-threshold entry condition (R10 and R12 at |est| of 0.019 or more fired; R11 at -0.0022 did not), can only be confirmed by reading the clauses.

**Decision it unlocks.** Whether "detection signal 9999 not gating band selection" is a router bug. If the clauses show detect_score should gate selection, R11 is a bug; if they show an astig threshold, R11 is a correct router and a wrong prediction.

## Requirement 2: spectral-presence assertion and walk CPU-cap investigation (F2)

**Need.** Assert per run that the spectral walk produced d_w and n, and investigate the worker CPU cap.

**Why.** On 4 of 12 gold rows (tri, shuffle-s42, pumpkin_ring, pumpkin_field) the walk was silently absent. The contract allows a failed walk without failing the measurement, but pair-band gating depends on d_w. A corpus that cannot detect missing spectral data cannot test pair bands on those rows.

**Design note.** The assertion belongs in the corpus harness, not in the router contract. The router can keep degrading gracefully for availability; the corpus must refuse to count a row as tested when its spectral data is missing.

## Requirement 3: router negative cases and a determinism check

**Need.**

- A **mis-corrected-astig** negative case.
- An **out-of-envelope-spherical** negative case.
- A **determinism check**: same input_hash, same verdict.

**Why.** The slice covered blocked-reroute behavior (R10, R12) but not every failure mode the preregistration sized. The determinism check matters because the router is meant to be deterministic; an input_hash comparison across repeated runs is the direct test.

## Requirement 4: the ~64-doc scorer corpus and the counting unit

**Need.**

- About **64 docs**, including **paraphrase pairs** and **heading-only docs**. The source names this "the v2.3 extractor-recall pass regression set."
- **Extract the actual counting unit** from the deployed module to pin ground-truth semantics.

**Why.** The slice showed the extractor under-recalls even on maximally canonical phrasing (inputs 0/4; composition 11/14). A regression set lets the next extractor version (v2.3) be measured against the same failure. Paraphrase pairs test whether recall depends on wording; heading-only docs isolate the case the slice ruled out as the cause. The counting unit closes Limitation 4.

**Implied by Limitation 5.** Planted docs for the remaining 10 axes would confirm their index mappings and make F3 testable rather than report-only.

## Requirement 5: commit machine-readable records once the corpus passes

**Need.** Commit anchors.json-style machine-readable records once the corpus passes.

**Why.** The slice's artifacts live in `session/subagent/lane-d-corpora/`, and nothing was pushed to any repo. The supersolid program's harness already uses `anchors.json` so that `gen_v2.py --selftest` can assert known values (30/30 PASS in this run). Committing router and scorer anchors in the same format would let CI guard these corpora the same way.

**The condition.** "Once the corpus passes." Anchors are committed after the full corpus meets its gates, so the repo never carries anchors for a corpus with open FAILs.

## Ordering

The source numbers but does not explicitly sequence the items. Dependencies suggest an order:

1. Requirement 1 first, because it changes how router rows are predicted.
2. Requirement 2 in parallel, because it changes which rows count as tested.
3. Requirements 3 and 4 next, preregistered with the corrected inputs.
4. Requirement 5 last, gated on passing.

## Operational carry-over (F4)

The full build inherits the transport constraint: sandbox egress to workers.dev is blocked, so renders travel through the ubuntu shell bridge in 100 KB base64 chunks (not 380 KB, which exceeds Linux's 128 KB MAX_ARG_STRLEN), with checksums verified on arrival.

## What success looks like

A full build that meets these requirements yields a router corpus whose predictions come from the operative clauses, whose rows all carry spectral data or are excluded, and whose determinism is checked; a scorer corpus large enough to measure recall changes between extractor versions; and committed anchors that let CI catch regressions.
