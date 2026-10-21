# 03. Amendments logged

**Scope:** Amendments logged: detailed analysis grounded in yubi-OS/yubiOS refs/falsification-corpora-router-scorer-2026-10-06.md.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/falsification-corpora-router-scorer-2026-10-06.md, no external web dig

## The amendment discipline

The source summarizes the log in one line: **3 pre-run entries plus 3 post-run FINDINGS. No gate was moved post-hoc.** The log lives in `amendments-log.md`, which was opened empty before any measurement.

The distinction between the two entry types is the whole point. A pre-run amendment changes the preregistration before data exists, with an a-priori justification. A post-run finding records something the data revealed, without changing any gate. Moving a gate after seeing results would turn a falsification test into a confirmation exercise.

## Pre-run entry 1: lens_family spelling

**What changed.** The lens family is spelled `"gasket"`, passed as `artifact.any.lens_family="gasket"`.

**Why it is an amendment.** Transport details are part of the preregistered procedure. If the spelling the router expects differed from what the preregistration assumed, the lens would not be selected and every gasket row would test the wrong code path. Logging the spelling fixes the transport contract before any request is sent. The What-was-built section labels this "amendment 1."

## Pre-run entry 2: the R10 expected-gate amendment

**What changed.** The expected gate for R10 (gasket-astig-0.20) was amended before measurement, with an a-priori justification.

**What R10 then produced.** Corrected-hierarchy fired; astig was estimated at 0.2139 after correction; the spherical cross-mode reading of -0.3978 fell outside its envelope (the 1/3 bound); the warp was skipped and the row was **blocked reroute_not_converged**. The source marks this "PASS per amendment 2."

**Why this is legitimate.** The amendment was logged before the run. The source adds that the cross-mode contamination is itself a finding, so the amendment did not hide behavior: the row passed against the amended gate and still contributed new information.

## Pre-run entry 3: the scorer schema probe authorization

**What changed.** One neutral schema probe was authorized in addition to the 12 synthetic docs.

**Why.** The scorer's output schema needed confirming before results could be interpreted. The Honest Limitations section shows why: the axis-index mapping (task order) was confirmed only for inputs (index 1) and composition (index 8) via planted docs. A probe authorized in advance is part of the design; a probe added afterward to explain a surprising result would be a post-hoc change.

**Budget.** The scorer slice, probe included, cost about $0.0026 against a $0.01 cap.

## Post-run findings F1 to F3

The three post-run entries are findings, not amendments.

- **F1: /bands hides the operative pair-band clauses.** From R11's mismatch.
- **F2: spectral walk silently absent on 4/12 gold rows.** tri, shuffle-s42, pumpkin_ring, pumpkin_field returned null d_w and n.
- **F3: scorer cross-axis bleed on assumption_set.** Credited on 4/8 planted docs with p above 0.55.

A fourth finding, F4 (transport: sandbox egress to workers.dev blocked, renders moved in 100 KB base64 chunks), appears in the Findings section but is not counted among the 3 logged post-run entries.

## The R11 test case

R11 is where the discipline was tested. The preregistered prediction (corrected-hierarchy, re-select, allowed) was derived from band-description text. When it missed, there were two tempting moves: amend R11's expected gate after the fact, or argue the description text was ambiguous and exclude the row. The source did neither. It recorded a corpus FAIL per the pinned gate, documented that the preregistration input was under-determined, and opened F1 to explain the mechanism. The verdict line reads "FAIL-on-R11," not "11/11 with one excluded."

## What the log enables

- **Auditability.** Each pre-run entry has a reason that existed before data. A reviewer can check that no entry references an observed number.
- **Learning.** Post-run findings become requirements for the full build (items 1 to 3 of "What the full build needs" trace to F1 and F2).
- **Honest denominators.** The router score stays 11/12, and the scorer recall gates stay FAIL.

## Relationship to the parent methodology

This mirrors the falsification-corpus method used in the supersolid program, where amendments were logged before v2 measurements and failures stood as recorded. Lane D applies the same rules to routing and scoring.
