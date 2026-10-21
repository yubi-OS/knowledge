# 04. Key Assumptions to Validate

**Scope:** Key Assumptions to Validate: detailed analysis grounded in yubi-OS/yubiOS refs/supersolid-program-next-steps-solo-2026-10-06.md.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/supersolid-program-next-steps-solo-2026-10-06.md, no external web dig

## Three assumptions

The source lists 3 unchecked assumptions, each mapped to a lane that proves or disproves it.

### Assumption 1: the v2 results reproduce from the cleaned harness

**Statement.** The v2 results are reproducible from the cleaned harness: the selftest must reproduce the anchors within fixture-parity tolerance. Lane B proves it.

**Why it matters.** Cleaning code is a change. A refactor that subtly alters droplet placement, rendering, or thresholding would produce a harness that runs green on its own outputs but no longer reproduces the numbers in the refs doc. The selftest closes that loop by asserting the published anchors directly.

**The anchors.** Gasket L=384 gate slope 1.5968; tri whole-window D 1.2636; component-count assertions (366 for the gasket, 19 for tri and shuffle, per the program's refs record).

**What counts as passing.** Within fixture-parity tolerance. The program's live-route parity checks offer a reference scale: in the companion record, live-versus-local deltas ran from 1.2e-5 to 4.9e-5.

**Downstream evidence.** A later Lane D record (refs/falsification-corpora-router-scorer-2026-10-06.md) reports re-running `gen_v2.py` from the repo tarball with **selftest 30/30 PASS** against `anchors.json` before rendering. That is the harness reproducing its anchors from repo source.

### Assumption 2: the methodology generalizes beyond one corpus

**Statement.** The skill's methodology generalizes beyond this one corpus. It is written from one validated run, so it must be marked v1, one-use-validated.

**Why it matters.** Every step in the procedure came from one experience. Some steps may be specific to box-counting on rendered droplets (MIN_COMPONENT boundary checks, ink-coverage arithmetic). Others look general (pre-registration, advisor review, checking gate well-posedness on the actual scale lattice, convergence calibration).

**How the source handles it.** Not by testing now, but by labeling: "mark it v1, one-use-validated." The label tells a future user that the procedure has one success behind it.

**What would validate it.** Using the skill on a second pinned-scale instrument. The source's open question answer (own skill rather than a taste-engine section) rests on the claim that it generalizes to any pinned-scale instrument.

### Assumption 3: lean-check stays green at the new HEAD

**Statement.** lean-check wiring stays green at the new HEAD (dispatch plus verify, the CI dispatch discipline).

**Why it matters.** Adding a harness to CI can break CI: a missing dependency, a slow selftest, or a path assumption could turn the build red. A red CI is worse than no CI, because it trains people to ignore it.

**How to test.** Dispatch the workflow after the push and verify the run at the new HEAD, rather than assuming a push-triggered run passed.

## What is NOT assumed

- **That D reads order.** The source routes that question to the v3 control.
- **That the Norcia trend is real at matched extent.** It is an open question.
- **That a knowledge-corpus mint is useful now.** The Not Doing list excludes it as duplicative.

## Each assumption ends in an artifact

| Assumption | Proving artifact |
|---|---|
| v2 reproducible | Selftest output, green, asserting 1.5968 / 1.2636 / component counts |
| Methodology generalizes | v1 label on the skill (deferred validation) |
| CI stays green | Dispatched lean-check run at new HEAD, verified |

This matches the stress-test claim that the rollout has no un-testable bet. Assumption 2 is the only one not resolved within the session, and the source handles it honestly by scoping the claim rather than overstating it.

## Risk if an assumption fails

- **Assumption 1 fails.** The cleaned harness and the record disagree. The correct response is to fix the harness, never to edit the anchors.
- **Assumption 2 fails** on a future instrument. The skill gets a v2 with the failing step generalized or scoped.
- **Assumption 3 fails.** The push is not done until CI is green.
