# 03. Finalist Stress-Test

**Scope:** Finalist stress-test: detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-oracle-solo-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/hierarchy-oracle-solo-2026-10-06.md, no external web dig

## Why stress-test a finalist

The solo log runs one structured critique on the winner before accepting it. Ideate-solo has no human in the loop to push back, so the stress-test plays that role: name the strongest objection, name a second-order effect, and name any untestable bet.

## Critique 1: a 1-parameter read of a rich spectrum

The log states the strongest critique plainly: a counting exponent over a pinned window is a **1-parameter read of a rich spectrum**. The log-periodic modulation that Fukushima-Shima found in exact gasket spectra gets averaged away by a global fit.

This is a fair objection. A power-law fit N(omega) proportional to omega^alpha compresses an entire eigenvalue sequence into one number. If two different structures share an exponent but differ in their fine modulation, the fit cannot tell them apart.

### The answer, in two parts

1. **The wiggle becomes a pre-registered SECONDARY gate.** The instrument tests for oscillation presence over the pinned window. It does not try to fit the oscillation, only to detect it. The later SPEC implements this as `log_periodic: {present, method: "residual-octave-alternation"}` and gold row 8.
2. **The full series lands in the run row.** The fit reduces the series to an exponent, but the raw series is stored. Band definitions can be refined later without losing data.

The log notes this is the same pattern the router regime chose: store the raw measurement durably and treat band definitions as revisable policy over that data.

## Critique 2: the second-order effect

Once the spectral instrument exists, **every graph-shaped feature space** becomes oracle-readable via its Laplacian. The log lists embeddings, corpora, and lead graphs as examples.

The log's compact phrase: the multimodal entry is **1D, not 2D**. The route to arbitrary feature spaces is not through images (2D geometry) but through ordered 1D series (eigenvalues of a graph Laplacian). Any feature space that can define a neighborhood graph can produce a Laplacian, and any Laplacian has an eigenvalue sequence the series mode can read.

This is framed as an effect, not a risk, but it carries an implied obligation: a new graph builder for a new feature space is itself an extractor and, under V6's certification principle, must pass the consistency check on the gold family before its readings are trusted.

## Critique 3: untestable bets

The log's answer: **none**. The gold corpus is exact math (gasket eigenvalues, lattice bands), so the falsification harness is closed-form.

Every load-bearing claim in the winner can be checked against a value known in advance:

| Claim | Check |
|---|---|
| counting exponent recovers d_s on gasket | exact gasket eigenvalues |
| d_s = 1 on a chain, 2 on a lattice | analytic bands |
| exponent depends on order | permutation null must collapse |
| log-periodic wiggle present on gasket | presence test on exact spectrum |

Because the expected values are derived rather than measured, there is no circularity: the harness does not calibrate the instrument against its own earlier output.

## What the stress-test did not address

The stress-test is scoped to the instrument's measurement validity. It does not address:

- **Human-preference questions** (whether a hierarchy reading means anything aesthetically). The oracle is a consistency instrument, not a taste axis.
- **Cost and feasibility of the gold eigen-solve** at larger gasket levels; the companion one-pager lists that as an open question.
- **The symmetry centering hazard**; it is recorded separately as an evolution record (doc 04).

## Verdict

The finalist survived: the strongest critique has a structural answer (secondary gate plus raw-series storage), the second-order effect broadens the oracle's reach rather than undermining it, and the harness has no untestable bets because its gold values are closed-form.
