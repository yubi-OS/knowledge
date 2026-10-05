# 01. The admission trial framework: from constants to computed trials

Scope: the admission trial framework: replacing hard-coded admitted:false flags with computed trials behind one unified endpoint, and what admission licenses.

Program-specific statements in this corpus derive from the instrument's own trial record of 2026-09-19 (yubiOS refs/admission-trials-2026-09-19.md). External factual claims are cited inline with the jev weight that backed them; weights below 0.5 are labeled weak backing.

## Why a constant cannot be evidence

Before the change, several diagnostics carried a hard-coded `admitted:false`. A hard-coded flag is a magic number in the audit sense: a value embedded in code with no explanation of its significance, conveying no meaning on its own (codesmells.org, weight 0.539). A constant that says "not admitted" does not measure anything; it merely prevents reporting. The trial record's move is to replace each constant with a computed procedure whose outcome can differ per frame, so the flag becomes the output of a measurement instead of an input baked into the code.

This mirrors a general principle in measurement: a statistical hypothesis test is a method of statistical inference used to decide whether the data provide sufficient evidence to reject a particular hypothesis (Wikipedia, statistical hypothesis test, weight 0.767). To decide something from data, something has to be computed from data. A constant computes nothing.

## What a rejection can and cannot license

The admission logic is exclusion-based, and its logic is deliberately one-sided. A null hypothesis in the statistical sense states that there is no difference between groups or no relationship between variables (Statistics by Jim, weight 0.716). When a test correctly rejects the null, the result is evidence against that hypothesis, and importantly there is no claim that a mechanism has been demonstrated (The Philosophy of Econometrics, chapter 3, Tilburg University Press, weight 0.791). In the trial framework this maps directly: an admitted block is licensed for reporting as an instrument reading on one frame, and nothing more. Admission never upgrades a statistic into a physical claim.

## Why the recipe must be fixed in advance

The unified call runs four trials (rayleigh, axis redundancy, spectra shares, radius profile) with default seeds and returns one summary. The design goal is that the analysis recipe is not chosen after seeing the data. Preregistration serves at least three aims for improving the credibility and reproducibility of research findings, including separating confirmatory from exploratory work (Neuroscience and Biobehavioral Reviews, via ScienceDirect, weight 0.909). Inferences from preregistered analyses are, in principle, more reproducible than analyses that were not preregistered, because the relation between the analysis and the data is fixed before the data are examined (PNAS, the preregistration revolution, weight 0.952).

The trial record fixes the recipe structurally: the endpoints `/api/map/rayleigh` and `/api/map/axis-redundancy` still work but now share the same recipe as the unified call, so there is no alternative analysis path whose selection could depend on the result. This addresses the core hazard of researcher-driven analysis choices, though the literature also warns that preregistration alone does not eliminate selective reporting: a z-curve analysis of preregistered studies found selective reporting was still likely present (Cortex, registered report on preregistration practices, weight 0.879). Hence the trial framework relies on computed criteria rather than on analyst promises.

## The unified call and what admission licenses

`POST /api/map/admission {map_id, K?, null_seed?}` runs the four trials on one stored map and returns `summary` plus, per block, `criteria`, `why_not`, `per_statistic` (observed value, two null tails, `null_nondegenerate`, `verdict_reproducible`), `seeds`, and `margins_preserved`. Admission licenses reporting the block's statistics as instrument readings on that frame. The response also lists what is `permanently_not_admitted`: physical readings of the spectra card, the constants l(l+1), the caller-supplied radius bounds, and any use of an admitted statistic as a ranking term, radius rule, or keep/revert rule.

Two design boundaries matter. First, the spectra card's flag stays: it denies homology and physical readings, which remain permanently not admitted; only the statistical admission of the S-squared Parseval shares became a trial. Second, the radius bounds stay constant because they describe caller-supplied perturbation assumptions, not data-derived quantities; only the I(r) counts on the fixed grid got a trial, and the operative radius 0.095 and grid are never reselected. This split between "what the caller asserts" and "what the data can speak to" is the framework's central distinction.

## Sources

Primary (weight >= 0.5): PNAS preregistration revolution (0.952), Neuroscience and Biobehavioral Reviews preregistration (0.909), Cortex registered report (0.879), Tilburg philosophy of econometrics (0.791), Wikipedia statistical hypothesis test (0.767), Statistics by Jim null hypothesis (0.716), codesmells.org magic number (0.539). Weak backing (weight < 0.5): Simply Psychology null hypothesis (0.491), ScienceInsights NHST (0.505 sits at the boundary and is treated as moderate), COS preregistration overview (0.455).
