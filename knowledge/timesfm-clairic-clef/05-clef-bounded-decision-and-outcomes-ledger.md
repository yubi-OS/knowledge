# 05: Clef Bounded Decision and Outcomes Ledger

**Scope:** Cloudflare Clef (`@cf/cloudflare/clef`) choice/noul/score decision routing, the AGENT.md fail-closed gate invariant, and `/api/jev/map/outcomes` pre-registration.

**Ground source:** `yubi-OS/yubiOS refs/timesfm-clairic-clef-2026-10-21.md` (TL;DR item 1, Section 1.1, Section 3.1, Section 3.2).

**Primary dig backing:** the Workers AI model page https://developers.cloudflare.com/workers-ai/models/clef/ (clef weight: 0.8783), the launch changelog https://developers.cloudflare.com/changelog/post/2026-10-01-clef-workers-ai/ (clef weight: 0.7103), and the launch blog https://blog.cloudflare.com/clef-decision-models/ (clef weight: 0.6534).

## 1. What Clef is

The model page describes Clef as "a 27B multimodal decision model that turns a state and a schema of typed questions into decisions. It reads the state as text, JSON, images, or video, and returns a probability for every allowed option of every q[uestion]" (https://developers.cloudflare.com/workers-ai/models/clef/, clef weight: 0.8783).

The changelog states that Clef and Clef-flash are "the first models trained by the Cloudflare Workers AI team" and "decision models that return typed answers with probabilities", which "lead 7 of 10 decision benchmarks, run up to 13x faster" (https://developers.cloudflare.com/changelog/post/2026-10-01-clef-workers-ai/, clef weight: 0.7103). The blog adds that both are open-source, hosted on Workers AI, and launched together with "a new reinforcement learning platform" for fine-tuning (https://blog.cloudflare.com/clef-decision-models/, clef weight: 0.6534).

The ground source adds model-family detail: `@cf/cloudflare/clef` (27B, Qwen3.8 backbone), `@cf/cloudflare/clef-flash` (9B), and `@cf/cloudflare/clef-omni` (30B MoE, 3B active). It also describes two-stage cross-attention with rank-256 LoRA, trained with label-smoothed cross-entropy, Brier loss, and Reinforcement Learning for Calibrated Decisions (RLCD). Like Clairic, Clef runs a single prefill pass with `output_tokens: 0`.

Two explainer pages repeat the launch date and the question types ("yes/no (noul), multiple-choice (cho[ice])") (https://ai-tldr.dev/models/clef/, clef weight: 0.0936, weak backing, clef weight < 0.5; https://cldnavi.com/en/blog/cloudflare-clef-decision-models-2026/, clef weight: 0.0926, weak backing, clef weight < 0.5). They are not load-bearing.

## 2. The three question types and how the cascade uses them

Stage 3 (`clef_decide_and_gate`) sends one `/api/decide` request with three questions (internal README, Stage 3):

| Question | Type | Options | Purpose |
|---|---|---|---|
| `action_choice` | `choice` | `act`, `wait`, `review`, `fallback_ets` | Recommended disposition |
| `band_calibrated` | `noul` | probability of true | Is the `[p10, p90]` band trustworthy |
| `operational_risk` | `score` | 0 to 3 rubric | Risk level |

The state Clef reads is built from the winning forecast's median, `[p10, p90]` width, rolling-origin MASE, `PICP_80`, pinball loss, the fallback triggers that fired (doc 04), and the Clairic anomaly note with its span (doc 01).

The same three types appear across this project's tooling: the corpus outline in this repo was validated with `score`, and every dig result was weighted with `noul`.

## 3. Live decisions recorded

From the ground source's Section 3.2:

| Path | `action_choice` | `band_calibrated` | Active model |
|---|---|---|---|
| Clean 28-day log | `wait` (0.8551) | 0.9288 | `timesfm-2.5` |
| Covariate-shock series | `review` (0.7545) | 0.9714 | `timesfm-3.0` |

Clef recommended `review` on the escalated path even though band calibration was high. That fits the license boundary and the regime shift it was shown.

## 4. The fail-closed invariant: probabilities advise, never authorize

`AGENT.md`'s core invariant (ground source Section 3.1 item 1): no model, whether Clairic, TimesFM 2.5, TimesFM 3.0, or Clef, can directly authorize an external action. Clef's answers are advisory inputs to a deterministic policy gate, and the gate makes the decision.

The gate forces `gate_disposition: "needs_approval"`, overriding any Clef `act` (internal README, Stage 3), when any of these hold:

- the interval is uncalibrated (`is_cal` false);
- `MASE > 1.0`;
- the active forecast came from TimesFM 3.0 downloadable weights under `commercial_mode=True`, with `gate_reasons: ["timesfm_30_non_commercial_weights"]`.

Separately, a series shorter than 16 points returns `forecast = None` and `gate_disposition = "blocked"` (harness gate G4, doc 06).

Gate G8 tests the hardest case: a caller sets `clef_override: "act"`, and the gate still returns `needs_approval` (ground source Section 3.1 item 3 and Section 4).

## 5. Outcomes pre-registration

Before any forecast-driven action can run, Stage 3 emits an append-only pre-registration record for `POST /api/jev/map/outcomes` (ground source Section 3.1 item 2):

```json
{
  "endpoint": "POST /api/jev/map/outcomes",
  "baseline_id": "...",
  "target": "timeseries:<series>:<model>",
  "predicted_delta": "...",
  "predicted_value_h1": "...",
  "predicted_band_h1": "...",
  "verdict": "pending",
  "task_check": "...",
  "verifier": "..."
}
```

The prediction is committed before the outcome is known, with `verdict: "pending"`. That turns every forecast-driven action into a scored experiment the outcomes ledger can resolve later, and keeps a model from claiming credit after the fact.

## 6. Adjacent literature (weak backing)

The forecast-then-optimize and decision-focused-learning literature is the academic neighbor of this design. The FTO survey notes that "raw predictions from sophisticated models often harbor systematic errors and biases" (https://arxiv.org/abs/2506.13036, clef weight: 0.0324, weak backing, clef weight < 0.5; summary mirror https://arxiv.deeppaper.ai/papers/2506.13036v1, clef weight: 0.0283, weak backing, clef weight < 0.5). DFF describes decision-focused learning as "training predictive models directly on decision loss" (https://arxiv.org/abs/2501.01874, clef weight: 0.0169, weak backing, clef weight < 0.5). A 2025 paper applies decision-focused fine-tuning to time-series foundation models (https://www.sciencedirect.com/science/article/pii/S2666546825000655, clef weight: 0.0242, weak backing, clef weight < 0.5).

All of these weighted near zero because the weighting question asked about *Clef* specifically. The cascade does not do decision-focused training. It keeps the forecaster frozen and puts a bounded decision model plus a deterministic gate on top. An unrelated detection paper (https://proceedings.mlr.press/v54/adams17a.html, clef weight: 0.0256, weak backing, clef weight < 0.5) is not cited.

## Sources Considered

| # | URL | Clef weight | Backing | Used for |
|---|---|---|---|---|
| G | `yubi-OS/yubiOS refs/timesfm-clairic-clef-2026-10-21.md` | n/a (ground source) | Ground | Model family, invariant, outcomes record, live decisions |
| 1 | https://developers.cloudflare.com/workers-ai/models/clef/ | 0.8783 | Authoritative | Model definition |
| 2 | https://developers.cloudflare.com/changelog/post/2026-10-01-clef-workers-ai/ | 0.7103 | Authoritative | Launch facts, benchmarks |
| 3 | https://blog.cloudflare.com/clef-decision-models/ | 0.6534 | Authoritative | Open-source, RL platform |
| 4 | https://ai-tldr.dev/models/clef/ | 0.0936 | Weak backing, clef weight < 0.5 | Question types |
| 5 | https://cldnavi.com/en/blog/cloudflare-clef-decision-models-2026/ | 0.0926 | Weak backing, clef weight < 0.5 | Explainer |
| 6 | https://arxiv.org/abs/2506.13036 | 0.0324 | Weak backing, clef weight < 0.5 | FTO context |
| 7 | https://arxiv.deeppaper.ai/papers/2506.13036v1 | 0.0283 | Weak backing, clef weight < 0.5 | FTO mirror |
| 8 | https://proceedings.mlr.press/v54/adams17a.html | 0.0256 | Weak backing, clef weight < 0.5 | Off-topic, not cited |
| 9 | https://www.sciencedirect.com/science/article/pii/S2666546825000655 | 0.0242 | Weak backing, clef weight < 0.5 | DFL on TSFMs |
| 10 | https://arxiv.org/abs/2501.01874 | 0.0169 | Weak backing, clef weight < 0.5 | DFL definition |
