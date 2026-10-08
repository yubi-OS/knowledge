# 03 - TSFM landscape comparison

Scope: TimesFM vs Chronos, Moirai 2.0, Lag-Llama and TTM: tokenization vs patching, sizes, probabilistic outputs, and where each sits on GIFT-Eval.

## Chronos (Amazon, arXiv:2403.07815)

Chronos is the language-model route: it tokenizes time series values using scaling and quantization into a fixed vocabulary, then trains existing transformer-based language-model architectures on those tokens with the cross-entropy loss (paper: https://arxiv.org/abs/2403.07815, weight 0.81; full text https://arxiv.org/html/2403.07815v1, weight 0.83). Pretrained models are built on the T5 family, ranging from 20M to 710M parameters, trained on a large collection of public datasets plus a synthetic corpus generated via Gaussian processes (same paper, weight 0.81).

Implementation specifics from primary sources: Chronos-T5 models use a vocabulary of 4096 tokens compared to 32128 in the original T5, and add two special tokens, PAD and EOS, for padding/missing values and end-of-sequence (https://huggingface.co/amazon/chronos-t5-large, weight 0.81; https://www.amazon.science/blog/adapting-language-model-architectures-for-time-series-forecasting, weight 0.82).

Benchmark behavior, from the paper: Chronos models significantly outperform other methods on datasets that were part of the training corpus, and have comparable and occasionally superior zero-shot performance on new datasets relative to methods trained specifically on them, over a 42-dataset benchmark (weight 0.81).

## Moirai 2.0 (Salesforce, arXiv:2511.11698)

Moirai 2.0 (submitted 12 Nov 2025, revised Feb 2026) is the compression route: a decoder-only time-series foundation model trained on a new corpus of 36M series, adopting quantile forecasting and multi-token prediction (paper page: https://arxiv.org/abs/2511.11698, ground source). It deliberately replaces the Moirai 1.0 design: masked-encoder training, multi-patch inputs, and mixture-distribution outputs give way to a simpler decoder-only architecture, single patch, and quantile loss; ablations credit the decoder-only backbone plus recursive multi-quantile decoding for most of the gains (same paper, ground source).

Claims from the abstract: on Gift-Eval it ranks among the top pretrained models with a strong accuracy/speed/size tradeoff; it is twice as fast and thirty times smaller than Moirai 1.0-Large while performing better; performance plateaus with parameter count and declines at longer horizons (same paper, ground source).

## Lag-Llama (arXiv:2310.08278)

Lag-Llama is a general-purpose foundation model for univariate probabilistic time-series forecasting built on a decoder-only transformer that uses lags as covariates; it is pretrained on a diverse corpus and shows strong zero-shot generalization, and reaches state-of-the-art when fine-tuned on small fractions of unseen datasets (paper: https://arxiv.org/abs/2310.08278, weight 0.82; repo https://github.com/time-series-foundation-models/lag-llama, weight 0.81). The repo describes it as a probabilistic model that outputs a probability distribution for each timestep to be predicted, and recommends benchmarking zero-shot performance on your own data before adopting it (same repo, weight 0.81).

## TimesFM (Google)

TimesFM takes the third route: neither language tokens nor lag features, but value patching into a decoder-only attention model (see doc 02). The lineage facts that matter for comparison: v1 pretrained on 100B real-world time points (https://research.google/blog/a-decoder-only-foundation-model-for-time-series-forecasting/, weight 0.60); 2.0 is 500M with 2048 context; 2.5 is 200M with 16k context and an optional 30M quantile head (https://github.com/google-research/timesfm, weight 0.60); 3.0 is multivariate with covariates and reported rank 1 among foundation models on GIFT-Eval, rank 1 on fev-bench and the TIME benchmark (same README, weight 0.60).

## Comparison axes that the sources actually support

| Axis | TimesFM | Chronos | Moirai 2.0 | Lag-Llama |
|---|---|---|---|---|
| Input representation | 32-point value patches | scaled + quantized tokens (4096 vocab) | single patch, decoder-only | lags as covariates |
| Backbone family | decoder-only attention | T5 family, 20M-710M | decoder-only | decoder-only transformer |
| Probabilistic output | 2.0: experimental uncalibrated quantile heads; 2.5: optional 30M continuous quantile head; 3.0: 9 quantiles | probabilistic pretrained models (paper framing) | quantile forecasting with quantile loss | distribution per timestep |
| Headline pretraining scale | 100B time points (v1 blog); 400B+ (Cloud blog, 2.0 era) | public corpora + GP synthetic | 36M series | large diverse corpus |
| Benchmark posture | v1: zero-shot near per-dataset SOTA; 3.0: rank 1 among FMs on GIFT-Eval | in-corpus dominance, comparable zero-shot | among top pretrained on Gift-Eval | strong zero-shot, SOTA after fine-tuning |

## Gaps in this doc

- Tiny Time Mixers (TTM) was named in the corpus request, but no weighted source in this run's dig archive covers it. It is recorded as a gap rather than described from memory.
- GIFT-Eval leaderboard placement details beyond the TimesFM 3.0 claim and the Moirai 2.0 "among the top pretrained" claim are handled in doc 05, which is where the protocol is documented.

## Sources considered

| Source | URL | Type | Weight |
|---|---|---|---|
| Chronos paper | https://arxiv.org/abs/2403.07815 | primary (paper) | 0.81 |
| Chronos paper HTML | https://arxiv.org/html/2403.07815v1 | primary (paper) | 0.83 |
| Chronos-T5 large card | https://huggingface.co/amazon/chronos-t5-large | primary (model card) | 0.81 |
| Amazon Science blog (Chronos) | https://www.amazon.science/blog/adapting-language-model-architectures-for-time-series-forecasting | primary (blog) | 0.82 |
| Moirai 2.0 paper | https://arxiv.org/abs/2511.11698 | primary (paper, ground source) | direct fetch |
| Lag-Llama paper | https://arxiv.org/abs/2310.08278 | primary (paper) | 0.82 |
| Lag-Llama repo | https://github.com/time-series-foundation-models/lag-llama | primary (repo) | 0.81 |
| TimesFM v1 blog | https://research.google/blog/a-decoder-only-foundation-model-for-time-series-forecasting/ | primary (blog) | 0.60 |
| timesfm README | https://github.com/google-research/timesfm | primary (repo) | 0.60 |
| Chronos forecasting repo | https://github.com/amazon-science/chronos-forecasting | primary (repo) | 0.43 |
| Moirai 1.0 card (context) | https://huggingface.co/Salesforce/moirai-1.0-R-large | primary (model card) | 0.44 |
| Benchmarking survey (MDPI) | https://www.mdpi.com/2813-0324/11/1/32 | third-party journal | 0.33 |
