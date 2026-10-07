# The 12-axis sweep

Scope: what the twelve axes are, what each one captures about a target skill file, and how the sweep turns a file into a gap map before any recursive-self-improvement cycle runs.

Primary source of record: yubi-OS/yubiOS skills/negative-skill-space/SKILL.md (cited below as "source doc").

## What the sweep is

The negative-skill-space (NSS) skill performs a 12-axis qualitative sweep over a target file: Audience, Inputs, Outputs, Mode, Assumption set, Adjacent problems, Failure modes, Lifecycle, Composition, Knowledge sources, Calibration, Recursion (source doc). The sweep is a gap-mapping instrument: it does not edit the target file and it does not score improvements numerically. Its output is a set of gap candidates, 5 to 10 Extend gaps per target file, that are handed to the next stage of the pipeline as a constraint set (source doc).

The skill's role in the parent Stage 3 dispatch is upstream gap-proposer, not gap-closer (source doc, 2026-08-06). That division of labor is the core design decision: a qualitative sweep is good at naming what is missing and bad at proving that a proposed edit improves the corpus, so NSS proposes and the atom disposes.

## What each axis captures

The axes split a file's quality surface into twelve independent questions. Each question answers whether the file covers a dimension a consumer of that file needs:

1. Audience: who the file is for (operator, developer, end-user, CI, maintainer) and whether the file serves that reader's arrival paths.
2. Inputs: what the file or the workflow it documents needs (arguments, configuration, environment, prerequisites) and what happens when an input is missing.
3. Outputs: what the workflow produces (streams, exit codes, files, side effects) and whether the output contract is stated.
4. Mode: execution breadth (interactive vs batch, dry-run, daemonized, one-shot) and idempotency semantics.
5. Assumption set: caller obligations, runtime invariants, platform and dependency assumptions the file silently relies on.
6. Adjacent problems: the problem family around the file's focal problem and the alternative solutions that address the same need.
7. Failure modes: error cases, edge cases, partial-failure scenarios, and recovery-vs-detection coverage.
8. Lifecycle: versioning, changelog, deprecation state, migration guidance for the thing the file describes.
9. Composition: how the file composes with others (dependencies, callers, integration points, module boundaries).
10. Knowledge sources: citation patterns, cross-references, prior-art grounding, and freshness of the file's claims.
11. Calibration: whether the file's claims, thresholds, and verdicts are calibrated against measured reality rather than asserted.
12. Recursion: whether the file documents its own evolution and feeds lessons back into the next cycle.

The 12-axis list is fixed in the source doc's description and repeated in its pipeline section. The sweep's value is orthogonal coverage: a file can be strong on Inputs and silent on Failure modes, and only an axis-by-axis pass makes that hole visible.

## How the sweep runs

The sweep is applied per target file, not per corpus. Per file it produces 5 to 10 Extend gaps (source doc). Each gap is a qualitative statement of the form "this file lacks X along axis Y", not an action. The action decision happens downstream: the atom (single-action-curve-rsi) selects 1 atomic action per file by geodesic-only criterion on the S^2 parameter manifold, and it is the only Δ source in the pipeline (source doc).

Because the sweep's output enters the atom as hints inside a constraint set, a gap that the atom cannot turn into a positive-Δ edit simply stays unselected. The sweep therefore over-proposes by design: breadth first, selection second.

## External analogues

The sweep's axes have recognizable relatives in the wider documentation-quality literature, though the sweep itself is defined only by the source doc. Documentation audits in the wild check structure, coverage, factual accuracy, and maintainability (github.com/levnikolaevich/claude-code-skills ln-21-documentation-auditor, weight 0.31, weak backing). Failure mode enumeration is a standard engineering practice: FMEA scores severity, occurrence, and detection for each failure mode before prioritizing action (learnleansigma.com/guides/fmea, weight 0.24, weak backing). Gap analysis, in the business-process sense, examines the distance between how a system is documented and how it operates (smartsheet.com/gap-analysis-method-examples, weight 0.25, weak backing; linkedin.com QMS gap analysis, weight 0.16, weak backing). These are weak-backed contextual anchors, not sources for the sweep's own design; the axes as a fixed 12-item set come from the source doc alone.

Documentation itself is any communicable material used to describe, explain, or instruct about an object (en.wikipedia.org/wiki/Documentation, weight 0.28, weak backing). The sweep treats a SKILL.md as that object and asks the twelve questions of it.

## Why qualitative, before RSI

The sweep sits before any numeric machinery. Its judgments are verbal ("this file has no audience signal", "the outputs contract is missing") and its taxonomy (Extend, Pair, Accept) filters performative gaps and intentional narrow scope out of the candidate set (source doc). Only after that filter do the remaining gaps meet the geometric selection layer. The ordering matters: a numeric criterion cannot rank gaps it was never offered, and a qualitative sweep cannot guarantee that acting on a gap improves anything. The pipeline keeps each instrument where it is reliable.

## Source

- Ground spine: yubi-OS/yubiOS skills/negative-skill-space/SKILL.md (4662 B, fetched 2026-10-07 with User-Agent omni-agent/1.0).
- Dug sources as cited inline, each with its noul weight; weights below 0.5 are labeled weak.
