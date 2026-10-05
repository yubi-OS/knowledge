# rate-dependent-scorer-decision

Knowledge corpus minted 2026-10-05 from the yubiOS refs decision doc `rate-dependent-scorer-decision-2026-10-02.md` (source: yubi-OS/yubiOS refs/). Topic: rate-dependent scoring in corpus audits, why a deterministic scorer collapses the recovery fraction R to a constant, and the decision to adopt multi-pass re-grading as the rate dimension.

## Docs

| NN | doc | one-line scope |
|---|---|---|
| 01 | [01-recovery-fraction-collapse.md](01-recovery-fraction-collapse.md) | The F3 replay finding: a deterministic scorer re-grades identically, so R collapses to 1.0 and carries no rate information. |
| 02 | [02-viscoelastic-instrument-analogy.md](02-viscoelastic-instrument-analogy.md) | The creep/recovery to corpus-audit mapping, and the /visco/persistence endpoint that already consumes a multi-pass shape. |
| 03 | [03-multi-pass-regrading-protocol.md](03-multi-pass-regrading-protocol.md) | Option B: K independent grader passes (K = 2 minimum) over edited rows only, pass spread as the rate dimension. |
| 04 | [04-grader-noise-and-measurement-uncertainty.md](04-grader-noise-and-measurement-uncertainty.md) | Grader variance as instrument noise: inter_pass_offset_dbc, per_pass_fractions, and the 0.64 dBc effect inside a 5.77 dBc pass band. |
| 05 | [05-temperature-sampled-stochastic-scorers.md](05-temperature-sampled-stochastic-scorers.md) | Option C: a grader sampled at T greater than 0 as a noise-temperature instrument, its WLF analogy, and why it was rejected for now. |
| 06 | [06-status-quo-persistence-first.md](06-status-quo-persistence-first.md) | Option A: deterministic scorer, persistence-first discipline (9/9 under blind re-grading), R documented as trivially 1. |
| 07 | [07-runbook-amendment-decision-governance.md](07-runbook-amendment-decision-governance.md) | How the B decision ships: runbook amendment not code, the re-evaluation trigger, and the jev qualification record. |
| 08 | [08-inter-rater-reliability-prior-art.md](08-inter-rater-reliability-prior-art.md) | Measurement-theory grounding: test-retest reliability, ICC, Krippendorff alpha, and self-consistency sampling. |

## Research summary

- Results collected: 96 (16 seed queries, 8 subtopics x 2 queries, top 6 per query).
- Weight split: 52 results at weight >= 0.5 (authoritative backing), 44 below 0.5 (weak backing, labeled in text where used).
- Jev requests: 22 successful (1 preflight score probe, 1 outline validation with 8 questions, 20 noul weighting batches of 5). Usage: 17346 input tokens, 0 output tokens. 2 HTTP 429 retries were recovered by the redo rule; no results shipped unweighted.
- Outline validation: all 8 subtopics scored above 0 (t01 1.66, t02 1.15, t03 1.70, t04 1.12, t05 0.73, t06 1.55, t07 1.87, t08 1.14); none dropped. t05 was marginal and was kept only because its dig came back strong (4 high-weight sources).
- Dig redos: 0. All 16 queries returned 200 on the first attempt.
- Skipped docs: none. All 8 subtopics authored.

## Research-db

Under `research-db/`: `preflight.json`, `outline.json`, `archive.json` (96 weighted entries), `jev-log.json`, `db.ts` (schema v2 interfaces), and `digs/01..08-<slug>.json` per-subtopic dig records.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.
