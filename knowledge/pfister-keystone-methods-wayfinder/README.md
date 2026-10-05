# pfister-keystone-methods-wayfinder

Knowledge corpus minted 2026-10-05 from the yubi-OS/yubiOS refs/ document `pfister-keystone-methods-wayfinder-2026-09-17.md`. Topic: Pfister keystone methods applied to a corpus wayfinder API: calibration and outcome instruments, the research ingest behind them, and the shipped API change they motivated.

## Docs

- `01-pfister-research-catalog.md`: Tomas Pfister's arXiv record and its mapping onto google-research repos (tft, tabnet, fixmatch, uda, timesfm, CutPaste/SPADE, Distilling Step-by-Step, Chain of Agents) as the ingest substrate for the wayfinder transplant screen.
- `02-method-principles-constraints.md`: The six cross-cutting lessons from the Pfister catalog (encode problem structure, selective labels, interpretability as a modeling constraint, explicit distribution shift, decision-centric evaluation, positive controls) restated as hard constraints.
- `03-synthetic-positive-controls.md`: Normal-only anomaly detection needs a synthetic positive control: CutPaste self-supervised anomaly detection, SPADE, and how synthetic defects let a detector state its detection power.
- `04-transplant-screen-heuristics.md`: The ideate-solo transplant screen: 8 variations scored on painkiller strength, switching cost, defensibility under a recorded do-not-do contract, and testability, with ship, defer, and reject verdicts.
- `05-calibration-instrument.md`: The calibration instrument POST /api/map/control: a fixed CutPaste-splice recipe, an exact-corpus baseline gate, per-control deltas measured through the real preview path, and quantization-silent readings.
- `06-outcome-ledger.md`: The outcomes/1 append-only ledger: two-phase pre-registration (predicted_delta as pending, later verdict row with supersedes), a closed verdict vocabulary, refused score inputs, and contingency counts with no rates or z scores.
- `07-honesty-boundary.md`: The honesty boundary: what instrument readings and ledger rows do and do not claim, preserved recorded negatives, and the line between an instrumentation outcome and task quality.
- `08-deferred-variants-reframed.md`: Deferred variants reframed inside the honesty boundary: V3 as axis-trial/1 leave-one-out predictability against a fixed-margin null with admitted:false hard-coded, V5 as consistency/1 stability readings with caller-supplied variants and no gating.
- `09-deployment-receipts.md`: Deployment receipts as a verification discipline: byte-identical module rebuild checks, pre-upload snapshot comparison against the live worker, KV refresh, and a live smoke on a pinned frame with recorded hashes.

## Research summary

- Results collected and weighted: 131 (high (>= 0.5) 66, low (< 0.5) 65)
- Jev requests: 29 (outline score validation, 1 probe, weighting batches), usage 22533 input / 0 output tokens
- Digs: 9 subtopics, 22 queries total, 2 redos (05 calibration-instrument and 09 deployment-receipts redug with different queries under the redo rule)
- Skipped docs: none (all 9 validated subtopics authored)
- Outline validation: score metric via clef; kept 01, 02, 03, 04, 05, 06, 07, 08, 09, dropped none

Preflight 2026-10-05: searXNG 46 probe results healthy (12 engines unresponsive on the shared endpoint, 46 results still returned); /api/decide (clef) 200, probe noul 0.9437.

## Weight honesty note

Every web-sourced claim in the docs carries its source URL and the jev noul weight that backed it. Claims about the wayfinder instrument itself come from the project's own refs corpus document, cited as an internal primary source and not web-weighted.
