# The frozen task check: geometry proposes, the check disposes

Scope: taskcheck_refs.sh and its checks C1 through C7, why the keep gate is a mechanical checker rather than a judgment, how C7 enforced charters, and the add-check subset from refs8.

## The rule

The keep gate of a unit round is the frozen task check, taskcheck_refs.sh, with checks C1 through C7. The flow's formulation is explicit: geometry proposes, the check disposes (source doc, design decision 5). The corpus geometry (the lens, the curve, the rungs) can propose any change it likes; only a passing task check makes the change keepable. Refs6 re-authored the frozen task check in-repo, so the checker lives with the corpus it gates rather than as an external artifact (source doc, refs6).

## Why a mechanical gate

A mechanical checker enforces a written standard without negotiation. The unit-round flow needs exactly that because the proposing instrument is itself statistical and can be wrong: a rung join may look good on the curve and still violate a charter rule. The check is the non-statistical backstop.

This matches how quality gates are designed in CI/CD practice: measurable gates catch defects early, enforce standards, and reduce production risk by converting opinions into pass/fail criteria (https://beefed.ai/en/quality-gates-ci-cd-design-best-practices, w0.326, weak backing). Linting practice says it more sharply: automated style enforcement shifts the conversation from "I think this is wrong" to "the linter flagged this, here is the rule and why we have it" (https://stevearrants.substack.com/p/automated-linting-and-consistency, w0.398, weak backing). Linters are aimed at preventing bugs by banning specific patterns that are both considered harmful and detectable in an automated manner (http://blog.robertconrad.us/2015/04/build-tooling-discussions-part-ii-style.html, w0.391, weak backing). A 40-page style guide is useless if nobody follows it; automated enforcement is what makes it real (https://editforge.polsia.app/blog/style-guide-enforcement-software.html, w0.224, weak backing; weak, but the point is corroborated by the Drake tooling practice below). Projects like Drake maintain dedicated tooling lists for ensuring code abides by the style guide, with each check runnable mechanically (https://drake.mit.edu/code_style_tools.html, w0.599). Conformance checking as a discipline goes beyond what older schema validators could express, checking constraints the grammar alone cannot state (https://hsivonen.fi/thesis/html5-conformance-checker, w0.244, weak backing).

## C7 and charter enforcement

Refs7 demonstrated the design's payoff: taskcheck C7 mechanically enforced charters. Charters (the written rules a corpus change must honor) stopped being review-time judgments and became a check with an exit code. The round's record shows the mechanism working in anger: refs7 was the first corrected-gate round, and its pre-registered revert of refs6's merged keep was the round's keep, with the task check as the gate that adjudicated it (source doc, refs7).

## The add-check subset

Refs8, the first structure-level round, defined the add-check subset: the subset of the C1-C7 checks that applies when the change is an addition (a new corpus item or structure element) rather than a modification (source doc, refs8). Not every check is meaningful for every change type; a change that adds rows cannot violate a rule about editing existing rows. Encoding the subset prevents two opposite failures: running irrelevant checks that fail spuriously, and skipping relevant ones by forgetting which apply.

## The schema-gate variant

The same design is now common in agentic pipelines: a continuous schema conformance gate prevents regressions from reaching production by checking structured outputs against a schema before acceptance (https://inferensys.com/train/synthetic-enterprise-workflow-data-for-agent-testing/structured-output-and-json-s, w0.155, weak backing). The unit-round flow anticipated the pattern: the task check runs before the keep is recorded, and a failed check ends the round with no keep, regardless of what the geometry wanted.

## Where the check sits in the flow

Ordering matters. The task check runs after the change is applied and re-scored, and before the round record is written: a passing check is a precondition for a keep entry, not a post-hoc justification (source doc, runflow). Combined with pre-registration (doc 04) and the gate statistic (doc 03), the keep decision is therefore fully determined by artifacts written before the verdict was known. That is what makes a round auditable after the fact: every gate input is on the record, and the verdict is a pure function of them.
