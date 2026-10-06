# 01 - Standard candle mission

Scope: why curved-corpus-create exists, what it is the inverse of, and its four jobs as the standard-candle factory of the yubiOS curve regime.

Source of record: yubi-OS/yubiOS skills/curved-corpus-create/SKILL.md. This is an internal-record subtopic: the mission is defined by the source doc alone, no external dig was run.

## The generative inverse of the measurement family

Every other skill in the curve family (rsi-phi-skill, hyperspherical-harmonic-curve, single-action-curve-rsi, guided-curve-ideate) measures a corpus and reports a number [source doc]. None of them can say what that number would have been had the structure been known [source doc]. curved-corpus-create closes that hole: it manufactures corpora whose curvature is prescribed by construction, so every measurement in the regime finally has a calibrated ground truth [source doc].

The source doc names this the standard-candle factory [source doc]. The standard-candle idea is borrowed from observational astronomy, where objects of known intrinsic brightness calibrate distance measurements; the corpus below treats the borrowed term as a role, not as a claim about astronomy.

## The four jobs

The skill has exactly four jobs [source doc]:

1. Generate a corpus with a planted S^2 spherical-harmonic curve at a chosen amplitude, N, d, and mode count.
2. Generate matched nulls: curveball (row and column sums preserved), column-permutation, and iid.
3. Emit a calibration pack: signal-recovery curve, false-positive rate, detection threshold.
4. Place any real N x d binary matrix in the IS-THIS-X question space, with exclusion-style verdicts.

Job 1 produces the positive control. Job 2 produces the negative controls. Job 3 answers "would this pipeline detect a signal if one were there, and how often would it cry wolf". Job 4 answers "is this real corpus X" by exclusion rather than by narration.

## What the skill is not for

The source doc draws hard boundaries [source doc]:

- Measuring a corpus you already trust is hyperspherical-harmonic-curve's job, or the measure subcommand here for the null-standardized version.
- Running an improvement loop is rsi-phi-skill's job.
- Lens-format RSI patches specifically (suggested file edits as experiments) are curve-compass-skill's lens subcommand.
- Data that is not a binary N x d incidence or coverage matrix is out of scope entirely.

## Where it sits in the regime

The skill is the generative counterpart inside a family that otherwise only measures. The measurement skills consume corpora; this skill produces the corpora whose answer is known before any pipeline touches them. When a V2 number, a gate, or a residual comes out of the regime, the question "would we have detected the structure if it were planted at amplitude A" is answerable only by running this skill at amplitude A and checking the detection rate [source doc].

That is the whole mission in one sentence: before believing any V2, gate, or residual number from the regime, generate the known answer and measure the pipeline against it [source doc, When to use].

## The one-line contract

The skill's own frontmatter states the contract in one line: generate binary corpora with prescribed curved structure (planted real spherical-harmonic signal on a Fibonacci golden-angle S^2 lattice), matched null corpora, a calibration pack, and an IS-THIS-X placement [source doc]. The description moved out of the frontmatter on 2026-09-17 so that description fits the 1,024-character skill-format limit, with wording unchanged [source doc].

## Why "standard candle"

A standard candle in astronomy is an object whose intrinsic brightness is known, so its observed brightness measures distance rather than luminosity. The skill borrows the role, not the physics: a corpus whose curvature is known by construction turns a pipeline's output into a measurement of the pipeline [source doc]. Run the pipeline on the planted corpus and the answer it produces can be checked against the generative truth recorded in the params field. Run it on a null and the answer is the false-positive rate.

## The failure the skill prevents

Without a ground-truth factory, a measurement regime drifts: numbers are reported, gates are passed, and nothing checks whether the pipeline would have detected a signal it claims to detect. The source doc's When to use section makes this the first trigger condition: before believing any V2, gate, or residual number from the regime, because the number is meaningless without the null it is standardized against [source doc]. The skill exists so that every such number has a calibration path.
