# 02. The inventory of hard-coded admitted:false flags and their decomposition

Scope: the inventory of hard-coded admitted:false flags (axis-trial, spectra card, radius profile, rayleigh) and their decomposition: which parts became trials and which parts stay permanently not admitted.

Program-specific statements derive from the instrument's trial record of 2026-09-19 (yubiOS refs/admission-trials-2026-09-19.md). External claims are cited inline with jev weight; weights below 0.5 are labeled weak backing. Note: even after one dig redo, this subtopic's external literature is thinner than the others; several claims carry moderate or weak weights and are labeled as such.

## The inventory

Four items carried a hard-coded `admitted:false` before the change, and the record decomposes each into a part that became a trial and a part that did not:

1. The axis-redundancy endpoint (`POST /api/map/axis-redundancy`, axis-trial/1) returned a constant `admitted:false`. It is now computed: a second independent null seed, non-degenerate nulls, reproducible per-axis verdicts, certified margins, and N >= 100.
2. The spectra card present in every map (`map.spectra.admitted:false`, phrased as "NOT admitted as homology, and not admitted as evidence about the corpus") kept its flag, because it denies homology and physical readings, which stay permanently not admitted. The statistical admission of the S-squared Parseval shares E0 through E3 and the even/odd blocks became a trial inside `POST /api/map/admission`.
3. The radius profile (`bounds.validated:false, certified:false`) kept its flags, because those describe caller-supplied perturbation assumptions. The I(r) counts on the fixed grid got their own trial in the unified call; the operative radius stays 0.095 and the grid is never reselected.
4. rayleigh/1 was already computed since PR #252 and is unchanged, delegated inside the unified call.

## Why the constants existed

A hard-coded value is a code smell: a number or flag embedded in code with no explanation, where only context carries meaning and the context is often not enough (codesmells.org, weight 0.539). The same failure pattern is documented for machine-learning code, where hardcoding arbitrary values such as hyperparameters or preprocessing parameters directly into code makes the code fragile (Plain English.io, weight 0.141, weak backing). The honest reading of the pre-change inventory is that the instrument did not yet know how to compute its own admission criteria, so it refused everything by constant. That is safe but uninformative: the flag carries no evidence either way.

## The split between statistical and physical readings

The decomposition is not "compute everything". Two items stay permanently not admitted, and the record is explicit about why. The spectra card denies homology and physical readings: a statistical share cannot establish that a corpus structure is homologous or physical, because correlation alone does not establish causation or mechanism; statistical relationships between variables do not by themselves identify an underlying cause (Australian Bureau of Statistics, correlation and causation, weight 0.692; JMP, correlation vs causation, weight 0.537; Wikipedia, correlation, weight 0.531). The philosophy of statistics literature makes the same distinction at a higher level: one of the central roles of statistics is to characterize what the evidence in collected data says about scientific questions, which is a statement about evidence, not about the physical world being evidenced (MDPI, the concept of statistical evidence, weight 0.635).

The radius bounds stay constant because they are caller-supplied: `bounds.validated:false` describes the caller's perturbation assumptions, which no amount of internal computation can certify. Data can speak about data-derived quantities, the I(r) counts on the fixed grid; they cannot certify an assumption someone else supplied. This aligns with the evidence literature's point that data function as evidence only relative to a question they can actually address (PMC, data as evidence, weight 0.577).

## What the decomposition buys

After the change, each block's admission is per frame and per statistic, with recorded criteria, why_not reasons, per-statistic observed values, two null tails, null non-degeneracy, verdict reproducibility, seeds, and margins. A reader can see not only whether a block was admitted but exactly which criterion failed. The record also fixes what admission cannot buy: no transfer across frames, no ranking, no radius change, no edit decisions.

## Sources

Primary (weight >= 0.5): ABS correlation and causation (0.692), MDPI statistical evidence (0.635), PMC data as evidence (0.577), JMP correlation vs causation (0.537), Wikipedia correlation (0.531), codesmells.org magic number (0.539). Weak backing (weight < 0.5): SAGE journals clinical versus statistical significance (0.496), GitHub AvoidMagicNumbers demo (0.265), flyriver magic number (0.192), Plain English ML code smells (0.141).
