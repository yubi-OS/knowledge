# 04. Hysteresis reference, fixtures, and live contract

**Scope:** 3. Hysteresis reference + fixtures + live contract: detailed analysis grounded in yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md, no external web dig

## Artifacts

Hysteresis evidence lives in `hysteresis-fixtures.json` (2 frozen repo fixtures plus 9 analytic fixtures) and `hysteresis-results.json` (H0 to H3 verdicts plus interpretation notes, overall pass).

## The consolidation rules under test

The hysteresis route rolls up a ledger of prediction outcomes into loops. The record states the semantics now backed by mechanized fixtures, as documented in CONTRACTS.md section 2:

- **Per-row area:** `|predicted_delta - realized_delta|`, taken over the whole supersedes chain. Superseded attempts dissipate too; they are not dropped.
- **Mean:** `mean_abs = sum_abs / len(chain)`, where chain length counts every row in the chain.
- **Cycle count:** `n_cycles` equals the loop count.
- **Unknown supersedes:** a row that supersedes an id not in the ledger becomes a root.
- **Supersedes cycles:** a cyclic supersedes relation resolves to leftover singletons.
- **Duplicate ids:** throw.

Written as an equation for one chain c with rows r: `sum_abs(c) = sum over r in c of |predicted_delta(r) - realized_delta(r)|`, and the total is the sum over all chains.

## Gate results

| Gate | Scope | Result |
|---|---|---|
| H0 frozen repo fixtures | Local reference vs 2 frozen fixtures | PASS 2/2 |
| H1 live parity | Local reference recomputed from live ledger rows vs live route | PASS 3/3 |
| H2 contract | Status codes, empty-baseline behavior, shape, identities | PASS 9/9 |
| H3 analytic fixtures | Reference-only chain shapes | PASS 9/9 |

### H0: frozen fixtures

`round3_recorded` reproduced a total of 102.86000000000001 (tolerance 0.05), mean 10.286 (tolerance 0.01), 10 singleton loops, 10 active, `n_cycles` 10. That is the 102.86 anchor the coverage record identified as the route's only prior fixture coverage. `synthetic_two_loops` matched exactly under the contract's `1e-9 * (1 + |expected|)` rule, including per-loop sums and means. H0 also has a history: it is the gate that falsified the first version of the local reference (see doc 05).

### H1: live parity

The local reference was recomputed from live ledger rows and compared against the live route for three baselines, to 1e-9:

| Baseline | Live rollup | Notes |
|---|---|---|
| 565 | 1.0235 | |
| 566 | 3.8995 | 4 loops |
| 569 | 0.7047 | |

Parity covered more than totals: `chain_ids`, predicted and realized arrays, `ledger_chain_ids`, and the active, skipped, and ledger_rows counts were all exact.

### H2: contract

Nine contract checks pass: 422 when the parameter is missing; 422 on a non-numeric parameter; 200 with `no_data` plus a note on empty baselines (tested at 0, 1, 99999, and -1); a complete `measured` shape on baselines with data; and arithmetic identities holding across the response.

### H3: analytic fixtures

Nine reference-only shapes pass, each targeting a consolidation edge case: single-row-both-shapes, multi-cycle supersedes chain, mixed chains, pending-only, pending-chain-root, supersedes-cycle to singletons, unknown-supersedes to root, duplicate-ids to throw, and empty to zeros. These are the shapes that broke the original route before the Oct-3 fix.

## Why H3 is reference-only

The live route reads only the production D1 outcomes ledger and accepts no synthetic ledger input. The round wrote nothing anywhere, so synthetic chain shapes could not be injected live. H3 therefore certifies the reference, and H1 ties the reference to the live route on the shapes that real data happens to contain (observed as a two-phase pair form). The combination is strong but not complete: multi-realization chains and caller-supplied both-shapes rows are not falsified live, and the multi-realization fill rule is flagged as interpretation in the results file.

## The anchor that cannot be re-run live

The 102.86 round-3 anchor predates the current 12-row ledger, and the maximum live rollup is now 3.90. So the anchor is reproduced only by the local reference from the frozen fixture (H0), not by the live route. This is recorded as a limitation, not hidden: H0 plus H1 together argue that the reference matches history and the reference matches the live route, which is the strongest available chain given that the historical rows no longer exist in production.

## Consumer note

The live route's `loops[].chain_ids` carries only the ACTIVE (realized) row id, while the full chain is in `ledger_chain_ids`. Consumers written against the pure-function contract, which may expect full chains in `chain_ids`, should read `ledger_chain_ids` instead.
