# 02 - When to use, interfaces, and constraints

Scope: the use and non-use conditions, the five subcommands and their outputs, the input contract, and the hard constraints that bound every run.

Source of record: yubi-OS/yubiOS skills/curved-corpus-create/SKILL.md. The statistical vocabulary (power, false positive rate) is grounded by a dig; those results came back weak and are labeled as weak backing below.

## When to use

The source doc lists six trigger conditions [source doc]:

- Before believing any V2, gate, or residual number from the regime. The number is meaningless without the null it is standardized against.
- When you need statistical power, not just a point estimate. Power is the probability of detecting an effect that is really there; a point estimate alone cannot tell you what your pipeline would miss [weak backing: https://en.wikipedia.org/wiki/Statistics, jev weight 0.25].
- When a measurement pipeline changes and you need a regression test with a known answer.
- When placing a real corpus among reference families rather than narrating "compatible with X".
- When you need lens-format patch generation, where each suggested improvement is a measurable experiment with hypothesis plus delta plus verdict.
- The trigger phrases the doc records include: planted signal, synthetic corpus, ground truth, null model, curveball, false positive rate, statistical power, detection threshold, is this signal real, calibrate V2, standard candle, positive control, is this X, lens-format patches, new ideas scheme [source doc].

## When NOT to use

Four exclusions, each pointing at the owning skill [source doc]:

- Measuring an existing corpus whose pipeline you already trust: use hyperspherical-harmonic-curve, or the measure subcommand here for the null-standardized version.
- Running an improvement loop: use rsi-phi-skill.
- Lens-format RSI patches specifically: use curve-compass-skill's lens subcommand.
- Non-binary data: the input must be a binary N x d incidence or coverage matrix.

## Inputs and outputs

Input is either nothing (pure generation) or a JSON file containing an N x d binary matrix, as a bare list-of-lists or as {"matrix": [[0,1,...], ...]} [source doc].

| Subcommand | Output |
|---|---|
| generate | corpus JSON: {schema, params, matrix}; params carry the full generative truth (kind, amplitude, modes, seed, K) |
| measure | V2, eigenvalues, r_eff, Shannon rank, mean off-diagonal rho, row-mass stats, Otsu bimodality, column marginals, PC1+PC2, design condition/rank, sphere-fit R^2, chordal residuals, Y_3^3 probe, and per-null {V2_mean, V2_sd, dV2, dV2z} |
| calibrate | lens-format calibration pack (v1.1.0): one lens per amplitude with hypothesis + method + parameters + delta + verdict + score + caveat |
| place | lens-format IS-THIS-X placement (v1.1.0): one lens per class |
| lens | lens pool that drives the patch generator; each file gets a lens with verdict based on measured coverage |

All five output rows are quoted from the source doc's Outputs table [source doc].

## Constraints

Six hard constraints bound every run [source doc]:

1. LOCAL ONLY: no network, no GitHub, no Linear, no external API.
2. stdlib + numpy only: no scipy, sklearn, pandas, or matplotlib.
3. The corpus format is binary {0,1}^(N x d); continuous data must be binarized with a stated rule.
4. The curveball trade count defaults to 5N; raise it for very sparse or very dense matrices.
5. --legacy-k is compatibility-only and warns on stderr.
6. Lens-format output carries its own experimental design; the lens is the measurement, not prose about the measurement.

## Example invocations

The source doc's examples 1 and 2 show the shape of a standard-candle round trip [source doc]:

```bash
python3 scripts/create_corpus.py generate \
    --kind planted -N 200 -d 9 --amplitude 1.5 --modes 2 --seed 11 \
    --out /tmp/planted.json

python3 scripts/create_corpus.py measure \
    --matrix /tmp/planted.json --reps 200 --seed 3
```

and, for a null corpus that must stay quiet:

```bash
python3 scripts/create_corpus.py generate --kind null -N 200 -d 9 --seed 12 \
    --out /tmp/null.json
python3 scripts/create_corpus.py measure --matrix /tmp/null.json --reps 80
```

The planted run reports V2 = 0.4477, r_eff = 6.837, sphere_r2 = 0.4330, chordal_resid_mean = 0.5509, PC1+PC2 = 0.4474 with gate_pass=true, design_numrank = 16, design_cond = 1.006, and curveball V2_mean = 0.2864, V2_sd = 0.0091, dV2 = +0.1613, dV2z = +17.67 [source doc]. The null run reports V2 = 0.2850 and dV2z = -0.116 [source doc]. This is the interface in miniature: one planted corpus, one matched null, two measure calls, and the contrast between dV2z = +17.67 and dV2z = -0.116 is the entire decision.

## Where NOT to use points, in practice

The exclusion for non-binary data matters because the corpus format is binary {0,1}^(N x d); continuous data must be binarized with a stated rule [source doc, constraints]. A stated rule means the binarization is recorded, not silent: an unstated threshold makes the planted truth and the measurement pipeline disagree about what the data is.
