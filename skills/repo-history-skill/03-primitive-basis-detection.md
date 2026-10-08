# 03 - The 9-D Primitive Basis and Detection Patterns

**Scope.** The per-corpus binary feature basis that turns each archive item into a 9-bit coverage vector, the regex detection patterns that compute it, and the near-constant filter that decides which primitives survive to become axes of variation.

This is an internal-record subtopic: every substantive fact comes from the source doc, `yubi-OS/yubiOS skills/repo-history-skill/SKILL.md`. No searXNG dig was run; the detection patterns are corpus-specific records of one repo's event stream, not web-shaped knowledge. (Internal-record subtopic, no dig.)

## The nine primitives

The source doc defines the initial basis, one binary flag per item, computed on body and title text plus API fields:

| # | Primitive | Detection pattern (summary) |
|---|---|---|
| p0 | has_purpose | Summary/What/Goal/Intent/Problem Statement headings, or feat:/fix:/chore:/docs: prefixes on commits |
| p1 | has_sha | 40-hex SHA regex |
| p2 | has_pr_ref | PR #N, pull/N, or a github.com pull URL |
| p3 | has_linear_ref | OMN-N or a linear.app URL |
| p4 | has_state_progression | state field changes across snapshots, or terminal states for fresh items |
| p5 | has_author | author.login (GitHub) or createdBy.name (Linear) present |
| p6 | has_cross_corpus_link | at least two of git-side and linear-side joined via p2/p3 |
| p7 | has_evidence | 3+ digit number, verified, PASS, measured, run #N, or a 7-hex commit ref |
| p8 | has_temporal_anchor | an ISO-8601 parseable timestamp present |

The regexes ship in the source doc's Detection Patterns section as an initial, evolving set. Cycle 2 broadened three of them: `has_linear_ref` accepts `OMN[-_]` separators and URL-decoded paths; `has_cross_corpus_link` dropped the same-line constraint using lazy matching with re.DOTALL; `has_temporal_anchor` accepts ISO-8601 without the T separator or Z suffix and bare YYYY-MM-DD dates. Cycle 2 also tightened `has_state_progression` to require moving states only, after cycle 1 over-matched static state words on every item (source doc).

## The near-constant filter

A primitive whose coverage is above 90% or below 10% is near-constant and drops from the basis; the survivors become the axes of variation across the corpus. The source doc's verification checklist requires at least 3 of 9 primitives to survive the filter. The cycle-1 NSS re-map is the audit that decides survival, and the per-corpus basis is replaceable per the granularity rule (source doc).

## Cycle 0: the predicted derivation

On the recent PR window (PRs #159 to #195, 37 PRs) the source doc measured: p0 91.9%, p1 83.8%, p2 78.4%, p3 86.5%, p4 94.6%, p5 100%, p6 51.4%, p7 75.7%, p8 100%. The prediction was 5 survivors (p1, p2, p3, p6, p7) and 4 drops (source doc).

## Cycle 1: the measured correction

The live API measurement on 2026-08-07 (N=34 PRs, full bodies fetched individually) overturned the prediction: `has_purpose` 26.5%, `has_sha` 11.8%, `has_pr_ref` 55.9%, `has_linear_ref` 0.0%, `has_state_progression` 100%, `has_author` 100%, `has_cross_corpus_link` 0.0%, `has_evidence` 100%, `has_temporal_anchor` 0.0%. Only 3 of 9 survived (source doc).

The honest correction recorded in the source doc: 6 primitives dropped instead of 4, and 2 of them (`has_linear_ref`, `has_cross_corpus_link`) dropped for constant-zero reasons, which are regex false-negatives, not absence of signal. Cycle 2 fixed 3 of the 3 broken patterns (has_purpose +44.1 points, has_sha +88.2 points, has_temporal_anchor +91.2 points on the same 34-PR window) and the residual 0% readings were re-attributed to repo workflow convention in cycle 3 (source doc).

## Why this matters

The basis is the corpus's coordinate system. A wrong basis shows up as two specific red flags: PC1+PC2 below the 0.40 gate, or a sparse-cell count above 50% of the corpus. Both point at near-constant primitives to re-derive (source doc, Red Flags). The lesson encoded here is that a 0% or 100% coverage number is always a measurement to interrogate first: it can be a genuine structural limit of the corpus or a broken detector, and the cycle-1 to cycle-3 record shows both happening at once.
