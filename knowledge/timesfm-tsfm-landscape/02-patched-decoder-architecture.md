# 02 - Patched-decoder architecture

Scope: The patched-decoder architecture: input/output patching, patch lengths, autoregressive decoding, positional embeddings, and what changes across versions.

## The core idea

TimesFM is a decoder-only attention model pretrained with patching. From the paper abstract: "Our model is based on pretraining a patched-decoder style attention model on a large time-series corpus" (https://arxiv.org/abs/2310.10688, weight 0.62). Time series values are grouped into contiguous input patches of 32 time points, the decoder attends over the patch sequence, and it autoregressively generates output patches of forecast points (same source, weight 0.62).

The Google Research blog explains the asymmetry between input and output patch lengths: the output patch length can be larger than the input patch length; the paper's worked example uses a 512-point series with input patch length 32 and a larger output patch (https://research.google/blog/a-decoder-only-foundation-model-for-time-series-forecasting/, weight 0.63). A third-party technical overview puts the effective lookback arithmetic on the table: with a patch size of 32, 16k context corresponds to a maximum lookback of 16,384 time steps (https://tsfm.ai/blog/timesfm-google-overview, weight 0.59; third-party, treat numbers there as secondary).

## Patch lengths across versions

- v1 and 2.0: input_patch_len=32 and output_patch_len=128 are fixed load-time hyperparameters for the 500M checkpoint (model card https://huggingface.co/google/timesfm-2.0-500m-pytorch, ground source). The v1 paper PDF shows the same input patch length 32 used in its zero-shot comparison against PatchTST(ZS), which shares the transformer stack hyperparameters and uses input patch 32 with a stride of half the patch (https://arxiv.org/pdf/2310.10688, weight 0.59).
- 2.5: context grows to 16k while parameters shrink to 200M (https://github.com/google-research/timesfm, weight 0.60). The HF 2.5 code example sets max_context=1024 and max_horizon=256 at compile time; those are inference-time configuration values, not architecture constants (model card, ground source).
- 3.0: "TimesFM-3 builds on the proven decoder-only transformer architecture of its predecessors. As in previous versions, we process time series efficiently by grouping contiguous data points into patches of 32 time points" (https://research.google/blog/timesfm-3-a-zero-shot-foundation-model-for-multivariate-forecasting/, weight 0.59). The 3.0 MLX backend documents a global_context of 15,360 with truncation of longer contexts to the most recent points (repo README, weight 0.60).

## Positional embeddings and layer geometry (2.0 500M)

The 2.0 model card fixes these at load time (ground source): num_layers=50, model_dims=1280, use_positional_embedding=False. The explicit `use_positional_embedding=False` is notable: the 500M checkpoint drops the positional embedding that other checkpoints include.

## Inference-time flags that touch the decoder path

From the 2.5 configuration surface (repo configs.py https://github.com/google-research/timesfm/blob/master/src/timesfm/configs.py, weight 0.81):

- `force_flip_invariance`: TimesFM guarantees TimesFM(aX + b) = a * TimesFM(x) + b for a >= 0 by default; this flag extends the invariance to a < 0.
- `fix_quantile_crossing`: addresses quantile collapsing in the output head.
- `normalize_inputs` and `infer_is_positive` (model card example, ground source) normalize the context window and can constrain forecasts to non-negative values.

## What did NOT change

The decoder-only backbone and the 32-point input patch survived every release from v1 through 3.0 (blog 0.59; repo README 0.60). What changed between versions is what wraps that backbone: context length (2048 to 16k to 15,360 truncated global context), the output head (point-only, then an optional 30M quantile head, then native multivariate with 9 quantiles), and the removal of the frequency indicator at 2.5.

## Sources considered

| Source | URL | Type | Weight |
|---|---|---|---|
| TimesFM v1 paper abstract | https://arxiv.org/abs/2310.10688 | primary (paper) | 0.62 |
| TimesFM v1 paper PDF | https://arxiv.org/pdf/2310.10688 | primary (paper) | 0.59 |
| Google Research blog v1 | https://research.google/blog/a-decoder-only-foundation-model-for-time-series-forecasting/ | primary (blog) | 0.63 |
| TimesFM-3 blog | https://research.google/blog/timesfm-3-a-zero-shot-foundation-model-for-multivariate-forecasting/ | primary (blog) | 0.59 |
| google-research/timesfm README | https://github.com/google-research/timesfm | primary (repo) | 0.60 |
| TimesFM 2.0 model card | https://huggingface.co/google/timesfm-2.0-500m-pytorch | primary (model card, ground source) | direct fetch |
| TimesFM 2.5 model card | https://huggingface.co/google/timesfm-2.5-200m-pytorch | primary (model card, ground source) | direct fetch |
| configs.py | https://github.com/google-research/timesfm/blob/master/src/timesfm/configs.py | primary (code) | 0.81 |
| TSFM.ai overview | https://tsfm.ai/blog/timesfm-google-overview | third-party blog | 0.59 |
| Hugging Face Transformers docs (TimesFM) | https://huggingface.co/docs/transformers/model_doc/timesfm | primary (docs) | 0.42 |
