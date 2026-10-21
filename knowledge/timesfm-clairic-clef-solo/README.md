# Knowledge Corpus: TimesFM + Clairic + Clef Forecasting Cascade (ideate-solo)

**Corpus path:** `knowledge/timesfm-clairic-clef-solo/`

**Topic:** Autonomous Ideation (ideate-solo) of the Hybrid TimesFM 2.5->3.0 + Clairic + Clef Cascade (Variations V1-V6, Heuristic & Clef Scoring, Stress-Test).

**Ground source:** `yubi-OS/yubiOS refs/timesfm-clairic-clef-solo-2026-10-21.md`

This corpus documents a single ideate-solo run (2026-10-21) that designed a 3-stage forecasting cascade for the `yubi-OS/yubiOS` and `/jev/` fail-closed orchestration architecture: Cloudflare Clairic for messy-document intake, TimesFM 2.5 as the Apache-2.0 primary forecaster with a pre-registered fallback gate to TimesFM 3.0, and Cloudflare Clef plus a deterministic gate for decisions. The finalist was V6, the Unified SCAMPER Cascade Tool, at `tools/timesfm-clairic-clef/`.

## Documents

Outline validated with one clef `score` request (criteria lowest-first: padding: drop / marginal: keep only if the dig comes back strong / load-bearing: core subtopic). All 6 subtopics kept; 0 dropped.

| NN | Doc | Scope | Outline score | Dig |
|---|---|---|---|---|
| 01 | [01-problem-framing-and-system-one-taxonomy.md](01-problem-framing-and-system-one-taxonomy.md) | Problem statement and System One (Clairic extract, Clef decide) vs System Two (LLM) vs Patched TSFM (TimesFM 2.5/3.0) division of labor. | 1.6959 | searXNG + clef, 10 results |
| 02 | [02-five-lens-variation-generation-v1-to-v6.md](02-five-lens-variation-generation-v1-to-v6.md) | Divergent generation across Inversion, Constraint Removal, Audience Shift, Combination, Simplification, and Unified Cascade (V1 to V6). | 1.8971 | internal record |
| 03 | [03-clef-and-heuristic-convergence-scoring.md](03-clef-and-heuristic-convergence-scoring.md) | 4-heuristic scoring paired with live Clef `/api/decide` scoring (V6 2.8804/3.0, choice p=0.9598; V2 rejected at 0.4433). | 1.9308 | searXNG + clef, 10 results |
| 04 | [04-finalist-stress-testing-and-untestable-bets.md](04-finalist-stress-testing-and-untestable-bets.md) | Stress-test of finalists V6, V5, V4: conformal breakdown under regime shifts, non-commercial 3.0 weights, wire-schema drift. | 1.8305 | internal record |
| 05 | [05-validated-assumptions-a1-to-a4.md](05-validated-assumptions-a1-to-a4.md) | Validation of A1 (Clairic schema/spans), A2 (conformal G2 80/100), A3 (MASE 1.0827->0.0545), A4 (Clef risk separation). | 1.7685 | internal record |
| 06 | [06-mvp-scope-and-explicit-non-goals.md](06-mvp-scope-and-explicit-non-goals.md) | MVP scope in `tools/timesfm-clairic-clef/` and Not-Doing boundaries (no unconditional 3.0, no LLMTime, no gate bypass). | 1.5684 | internal record |

Docs 02, 04, 05, and 06 are internal-record subtopics grounded in yubi-OS/yubiOS refs/timesfm-clairic-clef-solo-2026-10-21.md, with no external web dig. Docs 01 and 03 cite clef-weighted searXNG results inline with their weights; every result with clef weight < 0.5 is labeled weak backing.

## Research Summary

| Metric | Value |
|---|---|
| Results collected | 20 (10 for doc 01, 10 for doc 03) |
| High weight (>= 0.5) | 4 |
| Low weight (< 0.5) | 16 |
| jev requests | 5 |
| Redos | 0 |
| Skips | 0 |

High-weight sources (all Cloudflare primary):

| Doc | URL | Clef weight |
|---|---|---|
| 01 | https://blog.cloudflare.com/clairic-extraction-model/ | 0.9143 |
| 01 | https://developers.cloudflare.com/changelog/post/2026-10-19-clairic-workers-ai/ | 0.7401 |
| 03 | https://blog.cloudflare.com/clef-decision-models/ | 0.7523 |
| 03 | https://developers.cloudflare.com/changelog/post/2026-10-01-clef-workers-ai/ | 0.7342 |

**Preflight:** Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200

## Known Gaps

- TimesFM paper sources (arXiv 2310.10688, PMLR v235, Google Research) all scored below 0.5 for doc 01's question; TimesFM 2.5 and 3.0 version details rest on the ground source, not the dig.
- Clef calibration details (Brier loss, LoRA rank, backbone size) appear only in weakly backed secondary sources (doc 03).
- MCDA literature returned no source above 0.5; doc 03 treats it as context only.
