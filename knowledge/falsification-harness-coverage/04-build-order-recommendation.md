# 04. Build-order recommendation

**Scope:** Build-order recommendation: detailed analysis grounded in yubi-OS/yubiOS refs/falsification-harness-coverage-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/falsification-harness-coverage-2026-10-06.md, no external web dig

## The recommended sequence

The ground source closes with a five-step build order plus a catch-all, each step justified by effort, external-call cost, and what it unblocks:

| Step | Tier 2 items | Justification in the source |
|---|---|---|
| 1 | Snapback (5) + hysteresis (6) fixtures | Hours of work, zero external calls, closes the visco family's fixture gap |
| 2 | Route end-to-end corpus (2) | The gold renders exist; pre-register and run |
| 3 | Scorer gold set (3) | Directly unblocks the v2.3 extractor-recall pass the refs4 round named |
| 4 | Prony recovery envelope (4) | Pins the estimator before the next real-data round |
| 5 | Audit standard candles (1) | Biggest value; uses the existing curved-corpus-create generator |
| 6 | The rest | In priority order as rounds demand them |

## Reading the order

The list is not sorted by value. Item 1 (audit standard candles) is described as the biggest value, yet it is fifth. The order instead optimizes for three things.

**Cheapest closure first.** Steps 1 and 2 reuse existing artifacts. The visco fixtures need no generator beyond deterministic synthetic series, and the route corpus reuses the gold renders that already carry measured D and d_w (gasket, tri, shuffle, pumpkin_ring, pumpkin_field). Both can finish in a single round and convert a "no fixtures" cell to "harness-backed".

**Unblocking a named downstream.** Step 3 is placed ahead of the higher-value audit candles because a prior round is waiting on it. The refs4 round recorded 3 no-flip cycles that were extraction-recall limits and called for a v2.3 extractor-recall pass. A scorer gold set with planted per-axis evidence at known counts is that pass's precondition.

**Pinning before the next real-data use.** Step 4 exists because the Prony estimator is about to be used again. Its first real-data fit had r2 0.069 on a 35-point series: honest but weak. Without a recovery envelope there is no way to say whether a weak fit reflects the data or the estimator.

## Outcome check: step 1 was executed

A companion round record (the visco-falsification record dated 2026-10-07, minted as its own corpus in this wave) reports that Lane C executed build-order items 5 and 6. Its verdict: snapback 852/852 cases pass with all six gates (G1 to G6) passing, and hysteresis passes all four gates (H0 repo fixtures, H1 live parity, H2 contract, H3 analytic fixtures). That record closes step 1 of this order and recommends wiring the 843-case snapback corpus plus H0 and H1 into `/api/jev/corpus/selftest` as committed regression anchors. This is the first empirical confirmation that the build order's cost estimate ("hours, zero external calls") held.

## The operating procedure every build must follow

The source ends with a non-negotiable procedure that applies to every step:

1. **Pre-register before measuring.** Pinned parameters, predicted bands, and gate definitions are written down first.
2. **Verify gate windows against the actual scale lattice.** A window that falls between lattice points can never pass or never fail; this check catches it pre-run.
3. **Commit anchors.** Every gold fixture's expected value lands in a machine-readable anchors record so later rounds can detect regressions.
4. **Run live-route parity.** The worker port and the Python source of record must agree on the gold inputs.
5. **Log amendments BEFORE the first clean run.** Any change to the plan is dated and justified before results exist. The visco round shows what this looks like in practice: two harness bugs were found mid-run, logged as dated amendments, and their discarded data was explicitly excluded from every gate.

## Dependencies and parallelism

Steps 1, 2, and 4 have no dependencies on each other and could run as parallel lanes. Step 3 depends only on authoring synthetic docs. Step 5 depends on the curved-corpus-create generator, which already exists, but has the largest calibration surface (4 to 5 amplitudes plus zero controls, FPR floors), which is a reason to run it after the team has rehearsed the procedure on cheaper builds. The catch-all step leaves taste, persistence, classify, map placement, retrieval, and the decide battery to be pulled forward when a round depends on them, for example the decide battery after the next model or threshold change.

## What success looks like

When the order completes, every Tier 2 endpoint carries the Tier 1 pattern: a synthetic gold family with exact answers, a pre-registered gate, and an anchors record, all failing loud. The Harness column in ENDPOINTS.md then reflects measured validity rather than port parity.
