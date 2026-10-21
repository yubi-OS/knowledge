# 05. Amendments (all pre-gate, dated, in amendments.md)

**Scope:** 4. Amendments (all pre-gate, dated, in `amendments.md`): detailed analysis grounded in yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md, no external web dig

## The amendment rule

Amendments are the mechanism that lets a pre-registered plan change without becoming post-hoc. Every amendment in this round is dated to the minute (UTC), was made before the affected gate was evaluated, and carries an a-priori justification. The record lists three amendments in its amendments section, while the file inventory describes `amendments.md` as holding "4 dated entries, all pre-gate". The three itemized entries are below; the fourth entry is not itemized in the record and is not reconstructed here.

## Amendment 1: 04:35Z, upgrading fixtures and pinning analytic FPRs

Four changes landed together:

1. **Class F upgraded.** Class F moved from a synthetic fallback to the true recorded round-3 series, located in the repo's frozen fixtures (`tools/visco-instruments/fixtures/visco-fixtures.json`).
2. **F2 and F3 added.** F2 is a clean-single-inversion fixture; F3 retains the original synthetic fallback so nothing pre-registered was deleted.
3. **Hysteresis reference upgraded.** The local reference was moved to the documented CONTRACTS.md rules, and gate H0 was added to check it against frozen fixtures.
4. **G4 analytic FPRs pinned numerically.** The analytic false-positive rates per noise tier were written down as numbers (0.02138, 0.08025, 0.27334, 0.50359) before any noisy tier was evaluated.

Justification: each change strengthens a gate without reference to results. Using the true series replaces a guess with history. Pinning FPRs numerically removes any room to choose a convenient analytic value after seeing measured rates.

## Amendment 2: 04:40Z, the seed-index misalignment (pre-rerun)

During assembly, the runner's seed index for tiers p=0.20 and p=0.30 was found to be misaligned with the corpus generator. The first 400 calls for those tiers therefore measured an unintended corpus. The amendment:

- classifies the problem as a **harness bug, not an endpoint failure**;
- **discards** the 400 calls and states explicitly that they count toward no gate;
- reruns those tiers with the corrected offset; and
- evaluates the G3 and G4 gates for those tiers only on the corrected run.

The failure mode is specific and reusable: the seed is `0xC0FFEE ^ global_case_index`, so any off-by-offset error in the global index produces a valid-looking but different corpus. The per-case SHA-256 digests and the generator-consistency check (G6, 0 mismatches after correction) are what make such a misalignment detectable. The limitations section turns this into a standing rerun rule: regenerate from pinned seeds in the pinned order, 43 pre-N cases then 800 N cases tier-major.

## Amendment 3: 04:44Z, the H0 catch

The local hysteresis reference first implemented root-prediction pairing: each chain's dissipation computed against the root row's prediction. Against the frozen `synthetic_two_loops` fixture it produced 28.1 where the frozen value is 26.1. Gate H0 **falsified the reference**, which was then corrected to the documented per-row rule (`|predicted_delta - realized_delta|` per row across the whole supersedes chain).

The record describes this as gate H0 "doing exactly its job": the reference was wrong until proven otherwise. The distinction from amendment 2 matters. Amendment 2 fixed the harness's input plumbing. Amendment 3 fixed the harness's own model of correct behavior, and it was the pre-registered gate, not an ad hoc inspection, that found the error.

## Why these amendments do not compromise the verdict

A skeptical reviewer would ask whether any amendment moved a gate to make a failing result pass. The record answers on four grounds:

1. **Timing.** All three itemized amendments are timestamped before the affected gates were evaluated.
2. **Direction.** Amendment 1 tightened gates (real data, numeric FPRs, an additional gate). Amendments 2 and 3 fixed the harness, not the thresholds.
3. **Discarded data.** Data produced under the bug was explicitly excluded, not averaged in.
4. **No threshold changes.** The plus or minus 0.04 FPR window, the 100% requirements on G1 and G3, and the 1e-9 parity tolerance were never modified.

## Lessons for future rounds

- Pin generator seeds and order, and record per-case digests, so seed misalignment is detectable.
- Treat a local reference as a hypothesis that frozen fixtures must falsify before it can certify a live route.
- Upgrade synthetic fixtures to recorded history whenever the source of record exists, and keep the synthetic fallback alongside.
- Date every amendment and state its justification without referring to results.
