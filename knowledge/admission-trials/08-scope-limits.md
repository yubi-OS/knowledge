# 08. What admission does not claim

Scope: what admission does not claim: per-frame and per-statistic scope with no transfer, no ranking or edit decisions, no radius change, the K=40 resolution floor (nothing below 1/41), and physical readings permanently excluded.

Program-specific statements derive from the instrument's trial record of 2026-09-19 (yubiOS refs/admission-trials-2026-09-19.md). External claims are cited inline with jev weight; weights below 0.5 are labeled weak backing.

## The scope of an admission is one frame and one statistic

Admission is per frame and per statistic; none of it transfers. An admitted spectra share on map 436 licenses reporting that share as an instrument reading on 436. It licenses nothing on map 78, nothing about the same share on a future frame, and nothing about any other statistic. This narrowness is the point. Mechanistic evidence, the kind that would support a physical or homology claim, draws on collective evidence from different lines of research rather than individual studies (Experimental Physiology, Wiley, weight 0.867). A single frame's statistical exclusion is not that kind of evidence: the philosophy of mechanistic evidence argues that mechanistic evidence differs in kind from correlational evidence, and that statistical association alone cannot supply mechanism (Synthese, ScienceDirect, weight 0.637). The trial framework encodes the distinction structurally: physical readings of the spectra card are listed in `permanently_not_admitted`, and no amount of statistical admission changes them.

## Admission does not rank, decide, or move anything

The record's negative list is explicit: an admitted statistic cannot be used as a ranking term, as a radius, or as a keep/revert rule. The radius stays at 0.095 and the grid is never reselected, regardless of what the trials say. The caller-supplied bounds stay unvalidated because they are assumptions, not measurements. In model terms, statistical models describe relationships in data, while mechanistic models carry parameters with actual physical meaning; the latter is what would be needed to set a radius from evidence, and the trials do not provide it (Cytiva, mechanistic versus statistical models, weight 0.476, weak backing). The decision layer (the cycle flow of pre-register, author toward joins, preview plus placement, frozen check, commit, after-map with transition guard) sits upstream and downstream of the trials, and the trials feed it no authority.

## The K=40 resolution floor

K=40 null draws resolve nothing below 1/41. With 40 draws, the null tails can only place a statistic into one of 41 or fewer probability positions, so any true tail probability smaller than about 0.0244 is unresolvable; counts and z are descriptive at this resolution. This is the same structural limit that the small-probability literature describes: when the event of interest is small, the sample must be very large to observe it with high probability, and for most events the observed counts are small in finite samples (University of Washington statistics lecture notes on small probabilities, weight 0.657). Instrument science has a canonical name for the analogous bound: the Rayleigh criterion states that two images are just resolvable only when the center of one diffraction pattern falls on the first minimum of the other, so diffraction sets a hard resolution floor (LibreTexts, limits of resolution: the Rayleigh criterion, weight 0.819). The trial framework's K=40 floor is that kind of bound: not a tuning knob but a property of the instrument, and any claim requiring finer resolution than 1/41 is outside what the trial can say.

## What remains permitted

The record closes with what admission does license: reporting the block's statistics as instrument readings on that frame, with the block's criteria, why_not reasons, per-statistic values, null tails, seeds, and margins attached. The individual endpoints still work and agree with the unified call because they share the same recipe. The flow places the admission call twice per round, once after the positive control and once at round close, where the summary and any block that flipped between rounds are reported. A flipped block is information: between one round's close and the next, a statistic moved from reproducible to seed-fragile or the reverse, and the framework reports the flip rather than hiding it in an aggregate.

## Sources

Primary (weight >= 0.5): Experimental Physiology mechanistic research (0.867), LibreTexts Rayleigh criterion (0.819), Synthese mechanistic evidence (0.637), University of Washington small probabilities lecture (0.657). Weak backing (weight < 0.5): Cytiva mechanistic versus statistical models (0.476), Scribbr choosing statistical tests (0.329), John D Cook statistical versus legal evidence (0.239).
