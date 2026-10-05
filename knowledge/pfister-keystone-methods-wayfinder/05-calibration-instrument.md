# 05. The calibration instrument: POST /api/map/control

**Scope.** How `calibration/1` turns the CutPaste control idea into a shipped endpoint: the exact-corpus gate, the fixed splice recipe, measurement through the real preview path, and the two references the reader sees.

## Detection theory grounding

The instrument's reading model is classical detection theory. Detection theory separates a detector's response into hits and false alarms, and the false alarm rate is the quantity you must know before any detection claim means anything [1][2][3][4]. Constant false alarm rate (CFAR) detectors exist precisely because a detector's false alarm rate must stay controlled as the background changes [5]. Calibration work under distribution shift makes the same point in ML terms: model confidence must be evaluated under corrupted or shifted inputs before it can be trusted [6][7], and benchmarks for synthetic data state their evaluation protocol explicitly for the same reason [8].

The wayfinder calibration instrument imports this structure: the checkerboard null is the false-alarm side, and the CutPaste splice is the known-signal side.

## The endpoint

Project provenance for this section: the yubi-OS refs corpus document `pfister-keystone-methods-wayfinder-2026-09-17.md` (internal primary source, unweighted).

- **Exact-corpus gate.** The route refuses to run unless every baseline name is present, every SHA256 matches, and there are no additions. It answers 409 with named diffs before any AI or KV work happens. This is what makes the control comparable across runs: it is pinned to a known corpus.
- **Fixed recipe.** `cutpaste-splice/1` replaces a centered host window of round(0.25 times len) code units with a same-length donor segment, whole donor if shorter, never splitting surrogate pairs. `n_controls` (2 to 12, default 6) and `control_seed` (default 20260917) are the only knobs and are echoed back. Recipe keys such as `splice_fraction`, `window`, `hosts` get 422; instrument keys get 409.
- **Real-path measurement.** Each splice is measured through the real `mapPreviewHandler`, so the frozen frame, anchor verification, exact ledger, and no-persist discipline are inherited rather than reimplemented. A deterministic fixed recipe with a fixed seed follows the same discipline as deterministic seed mutation in fuzz testing, where the mutation operator is fixed and reproducible rather than random per run [9].
- **Per-control record.** host, donor, offsets, before and synthetic SHA256, `isolated_delta`, `ledger_actual_delta` (must agree with the isolated delta), `bits_changed`, geodesic and chord displacement, `quantization_silent`, `occupied_sectors_delta`, `unchanged_anchor_count`.
- **Summary with n.** Sign counts and min, median, max, each with n attached.
- **Two references side by side.** `baseline_reference.null` echoes the K, E0, SD0, and p_resolution of the stored checkerboard null, the false-alarm side, and `no_change_reference` is the identity, the known-zero side. `task_verdict` is hard-coded `not-applicable`.

## What the numbers say on a real frame

The deployment smoke on map 77, a 12-document refs/ baseline pinned at frame `6b13364cd8ac5b57`, ran `n_controls=3` with seed 20260917 in 4.2 seconds: `isolated_delta` values were -2, 0, 0, `bits_changed` was 4, 3, 1, geodesic displacement ranged 0.53 to 1.06, 0 controls were quantization-silent, 11 of 11 anchors were byte-equal per control, and ledger delta equaled comparison delta for all 3. A later reading of a 25 percent splice on the same frame moved 1 to 4 bits in every case and changed the isolated count in 1 of 3 cases. Both are instrument readings on that frame only, not benchmarks and not evidence about any real edit (project provenance, internal primary source, unweighted).

The boundary is the doc 07 subject, but its instrument-side shape is visible here: a splice that changes the isolated count says the statistic responds to known-different content [10]; a splice that moves zero bits says the instrument is quantization-silent for that content size on that document. Neither is task quality.

## Sources

1. https://en.wikipedia.org/wiki/Detection_theory (noul 0.5889)
2. https://en.wikipedia.org/wiki/Constant_false_alarm_rate (noul 0.5573)
3. https://gru.stanford.edu/doku.php/tutorials/sdt (noul 0.7362)
4. https://engineering.purdue.edu/~mrb/resources/AltLectureF/Session_21.pdf (noul 0.7705)
5. https://en.wikipedia.org/wiki/Constant_false_alarm_rate (noul 0.5573)
6. https://openreview.net/pdf?id=yIEInigSp9 (noul 0.7453)
7. https://arxiv.org/html/2505.04835 (noul 0.6714)
8. https://synbenchmark.github.io/SynCloneBenchmark/ (noul 0.7190)
9. https://link.springer.com/chapter/10.1007/978-981-19-9697-9_28 (noul 0.6163)
10. https://ieeexplore.ieee.org/document/9578875 (noul 0.9411)
