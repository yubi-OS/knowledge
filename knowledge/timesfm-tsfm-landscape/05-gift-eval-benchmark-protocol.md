# 05 - GIFT-Eval benchmark protocol

Scope: The GIFT-Eval benchmark protocol: 23 datasets, 7 domains, frequency and horizon ranges, metrics (CRPS, MASE, MSE), model types, leakage tracking, submission mechanics.

## What GIFT-Eval is

GIFT-Eval (General Time Series Forecasting Model Evaluation) is Salesforce Research's benchmark for general time-series forecasting model evaluation, introduced in arXiv:2410.10393, designed to advance zero-shot time-series forecasting by evaluating across diverse datasets (repo README: https://github.com/SalesforceAIResearch/gift-eval, weight 0.58; paper HTML: https://arxiv.org/html/2410.10393v2, weight 0.58).

Scale, from the primary sources: 23 datasets encompassing 144,000 time series and 177 million data points across seven domains and 10 frequencies, with prediction lengths from short to long term and both univariate and multivariate data (Hugging Face dataset card: https://huggingface.co/datasets/Salesforce/GiftEval, weight 0.56; paper HTML, weight 0.58).

## Position vs prior benchmarks

The README's own comparison table (weight 0.58) is the cleanest statement of what GIFT-Eval adds:

| Benchmark | Freq. Range | Domains | Pretraining data | Variates | Pred. Len. | Methods | Prob. Forecasting |
|---|---|---|---|---|---|---|---|
| Monash | Secondly ~ Yearly | 7 | No | Uni | Short | Stat./DL | No |
| TFB | Minutely ~ Yearly | 6 | No | Uni/Multi | Short | Stat./DL | No |
| LTSF | Minutely ~ Weekly | 5 | No | Multi | Long | Stat./DL | No |
| BasicTS+ | Minutely ~ Daily | 3 | No | Multi | Short/Long | Stat./DL | No |
| GIFT-Eval | Secondly ~ Yearly | 7 | Yes | Uni/Multi | Short/Long | Stat./DL/FM | Yes |

The "pretraining data: Yes" column means GIFT-Eval also ships a non-leaking pretraining dataset, GiftEvalPretrain, specifically to support foundation-model pretraining and evaluation (README, weight 0.58; dataset at https://huggingface.co/datasets/Salesforce/GiftEvalPretrain).

## Protocol mechanics

Task space. The benchmark evaluates 97 dataset configurations. Submission CSVs must contain 98 lines (1 header + 97 configurations) and exactly 15 columns: 4 metadata columns (dataset, model, domain, num_variates) plus 11 evaluation metric columns (README, weight 0.58). Dataset configuration names follow the `dataset_name/freq/term` format, for example `electricity/15T/short`; the sample output columns show metric names of the form `eval_metrics/MSE[mean]` and `eval_metrics/MSE[0.5]`.

Metrics. The leaderboard ranking machinery uses CRPS and MASE: the README's 2025-08-05 update added `MASE_Rank` "aligned with the ranking scheme used for CRPS_Rank", and a third-party leaderboard mirror describes Average Rank computed across the 97 dataset-configuration pairs by CRPS as the primary metric (README, weight 0.58; https://benchmarklist.com/benchmarks/gift_eval/, weight 0.59, third-party). The MSE[...] columns in the sample output show point-forecast error is also recorded. The exact full list of the 11 metric columns is not enumerated in the README text fetched this run; that enumeration is a known gap.

Evaluation conventions. Submissions should evaluate with gluonts `evaluate_model` using: aggregate results over all dimensions (`axis=None`), do not count NaN targets toward calculation (`mask_invalid_label=True`), and ensure predictions contain no NaN (`allow_nan_forecast=False`), with seasonality set per dataset (README, weight 0.58).

Model types. `config.json` must declare one of: `statistical`, `deep-learning`, `agentic`, `pretrained`, `zero-shot`, or `fine-tuned` (README, weight 0.58). The distinction rules:

- `pretrained`: trained once on large-scale data, applied as-is; the pretraining corpus MAY include GIFT-Eval train splits.
- `zero-shot` (added 2025-08-25): must both not leak test data AND not train on any GIFT-Eval train split (README discussion-47 cited as the source of the rule).
- `fine-tuned`: starts from a completed pretrained checkpoint and trains further on GIFT-Eval train/validation data, covering both per-dataset fine-tuning (separate weights for each of the 97 tasks) and continual pretraining.

Leakage tracking. Since the 2025-08-05 update the leaderboard carries a binary `TestData Leakage` column: any training-data overlap with the GIFT-Eval TEST corpus must be labeled Yes; training solely on the provided train split does not count as leaking because train splits use earlier horizons that do not overlap the test set (README, weight 0.58).

Submission. Results are submitted by pull request, adding `results/<MODEL_NAME>/` with exactly two files: `all_results.csv` and `config.json` (fields: model, model_type, model_dtype, model_link, code_link, org, testdata_leakage, replication_code_available). Validation runs via `python scripts/validate_results.py results/<MODEL_NAME>` (README, weight 0.58). A 2025-10-17 update added the replication-code column, with a notebook in the GIFT-Eval repo as the preferred sharing form. The leaderboard itself lives at https://huggingface.co/spaces/Salesforce/GIFT-Eval (weight 0.57).

## Why it matters for the corpus

GIFT-Eval is the shared scoreboard the lineage in doc 01 and the landscape in doc 03 reference: TimesFM 2.5 pretrains on GiftEvalPretrain (doc 01), Moirai 2.0 claims "among the top pretrained models" on Gift-Eval (doc 03), and TimesFM 3.0 claims rank 1 among foundation models (doc 01). The zero-shot tag rules and the leakage column are what make those claims comparable.

## Sources considered

| Source | URL | Type | Weight |
|---|---|---|---|
| gift-eval README | https://github.com/SalesforceAIResearch/gift-eval | primary (repo, ground source) | 0.58 |
| GIFT-Eval paper HTML | https://arxiv.org/html/2410.10393v2 | primary (paper) | 0.58 |
| GiftEval dataset card | https://huggingface.co/datasets/Salesforce/GiftEval | primary (dataset card) | 0.56 |
| GIFT-Eval leaderboard space | https://huggingface.co/spaces/Salesforce/GIFT-Eval | primary (leaderboard) | 0.57 |
| Salesforce blog (GIFT-Eval) | https://www.salesforce.com/blog/gift-eval-time-series-benchmark/ | primary (blog) | 0.27 |
| BenchmarkList mirror | https://benchmarklist.com/benchmarks/gift_eval/ | third-party aggregator | 0.59 |
| TSFM.ai deep dive | https://tsfm.ai/blog/gift-eval-deep-dive | third-party blog | 0.55 |
| TSFM.ai leaderboard page | https://tsfm.ai/benchmarks/gift-eval | third-party aggregator | 0.54 |
| Papers with Code mirror | https://paperswithcode.co/benchmark/gift-eval | third-party aggregator | 0.51 |
