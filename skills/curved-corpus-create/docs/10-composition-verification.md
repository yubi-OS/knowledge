# 10 - Composition, verification, and lineage

Scope: how the skill composes with the rest of the curve regime, the selftest contract, and the changelog that records how the format changed.

Source of record: yubi-OS/yubiOS skills/curved-corpus-create/SKILL.md. This is an internal-record subtopic: no external dig was run.

## Composition table

| Skill or channel | How it composes | Direction |
|---|---|---|
| rsi-phi-skill | supplies calibration priors: detection threshold, FPR, N-sizing that the loop's gate decisions should be conditioned on | curved-corpus-create -> rsi-phi-skill |
| guided-curve-ideate | the lens-format scheme is sourced from guided-curve-ideate cycle-34 (L141-L146); the lens subcommand and lens-format calibrate and place outputs use the same JSON shape | guided-curve-ideate -> curved-corpus-create |
| single-action-curve-rsi | supplies atom delta validation on known curvature | curved-corpus-create -> single-action-curve-rsi |
| Hodge channel (C-hodge-pivot) | supplies generated corpora as Hodge nulls | bidirectional |
| hyperspherical-harmonic-curve | owns the fit; this skill owns the ground truth | bidirectional |
| curve-compass-skill | the lens subcommand here supplies the patch generator; the compass's lens subcommand consumes it | curved-corpus-create -> curve-compass-skill |

The pattern: this skill is upstream of every improvement loop that conditions on a calibrated threshold, and downstream of guided-curve-ideate for its output format [source doc].

## Self-containment

Reads: one JSON matrix file (optional). Writes: JSON where told. Depends on: Python stdlib + numpy [source doc]. Combined with the constraints (LOCAL ONLY, no scipy/sklearn/pandas/matplotlib), the skill is fully reproducible offline with a two-package dependency footprint.

## Verification contract

python3 scripts/create_corpus.py --selftest exits 0 only when GREEN [source doc]. The selftest has seven blocks, unchanged from v1.0.0, plus the v1.1.0 lens-format block: 6 assertions on lens output schema (lens, file, hypothesis, method, parameters, delta, verdict, score, caveat all present; verdict in {YES, PARTIAL, NO}; score 0 to 50) [source doc]. Anti-pattern: do not skip the selftest after editing the script [source doc].

## Changelog and lineage

- 1.0.0 (2026-08-12): initial. Establishes the generative inverse of the measurement family.
- 1.1.0 (2026-08-12): lens-format outputs. The first real-world use (cycle 1, PR #202) shipped flat calibration tables; Jenny declined the merge because the output was too structured to produce the needed dynamics. v1.1.0 changes the format to guided-curve-ideate new ideas, adds the lens subcommand, lens-format calibrate and place outputs, 6 new selftest assertions, and the Composition link to guided-curve-ideate cycle-34. Cycle 2 PR off main uses this format.

Maintainer: Sauna, wave 2. Built against papers/playbooks/rsi-regime.md, the guided-curve-ideate (cycle-34) and single-action-atom SKILL.md exemplars, the wave-1 big-picture memo, and the wave-1 Hodge pivot memo [source doc].

## How to cite this corpus

Every doc in this corpus grounds its claims in yubi-OS/yubiOS skills/curved-corpus-create/SKILL.md as the primary source of record. Docs 02 through 07 additionally carry web-dig citations with jev weights; docs 01, 08, 09, and 10 are internal-record subtopics with no dig, because their content is defined by the skill's own record.

## The selftest as CI gate

Example 7 of the source doc shows the selftest's role as a regression gate: python3 scripts/create_corpus.py --selftest exits 0 only when GREEN [source doc]. In a CI pipeline, that one command is the regression test for the whole skill: the seven v1.0.0 blocks re-verify the generative and measurement math, and the v1.1.0 block re-verifies the lens schema (all nine fields present, verdict in {YES, PARTIAL, NO}, score 0 to 50) [source doc]. Guideline 10's lens-format-only rule is thus enforced by code, not by convention: a flat table would fail the schema assertions.

## Reading the two PRs in the changelog

The changelog records two PRs on the same date [source doc]:

- PR #202 (cycle 1): the first real-world use, shipped flat calibration tables, merge declined.
- The cycle 2 PR off main: uses the v1.1.0 lens format.

The lesson is recorded so it does not repeat: the output format is part of the skill's contract, and the format's purpose is to make each measurement a concrete experiment rather than a number [source doc].

## Where the ground truth flows

Tracing the Composition arrows end to end: guided-curve-ideate supplies the lens format; this skill supplies calibration priors (detection threshold, FPR, N-sizing) to rsi-phi-skill's gate decisions; it validates atom deltas on known curvature for single-action-curve-rsi; it exchanges corpora-as-nulls with the Hodge channel; it splits ownership of fit versus ground truth with hyperspherical-harmonic-curve; and its lens pool feeds curve-compass-skill's patch generator [source doc]. A corpus minted by this skill therefore touches every member of the curve family downstream.
