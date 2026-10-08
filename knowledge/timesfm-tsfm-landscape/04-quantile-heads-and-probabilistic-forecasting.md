# 04 - Quantile heads and probabilistic forecasting

Scope: Quantile heads and probabilistic forecasting in TSFMs: TimesFM 2.5 continuous quantile head, Chronos sample-based quantiles, Lag-Llama probabilistic decoding, quantile crossing.

## TimesFM: from experimental heads to a calibrated continuous head

TimesFM 2.0 (500M) offered 10 quantile heads experimentally, explicitly NOT calibrated after pretraining (model card: https://huggingface.co/google/timesfm-2.0-500m-pytorch, ground source). Point forecasts were the design focus.

TimesFM 2.5 changed that: it "supports continuous quantile forecast up to 1k horizon via an optional 30M quantile head" (repo README: https://github.com/google-research/timesfm, weight 0.60). The API reference documents the switch as `use_continuous_quantile_head` (default False; True is recommended for more accurate prediction intervals, especially for longer horizons) (https://github.com/google-research/timesfm/blob/master/timesfm-forecasting/references/api_reference.md, weight 0.82).

The 2.5 model card's forecast example (ground source) shows the output contract: `point_forecast` of shape (batch, horizon) and `quantile_forecast` of shape (batch, horizon, 10), where index 0 is the mean followed by the 10th through 90th quantiles. The compile-time flags that shape probabilistic output: `use_continuous_quantile_head=True`, `fix_quantile_crossing=True` (quantile crossing repair), `force_flip_invariance` (per configs.py: TimesFM(aX + b) = a * TimesFM(x) + b holds for a >= 0 by default; the flag extends it to a < 0) (https://github.com/google-research/timesfm/blob/master/src/timesfm/configs.py, weight 0.81).

TimesFM 3.0 returns 9 quantiles (0.1 to 0.9) when `return_quantiles=True` (repo README, weight 0.60).

## Chronos

Chronos is framed as "a simple yet effective framework for pretrained probabilistic time series models" (paper abstract: https://arxiv.org/abs/2403.07815, weight 0.81). Its probabilistic outputs come from the language-model design: tokenized values with scaling and quantization, T5-family backbones from 20M to 710M parameters, cross-entropy training (same paper, weight 0.81). The paper's benchmark evidence is about accuracy, not calibration: dominance on in-corpus datasets, comparable-to-superior zero-shot elsewhere across 42 datasets.

## Lag-Llama

Lag-Llama is "a general-purpose foundation model for univariate probabilistic time series forecasting" built on a decoder-only transformer using lags as covariates (paper: https://arxiv.org/abs/2310.08278, weight 0.82). The official repo describes it as a probabilistic forecasting model trained to output a probability distribution for each timestep to be predicted, and recommends benchmarking zero-shot performance on your own use case before adoption (https://github.com/time-series-foundation-models/lag-llama, weight 0.81). The paper reports strong zero-shot generalization across domains and state-of-the-art performance after fine-tuning on small fractions of previously unseen datasets.

## Moirai 2.0

Moirai 2.0 adopts quantile forecasting with a quantile loss and recursive multi-quantile decoding, replacing Moirai 1.0's mixture-distribution outputs; the ablation attributes the gains to the decoder-only backbone plus that multi-quantile decoding (paper: https://arxiv.org/abs/2511.11698, ground source).

## Quantile crossing as a named failure mode

The TimesFM 2.5 configuration surface treats quantile crossing as a first-class problem with a dedicated flag: `fix_quantile_crossing`, described in configs.py as addressing "quantile collapsing" (weight 0.81). That is the clearest in-source statement that uncorrected quantile heads can produce crossing quantiles, which is why the 2.5 card example enables the flag alongside the continuous head.

## Gaps in this doc

- The Lag-Llama paper's specific output distribution family is not quoted in the weighted sources collected this run; only its probabilistic per-timestep design is grounded. Distribution-family claims (for example Student-t decoding) are NOT asserted here.
- Calibration metrics for the TimesFM 2.5 head come from the API reference's qualitative recommendation, not from a measured calibration study; no CRPS numbers for TimesFM itself are grounded in this run's sources (benchmark-level CRPS is covered in doc 05).

## Sources considered

| Source | URL | Type | Weight |
|---|---|---|---|
| TimesFM 2.5 API reference | https://github.com/google-research/timesfm/blob/master/timesfm-forecasting/references/api_reference.md | primary (code/docs) | 0.82 |
| TimesFM configs.py | https://github.com/google-research/timesfm/blob/master/src/timesfm/configs.py | primary (code) | 0.81 |
| TimesFM repo README | https://github.com/google-research/timesfm | primary (repo) | 0.60 |
| TimesFM 2.0 model card | https://huggingface.co/google/timesfm-2.0-500m-pytorch | primary (model card, ground source) | direct fetch |
| TimesFM 2.5 model card | https://huggingface.co/google/timesfm-2.5-200m-pytorch | primary (model card, ground source) | direct fetch |
| Chronos paper | https://arxiv.org/abs/2403.07815 | primary (paper) | 0.81 |
| Lag-Llama paper | https://arxiv.org/abs/2310.08278 | primary (paper) | 0.82 |
| Lag-Llama repo | https://github.com/time-series-foundation-models/lag-llama | primary (repo) | 0.81 |
| Moirai 2.0 paper | https://arxiv.org/abs/2511.11698 | primary (paper, ground source) | direct fetch |
| Foundation Model Forecasts: Form and Function | https://arxiv.org/html/2510.19345v1 | primary (paper) | 0.34 |
| TimesFM 2.5 quantile application note | https://medium.com/@nasdag/timesfm-2-5-quantile-forecasting-for-inventory-planning | third-party blog | 0.35 |
