# 01: Clairic System One Extraction and Density Forecasting

**Scope:** Cloudflare Clairic (`@cf/cloudflare/clairic`) single-pass prefill extraction, character-offset spans, `p_null`, and 99-quantile short-horizon density forecasting vs LLMTime.

**Ground source:** `yubi-OS/yubiOS refs/timesfm-clairic-clef-2026-10-21.md` (Sections 1.1, 1.2, 3.2).

**Primary dig backing:** the Cloudflare launch post https://blog.cloudflare.com/clairic-extraction-model/ (clef weight: 0.9267) and the Workers AI concept page https://developers.cloudflare.com/workers-ai/concepts/extraction-models/ (clef weight: 0.8985).

## 1. What Clairic is

Cloudflare describes Clairic as "a System One extraction model, capable of extracting, computing, estimating, and forecasting data from unstructured inputs" (https://blog.cloudflare.com/clairic-extraction-model/, clef weight: 0.9267). The Workers AI docs use the same four verbs for the extraction-model class: models that "extract, compute, estimate, and forecast typed values", where the results have to be interpreted per type (https://developers.cloudflare.com/workers-ai/concepts/extraction-models/, clef weight: 0.8985).

Secondary coverage repeats that Clairic "returns typed values in a single pass rather than generating text" and sits as the first stage of a pipeline feeding decision models (https://www.unite.ai/cloudflare-releases-clairic-its-first-system-one-extraction-model/, clef weight: 0.1156, weak backing, clef weight < 0.5). A MarkTechPost write-up traces the "System One" name to Kahneman's fast, intuitive mode of thinking (https://www.marktechpost.com/2026/10/20/cloudflare-releases-clairic-a-system-one-extraction-model-on-workers-ai/, clef weight: 0.2592, weak backing, clef weight < 0.5). Neither secondary source is load-bearing. They only back up the primary framing.

## 2. Single prefill pass vs token-by-token generation

Per the ground source, Clairic and Clef both run a **single prefill-only forward pass** over the input state. The context window on Workers AI is 65,536 tokens, vision is enabled, and billing covers input tokens only (`output_tokens: 0`). Clairic attaches typed regression, span-extraction, and density-estimation heads to that pass and costs $0.10 per 1M input tokens. These figures come from the ground source's live verification, not from a dig snippet.

In practice this means there is no sampling loop. That removes output-token cost, and numeric outputs are never tokenized.

## 3. Supported field types

The ground source records the live schema (`GET /accounts/{id}/ai/models/schema?model=@cf/cloudflare/clairic`) as supporting:

- `text`, `number`, `date`, `time`, `datetime`, `duration`
- `list` (items: `text | number | date`)
- `estimate` (`min`, `max`, `step`, `scale: linear | log`)
- `forecast` (`horizon: 1..64`, `interval: step | minute | hour | day | week | month | quarter | year`, `min`, `max`, `scale`)

A forecast field returns `value`, `median`, `p10`, `p90`, and 99 `quantiles` per step. Extracted fields carry a character-offset `span` and a `p_null`, the probability that the field is absent.

## 4. Live verification results (2026-10-21)

From the ground source's two live inference passes:

| Field | Result |
|---|---|
| `latest_anomaly_note` | `"sermon S5 W8 deploy"`, span `[373, 392]`, `p_null` 0.001148, confidence 0.9947 |
| `extracted_dbc_series` | `[17.82, 18.04, 18.31, 18.12, 18.45, 18.62, 18.79]`, per-item confidence 0.899 to 0.998 |
| `dbc_forecast_3d` median | `[18.9, 19.1, 19.2]` |
| `dbc_forecast_3d` p10 / p90 | `[18.2, 18.2, 18.3]` / `[19.8, 19.9, 20.0]` |
| Cost | 1,450 input tokens, 0 output tokens, 99 percentiles per step |

The span is the guard against hallucinated extractions: a downstream gate can slice the source text at `[start, end]` and check that the extracted string matches. The harness in doc 06 re-checks this on a 28-row messy log (span `[874, 893]`).

## 5. Published benchmark and documented failure mode

The ground source cites the Cloudflare post (https://blog.cloudflare.com/clairic-extraction-model/, clef weight: 0.9267) for a TSA passenger benchmark: 3.3% MAPE across 21 one-day-ahead forecasts, with 17 of 21 days (80.95%) inside the predicted 80% interval `[p10, p90]`. Three of the 4 misses fell on the Columbus Day holiday weekend, because the text history had no holiday covariates. That failure mode is why Clairic is not the primary forecaster in this cascade. When known-future covariates drive the series, the cascade routes to TimesFM instead (docs 02 and 03).

## 6. Contrast baseline: LLMTime

LLMTime encodes "time series as a string of numerical digits" and frames forecasting "as next-token prediction in text" (https://arxiv.org/abs/2310.07820, clef weight: 0.4424, weak backing, clef weight < 0.5; HTML mirror https://arxiv.org/html/2310.07820v3, clef weight: 0.3415, weak backing, clef weight < 0.5). The reference implementation samples "possible extrapolations as text completions" (https://github.com/ngruver/llmtime, clef weight: 0.5373).

The ACL 2025 revisit finds that "LLM-based zero-shot forecasters often struggle to achieve high" accuracy against domain-specific models, and that small noise can break them (https://aclanthology.org/2025.acl-short.71.pdf, clef weight: 0.4671, weak backing, clef weight < 0.5; companion code https://github.com/junwoopark92/revisiting-LLMs-zeroshot-forecaster, clef weight: 0.2278, weak backing, clef weight < 0.5).

These Clef weights are low for a reason. The weighting question asked whether each result is an authority for *Clairic* claims, and the ground source separately scored `arXiv:2310.07820` as a System One authority at 0.0217 ("contrast baseline only"). LLMTime appears here only as the autoregressive contrast, never as evidence for how Clairic behaves.

| Axis | LLMTime | Clairic |
|---|---|---|
| Decoding | K sampled token rollouts | 1 prefill pass |
| Output cost | Output tokens per sample | 0 output tokens |
| Uncertainty | Empirical over samples | 99 native quantiles |
| Grounding | None | Character-offset `span` + `p_null` |

## 7. Role in the cascade

Clairic is Stage 1 (`clairic_extract_and_forecast`). It turns messy logs, CSV exports, and deploy notes into a typed series, covariates, a grounded anomaly note, and a short-horizon density forecast. It never authorizes action. Its outputs feed TimesFM (Stage 2) and Clef (Stage 3).

## Sources Considered

| # | URL | Clef weight | Backing | Used for |
|---|---|---|---|---|
| G | `yubi-OS/yubiOS refs/timesfm-clairic-clef-2026-10-21.md` | n/a (ground source) | Ground | Schema, live results, pricing, TSA benchmark |
| 1 | https://blog.cloudflare.com/clairic-extraction-model/ | 0.9267 | Authoritative | Definition, TSA benchmark |
| 2 | https://developers.cloudflare.com/workers-ai/concepts/extraction-models/ | 0.8985 | Authoritative | Extraction-model class |
| 3 | https://github.com/ngruver/llmtime | 0.5373 | Authoritative | LLMTime method |
| 4 | https://aclanthology.org/2025.acl-short.71.pdf | 0.4671 | Weak backing, clef weight < 0.5 | LLMTime fragility |
| 5 | https://arxiv.org/abs/2310.07820 | 0.4424 | Weak backing, clef weight < 0.5 | LLMTime contrast |
| 6 | https://arxiv.org/html/2310.07820v3 | 0.3415 | Weak backing, clef weight < 0.5 | LLMTime contrast |
| 7 | https://www.marktechpost.com/2026/10/20/cloudflare-releases-clairic-a-system-one-extraction-model-on-workers-ai/ | 0.2592 | Weak backing, clef weight < 0.5 | Naming context |
| 8 | https://github.com/junwoopark92/revisiting-LLMs-zeroshot-forecaster | 0.2278 | Weak backing, clef weight < 0.5 | Revisit code |
| 9 | https://www.unite.ai/cloudflare-releases-clairic-its-first-system-one-extraction-model/ | 0.1156 | Weak backing, clef weight < 0.5 | Corroboration only |
| 10 | https://lapaasvoice.com/cloudflare-launches-clairic-an-ai-model-for-data-extraction-calculations-and-forecasting/ | 0.0871 | Weak backing, clef weight < 0.5 | Not cited |
