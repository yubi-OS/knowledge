# 06 - The structured-evidence scorer v2 and hysteresis

Scope: the two-stage scorer behind the round-refs3 finding, deterministic regex extraction, one batched decision request per doc, residual jitter, the v2.1 hysteresis rule, and paced matrix scoring.

## Why a low-noise scorer was needed

Source doc: the scorer is "the low-noise scorer that resolved the refs3 finding (free-prose band 6-8x the true effect)". Before it, scoring was noisy enough that the measurement band around an effect was 6 to 8 times wider than the effect itself, which made the sign gate meaningless. The scorer ships as two routes: `/api/jev/corpus/scorer/score` takes `{doc: {name, text}, hysteresis?: {low, high, pre_row}}` and `/api/jev/corpus/scorer/matrix` takes `{docs 1..20, hysteresis?: {pre_rows[]}, spacing_ms?}` for paced batch scoring with a default 4.5 seconds between docs (source doc).

## Stage 1: deterministic extraction

Stage 1 is deterministic evidence extraction per axis using pinned regular expressions, up to 8 lines per axis (source doc). The extraction runs before any model call, so the model never sees the raw document, only the extracted evidence lines plus their counts. The score route returns `{name, row[12], probs, evidence_counts, hysteresis_applied, defapi.consumed}`.

Pinned regexes are the tool the field uses for rule-based extraction: the structured data extractor in the Unstructured library scans partitioned text for named regex patterns and returns an array of matched strings per field (https://docs.unstructured.io/concepts/structured-data-extractor/regex-options, jev weight 0.64). A regular expression is a sequence of characters specifying a match pattern in text, typically consumed by string-searching algorithms (Wikipedia, https://en.wikipedia.org/wiki/Regular_expression, jev weight 0.67). Syntax references for the two ecosystems the scorer spans: JavaScript RegExp (MDN cheat sheet, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Cheatsheet, jev weight 0.94) and .NET (Microsoft quick reference, https://learn.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference, jev weight 0.94). The hybrid-extraction literature is blunt about the trade: pure regex handles canonical formats well and breaks on variation, which is why pipelines pair rules with a model stage (ScrapingAnt on regex-plus-ML pipelines, https://scrapingant.com/blog/regex-plus-ml-hybrid-extraction-for-semi-structured, jev weight 0.03 - weak backing; a practitioner account of regex breaking on 70 percent of invoice variants, https://dev.to/__c1b9e06dc90a7e0a676b/i-spent-a-month-fighting-llms-to-extract-structured-data-19gp, jev weight 0.03 - weak backing). The scorer's design matches that hybrid: regex for what is pinned, one batched decision call for judgment.

## Stage 2: one batched decision request

Stage 2 is ONE batched jev-1.13 request per doc-state: 12 noul questions, threshold p >= 0.5 (source doc). Batching matters for cost and noise: the scorer costs about 0.0002 dollars per call (source doc), and one batched request per doc keeps the decision model's contribution to variance bounded rather than per-axis spread across many calls. The residual jev jitter on probabilities is about plus or minus 0.01 (source doc).

## v2.1 hysteresis: killing threshold jitter

Source doc: "the v2.1 hysteresis rule (flip only if p >= 0.55 / p <= 0.45, else carry the pre-edit row) removes threshold-crossing jitter entirely." The problem it solves: a doc whose axis probability sits near 0.5 flips its bit on tiny re-score noise, so an edit that changed nothing can manufacture a matrix change, and a re-score can silently DROP a marginal pre-edit bit (p in 0.45 to 0.55) while gaining the intended axis, manufacturing a wrong sign.

The mechanism is classic hysteresis: the dependence of a system's state on its history (Wikipedia, https://en.wikipedia.org/wiki/Hysteresis, jev weight 0.65), and in engineering, two separate switching thresholds with a dead band between them prevent false triggering from noise (Schmitt trigger, Wikipedia, https://en.wikipedia.org/wiki/Schmitt_trigger, jev weight 0.65; Britannica on magnetic hysteresis lagging behind the driving field, https://www.britannica.com/science/hysteresis, jev weight 0.81). A Schmitt trigger switches high only when the input rises above the upper threshold and low only when it falls below the lower one; the scorer applies the same shape to probabilities: flip to 1 only at p >= 0.55, flip to 0 only at p <= 0.45, otherwise carry the pre-edit bit.

The cost of hysteresis is a measured incident, not a hypothetical. Source doc, runbook lesson 6 (refs5, 2026-10-03): a plain re-score measured plus 0.6037 on an edit that is plastic-keep at minus 0.4077 under hysteresis in cycle 4 on the same edit. A wrong sign under a plain re-score is therefore provisional until re-measured with hysteresis. Edited-row re-scores always carry `hysteresis: {low: 0.45, high: 0.55, pre_row}` (source doc).

Threshold-ratio arithmetic for such bands is standard electronics practice; a Python utility exposes lower and upper switching points as fractions of the input range for exactly this purpose (TechOverflow, https://techoverflow.net/2026/05/09/how-to-compute-hysteresis-threshold-ratios-in-python-using-uliengineering/index.html, jev weight 0.04 - weak backing).

## Matrix scoring and pacing

The matrix route scores 1 to 20 docs with configurable spacing (default 4.5 seconds) and writes one run row of kind `scorer-matrix` (source doc). Pacing exists because the scorer's stage 2 is an external model call per doc; spacing bounds the request rate and keeps the batch inside the same measurement session. Run rows land in the corpus-runs history with kind `scorer` or `scorer-matrix`, which is what the viscoelastic prony fit consumes later (doc on viscoelastic instruments, source doc).

## Parity and selftest

The scorer is parity-tested byte-identical against the Python source of record (`session/r15/scorer_v2.py`) on the arm64-path-a pre/post states (source doc). The selftest includes the scorer's extraction checks, 92 checks total. Guideline 3 applies as everywhere: run the selftest after any engine-touching deploy before trusting results.

## What the scorer decides

Source doc is explicit about the boundary: "The scorer DECIDES bits; it never authorizes anything and never edits anything." Under this scorer the K-pass protocol becomes verification, not the gate: the plain sign gate returns (keep when the realized delta is negative in the old convention, level-up in the corrected one; doc 04). The scorer is the measurement instrument; the gate and the taskcheck are the decision layer.
