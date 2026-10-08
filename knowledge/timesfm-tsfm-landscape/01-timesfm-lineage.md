# 01 - TimesFM lineage: v1 to 2.0 to 2.5 to 3.0

Scope: TimesFM v1 (2023, ICML 2024) through 2.0, 2.5 and 3.0: checkpoints, parameter counts, context lengths, pretraining data, and the license boundary at 3.0.

## v1 (2023, ICML 2024)

TimesFM (Time Series Foundation Model) is a pretrained time-series foundation model from Google Research. The founding paper, "A decoder-only foundation model for time-series forecasting" (arXiv:2310.10688), was submitted on 14 Oct 2023 and was accepted at ICML 2024 (paper page https://arxiv.org/abs/2310.10688, weight 0.62). The model pretrains a patched-decoder style attention model on a large time-series corpus and reports zero-shot accuracy close to state-of-the-art supervised forecasting models trained per dataset, across different history lengths, prediction lengths, and temporal granularities (same arXiv page, weight 0.62).

The Google Research blog for v1 states the pretraining corpus was 100 billion real-world time points, the majority derived from search-interest time series (https://research.google/blog/a-decoder-only-foundation-model-for-time-series-forecasting/, weight 0.60).

## 2.0 (500M)

`timesfm-2.0-500m` is the second open checkpoint (model card: https://huggingface.co/google/timesfm-2.0-500m-pytorch). Facts from the card:

- Univariate forecasting, context lengths up to 2048 time points (the card notes the model can be pushed beyond the trained maximum context), any horizon length, with an optional frequency indicator.
- Point forecasts are the focus; 10 quantile heads are offered experimentally and are NOT calibrated after pretraining.
- The context must be contiguous (no holes); missing values are linearly interpolated before inference. Context and horizon should share a frequency.
- Load-time hyperparameters are fixed: input_patch_len=32, output_patch_len=128, num_layers=50, model_dims=1280, use_positional_embedding=False.
- The frequency indicator is categorical in {0, 1, 2}: 0 = high frequency / up to daily, 1 = weekly and monthly, 2 = beyond monthly.

Per the Google Cloud blog, the 2.0-era model is pre-trained on over 400 billion real-world time points (https://cloud.google.com/blog/products/data-analytics/timesfm-models-in-bigquery-and-alloydb, weight 0.62). A web-sourced summary (aggregator, weight 0.10 in the archive) reports that 2.0 added a subset of the LOTSA pretraining corpus; the LOTSA claim is corroborated by community material but was not confirmed against a primary source in this run, so treat it as weakly backed.

Correction recorded for this corpus: the arXiv identifier 2411.04095 that circulated in the corpus request does NOT resolve to the TimesFM 2.0 paper; it resolves to a solar-physics paper ("Simulation of solar energetic particle events...", astro-ph.SR). This mint grounds TimesFM 2.0 in the Hugging Face model card and the GitHub repo instead. No arXiv identifier for a standalone TimesFM 2.0 paper was verified during this run.

## 2.5 (200M, Sept 2025)

Per the google-research/timesfm README (https://github.com/google-research/timesfm, weight 0.60), the 15 Sept 2025 release:

- Uses 200M parameters, down from 500M.
- Supports up to 16k context length, up from 2048.
- Supports continuous quantile forecast up to 1k horizon via an optional 30M quantile head.
- Removes the `frequency` indicator entirely.

The 2.5 model card (https://huggingface.co/google/timesfm-2.5-200m-pytorch, ground source) documents: license Apache-2.0; pretraining data GiftEvalPretrain, Wikimedia Pageviews (cutoff Nov 2023), Google Trends top queries (cutoff EoY 2022), plus synthetic and augmented data; an October 2, 2025 checkpoint restructure that fused the QKV matrices into one for speed with unchanged results; and a forecast API where `use_continuous_quantile_head=True` returns quantile output of shape (horizon, 10): the mean followed by the 10th to 90th quantiles. Follow-up work through early 2026 added a Flax version, XReg covariate support, LoRA fine-tuning examples, and unit tests (README, weight 0.60).

## 3.0 (Aug 2026)

Per the same README (weight 0.60), TimesFM 3.0 shipped in August 2026:

- Native multivariate forecasting and flexible covariate support (past-only and past-and-future covariates) without per-task tuning.
- Reported rank 1 overall on fev-bench (100 tasks), rank 1 on the TIME benchmark (50 datasets, 98 tasks), and rank 1 among all foundation models on GIFT-Eval.
- The README's MLX backend section describes a 330M model with `global_context` of 15,360 and 9 quantile outputs (0.1 to 0.9). Contexts longer than global_context are truncated to their most recent points before decode.

### The 3.0 license boundary

This is the load-bearing fact for deployment decisions:

- The repository source code is Apache-2.0.
- Weights up to and including 2.5 remain Apache-2.0.
- TimesFM 3.0 pretrained weights are distributed under the separate `timesfm-non-commercial-license-v1.0` and are restricted to non-commercial, non-production use. Commercial or production use of downloaded or self-hosted 3.0 weights is not permitted.
- Commercial and production use of TimesFM 3.0 is permitted through authorized Google Cloud services such as BigQuery ML, governed by Google Cloud terms. The README's September 2026 update notes TimesFM 3.0 finished rollout in BigQuery ML.
- The 3.0 license file is at https://huggingface.co/google/timesfm-3.0-pytorch/blob/main/LICENSE (weight 0.83 in the archive).

The Google Research blog for TimesFM-3 describes single-forward-pass multivariate forecasting and claims significant outperformance of other forecasters (https://research.google/blog/timesfm-3-a-zero-shot-foundation-model-for-multivariate-forecasting/, weight 0.65).

## Distribution notes

- Current PyPI package: `pip install timesfm[torch]` or `pip install timesfm[mlx]` for Apple-silicon-native inference (README, weight 0.60).
- v1 and 2.0 code is archived in the repo's `v1` subdirectory; `pip install timesfm==1.3.0` loads the older package.
- The open checkpoints are explicitly "not an officially supported Google product"; official support paths are BigQuery ML, Google Sheets, and Vertex Model Garden (README, weight 0.60).

## Sources considered

| Source | URL | Type | Weight |
|---|---|---|---|
| TimesFM v1 paper | https://arxiv.org/abs/2310.10688 | primary (paper) | 0.62 |
| Google Research blog v1 | https://research.google/blog/a-decoder-only-foundation-model-for-time-series-forecasting/ | primary (blog) | 0.60 |
| TimesFM-3 blog | https://research.google/blog/timesfm-3-a-zero-shot-foundation-model-for-multivariate-forecasting/ | primary (blog) | 0.65 |
| google-research/timesfm README | https://github.com/google-research/timesfm | primary (repo) | 0.60 |
| TimesFM 2.0 model card | https://huggingface.co/google/timesfm-2.0-500m-pytorch | primary (model card, ground source) | direct fetch |
| TimesFM 2.5 model card | https://huggingface.co/google/timesfm-2.5-200m-pytorch | primary (model card, ground source) | direct fetch |
| TimesFM 3.0 license file | https://huggingface.co/google/timesfm-3.0-pytorch/blob/main/LICENSE | primary | 0.83 |
| BigQuery/AlloyDB blog | https://cloud.google.com/blog/products/data-analytics/timesfm-models-in-bigquery-and-alloydb | primary (vendor blog) | 0.62 |
| BigQuery docs page | https://docs.cloud.google.com/bigquery/docs/timesfm-model | primary (docs) | 0.59 |
| Community 2.5 summary | https://explainx.ai/blog/google-timesfm-2-5-time-series-foundation-model-2026 | aggregator | 0.44 |
| LOTSA mention | (web search summary) | aggregator | 0.10 |
