# 04 - The generate algorithm

Scope: the five-step generative pipeline that turns the lattice and basis into a binary matrix with a planted curve at a chosen amplitude.

Source of record: yubi-OS/yubiOS skills/curved-corpus-create/SKILL.md. The Bernoulli-logistic sampling step is grounded by the dig; one primary source came back.

## The five steps

The generate algorithm runs in five steps [source doc]:

1. Build the Fibonacci lattice (x_i, theta_i, phi_i) for i = 0..N-1, using the frozen golden-angle formulas from doc 03.
2. Evaluate the 16 real SH functions at each point. Take the first modes probe channels; channel 0 is always Y_3^3.
3. Standardize each channel to zero mean, unit sd.
4. Apply deterministic column loadings w_kj.
5. Form logits eta_ij = mu + amplitude * sum_k g_k(x_i) * w_kj with mu = logit(base_rate), then sample X_ij ~ Bernoulli(sigma(eta_ij)).

Step 2 fixes the shape of the planted structure: the first modes channels of the real SH basis, always starting with Y_3^3. Step 3 makes each channel comparable in scale so that the amplitude parameter means the same thing across runs. Step 4 decides which columns the curve pushes up or down. Step 5 converts the additive logit into a binary matrix through the logistic link and a Bernoulli draw; the Bernoulli distribution is the standard single-trial binary sampling model [primary source: https://mc-stan.org/docs/functions-reference/binary_distributions.html, jev weight 0.58].

## What the params field must carry

The generate output is {schema, params, matrix}, and params carry the full generative truth: kind, amplitude, modes, seed, K [source doc]. This is the difference between a dataset and a standard candle: the params field is the record that the curve was planted, at what amplitude, in which basis, with which seed. Any downstream measurement can be checked against this record.

## Planted-signal design in context

The generate step is a planted-signal design: ground truth is injected into synthetic data so that detection pipelines can be scored against a known answer. The pattern of building synthetic benchmark data with known embedded structure to test detectors is established practice [weak backing: https://arxiv.org/pdf/2602.07446, jev weight 0.35]. What is specific to this skill is that the planted structure is a spherical-harmonic curve on a Fibonacci lattice, and the nulls are matched to the same N, d, and marginal structure (doc 06).

## Reproducibility contract

Seeds are part of the result [source doc, guideline 9]. The generator is deterministic given (kind, amplitude, modes, seed, N, d, base_rate): same seed, same matrix. A corpus generated without a recorded seed cannot serve as a standard candle, because the planted truth is no longer reproducible.

## Worked example

The source doc's example 1 generates a standard candle and confirms it is detectable [source doc]:

```bash
python3 scripts/create_corpus.py generate \
    --kind planted -N 200 -d 9 --amplitude 1.5 --modes 2 --seed 11 \
    --out /tmp/planted.json
```

With amplitude 1.5, modes 2, N = 200, d = 9, seed 11, the measured result is dV2z = +17.67 against 200 curveball reps [source doc]. The planted curve at that amplitude is overwhelmingly detectable at that size, which is exactly what a positive control should show.

## The null sibling

Example 2 runs the same dimensions with --kind null [source doc]: generate --kind null -N 200 -d 9 --seed 12, then measure at reps 80. The null reports V2 = 0.2850 and dV2z = -0.116 [source doc]. Same N, same d, no planted amplitude: the statistic sits inside the null's own distribution. The two examples together demonstrate the matched design that doc 06 formalizes.

## Kind and the params record

The --kind flag selects planted versus null generation, and the output params carry kind, amplitude, modes, seed, K [source doc]. A params block with kind planted but no amplitude would be self-contradictory; the full generative truth is what makes the corpus checkable later.
