# 08 - The RSI chain runbook

Scope: the audit-lens-edit-reaudit loop and its gate stack: pre-registration in the outcomes ledger, the level_dbc sign gate, the snapback instrument, taskcheck keep gates, the unit-round protocol, and what three rounds and their lessons bought.

## The loop

Source doc (RSI chain runbook, added 2026-10-02 after rounds 1-3): the chain is audit, then lens, then fail-closed directives, then edits, then re-audit; one atomic edit per cycle; 10 cycles per round; round record in `refs/`. Three rounds ran on 2026-10-01: skills/ (PR #276, dBc from -11.03 to -12.30, success), worker modules (PR #277, 10 worker_change cycles deployed, selftest green each), refs/ (PR #278, dBc from -11.11 to -10.46, REGRESSION). The third round's failure is the source of most of the lessons below.

An atomic edit is the software-engineering atomic commit: a set of distinct changes applied as a single all-or-nothing operation (Wikipedia, https://en.wikipedia.org/wiki/Atomic_commit, jev weight 0.48 - weak backing). One atomic edit per cycle is what makes each cycle's measured delta attributable to exactly one change; without it, a round's outcome is a blend and no single edit can be kept or reverted on evidence.

## Pre-registration and the supersedes contract

Source doc, lesson 2: `expected_delta` is geometry, not forecast. Pre-register every candidate in the outcomes ledger (`POST /api/outcomes`, verdict `pending` plus `predicted_delta`) before applying; append the realized row with `supersedes` after the re-audit. Round 3 skipped the ledger, so prediction-versus-realized had no home and the regression surfaced only in PR review.

Lesson 7 (refs5): a realized row must share `baseline_id` AND `target` with the row it supersedes. Pre-registration rows carry the map id current at creation, which changes after every keep (each keep re-maps; the map chain advances). Echo the pre-row's `baseline_id` on the realized row; a fixed round-level baseline_id returns 409.

This is preregistration in the research-methods sense: hypotheses and analysis plans registered before outcomes are observed, with selective interpretation guarded against by the registry (APA, https://www.apa.org/pubs/journals/resources/preregistration, jev weight 0.90; Center for Open Science on selective interpretation of pre-planned analyses, https://www.cos.io/initiatives/prereg, jev weight 0.73; AsPredicted's flow of coauthor approval before data collection, https://aspredicted.org/, jev weight 0.65). The replication-crisis literature explains the stakes: pre-registration badges exist because undocumented analytic flexibility produces findings that do not replicate (SAGE, https://journals.sagepub.com/doi/full/10.1177/10731911241253430, jev weight 0.60; PMC version, https://pmc.ncbi.nlm.nih.gov/articles/PMC11874590/, jev weight 0.50). Even research teams can forget to submit their own preregistration, which is why the engine makes ledger submission a required step of the cycle rather than a habit (Data Colada's account of forgetting its own prereg upload, https://datacolada.org/97, jev weight 0.06 - weak backing).

## Gates in order

1. Sign gate (lesson 1): re-audit after every cycle; wrong-signed realized delta means stop, revert that edit, record the negative result, re-lens. Round 3 ran all 10 cycles because each individual prediction looked good while the realized total was wrong-signed.
2. Decision-B gate (lesson 0, 2026-10-03): under the multipass scorer protocol, each cycle re-grades its edited row with K >= 2 independent passes and re-audits via `POST /audit {passes: [...]}`. A realized delta whose sign is consistent across ALL passes and exceeds `inter_pass_offset_dbc` is plastic and gates verdicts on it; a delta inside the band or with mixed per-pass signs is elastic-by-uncertainty: revert the edit, record `band-undetermined`, and do NOT count it as a sign refutation.
3. Gate statistic (lesson 9, 2026-10-03): the gate MUST read `level_dbc = 20*log10(|z|)` or z itself, never the audit's dbc field (doc 04).
4. Bearing rule (lesson 10): aligned plus meaningful magnitude = keep; aligned plus tiny = small-but-real keep with honest magnitude reporting; inverted = revert; zero = no-flip (doc 04).
5. Hysteresis re-score (lesson 6, refs5): every edited-row re-score carries `hysteresis: {low: 0.45, high: 0.55, pre_row}`; a wrong sign under a plain re-score is provisional until re-measured (doc 06).
6. Snapback (lesson 2, added 2026-10-02): each cycle, POST the round's cumulative `[{cycle, predicted_delta, realized_delta}]` series to `/api/jev/corpus/visco/snapback`; `verdict: snapback` plus `gate_input.action: halt_round` is a hard stop (revert that edit, record, re-lens). After the round: `GET /visco/hysteresis?baseline_id=<numeric>` for the prediction-vs-realized dissipation rollup and `GET /visco/prony?metric=dbc&arms=2` for the relaxation surface over the runs history.
7. Taskcheck keep gate (lesson 12, re-authored 2026-10-03 at `tools/point-map/taskcheck_refs.sh`): every KEEP runs the taskcheck (C1-C7: file shape, append-only, single section, size bound, no cross-axis vocabulary, grounding, charter compliance) BEFORE commit; failure is a check-blocked decline. First live catch: refs6's merged keep (roadmap axis8) fails C6 because its added section cites no in-repo path and carries no dated fact.

Reverting properly is part of the loop: revert newest-to-oldest when multiple commits are involved to avoid conflicts (GitHub Desktop docs, https://docs.github.com/en/enterprise-server@3.22/desktop/managing-commits/reverting-a-commit-in-github-desktop, jev weight 0.91), and git revert creates a reverse-patch that preserves the original commit's information (Stack Overflow, https://stackoverflow.com/questions/44685128/how-to-commit-the-same-commits-after-reverting-while-preserving-commit-informat, jev weight 0.04 - weak backing).

## Content-resistant cells and axis-fill

Lesson 3: axis-fill on prose is padding. A bare "## Inputs" section flips the sparse cell but weakens structure; a cell fills only when the section is source-grounded in the doc's own subject (rounds 1-2 carried each target's measured numbers; round 3's fills were generic). No grounded content means decline the candidate and record it as content-resistant.

Lesson 11 (shipped 2026-10-03, etag 496cb99d): the lens accepts a skip list derived from the outcomes ledger each round, so declined and reverted candidates stop being re-proposed; the refs6 verification showed the candidate list turning over completely.

Lesson 5: matrix re-scoring is a measurement. If subagents re-score the matrix after edits, scorer drift can move dBc independently of the text; pin the scoring prompt, re-score only edited rows, and report scorer variance with the round.

Lesson 4: freeze the task check before cycle 1, and use the instrument surfaces a matrix round otherwise skips at baseline: `/api/map/control` positive control, `/api/map/preview` before applying, and admission trials (azimuth/axis/rayleigh).

Lesson 8: `/preview` requires exactly one changed name versus its baseline; after a keep, re-map with `POST /api/map {baseline_id}` so the next cycle's preview compares against the current corpus (a per-round map chain). Also noted in refs5: `/api/jev/corpus/placements` returned 404 with upstream `/api/map` error 1042; the direct `/api/map {texts,names}` flow is the working path for the baseline map.

## The unit-round protocol

Lesson 13 (2026-10-03, the user's directive): cycle count per round is ONE. Each round runs the whole runflow as a unit for one atomic change: pin main, frozen baseline check (fresh scorer matrix + nulls-400 audit + map + control + admission), instrument candidates (lens with skip-list and rungs), ONE edit, pre-register, hysteresis re-score, gate-grade audit, bearing plus level_dbc gate, taskcheck-gated commit or revert, realized outcome row, snapback, rollups, round record. The frozen baseline is re-checked at every unit interval: no baseline carryover across units; each unit re-derives its own frame. Round numbering continues (refsN).

Lesson 14 (2026-10-03, etag 67fb6f6a): `GET /api/jev/corpus/visco/mobility` mines the accumulated lens runs into the cell-mobility series: per-run top cells with real-versus-control deflection, per-point matrix context with input_hash segmentation, and the axis frontier. Zero parameters: the control-normalized deflection IS the measurement. The per-unit series is the z(t)-over-rounds saturation reading, with no decay-law claim on the run index (22-links doc 5.5 warning 5).

## The failure the runbook exists to prevent

Round 3's regression (dBc -11.11 to -10.46 under the share convention) came from running the full 10 cycles on a trajectory whose every-step predictions looked good. Every gate added since (snapback halts, ledger supersedes, level-convention comparison, hysteresis re-scores, taskcheck before commit, unit rounds with one edit) exists to make that specific failure impossible to repeat silently: each step forces a measurement, a registration, or a revert decision before the next edit lands.
